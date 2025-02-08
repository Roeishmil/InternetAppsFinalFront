import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comments from './Comments';
import 'bootstrap/dist/css/bootstrap.min.css';

const PostCommentsPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-5 shadow-lg w-100" style={{ maxWidth: "900px", borderRadius: "15px" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button className="btn btn-outline-secondary btn-lg" onClick={() => navigate(-1)}>
                        🔙 Back
                    </button>
                    <h2 className="text-center fw-bold text-dark flex-grow-1 mb-0">All Comments</h2>
                </div>
                <hr className="mb-4" />
                <div className="mt-3 overflow-auto bg-white p-3 rounded shadow-sm" style={{ maxHeight: "600px" }}>
                    <Comments postId={postId!} preview={false} />
                </div>
            </div>
        </div>
    );
};

export default PostCommentsPage;
