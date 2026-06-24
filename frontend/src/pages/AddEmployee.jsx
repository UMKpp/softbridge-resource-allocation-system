import { useState } from "react";
import axios from "axios";

export default function AddEmployee() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [userType, setUserType] = useState("");

    const handleSubmit = async () => {
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

            alert("Employee Added Successfully!");
            console.log(res.data);

        } catch (err) {
            console.log(err);
            alert("Failed to add employee");
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h2>Add Employee</h2>

            <input placeholder="Username"
                   onChange={(e) => setUsername(e.target.value)} />
            <br /><br />

            <input placeholder="Password"
                   onChange={(e) => setPassword(e.target.value)} />
            <br /><br />

            <input placeholder="Department"
                   onChange={(e) => setDepartment(e.target.value)} />
            <br /><br />

            <input placeholder="User Type (HR/ADMIN)"
                   onChange={(e) => setUserType(e.target.value)} />
            <br /><br />

            <button onClick={handleSubmit}>
                Add Employee
            </button>
        </div>
    );
}