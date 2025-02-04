import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comments from './Comments';

const PostCommentsPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>🔙 Back to Posts</button>
            <h2 className="text-center">All Comments</h2>
            <Comments postId={postId!} preview={false} />
        </div>
    );
};

export default PostCommentsPage;
