import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext.tsx';
import Comments from './Comments';

export interface PostProps {
    id: string;
    title: string;
    imageUrl: string;
    content: string;
    rating: number;
    ratingsByUser: Record<string, number>;
    onRate?: (id: string, newRating: number, userId: string) => void;
}

export function Post({ id, title, imageUrl, content, rating, ratingsByUser, onRate }: PostProps) {
    const { user } = useAuth();
    const [currentRating, setCurrentRating] = useState(user ? ratingsByUser[user.id] || 0 : 0);
    const [showComments, setShowComments] = useState(false);

    const handleRating = (newRating: number) => {
        if (!user) {
            alert("You must be logged in to rate!");
            return;
        }
        setCurrentRating(newRating);
        if (onRate) {
            onRate(id, newRating, user.id);
        }
    };

    return (
        <div className="card fade-in">
            <img src={imageUrl} alt={title} className="card-img-top" style={{ height: "200px", objectFit: "cover", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }} />
            <div className="card-body text-center">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{content}</p>

                <div className="d-flex justify-content-center mt-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <FaStar
                            key={num}
                            className={`mx-1 ${num <= currentRating ? "text-warning" : "text-muted"}`}
                            style={{ cursor: user ? "pointer" : "not-allowed", fontSize: "20px" }}
                            onClick={() => handleRating(num)}
                        />
                    ))}
                </div>

                <button
                    className="btn btn-outline-secondary btn-sm mt-3"
                    onClick={() => setShowComments(!showComments)}
                >
                    {showComments ? "Hide Comments" : "View Comments"}
                </button>

                {showComments && <Comments postId={id} />}
            </div>
        </div>
    );
}

export default Post;
