import React, { useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import Comments from './Comments';
import { postsApi } from '../api';

export interface PostProps {
    id: string;
    title: string;
    imageUrl: string;
    content: string;
    likes: number;
    likedByUser: boolean;
}

export function Post({ id, title, imageUrl, content, likes, likedByUser }: PostProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [likeCount, setLikeCount] = useState(likes);
    const [isLiked, setIsLiked] = useState(likedByUser);
    const [showCommentsPreview, setShowCommentsPreview] = useState(false);

    const handleLike = async () => {
        if (!user) {
            alert("You must be logged in to like posts!");
            return;
        }
        try {
            if (isLiked) {
                await postsApi.unlikePost(id, user.id);
                setLikeCount(prev => prev - 1);
            } else {
                await postsApi.likePost(id, user.id);
                setLikeCount(prev => prev + 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Error updating like:", error);
        }
    };

    return (
        <div className="card post-card shadow-sm">
            <img src={imageUrl} alt={title} className="card-img-top post-image" />
            <div className="card-body text-center">
                <h5 className="card-title fw-bold">{title}</h5>
                <p className="card-text">{content}</p>

                <button className={`btn btn-like ${isLiked ? 'btn-danger' : 'btn-outline-primary'}`} onClick={handleLike}>
                    <FaThumbsUp /> {likeCount} Likes
                </button>

                <button className="btn btn-outline-secondary btn-sm mt-3" onClick={() => setShowCommentsPreview(!showCommentsPreview)}>
                    {showCommentsPreview ? "Hide Comments Preview" : "View Comments Preview"}
                </button>

                {showCommentsPreview && (
                    <div className="comment-preview p-3 mt-3 border rounded bg-light">
                        <Comments postId={id} preview={true} />
                        
                        <button className="btn btn-primary btn-sm mt-2 w-100" onClick={() => navigate(`/post/${id}/comments`)}>
                            View All Comments
                        </button>
                    </div>
                )}
            </div>
        </div>

    );
}

export default Post;
