import React, { useState, useEffect } from 'react';
import Post from './Post';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import Spinner from './Spinner';

const PostList: React.FC = () => {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => { // מחקה קריאה ל-Backend
            setPosts([
                { _id: "1", title: "Beautiful Landscape", imageUrl: "/images/sample1.jpg", content: "A stunning view.", rating: 5, ratingsByUser: {} },
                { _id: "2", title: "Cute Cat", imageUrl: "/images/sample2.jpg", content: "A cat playing.", rating: 4, ratingsByUser: {} },
                { _id: "3", title: "Delicious Food", imageUrl: "/images/sample3.jpg", content: "A tasty dish.", rating: 3, ratingsByUser: {} },
                { _id: "4", title: "Cactus", imageUrl: "/images/sample1.jpg", content: "A tasty dish.", rating: 3, ratingsByUser: {} },
                { _id: "5", title: "Space", imageUrl: "/images/sample2.jpg", content: "A tasty dish.", rating: 3, ratingsByUser: {} },
                { _id: "6", title: "Shop", imageUrl: "/images/sample3.jpg", content: "A tasty dish.", rating: 3, ratingsByUser: {} },
                { _id: "7", title: "Horse", imageUrl: "/images/sample3.jpg", content: "A tasty dish.", rating: 3, ratingsByUser: {} },
                { _id: "8", title: "Infi 2", imageUrl: "/images/sample1.jpg", content: "A tasty dish.", rating: 3, ratingsByUser: {} },

            ]);
            setLoading(false);
        }, 1500); // מחכה 1.5 שניות
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📸 Latest Posts</h2>
                <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="btn btn-primary d-flex align-items-center"
                >
                    Sort by Rating {sortOrder === 'asc' ? <FaSortAmountUp className="ms-2" /> : <FaSortAmountDown className="ms-2" />}
                </button>
            </div>

            <div className="row g-4">
                {posts.map((post) => (
                    <div key={post._id} className="col-12 col-sm-6 col-md-4">
                        <Post {...post} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;
