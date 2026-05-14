/**
 * PM2 Ecosystem Configuration for Vaani (Hindi AI Tutor)
 *
 * Usage:
 *   Development: pm2 start ecosystem.config.js --env development
 *   Production:  pm2 start ecosystem.config.js --env production
 *
 * Monitor:
 *   pm2 monit
 *   pm2 logs vaani-tutor
 *   pm2 show vaani-tutor
 *
 * Restart/Stop:
 *   pm2 restart vaani-tutor
 *   pm2 stop vaani-tutor
 *   pm2 delete vaani-tutor
 *
 * Save for startup on system restart:
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [
    {
      // App name (used in pm2 commands)
      name: "vaani-tutor",

      // Script to run (Next.js via npm start)
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",

      // Working directory (production path on Linux)
      cwd: "/var/www/vaani-tutor",

      // Number of instances (1 for single, or use 'max' for CPU count)
      instances: 1,

      // Execution mode: 'cluster' for multiple instances, 'fork' for single
      exec_mode: "fork",

      // Auto-restart on file changes (development only)
      watch: false,

      // Environment variables
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        HOSTNAME: "0.0.0.0",
      },

      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
        HOSTNAME: "0.0.0.0",
      },

      // Error/output log file paths
      error_file: "logs/error.log",
      out_file: "logs/out.log",
      log_file: "logs/combined.log",
      time: true,

      // Restart settings
      min_uptime: "10s",           // Minimum uptime before considering app started
      max_restarts: 10,            // Max restart attempts
      max_memory_restart: "500M",  // Auto-restart if memory exceeds 500MB

      // Graceful shutdown
      kill_timeout: 5000,          // Wait 5s before force-kill
      wait_ready: false,

      // Listen on multiple ports (useful for load balancing)
      // args: "--port 3001",

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
