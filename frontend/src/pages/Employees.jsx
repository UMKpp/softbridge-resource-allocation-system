import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { api, authConfig } from "../api";
import { getAuth } from "../auth";

export default function Employees() {
    const { role } = getAuth();
    const canEdit = role === "HR";
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [edit, setEdit] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);

        try {
            const res = await api.get("/employees", authConfig());
            setEmployees(res.data);
        } catch (err) {
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteEmployee = async (id) => {
        try {
            await api.delete(`/employees/${id}`, authConfig());
            fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.message || "Delete Failed");
        }
    };

    const updateEmployee = async () => {
        try {
            await api.put(`/employees/${edit.employeeId}`, edit, authConfig());
            setEdit(null);
            fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.message || "Update Failed");
        }
    };

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="content">
                <div className="page-header">
                    <div>
                        <p className="eyebrow">Employees</p>
                        <h1 className="page-title">Employee Directory</h1>
                        <p className="page-subtitle">{canEdit ? "Manage employee records and role assignment." : "View employee profiles for project planning."}</p>
                    </div>
                </div>

                <section className="panel">
                    {loading ? (
                        <div className="loading-state">Loading employees</div>
                    ) : employees.length === 0 ? (
                        <div className="empty-state">No employees available</div>
                    ) : (
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Job Role</th>
                                    {canEdit && <th>Actions</th>}
                                </tr>
                                </thead>
                                <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.employeeId}>
                                        <td>{employee.employeeId}</td>
                                        <td>
                                            <strong>{employee.fullName}</strong>
                                            <div className="card-meta">{employee.email}</div>
                                        </td>
                                        <td><span className="tag">{employee.userType}</span></td>
                                        <td>{employee.department}</td>
                                        <td>{employee.jobRole}</td>
                                        {canEdit && (
                                            <td>
                                                <div className="actions" style={{ marginTop: 0 }}>
                                                    <button className="secondary-button" onClick={() => setEdit(employee)}>Edit</button>
                                                    <button className="danger-button" onClick={() => deleteEmployee(employee.employeeId)}>Delete</button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {edit && (
                    <section className="panel" style={{ marginTop: "18px" }}>
                        <h2 className="card-title">Edit Employee</h2>
                        <div className="form-grid" style={{ marginTop: "14px" }}>
                            <input className="field" value={edit.username || ""} onChange={(e) => setEdit({ ...edit, username: e.target.value })} placeholder="Username" />
                            <input className="field" value={edit.fullName || ""} onChange={(e) => setEdit({ ...edit, fullName: e.target.value })} placeholder="Full name" />
                            <input className="field" value={edit.email || ""} onChange={(e) => setEdit({ ...edit, email: e.target.value })} placeholder="Email" />
                            <input className="field" value={edit.department || ""} onChange={(e) => setEdit({ ...edit, department: e.target.value })} placeholder="Department" />
                            <input className="field" value={edit.jobRole || ""} onChange={(e) => setEdit({ ...edit, jobRole: e.target.value })} placeholder="Job role" />
                            <select className="field" value={edit.userType || "EMPLOYEE"} onChange={(e) => setEdit({ ...edit, userType: e.target.value })}>
                                <option value="HR">HR</option>
                                <option value="PM">PM</option>
                                <option value="EMPLOYEE">EMPLOYEE</option>
                            </select>
                        </div>
                        <div className="actions">
                            <button className="primary-button" onClick={updateEmployee}>Update</button>
                            <button className="secondary-button" onClick={() => setEdit(null)}>Cancel</button>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
