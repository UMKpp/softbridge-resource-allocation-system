export const dashboardPaths = {
    HR: "/hr/dashboard",
    PM: "/pm/dashboard",
    EMPLOYEE: "/employee/dashboard"
};

export const getAuth = () => ({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    employeeId: localStorage.getItem("employeeId")
});

export const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("employeeId");
};

export const getDashboardPath = (role) => dashboardPaths[role] || "/";

export const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
});
