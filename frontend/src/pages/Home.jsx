import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getMyPrescriptions } from '../api/prescriptions';
import toast from 'react-hot-toast';
import './Home.css';

export default function Home() {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyPrescriptions()
            .then(setPrescriptions)
            .catch(() => toast.error('Could not load your records'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <Navbar />
            <div className="home-container">
                <div className="home-header">
                    <div>
                        <h1>Hi, {user?.full_name?.split(' ')[0]}</h1>
                        <p className="home-subtitle">Here's what we know about your health so far.</p>
                    </div>
                    <Link to="/upload" className="btn-primary upload-cta">
                        + Scan new prescription
                    </Link>
                </div>

                {loading ? (
                    <p className="home-loading">Loading your records…</p>
                ) : prescriptions.length === 0 ? (
                    <div className="empty-state">
                        <h3>No records yet</h3>
                        <p>Scan your first prescription to get a 7-day plan built around it.</p>
                        <Link to="/upload" className="btn-primary">Scan a prescription</Link>
                    </div>
                ) : (
                    <div className="record-grid">
                        {prescriptions.map((p) => (
                            <Link to={`/report/${p.id}`} key={p.id} className="record-card">
                                <img src={p.file} alt="Prescription" className="record-thumb" />
                                <div className="record-info">
                                    <span className="record-date">
                                        {new Date(p.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                    <span className="record-view">View plan →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}