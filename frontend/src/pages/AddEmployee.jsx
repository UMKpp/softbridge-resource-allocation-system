import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { authHeader } from "../auth";

const initialForm = {
    employeeId: "",
    username: "",
    password: "",
    fullName: "",
    email: "",
    department: "",
    jobRole: "",
    userType: "EMPLOYEE"
};

export default function AddEmployee() {
    const [form, setForm] = useState(initialForm);

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        const hasEmptyField = Object.values(form).some((value) => !value);

        if (hasEmptyField) {
            alert("Please fill all fields");
            return;
        }

        try {
            await axios.post("http://localhost:8081/employees", form, {
                headers: authHeader()
            });

            alert("Employee Added Successfully");
            setForm(initialForm);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add employee");
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", textAlign: "left" }}>
            <Sidebar />

            <main style={mainStyle}>
                <h2>Add Employee</h2>

                <div style={formStyle}>
                    <input placeholder="Employee ID" value={form.employeeId} onChange={(e) => updateField("employeeId", e.target.value)} style={inputStyle} />
                    <input placeholder="Username" value={form.username} onChange={(e) => updateField("username", e.target.value)} style={inputStyle} />
                    <input type="password" placeholder="Password" value={form.password} onChange={(e) => updateField("password", e.target.value)} style={inputStyle} />
                    <input placeholder="Full name" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} style={inputStyle} />
                    <input placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} style={inputStyle} />
                    <input placeholder="Department" value={form.department} onChange={(e) => updateField("department", e.target.value)} style={inputStyle} />
                    <input placeholder="Job role" value={form.jobRole} onChange={(e) => updateField("jobRole", e.target.value)} style={inputStyle} />
                    <select value={form.userType} onChange={(e) => updateField("userType", e.target.value)} style={inputStyle}>
                        <option value="HR">HR</option>
                        <option value="PM">PM</option>
                        <option value="EMPLOYEE">EMPLOYEE</option>
                    </select>

                    <button onClick={handleSubmit} style={btnStyle}>
                        Save Employee
                    </button>
                </div>
            </main>
        </div>
    );
}

const mainStyle = {
    flex: 1,
    padding: "30px",
    backgroundColor: "#f8fafc"
};

const formStyle = {
    maxWidth: "480px",
    marginTop: "20px"
};

const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #cbd5e1",
    boxSizing: "border-box"
};

const btnStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer"
};
