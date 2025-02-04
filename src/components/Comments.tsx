import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext.tsx';
import { commentsApi } from '../api';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../styles/Comments.css';

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

    useEffect(() => {
        if (!postId) return;
        const fetchComments = async () => {
            const data: Comment[] = await commentsApi.getByPostId(postId) as Comment[];
            setComments(data);
        };
        fetchComments();
    }, [postId]);

    const handleAddComment = async () => {
        if (!user) {
            alert("You must be logged in to comment!");
            return;
        }
        if (!newComment.trim()) return;

        const newCommentObj = { id: Date.now(), text: newComment, user: user.name };
        setComments([...comments, newCommentObj]);
        setNewComment("");
        await commentsApi.create(postId, user.id, newComment);
    };

    return (
        <div className="mt-3 p-3 border rounded">
            <h6>Comments</h6>
            <TransitionGroup component="ul" className="list-group mb-2">
                {comments.map(comment => (
                    <CSSTransition key={comment.id} timeout={300} classNames="fade">
                        <li className="list-group-item">
                            <strong>{comment.user}:</strong> {comment.text}
                        </li>
                    </CSSTransition>
                ))}
            </TransitionGroup>
            {user && (
                <div className="d-flex">
                    <input type="text" className="form-control" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                    <button className="btn btn-primary ms-2" onClick={handleAddComment}>Add</button>
                </div>
            )}
        </div>
    );
};

export default Comments;
