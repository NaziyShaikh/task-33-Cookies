import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

const App = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleApiCall = async (endpoint) => {
        try {
            const res = await axios.get(endpoint);
            setResponse(res.data);
            setError(null);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error?.message || 
                               error.response?.data?.error?.details || 
                               'An error occurred';
            setError(errorMessage);
            setResponse(null);
        }
    };

    return (
        <div className="app-container">
            <h1>API Response Tester</h1>
            
            <div className="button-group">
                <button onClick={() => handleApiCall('/set-cookie')}>Set Cookie</button>
                <button onClick={() => handleApiCall('/get-cookie')}>Get Cookie</button>
                <button onClick={() => handleApiCall('/response/200')}>Get 200 Response</button>
                <button onClick={() => handleApiCall('/response/201')}>Get 201 Response</button>
                <button onClick={() => handleApiCall('/response/400')}>Get 400 Response</button>
                <button onClick={() => handleApiCall('/response/404')}>Get 404 Response</button>
                <button onClick={() => handleApiCall('/response/500')}>Get 500 Response</button>
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
        </div>
    );
};

export default App;