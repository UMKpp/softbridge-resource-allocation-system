import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { api, authConfig } from "../api";

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
    const [loading, setLoading] = useState(false);

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

        setLoading(true);

        try {
            await api.post("/employees", form, authConfig());
            setForm(initialForm);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add employee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="content">
                <div className="page-header">
                    <div>
                        <p className="eyebrow">Employees</p>
                        <h1 className="page-title">Add Employee</h1>
                        <p className="page-subtitle">Create a new HR, PM, or employee account.</p>
                    </div>
                </div>

                <section className="panel">
                    <div className="form-grid">
                        <input className="field" placeholder="Employee ID" value={form.employeeId} onChange={(e) => updateField("employeeId", e.target.value)} />
                        <input className="field" placeholder="Username" value={form.username} onChange={(e) => updateField("username", e.target.value)} />
                        <input className="field" type="password" placeholder="Password" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
                        <input className="field" placeholder="Full name" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
                        <input className="field" placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
                        <input className="field" placeholder="Department" value={form.department} onChange={(e) => updateField("department", e.target.value)} />
                        <input className="field" placeholder="Job role" value={form.jobRole} onChange={(e) => updateField("jobRole", e.target.value)} />
                        <select className="field" value={form.userType} onChange={(e) => updateField("userType", e.target.value)}>
                            <option value="HR">HR</option>
                            <option value="PM">PM</option>
                            <option value="EMPLOYEE">EMPLOYEE</option>
                        </select>
                    </div>

                    <div className="actions">
                        <button onClick={handleSubmit} className="primary-button" disabled={loading}>
                            {loading ? "Saving" : "Save Employee"}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
