import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

type WebpackConfigWithAliases = {
  resolve?: {
    extensionAlias?: Record<string, string[]>
  }
}

const nextConfig: NextConfig = {
  // No `output: 'standalone'` on purpose.
  //
  // standalone exists to produce a minimal artifact you can move to a machine
  // with no toolchain. We build and run in the same directory on the VPS, so it
  // bought nothing and cost a great deal: with pnpm it emits
  // node_modules/{next,react,graphql} as relative symlinks into the store, and
  // relocating that tree — or flattening it one directory shallower, as the old
  // release/current swap did — leaves them dangling ("Cannot find module 'next'").
  //
  // Building in place keeps node_modules beside the app, intact.
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig: WebpackConfigWithAliases) => {
    webpackConfig.resolve ??= {}
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
