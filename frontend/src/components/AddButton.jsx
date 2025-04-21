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

        // ✅ Validate required fields
        const missingFields = fields.filter(
            (field) => field.required && !formData[field.name]?.toString().trim()
        );

        if (missingFields.length > 0) {
            alert(`Please fill in the required field(s): ${missingFields.map(f => f.label).join(', ')}`);
            return;
        }

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
        if (success) handleCloseModal();
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
                                <div key={field.name} className="form-group">
                                    <label className={field.required ? 'required' : ''}>
                                        {field.label}
                                    </label>
                                    <input
                                        name={field.name}
                                        type={field.type}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        required={field.required}
                                    />
                                </div>
                            ))}
                            <button type="submit" className="btn">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddButton;
