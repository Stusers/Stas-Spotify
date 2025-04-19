// components/DetailView.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailView.css';

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
            setFormData({ ...found });
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

    const handleSubmit = async e => {
        e.preventDefault();
        const payload = { ...formData };
        // convert empty strings for optional fields to null
        Object.keys(payload).forEach(key => {
            if (payload[key] === '') payload[key] = null;
        });
        const success = await onUpdate(type, parseInt(id, 10), payload);
        if (success) {
            setIsEditing(false);
            setItem(payload);
        }
    };

    if (!item) return <div className="detail-view">Not found</div>;

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

            <div className="detail-content">
                <div className="image-container">
                    <img src={item.image_link || '/placeholder.jpg'} alt={item.name} />
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                name="name"
                                type="text"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {type === 'logs' && (
                            <>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="logdesc"
                                        value={formData.logdesc || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input
                                        name="start_date"
                                        type="date"
                                        value={formData.start_date || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                        name="end_date"
                                        type="date"
                                        value={formData.end_date || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Post Date-Time</label>
                                    <input
                                        name="post_date"
                                        type="datetime-local"
                                        value={formData.post_date || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                        {type === 'plans' && (
                            <>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="desc"
                                        value={formData.desc || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                        name="end_date"
                                        type="date"
                                        value={formData.end_date || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        name="location"
                                        type="text"
                                        value={formData.location || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                name="image_link"
                                type="text"
                                value={formData.image_link || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="save-button">Save</button>
                    </form>
                ) : (
                    <div className="info-view">
                        <h1>{item.name}</h1>
                        {type === 'logs' ? (
                            <>
                                <p><strong>Description:</strong> {item.logdesc}</p>
                                <p><strong>Start:</strong> {item.start_date}</p>
                                <p><strong>End:</strong> {item.end_date}</p>
                                <p><strong>Posted:</strong> {item.post_date}</p>
                            </>
                        ) : (
                            <>
                                <p><strong>Description:</strong> {item.desc}</p>
                                <p><strong>Due:</strong> {item.end_date}</p>
                                <p><strong>Location:</strong> {item.location}</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetailView;
