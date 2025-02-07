import React, { useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import Comments from './Comments';
import { postsApi } from '../api';

export interface PostProps {
    _id: string;
    title: string;
    owner: string;
    imgUrl: string;
    content: string;
    likes: number;
    likedByUser: boolean;
}

export function Post({ _id, title, imgUrl, content, likes, likedByUser }: PostProps) {

    //imgUrl = "public/images/sample1.jpg";
    //imgUrl = 'http://localhost:3000' + '/storage/67a5c2b3ddf347fabb78ebce/squidwardbathroom-1738916531249.jpg';

    console.log("Image",imgUrl);
    console.log("Id",_id);
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
                await postsApi.unlikePost(_id, user.id);
                setLikeCount(prev => prev - 1);
            } else {
                await postsApi.likePost(_id, user.id);
                setLikeCount(prev => prev + 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Error updating like:", error);
        }
    };

    return (
        <div className="card post-card shadow-sm">
            <img src={imgUrl} alt={title} className="card-img-top post-image" />
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
                        <Comments postId={_id} preview={true} />
                        
                        <button className="btn btn-primary btn-sm mt-2 w-100" onClick={() => navigate(`/post/${_id}/comments`)}>
                            View All Comments
                        </button>
                    </div>
                )}
            </div>
        </div>

    );
}

export default Post;
