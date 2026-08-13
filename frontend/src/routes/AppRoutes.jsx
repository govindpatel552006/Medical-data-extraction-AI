import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Home from '../pages/Home';
import UploadPrescription from '../pages/UploadPrescription';
import ReportResult from '../pages/ReportResult';
import PublicPatientRecord from '../pages/PublicPatientRecord';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><UploadPrescription /></ProtectedRoute>} />
            <Route path="/report/:id" element={<ProtectedRoute><ReportResult /></ProtectedRoute>} />
            <Route path="/record/:token" element={<PublicPatientRecord />} />
        </Routes>
    );
}