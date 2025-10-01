const express = require('express');
const path = require('path');
const TuyAPI = require('tuyapi');

const app = express();
const PORT = 3000;

// Middleware to serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Tuya Device Configuration
// Real device information from Tuya CLI wizard
const LIGHT_1_CONFIG = {
    id: 'ebaf611b179fb716e0wgxx', // Your actual device ID
    key: '?8@82@X_{?U&\'r*s', // Your actual device key
    ip: '192.168.0.110' // From your nmap scan
};

// For now, we'll use the same device for both lights
// You can add your second device later if needed
const LIGHT_2_CONFIG = {
    id: 'ebaf611b179fb716e0wgxx', // Same device for now
    key: '?8@82@X_{?U&\'r*s', // Same key for now
    ip: '192.168.0.179' // From your nmap scan
};

// Light control function (centralized for both web and Alexa Smart Home API)
async function controlLight(action) {
    console.log(`Light ${action.toUpperCase()}`);
    
    try {
        // For now, we'll control both lights
        // You can modify this to control specific lights if needed
        const lights = [LIGHT_1_CONFIG, LIGHT_2_CONFIG];
        const results = [];
        
        for (const lightConfig of lights) {
            try {
                const device = new TuyAPI({
                    id: lightConfig.id,
                    key: lightConfig.key,
                    ip: lightConfig.ip
                });
                
                // Connect to device
                await device.connect();
                
                // Set the state
                const state = action === 'on' ? true : false;
                await device.set({ dps: 1, set: state });
                
                // Disconnect
                device.disconnect();
                
                results.push(`Light at ${lightConfig.ip}: ${action.toUpperCase()}`);
                console.log(`Successfully controlled light at ${lightConfig.ip}`);
                
            } catch (deviceError) {
                console.error(`Error controlling light at ${lightConfig.ip}:`, deviceError.message);
                results.push(`Light at ${lightConfig.ip}: ERROR - ${deviceError.message}`);
            }
        }
        
        return `Light control results: ${results.join(', ')}`;
        
    } catch (error) {
        console.error('Error in light control:', error);
        return `Light control error: ${error.message}`;
    }
}

// Route for turning light ON (web dashboard)
app.post('/light/on', async (req, res) => {
    const result = await controlLight('on');
    res.send(result);
});

// Route for turning light OFF (web dashboard)
app.post('/light/off', async (req, res) => {
    const result = await controlLight('off');
    res.send(result);
});

// Alexa Smart Home API endpoints
// Discovery endpoint - tells Alexa what devices are available
app.post('/alexa/smart-home', async (req, res) => {
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
        await controlLight(action);
        
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
