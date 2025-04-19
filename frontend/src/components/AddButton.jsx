import { useState } from 'react';
import './AddButton.css';

function AddButton({ type, onAdd, fields }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const handleOpenModal = () => {
        const initialData = {};
        fields.forEach(field => {
            initialData[field.name] = '';
        });
        setFormData(initialData);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value, type: inputType } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: inputType === 'number' ? (value === '' ? '' : parseInt(value, 10)) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ensure numeric fields are numbers
        const processedData = {};
        fields.forEach(field => {
            const val = formData[field.name];
            if (field.type === 'number') {
                processedData[field.name] = val === '' ? null : Number(val);
            } else {
                processedData[field.name] = val;
            }
        });

        const success = await onAdd(type, processedData);
        if (success) {
            handleCloseModal();
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

                        <form className="add-form" onSubmit={handleSubmit}>
                            {fields.map(field => (
                                <div className="form-group" key={field.name}>
                                    <label htmlFor={field.name}>
                                        {field.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        {field.required && <span className="required">*</span>}
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type={field.type}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        required={field.required}
                                    />
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
