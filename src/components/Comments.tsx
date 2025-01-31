import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext.tsx';

interface Comment {
    id: number;
    text: string;
    user: string;
}

interface CommentsProps {
    postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    const handleAddComment = () => {
        if (!user) {
            alert("You must be logged in to comment!");
            return;
        }
        if (!newComment.trim()) return;

        const newCommentObj = { id: comments.length + 1, text: newComment, user: user.name };
        setComments([...comments, newCommentObj]);
        setNewComment("");
    };

    return (
        <div className="mt-3 p-3 border rounded">
            <h6>Comments</h6>
            
            {/* ✅ התגובות יוצגו תמיד */}
            <ul className="list-group mb-2">
                {comments.length === 0 ? (
                    <li className="list-group-item text-muted">No comments yet.</li>
                ) : (
                    comments.map(comment => (
                        <li key={comment.id} className="list-group-item">
                            <strong>{comment.user}:</strong> {comment.text}
                        </li>
                    ))
                )}
            </ul>

            {/* ✅ תיבת תגובה מופיעה רק אם המשתמש מחובר */}
            {user ? (
                <div className="d-flex">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className="btn btn-primary ms-2" onClick={handleAddComment}>
                        Add
                    </button>
                </div>
            ) : (
                <p className="text-muted">You must be logged in to comment.</p>
            )}
        </div>
    );
};

export default Comments;
