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
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usingFallback, setUsingFallback] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [artistsRes, albumsRes, songsRes] = await Promise.all([
                    axios.get('/api/artists'),
                    axios.get('/api/albums'),
                    axios.get('/api/songs')
                ]);
                setArtists(artistsRes.data);
                setAlbums(albumsRes.data);
                setSongs(songsRes.data);
                setLoading(false);
            } catch (err) {
                console.warn('Backend connection failed, using fallback data');
                setArtists(fallbackData.artists);
                setAlbums(fallbackData.albums);
                setSongs(fallbackData.songs);
                setUsingFallback(true);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (type, id) => {
        try {
            await axios.delete(`/api/${type}/${id}`);
            if (type === 'artists') setArtists(prev => prev.filter(i => i.id !== id));
            if (type === 'albums') setAlbums(prev => prev.filter(i => i.id !== id));
            if (type === 'songs') setSongs(prev => prev.filter(i => i.id !== id));
        } catch {
            alert(`Failed to delete. ${usingFallback ? 'Backend is offline.' : ''}`);
        }
    };

    const handleUpdate = async (type, id, data) => {
        try {
            await axios.put(`/api/${type}/${id}`, data);
            const update = item => item.id === id ? { ...item, ...data } : item;
            if (type === 'artists') setArtists(prev => prev.map(update));
            if (type === 'albums') setAlbums(prev => prev.map(update));
            if (type === 'songs') setSongs(prev => prev.map(update));
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
            if (type === 'artists') setArtists(prev => [...prev, newItem]);
            if (type === 'albums') setAlbums(prev => [...prev, newItem]);
            if (type === 'songs') setSongs(prev => [...prev, newItem]);
            return true;
        } catch {
            if (usingFallback) {
                const fallbackItem = { ...data, id: Date.now() };
                if (type === 'artists') setArtists(prev => [...prev, fallbackItem]);
                if (type === 'albums') setAlbums(prev => [...prev, fallbackItem]);
                if (type === 'songs') setSongs(prev => [...prev, fallbackItem]);
                return true;
            }
            alert('Failed to add item.');
            return false;
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <BrowserRouter>
            <header className="app-header">
                <div className="logo-container">
                    <img src="/logo.png" alt="Stas's Spotify" className="logo-image" />
                    <h1 className="logo-text">Stas's Spotify</h1>
                </div>
            </header>

            <div className="app">
                <Routes>
                    <Route path="/" element={
                        <HomePage
                            artists={artists}
                            albums={albums}
                            songs={songs}
                            handleAdd={handleAdd}
                        />
                    } />
                    <Route path="/artists/:id" element={
                        <DetailView type="artists" data={artists} onDelete={handleDelete} onUpdate={handleUpdate} />
                    } />
                    <Route path="/albums/:id" element={
                        <DetailView type="albums" data={albums} onDelete={handleDelete} onUpdate={handleUpdate} />
                    } />
                    <Route path="/songs/:id" element={
                        <DetailView type="songs" data={songs} onDelete={handleDelete} onUpdate={handleUpdate} />
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

function HomePage({ artists, albums, songs, handleAdd }) {
    return (
        <main>
            <EntitySection title="Songs" type="songs" items={songs} handleAdd={handleAdd} />

            <EntitySection title="Albums" type="albums" items={albums} handleAdd={handleAdd} />

            <EntitySection title="Artists" type="artists" items={artists} handleAdd={handleAdd} />

        </main>
    );
}

function EntitySection({ title, type, items, handleAdd }) {
    const fields = {
        artists: [
            { name: 'name', type: 'text', required: true },
            { name: 'monthly_listeners', type: 'text' },
            { name: 'genre', type: 'text' },
            { name: 'image_link', type: 'text' }
        ],
        albums: [
            { name: 'name', type: 'text', required: true },
            { name: 'artist_id', type: 'number', required: true },
            { name: 'release_year', type: 'number' },
            { name: 'number_of_listens', type: 'text' },
            { name: 'image_link', type: 'text' }
        ],
        songs: [
            { name: 'name', type: 'text', required: true },
            { name: 'release_year', type: 'number' },
            { name: 'album_id', type: 'number', required: true },
            { name: 'artist_id', type: 'number', required: true },
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
    if (type === 'artists') return `${item.monthly_listeners} monthly listeners`;
    if (type === 'albums') return `Released: ${item.release_year}`;
    if (type === 'songs') return `Released: ${item.release_year}`;
}

function getDescription(type, item) {
    if (type === 'artists') return item.genre;
    if (type === 'albums') return `${item.number_of_listens} listens`;
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
