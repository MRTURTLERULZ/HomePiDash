# Raspberry Pi Deployment Guide

This guide will help you deploy your Smart Home Dashboard to your Raspberry Pi using Git.

## Prerequisites

1. **Raspberry Pi** with:
   - Node.js installed (version 14 or higher)
   - Git installed
   - Internet connection
   - SSH enabled (optional but recommended)

2. **Git Repository** set up (GitHub, GitLab, etc.)

## Step 1: Set Up Git Repository

### Option A: GitHub (Recommended)

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Repository name: `HomePiDash` (or your preferred name)
   - Make it **Private** (recommended for security)
   - Don't initialize with README (we already have files)

2. **Connect your local repository**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/HomePiDash.git
   git branch -M main
   git push -u origin main
   ```

### Option B: GitLab

1. **Create a new project on GitLab**
   - Go to https://gitlab.com/projects/new
   - Project name: `HomePiDash`
   - Make it **Private**
   - Don't initialize with README

2. **Connect your local repository**
   ```bash
   git remote add origin https://gitlab.com/YOUR_USERNAME/HomePiDash.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Raspberry Pi

### Method 1: SSH into Pi (Recommended)

1. **SSH into your Pi**
   ```bash
   ssh pi@YOUR_PI_IP_ADDRESS
   ```

2. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/HomePiDash.git
   cd HomePiDash
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the server**
   ```bash
   npm start
   ```

### Method 2: Direct on Pi

1. **Connect to Pi** (via SSH, VNC, or direct connection)

2. **Open terminal and run**
   ```bash
   git clone https://github.com/YOUR_USERNAME/HomePiDash.git
   cd HomePiDash
   npm install
   npm start
   ```

## Step 3: Make Pi Accessible from Internet

### Option A: Using ngrok (Easiest)

1. **Install ngrok on Pi**
   ```bash
   # Download from https://ngrok.com/download
   # Or install via package manager
   ```

2. **Start your server**
   ```bash
   npm start
   ```

3. **In another terminal, expose the server**
   ```bash
   ngrok http 3000
   ```

4. **Note the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

### Option B: Port Forwarding (Advanced)

1. **Configure router port forwarding**
   - Forward external port 3000 to Pi's IP:3000
   - Use your public IP address

2. **Start server**
   ```bash
   npm start
   ```

## Step 4: Configure Alexa

1. **Use your endpoint URL**
   - With ngrok: `https://abc123.ngrok.io/alexa/smart-home`
   - With port forwarding: `http://YOUR_PUBLIC_IP:3000/alexa/smart-home`

2. **Follow the Alexa setup guide** in `ALEXA_SETUP.md`

## Step 5: Set Up Auto-Start (Optional)

### Using PM2 (Recommended)

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Start with PM2**
   ```bash
   pm2 start server.js --name "smart-home-dashboard"
   ```

3. **Save PM2 configuration**
   ```bash
   pm2 save
   pm2 startup
   ```

4. **PM2 will auto-start on boot**

### Using systemd (Alternative)

1. **Create service file**
   ```bash
   sudo nano /etc/systemd/system/smart-home-dashboard.service
   ```

2. **Add this content**
   ```ini
   [Unit]
   Description=Smart Home Dashboard
   After=network.target

   [Service]
   Type=simple
   User=pi
   WorkingDirectory=/home/pi/HomePiDash
   ExecStart=/usr/bin/node server.js
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

3. **Enable and start**
   ```bash
   sudo systemctl enable smart-home-dashboard
   sudo systemctl start smart-home-dashboard
   ```

## Step 6: Update Process

### When you make changes on your laptop:

1. **Commit and push changes**
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

2. **On the Pi, pull updates**
   ```bash
   cd HomePiDash
   git pull
   ```

3. **Restart the server**
   ```bash
   # If using PM2
   pm2 restart smart-home-dashboard
   
   # If using npm start
   # Stop current process (Ctrl+C) then:
   npm start
   ```

## Troubleshooting

### Common Issues

1. **"Command not found: node"**
   - Install Node.js on Pi
   - Make sure it's in PATH

2. **"Permission denied"**
   - Check file permissions
   - Make sure you're in the right directory

3. **"Port 3000 already in use"**
   - Kill existing process: `sudo lsof -ti:3000 | xargs kill -9`
   - Or change port in server.js

4. **"Cannot connect to repository"**
   - Check internet connection
   - Verify repository URL
   - Check authentication (if private repo)

### Useful Commands

```bash
# Check if server is running
ps aux | grep node

# Check port usage
sudo netstat -tlnp | grep :3000

# View logs (if using PM2)
pm2 logs smart-home-dashboard

# Check systemd service status
sudo systemctl status smart-home-dashboard
```

## Security Notes

1. **Use HTTPS** when possible (ngrok provides this)
2. **Keep repository private** if it contains sensitive info
3. **Use strong passwords** for Pi
4. **Consider firewall rules** for production use
5. **Regular updates** for Pi OS and Node.js

## Next Steps

Once deployed:

1. **Test the web dashboard** from another device
2. **Set up Alexa integration** using the endpoint URL
3. **Add real IoT device control** to the `controlLight()` function
4. **Set up monitoring** and logging
5. **Consider backup strategies** for your Pi

