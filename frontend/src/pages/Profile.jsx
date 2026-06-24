import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { api, authConfig } from "../api";
import { getAuth } from "../auth";

export default function Profile() {
    const { employeeId } = getAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);

        try {
            const res = await api.get(`/employees/${employeeId}`, authConfig());
            setProfile(res.data);
        } catch (err) {
            setProfile(null);
        } finally {
            setLoading(false);
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
            await api.put(`/employees/${employeeId}`, profile, authConfig());
            fetchProfile();
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
                        <p className="eyebrow">Profile</p>
                        <h1 className="page-title">Employee Profile</h1>
                        <p className="page-subtitle">Keep your personal work profile accurate for allocation planning.</p>
                    </div>
                </div>

                <section className="panel">
                    {loading ? (
                        <div className="loading-state">Loading profile</div>
                    ) : !profile ? (
                        <div className="empty-state">Profile unavailable</div>
                    ) : (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <p className="stat-value">{profile.employeeId}</p>
                                    <p className="stat-label">Employee ID</p>
                                </div>
                                <div className="stat-card">
                                    <p className="stat-value">{profile.userType}</p>
                                    <p className="stat-label">Access Role</p>
                                </div>
                            </div>

                            <div className="form-grid">
                                <input className="field" value={profile.username || ""} disabled />
                                <input className="field" value={profile.fullName || ""} onChange={(e) => updateField("fullName", e.target.value)} placeholder="Full name" />
                                <input className="field" value={profile.email || ""} onChange={(e) => updateField("email", e.target.value)} placeholder="Email" />
                                <input className="field" value={profile.department || ""} onChange={(e) => updateField("department", e.target.value)} placeholder="Department" />
                                <input className="field" value={profile.jobRole || ""} onChange={(e) => updateField("jobRole", e.target.value)} placeholder="Job role" />
                                <input className="field" value={profile.userType || ""} disabled />
                            </div>

                            <div className="actions">
                                <button className="primary-button" onClick={updateProfile}>Update Profile</button>
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}
