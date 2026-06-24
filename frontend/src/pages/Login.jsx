import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getDashboardPath } from "../auth";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            alert("Please enter username and password");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8081/auth/login", {
                username,
                password
            });

            const { token, role, employeeId } = res.data;

            if (!token || !role) {
                alert("Login failed");
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            if (employeeId) {
                localStorage.setItem("employeeId", employeeId);
            }

            alert("Login Success!");
            navigate(getDashboardPath(role), { replace: true });
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div style={{
            textAlign: "center",
            marginTop: "120px",
            fontFamily: "Arial"
        }}>
            <h2>SoftBridge SRAS Login</h2>

            <div style={{ marginTop: "20px" }}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        padding: "10px",
                        marginBottom: "10px",
                        width: "200px"
                    }}
                />

                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: "10px",
                        marginBottom: "10px",
                        width: "200px"
                    }}
                />

                <br />

                <button
                    onClick={handleLogin}
                    style={{
                        padding: "10px 20px",
                        cursor: "pointer",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px"
                    }}
                >
                    Login
                </button>
            </div>
        </div>
    );
}
