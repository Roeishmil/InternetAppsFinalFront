import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/theme.css";
import "./styles/Header.css";
import "./styles/Comments.css";
import PostList from "./components/PostList";
import PostCommentsPage from "./components/PostCommentsPage";
import Header from "./components/Header";
import LoginRegister from "./components/LoginRegister";
import CreateNewPost from "./components/createNewPost.tsx";
import UserProfile from "./components/userProfile.tsx";
import EditPost from "./components/EditPost.tsx";
import { AuthProvider, useAuth } from "./components/AuthContext.tsx";

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { user } = useAuth();
    
    return user ? children : null;
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header />
                <Routes>
                    <Route path="/" element={<PostList />} /> 
                    <Route path="/login" element={<LoginRegister />} />
                    <Route path="/post/:postId/comments" element={<ProtectedRoute><PostCommentsPage /></ProtectedRoute>} />
                    <Route path="/createNewPost" element={<ProtectedRoute><CreateNewPost /></ProtectedRoute>} />
                    <Route path="/userProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                    <Route path="/post/:postId/edit" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />                  
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
