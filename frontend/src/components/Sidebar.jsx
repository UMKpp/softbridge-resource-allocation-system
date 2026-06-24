import { Link, useNavigate } from "react-router-dom";
import { FaBriefcase, FaChartLine, FaSignOutAlt, FaTools, FaUser, FaUserPlus, FaUsers } from "react-icons/fa";
import { clearAuth, getAuth } from "../auth";

const navByRole = {
    HR: [
        { to: "/hr/dashboard", label: "Dashboard", icon: FaChartLine },
        { to: "/employees", label: "Employees", icon: FaUsers },
        { to: "/add-employee", label: "Add Employee", icon: FaUserPlus },
        { to: "/projects", label: "Projects", icon: FaBriefcase },
        { to: "/skills", label: "Skills", icon: FaTools }
    ],
    PM: [
        { to: "/pm/dashboard", label: "Dashboard", icon: FaChartLine },
        { to: "/projects", label: "Projects", icon: FaBriefcase },
        { to: "/employees", label: "Employees", icon: FaUsers }
    ],
    EMPLOYEE: [
        { to: "/employee/dashboard", label: "Dashboard", icon: FaChartLine },
        { to: "/projects", label: "My Projects", icon: FaBriefcase },
        { to: "/skills", label: "My Skills", icon: FaTools },
        { to: "/profile", label: "Profile", icon: FaUser }
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
        <aside className="sidebar">
            <div>
                <h2 className="brand">SRAS</h2>
                <span className="role-pill">{role}</span>

                <nav className="side-nav">
                    {links.map(({ to, label, icon: Icon }) => (
                        <Link key={to} to={to} className="side-link">
                            <Icon /> {label}
                        </Link>
                    ))}
                </nav>
            </div>

            <button onClick={logout} className="logout-button">
                <FaSignOutAlt /> Logout
            </button>
        </aside>
    );
}
