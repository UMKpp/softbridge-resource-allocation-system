import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>

            {/* SIDEBAR */}
            <div style={{
                width: "220px",
                backgroundColor: "#1f1f1f",
                color: "white",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>
                <div>
                    <h2>SRAS</h2>

                    <nav style={{ marginTop: "30px" }}>
                        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                        <Link to="/employees" style={linkStyle}>Employees</Link>
                        <Link to="/projects" style={linkStyle}>Projects</Link>
                        <Link to="/skills" style={linkStyle}>Skills</Link>
                        <Link to="/allocations" style={linkStyle}>Allocations</Link>
                        <Link to="/add-employee" style={linkStyle}>Add Employee</Link>
                    </nav>
                </div>

                <button onClick={logout} style={logoutBtn}>
                    Logout
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div style={{
                flex: 1,
                padding: "30px",
                backgroundColor: "#f5f5f5"
            }}>
                <h1>Employee Dashboard</h1>
                <p>Welcome to SoftBridge Resource Allocation System</p>

                {/* CARDS SECTION */}
                <div style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "30px"
                }}>
                    <div style={cardStyle}>
                        <h3>Employees</h3>
                        <p>Manage all employees</p>
                    </div>

                    <div style={cardStyle}>
                        <h3>Projects</h3>
                        <p>Project allocation system</p>
                    </div>

                    <div style={cardStyle}>
                        <h3>Skills</h3>
                        <p>Skill tracking system</p>
                    </div>
                </div>
            </div>

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
    padding: "10px",
    width: "100%",
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer"
};

const cardStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "200px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};