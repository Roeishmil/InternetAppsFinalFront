import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { commentsApi } from '../api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CommentProps {
    postId: string;
    preview?: boolean;
}

interface Comment {
    _id: string;
    postId: string;
    owner: string;
    comment: string;
    ownerName: string;
}

const Comments: React.FC<CommentProps> = ({ postId, preview = false }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const fetchedComments = await commentsApi.getByPostId(postId) as Comment[];
            setComments(preview ? fetchedComments.slice(0, 3) : fetchedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('You must be logged in to comment!');
            return;
        }
        if (!newComment.trim()) return;

        try {
            await commentsApi.create(postId, user.id, newComment.trim());
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleEditComment = async (commentId: string) => {
        if (!editText.trim()) return;
        try {
            await commentsApi.update(commentId, editText);
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment._id === commentId ? { ...comment, comment: editText } : comment
                )
            );
            setEditingComment(null);
            setEditText('');
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await commentsApi.delete(commentId);
                fetchComments();
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    return (
        <div className="container mt-3">
            {!preview && (
                <form onSubmit={handleSubmitComment} className="mb-3">
                    <div className="input-group">
                        <textarea
                            className="form-control"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            rows={2}
                        />
                        <button type="submit" className="btn btn-primary" disabled={!user || !newComment.trim()}>
                            Post
                        </button>
                    </div>
                </form>
            )}
            <div className="list-group">
                {comments.map((comment) => (
                    <div key={comment._id} className="list-group-item">
                        {editingComment === comment._id ? (
                            <div className="input-group">
                                <textarea
                                    className="form-control"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    rows={2}
                                />
                                <button className="btn btn-success" onClick={() => handleEditComment(comment._id)}>
                                    Save
                                </button>
                                <button className="btn btn-secondary" onClick={() => setEditingComment(null)}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <p className="fw-bold mb-1">{comment.ownerName}</p>
                                <small className="text-muted d-block">{comment.comment}</small>
                                {user && user.id === comment.owner && !preview && (
                                    <div className="d-flex gap-2 mt-2">
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => {
                                            setEditingComment(comment._id);
                                            setEditText(comment.comment);
                                        }}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteComment(comment._id)}>
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
                {comments.length === 0 && <p className="text-center text-muted">No comments yet.</p>}
            </div>
        </div>
    );
};

export default Comments;
