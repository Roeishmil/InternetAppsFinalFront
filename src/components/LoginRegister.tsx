import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginRegister = () => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleAuth = async () => {
        if (isRegistering) {
            await register(name, email, password);
        } else {
            await login(email, password);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
                <h2 className="text-center fw-bold text-primary mb-3">
                    {isRegistering ? "Register" : "Login"}
                </h2>
                
                {isRegistering && (
                    <input
                        type="text"
                        className="form-control mb-3 rounded-pill"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}
                
                <input
                    type="email"
                    className="form-control mb-3 rounded-pill"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                
                <input
                    type="password"
                    className="form-control mb-3 rounded-pill"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            
                <button className="btn btn-primary w-100 mb-2 rounded-pill" onClick={handleAuth}>
                    {isRegistering ? "Register" : "Login"}
                </button>
                
                <button className="btn btn-link text-center" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? "Already have an account? Login" : "New here? Register"}
                </button>
                
                <button className="btn btn-secondary w-100 mt-2 rounded-pill" onClick={() => navigate("/")}>Go back</button>
            </div>
        </div>
    );
};

export default LoginRegister;
