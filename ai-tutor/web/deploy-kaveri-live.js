const { Client } = require('ssh2');
const path = require('path');

const conn = new Client();

const localFile = 'c:\\roboworkspace\\kaveri-fixes-prod.tar.gz';
const remoteFile = '/var/www/robodynamics/ai-tutors/kaveri/kaveri-fixes-prod.tar.gz';

console.log('Connecting to remote server robodynamics.in...');

conn.on('ready', () => {
  console.log('SSH Client :: ready');
  
  // Step 1: Create remote directories
  console.log('Ensuring remote directories exist...');
  conn.exec('mkdir -p /var/www/robodynamics/ai-tutors/kaveri', (err, stream) => {
    if (err) throw err;
    stream.resume(); // Consume stream data so 'close' is triggered
    stream.on('close', () => {
      console.log('Directories ready. Opening SFTP connection to upload build...');
      
      // Step 2: SFTP Upload
      conn.sftp((err, sftp) => {
        if (err) {
          console.error('SFTP connection failed:', err);
          conn.end();
          return;
        }
        
        console.log('SFTP session opened. Starting fastPut upload of kaveri-fixes-prod.tar.gz...');
        
        const options = {
          step: (transferred, chunk, total) => {
            const percent = ((transferred / total) * 100).toFixed(1);
            const mbTransferred = (transferred / 1024 / 1024).toFixed(1);
            const mbTotal = (total / 1024 / 1024).toFixed(1);
            console.log(`Upload Progress: ${percent}% (${mbTransferred} MB / ${mbTotal} MB)`);
          }
        };

        sftp.fastPut(localFile, remoteFile, options, (err) => {
          if (err) {
            console.error('SFTP upload failed:', err);
            conn.end();
            return;
          }
          console.log('✓ SFTP upload completed successfully!');
          
          // Step 3: Run Extraction, Installation, Systemd & Nginx setup
          const commands = [
            'echo "=== EXTRACTING COMPRESSED BUNDLE ==="',
            'cd /var/www/robodynamics/ai-tutors/kaveri',
            'tar -xzf kaveri-fixes-prod.tar.gz',
            'rm kaveri-fixes-prod.tar.gz',
            'echo "✓ Extraction completed."',
            
            'echo "=== INSTALLING PRODUCTION DEPENDENCIES (SERVER) ==="',
            'npm install --omit=dev',
            'echo "✓ Dependencies installed successfully."',

            'echo "=== CREATING SYSTEMD UNIT FILE ==="',
            `echo '[Unit]
Description=Kaveri Kannada AI Tutor Native
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/robodynamics/ai-tutors/kaveri
Environment=NODE_ENV=production
Environment=PORT=3002
Environment=HOSTNAME=127.0.0.1
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target' > /etc/systemd/system/rd-kaveri-ai.service`,
            'echo "✓ Systemd service unit written."',

            'echo "=== STARTING AND ENABLING KAVERI SERVICE ==="',
            'systemctl daemon-reload',
            'systemctl enable rd-kaveri-ai',
            'systemctl restart rd-kaveri-ai',
            'echo "✓ Service activated."',

            'echo "=== CONFIGURING NGINX ROUTING FOR KAVERI ==="',
            `python3 -c "
path = '/etc/nginx/sites-enabled/default'
with open(path, 'r') as f:
    content = f.read()
if 'location ^~ /kaveri' not in content:
    kaveri_block = '''    location ^~ /kaveri {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\$host;
        proxy_cache_bypass \\$http_upgrade;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;
    }

'''
    new_content = content.replace('    location / {', kaveri_block + '    location / {')
    with open(path, 'w') as f:
        f.write(new_content)
    print('✓ Nginx routing mapped successfully!')
else:
    print('✓ Nginx routing already mapped.')
"`,
            'echo "=== TESTING NGINX CONFIGURATION ==="',
            'nginx -t',
            'echo "=== RESTARTING NGINX SERVER ==="',
            'systemctl restart nginx',
            'echo "✓ Nginx restarted successfully."',

            'echo "=== POST-DEPLOYMENT SMOKE TESTS ==="',
            'sleep 3',
            'systemctl status rd-kaveri-ai | grep -A 2 -i active',
            'curl -s -I http://localhost:3002/kaveri/level-1/lesson/L1-C01-L01 | head -5'
          ];
          
          const cmdString = commands.join(' && ');
          console.log('Executing deployment command sequence on remote server...');
          
          conn.exec(cmdString, (err, stream) => {
            if (err) {
              console.error('Command initiation failed:', err);
              conn.end();
              return;
            }
            
            stream.resume(); // Ensure stream output is consumed
            stream.on('close', (code, signal) => {
              console.log(`=== DEPLOYMENT COMPLETED WITH STATUS CODE: ${code} ===`);
              conn.end();
            }).on('data', (data) => {
              process.stdout.write(data.toString());
            }).stderr.on('data', (data) => {
              process.stderr.write('STDERR: ' + data.toString());
            });
          });
        });
      });
    });
  });
}).on('error', (err) => {
  console.error('SSH Connection error:', err);
}).connect({
  host: '168.231.123.108',
  port: 22,
  username: 'root',
  password: 'Jatni@752050',
  readyTimeout: 999999
});
