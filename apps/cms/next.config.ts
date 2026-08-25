import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

type WebpackConfigWithAliases = {
  resolve?: {
    extensionAlias?: Record<string, string[]>
  }
}

const nextConfig: NextConfig = {
  output: 'standalone',
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
