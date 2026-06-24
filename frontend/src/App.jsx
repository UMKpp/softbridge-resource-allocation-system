import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { getAuth, getDashboardPath } from "./auth";

function HomeRedirect() {
    const { token, role } = getAuth();

    if (token && role) {
        return <Navigate to={getDashboardPath(role)} replace />;
    }

    return <Login />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/dashboard" element={<Navigate to={getDashboardPath(getAuth().role)} replace />} />
                <Route
                    path="/hr/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["HR"]}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pm/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["PM"]}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employees"
                    element={
                        <ProtectedRoute allowedRoles={["HR", "PM"]}>
                            <Employees />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/add-employee"
                    element={
                        <ProtectedRoute allowedRoles={["HR"]}>
                            <AddEmployee />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects"
                    element={
                        <ProtectedRoute allowedRoles={["HR", "PM"]}>
                            <Projects />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/skills"
                    element={
                        <ProtectedRoute allowedRoles={["HR"]}>
                            <Skills />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
