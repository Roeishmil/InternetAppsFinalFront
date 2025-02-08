import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm fixed-top">
            <div className="container">
                <Link className="navbar-brand fw-bold text-white" to="/">📸 PhotoApp</Link>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <button 
                                        className="nav-link btn btn-link text-white fw-semibold" 
                                        onClick={() => navigate("/userProfile")}
                                    >
                                        👤 {user.name}
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="btn btn-light btn-sm ms-2" 
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="btn btn-light btn-sm" to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
