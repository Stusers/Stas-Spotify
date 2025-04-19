// src/App.jsx
import React, { useState, useEffect } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Link
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

// Format ISO date strings to locale date
const formatDate = dateStr => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleDateString();
};

function AppContent() {
    const [logs, setLogs] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usingFallback, setUsingFallback] = useState(false);
    const userId = 1; // Replace with dynamic ID if needed

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
        try {
            await axios.delete(`/api/${type}/${id}`);
            if (type === 'logs') setLogs(prev => prev.filter(i => i.id !== id));
            if (type === 'plans') setPlans(prev => prev.filter(i => i.id !== id));
        } catch {
            alert(`Failed to delete. ${usingFallback ? 'Backend offline.' : ''}`);
        }
    };

    const handleUpdate = async (type, id, data) => {
        try {
            await axios.put(`/api/${type}/${id}`, data);
            const upd = item => item.id === id ? { ...item, ...data } : item;
            if (type === 'logs') setLogs(prev => prev.map(upd));
            if (type === 'plans') setPlans(prev => prev.map(upd));
            return true;
        } catch {
            alert(`Failed to update. ${usingFallback ? 'Backend offline.' : ''}`);
            return false;
        }
    };

    const handleAdd = async (type, data) => {
        try {
            const payload = { ...data, user_id: userId };
            const res = await axios.post(`/api/${type}`, payload);
            const newItem = { ...payload, id: res.data.id || Date.now() };
            if (type === 'logs') setLogs(prev => [...prev, newItem]);
            if (type === 'plans') setPlans(prev => [...prev, newItem]);
            return true;
        } catch {
            if (usingFallback) {
                const fallbackItem = { ...data, id: Date.now(), user_id: userId };
                if (type === 'logs') setLogs(prev => [...prev, fallbackItem]);
                if (type === 'plans') setPlans(prev => [...prev, fallbackItem]);
                return true;
            }
            alert('Failed to add item.');
            return false;
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <>
            <header className="app-header">
                <div className="logo-container">
                    <img src="/logo.png" alt="App Logo" className="logo-image" />
                    <h1 className="logo-text">Logs & Plans Manager</h1>
                </div>
            </header>
            <div className="app">
                <main>
                    <EntitySection title="Logs" type="logs" items={logs} handleAdd={handleAdd} />
                    <EntitySection title="Plans" type="plans" items={plans} handleAdd={handleAdd} />
                </main>
                {usingFallback && <div className="fallback-notice">Using demo data — Backend unavailable</div>}
            </div>
        </>
    );
}

function EntitySection({ title, type, items, handleAdd }) {
    const fields = {
        logs: [
            { name: 'name', type: 'text', required: true },
            { name: 'logdesc', type: 'text' },
            { name: 'start_date', type: 'date' },
            { name: 'end_date', type: 'date' },
            { name: 'post_date', type: 'date' },
            { name: 'image_link', type: 'text' }
        ],
        plans: [
            { name: 'name', type: 'text', required: true },
            { name: 'desc', type: 'text' },
            { name: 'end_date', type: 'date' },
            { name: 'location', type: 'text' },
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

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
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
                            <DetailView type="logs" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/plans/:id"
                    element={
                        <ProtectedRoute>
                            <DetailView type="plans" />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all redirects */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}