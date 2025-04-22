import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './DetailView.css';

function formatDisplayValue(value, fieldName) {
    if (!value) return '—';
    const date = new Date(value);
    const isTimeOnly = typeof value === 'string' && value.length <= 8;

    if (fieldName.includes('date') || fieldName.includes('time')) {
        if (isTimeOnly) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        const datePart = date.toISOString().split('T')[0];
        const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return value.includes('T') ? `${datePart} ${timePart}` : datePart;
    }

    return value;
}

function DetailView({ type, data, onDelete, onUpdate }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const found = data.find(d => d.id === parseInt(id, 10));
        if (found) {
            setItem(found);
            const formatted = {};
            Object.entries(found).forEach(([key, val]) => {
                if (key.includes('date') && val) {
                    formatted[key] = new Date(val).toISOString().split('T')[0];
                } else {
                    formatted[key] = val ?? '';
                }
            });
            setFormData(formatted);
        }
    }, [id, data]);

    const goBack = () => navigate('/');

    const handleDelete = () => {
        if (window.confirm(`Delete this ${type.slice(0, -1)}?`)) {
            onDelete(type, parseInt(id, 10));
            goBack();
        }
    };

    const handleChange = e => {
        const { name, value, type: inputType } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: inputType === 'number' ? (value === '' ? '' : parseInt(value, 10)) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const missingFields = ['name', 'desc', 'logdesc'].filter(
            (key) => formData.hasOwnProperty(key) && !formData[key]?.toString().trim()
        );

        if (missingFields.length > 0) {
            toast.error(`Please fill in: ${missingFields.join(', ')}`);
            return;
        }

        const payload = {};
        Object.entries(formData).forEach(([key, value]) => {
            const trimmed = typeof value === 'string' ? value.trim() : value;
            if (['desc', 'logdesc', 'name'].includes(key)) {
                payload[key] = trimmed || '';
            } else {
                payload[key] = trimmed === '' ? null : trimmed;
            }
        });

        const success = await onUpdate(type, parseInt(id, 10), payload);

        if (success) {
            const updated = { ...item, ...payload };
            const formatted = {};
            Object.entries(updated).forEach(([key, val]) => {
                if (key.includes('date') && val) {
                    formatted[key] = new Date(val).toISOString().split('T')[0];
                } else {
                    formatted[key] = val ?? '';
                }
            });

            setItem(updated);
            setFormData(formatted);
            setIsEditing(false);
        }
    };

    if (!item) return <div className="detail-view">Not found</div>;

    const fields = Object.keys(item)
        .filter(k => k !== 'id' && k !== 'user_id')
        .map(key => {
            const label = key.replace(/_/g, ' ');
            const typeAttr = key.includes('date') ? 'date' : 'text';
            const isRequired = ['name', 'logdesc', 'desc'].includes(key);
            return {
                name: key,
                label,
                type: typeAttr,
                required: isRequired
            };
        });

    return (
        <div className="detail-view">
            <header className="detail-header">
                <button onClick={goBack} className="back-button">← Back</button>
                <div>
                    <button onClick={() => setIsEditing(!isEditing)} className="edit-button">
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    <button onClick={handleDelete} className="delete-button">Delete</button>
                </div>
            </header>

            {isEditing ? (
                <form className="edit-form" onSubmit={handleSubmit}>
                    {fields.map(field => (
                        <div key={field.name} className="form-group">
                            <label className={field.required ? 'required' : ''}>
                                {field.label}
                            </label>
                            <input
                                name={field.name}
                                type={field.type}
                                value={formData[field.name] ?? ''}
                                onChange={handleChange}
                                required={field.required}
                            />
                        </div>
                    ))}
                    <button type="submit" className="btn">Save</button>
                </form>
            ) : (
                <div className="view-details styled-details">
                    {fields.map(field => (
                        <div key={field.name} className="detail-line">
                            <span className="label">{field.label}:</span>
                            <span className="value">{formatDisplayValue(item[field.name], field.name)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DetailView;
