import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WeekRibbon from './WeekRibbon';
import './Navbar.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/home" className="navbar-brand">
                <WeekRibbon size="sm" />
                MedAI
            </Link>
            <div className="navbar-right">
                <span className="navbar-user">{user?.full_name}</span>
                <button className="navbar-logout" onClick={handleLogout}>Log out</button>
            </div>
        </nav>
    );
}