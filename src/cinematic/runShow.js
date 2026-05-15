#!/usr/bin/env node
// CLI runner.
//   node src/cinematic/runShow.js jonas
//   node src/cinematic/runShow.js jonas --no-cache

require('dotenv').config();
const { runShow } = require('./cinematicPipeline');

(async () => {
  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith('--')) || 'jonas';
  const useCache = !args.includes('--no-cache');

  try {
    await runShow({ slug, useCache });
    process.exit(0);
  } catch (err) {
    console.error('');
    console.error('❌ PIPELINE FAILED');
    console.error(err.stack || err.message);
    process.exit(1);
  }
})();
