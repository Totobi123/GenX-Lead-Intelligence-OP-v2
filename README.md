# GenX Lead Intelligence Suite v4.0

A professional, high-performance SaaS dashboard designed for elite lead generation and executive intelligence gathering. 

![GenX Pro](https://img.shields.io/badge/Status-Deployment--Ready-indigo?style=for-the-badge)
![License](https://img.shields.io/badge/License-Enterprise-purple?style=for-the-badge)

## 🚀 Core Features

- **High-Accuracy Intelligence**: Utilizes deep Google Search verification via Gemini AI to identify true CEOs, Presidents, and Principals. No more guessing.
- **Midnight Premium UI**: A beautiful, responsive "Midnight Indigo" dashboard with glassmorphism effects and real-time system monitoring (CPU/RAM/Uplink).
- **Secure Access System**: Built-in "Peace" login protocol granting 2,000 daily credits.
- **Daily Credit Renewal**: Automated energy handshake that resets user credits every 24 hours.
- **Threaded Background Processing**: Concurrently processes 5 leads at a time for maximum speed without crashing.
- **Persistence Engine**: Progress is saved to local storage. If you close the browser, the search **automatically resumes** exactly where it left off.
- **Database Archive**: Save completed batches to a permanent "Archive" tab. Re-download your intelligence reports anytime.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Download / Clone
```bash
git clone https://github.com/Titobi123/GenX-Lead-Intelligence.git
cd GenX-Lead-Intelligence
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev -- --host
```

---

## 🛰️ Deployment (Live Server)

To keep the application running 24/7 on a server (so it never closes), we recommend using **PM2**:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start "npm run dev -- --host" --name "ceo-finder"

# Save the process list to restart on reboot
pm2 save
```

### Management Commands:
- **Restart**: `pm2 restart ceo-finder`
- **Stop**: `pm2 stop ceo-finder`
- **Logs**: `pm2 logs ceo-finder`

---

## 📖 How to Use

1. **Login**: Enter the access pass `peace` to unlock the dashboard with 2,000 credits.
2. **Inbound**: 
   - Paste your leads (Name, Email) into the terminal or click **"Import Leads"** to upload an Excel (.xlsx), CSV, or TXT file.
   - Click **"Initialize Extraction"**.
3. **Terminal**:
   - Click **"Start Search"**. The AI will begin verifying the executives via live Google Search.
   - You can pause or close the page at any time; progress is safe.
4. **Intelligence**:
   - Once finished, view your results.
   - Click **"Archive Batch"** to save the results to your permanent database.
5. **Archive**:
   - Access the Archive tab to see all previous batches and re-download them as text files.

---

## 🔒 Security
- **API Protection**: The system includes a pool of 30+ rotated Gemini API keys with built-in rate-limit protection and automatic error recovery.
- **Local Privacy**: All lead data and archives are stored in your secure browser session.

Developed with ❤️ for elite Lead Gen teams.