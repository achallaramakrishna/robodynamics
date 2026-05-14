const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();

const localFile = path.join(__dirname, '..', 'standalone.tar.gz');
const remoteFile = '/opt/robodynamics/ai-tutor/web/standalone.tar.gz';

console.log('Connecting to server...');

conn.on('ready', () => {
  console.log('Client :: ready');
  
  // Start SFTP upload
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP connection failed:', err);
      conn.end();
      return;
    }
    
    console.log('SFTP session opened. Starting upload of standalone.tar.gz...');
    
    sftp.fastPut(localFile, remoteFile, (err) => {
      if (err) {
        console.error('SFTP upload failed:', err);
        conn.end();
        return;
      }
      
      console.log('SFTP upload completed successfully!');
      
      // Execute extraction and service restart
      const commands = [
        'cd /opt/robodynamics/ai-tutor/web',
        // Make sure destination exists and is clean
        'mkdir -p .next/standalone',
        'rm -rf .next/standalone/*',
        // Extract archive
        'tar -xzf standalone.tar.gz -C .next/standalone',
        'rm standalone.tar.gz',
        // Ensure runtime can serve public assets such as Vedika SVG boards
        'rm -rf .next/standalone/public',
        'ln -s /opt/robodynamics/ai-tutor/web/public .next/standalone/public',
        // Fix permissions and ownership
        'chown -R tomcat:tomcat /opt/robodynamics/ai-tutor/web/.next',
        'chmod -R 775 /opt/robodynamics/ai-tutor/web/.next',
        // Restart systemd service
        'systemctl restart rd-ai-tutor-web.service',
        // Validate service status and curl response
        'systemctl status rd-ai-tutor-web.service | grep -A 2 -i active',
        'sleep 3',
        'curl -I -k https://robodynamics.in/vidya/level-1'
      ];
      
      const cmdString = commands.join(' && ');
      console.log('Executing remote commands:', cmdString);
      
      conn.exec(cmdString, (err, stream) => {
        if (err) {
          console.error('Execution failed:', err);
          conn.end();
          return;
        }
        
        stream.on('close', (code, signal) => {
          console.log(`Command closed with code ${code}, signal ${signal}`);
          conn.end();
        }).on('data', (data) => {
          process.stdout.write('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
          process.stderr.write('STDERR: ' + data);
        });
      });
    });
  });
}).connect({
  host: '168.231.123.108',
  port: 22,
  username: 'root',
  password: 'Jatni@752050',
  readyTimeout: 999999
});
