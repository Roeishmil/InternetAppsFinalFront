import PostList from "./components/PostList";
import Header from "./components/Header"; 
import { useAuth } from "./components/AuthContext.tsx";
import "./styles/theme.css";

function App() {
    const { user, switchUser } = useAuth();

    return (
        <>
            <Header />
            <div className="container my-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h4>Logged in as: {user ? user.name : "Guest"}</h4>
                    <select className="form-select w-auto" onChange={(e) => switchUser(e.target.value)}>
                        <option value="1">Alice</option>
                        <option value="2">Bob</option>
                        <option value="3">Charlie</option>
                    </select>
                </div>
            </div>

            <div className="m-5">
                <PostList />
            </div>
        </>
    );
}

export default App;
