import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm fixed-top">
            <div className="container">
                <Link className="navbar-brand fw-bold text-white" to="/">📸 PhotoApp</Link>

                <div className="d-flex align-items-center">
                    {user ? (
                        <>
                            <span className="navbar-text me-3 fw-semibold text-white">👤 {user.name}</span>
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
