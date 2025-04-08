
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailView.css';

function DetailView({ type, data, onDelete, onUpdate }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [therapists, setTherapists] = useState([]);
    const [clients, setClients] = useState([]);    useEffect(() => {
        const foundItem = data.find(item => item.id === parseInt(id));
        if (foundItem) {
            setItem(foundItem);
            setFormData(foundItem);
        }
    }, [id, data]);
    
    // Fetch therapists and clients when editing a session
    useEffect(() => {
        if (isEditing && type === 'sessions') {
            const fetchRelatedData = async () => {
                try {
                    const [therapistsRes, clientsRes] = await Promise.all([
                        axios.get('/api/therapists'),
                        axios.get('/api/clients')
                    ]);
                    setTherapists(therapistsRes.data);
                    setClients(clientsRes.data);
                } catch (error) {
                    console.error('Error fetching related data:', error);
                }
            };
            
            fetchRelatedData();
        }
    }, [isEditing, type]);

    const goBack = () => {
        navigate('/');
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
            onDelete(type, parseInt(id));
            goBack();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'monthly_listeners' || name === 'genre' || name === 'image_link' || name === 'number_of_listens'
                ? value
                : name === 'artist_id' || name === 'album_id' || name === 'release_year'
                    ? parseInt(value)
                    : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onUpdate(type, parseInt(id), formData);
        if (success) {
            setIsEditing(false);
            setItem(formData);
        }
    };

    if (!item) {
        return <div className="detail-view">Item not found</div>;
    }

    return (
        <div className="detail-view">
            <div className="detail-header">
                <button className="back-button" onClick={goBack}>← Back</button>
                <div className="detail-actions">
                    <button
                        className={`edit-button ${isEditing ? 'active' : ''}`}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    <button className="delete-button" onClick={handleDelete}>Delete</button>
                </div>
            </div>

            <div className="detail-content">
                <div className="detail-image">
                    <img src={item.image_link || '/placeholder.jpg'} alt={item.name} />
                </div>

                {isEditing ? (
                    <form className="edit-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>                        {type === 'therapists' && (
                            <>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Years of Practice</label>
                                    <input
                                        type="number"
                                        name="years_of_practice"
                                        value={formData.years_of_practice || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Availability</label>
                                    <select
                                        name="availability"
                                        value={formData.availability || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select availability</option>
                                        <option value="TAKING CLIENTS">TAKING CLIENTS</option>
                                        <option value="NOT TAKING CLIENTS">NOT TAKING CLIENTS</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {type === 'clients' && (
                            <>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Appointment Regularity</label>
                                    <select
                                        name="regularity"
                                        value={formData.regularity || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select regularity</option>
                                        <option value="WEEKLY">WEEKLY</option>
                                        <option value="MONTHLY">MONTHLY</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {type === 'sessions' && (
                            <>                                <div className="form-group">
                                    <label>Therapist</label>
                                    <select
                                        name="therapist_id"
                                        value={formData.therapist_id || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Therapist</option>
                                        {therapists.map(therapist => (
                                            <option key={therapist.id} value={therapist.id}>
                                                {therapist.title} {therapist.name} ({therapist.availability})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Client</label>
                                    <select
                                        name="client_id"
                                        value={formData.client_id || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Client</option>
                                        {clients.map(client => (
                                            <option key={client.id} value={client.id}>
                                                {client.name} ({client.regularity})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Notes</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes || ''}
                                        onChange={handleChange}
                                        rows="4"
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        name="date"
                                        value={formData.date ? formData.date.replace(' ', 'T') : ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Length (minutes)</label>
                                    <input
                                        type="number"
                                        name="length_minutes"
                                        value={formData.length_minutes || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        name="status"
                                        value={formData.status || 'SCHEDULED'}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="SCHEDULED">SCHEDULED</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Payment Status</label>
                                    <select
                                        name="payment_status"
                                        value={formData.payment_status || 'PENDING'}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="PAID">PAID</option>
                                        <option value="PENDING">PENDING</option>
                                        <option value="WAIVED">WAIVED</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                type="text"
                                name="image_link"
                                value={formData.image_link || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="save-button">Save Changes</button>
                    </form>
                ) : (                    <div className="detail-info">
                        <h1>{item.name || (type === 'sessions' ? `Session on ${new Date(item.date).toLocaleDateString()}` : '')}</h1>

                        {type === 'therapists' && (
                            <>
                                <p><span>Title:</span> {item.title}</p>
                                <p><span>Email:</span> {item.email}</p>
                                <p><span>Location:</span> {item.location}</p>
                                <p><span>Years of Practice:</span> {item.years_of_practice}</p>
                                <p><span>Availability:</span> {item.availability}</p>
                            </>
                        )}

                        {type === 'clients' && (
                            <>
                                <p><span>Email:</span> {item.email}</p>
                                <p><span>Phone:</span> {item.phone}</p>
                                <p><span>Appointment Regularity:</span> {item.regularity}</p>
                            </>
                        )}

                        {type === 'sessions' && (
                            <>
                                <p><span>Therapist ID:</span> {item.therapist_id}</p>
                                <p><span>Client ID:</span> {item.client_id}</p>
                                <p><span>Date:</span> {new Date(item.date).toLocaleString()}</p>
                                <p><span>Length:</span> {item.length_minutes} minutes</p>
                                <p><span>Status:</span> {item.status || 'SCHEDULED'}</p>
                                <p><span>Payment Status:</span> {item.payment_status || 'PENDING'}</p>
                                <p><span>Notes:</span> {item.notes}</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetailView;