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

const skillOptions = [
    "Java",
    "Spring Boot",
    "REST API Development",
    "MySQL",
    "React Native",
    "Flutter",
    "Kotlin",
    "Swift",
    "UI/UX Design",
    "Figma",
    "QA Testing",
    "Mobile App Testing",
    "Git",
    "AWS",
    "Docker"
];

const errorMessage = (err, fallback) => {
    const data = err.response?.data;

    if (typeof data === "string") {
        return data;
    }

    if (data?.message && data.message.trim()) {
        return data.message;
    }

    if (data?.messages) {
        return Object.values(data.messages).join("\n");
    }

    if (err.response?.status) {
        return `${fallback} (${err.response.status})`;
    }

    return fallback;
};

export default function Projects() {
    const { role } = getAuth();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [team, setTeam] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [assignmentRole, setAssignmentRole] = useState("");
    const [searchSkill, setSearchSkill] = useState("Java");
    const [searchLevel, setSearchLevel] = useState(3);
    const [projectForm, setProjectForm] = useState(initialProject);
    const [selectedPM, setSelectedPM] = useState({});
    const [createProjectPmUsername, setCreateProjectPmUsername] = useState("");
    const [projectStatusEdits, setProjectStatusEdits] = useState({});

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

            const projectsRes = await api.get("/projects", authConfig());

            setProjects(projectsRes.data);
        } catch (err) {
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    const createProject = async () => {
        if (!projectForm.projectName || !projectForm.clientName || !projectForm.status) {
            alert("Project name, client, and status are required");
            return;
        }

        if (!createProjectPmUsername.trim()) {
            alert("Enter project manager username");
            return;
        }

        try {
            const res = await api.post("/projects", projectForm, authConfig());

            try {
                await api.put(`/projects/${res.data.projectId}/pm?username=${encodeURIComponent(createProjectPmUsername.trim())}`, {}, authConfig());
            } catch (err) {
                alert(`Project created, but PM assignment failed: ${errorMessage(err, "Project manager assignment failed")}`);
            }

            setProjectForm(initialProject);
            setCreateProjectPmUsername("");
            fetchPageData();
        } catch (err) {
            alert(errorMessage(err, "Project creation failed"));
        }
    };

    const assignProjectManagerByUsername = async (projectId) => {
        const username = selectedPM[projectId];

        if (!username || !username.trim()) {
            alert("Enter project manager username");
            return;
        }

        try {
            await api.put(`/projects/${projectId}/pm?username=${encodeURIComponent(username.trim())}`, {}, authConfig());
            setSelectedPM({});
            fetchPageData();
        } catch (err) {
            alert(errorMessage(err, "Project manager assignment failed"));
        }
    };

    const deleteProject = async (projectId) => {
        if (!confirm("Delete this project?")) {
            return;
        }

        try {
            await api.delete(`/projects/${projectId}`, authConfig());
            setProjects((current) => current.filter((project) => project.projectId !== projectId));

            if (String(projectId) === String(selectedProjectId)) {
                setSelectedProjectId("");
                setTeam([]);
            }
        } catch (err) {
            alert(errorMessage(err, "Project deletion failed"));
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
        if (!selectedProjectId || !selectedEmployeeId) {
            alert("Select a project and employee");
            return;
        }

        try {
            await assignCandidate(selectedEmployeeId);
            setSelectedEmployeeId("");
            setAssignmentRole("");
        } catch (err) {
            alert(errorMessage(err, "Assignment failed"));
        }
    };

    const assignCandidate = async (employeeId) => {
        if (!selectedProjectId) {
            alert("Select a project first");
            return;
        }

        try {
            const res = await api.post(`/projects/${selectedProjectId}/assign/${employeeId}`, {
                role: assignmentRole || searchSkill,
                skillName: searchSkill,
                skillLevel: Number(searchLevel)
            }, authConfig());

            setTeam((current) => [...current.filter((member) => member.id !== res.data.id), res.data]);
            fetchTeam(selectedProjectId);
        } catch (err) {
            alert(errorMessage(err, "Assignment failed"));
        }
    };

    const removeTeamMember = async (assignmentId) => {
        if (!selectedProjectId) {
            alert("Select a project");
            return;
        }

        if (!confirm("Remove this employee from the project team?")) {
            return;
        }

        try {
            const path = role === "PM"
                ? `/projects/my/${selectedProjectId}/team/${assignmentId}`
                : `/projects/${selectedProjectId}/team/${assignmentId}`;

            await api.delete(path, authConfig());
            setTeam((current) => current.filter((member) => member.id !== assignmentId));
        } catch (err) {
            alert(errorMessage(err, "Remove team member failed"));
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
            alert(errorMessage(err, "Complete project failed"));
        }
    };

    const updateProjectStatus = async (projectId) => {
        const nextStatus = projectStatusEdits[projectId];

        if (!nextStatus) {
            alert("Select project status");
            return;
        }

        try {
            const path = role === "PM"
                ? `/projects/my/${projectId}/status?status=${encodeURIComponent(nextStatus)}`
                : `/projects/${projectId}/status?status=${encodeURIComponent(nextStatus)}`;

            const res = await api.put(path, {}, authConfig());
            setProjects((current) => current.map((project) => project.projectId === projectId ? res.data : project));

            if (String(projectId) === String(selectedProjectId)) {
                fetchTeam(projectId);
            }
        } catch (err) {
            alert(errorMessage(err, "Project status update failed"));
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
                                <h3 className="card-title">Project Manager Username</h3>
                                <p className="card-meta">Type the PM username from the employee list.</p>
                                <input className="field" placeholder="PM username" value={createProjectPmUsername} onChange={(e) => setCreateProjectPmUsername(e.target.value)} style={{ marginTop: "12px" }} />
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
                                        {!project.projectManager && (
                                            <div className="pm-category-box">
                                                <h3 className="card-title">Assign PM</h3>
                                                <p className="card-meta">Type an available PM username.</p>
                                                <input className="field" placeholder="PM username" value={selectedPM[project.projectId] || ""} onChange={(e) => setSelectedPM({ ...selectedPM, [project.projectId]: e.target.value })} style={{ marginTop: "12px" }} />
                                            </div>
                                        )}
                                        <div className="actions">
                                            {!project.projectManager && (
                                                <button className="primary-button" onClick={() => assignProjectManagerByUsername(project.projectId)}>Assign PM</button>
                                            )}
                                            <button className="secondary-button" onClick={() => fetchTeam(project.projectId)}>View Team</button>
                                            <button className="danger-button" onClick={() => deleteProject(project.projectId)}>Delete</button>
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
                                        <div className="form-grid" style={{ marginTop: "14px" }}>
                                            <select className="field" value={projectStatusEdits[project.projectId] || project.status} onChange={(e) => setProjectStatusEdits({ ...projectStatusEdits, [project.projectId]: e.target.value })}>
                                                <option value="PLANNING">PLANNING</option>
                                                <option value="ACTIVE">ACTIVE</option>
                                                <option value="COMPLETED">COMPLETED</option>
                                            </select>
                                        </div>
                                        <div className="actions">
                                            <button className="secondary-button" onClick={() => updateProjectStatus(project.projectId)}>Update Status</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="panel">
                            <h2 className="card-title">Search Qualified Employees</h2>
                            <div className="form-grid" style={{ marginTop: "14px" }}>
                                <select className="field" value={searchSkill} onChange={(e) => setSearchSkill(e.target.value)}>
                                    {skillOptions.map((skill) => (
                                        <option key={skill} value={skill}>{skill}</option>
                                    ))}
                                </select>
                                <select className="field" value={searchLevel} onChange={(e) => setSearchLevel(e.target.value)}>
                                    <option value="1">Level 1</option>
                                    <option value="2">Level 2</option>
                                    <option value="3">Level 3</option>
                                </select>
                            </div>
                            <div className="actions">
                                <button className="secondary-button" onClick={searchCandidates}>Search</button>
                            </div>
                            <div className="card-grid" style={{ marginTop: "14px" }}>
                                {candidates.map((candidate) => (
                                    <div className="data-card" key={candidate.employeeId}>
                                        <h3 className="card-title">{candidate.fullName || "Employee"}</h3>
                                        <p className="card-meta">Username: {candidate.username || candidate.employeeId || "Not available"}</p>
                                        <p className="card-meta">Email: {candidate.email || "Not available"}</p>
                                        <p className="card-meta">Availability: {candidate.availabilityStatus || "Not available"}</p>
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
                                <input className="field" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} placeholder="Employee username or ID" />
                                <input className="field" value={assignmentRole} onChange={(e) => setAssignmentRole(e.target.value)} placeholder="Project role" />
                            </div>
                            <div className="actions">
                                <button className="primary-button" onClick={assignEmployee}>Assign Employee</button>
                                <button className="danger-button" onClick={completeProject}>Complete Team</button>
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
                                        <th>Username</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {team.map((member) => (
                                        <tr key={member.id}>
                                            <td>{member.username || member.employeeName || member.employeeId}</td>
                                            <td>{member.role}</td>
                                            <td><span className="tag">{member.status}</span></td>
                                            <td>
                                                <button className="danger-button" onClick={() => removeTeamMember(member.id)}>Delete</button>
                                            </td>
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
