const { Client } = require('ssh2');

const conn = new Client();

const commands = [
  'echo "=== KAVERI FOLDER SIZE ==="; ls -lh /var/www/robodynamics/ai-tutors/kaveri/ || echo "Folder not ready"'
];

const cmdString = commands.join(' ; ');

conn.on('ready', () => {
  conn.exec(cmdString, (err, stream) => {
    if (err) {
      conn.end();
      return;
    }
    
    stream.on('close', (code) => {
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    });
  });
}).on('error', (err) => {
  console.error(err);
}).connect({
  host: '168.231.123.108',
  port: 22,
  username: 'root',
  password: 'Jatni@752050',
  readyTimeout: 999999
});
