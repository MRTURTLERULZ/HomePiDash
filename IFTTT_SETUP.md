# IFTTT Integration Setup Guide

This guide will help you connect your Smart Home Dashboard to Alexa through IFTTT.

## Prerequisites

1. **IFTTT Account** (free at https://ifttt.com)
2. **Alexa-compatible light** already set up
3. **Your Pi running** the smart home dashboard

## Step 1: Create IFTTT Account

1. **Go to**: https://ifttt.com
2. **Click "Sign Up"**
3. **Create account** with email/password
4. **Verify email** if required

## Step 2: Create Webhook Applets

You need to create **2 applets** - one for turning the light ON and one for OFF.

### Applet 1: Turn Light ON

1. **Go to**: https://ifttt.com/create
2. **Click "If This"**
3. **Search for "Webhooks"**
4. **Select "Webhooks"**
5. **Choose "Receive a web request"**
6. **Event name**: `turn_light_on`
7. **Click "Then That"**
8. **Search for "Alexa"**
9. **Select "Alexa"**
10. **Choose "Say something"** or **"Control a device"**
11. **Configure the action**:
    - **If using "Say something"**: "Turn on the living room light"
    - **If using "Control device"**: Select your light device
12. **Click "Finish"**

### Applet 2: Turn Light OFF

1. **Create another applet**
2. **Same process** but:
    - **Event name**: `turn_light_off`
    - **Action**: "Turn off the living room light"

## Step 3: Get Your Webhook URLs

1. **Go to**: https://ifttt.com/maker_webhooks
2. **Click "Documentation"**
3. **Copy your webhook key** (looks like: `abc123def456`)
4. **Your webhook URLs will be**:
    ```
    https://maker.ifttt.com/trigger/turn_light_on/with/key/YOUR_KEY
    https://maker.ifttt.com/trigger/turn_light_off/with/key/YOUR_KEY
    ```

## Step 4: Update Your Pi Code

1. **Edit `server.js`**
2. **Replace `YOUR_IFTTT_KEY_HERE`** with your actual IFTTT key:
   ```javascript
   const IFTTT_KEY = 'abc123def456'; // Your actual key
   ```

3. **Restart your server**:
   ```bash
   npm start
   ```

## Step 5: Test the Integration

### Test from Web Dashboard

1. **Open**: `https://pi5.tail010721.ts.net:3000`
2. **Click "Turn Light ON"** button
3. **Check console logs** for IFTTT webhook success
4. **Verify light turns on**

### Test from API

```bash
# Turn light ON
curl -X POST https://pi5.tail010721.ts.net:3000/light/on

# Turn light OFF
curl -X POST https://pi5.tail010721.ts.net:3000/light/off
```

## How It Works

1. **Your Pi** sends HTTP request to IFTTT webhook
2. **IFTTT** receives the webhook trigger
3. **IFTTT** sends command to Alexa
4. **Alexa** controls your light

## Troubleshooting

### Common Issues

1. **"IFTTT webhook failed"**
   - Check your IFTTT key is correct
   - Verify the applets are created and active
   - Check IFTTT service status

2. **"Light control error"**
   - Check internet connection on Pi
   - Verify IFTTT webhook URLs are correct
   - Check console logs for detailed errors

3. **"Light doesn't turn on/off"**
   - Verify Alexa can control the light manually
   - Check IFTTT applet configuration
   - Ensure the light is connected to Alexa

### Debugging

1. **Check IFTTT Activity Log**:
   - Go to https://ifttt.com/activity
   - Look for webhook triggers
   - Check if actions are executing

2. **Check Pi Console Logs**:
   ```bash
   npm start
   # Watch for IFTTT webhook messages
   ```

3. **Test IFTTT Webhook Directly**:
   ```bash
   curl -X POST https://maker.ifttt.com/trigger/turn_light_on/with/key/YOUR_KEY
   ```

## IFTTT Applet Configuration Tips

### For "Say Something" Action:
- **Text**: "Turn on the living room light"
- **Device**: Select your Alexa device
- **Volume**: Set appropriate level

### For "Control Device" Action:
- **Device**: Select your light device
- **Action**: Turn On/Off
- **Room**: Select appropriate room

## Security Notes

1. **Keep your IFTTT key private**
2. **Don't commit the key to Git**
3. **Use environment variables** for production
4. **Monitor IFTTT activity** for unauthorized access

## Next Steps

Once working, you can:

1. **Add more devices** by creating additional applets
2. **Add more actions** (dimming, color changes, etc.)
3. **Create complex automations** with multiple triggers
4. **Integrate with other services** (Google Home, etc.)

## Cost

- **IFTTT Free**: 3 applets (perfect for testing)
- **IFTTT Pro**: $3.99/month for unlimited applets

## Alternative: Zapier

If you need more advanced features:
- **Zapier**: More powerful but $20/month
- **Microsoft Power Automate**: Free tier available
- **Node-RED**: Open source automation platform
