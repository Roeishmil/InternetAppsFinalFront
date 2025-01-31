import React, { useState } from 'react';
import Post from './Post';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const PostList: React.FC = () => {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [posts, setPosts] = useState([
        { _id: "1", title: "Beautiful Landscape", imageUrl: "/images/sample1.jpg", content: "A stunning view.", rating: 5 },
        { _id: "2", title: "Cute Cat", imageUrl: "/images/sample2.jpg", content: "A cat playing.", rating: 4 },
        { _id: "3", title: "Delicious Food", imageUrl: "/images/sample3.jpg", content: "A tasty dish.", rating: 3 },
    ]);

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleRatingUpdate = (postId: string, newRating: number) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post._id === postId ? { ...post, rating: newRating } : post
            )
        );
    };

    const sortedPosts = [...posts].sort((a, b) =>
        sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
    );

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📸 Latest Posts</h2>
                <button
                    onClick={toggleSortOrder}
                    className="btn btn-primary d-flex align-items-center"
                >
                    Sort by Rating {sortOrder === 'asc' ? <FaSortAmountUp className="ms-2" /> : <FaSortAmountDown className="ms-2" />}
                </button>
            </div>

            <div className="row g-4">
                {sortedPosts.map((post) => (
                    <div key={post._id} className="col-12 col-sm-6 col-md-4">
                        <Post 
                            id={post._id}
                            title={post.title}
                            content={post.content}
                            imageUrl={post.imageUrl}
                            rating={post.rating}
                            onRate={handleRatingUpdate} // מעביר עדכון דירוג מהילד להורה
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;
