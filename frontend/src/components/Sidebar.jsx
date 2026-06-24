import { Link } from "react-router-dom";
import { FaUsers, FaProjectDiagram, FaTools, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div style={{
            width: "220px",
            height: "100vh",
            backgroundColor: "#1f1f1f",
            color: "white",
            padding: "20px",
            position: "fixed"
        }}>
            <h2>SRAS</h2>

            <nav style={{ marginTop: "30px" }}>

                <Link to="/dashboard" style={linkStyle}>
                    <FaUsers /> Dashboard
                </Link>

                <Link to="/employees" style={linkStyle}>
                    <FaUsers /> Employees
                </Link>

                <Link to="/projects" style={linkStyle}>
                    <FaProjectDiagram /> Projects
                </Link>

                <Link to="/skills" style={linkStyle}>
                    <FaTools /> Skills
                </Link>

            </nav>

            <button onClick={logout} style={logoutBtn}>
                <FaSignOutAlt /> Logout
            </button>
        </div>
    );
}

const linkStyle = {
    display: "block",
    color: "white",
    textDecoration: "none",
    margin: "15px 0"
};

const logoutBtn = {
    marginTop: "50px",
    padding: "10px",
    width: "100%",
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer"
};