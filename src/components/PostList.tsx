import React, { useState, useEffect } from 'react';
import Post, { PostProps } from './Post';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import Spinner from './Spinner';
import { postsApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

interface PostListProps {
    initialFilterMode?: 'userPostsOnly' | 'likedPostsOnly' | 'none';
}

const PostList: React.FC<PostListProps> = ({ initialFilterMode = 'none' }) => {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showUserPostsOnly, setShowUserPostsOnly] = useState(initialFilterMode === 'userPostsOnly');
    const [showLikedPostsOnly, setShowLikedPostsOnly] = useState(initialFilterMode === 'likedPostsOnly');
    const { user } = useAuth();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await postsApi.getAll() as PostProps[];
            // If user is logged in, fetch like status for each post
            if (user) {
                const postsWithLikeStatus = await Promise.all(
                    data.map(async (post) => {
                        const hasLiked = await postsApi.checkLike(post._id, user.id);
                        const likeCount = await postsApi.getLikeCount(post._id);
                        return { 
                            ...post, 
                            likedByUser: hasLiked,
                            likes: likeCount
                        };
                    })
                );
                setPosts(postsWithLikeStatus);
            } else {
                // For non-logged in users, just get the like counts
                const postsWithLikeCounts = await Promise.all(
                    data.map(async (post) => {
                        const likeCount = await postsApi.getLikeCount(post._id);
                        return {
                            ...post,
                            likes: likeCount,
                            likedByUser: false
                        };
                    })
                );
                setPosts(postsWithLikeCounts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();

        // Add event listeners for post updates
        const handlePostDeleted = (event: CustomEvent) => {
            setPosts(prevPosts => prevPosts.filter(post => post._id !== event.detail));
        };

        const handleLikeUpdated = (event: CustomEvent) => {
            setPosts(prevPosts => prevPosts.map(post => {
                if (post._id === event.detail.postId) {
                    return {
                        ...post,
                        likedByUser: event.detail.liked,
                        likes: event.detail.liked ? post.likes + 1 : post.likes - 1
                    };
                }
                return post;
            }));
        };
        
        window.addEventListener('postDeleted', handlePostDeleted as EventListener);
        window.addEventListener('likeUpdated', handleLikeUpdated as EventListener);
        
        return () => {
            window.removeEventListener('postDeleted', handlePostDeleted as EventListener);
            window.removeEventListener('likeUpdated', handleLikeUpdated as EventListener);
        };
    }, [user]);

    const handleSort = () => {
        setSortOrder(prevSortOrder => {
            const newSortOrder = prevSortOrder === 'asc' ? 'desc' : 'asc';
            setPosts(prevPosts =>
                [...prevPosts].sort((a, b) =>
                    newSortOrder === 'desc'
                        ? (b.likes || 0) - (a.likes || 0) || Math.random() - 0.5
                        : (a.likes || 0) - (b.likes || 0) || Math.random() - 0.5
                )
            );
            return newSortOrder;
        });
    };

    const filteredPosts = posts.filter(post => {
        if (showUserPostsOnly && user) {
            return post.owner === user.id;
        }
        if (showLikedPostsOnly && user) {
            return post.likedByUser;
        }
        return true;
    });

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="container my-5">
            {initialFilterMode === 'none' && (
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                    <h2 className="fw-bold text-primary">📸 Latest Posts</h2>
                    <div className="d-flex gap-2 align-items-center">
                        {user && (
                            <>
                                <div className="form-check me-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="userPostsFilter"
                                        checked={showUserPostsOnly}
                                        onChange={(e) => {
                                            setShowUserPostsOnly(e.target.checked);
                                            if (e.target.checked) setShowLikedPostsOnly(false);
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="userPostsFilter">
                                        Show My Posts Only
                                    </label>
                                </div>
                                <div className="form-check me-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="likedPostsFilter"
                                        checked={showLikedPostsOnly}
                                        onChange={(e) => {
                                            setShowLikedPostsOnly(e.target.checked);
                                            if (e.target.checked) setShowUserPostsOnly(false);
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="likedPostsFilter">
                                        Show Liked Posts Only
                                    </label>
                                </div>
                            </>
                        )}
                        <button onClick={handleSort} className="btn btn-outline-primary d-flex align-items-center">
                            Sort by Rating {sortOrder === 'asc' ? <FaSortAmountUp className="ms-2" /> : <FaSortAmountDown className="ms-2" />}
                        </button>
                        <button className="btn btn-success" onClick={() => navigate(`/createNewPost`)}>
                            Create a New Post
                        </button>
                    </div>
                </div>
            )}

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {filteredPosts.map((post) => (
                    <div key={post._id} className="col">
                        <Post {...post} />
                    </div>
                ))}
                {filteredPosts.length === 0 && (
                    <div className="col-12 text-center mt-4">
                        <p className="text-muted">
                            {showUserPostsOnly 
                                ? "You haven't created any posts yet." 
                                : showLikedPostsOnly 
                                    ? "You haven't liked any posts yet."
                                    : "No posts available."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostList;