# Alexa Smart Home API Setup Guide

This guide will help you connect your Smart Home Dashboard with Alexa using the Smart Home API (not custom skills).

## Prerequisites

1. Amazon Developer Account
2. Your Raspberry Pi accessible from the internet (using ngrok or similar)
3. Node.js dependencies installed (`npm install`)

## Step 1: Create a Smart Home Skill

1. **Go to Alexa Developer Console**
   - Visit: https://developer.amazon.com/alexa/console/ask
   - Sign in with your Amazon account

2. **Create New Skill**
   - Click "Create Skill"
   - Skill name: "HomePiDash Smart Home"
   - Choose "Smart Home" model (NOT Custom)
   - Select your language (e.g., English US)
   - Click "Create skill"

## Step 2: Configure the Smart Home Skill

1. **Go to Smart Home**
   - In the left menu, click "Smart Home"
   - Click "Discovery"

2. **Set Up Discovery**
   - Endpoint URL: Your public URL + `/alexa/smart-home`
   - Example: `https://abc123.ngrok.io/alexa/smart-home`
   - Access Token: Leave blank for now (we'll add this later)

## Step 3: Make Your Server Publicly Accessible

### Option A: Using ngrok (Recommended for testing)

1. **Install ngrok**
   ```bash
   # Download from https://ngrok.com/download
   # Or install via package manager
   ```

2. **Start your server**
   ```bash
   npm start
   ```

3. **Expose your server**
   ```bash
   ngrok http 3000
   ```

4. **Note the HTTPS URL**
   - Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
   - This will be your Alexa endpoint

### Option B: Deploy to Cloud (Production)

Consider deploying to:
- Heroku
- AWS Elastic Beanstalk
- DigitalOcean App Platform
- Railway

## Step 4: Configure the Skill Endpoint

1. **Go to Endpoint**
   - In the Alexa Developer Console, click "Endpoint"
   - Select "HTTPS"
   - Enter your public URL + `/alexa/smart-home`
   - Example: `https://abc123.ngrok.io/alexa/smart-home`

2. **Certificate**
   - Select "My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority"

3. **Save Endpoints**

## Step 5: Test Your Smart Home Skill

1. **Go to Test Tab**
   - In the Alexa Developer Console, click "Test"
   - Enable "Development" mode

2. **Test Discovery**
   - Say: "Alexa, discover devices"
   - Alexa should find your "Living Room Light"

3. **Test Control**
   - Say: "Alexa, turn on the living room light"
   - Say: "Alexa, turn off the living room light"

## Step 6: Enable the Skill on Your Device

1. **Open Alexa App**
   - Go to Skills & Games
   - Search for "HomePiDash Smart Home"
   - Click "Enable"

2. **Discover Devices**
   - In Alexa app, go to Devices
   - Click "Discover" or say "Alexa, discover devices"
   - Your light should appear as "Living Room Light"

3. **Test on Device**
   - Say: "Alexa, turn on the living room light"
   - Say: "Alexa, turn off the living room light"

## How It Works

### Discovery Process
1. Alexa sends a discovery request to `/alexa/smart-home`
2. Your server responds with device information (light-001)
3. Alexa learns about your "Living Room Light"

### Control Process
1. User says "Alexa, turn on the living room light"
2. Alexa sends a power control request to your server
3. Your server calls `controlLight('on')` and responds to Alexa
4. Alexa confirms the action to the user

## Troubleshooting

### Common Issues

1. **"No devices found"**
   - Check your server logs for discovery requests
   - Verify the endpoint URL is correct
   - Ensure your server is running and accessible

2. **"Device not responding"**
   - Check your server logs for control requests
   - Verify the device ID matches (light-001)
   - Check network connectivity

3. **ngrok connection issues**
   - Make sure ngrok is running
   - Check that your local server is running on port 3000
   - Verify the ngrok URL is HTTPS (not HTTP)

### Debugging

1. **Check Server Logs**
   ```bash
   npm start
   # Watch for Alexa requests in console
   ```

2. **Test Discovery Endpoint**
   ```bash
   curl -X POST https://your-ngrok-url.ngrok.io/alexa/smart-home \
     -H "Content-Type: application/json" \
     -d '{
       "directive": {
         "header": {
           "namespace": "Alexa.Discovery",
           "name": "Discover",
           "payloadVersion": "3",
           "messageId": "test-123"
         },
         "payload": {}
       }
     }'
   ```

3. **Test Control Endpoint**
   ```bash
   curl -X POST https://your-ngrok-url.ngrok.io/alexa/smart-home \
     -H "Content-Type: application/json" \
     -d '{
       "directive": {
         "header": {
           "namespace": "Alexa.PowerController",
           "name": "TurnOn",
           "payloadVersion": "3",
           "messageId": "test-456",
           "correlationToken": "test-token"
         },
         "endpoint": {
           "endpointId": "light-001"
         },
         "payload": {}
       }
     }'
   ```

## Next Steps

Once working, you can:

1. **Add More Devices**
   - Add more endpoints to the discovery response
   - Support different device types (switches, dimmers, etc.)

2. **Add More Capabilities**
   - Brightness control for dimmable lights
   - Color control for RGB lights
   - Temperature control for thermostats

3. **Improve Security**
   - Add OAuth2 authentication
   - Implement request validation
   - Add device state persistence

4. **Deploy to Production**
   - Use a proper cloud service
   - Set up monitoring and logging
   - Add SSL certificates

## Voice Commands

Once set up, you can use these natural voice commands:

- "Alexa, turn on the living room light"
- "Alexa, turn off the living room light"
- "Alexa, discover devices" (to find new devices)
- "Alexa, what devices do I have?" (to list devices)
