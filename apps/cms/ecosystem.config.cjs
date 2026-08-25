module.exports = {
  apps: [
    {
      name: 'teecrownconsult-cms',
      cwd: '/home/teecrownconsult/apps/cms/current',
      script: 'node',
      args: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '700M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
      },
      env_file: '/home/teecrownconsult/apps/cms/shared/.env.production',
    },
  ],
}
