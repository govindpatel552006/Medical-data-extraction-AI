import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

export default function DashboardLayout({ children }) {
    const { user } = useAuth();

    return (
        <div className="app-shell">
            <Sidebar />
            <div className="app-content">
                <header className="app-topbar">
                    <div className="topbar-user">
                        <div className="topbar-avatar">{user?.full_name?.[0]?.toUpperCase()}</div>
                        <div className="topbar-user-text">
                            <span className="topbar-name">{user?.full_name}</span>
                            <span className="topbar-email">{user?.email}</span>
                        </div>
                    </div>
                </header>
                <main className="app-main">{children}</main>
            </div>
        </div>
    );
}