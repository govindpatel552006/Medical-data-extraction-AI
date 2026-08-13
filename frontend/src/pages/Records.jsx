import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { getMyPrescriptions, deletePrescription } from '../api/prescriptions';
import toast from 'react-hot-toast';
import './Records.css';

export default function Records() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        getMyPrescriptions()
            .then(setPrescriptions)
            .catch(() => toast.error('Could not load your records'))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleDelete = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Delete this record? This cannot be undone.')) return;

        try {
            await deletePrescription(id);
            setPrescriptions((prev) => prev.filter((p) => p.id !== id));
            toast.success('Record deleted');
        } catch {
            toast.error('Could not delete record');
        }
    };

    const filtered = prescriptions.filter((p) => {
        const dateStr = new Date(p.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        return dateStr.toLowerCase().includes(search.toLowerCase())
            || (p.extracted_text || '').toLowerCase().includes(search.toLowerCase());
    });

    return (
        <DashboardLayout>
            <div className="records-container">
                <div className="records-header">
                    <h1>My records</h1>
                    <Link to="/upload" className="btn-primary">+ Scan new</Link>
                </div>

                <input
                    className="records-search"
                    placeholder="Search by date or report text…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {loading ? (
                    <p className="home-loading">Loading…</p>
                ) : filtered.length === 0 ? (
                    <p className="home-loading">No matching records.</p>
                ) : (
                    <div className="records-list">
                        {filtered.map((p) => (
                            <Link to={`/report/${p.id}`} key={p.id} className="record-row">
                                <img src={p.file} alt="" className="record-row-thumb" />
                                <div className="record-row-info">
                                    <span className="record-row-date">
                                        {new Date(p.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                    <span className="record-row-preview">
                                        {(p.extracted_text || 'No text extracted').slice(0, 90)}…
                                    </span>
                                </div>
                                <button className="record-row-delete" onClick={(e) => handleDelete(p.id, e)}>
                                    Delete
                                </button>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}