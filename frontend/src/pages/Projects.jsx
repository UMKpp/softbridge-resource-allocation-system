import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { api, authConfig } from "../api";
import { getAuth } from "../auth";

const initialProject = {
    projectName: "",
    clientName: "",
    description: "",
    status: "PLANNING"
};

export default function Projects() {
    const { role } = getAuth();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [pms, setPms] = useState([]);
    const [team, setTeam] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [assignmentRole, setAssignmentRole] = useState("Backend");
    const [searchSkill, setSearchSkill] = useState("Java");
    const [searchLevel, setSearchLevel] = useState(3);
    const [projectForm, setProjectForm] = useState(initialProject);
    const [selectedPM, setSelectedPM] = useState({});

    useEffect(() => {
        fetchPageData();
    }, []);

    const fetchPageData = async () => {
        setLoading(true);

        try {
            if (role === "EMPLOYEE") {
                const res = await api.get("/projects/employee", authConfig());
                setProjects(res.data);
                return;
            }

            if (role === "PM") {
                const res = await api.get("/projects/my", authConfig());
                setProjects(res.data);
                if (res.data[0]) {
                    setSelectedProjectId(String(res.data[0].projectId));
                    fetchTeam(res.data[0].projectId);
                }
                return;
            }

            const [projectsRes, pmsRes] = await Promise.all([
                api.get("/projects", authConfig()),
                api.get("/pms", authConfig())
            ]);

            setProjects(projectsRes.data);
            setPms(pmsRes.data);
        } catch (err) {
            setProjects([]);
            setPms([]);
        } finally {
            setLoading(false);
        }
    };

    const createProject = async () => {
        if (!projectForm.projectName || !projectForm.clientName || !projectForm.status) {
            alert("Project name, client, and status are required");
            return;
        }

        if (!selectedPM.createProject) {
            alert("Select an available project manager");
            return;
        }

        try {
            const res = await api.post("/projects", projectForm, authConfig());
            await api.put(`/projects/${res.data.projectId}/pm/${selectedPM.createProject}`, {}, authConfig());

            setProjectForm(initialProject);
            setSelectedPM({});
            fetchPageData();
        } catch (err) {
            alert(err.response?.data?.message || "Project creation failed");
        }
    };

    const assignProjectManager = async (projectId) => {
        const pmId = selectedPM[projectId];

        if (!pmId) {
            alert("Select a project manager");
            return;
        }

        try {
            await api.put(`/projects/${projectId}/pm/${pmId}`, {}, authConfig());
            setSelectedPM({});
            fetchPageData();
        } catch (err) {
            alert(err.response?.data?.message || "Project manager assignment failed");
        }
    };

    const fetchTeam = async (projectId) => {
        setSelectedProjectId(String(projectId));

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

    const searchCandidates = async () => {
        if (!searchSkill || !searchLevel) {
            alert("Enter skill and level");
            return;
        }

        try {
            const res = await api.get(`/employee-skills/employees/search?skill=${encodeURIComponent(searchSkill)}&level=${searchLevel}`, authConfig());
            setCandidates(res.data);
        } catch (err) {
            setCandidates([]);
        }
    };

    const assignEmployee = async () => {
        if (!selectedProjectId || !selectedEmployeeId || !assignmentRole) {
            alert("Select a project, employee, and role");
            return;
        }

        try {
            await api.post(`/projects/${selectedProjectId}/assign/${selectedEmployeeId}`, {
                role: assignmentRole
            }, authConfig());

            setSelectedEmployeeId("");
            fetchTeam(selectedProjectId);
        } catch (err) {
            alert(err.response?.data?.message || "Assignment failed");
        }
    };

    const completeProject = async () => {
        if (!selectedProjectId) {
            alert("Select a project");
            return;
        }

        try {
            await api.put(`/projects/${selectedProjectId}/complete`, {}, authConfig());
            fetchPageData();
            fetchTeam(selectedProjectId);
        } catch (err) {
            alert(err.response?.data?.message || "Complete project failed");
        }
    };

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="content">
                <div className="page-header">
                    <div>
                        <p className="eyebrow">Projects</p>
                        <h1 className="page-title">
                            {role === "HR" && "Project Management"}
                            {role === "PM" && "Assigned Project"}
                            {role === "EMPLOYEE" && "My Assigned Projects"}
                        </h1>
                        <p className="page-subtitle">
                            {role === "HR" && "Create projects, assign project managers, and review project teams."}
                            {role === "PM" && "Search qualified employees by skill and manage your project team."}
                            {role === "EMPLOYEE" && "View projects and roles assigned to you."}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">Loading projects</div>
                ) : role === "EMPLOYEE" ? (
                    <div className="card-grid">
                        {projects.length === 0 ? (
                            <div className="empty-state panel">No assigned projects yet</div>
                        ) : projects.map((assignment) => (
                            <div className="data-card" key={assignment.id}>
                                <h2 className="card-title">{assignment.projectName}</h2>
                                <p className="card-meta">Role: {assignment.role}</p>
                                <div className="tag-row">
                                    <span className="tag">{assignment.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : role === "HR" ? (
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
                                    <option value="COMPLETED">COMPLETED</option>
                                </select>
                            </div>
                            <div className="pm-category-box">
                                <h3 className="card-title">Suggested Project Managers</h3>
                                <p className="card-meta">Select one available manager for this project.</p>
                                <div className="pm-list">
                                    {pms.slice(0, 10).map((pm) => {
                                        const available = pm.status === "AVAILABLE";
                                        const selected = selectedPM.createProject === pm.id;

                                        return (
                                            <button
                                                key={pm.id}
                                                className={`pm-option ${available ? "pm-available" : "pm-unavailable"} ${selected ? "pm-selected" : ""}`}
                                                onClick={() => available && setSelectedPM({ ...selectedPM, createProject: pm.id })}
                                                disabled={!available}
                                            >
                                                <span>{pm.username}</span>
                                                <strong>{pm.status}</strong>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="actions">
                                <button className="primary-button" onClick={createProject}>Create Project</button>
                            </div>
                        </section>

                        <section className="panel" style={{ gridColumn: "1 / -1" }}>
                            <h2 className="card-title">All Projects</h2>
                            <div className="card-grid" style={{ marginTop: "14px" }}>
                                {projects.length === 0 ? (
                                    <div className="empty-state">No projects available</div>
                                ) : projects.map((project) => (
                                    <div className="data-card" key={project.projectId}>
                                        <h3 className="card-title">{project.projectName}</h3>
                                        <p className="card-meta">{project.clientName}</p>
                                        <p className="card-meta">PM: {project.projectManager?.fullName || "Unassigned"}</p>
                                        <div className="tag-row">
                                            <span className="tag">{project.status}</span>
                                        </div>
                                        <div className="pm-list">
                                            {pms.map((pm) => {
                                                const available = pm.status === "AVAILABLE";
                                                const selected = selectedPM[project.projectId] === pm.id;

                                                return (
                                                    <button
                                                        key={pm.id}
                                                        className={`pm-option ${available ? "pm-available" : "pm-unavailable"} ${selected ? "pm-selected" : ""}`}
                                                        onClick={() => available && setSelectedPM({ ...selectedPM, [project.projectId]: pm.id })}
                                                        disabled={!available}
                                                    >
                                                        <span>{pm.username}</span>
                                                        <strong>{pm.status}</strong>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="actions">
                                            <button className="primary-button" onClick={() => assignProjectManager(project.projectId)}>Assign PM</button>
                                            <button className="secondary-button" onClick={() => fetchTeam(project.projectId)}>View Team</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="grid-two">
                        <section className="panel">
                            <h2 className="card-title">Assigned Projects</h2>
                            <div className="card-grid" style={{ marginTop: "14px" }}>
                                {projects.length === 0 ? (
                                    <div className="empty-state">No assigned project</div>
                                ) : projects.map((project) => (
                                    <div className="data-card" key={project.projectId}>
                                        <h3 className="card-title">{project.projectName}</h3>
                                        <p className="card-meta">{project.clientName}</p>
                                        <div className="tag-row">
                                            <span className="tag">{project.status}</span>
                                        </div>
                                        <div className="actions">
                                            <button className="primary-button" onClick={() => fetchTeam(project.projectId)}>Manage Team</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="panel">
                            <h2 className="card-title">Search Qualified Employees</h2>
                            <div className="form-grid" style={{ marginTop: "14px" }}>
                                <input className="field" placeholder="Skill" value={searchSkill} onChange={(e) => setSearchSkill(e.target.value)} />
                                <select className="field" value={searchLevel} onChange={(e) => setSearchLevel(e.target.value)}>
                                    <option value="1">Level 1</option>
                                    <option value="2">Level 2</option>
                                    <option value="3">Level 3</option>
                                </select>
                                <select className="field" value={assignmentRole} onChange={(e) => setAssignmentRole(e.target.value)}>
                                    <option value="Backend">Backend</option>
                                    <option value="Frontend">Frontend</option>
                                    <option value="QA">QA</option>
                                    <option value="DevOps">DevOps</option>
                                </select>
                            </div>
                            <div className="actions">
                                <button className="secondary-button" onClick={searchCandidates}>Search</button>
                            </div>
                            <div className="card-grid" style={{ marginTop: "14px" }}>
                                {candidates.map((candidate) => (
                                    <div className="data-card" key={candidate.employeeId}>
                                        <h3 className="card-title">{candidate.fullName}</h3>
                                        <p className="card-meta">{candidate.skills.map((skill) => `${skill.skillName} L${skill.level}`).join(", ")}</p>
                                        <div className="actions">
                                            <button className="primary-button" onClick={() => setSelectedEmployeeId(candidate.employeeId)}>Select</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="panel" style={{ gridColumn: "1 / -1" }}>
                            <h2 className="card-title">Team Actions</h2>
                            <div className="form-grid" style={{ marginTop: "14px" }}>
                                <select className="field" value={selectedProjectId} onChange={(e) => fetchTeam(e.target.value)}>
                                    <option value="">Select project</option>
                                    {projects.map((project) => (
                                        <option key={project.projectId} value={project.projectId}>{project.projectName}</option>
                                    ))}
                                </select>
                                <input className="field" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} placeholder="Selected employee ID" />
                                <input className="field" value={assignmentRole} onChange={(e) => setAssignmentRole(e.target.value)} placeholder="Project role" />
                            </div>
                            <div className="actions">
                                <button className="primary-button" onClick={assignEmployee}>Assign Employee</button>
                                <button className="danger-button" onClick={completeProject}>Complete Group</button>
                                <button className="secondary-button" onClick={() => alert("Select a team member and reassign using Assign Employee")}>Change Group</button>
                            </div>
                        </section>
                    </div>
                )}

                {(role === "HR" || role === "PM") && (
                    <section className="panel" style={{ marginTop: "18px" }}>
                        <h2 className="card-title">Project Team</h2>
                        <div className="table-wrap" style={{ marginTop: "14px" }}>
                            {team.length === 0 ? (
                                <div className="empty-state">No team selected</div>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Role</th>
                                        <th>Assigned By</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {team.map((member) => (
                                        <tr key={member.id}>
                                            <td>{member.employeeName}</td>
                                            <td>{member.role}</td>
                                            <td>{member.assignedBy}</td>
                                            <td><span className="tag">{member.status}</span></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
