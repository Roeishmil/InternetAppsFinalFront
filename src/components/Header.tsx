import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm fixed-top">
            <div className="container">
                <Link className="navbar-brand fw-bold text-white" to="/">📸 PhotoApp</Link>

                <div className="d-flex align-items-center">
                    {user ? (
                        <>
                            <button className="navbar-text me-3 fw-semibold text-white" onClick={() => navigate("/userProfile")}>👤 {user.name}</button>
                            <button className="btn btn-light btn-sm" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <Link className="btn btn-light btn-sm" to="/login">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
