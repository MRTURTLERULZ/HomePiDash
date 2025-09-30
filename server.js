const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Light control function (centralized for both web and Alexa Smart Home API)
function controlLight(action) {
    console.log(`Light ${action.toUpperCase()}`);
    // TODO: Replace this with actual IoT device control
    // Example: Send command to smart light via MQTT, HTTP API, or GPIO
    return `Light turned ${action.toUpperCase()}`;
}

// Route for turning light ON (web dashboard)
app.post('/light/on', (req, res) => {
    const result = controlLight('on');
    res.send(result);
});

// Route for turning light OFF (web dashboard)
app.post('/light/off', (req, res) => {
    const result = controlLight('off');
    res.send(result);
});

// Alexa Smart Home API endpoints
// Discovery endpoint - tells Alexa what devices are available
app.post('/alexa/smart-home', (req, res) => {
    const request = req.body;
    console.log('Alexa Smart Home request:', JSON.stringify(request, null, 2));

    if (request.directive.header.namespace === 'Alexa.Discovery' && 
        request.directive.header.name === 'Discover') {
        
        // Return discovery response with our light device
        const response = {
            "event": {
                "header": {
                    "namespace": "Alexa.Discovery",
                    "name": "Discover.Response",
                    "payloadVersion": "3",
                    "messageId": request.directive.header.messageId
                },
                "payload": {
                    "endpoints": [
                        {
                            "endpointId": "light-001",
                            "manufacturerName": "HomePiDash",
                            "description": "Smart Light",
                            "friendlyName": "Living Room Light",
                            "displayCategories": ["LIGHT"],
                            "capabilities": [
                                {
                                    "type": "AlexaInterface",
                                    "interface": "Alexa.PowerController",
                                    "version": "3",
                                    "properties": {
                                        "supported": [
                                            {
                                                "name": "powerState"
                                            }
                                        ],
                                        "proactivelyReported": false,
                                        "retrievable": true
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        };
        
        console.log('Sending discovery response');
        res.json(response);
    }
    else if (request.directive.header.namespace === 'Alexa.PowerController') {
        // Handle power control requests
        const endpointId = request.directive.endpoint.endpointId;
        const powerState = request.directive.header.name === 'TurnOn' ? 'ON' : 'OFF';
        
        console.log(`Power control: ${powerState} for endpoint ${endpointId}`);
        
        // Control the actual light
        const action = powerState === 'ON' ? 'on' : 'off';
        controlLight(action);
        
        // Send response back to Alexa
        const response = {
            "event": {
                "header": {
                    "namespace": "Alexa",
                    "name": "Response",
                    "payloadVersion": "3",
                    "messageId": request.directive.header.messageId,
                    "correlationToken": request.directive.header.correlationToken
                },
                "endpoint": {
                    "endpointId": endpointId
                },
                "payload": {}
            },
            "context": {
                "properties": [
                    {
                        "namespace": "Alexa.PowerController",
                        "name": "powerState",
                        "value": powerState,
                        "timeOfSample": new Date().toISOString(),
                        "uncertaintyInMilliseconds": 0
                    }
                ]
            }
        };
        
        console.log('Sending power control response');
        res.json(response);
    }
    else {
        // Handle other requests or return error
        console.log('Unknown request type:', request.directive.header.namespace, request.directive.header.name);
        res.status(400).json({ error: 'Unknown request' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Home Dashboard running on http://0.0.0.0:${PORT}`);
    console.log(`Access from other devices on your network at http://[PI_IP_ADDRESS]:${PORT}`);
    console.log(`Alexa Smart Home endpoint: http://[PI_IP_ADDRESS]:${PORT}/alexa/smart-home`);
});
