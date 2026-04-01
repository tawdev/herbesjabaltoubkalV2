module.exports = {
  apps: [
    {
      name: 'herbes-backend',
      cwd: './backend',
      script: 'npm',
      args: 'run start:prod',
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
