import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Spinner: React.FC = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="text-center">
                <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted fw-semibold">Loading, please wait...</p>
            </div>
        </div>
    );
};

export default Spinner;