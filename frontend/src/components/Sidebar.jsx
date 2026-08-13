import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WeekRibbon from './WeekRibbon';
import './Sidebar.css';

export default function Sidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <WeekRibbon size="sm" />
                MedAI
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/home" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    Dashboard
                </NavLink>
                <NavLink to="/records" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    My Records
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    Profile
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={handleLogout}>Log out</button>
            </div>
        </aside>
    );
}