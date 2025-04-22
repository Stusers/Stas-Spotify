import React, { useState, useEffect, useContext } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Link,
    useParams,
    useNavigate
} from 'react-router-dom';
import axios from 'axios';
import './App.css';
import './index.css';

import Carousel from './components/Carousel';
import DetailView from './components/DetailView';
import AddButton from './components/AddButton';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import { fallbackData } from './fallbackData';
import { AuthContext } from './context/AuthContext';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleDateString();
};

function AppContent() {
    const { user, logout } = useContext(AuthContext);
    const userId = user?.id;
    const [logs, setLogs] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usingFallback, setUsingFallback] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [logsRes, plansRes] = await Promise.all([
                    axios.get(`/api/users/${userId}/logs`),
                    axios.get(`/api/users/${userId}/plans`)
                ]);
                setLogs(logsRes.data);
                setPlans(plansRes.data);
            } catch {
                setLogs(fallbackData.logs);
                setPlans(fallbackData.plans);
                setUsingFallback(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const handleDelete = async (type, id) => {
        await axios.delete(`/api/${type}/${id}`);
        if (type === 'logs') setLogs((prev) => prev.filter((i) => i.id !== id));
        if (type === 'plans') setPlans((prev) => prev.filter((i) => i.id !== id));
    };

    const handleUpdate = async (type, id, data) => {
        try {
            const url = `/api/users/${userId}/${type}/${id}`;
            await axios.put(url, data);
            const updateFn = (item) => (item.id === id ? { ...item, ...data } : item);
            if (type === 'logs') setLogs((prev) => prev.map(updateFn));
            if (type === 'plans') setPlans((prev) => prev.map(updateFn));
            return true;
        } catch {
            return false;
        }
    };

    const handleAdd = async (type, data) => {
        try {
            const payload = { ...data, user_id: userId };
            const res = await axios.post(`/api/users/${userId}/${type}`, payload);
            const newItem = { ...payload, id: res.data.id || Date.now() };
            if (type === 'logs') setLogs((prev) => [...prev, newItem]);
            if (type === 'plans') setPlans((prev) => [...prev, newItem]);
            return true;
        } catch {
            return false;
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <>
            <header className="app-header">
                <div className="logo-container">
                    <img src="/dog.png.jpg" alt="App Logo" className="logo-image" />
                    <h1 className="logo-text">Logs & Plans Manager</h1>
                </div>
                <button onClick={logout} className="logout-button">Logout</button>
            </header>
            <div className="app">
                <main>
                    <EntitySection title="Logs" type="logs" items={logs} handleAdd={handleAdd} />
                    <EntitySection title="Plans" type="plans" items={plans} handleAdd={handleAdd} />
                </main>
                {usingFallback && (
                    <div className="fallback-notice">Using demo data — Backend unavailable</div>
                )}
            </div>
        </>
    );
}

function EntitySection({ title, type, items, handleAdd }) {
    const fields = {
        logs: [
            { name: 'name', type: 'text', required: true, label: 'Name *' },
            { name: 'logdesc', type: 'text', label: 'Description' },
            { name: 'start_date', type: 'date', label: 'Start Date' },
            { name: 'end_date', type: 'date', label: 'End Date' },
            { name: 'post_date', type: 'date', label: 'Post Date' },
            { name: 'image_link', type: 'text', label: 'Image Link' }
        ],
        plans: [
            { name: 'name', type: 'text', required: true, label: 'Name *' },
            { name: 'desc', type: 'text', label: 'Description' },
            { name: 'end_date', type: 'date', label: 'End Date' },
            { name: 'location', type: 'text', label: 'Location' },
            { name: 'image_link', type: 'text', label: 'Image Link' }
        ]
    }[type];

    return (
        <section className="section-container">
            <div className="section-header">
                <h2>{title}</h2>
                <AddButton type={type} onAdd={handleAdd} fields={fields} />
            </div>
            <Carousel>
                {items.map((item) => (
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
    if (type === 'logs') return `${formatDate(item.start_date)} – ${formatDate(item.end_date)}`;
    if (type === 'plans') return `Due: ${formatDate(item.end_date)}`;
    return '';
}

function getDescription(type, item) {
    if (type === 'logs') return item.logdesc;
    if (type === 'plans') return item.location;
    return '';
}

function Card({ id, type, title, subtitle, description, imageUrl }) {
    return (
        <Link to={`/${type}/${id}`} className="card">
            <div className="card-image">
                <img src={imageUrl || '/placeholder.jpg'} alt={title} />
            </div>
            <div className="card-content">
                <h3>{title}</h3>
                {subtitle && <p className="subtitle">{subtitle}</p>}
                {description && <p className="description">{description}</p>}
            </div>
        </Link>
    );
}

const DetailWrapper = ({ type }) => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const userId = user?.id;
    const [item, setItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await axios.get(`/api/users/${userId}/${type}`);
                const match = res.data.find((entry) => entry.id === parseInt(id, 10));
                setItem(match || null);
            } catch (err) {
                setItem(null);
            }
        };
        fetchItem();
    }, [userId, type, id]);

    const handleDelete = async () => {
        await axios.delete(`/api/${type}/${id}`);
        navigate('/');
    };

    // ✅ Updated to accept type, id, and data
    const handleUpdate = async (updateType, itemId, data) => {
        try {
            await axios.put(`/api/users/${userId}/${updateType}/${itemId}`, data);
            return true;
        } catch (err) {
            console.error("Update failed:", err.response?.data || err.message);
            return false;
        }
    };

    if (!item) return <div className="detail-view">Item not found.</div>;

    return (
        <DetailView
            type={type}
            data={[item]}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
        />
    );
};

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AppContent />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/logs/:id"
                    element={
                        <ProtectedRoute>
                            <DetailWrapper type="logs" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/plans/:id"
                    element={
                        <ProtectedRoute>
                            <DetailWrapper type="plans" />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
