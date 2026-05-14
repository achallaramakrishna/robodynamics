const { Client } = require('ssh2');

const conn = new Client();

const commands = [
  'echo "=== PM2 STATUS ==="',
  'pm2 list',
  'echo "=== NGINX STATUS ==="',
  'systemctl status nginx --no-pager',
  'echo "=== LOCAL NEXTJS CURL ==="',
  'curl -s -I http://127.0.0.1:3000/vidya',
  'echo "=== LOCAL TOMCAT CURL ==="',
  'curl -s -I http://127.0.0.1:8080/robodynamics/'
];

const cmdString = commands.join(' && ');

console.log('Connecting to server...');

conn.on('ready', () => {
  console.log('Client :: ready');
  console.log('Executing:', cmdString);
  
  conn.exec(cmdString, (err, stream) => {
    if (err) throw err;
    
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      process.stdout.write('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      process.stderr.write('STDERR: ' + data);
    });
  });
}).connect({
  host: '168.231.123.108',
  port: 22,
  username: 'root',
  password: 'Jatni@752050',
  readyTimeout: 999999
});
