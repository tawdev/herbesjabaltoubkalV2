module.exports = {
  apps: [
    {
      name: 'herbes-backend',
      cwd: './backend',
      script: 'dist/src/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3007,
      },
    },
    {
      name: 'herbes-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start -- -p 3008',
      env: {
        NODE_ENV: 'production',
        PORT: 3008,
      },
    },
  ],
};
