import { useEffect, useState } from "react";
import axios from "axios";

export default function Employees() {

    const [employees, setEmployees] = useState([]);
    const [edit, setEdit] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:8081/employees", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setEmployees(res.data);

        } catch (err) {
            console.log("ERROR:", err);
        }
    };

    const deleteEmployee = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(`http://localhost:8081/employees/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Employee Deleted");
            fetchEmployees();

        } catch (err) {
            console.log(err);
            alert("Delete Failed");
        }
    };

    const updateEmployee = async () => {

        if (!edit) return;

        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8081/employees/${edit.employeeId}`,
                edit,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Employee Updated Successfully!");

            setEdit(null);
            fetchEmployees();

        } catch (err) {
            console.log(err);
            alert("Update Failed");
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h2>Employees List</h2>

            <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>User Type</th>
                    <th>Department</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {employees.map((emp) => (
                    <tr key={emp.employeeId}>
                        <td>{emp.employeeId}</td>
                        <td>{emp.username}</td>
                        <td>{emp.userType}</td>
                        <td>{emp.department}</td>

                        <td>
                            <button onClick={() => setEdit(emp)}>
                                Edit
                            </button>

                            <button onClick={() => deleteEmployee(emp.employeeId)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* EDIT FORM */}
            {edit && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Edit Employee</h3>

                    <input
                        value={edit.username}
                        onChange={(e) =>
                            setEdit({ ...edit, username: e.target.value })
                        }
                    />
                    <br /><br />

                    <input
                        value={edit.department}
                        onChange={(e) =>
                            setEdit({ ...edit, department: e.target.value })
                        }
                    />
                    <br /><br />

                    <input
                        value={edit.userType}
                        onChange={(e) =>
                            setEdit({ ...edit, userType: e.target.value })
                        }
                    />
                    <br /><br />

                    <button onClick={updateEmployee}>
                        Update
                    </button>
                </div>
            )}
        </div>
    );
}