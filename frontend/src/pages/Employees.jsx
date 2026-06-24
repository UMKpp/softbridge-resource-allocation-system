import { useEffect, useState } from "react";
import axios from "axios";

export default function Employees() {

    const [employees, setEmployees] = useState([]);
    const [edit, setEdit] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    // get employees
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

    // delete employee
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

    // update employee
    const updateEmployee = async () => {
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

            setShowModal(false);
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

            {/* table*/}
            <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
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
                            <button
                                onClick={() => {
                                    setEdit(emp);
                                    setShowModal(true);
                                }}
                            >
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

            {/* model edit*/}
            {showModal && edit && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>

                        <h3>Edit Employee</h3>

                        <input
                            value={edit.username}
                            onChange={(e) =>
                                setEdit({ ...edit, username: e.target.value })
                            }
                            placeholder="Username"
                        />
                        <br /><br />

                        <input
                            value={edit.department}
                            onChange={(e) =>
                                setEdit({ ...edit, department: e.target.value })
                            }
                            placeholder="Department"
                        />
                        <br /><br />

                        <input
                            value={edit.userType}
                            onChange={(e) =>
                                setEdit({ ...edit, userType: e.target.value })
                            }
                            placeholder="User Type"
                        />
                        <br /><br />

                        <button onClick={updateEmployee}>
                            Update
                        </button>

                        <button onClick={() => {
                            setShowModal(false);
                            setEdit(null);
                        }}>
                            Cancel
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}

//styles

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
    borderRadius: "10px",
    width: "300px"
};