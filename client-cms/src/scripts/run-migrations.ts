import { getPayload } from 'payload'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const configModule = await import(pathToFileURL(path.resolve('.payload-tmp/payload.config.payload.js')).href)
const config = configModule.default

async function main() {
  process.env.DISABLE_PAYLOAD_HMR = 'true'
  process.env.PAYLOAD_MIGRATING = 'true'

  const payload = await getPayload({
    config,
    disableOnInit: true,
  })

  if (!payload.db) {
    throw new Error('No database adapter found')
  }

  await removeDevMigrationMarker(payload)

  await payload.db.migrate({
    forceAcceptWarning: true,
  } as { forceAcceptWarning: true } & Parameters<typeof payload.db.migrate>[0])

  // Payload leaves open handles in this one-off CLI path, so exit explicitly.
  void payload.destroy()
}

async function removeDevMigrationMarker(payload: Awaited<ReturnType<typeof getPayload>>) {
  try {
    const { docs } = await payload.find({
      collection: 'payload-migrations',
      limit: 0,
    })

    for (const doc of docs) {
      if (doc.batch === -1) {
        await payload.delete({ collection: 'payload-migrations', id: doc.id })
        payload.logger.info({
          msg: `Removed dev migration marker (batch -1): ${doc.name}`,
        })
      }
    }
  } catch (err) {
    payload.logger.error({
      err,
      msg: 'Failed to remove dev migration marker',
    })
  }
}
main()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
