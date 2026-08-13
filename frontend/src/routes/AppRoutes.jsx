import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import ProtectedRoute from '../components/ProtectedRoute';

// Placeholder for now — we'll build this in the next step
function Home() {
    return <h1>Home Page (Dashboard) — coming next</h1>;
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}