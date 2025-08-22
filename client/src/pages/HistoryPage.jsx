import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import './HistoryPage.css';
import '../App.css';

function HistoryPage() {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user || !token) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get('https://smart-translate-backend-api.onrender.com/api/history', { headers: { Authorization: `Bearer ${token}` } });
                setHistory(res.data.items || []);
            } catch (err) {
                console.error('Failed to fetch history', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user, token]);

    return (
        <div className="page">
            <header className="hero" style={{ textAlign: 'center' }}>
                <h1 className="hero-title">My Translation History</h1>
                <p className="hero-tagline">View your past translations and summaries.</p>
            </header>
            <main className="card" style={{ width: '100%' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading history...</p>
                ) : history.length > 0 ? (
                    history.map(item => (
                        <div key={item._id} className="history-item">
                            <div className="history-pane">
                                <div className="pane-title">Original ({new Date(item.createdAt).toLocaleDateString()})</div>
                                <textarea rows={3} value={item.original} readOnly className="area" />
                            </div>
                            <div className="history-pane">
                                <div className="pane-title">Translated</div>
                                <textarea rows={3} value={item.translated} readOnly className="area" />
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--muted)' }}>No history found.</p>
                )}
            </main>
        </div>
    );
}

export default HistoryPage;
