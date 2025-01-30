import React, { useEffect, useState } from 'react';
import Post from './Post';
import { postsApi, PostResponse } from '../api';

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await postsApi.getAll();
            setPosts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching posts');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600">Loading posts...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600">No posts found.</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Posts:</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                    <div key={post._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <Post 
                            id={post._id}
                            title={post.title}
                            content={post.content}
                            imageUrl={post.imageUrl}
                            rating={post.rating}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;