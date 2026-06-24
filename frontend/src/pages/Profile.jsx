import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { authHeader, getAuth } from "../auth";

export default function Profile() {
    const { employeeId } = getAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/employees/${employeeId}`, {
                headers: authHeader()
            });

            setProfile(res.data);
        } catch (err) {
            setProfile(null);
        }
    };

    const updateField = (field, value) => {
        setProfile((current) => ({
            ...current,
            [field]: value
        }));
    };

    const updateProfile = async () => {
        try {
            await axios.put(`http://localhost:8081/employees/${employeeId}`, profile, {
                headers: authHeader()
            });

            alert("Profile Updated Successfully");
            fetchProfile();
        } catch (err) {
            alert(err.response?.data?.message || "Update Failed");
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", textAlign: "left" }}>
            <Sidebar />

            <main style={mainStyle}>
                <h2>My Profile</h2>

                {profile && (
                    <div style={formStyle}>
                        <input value={profile.employeeId || ""} disabled style={inputStyle} />
                        <input value={profile.username || ""} disabled style={inputStyle} />
                        <input value={profile.fullName || ""} onChange={(e) => updateField("fullName", e.target.value)} placeholder="Full name" style={inputStyle} />
                        <input value={profile.email || ""} onChange={(e) => updateField("email", e.target.value)} placeholder="Email" style={inputStyle} />
                        <input value={profile.department || ""} onChange={(e) => updateField("department", e.target.value)} placeholder="Department" style={inputStyle} />
                        <input value={profile.jobRole || ""} onChange={(e) => updateField("jobRole", e.target.value)} placeholder="Job role" style={inputStyle} />
                        <input value={profile.userType || ""} disabled style={inputStyle} />

                        <button onClick={updateProfile} style={btnStyle}>
                            Update Profile
                        </button>
                    </div>
                )}
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
