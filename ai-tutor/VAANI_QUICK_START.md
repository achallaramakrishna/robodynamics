# ⚡ Vaani Quick Start - 3 Steps to Launch

## 🎯 Goal
Launch Vaani (Hindi AI Tutor) to robodynamics.in/vaani in **~2-3 hours**

---

## 📋 Step 1: Generate 38 Missing Images (40 min)

### ✅ What's Done
- Prompt created: `VAANI_MISSING_38_IMAGES_GEMINI.txt`
- Everything formatted for Gemini AI

### 🚀 What You Need to Do

1. **Open the file**:
   ```
   C:\roboworkspace\robodynamics\ai-tutor\apps\vaani-tutor\VAANI_MISSING_38_IMAGES_GEMINI.txt
   ```

2. **Copy entire content** (Ctrl+A, Ctrl+C)

3. **Go to Gemini AI**: https://gemini.google.com

4. **Paste & Request**:
   - Paste content into new Gemini conversation
   - Type: `Generate all 38 Hindi learning images exactly as specified`
   - Wait for Gemini to generate images

5. **Download all images** to your computer

6. **Move to app directory**:
   ```bash
   # Copy all downloaded PNG files to:
   C:\roboworkspace\robodynamics\ai-tutor\apps\vaani-tutor\public\assets\gemini\
   ```

7. **Verify** (run in terminal):
   ```bash
   cd C:\roboworkspace\robodynamics\ai-tutor\apps\vaani-tutor\public\assets\gemini
   dir vaani_l4_*.png | wc    # Should show 7 files
   dir vaani_l5_*.png | wc    # Should show 31 files
   ```

### ✅ Done!
Move to **Step 2**

---

## 🔧 Step 2: Setup Nginx & PM2 (30 min)

### ✅ What's Already Done
- ✅ PM2 config created: `ecosystem.config.js`
- ✅ Nginx config created: `vaani.nginx.conf`
- ✅ .env.production created
- ✅ App rebuilt successfully

### 🚀 What You Need to Do

#### If using Linux/WSL with Nginx:

```bash
# 1. Copy Nginx config
sudo cp /c/roboworkspace/robodynamics/ai-tutor/vaani.nginx.conf \
        /etc/nginx/sites-available/vaani.conf

# 2. Enable the config
sudo ln -s /etc/nginx/sites-available/vaani.conf \
           /etc/nginx/sites-enabled/vaani.conf

# 3. Test Nginx config
sudo nginx -t
# Expected: "syntax is ok" + "test is successful"

# 4. Reload Nginx
sudo systemctl reload nginx

# 5. Start Vaani with PM2
cd /c/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor
pm2 start ecosystem.config.js --env development

# 6. Verify it started
pm2 list  # Should show vaani-tutor as online

# 7. Check logs (if needed)
pm2 logs vaani-tutor
```

#### If using Windows (no Nginx yet):
- Can still test on port 3001 directly
- Run: `pm2 start ecosystem.config.js`
- Access: `http://localhost:3001`

### ✅ Done!
Move to **Step 3**

---

## 🧪 Step 3: Test on Staging (30 min)

### Quick Sanity Checks (5 min)

```bash
# Test 1: Direct port 3001
curl http://localhost:3001

# Test 2: Via Nginx (if set up)
curl -H "Host: robodynamics.in" http://localhost/vaani/

# Test 3: Health check
curl http://localhost:3001/api/health
```

### Full Browser Testing (15 min)

1. **Edit /etc/hosts** to test locally:
   - **Windows**: `C:\Windows\System32\drivers\etc\hosts`
   - **Mac/Linux**: `/etc/hosts`
   - Add: `127.0.0.1 robodynamics.in`

2. **Open browser** to: `http://robodynamics.in/vaani/`

3. **Run through checklist**:
   ```
   ✓ Landing page loads
   ✓ Can select Level 1
   ✓ Lesson L1-C01-L01 loads (अ for Anar)
   ✓ Lesson L1-C01-L03 shows इ (NOT आ) ← KEY TEST
   ✓ No console errors (F12)
   ✓ Images load or show placeholders
   ✓ Can navigate to Level 4 & 5
   ✓ Health endpoint works: /api/health
   ```

### ✅ All Tests Pass?
**Vaani is READY for production!** 🚀

### ❌ Tests Fail?
Check `VAANI_DEPLOYMENT_GUIDE.md` → Troubleshooting section

---

## 📊 Success Metrics

| Check | Expected | Your Result |
|-------|----------|------------|
| Vaani process running | ✅ Online in `pm2 list` | |
| Port 3001 responding | ✅ HTTP 200 | |
| Nginx reverse proxy | ✅ HTTP 200 via /vaani/ | |
| Level 1 loads | ✅ Visible | |
| Lesson L1-C01-L03 | ✅ Shows इ | |
| Health endpoint | ✅ Returns JSON | |
| No console errors | ✅ Clean F12 | |

---

## 🎉 You're Done!

If all checks pass:

1. **Note the time** it took to deploy (for documentation)
2. **Notify team** that Vaani is live
3. **Monitor logs** for first 24 hours:
   ```bash
   pm2 logs vaani-tutor
   pm2 monit
   ```
4. **Next steps** (from VAANI_LAUNCH_SUMMARY.md):
   - Generate L1-L3 images (Week 2)
   - Set up HTTPS/SSL
   - Enable persistence/database
   - Set up parent dashboard

---

## 📞 Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| `pm2: command not found` | Run: `npm install -g pm2` |
| 502 Bad Gateway | Run: `pm2 logs vaani-tutor` to check errors |
| Can't connect to localhost:3001 | Check: `pm2 list` shows vaani-tutor online |
| Nginx won't reload | Run: `sudo nginx -t` to find syntax errors |
| Images broken | Check: 38 images copied to `/assets/gemini/` |
| Wrong character shown (अ, आ) | This is FIXED - verify on L1-C01-L03 |

**Need more help?** → See `VAANI_DEPLOYMENT_GUIDE.md`

---

## ⏱️ Timeline

- **Step 1** (Images): 40 min
- **Step 2** (Setup): 30 min
- **Step 3** (Testing): 30 min
- **TOTAL**: ~2 hours ✅

---

**Let's go! 🚀 Start with Step 1 above.**
