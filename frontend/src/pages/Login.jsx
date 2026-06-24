import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        // ✅ Validation
        if (!username || !password) {
            alert("Please enter username and password");
            return;
        }

        try {
            // 🔥 Call backend login API
            const res = await axios.post("http://localhost:8081/auth/login", {
                username,
                password,
            });

            console.log("LOGIN RESPONSE:", res.data);

            const token = res.data.token;

            // ❌ If token not received
            if (!token) {
                alert("Login failed: No token received");
                return;
            }

            // ✅ Save token in browser
            localStorage.setItem("token", token);

            alert("Login Success!");

            console.log("JWT TOKEN:", token);

            // 🚀 Redirect to dashboard
            window.location.href = "/dashboard";

        } catch (err) {
            console.log("LOGIN ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Login Failed"
            );
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