import { useState, useEffect } from 'react';
import axios from 'axios';
import './AddButton.css';

function AddButton({ type, onAdd, fields, therapists, clients }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [availableTherapists, setAvailableTherapists] = useState([]);
    const [availableClients, setAvailableClients] = useState([]);    // Load therapists and clients data when needed
    useEffect(() => {
        if (isModalOpen && type === 'sessions') {
            const fetchData = async () => {
                try {
                    // If we don't have the data passed in as props, fetch it from the API
                    if (!therapists || therapists.length === 0) {
                        const therapistsResponse = await axios.get('/api/therapists');
                        setAvailableTherapists(therapistsResponse.data);
                    } else {
                        setAvailableTherapists(therapists);
                    }
                    
                    if (!clients || clients.length === 0) {
                        const clientsResponse = await axios.get('/api/clients');
                        setAvailableClients(clientsResponse.data);
                    } else {
                        setAvailableClients(clients);
                    }
                } catch (error) {
                    console.error('Error fetching data for dropdowns:', error);
                }
            };
            
            fetchData();
        }
    }, [isModalOpen, type, therapists, clients]);
    
    const handleOpenModal = () => {
        setIsModalOpen(true);

        const initialData = {};
        fields.forEach(field => {
            // Set default values for select inputs
            if (field.type === 'select' && field.options) {
                initialData[field.name] = field.options[0];
            } else {
                initialData[field.name] = '';
            }
        });
        setFormData(initialData);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? (value ? parseInt(value) : '') : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        const processedData = { ...formData };
        fields.forEach(field => {
            if (field.type === 'number' && processedData[field.name] !== '') {
                processedData[field.name] = parseInt(processedData[field.name]);
            }
        });

        const success = await onAdd(type, processedData);
        if (success) {
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <button className="add-button" onClick={handleOpenModal}>
                <span className="add-icon">+</span> Add
            </button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Add New {type.slice(0, -1)}</h3>
                            <button className="close-button" onClick={handleCloseModal}>×</button>
                        </div>

                        <form className="add-form" onSubmit={handleSubmit}>                            {fields.map(field => (
                                <div className="form-group" key={field.name}>
                                    <label>
                                        {field.name.split('_').map(word =>
                                            word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ')}
                                        {field.required && <span className="required">*</span>}
                                    </label>
                                    
                                    {/* Special handling for therapist selection */}
                                    {field.name === 'therapist_id' && type === 'sessions' ? (
                                        <select
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleChange}
                                            required={field.required}
                                        >
                                            <option value="">Select a Therapist</option>
                                            {availableTherapists.map(therapist => (
                                                <option key={therapist.id} value={therapist.id}>
                                                    {therapist.title} {therapist.name} ({therapist.availability})
                                                </option>
                                            ))}
                                        </select>
                                    ) : 
                                    
                                    /* Special handling for client selection */
                                    field.name === 'client_id' && type === 'sessions' ? (
                                        <select
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleChange}
                                            required={field.required}
                                        >
                                            <option value="">Select a Client</option>
                                            {availableClients.map(client => (
                                                <option key={client.id} value={client.id}>
                                                    {client.name} ({client.regularity})
                                                </option>
                                            ))}
                                        </select>
                                    ) : 
                                    
                                    /* Regular select inputs for status fields */
                                    field.type === 'select' && field.options ? (
                                        <select
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleChange}
                                            required={field.required}
                                        >
                                            {field.options.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        /* Regular input for other fields */
                                        <input
                                            type={field.type === 'number' ? 'number' : 'text'}
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleChange}
                                            required={field.required}
                                        />
                                    )}
                                </div>
                            ))}

                            <div className="form-actions">
                                <button type="button" className="cancel-button" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-button">
                                    Add {type.slice(0, -1)}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddButton;