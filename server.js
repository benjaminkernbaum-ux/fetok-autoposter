const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from public/ with no cache for videos
app.use('/videos', express.static(path.join(__dirname, 'public', 'videos'), {
  maxAge: 0,
  setHeaders: (res, filePath) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }
}));

// API endpoint to list available videos
app.get('/api/videos', (req, res) => {
  const videosDir = path.join(__dirname, 'public', 'videos');
  try {
    const files = fs.readdirSync(videosDir)
      .filter(f => f.endsWith('.mp4'))
      .sort()
      .map(f => {
        const stat = fs.statSync(path.join(videosDir, f));
        return { filename: f, size: stat.size, url: `/videos/${encodeURIComponent(f)}` };
      });
    res.json({ count: files.length, videos: files });
  } catch (e) {
    res.json({ count: 0, videos: [], error: e.message });
  }
});

// Serve index.html for all other routes
app.use(express.static(__dirname));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 Luz da Palavra Hub running on port ${PORT}`);
  // Log available videos
  const videosDir = path.join(__dirname, 'public', 'videos');
  try {
    const files = fs.readdirSync(videosDir).filter(f => f.endsWith('.mp4'));
    console.log(`📹 ${files.length} videos available:`);
    files.forEach(f => console.log(`  → ${f}`));
  } catch (e) {
    console.log('⚠️  No videos directory found');
  }
});
