import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

export default defineCloudflareConfig({
  // Without these the worker has no cache backend at all: every request is an
  // `x-nextjs-cache: MISS` that re-renders against Payload, and both the
  // `revalidate` window and `revalidateTag` are silently no-ops.
  incrementalCache: r2IncrementalCache,
  tagCache: d1NextTagCache,
});
