const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// Enable CORS with specific configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
};

app.use(cors(corsOptions));

// Add CORS preflight response
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', corsOptions.origin);
    next();
});

app.use(cookieParser());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Cookie Response API',
        endpoints: {
            '/set-cookie': 'Set a cookie in the client browser',
            '/get-cookie': 'Get the cookie value',
            '/response/:code': 'Get response with specified HTTP code'
        }
    });
});

// Route to set a cookie in the client's browser
app.get('/set-cookie', (req, res) => {
    res.cookie('myCookie', 'cookieValue', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined,
        path: '/',
        maxAge: 900000 // 15 minutes
    });
    res.status(200).json({ 
        message: 'Cookie set successfully',
        cookie: 'myCookie=cookieValue'
    });
});

// Route to retrieve the cookie from the client's request
app.get('/get-cookie', (req, res) => {
    const cookieValue = req.cookies.myCookie;
    console.log('Received cookie:', cookieValue); // added logging for debugging resoleve the isue here 
    if (cookieValue) {
        res.status(200).json({ 
            message: 'Cookie found',
            cookieValue
        });
    } else {
        res.status(404).json({ 
            message: 'Cookie not found',
            error: 'No cookie present in request'
        });
    }
});

// Routes to send JSON data with different HTTP response codes
app.get('/response/:code', (req, res) => {
    const code = parseInt(req.params.code);
    
    const responses = {
        200: {
            status: 200,
            message: 'Success: The request was successful!',
            data: {
                timestamp: new Date().toISOString(),
                status: 'success'
            }
        },
        201: {
            status: 201,
            message: 'Created: The resource has been created!',
            data: {
                id: 'new-resource-id',
                status: 'created'
            }
        },
        400: {
            status: 400,
            message: 'Error: Bad Request - Please check your input!',
            error: {
                code: 'BAD_REQUEST',
                details: 'Invalid request parameters'
            }
        },
        404: {
            status: 404,
            message: 'Not Found: The requested resource was not found!',
            error: {
                code: 'NOT_FOUND',
                details: 'Resource not available'
            }
        },
        500: {
            status: 500,
            message: 'Error: Internal Server Error',
            error: {
                code: 'INTERNAL_ERROR',
                details: 'An unexpected error occurred'
            }
        }
    };

    const response = responses[code];
    if (response) {
        res.status(code).json(response);
    } else {
        res.status(400).json({
            status: 400,
            message: 'Invalid response code',
            error: {
                code: 'INVALID_CODE',
                details: `Code ${code} is not supported`
            }
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});