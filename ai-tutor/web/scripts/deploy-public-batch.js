const { Client } = require("ssh2");
const fs = require("fs");
const path = require("path");

const conn = new Client();

const localFile = path.join(__dirname, "..", "public-batch.tar.gz");
const remoteFile = "/opt/robodynamics/ai-tutor/web/public-batch.tar.gz";

if (!fs.existsSync(localFile)) {
  console.error(`Missing archive: ${localFile}`);
  process.exit(1);
}

console.log("Connecting to server...");

conn.on("ready", () => {
  console.log("Client :: ready");

  conn.sftp((err, sftp) => {
    if (err) {
      console.error("SFTP connection failed:", err);
      conn.end();
      return;
    }

    console.log("Uploading public-batch.tar.gz...");
    sftp.fastPut(localFile, remoteFile, (uploadErr) => {
      if (uploadErr) {
        console.error("SFTP upload failed:", uploadErr);
        conn.end();
        return;
      }

      const commands = [
        "cd /opt/robodynamics/ai-tutor/web",
        "tar -xzf public-batch.tar.gz -C public",
        "rm public-batch.tar.gz",
        "chown -R tomcat:tomcat /opt/robodynamics/ai-tutor/web/public",
        "find /opt/robodynamics/ai-tutor/web/public -type d -exec chmod 775 {} +",
        "find /opt/robodynamics/ai-tutor/web/public -type f -exec chmod 664 {} +",
        "curl -I -k https://robodynamics.in/math-svgs/level_2/VM_L2_7_DECIMAL_SPEED/decimal-alignment-grid.svg",
      ];

      const cmdString = commands.join(" && ");
      console.log("Executing remote commands:", cmdString);

      conn.exec(cmdString, (execErr, stream) => {
        if (execErr) {
          console.error("Execution failed:", execErr);
          conn.end();
          return;
        }

        stream
          .on("close", (code, signal) => {
            console.log(`Command closed with code ${code}, signal ${signal}`);
            conn.end();
          })
          .on("data", (data) => {
            process.stdout.write(`STDOUT: ${data}`);
          })
          .stderr.on("data", (data) => {
            process.stderr.write(`STDERR: ${data}`);
          });
      });
    });
  });
}).connect({
  host: "168.231.123.108",
  port: 22,
  username: "root",
  password: "Jatni@752050",
  readyTimeout: 999999,
});
