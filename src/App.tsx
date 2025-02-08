import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/theme.css";
import "./styles/Header.css";
import "./styles/Comments.css";
import PostList from "./components/PostList";
import PostCommentsPage from "./components/PostCommentsPage";
import Header from "./components/Header";
import LoginRegister from "./components/LoginRegister";
import CreateNewPost from "./components/createNewPost.tsx";
import UserProfile from "./components/userProfile.tsx";
import EditPost from "./components/EditPost.tsx"
import { AuthProvider, useAuth } from "./components/AuthContext.tsx";

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header />
                <Routes>
                    <Route path="/" element={<PostList />} /> 
                    <Route path="/login" element={<LoginRegister />} />
                    <Route path="/post/:postId/comments" element={<ProtectedRoute><PostCommentsPage /></ProtectedRoute>} /> {/* ✅ תגובות דורשות התחברות */}
                    <Route path="/createNewPost" element={<ProtectedRoute><CreateNewPost /></ProtectedRoute>} /> {/* ✅ יצירת פוסט דורש התחברות */}
                    <Route path="/userProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} /> {/* ✅ מסך פרטי משתמש דורש התחברות */}      
                    <Route path="/post/:postId/edit" element={<ProtectedRoute><EditPost /></ProtectedRoute>} /> {/* ✅ מסך עריכה דורש התחברות */}                  
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
