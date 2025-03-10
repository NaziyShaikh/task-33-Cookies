const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());
app.use(express.json());

// Route to set a cookie in the client's browser
app.get('/set-cookie', (req, res) => {
    res.cookie('myCookie', 'cookieValue', { httpOnly: true });
    res.status(200).json({ message: 'Cookie set!' });
});

// Route to retrieve the cookie from the client's request
app.get('/get-cookie', (req, res) => {
    const cookieValue = req.cookies.myCookie;
    if (cookieValue) {
        res.status(200).json({ cookieValue });
    } else {
        res.status(404).json({ message: 'Cookie not found' });
    }
});

// Routes to send JSON data with different HTTP response codes
app.get('/response/:code', (req, res) => {
    const code = parseInt(req.params.code);
    switch (code) {
        case 200:
            res.status(200).json({ message: 'Success: The request was successful!' });
            break;
        case 201:
            res.status(201).json({ message: 'Created: The resource has been created!' });
            break;
        case 400:
            res.status(400).json({ message: 'Error: Bad Request - Please check your input!' });
            break;
        case 404:
            res.status(404).json({ message: 'Not Found: The requested resource was not found!' });
            break;
        case 500:
            res.status(500).json({ message: 'Internal Server Error: Something went wrong!' });
            break;
        default:
            res.status(400).json({ message: 'Invalid status code' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});