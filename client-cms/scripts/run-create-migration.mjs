import { build } from 'esbuild'
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env' })

const outdir = path.resolve('.payload-tmp')
const outfile = path.join(outdir, 'scripts', 'create-migration.js')

await rm(outdir, { force: true, recursive: true })
await mkdir(outdir, { recursive: true })

await build({
  bundle: false,
  entryPoints: [
    'src/scripts/create-migration.ts',
    'src/payload.config.payload.ts',
    'src/collections/Posts.ts',
    'src/collections/TourPackages.ts',
    'src/collections/Testimonials.ts',
    'src/collections/Media.ts',
    'src/collections/Users.ts',
    'src/collections/ContactSubmissions.ts',
    'src/hooks/triggerRevalidation.ts',
  ],
  format: 'esm',
  outbase: 'src',
  outdir,
  platform: 'node',
  sourcemap: false,
  target: 'node22',
})

async function rewriteImports(dir) {
  const entries = await readdir(dir)

  await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry)
    const entryStat = await stat(fullPath)

    if (entryStat.isDirectory()) {
      await rewriteImports(fullPath)
      return
    }

    if (!fullPath.endsWith('.js')) {
      return
    }

    const content = await readFile(fullPath, 'utf8')
    const rewritten = content.replace(
      /(from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g,
      (_, prefix, specifier, suffix) => {
        if (specifier.endsWith('.js') || specifier.endsWith('.json') || specifier.endsWith('.mjs')) {
          return `${prefix}${specifier}${suffix}`
        }

        return `${prefix}${specifier}.js${suffix}`
      },
    )

    if (rewritten !== content) {
      await writeFile(fullPath, rewritten)
    }
  }))
}

await rewriteImports(outdir)

await import(pathToFileURL(outfile).href)
