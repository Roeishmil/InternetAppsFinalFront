import React, { useState, useEffect } from 'react';
import Post, {PostProps} from './Post';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import Spinner from './Spinner';
import { postsApi } from '../api';

const PostList: React.FC = () => {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        const data = await postsApi.getAll() as PostProps[];
        setLoading(false);
        setPosts(data);
    };
    
    useEffect(() => {
        fetchPosts();
        refreshPosts();
    }, []);
    
    const refreshPosts = async () => {
        fetchPosts();
    };
    

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

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📸 Latest Posts</h2>
                <button
                    onClick={handleSort}
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
