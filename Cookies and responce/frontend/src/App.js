import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [response, setResponse] = useState(null);

    // Function to set a cookie
    const setCookie = async () => {
        try {
            const res = await axios.get('/set-cookie');
            setResponse(res.data);
        } catch (error) {
            setResponse({ message: 'Error setting cookie' });
        }
    };

    // Function to get the cookie
    const getCookie = async () => {
        try {
            const res = await axios.get('/get-cookie');
            setResponse(res.data);
        } catch (error) {
            setResponse({ message: 'Error retrieving cookie' });
        }
    };

    // Function to get 200 response
    const get200Response = async () => {
        try {
            const res = await axios.get('/response/200');
            setResponse(res.data);
        } catch (error) {
            setResponse({ message: 'Error fetching response 200' });
        }
    };

    // Function to get 400 response
    const get400Response = async () => {
        try {
            const res = await axios.get('/response/400');
            setResponse(res.data);
        } catch (error) {
            setResponse({ message: 'Error fetching response 400' });
        }
    };

    return (
        <div>
            <h1>Cookie Handling and JSON Response</h1>
            <button onClick={setCookie}>Set Cookie</button>
            <button onClick={getCookie}>Get Cookie</button>
            <button onClick={get200Response}>Get 200 Response</button>
            <button onClick={get400Response}>Get 400 Response</button>
            <div>
                {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
            </div>
        </div>
    );
};

export default App;