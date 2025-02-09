import React, { useState, useEffect } from 'react';
import Post, { PostProps } from './Post';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import Spinner from './Spinner';
import { postsApi } from '../api';
import { useNavigate} from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; // Add this import
import 'bootstrap/dist/css/bootstrap.min.css';

const PostList: React.FC = () => {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showUserPostsOnly, setShowUserPostsOnly] = useState(false);
    const { user } = useAuth();


    const fetchPosts = async () => {
        setLoading(true);
        const data = await postsApi.getAll() as PostProps[];
        setLoading(false);
        setPosts(data);
    };

    useEffect(() => {
        fetchPosts();
        // Add event listener for post deletion
        const handlePostDeleted = (event: CustomEvent) => {
            setPosts(prevPosts => prevPosts.filter(post => post._id !== event.detail));
        };
        
        window.addEventListener('postDeleted', handlePostDeleted as EventListener);
        
        return () => {
            window.removeEventListener('postDeleted', handlePostDeleted as EventListener);
        };        
    }, []);

    const handleSort = () => {
        setSortOrder(prevSortOrder => {
            const newSortOrder = prevSortOrder === 'asc' ? 'desc' : 'asc';
            setPosts(prevPosts =>
                [...prevPosts].sort((a, b) =>
                    newSortOrder === 'desc'
                        ? b.likes - a.likes || Math.random() - 0.5
                        : a.likes - b.likes || Math.random() - 0.5
                )
            );
            return newSortOrder;
        });
    };

    const filteredPosts = showUserPostsOnly && user
        ? posts.filter(post => post.owner === user.id)
        : posts;

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h2 className="fw-bold text-primary">📸 Latest Posts</h2>
                <div className="d-flex gap-2 align-items-center">
                    {user && (
                        <div className="form-check me-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="userPostsFilter"
                                checked={showUserPostsOnly}
                                onChange={(e) => setShowUserPostsOnly(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="userPostsFilter">
                                Show My Posts Only
                            </label>
                        </div>
                    )}
                    <button onClick={handleSort} className="btn btn-outline-primary d-flex align-items-center">
                        Sort by Rating {sortOrder === 'asc' ? <FaSortAmountUp className="ms-2" /> : <FaSortAmountDown className="ms-2" />}
                    </button>
                    <button className="btn btn-success" onClick={() => navigate(`/createNewPost`)}>
                        Create a New Post
                    </button>
                </div>
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {filteredPosts.map((post) => (
                    <div key={post._id} className="col">
                        <Post {...post} />
                    </div>
                ))}
                {filteredPosts.length === 0 && (
                    <div className="col-12 text-center mt-4">
                        <p className="text-muted">
                            {showUserPostsOnly ? "You haven't created any posts yet." : "No posts available."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostList;
