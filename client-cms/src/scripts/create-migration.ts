import { getPayload } from 'payload'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const configModule = await import(pathToFileURL(path.resolve('.payload-tmp/payload.config.payload.js')).href)
const config = configModule.default

async function main() {
  const migrationName = process.argv[2] || 'initial'

  process.env.DISABLE_PAYLOAD_HMR = 'true'
  process.env.PAYLOAD_MIGRATING = 'true'

  const payload = await getPayload({
    config,
    disableDBConnect: true,
    disableOnInit: true,
  })

  if (!payload.db) {
    throw new Error('No database adapter found')
  }

  await payload.db.createMigration({
    migrationName,
    payload,
  })

  await payload.destroy()
}

void main()
