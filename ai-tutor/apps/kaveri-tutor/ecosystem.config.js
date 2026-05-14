/**
 * PM2 Ecosystem Configuration for Kaveri (Kannada AI Tutor)
 *
 * Usage:
 *   Production: pm2 start ecosystem.config.js --env production
 *
 * Monitor:
 *   pm2 monit
 *   pm2 logs kaveri-tutor
 *   pm2 show kaveri-tutor
 */

module.exports = {
  apps: [
    {
      // App name
      name: "kaveri-tutor",

      // Script to run (Next.js via npm start)
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3002",

      // Working directory (production path on Linux)
      cwd: "/var/www/kaveri-tutor",

      // Number of instances
      instances: 1,

      // Execution mode
      exec_mode: "fork",

      // Auto-restart on file changes
      watch: false,

      // Environment variables
      env: {
        NODE_ENV: "production",
        PORT: 3002,
        HOSTNAME: "0.0.0.0",
      },

      env_production: {
        NODE_ENV: "production",
        PORT: 3002,
        HOSTNAME: "0.0.0.0",
      },

      // Error/output log file paths
      error_file: "logs/error.log",
      out_file: "logs/out.log",
      log_file: "logs/combined.log",
      time: true,

      // Restart settings
      min_uptime: "10s",
      max_restarts: 10,
      max_memory_restart: "500M",

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: false,

      // Ignore patterns for watch mode
      ignore_watch: [
        "node_modules",
        ".next",
        ".git",
        "public",
        "logs",
      ],
    },
  ],
};
