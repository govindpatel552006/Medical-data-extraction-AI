import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getMyPrescriptions, generateDietPlan } from '../api/prescriptions';
import toast from 'react-hot-toast';
import './Home.css';

export default function Home() {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const prescriptions = await getMyPrescriptions();

                // Fetch (or generate) each record's diet plan summary in parallel
                const withPlans = await Promise.all(
                    prescriptions.map(async (p) => {
                        try {
                            const plan = await generateDietPlan(p.id);
                            return { ...p, planType: plan.plan_data.summary.plan_type };
                        } catch {
                            return { ...p, planType: null };
                        }
                    })
                );

                setRecords(withPlans);
            } catch {
                toast.error('Could not load your records');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <DashboardLayout>
            <div className="home-container">
                <div className="home-header">
                    <div>
                        <h1>Hi, {user?.full_name?.split(' ')[0]}</h1>
                        <p className="home-subtitle">Here's where things stand.</p>
                    </div>
                    <Link to="/upload" className="btn-primary upload-cta">
                        + Scan new prescription
                    </Link>
                </div>

                <div className="stats-row">
                    <div className="stat-card">
                        <span className="stat-value">{loading ? '—' : records.length}</span>
                        <span className="stat-label">Total scans</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">
                            {records[0] ? new Date(records[0].uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                        </span>
                        <span className="stat-label">Last scan</span>
                    </div>
                </div>

                {loading ? (
                    <p className="home-loading">Loading…</p>
                ) : records.length === 0 ? (
                    <div className="empty-state">
                        <h3>No records yet</h3>
                        <p>Scan your first prescription to get a 7-day plan built around it.</p>
                        <Link to="/upload" className="btn-primary">Scan a prescription</Link>
                    </div>
                ) : (
                    <div className="record-grid">
                        {records.map((p) => (
                            <Link to={`/report/${p.id}`} key={p.id} className="record-card">
                                <div className="record-thumb-wrap">
                                    <img src={p.file} alt="Prescription" className="record-thumb" />
                                </div>
                                <div className="record-info">
                                    <span className="record-date">
                                        {new Date(p.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                    {p.planType && <span className="record-plan-tag">{p.planType}</span>}
                                    <span className="record-view">View plan →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}