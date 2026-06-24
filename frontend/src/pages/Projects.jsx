import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { authHeader } from "../auth";

export default function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await axios.get("http://localhost:8081/projects", {
                headers: authHeader()
            });

            setProjects(res.data);
        } catch (err) {
            setProjects([]);
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", textAlign: "left" }}>
            <Sidebar />

            <main style={mainStyle}>
                <h2>Projects</h2>

                <table border="1" cellPadding="10" style={tableStyle}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Project</th>
                        <th>Client</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map((project) => (
                        <tr key={project.projectId}>
                            <td>{project.projectId}</td>
                            <td>{project.projectName}</td>
                            <td>{project.clientName}</td>
                            <td>{project.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

const mainStyle = {
    flex: 1,
    padding: "30px",
    backgroundColor: "#f8fafc",
    overflowX: "auto"
};

const tableStyle = {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
    background: "white"
};
