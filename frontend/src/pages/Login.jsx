import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { getDashboardPath } from "../auth";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            alert("Please enter username and password");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/auth/login", {
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

            navigate(getDashboardPath(role), { replace: true });
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <p className="eyebrow">Resource Allocation System</p>
                <h1 className="page-title">SoftBridge SRAS</h1>
                <p className="page-subtitle">Sign in to manage resources, projects, skills, and assignments.</p>

                <div className="form-grid" style={{ marginTop: "24px" }}>
                    <input className="field" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button onClick={handleLogin} className="primary-button" style={{ width: "100%", marginTop: "16px" }} disabled={loading}>
                    {loading ? "Signing in" : "Login"}
                </button>
            </div>
        </div>
    );
}
