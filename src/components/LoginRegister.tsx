import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginRegister = () => {
    const { login, register, loginWithGoogle, isLoading } = useAuth();
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            if (isRegistering) {
                if (!name || !email || !password) {
                    throw new Error("All fields are required");
                }
                await register(name, email, password);
            } else {
                if (!email || !password) {
                    throw new Error("Email and password are required");
                }
                await login(email, password);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
                <h2 className="text-center fw-bold text-primary mb-4">
                    {isRegistering ? "Create Account" : "Welcome Back"}
                </h2>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth}>
                    {isRegistering && (
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control rounded-pill"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    )}
                    
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control rounded-pill"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <input
                            type="password"
                            className="form-control rounded-pill"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100 mb-3 rounded-pill"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {isRegistering ? "Creating Account..." : "Logging in..."}
                            </>
                        ) : (
                            isRegistering ? "Create Account" : "Log In"
                        )}
                    </button>
                </form>
                
                <div className="text-center mb-3">
                    <span className="text-muted">or</span>
                </div>
                
                <button 
                    className="btn btn-outline-danger w-100 mb-3 rounded-pill"
                    onClick={loginWithGoogle}
                    disabled={isSubmitting}
                >
                    <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                    </svg>
                    Continue with Google
                </button>
                
                <button 
                    className="btn btn-link text-decoration-none"
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError("");
                    }}
                    disabled={isSubmitting}
                >
                    {isRegistering ? 
                        "Already have an account? Log in" : 
                        "Don't have an account? Sign up"}
                </button>

                <button 
                    className="btn btn-link text-decoration-none text-secondary"
                    onClick={() => navigate("/")}
                    disabled={isSubmitting}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default LoginRegister;