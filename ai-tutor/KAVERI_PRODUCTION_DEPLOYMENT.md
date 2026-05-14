# Kaveri (Kannada AI Tutor) - Production Deployment Guide

## Status
- **Code**: ✅ Complete (195 lessons, 426 images)
- **L1-L5**: ✅ All images generated
- **L6**: ⏳ 22/42 images generated, need 20 more
- **Deployment**: ⏳ Ready to deploy (configs created)

## Prerequisites
- PM2 installed on production server
- Nginx running
- Node.js 18+ installed
- SSL certificates already configured (via certbot for robodynamics.in)

---

## Step 1: Prepare Source Code

### 1a. Commit Kaveri to Git
```bash
# On local machine
cd C:\roboworkspace\robodynamics\ai-tutor
git add apps/kaveri-tutor/
git commit -m "Kaveri: Add production PM2 and Nginx config"
git push origin main
```

### 1b. Build Locally
```bash
cd apps/kaveri-tutor
npm install
npm run build
```

**Expected output**:
```
Creating an optimized production build...
✓ 220 routes compiled successfully
```

---

## Step 2: Transfer Build to Production

### 2a. Create Archive (local machine)
```bash
cd apps/kaveri-tutor
tar --exclude=node_modules --exclude=.next/cache -czf kaveri-prod.tar.gz \
  app/ components/ lib/ public/ .next/ \
  package.json package-lock.json \
  next.config.mjs tsconfig.json tailwind.config.ts \
  postcss.config.js .env.production ecosystem.config.js

# Check size
ls -lh kaveri-prod.tar.gz
```

### 2b. Transfer via SCP
```bash
scp -i ~/.ssh/robodynamics_id kaveri-prod.tar.gz root@robodynamics.in:/root/

# Verify transfer
ssh -i ~/.ssh/robodynamics_id root@robodynamics.in "ls -lh /root/kaveri-prod.tar.gz"
```

---

## Step 3: Deploy on Production Server

### 3a. Extract Build
```bash
ssh -i ~/.ssh/robodynamics_id root@robodynamics.in

# On prod server:
rm -rf /var/www/kaveri-tutor
mkdir -p /var/www/kaveri-tutor
cd /var/www/kaveri-tutor
tar -xzf /root/kaveri-prod.tar.gz

# Verify
ls -la | head -15
```

### 3b. Install Dependencies
```bash
cd /var/www/kaveri-tutor
npm install --production

# Expected output:
# added 58 packages in 23s
```

### 3c. Start with PM2
```bash
# Find PM2 path
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 start ecosystem.config.js

# Verify
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 list
# Should show: kaveri-tutor | online | PID | status:online
```

---

## Step 4: Configure Nginx

### 4a. Copy Nginx Config
```bash
# On prod server:
cp /root/kaveri.nginx.conf /etc/nginx/sites-available/kaveri.conf

# Enable
ln -s /etc/nginx/sites-available/kaveri.conf /etc/nginx/sites-enabled/
```

### 4b. Test & Reload
```bash
# Test configuration
sudo nginx -t
# Expected: nginx: the configuration file syntax is ok

# Reload
sudo systemctl reload nginx

# Verify
ps aux | grep nginx  # Check nginx is running
```

---

## Step 5: Verify Deployment

### 5a. Direct Port Test
```bash
curl -s http://localhost:3002 | head -c 150
# Should show HTML starting with <!DOCTYPE html>
```

### 5b. HTTPS/Nginx Test
```bash
curl -s -I https://robodynamics.in/kaveri
# Expected: HTTP/2 200
# x-powered-by: Next.js
```

### 5c. Specific Routes
```bash
# Level test
curl -s https://robodynamics.in/kaveri/level-1 | grep -i "kannada\|level" | head -3

# Landing page
curl -s https://robodynamics.in/kaveri | grep -i "ಕನ್ನಡ" | head -1
```

---

## Step 6: Health Checks

### 6a. Process Health
```bash
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 show kaveri-tutor
# Check: status=online, memory <500MB, restarts=0
```

### 6b. Logs Check
```bash
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 logs kaveri-tutor --lines 20
# Should show: "listening on port 3002" or similar (look for errors)
```

### 6c. Browser Test
```bash
# On local machine, open:
# https://robodynamics.in/kaveri

# Verify:
# ✅ Landing page loads with Kannada text
# ✅ Level selector visible (Level 1-6 buttons)
# ✅ No console errors (F12 → Console)
# ✅ Images loading properly
```

---

## Step 7: PM2 Persistence (Optional but Recommended)

```bash
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 save
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 startup

# This ensures kaveri-tutor restarts on server reboot
```

---

## Troubleshooting

### Issue: "Connection refused" on port 3002
```bash
# Check if process is running
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 list

# Restart
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 restart kaveri-tutor

# Check logs
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 logs kaveri-tutor
```

### Issue: 502 Bad Gateway from Nginx
```bash
# Check Nginx config
sudo nginx -t

# Check if PM2 process is online
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 show kaveri-tutor

# Reload Nginx
sudo systemctl reload nginx
```

### Issue: Images not loading
```bash
# Check assets directory exists
ls -la /var/www/kaveri-tutor/public/assets/ | head -10

# Check generated images (L6)
ls -la /var/www/kaveri-tutor/public/assets/gemini/ | wc -l
# Should show 22 (already generated) + 20 more needed
```

### Issue: Out of memory
```bash
# Check memory usage
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 show kaveri-tutor
# If memory > 500MB, PM2 will auto-restart

# Force restart
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 restart kaveri-tutor
```

---

## Performance Tuning

### Check Load Times
```bash
# On local machine
time curl -s https://robodynamics.in/kaveri > /dev/null

# Expected: <500ms
```

### Optimize Cache
```bash
# Verify expires headers set correctly
curl -I https://robodynamics.in/kaveri/_next/static/chunks/main.js | grep -i cache

# Expected: Cache-Control: public, immutable
```

---

## Next Steps

### L6 Image Generation
```bash
# Still need to generate 20 more L6 images for Kaveri
# Follow GEMINI_PROMPT_READY.txt in kaveri-tutor/ directory
# Then copy images to /var/www/kaveri-tutor/public/assets/gemini/
```

### Monitor Production
```bash
# Watch logs for errors
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 monit

# Regular monitoring (add to crontab)
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 logs kaveri-tutor >> /var/log/kaveri-tutor.log 2>&1
```

---

## Rollback Plan

If critical issues occur:
```bash
# Stop kaveri-tutor
/root/.npm/_npx/*/node_modules/pm2/bin/pm2 stop kaveri-tutor

# Remove Nginx config
rm /etc/nginx/sites-enabled/kaveri.conf
sudo systemctl reload nginx

# App will still be available at: https://robodynamics.in/vaani (Vaani)
```

---

## Timeline
- Extract & install: 5-10 min
- Nginx setup: 5 min
- Verification: 5-10 min
- **Total**: 15-30 min

## Success Criteria
✅ Process runs (`pm2 list` shows online)
✅ Port 3002 responds (`curl http://localhost:3002`)
✅ Nginx routes to /kaveri/ (`curl https://robodynamics.in/kaveri`)
✅ HTTPS works (HTTP/2 200 response)
✅ Level 1 loads (no console errors)
