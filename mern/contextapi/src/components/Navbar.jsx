import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    return (
        <div style={{
            padding: "15px",
            display: "flex",
            justifyContent: "space-between",
            background: theme === "light" ? "#eee" : "#222",
            color: theme === "light" ? "#000" : "#fff"
        }}>
            <h2>Context + Auth Demo</h2>

            <div>
                <button onClick={toggleTheme}>
                    Theme
                </button>

                {user ? (
                    <>
                        <span style={{ margin: "0 10px" }}>
                            {user.name}
                        </span>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default Navbar;