import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { uploadPrescription } from '../api/prescriptions';
import toast from 'react-hot-toast';
import './Upload.css';

export default function UploadPrescription() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Choose an image first');
            return;
        }
        setUploading(true);
        try {
            const result = await uploadPrescription(file);
            toast.success('Prescription scanned');
            navigate(`/report/${result.id}`);
        } catch (error) {
            toast.error('Upload failed — try a clearer image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="upload-container">
                <h1>Scan a prescription</h1>
                <p className="upload-subtitle">
                    Upload a clear photo of your prescription or lab report. We'll read it and build your plan.
                </p>

                <label className="upload-dropzone">
                    {preview ? (
                        <img src={preview} alt="Preview" className="upload-preview" />
                    ) : (
                        <div className="upload-placeholder">
                            <span className="upload-icon">＋</span>
                            <span>Click to choose a photo</span>
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                </label>

                <button
                    className="btn-primary upload-submit"
                    onClick={handleUpload}
                    disabled={uploading || !file}
                >
                    {uploading ? 'Reading your report…' : 'Generate my plan'}
                </button>
            </div>
        </div>
    );
}