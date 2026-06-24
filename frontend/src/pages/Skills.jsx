import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { authHeader } from "../auth";

export default function Skills() {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await axios.get("http://localhost:8081/skills", {
                headers: authHeader()
            });

            setSkills(res.data);
        } catch (err) {
            setSkills([]);
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", textAlign: "left" }}>
            <Sidebar />

            <main style={mainStyle}>
                <h2>Skills</h2>

                <table border="1" cellPadding="10" style={tableStyle}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Skill</th>
                        <th>Category</th>
                    </tr>
                    </thead>
                    <tbody>
                    {skills.map((skill) => (
                        <tr key={skill.skillId}>
                            <td>{skill.skillId}</td>
                            <td>{skill.skillName}</td>
                            <td>{skill.skillCategory}</td>
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
