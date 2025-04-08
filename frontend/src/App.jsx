import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import './index.css'; // Make sure this is here!
import Carousel from './components/Carousel';
import DetailView from './components/DetailView';
import AddButton from './components/AddButton';
import { fallbackData } from './fallbackData';

function App() {
    const [therapists, setTherapists] = useState([]);
    const [clients, setClients] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usingFallback, setUsingFallback] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [therapistsRes, clientsRes, sessionsRes] = await Promise.all([
                    axios.get('/api/therapists'),
                    axios.get('/api/clients'),
                    axios.get('/api/sessions')
                ]);
                setTherapists(therapistsRes.data);
                setClients(clientsRes.data);
                setSessions(sessionsRes.data);
                setLoading(false);
            } catch (err) {
                console.warn('Backend connection failed, using fallback data');
                setTherapists(fallbackData.therapists);
                setClients(fallbackData.clients);
                setSessions(fallbackData.sessions);
                setUsingFallback(true);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (type, id) => {
        try {
            await axios.delete(`/api/${type}/${id}`);
            if (type === 'therapists') setTherapists(prev => prev.filter(i => i.id !== id));
            if (type === 'clients') setClients(prev => prev.filter(i => i.id !== id));
            if (type === 'sessions') setSessions(prev => prev.filter(i => i.id !== id));
        } catch {
            alert(`Failed to delete. ${usingFallback ? 'Backend is offline.' : ''}`);
        }
    };

    const handleUpdate = async (type, id, data) => {
        try {
            await axios.put(`/api/${type}/${id}`, data);
            const update = item => item.id === id ? { ...item, ...data } : item;
            if (type === 'therapists') setTherapists(prev => prev.map(update));
            if (type === 'clients') setClients(prev => prev.map(update));
            if (type === 'sessions') setSessions(prev => prev.map(update));
            return true;
        } catch {
            alert(`Failed to update. ${usingFallback ? 'Backend is offline.' : ''}`);
            return false;
        }
    };

    const handleAdd = async (type, data) => {
        try {
            const res = await axios.post(`/api/${type}`, data);
            const newItem = res.data.id ? { ...data, id: res.data.id } : { ...data, id: Date.now() };
            if (type === 'therapists') setTherapists(prev => [...prev, newItem]);
            if (type === 'clients') setClients(prev => [...prev, newItem]);
            if (type === 'sessions') setSessions(prev => [...prev, newItem]);
            return true;
        } catch {
            if (usingFallback) {
                const fallbackItem = { ...data, id: Date.now() };
                if (type === 'therapists') setTherapists(prev => [...prev, fallbackItem]);
                if (type === 'clients') setClients(prev => [...prev, fallbackItem]);
                if (type === 'sessions') setSessions(prev => [...prev, fallbackItem]);
                return true;
            }
            alert('Failed to add item.');
            return false;
        }
    };    if (loading) return <div className="loading">Loading...</div>;

    return (
        <BrowserRouter>
            <header className="app-header">
                <div className="logo-container">
                    <img src="/logo.png" alt="Therapy Management" className="logo-image" />
                    <h1 className="logo-text">Therapy Management</h1>
                </div>
            </header>

            <div className="app">
                <Routes>
                    <Route path="/" element={
                        <HomePage
                            therapists={therapists}
                            clients={clients}
                            sessions={sessions}
                            handleAdd={handleAdd}
                        />
                    } />
                    <Route path="/therapists/:id" element={
                        <DetailView type="therapists" data={therapists} onDelete={handleDelete} onUpdate={handleUpdate} />
                    } />
                    <Route path="/clients/:id" element={
                        <DetailView type="clients" data={clients} onDelete={handleDelete} onUpdate={handleUpdate} />
                    } />
                    <Route path="/sessions/:id" element={
                        <DetailView type="sessions" data={sessions} onDelete={handleDelete} onUpdate={handleUpdate} />
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {usingFallback && (
                    <div className="fallback-notice">
                        Using demo data — Backend connection unavailable
                    </div>
                )}
            </div>
        </BrowserRouter>
    );
}

function HomePage({ therapists, clients, sessions, handleAdd }) {
    return (
        <main>
            <EntitySection title="Therapists" type="therapists" items={therapists} handleAdd={handleAdd} />

            <EntitySection title="Clients" type="clients" items={clients} handleAdd={handleAdd} />

            <EntitySection title="Sessions" type="sessions" items={sessions} handleAdd={handleAdd} />
        </main>
    );
}

function EntitySection({ title, type, items, handleAdd }) {    const fields = {
        therapists: [
            { name: 'name', type: 'text', required: true },
            { name: 'specialization', type: 'text', required: true },
            { name: 'image_link', type: 'text' }
        ],
        clients: [
            { name: 'name', type: 'text', required: true },
            { name: 'age', type: 'number', required: true },
            { name: 'image_link', type: 'text' }
        ],
        sessions: [
            { name: 'topic', type: 'text', required: true },
            { name: 'session_date', type: 'date', required: true },
            { name: 'therapist_id', type: 'select', required: true },
            { name: 'client_id', type: 'select', required: true },
            { name: 'image_link', type: 'text' }
        ]
    }[type];

    return (
        <section className="section-container">
            <div className="section-header">
                <h2>{title}</h2>
                <AddButton type={type} onAdd={handleAdd} fields={fields} />
            </div>
            <Carousel>
                {items.map(item => (
                    <Card
                        key={item.id}
                        id={item.id}
                        type={type}
                        title={item.name}
                        subtitle={getSubtitle(type, item)}
                        description={getDescription(type, item)}
                        imageUrl={item.image_link}
                    />
                ))}
            </Carousel>
        </section>
    );
}

function getSubtitle(type, item) {
    if (type === 'therapists') return `${item.title || ''} ${item.name || ''}`;
    if (type === 'clients') return `${item.email || ''}`;
    if (type === 'sessions') {
        // Format the date nicely
        try {
            // Try to parse the date - it could be in different formats from the server
            const date = new Date(item.date);
            // Check if date is valid
            if (!isNaN(date.getTime())) {
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            }
            // Fallback if date can't be parsed
            return item.notes ? item.notes.substring(0, 20) + '...' : 'Session';
        } catch (e) {
            console.log('Error parsing date:', e, item);
            return 'Session date';
        }
    }
}

function getDescription(type, item) {
    if (type === 'therapists') return item.location || 'Location';
    if (type === 'clients') return `${item.regularity || ''} sessions`;
    if (type === 'sessions') return item.notes || 'Session';
    return '';
}

function Card({ id, type, title, subtitle, description, imageUrl }) {
    return (
        <Link to={`/${type}/${id}`} className="card">
            <div className="card-image">
                <img src={imageUrl || '/placeholder.jpg'} alt={title || 'Image'} />
            </div>
            <div className="card-content">
                <h3>{title}</h3>
                {subtitle && <p className="subtitle">{subtitle}</p>}
                {description && <p className="description">{description}</p>}
            </div>
        </Link>
    );
}

export default App;
