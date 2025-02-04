import React, { useState } from "react";
import { useAuth } from "../components/AuthContext.tsx";
import axios from "axios";

const API_URL = "http://localhost:3000"; // ✅ ודא שזה ה-URL הנכון

const LoginRegister: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState("");

    const handleAuth = async () => {
        try {
            setError(""); // נקה שגיאות קודמות
            if (isRegistering) {
                await axios.post(`${API_URL}/register`, { name, email, password });
            }
            await login(email, password);
        } catch (err) {
            setError("Authentication failed. Please try again.");
        }
    };

    return (
        <div className="container d-flex flex-column align-items-center mt-5">
            <h2>{isRegistering ? "Register" : "Login"}</h2>
            {error && <p className="text-danger">{error}</p>}

            {isRegistering && (
                <input
                    type="text"
                    className="form-control my-2"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            )}

            <input
                type="email"
                className="form-control my-2"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                className="form-control my-2"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn btn-primary w-100 mt-2" onClick={handleAuth}>
                {isRegistering ? "Register" : "Login"}
            </button>

            <button className="btn btn-link mt-2" onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Already have an account? Login" : "New here? Register"}
            </button>
        </div>
    );
};

export default LoginRegister;
