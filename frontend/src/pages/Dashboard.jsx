import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { api, authConfig } from "../api";
import { getAuth } from "../auth";

export default function Dashboard() {
    const { role, employeeId } = getAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        employees: 0,
        projects: 0,
        skills: 0,
        assignments: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);

        try {
            if (role === "EMPLOYEE") {
                const [projectsRes, skillsRes] = await Promise.all([
                    api.get("/projects/employee", authConfig()),
                    api.get("/skills/me", authConfig())
                ]);

                setStats({
                    employees: 1,
                    projects: projectsRes.data.length,
                    skills: skillsRes.data.length,
                    assignments: projectsRes.data.length
                });
                return;
            }

            if (role === "PM") {
                const projectsRes = await api.get("/projects/my", authConfig());

                setStats({
                    employees: 0,
                    projects: projectsRes.data.length,
                    skills: 0,
                    assignments: 0
                });
                return;
            }

            const requests = [
                api.get("/employees", authConfig()),
                api.get("/projects", authConfig())
            ];

            if (role === "HR") {
                requests.push(api.get("/skills", authConfig()));
            }

            const responses = await Promise.all(requests);

            setStats({
                employees: responses[0].data.length,
                projects: responses[1].data.length,
                skills: responses[2]?.data.length || 0,
                assignments: 0
            });
        } catch (err) {
            setStats({
                employees: 0,
                projects: 0,
                skills: 0,
                assignments: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const title = role === "HR" ? "HR Dashboard" : role === "PM" ? "Project Manager Dashboard" : "Employee Dashboard";
    const subtitle = role === "EMPLOYEE"
        ? `Employee ID ${employeeId || ""}`
        : "Manage resource visibility, skill matching, and project allocation.";

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="content">
                <div className="page-header">
                    <div>
                        <p className="eyebrow">SoftBridge SRAS</p>
                        <h1 className="page-title">{title}</h1>
                        <p className="page-subtitle">{subtitle}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">Loading dashboard</div>
                ) : (
                    <div className="stats-grid">
                        {role === "HR" && (
                            <div className="stat-card">
                                <p className="stat-value">{stats.employees}</p>
                                <p className="stat-label">Employees</p>
                            </div>
                        )}

                        <div className="stat-card">
                            <p className="stat-value">{stats.projects}</p>
                            <p className="stat-label">{role === "EMPLOYEE" || role === "PM" ? "Assigned Projects" : "Projects"}</p>
                        </div>

                        {(role === "HR" || role === "EMPLOYEE") && (
                            <div className="stat-card">
                                <p className="stat-value">{stats.skills}</p>
                                <p className="stat-label">{role === "EMPLOYEE" ? "My Skills" : "Global Skills"}</p>
                            </div>
                        )}

                        {role === "EMPLOYEE" && (
                            <div className="stat-card">
                                <p className="stat-value">{stats.assignments}</p>
                                <p className="stat-label">Active Assignments</p>
                            </div>
                        )}
                    </div>
                )}

                <section className="panel">
                    <h2 className="card-title">Work Queue</h2>
                    <p className="card-meta">
                        {role === "HR" && "Review employee records, skill catalog quality, and allocation overrides."}
                        {role === "PM" && "Manage your assigned project, search employees by skill, and build the project team."}
                        {role === "EMPLOYEE" && "Keep your profile and skill levels current so managers can allocate accurately."}
                    </p>
                </section>
            </main>
        </div>
    );
}
