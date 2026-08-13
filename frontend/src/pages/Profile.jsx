import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getProfile, updateProfile } from '../api/profile';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getProfile()
            .then(setFormData)
            .catch(() => toast.error('Could not load profile'))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await updateProfile(formData);
            setFormData(updated);
            toast.success('Profile updated');
        } catch {
            toast.error('Could not update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading || !formData) {
        return <DashboardLayout><p className="home-loading">Loading…</p></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <div className="profile-container">
                <h1>Your profile</h1>
                <p className="home-subtitle">Kept accurate, this helps your diet plans stay relevant.</p>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div>
                        <label className="field-label">Full name</label>
                        <input name="full_name" value={formData.full_name || ''} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="field-label">Email</label>
                        <input value={formData.email} disabled />
                    </div>

                    <div className="field-row">
                        <div>
                            <label className="field-label">Age</label>
                            <input name="age" type="number" value={formData.age || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="field-label">Gender</label>
                            <select name="gender" value={formData.gender || ''} onChange={handleChange}>
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
                            <input name="phone_number" value={formData.phone_number || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="field-label">Blood group</label>
                            <input name="blood_group" value={formData.blood_group || ''} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="field-label">Address</label>
                        <textarea name="address" value={formData.address || ''} onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Saving…' : 'Save changes'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}