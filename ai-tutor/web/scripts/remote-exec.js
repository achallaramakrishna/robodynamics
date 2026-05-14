const { Client } = require('ssh2');

const conn = new Client();

const cmd = process.argv.slice(2).join(' ') || 'pwd';

console.log(`Connecting to server to execute: "${cmd}"...`);

conn.on('ready', () => {
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    
    stream.on('close', (code, signal) => {
      conn.end();
      process.exit(code);
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}).connect({
  host: '168.231.123.108',
  port: 22,
  username: 'root',
  password: 'Jatni@752050',
  readyTimeout: 999999
});
