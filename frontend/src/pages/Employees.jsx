import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { authHeader, getAuth } from "../auth";

export default function Employees() {
    const { role } = getAuth();
    const canEdit = role === "HR";
    const [employees, setEmployees] = useState([]);
    const [edit, setEdit] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://localhost:8081/employees", {
                headers: authHeader()
            });

            setEmployees(res.data);
        } catch (err) {
            setEmployees([]);
        }
    };

    const deleteEmployee = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/employees/${id}`, {
                headers: authHeader()
            });

            alert("Employee Deleted");
            fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.message || "Delete Failed");
        }
    };

    const updateEmployee = async () => {
        try {
            await axios.put(
                `http://localhost:8081/employees/${edit.employeeId}`,
                edit,
                {
                    headers: authHeader()
                }
            );

            alert("Employee Updated Successfully");
            setEdit(null);
            fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.message || "Update Failed");
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", textAlign: "left" }}>
            <Sidebar />

            <main style={mainStyle}>
                <h2>Employees</h2>

                <table border="1" cellPadding="10" style={tableStyle}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Name</th>
                        <th>User Type</th>
                        <th>Department</th>
                        <th>Job Role</th>
                        {canEdit && <th>Actions</th>}
                    </tr>
                    </thead>

                    <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.employeeId}>
                            <td>{emp.employeeId}</td>
                            <td>{emp.username}</td>
                            <td>{emp.fullName}</td>
                            <td>{emp.userType}</td>
                            <td>{emp.department}</td>
                            <td>{emp.jobRole}</td>
                            {canEdit && (
                                <td>
                                    <button onClick={() => setEdit(emp)} style={actionButton}>
                                        Edit
                                    </button>

                                    <button onClick={() => deleteEmployee(emp.employeeId)} style={dangerButton}>
                                        Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>

                {edit && (
                    <div style={overlayStyle}>
                        <div style={modalStyle}>
                            <h3>Edit Employee</h3>

                            <input value={edit.username || ""} onChange={(e) => setEdit({ ...edit, username: e.target.value })} placeholder="Username" style={inputStyle} />
                            <input value={edit.fullName || ""} onChange={(e) => setEdit({ ...edit, fullName: e.target.value })} placeholder="Full name" style={inputStyle} />
                            <input value={edit.email || ""} onChange={(e) => setEdit({ ...edit, email: e.target.value })} placeholder="Email" style={inputStyle} />
                            <input value={edit.department || ""} onChange={(e) => setEdit({ ...edit, department: e.target.value })} placeholder="Department" style={inputStyle} />
                            <input value={edit.jobRole || ""} onChange={(e) => setEdit({ ...edit, jobRole: e.target.value })} placeholder="Job role" style={inputStyle} />
                            <select value={edit.userType || "EMPLOYEE"} onChange={(e) => setEdit({ ...edit, userType: e.target.value })} style={inputStyle}>
                                <option value="HR">HR</option>
                                <option value="PM">PM</option>
                                <option value="EMPLOYEE">EMPLOYEE</option>
                            </select>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button onClick={updateEmployee} style={actionButton}>
                                    Update
                                </button>

                                <button onClick={() => setEdit(null)} style={secondaryButton}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

const mainStyle = {
    flex: 1,
    padding: "30px",
    backgroundColor: "#f8fafc",
    overflowX: "auto"
};

const tableStyle = {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
    background: "white"
};

const actionButton = {
    padding: "8px 12px",
    marginRight: "8px",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer"
};

const dangerButton = {
    padding: "8px 12px",
    background: "#dc2626",
    color: "white",
    border: "none",
    cursor: "pointer"
};

const secondaryButton = {
    padding: "8px 12px",
    background: "#64748b",
    color: "white",
    border: "none",
    cursor: "pointer"
};

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

const modalStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "360px"
};

const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #cbd5e1",
    boxSizing: "border-box"
};
