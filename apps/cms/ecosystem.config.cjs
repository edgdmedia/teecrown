// The app is built and run in place — no release/current swap, so node_modules
// is never relocated. The repo is extracted with $HOME as the root, so its own
// apps/cms path is the app directory: /home/teecrownconsult/apps/cms.
//
// Invoking next's binary directly avoids depending on pnpm/corepack being on
// PATH inside the pm2 daemon.
//
// Note: `env_file` is deliberately absent. It was silently not applied, and the
// deploy script exports .env.production into the shell before `pm2 start`, which
// is what has always actually supplied PAYLOAD_SECRET and DATABASE_URI.
module.exports = {
  apps: [
    {
      name: 'teecrownconsult-cms',
      cwd: '/home/teecrownconsult/apps/cms',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000 -H 127.0.0.1',
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
    },
  ],
}
