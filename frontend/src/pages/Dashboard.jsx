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
    const [teamMembers, setTeamMembers] = useState([]);
    const [employeeProjects, setEmployeeProjects] = useState([]);

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
                setEmployeeProjects(projectsRes.data);
                return;
            }

            if (role === "PM") {
                const projectsRes = await api.get("/projects/my", authConfig());
                const teamResponses = await Promise.all(
                    projectsRes.data.map((project) => api.get(`/projects/${project.projectId}/team`, authConfig()))
                );
                const members = teamResponses.flatMap((response) => response.data);

                setStats({
                    employees: 0,
                    projects: projectsRes.data.length,
                    skills: 0,
                    assignments: members.length
                });
                setTeamMembers(members);
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
            setEmployeeProjects([]);
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

                        {role === "PM" && (
                            <div className="stat-card">
                                <p className="stat-value">{stats.assignments}</p>
                                <p className="stat-label">Team Members</p>
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

                {role === "PM" && (
                    <section className="panel" style={{ marginTop: "18px" }}>
                        <h2 className="card-title">Project Team</h2>
                        <div className="table-wrap" style={{ marginTop: "14px" }}>
                            {teamMembers.length === 0 ? (
                                <div className="empty-state">No team members added yet</div>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {teamMembers.map((member) => (
                                        <tr key={member.id}>
                                            <td>{member.employeeName}</td>
                                            <td>{member.role}</td>
                                            <td><span className="tag">{member.status}</span></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </section>
                )}

                {role === "EMPLOYEE" && (
                    <section className="panel" style={{ marginTop: "18px" }}>
                        <h2 className="card-title">Assigned Projects</h2>
                        <div className="card-grid" style={{ marginTop: "14px" }}>
                            {employeeProjects.length === 0 ? (
                                <div className="empty-state">No assigned projects yet</div>
                            ) : employeeProjects.map((project) => (
                                <div className="data-card" key={project.id}>
                                    <h3 className="card-title">{project.projectName}</h3>
                                    <p className="card-meta">Role: {project.role}</p>
                                    <div className="tag-row">
                                        <span className="tag">{project.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
