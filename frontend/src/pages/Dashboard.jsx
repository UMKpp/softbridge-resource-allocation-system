import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {

    const navigate = useNavigate();

    const [employeesCount, setEmployeesCount] = useState(0);
    const [projectsCount, setProjectsCount] = useState(0);
    const [skillsCount, setSkillsCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
        }

        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");

            // Employees
            const empRes = await axios.get("http://localhost:8081/employees", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setEmployeesCount(empRes.data.length);

            // Projects (if backend exists)
            const proRes = await axios.get("http://localhost:8081/projects", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProjectsCount(proRes.data.length);

            // Skills (if backend exists)
            const skillRes = await axios.get("http://localhost:8081/skills", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSkillsCount(skillRes.data.length);

        } catch (err) {
            console.log("STATS ERROR:", err);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>

            {/* SIDEBAR */}
            <div style={sidebarStyle}>
                <h2 style={{ color: "#38bdf8" }}>SRAS</h2>

                <nav style={{ marginTop: "30px" }}>
                    <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                    <Link to="/employees" style={linkStyle}>Employees</Link>
                    <Link to="/add-employee" style={linkStyle}>Add Employee</Link>
                    <Link to="/projects" style={linkStyle}>Projects</Link>
                    <Link to="/skills" style={linkStyle}>Skills</Link>
                </nav>

                <button onClick={logout} style={logoutBtn}>
                    Logout
                </button>
            </div>

            {/*main dash*/}
            <div style={mainStyle}>

                <h1>HR Dashboard</h1>
                <p>Welcome to SoftBridge Resource Allocation System</p>

                <div style={cardContainer}>

                    <div style={card}>
                        <h2>{employeesCount}</h2>
                        <p>Total Employees</p>
                    </div>

                    <div style={card}>
                        <h2>{projectsCount}</h2>
                        <p>Active Projects</p>
                    </div>

                    <div style={card}>
                        <h2>{skillsCount}</h2>
                        <p>Skills Tracked</p>
                    </div>

                </div>

            </div>

        </div>
    );
}

/* style*/

const sidebarStyle = {
    width: "240px",
    backgroundColor: "#0f172a",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
};

const mainStyle = {
    flex: 1,
    padding: "30px",
    backgroundColor: "#f1f5f9"
};

const linkStyle = {
    display: "block",
    color: "#cbd5e1",
    textDecoration: "none",
    margin: "15px 0"
};

const logoutBtn = {
    padding: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    cursor: "pointer"
};

const cardContainer = {
    display: "flex",
    gap: "20px",
    marginTop: "30px"
};

const card = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "200px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};