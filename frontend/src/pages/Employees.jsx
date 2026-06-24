import { useEffect, useState } from "react";
import axios from "axios";

export default function Employees() {
    const [employees, setEmployees] = useState([]);

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
                </tr>
                </thead>

                <tbody>
                {employees.map((emp) => (
                    <tr key={emp.employeeId}>
                        <td>{emp.employeeId}</td>
                        <td>{emp.username}</td>
                        <td>{emp.userType}</td>
                        <td>{emp.department}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}