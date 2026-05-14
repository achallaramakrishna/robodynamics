# Vaani Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PM2 installed globally (`npm install -g pm2`)
- Nginx installed and running
- Access to `/etc/nginx/sites-available/`

---

## 📋 Step 1: Generate Missing Images (BLOCKING)

**Status**: Currently PENDING
**Impact**: App will load with broken image placeholders without these

### Option A: Generate via Gemini (Recommended)
1. Open `VAANI_MISSING_38_IMAGES_GEMINI.txt`
2. Copy entire content
3. Go to Gemini AI (gemini.google.com)
4. Paste into chat with: "Generate these 38 Hindi learning illustrations"
5. Download all generated PNG files
6. Save to: `/apps/vaani-tutor/public/assets/gemini/`

### Option B: Use Placeholder Images (Temporary)
```bash
# Create a placeholder script (not recommended for production)
cd apps/vaani-tutor/public/assets/gemini
for file in vaani_l4_*.png vaani_l5_*.png; do
  [ ! -f "$file" ] && cp placeholder.png "$file"
done
```

---

## 🔧 Step 2: Setup PM2 (Staging & Production)

### Install PM2 Globally
```bash
npm install -g pm2
```

### Start Vaani with PM2
```bash
cd /c/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor

# Development
pm2 start ecosystem.config.js --env development

# Staging
pm2 start ecosystem.config.js --env development --name "vaani-staging"

# Production
pm2 start ecosystem.config.js --env production --name "vaani-prod"
```

### Monitor Vaani
```bash
# View all processes
pm2 list

# View detailed process info
pm2 show vaani-tutor

# Monitor in real-time
pm2 monit

# View logs
pm2 logs vaani-tutor
pm2 logs vaani-tutor --lines 100
pm2 logs vaani-tutor --err

# Clear logs
pm2 flush vaani-tutor
```

### Save PM2 Configuration for System Startup
```bash
pm2 save
pm2 startup

# On systemd systems:
sudo systemctl status pm2-root
```

---

## 🌐 Step 3: Setup Nginx

### Copy Configuration
```bash
# Copy Nginx config
sudo cp /c/roboworkspace/robodynamics/ai-tutor/vaani.nginx.conf \
        /etc/nginx/sites-available/vaani.conf

# Create symlink
sudo ln -s /etc/nginx/sites-available/vaani.conf \
           /etc/nginx/sites-enabled/vaani.conf
```

### Verify Configuration
```bash
# Test Nginx config
sudo nginx -t

# Expected output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Enable & Reload Nginx
```bash
# Reload Nginx
sudo systemctl reload nginx

# Verify it's running
sudo systemctl status nginx

# Check listening ports
sudo netstat -tlnp | grep nginx
```

### Create Log Directories
```bash
sudo mkdir -p /var/log/vaani-tutor
sudo mkdir -p /var/log/nginx
sudo chown www-data:www-data /var/log/vaani-tutor
sudo chown www-data:www-data /var/log/nginx
```

---

## 🧪 Step 4: Staging Test (CRITICAL)

### 4.1 Port 3001 Test (Direct PM2)
```bash
# Check if Vaani is running
curl -s http://localhost:3001 | head -c 200

# Expected: HTML response from Next.js app
```

### 4.2 Nginx Reverse Proxy Test
```bash
# Test via Nginx reverse proxy
curl -s -H "Host: robodynamics.in" http://localhost/vaani/ | head -c 200

# Expected: HTML response from Vaani (same as above)
```

### 4.3 Full URL Test
```bash
# If localhost is mapped to robodynamics.in in /etc/hosts:
curl -s http://robodynamics.in/vaani/ | head -c 200
```

### 4.4 Browser Testing (Recommended)

#### Setup /etc/hosts (for local testing)
```bash
# On Windows, edit: C:\Windows\System32\drivers\etc\hosts
# On Mac/Linux, edit: /etc/hosts

# Add this line:
127.0.0.1    robodynamics.in    www.robodynamics.in
```

#### Test in Browser
1. Navigate to: `http://robodynamics.in/vaani/`
2. Check if:
   - ✅ Landing page loads (Level select)
   - ✅ Level 1 loads without errors
   - ✅ Lessons load with correct characters
   - ✅ Images display (or show placeholder)
   - ✅ TTS audio plays (if configured)
   - ✅ Progress tracking works
   - ✅ No browser console errors (F12)

#### Test Specific Lessons
```
/vaani/level-1/lesson/L1-C01-L01  (अ for Anar)
/vaani/level-1/lesson/L1-C01-L03  (इ for Imli) ← Previously broken, now fixed
/vaani/level-4  (Consonants)
/vaani/level-5  (Conversations)
```

### 4.5 Performance Test
```bash
# Test response time
time curl -s http://robodynamics.in/vaani/ > /dev/null

# Expected: <200ms response time

# Load test (requires ab/wrk)
ab -n 100 -c 10 http://robodynamics.in/vaani/

# Expected: >95% successful requests
```

### 4.6 Memory & CPU Monitor
```bash
# Watch process in real-time
pm2 monit

# Expected for 1 instance:
# - Memory: <150MB
# - CPU: <10% idle
```

### 4.7 Health Check Endpoint
```bash
# If implemented:
curl -s http://robodynamics.in/vaani/health | jq .

# Expected:
# { "status": "ok", "uptime": 1234, ... }
```

---

## 🐛 Troubleshooting

### Issue: 502 Bad Gateway (Nginx error)
```bash
# Check if Vaani is running
pm2 list

# Check if port 3001 is listening
netstat -tlnp | grep 3001

# Solution: Restart Vaani
pm2 restart vaani-tutor

# Check logs
pm2 logs vaani-tutor
```

### Issue: Images not loading
```bash
# Check if image files exist
ls -la apps/vaani-tutor/public/assets/gemini/ | wc -l

# Check Nginx access log
sudo tail -f /var/log/nginx/vaani-access.log | grep -i asset

# Verify asset path in Nginx config
grep "alias /c/roboworkspace" /etc/nginx/sites-available/vaani.conf
```

### Issue: Wrong character displayed (Letter Popup)
- **Status**: Fixed in latest build ✅
- If still seeing issue:
  ```bash
  pm2 delete vaani-tutor
  npm run build
  pm2 start ecosystem.config.js
  ```

### Issue: TTS Audio not working
```bash
# Check SARVAM_API_KEY in .env.production
cat apps/vaani-tutor/.env.production | grep SARVAM

# Test API directly
curl -X POST https://api.sarvam.ai/text-to-speech \
  -H "api-subscription-key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input":"नमस्ते","target_language_code":"hi-IN","speaker":"meera"}'
```

---

## ✅ Pre-Launch Checklist

- [ ] All 38 images generated and in `/assets/gemini/`
- [ ] `ecosystem.config.js` copied to vaani-tutor root
- [ ] `vaani.nginx.conf` copied to `/etc/nginx/sites-available/`
- [ ] `.env.production` configured with valid API keys
- [ ] PM2 process started successfully (`pm2 list`)
- [ ] Nginx reloaded and verified (`sudo nginx -t`)
- [ ] Port 3001 responding to requests (`curl localhost:3001`)
- [ ] Reverse proxy working (`curl -H "Host: robodynamics.in" localhost/vaani/`)
- [ ] At least 3 lessons tested in browser
- [ ] No broken images (or all 38 generated)
- [ ] No console errors (F12 Developer Tools)
- [ ] TTS audio playing correctly
- [ ] Character display bug is fixed (L1-C01-L03 shows इ, not आ)
- [ ] Performance acceptable (<200ms response time)

---

## 📊 Post-Launch Monitoring

### Daily Checks
```bash
# Check process status
pm2 list

# Check recent errors
pm2 logs vaani-tutor --lines 50 --err

# Check memory usage
pm2 monit
```

### Log Rotation (Recommended)
```bash
# Install logrotate
sudo apt install logrotate

# Create /etc/logrotate.d/vaani
sudo tee /etc/logrotate.d/vaani << EOF
/var/log/vaani-tutor/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
}
EOF
```

### Backup Configuration
```bash
# Backup ecosystem config
cp apps/vaani-tutor/ecosystem.config.js \
   backups/ecosystem.config.js.$(date +%Y%m%d).bak

# Backup Nginx config
sudo cp /etc/nginx/sites-available/vaani.conf \
        backups/vaani.nginx.conf.$(date +%Y%m%d).bak
```

---

## 🔄 Rollback Procedure

If something goes wrong:

```bash
# Stop Vaani
pm2 stop vaani-tutor

# Restore previous version from backup
git checkout HEAD -- .

# Rebuild
npm run build

# Restart
pm2 restart vaani-tutor

# Monitor
pm2 logs vaani-tutor
```

---

## 📈 Next Steps After Launch

1. **Monitor Performance** (1 week)
   - Track response times
   - Monitor error rates
   - Check user engagement

2. **Generate Level 1-3 Images** (Week 2)
   - Follow same Gemini prompt process
   - ~100 additional images for full coverage

3. **Implement Persistence** (Week 3-4)
   - Set up PostgreSQL database
   - Add user progress tracking
   - Enable parent dashboard

4. **Scale & Optimize** (Week 5+)
   - CDN for assets
   - Database query optimization
   - Add caching layer (Redis)

---

## 📞 Support & Questions

For deployment issues:
- Check `/var/log/nginx/vaani-error.log`
- Check `pm2 logs vaani-tutor`
- Review this guide's troubleshooting section

Last Updated: 2026-05-11
