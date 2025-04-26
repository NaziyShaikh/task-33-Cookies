import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;

const App = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cookies, setCookies] = useState(null);

    const fetchCookies = async () => {
        try {
            const res = await axios.get('/get-cookie', {
                withCredentials: true
            });
            setCookies(res.data);
        } catch (error) {
            console.error('Error fetching cookies:', error);
            setError('Error fetching cookies');
        }
    };

    const handleApiCall = async (endpoint) => {
        setLoading(true);
        try {
            console.log('Making request to:', endpoint);
            const res = await axios.get(endpoint, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log('Response received:', res.data);
            setResponse(res.data);
            setError(null);
        } catch (error) {
            console.error('API Error:', error);
            let errorMessage = 'Network error occurred';
            
            if (error.response) {
                errorMessage = error.response.data?.message || 
                             error.response.data?.error?.message || 
                             error.response.data?.error?.details || 
                             `Status: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'No response received from server. Request details:';
                console.log('Request details:', error.request);
            } else {
                errorMessage = error.message;
            }
            
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
                <button onClick={() => fetchCookies()} disabled={loading}>
                    {loading ? 'Loading...' : 'Show Cookies'}
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

            {cookies && (
                <div className="cookie-container">
                    <h2>Cookies:</h2>
                    <pre className="cookie-json">
                        {JSON.stringify(cookies, null, 2)}
                    </pre>
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

            {!response && !error && !cookies && (
                <div className="info-message">
                    <p>Click any button above to test the API endpoints</p>
                </div>
            )}
        </div>
    );
};

export default App;