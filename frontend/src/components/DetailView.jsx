
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
        const foundItem = data.find(item => item.id === parseInt(id));
        if (foundItem) {
            setItem(foundItem);
            setFormData(foundItem);
        }
    }, [id, data]);

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
                        </div>

                        {type === 'artists' && (
                            <>
                                <div className="form-group">
                                    <label>Monthly Listeners</label>
                                    <input
                                        type="text"
                                        name="monthly_listeners"
                                        value={formData.monthly_listeners || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Genre</label>
                                    <input
                                        type="text"
                                        name="genre"
                                        value={formData.genre || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                        {type === 'albums' && (
                            <>
                                <div className="form-group">
                                    <label>Artist ID</label>
                                    <input
                                        type="number"
                                        name="artist_id"
                                        value={formData.artist_id || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Release Year</label>
                                    <input
                                        type="number"
                                        name="release_year"
                                        value={formData.release_year || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Number of Listens</label>
                                    <input
                                        type="text"
                                        name="number_of_listens"
                                        value={formData.number_of_listens || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                        {type === 'songs' && (
                            <>
                                <div className="form-group">
                                    <label>Release Year</label>
                                    <input
                                        type="number"
                                        name="release_year"
                                        value={formData.release_year || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Album ID</label>
                                    <input
                                        type="number"
                                        name="album_id"
                                        value={formData.album_id || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Artist ID</label>
                                    <input
                                        type="number"
                                        name="artist_id"
                                        value={formData.artist_id || ''}
                                        onChange={handleChange}
                                        required
                                    />
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
                ) : (
                    <div className="detail-info">
                        <h1>{item.name}</h1>

                        {type === 'artists' && (
                            <>
                                <p><span>Monthly Listeners:</span> {item.monthly_listeners}</p>
                                <p><span>Genre:</span> {item.genre}</p>
                            </>
                        )}

                        {type === 'albums' && (
                            <>
                                <p><span>Artist ID:</span> {item.artist_id}</p>
                                <p><span>Release Year:</span> {item.release_year}</p>
                                <p><span>Listens:</span> {item.number_of_listens}</p>
                            </>
                        )}

                        {type === 'songs' && (
                            <>
                                <p><span>Release Year:</span> {item.release_year}</p>
                                <p><span>Album ID:</span> {item.album_id}</p>
                                <p><span>Artist ID:</span> {item.artist_id}</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetailView;