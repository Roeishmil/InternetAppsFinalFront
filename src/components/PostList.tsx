import React, { useState, useEffect } from 'react';
import Post, { PostProps } from './Post';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import Spinner from './Spinner';
import { postsApi } from '../api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const PostList: React.FC = () => {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        setLoading(true);
        const data = await postsApi.getAll() as PostProps[];
        setLoading(false);
        setPosts(data);
    };

    useEffect(() => {
        fetchPosts();
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

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h2 className="fw-bold text-primary">📸 Latest Posts</h2>
                <div className="d-flex gap-2">
                    <button onClick={handleSort} className="btn btn-outline-primary d-flex align-items-center">
                        Sort by Rating {sortOrder === 'asc' ? <FaSortAmountUp className="ms-2" /> : <FaSortAmountDown className="ms-2" />}
                    </button>
                    <button className="btn btn-success" onClick={() => navigate(`/createNewPost`)}>
                        Create a New Post
                    </button>
                </div>
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {posts.map((post) => (
                    <div key={post._id} className="col">
                        <Post {...post} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;
