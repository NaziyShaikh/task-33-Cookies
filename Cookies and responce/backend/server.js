const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();


const corsOptions = {
    origin: function(origin, callback) {
        
        if (!origin || origin === 'http://localhost:3001') {
            return callback(null, true);
        }
       
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
};

app.use(cors(corsOptions));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    next();
});

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
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
        path: '/'
    });
    res.status(200).json({
        message: 'Cookie set successfully',
        cookie: 'myCookie=cookieValue'
    });
});

// Route to retrieve the cookie from the client's request
app.get('/get-cookie', (req, res) => {
    const cookieValue = req.cookies.myCookie;
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
            message: 'Internal Server Error: Something went wrong!',
            error: {
                code: 'INTERNAL_ERROR',
                details: 'Server encountered an unexpected condition'
            }
        }
    };

    const response = responses[code];
    if (response) {
        res.status(response.status).json(response);
    } else {
        res.status(400).json({
            message: 'Invalid status code',
            error: {
                code: 'INVALID_STATUS',
                details: `Status code ${code} is not supported`
            }
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});