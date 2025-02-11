import { useState, useEffect } from 'react';
import { FaThumbsUp, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import Comments from './Comments';
import { postsApi } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';

export interface PostProps {
    _id: string;
    title: string;
    owner: string;
    imgUrl: string;
    content: string;
    likes?: number;
    likedByUser: boolean;
}

export function Post({ _id, title, owner, imgUrl, content, likes = 0, likedByUser: initialLikedByUser = false }: PostProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentLikeCount, setCurrentLikeCount] = useState(likes);
    const [isLiked, setIsLiked] = useState(initialLikedByUser);
    const [showCommentsPreview, setShowCommentsPreview] = useState(false);

    useEffect(() => {
        // Check if user has liked this post when component mounts
        const checkLikeStatus = async () => {
            if (user) {
                try {
                    const hasLiked = await postsApi.checkLike(_id, user.id);
                    setIsLiked(hasLiked);
                } catch (error) {
                    console.error("Error checking like status:", error);
                }
            }
        };
        
        checkLikeStatus();
    }, [_id, user]);

    const handleLike = async () => {
        if (!user) {
            alert("You must be logged in to like posts!");
            return;
        }

        try {
            if (isLiked) {
                await postsApi.unlikePost(_id, user.id);
                setCurrentLikeCount(prev => prev - 1);
            } else {
                await postsApi.likePost(_id, user.id);
                setCurrentLikeCount(prev => prev + 1);
            }
            setIsLiked(!isLiked);
            // Dispatch custom event to update PostList if needed
            window.dispatchEvent(new CustomEvent('likeUpdated', { 
                detail: { postId: _id, liked: !isLiked } 
            }));
        } catch (error) {
            console.error("Error updating like:", error);
        }
    };

    const handleDelete = async () => {
        if (!user) {
            alert("Please log in to delete posts");
            navigate('/login');
            return;
        }
        if (user.id !== owner) {
            alert("You can only delete your own posts");
            return;
        }
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await postsApi.deletePost(_id);
                window.dispatchEvent(new CustomEvent('postDeleted', { detail: _id }));
                navigate('/');
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };

    return (
        <div className="card post-card shadow-lg mx-auto mt-4" style={{ maxWidth: '600px' }}>
            <img 
                src={imgUrl} 
                alt={title} 
                className="card-img-top" 
                style={{ maxHeight: '300px', objectFit: 'cover' }} 
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'path/to/fallback/image.jpg'; // Add your fallback image path
                }}
            />
            <div className="card-body">
                <h5 className="card-title text-center fw-bold">{title}</h5>
                <p className="card-text text-muted text-center">{content}</p>
                
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <button 
                        className={`btn ${isLiked ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`} 
                        onClick={handleLike}
                    >
                        <FaThumbsUp className="me-2" /> {currentLikeCount} Likes
                    </button>
                    {user && user.id === owner && (
                        <div className="btn-group">
                            <button 
                                className="btn btn-outline-primary" 
                                onClick={() => navigate(`/post/${_id}/edit`)}
                            >
                                <FaEdit /> Edit
                            </button>
                            <button 
                                className="btn btn-outline-danger" 
                                onClick={handleDelete}
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="text-center mt-3">
                    <button 
                        className="btn btn-outline-secondary btn-sm" 
                        onClick={() => setShowCommentsPreview(!showCommentsPreview)}
                    >
                        {showCommentsPreview ? "Hide Comments" : "View Comments"}
                    </button>
                </div>
                
                {showCommentsPreview && (
                    <div className="comment-preview p-3 mt-3 border rounded bg-light">
                        <Comments postId={_id} preview={true} />
                        <button 
                            className="btn btn-primary btn-sm mt-2 w-100" 
                            onClick={() => navigate(`/post/${_id}/comments`)}
                        >
                            View All Comments
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Post;