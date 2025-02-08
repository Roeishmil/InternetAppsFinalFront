import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { postsApi } from '../api';

const EditPost: React.FC = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState<PostProps | null>(null);
    const [loading, setLoading] = useState(true);
    // Add new state for preview URL
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const fetchedPost = await postsApi.getById(postId!);
                // Check if user is the owner
                if (!user || user.id !== fetchedPost.owner) {
                    navigate('/');
                    return;
                }
                setPost(fetchedPost);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching post:", error);
                navigate('/');
            }
        };
        fetchPost();
    }, [postId, user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!post) return;
        setPost({
            ...post,
            [e.target.name]: e.target.value,
        });
    };

    // Clean up preview URL when component unmounts
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && post) {
            // Create preview URL for the new file
            const newPreviewUrl = URL.createObjectURL(file);
            // Clean up old preview URL if it exists
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(newPreviewUrl);
            setPost({
                ...post,
                imgUrl: file.name,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post) return;

        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('content', post.content);
        formData.append('id',post._id);

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
            formData.append('file', fileInput.files[0]);
            formData.append('imgUrl', fileInput.files[0].name);
        }

        try {
            await postsApi.update(post._id, formData);
            navigate('/');
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!post) return null;

    return (
        <div className="container mt-4">
            <h2>Edit Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Content:</label>
                    <textarea
                        className="form-control"
                        name="content"
                        value={post.content}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Image:</label>
                    <input
                        type="file"
                        className="form-control"
                        name="imgUrl"
                        onChange={handleImageChange}
                    />
                    <div className="mt-3">
                        {previewUrl ? (
                            <div>
                                <h6>New Image Preview:</h6>
                                <img
                                    src={previewUrl}
                                    alt="New preview"
                                    className="mt-2 me-3"
                                    style={{ maxWidth: '200px' }}
                                />
                            </div>
                        ) : null}
                        {post?.imgUrl && !previewUrl && (
                            <div>
                                <h6>Current Image:</h6>
                                <img
                                    src={post.imgUrl}
                                    alt="Current"
                                    className="mt-2"
                                    style={{ maxWidth: '200px' }}
                                />
                            </div>
                        )}
                    </div>
                </div>


                <div className="mb-3">
                    <button type="submit" className="btn btn-primary me-2">
                        Save Changes
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPost;