import { Navigate } from "react-router-dom";
import { getAuth, getDashboardPath } from "../auth";

export default function ProtectedRoute({ allowedRoles, children }) {
    const { token, role } = getAuth();

    if (!token || !role) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to={getDashboardPath(role)} replace />;
    }

    return children;
}
