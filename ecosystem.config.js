module.exports = {
  apps: [
    {
      name: "app",
      script: "./src/app.js",
      instances: 0,
      exec_mode: "cluster",
      watch: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
