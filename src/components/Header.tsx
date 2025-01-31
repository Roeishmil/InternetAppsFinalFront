import React from "react";
import { FaPlus, FaSearch, FaBell, FaUser } from "react-icons/fa";
import { useAuth } from "../components/AuthContext.tsx";
import "../styles/Header.css"; // נוסיף עיצוב מתאים

const Header: React.FC = () => {
    const { user } = useAuth();

    return (
        <header className="header">
            <div className="container d-flex justify-content-between align-items-center">
                <h2 className="logo">📷 PhotoShare</h2>

                <div className="header-buttons">
                    <button className="btn-icon">
                        <FaSearch />
                    </button>
                    <button className="btn-icon">
                        <FaPlus />
                    </button>
                    <button className="btn-icon">
                        <FaBell />
                    </button>
                    <button className="btn-icon">
                        <FaUser />
                        <span>{user ? user.name : "Guest"}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
