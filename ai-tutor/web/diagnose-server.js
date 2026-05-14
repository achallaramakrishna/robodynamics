const { Client } = require('ssh2');

const conn = new Client();

const commands = [
  'echo "=== LISTING TUTORS DIR ==="; ls -la /var/www/robodynamics/ai-tutors/'
];

const cmdString = commands.join(' ; ');

console.log('Connecting to server...');

conn.on('ready', () => {
  console.log('Connected! Executing tutors folder listing...');
  
  conn.exec(cmdString, (err, stream) => {
    if (err) {
      console.error('Execution error:', err);
      conn.end();
      return;
    }
    
    stream.on('close', (code, signal) => {
      console.log('Connection closed with code:', code);
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    }).stderr.on('data', (data) => {
      process.stderr.write('STDERR: ' + data.toString());
    });
  });
}).on('error', (err) => {
  console.error('Connection error:', err);
}).connect({
  host: '168.231.123.108',
  port: 22,
  username: 'root',
  password: 'Jatni@752050',
  readyTimeout: 999999
});
