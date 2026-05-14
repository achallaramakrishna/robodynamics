const { Client } = require('ssh2');

const conn = new Client();

const commands = [
  'echo "=== NGINX STATUS ==="',
  'systemctl status nginx --no-pager',
  'echo "=== NGINX CONFIG ==="',
  'nginx -T',
  'echo "=== SYSTEMD WEB APP STATUS ==="',
  'systemctl status rd-ai-tutor-web.service --no-pager || true',
  'echo "=== LOCAL NEXTJS LOOPBACKS ==="',
  'curl -s -I http://127.0.0.1:3000/vidya || true',
  'curl -s -I http://127.0.0.1:3000/mindsparc || true',
  'curl -s -I http://127.0.0.1:3000/mindsutra || true'
];

const cmdString = commands.join(' ; '); // Use semicolon so a failing command does not stop execution

console.log('Connecting to server...');

conn.on('ready', () => {
  console.log('Client :: ready');
  console.log('Executing diagnostic suite...');
  
  conn.exec(cmdString, (err, stream) => {
    if (err) throw err;
    
    let stdout = '';
    let stderr = '';
    
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      stdout += data;
    }).stderr.on('data', (data) => {
      stderr += data;
    });
    
    conn.on('end', () => {
      console.log('Connection closed. Output writing...');
      const fs = require('fs');
      fs.writeFileSync('C:\\roboworkspace\\robodynamics\\ai-tutor\\web\\scripts\\diagnose_output.txt', stdout + '\n\n=== STDERR ===\n' + stderr);
      console.log('Diagnostics completed successfully. Saved to diagnose_output.txt');
    });
  });
}).connect({
  host: '168.231.123.108',
  port: 22,
  username: 'root',
  password: 'Jatni@752050',
  readyTimeout: 999999
});
