import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { authHeader, getAuth } from "../auth";

export default function Dashboard() {
    const { role } = getAuth();
    const [stats, setStats] = useState({
        employees: 0,
        projects: 0,
        skills: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const requests = [
                axios.get("http://localhost:8081/employees", {
                    headers: authHeader()
                }),
                axios.get("http://localhost:8081/projects", {
                    headers: authHeader()
                })
            ];

            if (role === "HR") {
                requests.push(axios.get("http://localhost:8081/skills", {
                    headers: authHeader()
                }));
            }

            const responses = await Promise.all(requests);

            setStats({
                employees: responses[0].data.length,
                projects: responses[1].data.length,
                skills: responses[2]?.data.length || 0
            });
        } catch (err) {
            setStats({
                employees: 0,
                projects: 0,
                skills: 0
            });
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", textAlign: "left" }}>
            <Sidebar />

            <main style={mainStyle}>
                <h1>{role === "HR" ? "HR Dashboard" : "Project Manager Dashboard"}</h1>
                <p>Welcome to SoftBridge Resource Allocation System</p>

                <div style={cardContainer}>
                    <div style={card}>
                        <h2>{stats.employees}</h2>
                        <p>Total Employees</p>
                    </div>

                    <div style={card}>
                        <h2>{stats.projects}</h2>
                        <p>Active Projects</p>
                    </div>

                    {role === "HR" && (
                        <div style={card}>
                            <h2>{stats.skills}</h2>
                            <p>Skills Tracked</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

const mainStyle = {
    flex: 1,
    padding: "30px",
    backgroundColor: "#f1f5f9"
};

const cardContainer = {
    display: "flex",
    gap: "20px",
    marginTop: "30px",
    flexWrap: "wrap"
};

const card = {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "200px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};
