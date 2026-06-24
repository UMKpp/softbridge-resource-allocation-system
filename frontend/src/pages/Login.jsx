import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:8081/auth/login", {
                username,
                password,
            });

            const token = res.data.token;

            alert("Login Success!");

            console.log("JWT TOKEN:", token);

            // SAVE TOKEN
            localStorage.setItem("token", token);

            // redirect later (next step)
        }
        catch (err) {
            console.log("ERROR:", err.response?.data);
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>SRAS Login</h2>

            <input
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <br /><br />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}