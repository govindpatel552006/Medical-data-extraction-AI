import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicRecord } from '../api/publicApi';
import WeekRibbon from '../components/WeekRibbon';
import './PublicRecord.css';

export default function PublicPatientRecord() {
    const { token } = useParams();
    const [record, setRecord] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPublicRecord(token)
            .then(setRecord)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) {
        return <div className="public-page"><p className="public-status">Loading record…</p></div>;
    }

    if (error || !record) {
        return (
            <div className="public-page">
                <div className="public-card public-error">
                    <h2>Record not found</h2>
                    <p>This QR code may be invalid or the record was removed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="public-page">
            <div className="public-header">
                <WeekRibbon size="sm" />
                <span>MedAI · Patient Record</span>
            </div>

            <div className="public-card">
                <div className="public-patient-row">
                    <div>
                        <span className="public-label">Patient</span>
                        <h2>{record.patient_name}</h2>
                    </div>
                    <div className="public-meta">
                        {record.patient_age && <span>{record.patient_age} yrs</span>}
                        {record.patient_gender && <span>{record.patient_gender}</span>}
                        {record.patient_blood_group && <span>{record.patient_blood_group}</span>}
                    </div>
                </div>

                <div className="public-section">
                    <span className="public-label">Extracted report</span>
                    <pre className="public-ocr">{record.extracted_text}</pre>
                </div>

                <div className="public-footer">
                    Scanned record · {new Date(record.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
            </div>

            <p className="public-disclaimer">
                This record was shared via QR code and does not require login to view.
            </p>
        </div>
    );
}