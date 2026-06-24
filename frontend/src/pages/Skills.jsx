import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { api, authConfig } from "../api";
import { getAuth } from "../auth";

const initialSkill = {
    skillName: "",
    skillCategory: "",
    skillLevel: 1
};

export default function Skills() {
    const { role } = getAuth();
    const [loading, setLoading] = useState(true);
    const [skills, setSkills] = useState([]);
    const [form, setForm] = useState(initialSkill);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        setLoading(true);

        try {
            const res = await api.get(role === "EMPLOYEE" ? "/skills/me" : "/skills", authConfig());
            setSkills(res.data);
        } catch (err) {
            setSkills([]);
        } finally {
            setLoading(false);
        }
    };

    const submitSkill = async () => {
        if (!form.skillName || !form.skillCategory) {
            alert("Skill name and category are required");
            return;
        }

        try {
            if (role === "EMPLOYEE") {
                const body = {
                    skillName: form.skillName,
                    skillCategory: form.skillCategory,
                    skillLevel: Number(form.skillLevel)
                };

                if (editing) {
                    await api.put(`/skills/me/${editing.id}`, body, authConfig());
                } else {
                    await api.post("/skills/me", body, authConfig());
                }
            } else if (editing) {
                await api.put(`/skills/${editing.skillId}`, {
                    skillName: form.skillName,
                    skillCategory: form.skillCategory
                }, authConfig());
            } else {
                await api.post("/skills", {
                    skillName: form.skillName,
                    skillCategory: form.skillCategory
                }, authConfig());
            }

            setForm(initialSkill);
            setEditing(null);
            fetchSkills();
        } catch (err) {
            alert(err.response?.data?.message || "Skill save failed");
        }
    };

    const editSkill = (skill) => {
        setEditing(skill);
        setForm({
            skillName: skill.skillName,
            skillCategory: skill.skillCategory || "",
            skillLevel: skill.skillLevel || 1
        });
    };

    const deleteSkill = async (skill) => {
        try {
            await api.delete(role === "EMPLOYEE" ? `/skills/me/${skill.id}` : `/skills/${skill.skillId}`, authConfig());
            fetchSkills();
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="content">
                <div className="page-header">
                    <div>
                        <p className="eyebrow">Skills</p>
                        <h1 className="page-title">{role === "EMPLOYEE" ? "My Skills" : "Skill Catalog"}</h1>
                        <p className="page-subtitle">
                            {role === "EMPLOYEE" ? "Maintain your own skills and proficiency levels." : "Manage the skill catalog used for project allocation."}
                        </p>
                    </div>
                </div>

                <section className="panel" style={{ marginBottom: "18px" }}>
                    <h2 className="card-title">{editing ? "Update Skill" : "Add Skill"}</h2>
                    <div className="form-grid" style={{ marginTop: "14px" }}>
                        <input className="field" placeholder="Skill name" value={form.skillName} onChange={(e) => setForm({ ...form, skillName: e.target.value })} />
                        <input className="field" placeholder="Category" value={form.skillCategory} onChange={(e) => setForm({ ...form, skillCategory: e.target.value })} />
                        {role === "EMPLOYEE" && (
                            <select className="field" value={form.skillLevel} onChange={(e) => setForm({ ...form, skillLevel: e.target.value })}>
                                <option value="1">Level 1</option>
                                <option value="2">Level 2</option>
                                <option value="3">Level 3</option>
                            </select>
                        )}
                    </div>
                    <div className="actions">
                        <button className="primary-button" onClick={submitSkill}>{editing ? "Update" : "Save"}</button>
                        {editing && <button className="secondary-button" onClick={() => { setEditing(null); setForm(initialSkill); }}>Cancel</button>}
                    </div>
                </section>

                <section className="panel">
                    <h2 className="card-title">{role === "EMPLOYEE" ? "Current Skills" : "Global Skills"}</h2>

                    {loading ? (
                        <div className="loading-state">Loading skills</div>
                    ) : skills.length === 0 ? (
                        <div className="empty-state">No skills available</div>
                    ) : (
                        <div className="card-grid" style={{ marginTop: "14px" }}>
                            {skills.map((skill) => (
                                <div className="data-card" key={role === "EMPLOYEE" ? skill.id : skill.skillId}>
                                    <h3 className="card-title">{skill.skillName}</h3>
                                    <p className="card-meta">{skill.skillCategory || "Employee skill"}</p>
                                    <div className="tag-row">
                                        {role === "EMPLOYEE" && <span className="tag">Level {skill.skillLevel}</span>}
                                    </div>
                                    <div className="actions">
                                        <button className="secondary-button" onClick={() => editSkill(skill)}>Edit</button>
                                        <button className="danger-button" onClick={() => deleteSkill(skill)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
