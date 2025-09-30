# Smart Home Dashboard

A simple Node.js smart home dashboard designed to run on Raspberry Pi 5.

## Features

- Express.js backend server
- Clean, responsive web dashboard
- Light control buttons (ON/OFF)
- Network accessible (binds to 0.0.0.0)
- Ready for IoT device integration

## Installation

1. Install Node.js on your Raspberry Pi
2. Clone or download this project
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```

2. Access the dashboard:
   - Local: http://localhost:3000
   - Network: http://[PI_IP_ADDRESS]:3000

## Development

For development with auto-restart:
```bash
npm run dev
```

## Project Structure

```
HomePiDash/
├── package.json          # Dependencies and scripts
├── server.js             # Express server with API routes
├── public/
│   └── index.html        # Dashboard frontend
└── README.md             # This file
```

## API Endpoints

- `POST /light/on` - Turn light on
- `POST /light/off` - Turn light off

## Next Steps

This is a minimal working example. You can expand it by:
- Adding more IoT devices
- Integrating with Alexa API
- Adding device status indicators
- Implementing authentication
- Adding database storage
