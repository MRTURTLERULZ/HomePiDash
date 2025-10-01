# Tuya Direct Control Setup Guide

This guide will help you control your Energizer smart lights directly from your Pi using the Tuya API.

## Prerequisites

1. **Two Tuya devices** found on your network:
   - **192.168.0.110** (MAC: A0:92:08:5C:27:F3)
   - **192.168.0.179** (MAC: A0:92:08:5B:FF:6D)
2. **Node.js** with Tuya API installed
3. **Device credentials** (ID and Key)

## Step 1: Get Device Credentials

You need to get the **Device ID** and **Device Key** for each light. Here are several methods:

### Method 1: Use Tuya CLI Tool

1. **Install Tuya CLI**:
   ```bash
   npm install -g @tuyapi/cli
   ```

2. **Scan for devices**:
   ```bash
   tuya-cli wizard
   ```

3. **Follow the wizard** to get your device credentials

### Method 2: Use Smart Life App

1. **Download Smart Life app** (by Tuya)
2. **Add your Energizer lights** to Smart Life
3. **Get device info** from the app settings

### Method 3: Use Tuya IoT Platform

1. **Go to**: https://iot.tuya.com/
2. **Create account** (free)
3. **Create cloud project**
4. **Link your devices**
5. **Get device credentials**

## Step 2: Update Your Pi Code

1. **Edit `server.js`**
2. **Replace the placeholder values**:

```javascript
const LIGHT_1_CONFIG = {
    id: 'YOUR_ACTUAL_DEVICE_ID_1', // Replace this
    key: 'YOUR_ACTUAL_DEVICE_KEY_1', // Replace this
    ip: '192.168.0.110' // Already correct
};

const LIGHT_2_CONFIG = {
    id: 'YOUR_ACTUAL_DEVICE_ID_2', // Replace this
    key: 'YOUR_ACTUAL_DEVICE_KEY_2', // Replace this
    ip: '192.168.0.179' // Already correct
};
```

## Step 3: Test the Setup

1. **Start your server**:
   ```bash
   npm start
   ```

2. **Test from web dashboard**:
   - Open `https://pi5.tail010721.ts.net:3000`
   - Click "Turn Light ON" button
   - Check console logs for success/error messages

3. **Test from API**:
   ```bash
   # Turn lights ON
   curl -X POST https://pi5.tail010721.ts.net:3000/light/on
   
   # Turn lights OFF
   curl -X POST https://pi5.tail010721.ts.net:3000/light/off
   ```

## How It Works

1. **Your Pi** connects directly to each Tuya device
2. **Sends commands** over your local network
3. **No cloud services** needed (faster and more reliable)
4. **Controls both lights** simultaneously

## Troubleshooting

### Common Issues

1. **"Device not found"**
   - Check device IP addresses are correct
   - Verify devices are online
   - Check network connectivity

2. **"Authentication failed"**
   - Verify device ID and key are correct
   - Make sure you're using the right credentials

3. **"Connection timeout"**
   - Check if devices are on the same network
   - Verify firewall settings
   - Try pinging the device IPs

### Debugging

1. **Check device connectivity**:
   ```bash
   ping 192.168.0.110
   ping 192.168.0.179
   ```

2. **Check console logs**:
   ```bash
   npm start
   # Watch for connection and control messages
   ```

3. **Test individual devices**:
   - Modify code to test one device at a time
   - Check which device is causing issues

## Benefits of Direct Control

- ✅ **Faster** - No cloud delays
- ✅ **More reliable** - Direct network connection
- ✅ **Free** - No service fees
- ✅ **Private** - No data sent to external services
- ✅ **Offline capable** - Works without internet

## Next Steps

Once working, you can:

1. **Add more devices** by adding more config objects
2. **Control individual lights** by creating separate endpoints
3. **Add dimming/brightness** control
4. **Add color control** (if supported)
5. **Create schedules** and automations

## Alternative: Keep Current Setup

If getting the device credentials is too complex, you can always:

1. **Keep using IFTTT** (if you already set it up)
2. **Use the web dashboard** as-is
3. **Use Alexa voice control** (already working)

The direct Tuya control is the most efficient, but your current setup already works perfectly!
