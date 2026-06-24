import { Link, useNavigate } from "react-router-dom";
import { FaBriefcase, FaSignOutAlt, FaTools, FaUser, FaUserPlus, FaUsers } from "react-icons/fa";
import { clearAuth, getAuth } from "../auth";

const navByRole = {
    HR: [
        { to: "/hr/dashboard", label: "Dashboard", icon: FaUsers },
        { to: "/employees", label: "Employees", icon: FaUsers },
        { to: "/add-employee", label: "Add Employee", icon: FaUserPlus },
        { to: "/projects", label: "Projects", icon: FaBriefcase },
        { to: "/skills", label: "Skills", icon: FaTools }
    ],
    PM: [
        { to: "/pm/dashboard", label: "Dashboard", icon: FaBriefcase },
        { to: "/projects", label: "Projects", icon: FaBriefcase },
        { to: "/employees", label: "Employees", icon: FaUsers }
    ],
    EMPLOYEE: [
        { to: "/employee/dashboard", label: "Profile", icon: FaUser }
    ]
};

export default function Sidebar() {
    const navigate = useNavigate();
    const { role } = getAuth();
    const links = navByRole[role] || [];

    const logout = () => {
        clearAuth();
        navigate("/", { replace: true });
    };

    return (
        <div style={sidebarStyle}>
            <div>
                <h2 style={{ color: "#38bdf8" }}>SRAS</h2>

                <nav style={{ marginTop: "30px" }}>
                    {links.map(({ to, label, icon: Icon }) => (
                        <Link key={to} to={to} style={linkStyle}>
                            <Icon /> {label}
                        </Link>
                    ))}
                </nav>
            </div>

            <button onClick={logout} style={logoutBtn}>
                <FaSignOutAlt /> Logout
            </button>
        </div>
    );
}

const sidebarStyle = {
    width: "240px",
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box"
};

const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#cbd5e1",
    textDecoration: "none",
    margin: "15px 0"
};

const logoutBtn = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "10px",
    width: "100%",
    background: "#ef4444",
    color: "white",
    border: "none",
    cursor: "pointer"
};
