import React, { useState, useEffect, useRef } from 'react';
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
    preview?: boolean;
}

const Comments: React.FC<CommentsProps> = ({ postId, preview = false }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const nodeRefs = useRef(new Map()); // ✅ יצירת nodeRef כדי למנוע `findDOMNode`

    useEffect(() => {
        if (!postId) return; // ✅ אם אין `postId`, לא נשלח בקשה ל-API

        const fetchComments = async () => {
            try {
                const data: Comment[] = await commentsApi.getByPostId(postId) as Comment[];
                console.log('comments',data);
                setComments(data);
            } catch (error) {
                console.error("Failed to load comments:", error);
            }
        };

        fetchComments();
    }, [postId]);

    const handleAddComment = async () => {
        if (!user) {
            alert("You must be logged in to comment!");
            return;
        }
        if (!newComment.trim()) return;

        const newCommentObj = { id: Date.now(), text: newComment, user: user.username };
        setComments([...comments, newCommentObj]);
        setNewComment("");
        await commentsApi.create( postId, user.id, newComment);
    };

    return (
        <div className="mt-3 p-3 border rounded">
            <h6>Comments</h6>
            <TransitionGroup component="ul" className="list-group mb-2">
                {(preview ? comments.slice(0, 2) : comments).map(comment => {
                    if (!nodeRefs.current.has(comment.id)) {
                        nodeRefs.current.set(comment.id, React.createRef());
                    }
                    return (
                        <CSSTransition
                            key={comment.id}
                            timeout={300}
                            classNames="fade"
                            nodeRef={nodeRefs.current.get(comment.id)} // ✅ שימוש ב-nodeRef
                        >
                            <li ref={nodeRefs.current.get(comment.id)} className="list-group-item">
                                <strong>{comment.user}:</strong> {comment.text}
                            </li>
                        </CSSTransition>
                    );
                })}
            </TransitionGroup>

            {user ? (
                <div className="d-flex">
                    <input type="text" className="form-control" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                    <button className="btn btn-primary ms-2" onClick={handleAddComment}>Add</button>
                </div>
            ) : (
                <button className="btn btn-warning w-100 mt-2" onClick={() => alert("Please log in to comment!")}>
                    Login to Comment
                </button>
            )}
        </div>
    );
};

export default Comments;
