import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
axios.defaults.withCredentials = true;

const App = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleApiCall = async (endpoint) => {
        setLoading(true);
        try {
            const res = await axios.get(endpoint);
            setResponse(res.data);
            setError(null);
        } catch (error) {
            console.error('API Error:', error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error?.message || 
                               error.response?.data?.error?.details || 
                               error.message || 
                               'An error occurred';
            setError(errorMessage);
            setResponse(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <h1>API Response Tester</h1>
            
            <div className="button-group">
                <button onClick={() => handleApiCall('/set-cookie')} disabled={loading}>
                    {loading ? 'Loading...' : 'Set Cookie'}
                </button>
                <button onClick={() => handleApiCall('/get-cookie')} disabled={loading}>
                    {loading ? 'Loading...' : 'Get Cookie'}
                </button>
                <button onClick={() => handleApiCall('/response/200')} disabled={loading}>
                    {loading ? 'Loading...' : 'Get 200 Response'}
                </button>
                <button onClick={() => handleApiCall('/response/201')} disabled={loading}>
                    {loading ? 'Loading...' : 'Get 201 Response'}
                </button>
                <button onClick={() => handleApiCall('/response/400')} disabled={loading}>
                    {loading ? 'Loading...' : 'Get 400 Response'}
                </button>
                <button onClick={() => handleApiCall('/response/404')} disabled={loading}>
                    {loading ? 'Loading...' : 'Get 404 Response'}
                </button>
                <button onClick={() => handleApiCall('/response/500')} disabled={loading}>
                    {loading ? 'Loading...' : 'Get 500 Response'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            {response && (
                <div className="response-container">
                    <h2>Response:</h2>
                    <pre className="response-json">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}

            {!response && !error && (
                <div className="info-message">
                    <p>Click any button above to test the API endpoints</p>
                </div>
            )}
        </div>
    );
};

export default App;