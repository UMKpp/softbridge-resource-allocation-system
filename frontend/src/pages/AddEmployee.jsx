import { useState } from "react";
import axios from "axios";

export default function AddEmployee() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [userType, setUserType] = useState("");

    const handleSubmit = async () => {

        // Basic validation
        if (!username || !password || !department || !userType) {
            alert("Please fill all fields");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://localhost:8081/employees",
                {
                    username,
                    password,
                    department,
                    userType
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Employee Added Successfully ");
            console.log(res.data);

            // Clear form
            setUsername("");
            setPassword("");
            setDepartment("");
            setUserType("");

        } catch (err) {
            console.log("ERROR:", err);
            alert(
                err.response?.data?.message ||
                "Failed to add employee"
            );
        }
    };

    return (
        <div style={{
            padding: "30px",
            maxWidth: "400px",
            margin: "0 auto",
            fontFamily: "Arial"
        }}>

            <h2>Add Employee</h2>

            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
            />

            <input
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={inputStyle}
            />

            <input
                placeholder="HR / ADMIN / EMPLOYEE"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                style={inputStyle}
            />

            <button onClick={handleSubmit} style={btnStyle}>
                Save Employee
            </button>

        </div>
    );
}

// Styles
const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc"
};

const btnStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
};