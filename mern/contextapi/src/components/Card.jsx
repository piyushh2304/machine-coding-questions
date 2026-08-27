import { useTheme } from "../hooks/useTheme";

function Card() {
    const { theme } = useTheme();

    return (
        <div style={{
            margin: "20px",
            padding: "20px",
            borderRadius: "10px",
            background: theme === "light" ? "#fff" : "#333",
            color: theme === "light" ? "#000" : "#fff",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)"
        }}>
            <h3>Card Component</h3>
            <p>This component is using global theme 🎯</p>
        </div>
    );
}

export default Card;