import { useState } from 'react';
import './AddButton.css';

function AddButton({ type, onAdd, fields }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const handleOpenModal = () => {
        setIsModalOpen(true);


        const initialData = {};
        fields.forEach(field => {
            initialData[field.name] = field.type === 'number' ? '' : '';
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

                        <form className="add-form" onSubmit={handleSubmit}>
                            {fields.map(field => (
                                <div className="form-group" key={field.name}>
                                    <label>
                                        {field.name.split('_').map(word =>
                                            word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ')}
                                        {field.required && <span className="required">*</span>}
                                    </label>
                                    <input
                                        type={field.type === 'number' ? 'number' : 'text'}
                                        name={field.name}
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