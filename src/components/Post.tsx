import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export interface PostProps {
    id: string;
    title: string;
    imageUrl: string;
    content: string;
    rating: number;
    onRate?: (id: string, newRating: number) => void;
}

export function Post({ id, title, imageUrl, content, rating, onRate }: PostProps) {
    const [currentRating, setCurrentRating] = useState(rating);

    const handleRating = (newRating: number) => {
        setCurrentRating(newRating);
        if (onRate) {
            onRate(id, newRating); // מעדכן את ההורה (PostList)
        }
    };

    return (
        <div className="card shadow-sm">
            <img src={imageUrl} alt={title} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
            <div className="card-body text-center">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{content}</p>
                {/* דירוג לחיץ */}
                <div className="d-flex justify-content-center mt-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <FaStar
                            key={num}
                            className={`mx-1 ${num <= currentRating ? "text-warning" : "text-muted"}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleRating(num)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Post;
