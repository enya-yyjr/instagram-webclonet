module.exports = {
  apps: [
    {
      name: "app",
      script: "./src/app.js",
      instances: 0,
      exec_mode: "cluster",
      watch: true,
    },
  ],
};
