import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

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
        navigate("/"); // ✅ אחרי התחברות, הניווט קורה כאן
    };

    return (
        <div className="container mt-5 p-4 card shadow-sm">
        <h2 className="text-center fw-bold text-primary">{isRegistering ? "Register" : "Login"}</h2>
        
        {isRegistering && 
            <input type="text" className="form-control my-2 rounded-pill" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        }
        
        <input type="email" className="form-control my-2 rounded-pill" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="form-control my-2 rounded-pill" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    
        <button className="btn btn-primary w-100 mt-2 rounded-pill" onClick={handleAuth}>
            {isRegistering ? "Register" : "Login"}
        </button>
        
        <button className="btn btn-link mt-2" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Already have an account? Login" : "New here? Register"}
        </button>
    </div>
    );
};

export default LoginRegister;
