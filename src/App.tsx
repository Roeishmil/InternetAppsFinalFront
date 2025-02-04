import PostList from "./components/PostList";
import Header from "./components/Header"; 
import LoginRegister from "./components/LoginRegister"; // ✅ נוסיף את עמוד ההתחברות
import { useAuth } from "./components/AuthContext.tsx";
import "./styles/theme.css";

function App() {
    const { user } = useAuth();

    return (
        <>
            <Header />
            {!user ? (
                <LoginRegister />
            ) : (
                <div className="m-5">
                    <PostList />
                </div>
            )}
        </>
    );
}

export default App;
