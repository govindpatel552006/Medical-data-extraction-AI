import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import WeekRibbon from '../components/WeekRibbon';
import './Auth.css';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back');
            navigate('/home');
        } catch (error) {
            toast.error('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-brand-panel">
                <div className="auth-brand-mark">
                    <WeekRibbon size="sm" />
                    MedAI
                </div>
                <div className="auth-brand-copy">
                    <h1>Your prescription, understood.</h1>
                    <p>
                        Scan a report, get a 7-day plan built around what your
                        body actually needs — and a record your doctor can
                        pull up in one scan.
                    </p>
                </div>
                <div className="auth-brand-footer">SECURE · PRIVATE · YOURS</div>
            </div>

            <div className="auth-form-panel">
                <div className="auth-form-box">
                    <h2>Welcome back</h2>
                    <p className="auth-subtitle">Log in to see your latest plan.</p>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="field-label">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label className="field-label">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Logging in…' : 'Log in'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}