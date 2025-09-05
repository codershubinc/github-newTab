import { resolve } from 'path';
import { mergeConfig, defineConfig } from 'vite';
import { crx, ManifestV3Export } from '@crxjs/vite-plugin';
import baseConfig, { baseManifest, baseBuildOptions } from './vite.config.base'

const outDir = resolve(__dirname, 'dist_firefox');

// Firefox-specific manifest modifications
const firefoxManifest = {
  ...baseManifest,
  // Firefox uses browser_specific_settings instead of some Chrome-specific fields
  browser_specific_settings: {
    gecko: {
      id: "github-newtab@codershubinc.com",
      strict_min_version: "109.0"
    }
  },
  // Firefox uses chrome_url_overrides for new tab (same as Chrome)
  chrome_url_overrides: {
    newtab: "src/pages/newtab/index.html"
  },
  // Firefox-specific permissions if needed
  permissions: [
    "activeTab"
  ],
  // Remove background scripts for new tab extensions as they're not needed
  // background: undefined
} as any; // Use 'any' to allow Firefox-specific properties

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      crx({
        manifest: firefoxManifest,
        browser: 'firefox',
        contentScripts: {
          injectCss: true,
        }
      })
    ],
    build: {
      ...baseBuildOptions,
      outDir,
      // Firefox-specific build options
      target: 'firefox102', // Target Firefox 102+ for better compatibility
    },
  })
)
