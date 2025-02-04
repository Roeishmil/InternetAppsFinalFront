import { useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext.tsx';
import Comments from './Comments';
import { postsApi } from '../api'; // ✅ נוסיף חיבור ל-Backend

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
    const [likeCount, setLikeCount] = useState(likes);
    const [isLiked, setIsLiked] = useState(likedByUser);
    const [showComments, setShowComments] = useState(false);

    const handleLike = async () => {
        if (!user) {
            alert("You must be logged in to like posts!");
            return;
        }
        try {
            if (isLiked) {
                await postsApi.unlikePost(user.id, id);
                setLikeCount(prev => prev - 1);
            } else {
                await postsApi.likePost(user.id, id);
                setLikeCount(prev => prev + 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Error updating like:", error);
        }
    };

    return (
        <div className="card fade-in">
            <img src={imageUrl} alt={title} className="card-img-top" style={{ height: "200px", objectFit: "cover", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }} />
            <div className="card-body text-center">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{content}</p>

                <button className={`btn btn-like ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                    <FaThumbsUp /> {likeCount}
                </button>

                <button className="btn btn-outline-secondary btn-sm mt-3" onClick={() => setShowComments(!showComments)}>
                    {showComments ? "Hide Comments" : "View Comments"}
                </button>

                {showComments && <Comments postId={id} />}
            </div>
        </div>
    );
}

export default Post;
