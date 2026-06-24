import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { api, authConfig } from "../api";
import { getAuth } from "../auth";

const initialProject = {
    projectName: "",
    clientName: "",
    description: "",
    status: "PLANNING",
    requiredSkillName: "",
    requiredSkillLevel: 1
};

export default function Projects() {
    const { role } = getAuth();
    const canManage = role === "HR" || role === "PM";
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [team, setTeam] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [allocatedRole, setAllocatedRole] = useState("");
    const [projectForm, setProjectForm] = useState(initialProject);

    useEffect(() => {
        fetchPageData();
    }, []);

    const fetchPageData = async () => {
        setLoading(true);

        try {
            if (role === "EMPLOYEE") {
                const res = await api.get("/projects/my", authConfig());
                setProjects(res.data);
                return;
            }

            const [projectsRes, employeesRes] = await Promise.all([
                api.get("/projects", authConfig()),
                api.get("/employees", authConfig())
            ]);

            setProjects(projectsRes.data);
            setEmployees(employeesRes.data);
        } catch (err) {
            setProjects([]);
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    const createProject = async () => {
        if (!projectForm.projectName || !projectForm.clientName || !projectForm.status) {
            alert("Project name, client, and status are required");
            return;
        }

        try {
            await api.post("/projects", {
                ...projectForm,
                requiredSkillName: projectForm.requiredSkillName || null,
                requiredSkillLevel: projectForm.requiredSkillName ? Number(projectForm.requiredSkillLevel) : null
            }, authConfig());

            setProjectForm(initialProject);
            fetchPageData();
        } catch (err) {
            alert(err.response?.data?.message || "Project creation failed");
        }
    };

    const fetchTeam = async (projectId) => {
        setSelectedProjectId(projectId);

        if (!projectId) {
            setTeam([]);
            return;
        }

        try {
            const res = await api.get(`/projects/${projectId}/team`, authConfig());
            setTeam(res.data);
        } catch (err) {
            setTeam([]);
        }
    };

    const assignEmployee = async () => {
        if (!selectedProjectId || !selectedEmployeeId) {
            alert("Select a project and employee");
            return;
        }

        try {
            await api.post(`/projects/${selectedProjectId}/assign/${selectedEmployeeId}`, {
                allocatedRole
            }, authConfig());

            setSelectedEmployeeId("");
            setAllocatedRole("");
            fetchTeam(selectedProjectId);
        } catch (err) {
            alert(err.response?.data?.message || "Assignment failed");
        }
    };

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="content">
                <div className="page-header">
                    <div>
                        <p className="eyebrow">Projects</p>
                        <h1 className="page-title">{role === "EMPLOYEE" ? "My Assigned Projects" : "Project Allocation"}</h1>
                        <p className="page-subtitle">
                            {role === "EMPLOYEE" ? "Projects currently assigned to you." : "Create projects, assign qualified employees, and review project teams."}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">Loading projects</div>
                ) : role === "EMPLOYEE" ? (
                    <div className="card-grid">
                        {projects.length === 0 ? (
                            <div className="empty-state panel">No assigned projects yet</div>
                        ) : projects.map((allocation) => (
                            <div className="data-card" key={allocation.allocationId}>
                                <h2 className="card-title">{allocation.projectName}</h2>
                                <p className="card-meta">{allocation.clientName}</p>
                                <div className="tag-row">
                                    <span className="tag">{allocation.allocatedRole}</span>
                                    {allocation.requiredSkillName && <span className="tag">{allocation.requiredSkillName} L{allocation.requiredSkillLevel}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid-two">
                        <section className="panel">
                            <h2 className="card-title">Create Project</h2>
                            <div className="form-grid" style={{ marginTop: "14px" }}>
                                <input className="field" placeholder="Project name" value={projectForm.projectName} onChange={(e) => setProjectForm({ ...projectForm, projectName: e.target.value })} />
                                <input className="field" placeholder="Client name" value={projectForm.clientName} onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })} />
                                <input className="field" placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
                                <select className="field" value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}>
                                    <option value="PLANNING">PLANNING</option>
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="ON_HOLD">ON_HOLD</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                </select>
                                <input className="field" placeholder="Required skill" value={projectForm.requiredSkillName} onChange={(e) => setProjectForm({ ...projectForm, requiredSkillName: e.target.value })} />
                                <select className="field" value={projectForm.requiredSkillLevel} onChange={(e) => setProjectForm({ ...projectForm, requiredSkillLevel: e.target.value })}>
                                    <option value="1">Level 1</option>
                                    <option value="2">Level 2</option>
                                    <option value="3">Level 3</option>
                                </select>
                            </div>
                            <div className="actions">
                                <button className="primary-button" onClick={createProject}>Create Project</button>
                            </div>
                        </section>

                        <section className="panel">
                            <h2 className="card-title">Assign Employee</h2>
                            <div className="form-grid" style={{ marginTop: "14px" }}>
                                <select className="field" value={selectedProjectId} onChange={(e) => fetchTeam(e.target.value)}>
                                    <option value="">Select project</option>
                                    {projects.map((project) => (
                                        <option key={project.projectId} value={project.projectId}>{project.projectName}</option>
                                    ))}
                                </select>
                                <select className="field" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
                                    <option value="">Select employee</option>
                                    {employees.map((employee) => (
                                        <option key={employee.employeeId} value={employee.employeeId}>{employee.fullName} - {employee.jobRole}</option>
                                    ))}
                                </select>
                                <input className="field" placeholder="Allocated role" value={allocatedRole} onChange={(e) => setAllocatedRole(e.target.value)} />
                            </div>
                            <div className="actions">
                                <button className="primary-button" onClick={assignEmployee}>Assign</button>
                                {role === "HR" && <span className="tag">HR override enabled</span>}
                            </div>
                        </section>

                        <section className="panel" style={{ gridColumn: "1 / -1" }}>
                            <h2 className="card-title">Projects</h2>
                            <div className="card-grid" style={{ marginTop: "14px" }}>
                                {projects.length === 0 ? (
                                    <div className="empty-state">No projects available</div>
                                ) : projects.map((project) => (
                                    <div className="data-card" key={project.projectId}>
                                        <h3 className="card-title">{project.projectName}</h3>
                                        <p className="card-meta">{project.clientName}</p>
                                        <p className="card-meta">{project.description}</p>
                                        <div className="tag-row">
                                            <span className="tag">{project.status}</span>
                                            {project.requiredSkillName && <span className="tag">{project.requiredSkillName} L{project.requiredSkillLevel}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="panel" style={{ gridColumn: "1 / -1" }}>
                            <h2 className="card-title">Selected Project Team</h2>
                            <div className="table-wrap" style={{ marginTop: "14px" }}>
                                {team.length === 0 ? (
                                    <div className="empty-state">Select a project to view its team</div>
                                ) : (
                                    <table className="data-table">
                                        <thead>
                                        <tr>
                                            <th>Employee</th>
                                            <th>Role</th>
                                            <th>Allocated On</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {team.map((member) => (
                                            <tr key={member.allocationId}>
                                                <td>{member.employeeName}</td>
                                                <td>{member.allocatedRole}</td>
                                                <td>{member.allocationDate}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}
