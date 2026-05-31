module.exports = {
  apps: [
    {
      name: 'journal-backend',
      cwd: './backend',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
    {
      name: 'journal-frontend',
      cwd: './frontend',
      script: 'node_modules/.bin/vite',
      args: 'preview --host --port 3000',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
