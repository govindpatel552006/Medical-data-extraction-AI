import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import WeekRibbon from '../components/WeekRibbon';
import './Auth.css';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '', password: '', full_name: '', age: '',
        gender: '', phone_number: '', blood_group: '', address: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            toast.success('Account created');
            navigate('/home');
        } catch (error) {
            const message = error.response?.data
                ? Object.values(error.response.data).flat().join(' ')
                : 'Registration failed';
            toast.error(message);
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
                    <h1>Start with what your report already says.</h1>
                    <p>
                        We read the prescription so you don't have to guess —
                        then turn it into a week of meals that actually fit
                        your condition.
                    </p>
                </div>
                <div className="auth-brand-footer">SECURE · PRIVATE · YOURS</div>
            </div>

            <div className="auth-form-panel">
                <div className="auth-form-box">
                    <h2>Create your account</h2>
                    <p className="auth-subtitle">A few details to personalize your plan.</p>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="field-label">Full name</label>
                            <input name="full_name" value={formData.full_name} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="field-label">Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="field-label">Password</label>
                            <input name="password" type="password" value={formData.password} onChange={handleChange} required minLength={6} />
                        </div>

                        <div className="field-row">
                            <div>
                                <label className="field-label">Age</label>
                                <input name="age" type="number" value={formData.age} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="field-label">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="field-row">
                            <div>
                                <label className="field-label">Phone</label>
                                <input name="phone_number" value={formData.phone_number} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="field-label">Blood group</label>
                                <input name="blood_group" value={formData.blood_group} onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="field-label">Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating account…' : 'Create account'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}