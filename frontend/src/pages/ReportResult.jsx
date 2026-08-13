import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import WeekRibbon from '../components/WeekRibbon';
import { getMyPrescriptions, generateDietPlan } from '../api/prescriptions';
import toast from 'react-hot-toast';
import './Report.css';

export default function ReportResult() {
    const { id } = useParams();
    const [prescription, setPrescription] = useState(null);
    const [dietPlan, setDietPlan] = useState(null);
    const [activeDay, setActiveDay] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const records = await getMyPrescriptions();
                const current = records.find((r) => r.id === id);
                setPrescription(current);

                const plan = await generateDietPlan(id);
                setDietPlan(plan);
            } catch (error) {
                toast.error('Could not load this report');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <p className="report-loading">Reading your report…</p>
            </DashboardLayout>
        );
    }

    if (!prescription || !dietPlan) {
        return (
            <DashboardLayout>
                <p className="report-loading">Report not found.</p>
            </DashboardLayout>
        );
    }

    const dayKey = `Day ${activeDay}`;
    const dayPlan = dietPlan.plan_data.days[dayKey];

    return (
        <DashboardLayout>
            <div className="report-container">
                <div className="report-top">
                    <div className="report-left">
                        <span className="report-eyebrow">{dietPlan.plan_data.summary.plan_type}</span>
                        <h1>Your 7-day plan</h1>

                        <div className="ocr-card">
                            <h3>What we read from your report</h3>
                            <pre className="ocr-text">{prescription.extracted_text}</pre>
                        </div>

                        <div className="food-lists">
                            <div className="food-card include">
                                <h4>Include</h4>
                                <ul>
                                    {dietPlan.plan_data.summary.foods_to_include.map((f) => <li key={f}>{f}</li>)}
                                </ul>
                            </div>
                            <div className="food-card avoid">
                                <h4>Avoid</h4>
                                <ul>
                                    {dietPlan.plan_data.summary.foods_to_avoid.map((f) => <li key={f}>{f}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="report-right">
                        <div className="qr-card">
                            <h4>Share this record</h4>
                            <img src={prescription.qr_code} alt="QR code" className="qr-image" />
                            <p className="qr-caption">Scan to view this record</p>
                        </div>
                    </div>
                </div>

                <div className="day-selector">
                    <WeekRibbon activeDay={activeDay} />
                    <div className="day-buttons">
                        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                            <button
                                key={d}
                                className={`day-btn ${activeDay === d ? 'active' : ''}`}
                                onClick={() => setActiveDay(d)}
                            >
                                Day {d}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="meal-grid">
                    {Object.entries(dayPlan).map(([meal, suggestion]) => (
                        <div className="meal-card" key={meal}>
                            <span className="meal-label">{meal}</span>
                            <p>{suggestion}</p>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}