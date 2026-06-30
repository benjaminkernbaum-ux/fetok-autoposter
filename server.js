const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'public', 'images'), {
  maxAge: 0,
  setHeaders: (res, filePath) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    if (filePath.endsWith('.png') || filePath.endsWith('.jpg')) {
      res.setHeader('Content-Type', filePath.endsWith('.png') ? 'image/png' : 'image/jpeg');
    }
  }
}));

// Serve legacy videos too
app.use('/videos', express.static(path.join(__dirname, 'public', 'videos'), {
  maxAge: 0,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }
}));

// API: list images
app.get('/api/posts', (req, res) => {
  const postsFile = path.join(__dirname, 'data', 'posts.json');
  try {
    const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    res.json(posts);
  } catch (e) {
    res.json({ posts: [], error: e.message });
  }
});

// API: list videos
app.get('/api/videos', (req, res) => {
  const videosFile = path.join(__dirname, 'data', 'videos.json');
  try {
    const videos = JSON.parse(fs.readFileSync(videosFile, 'utf8'));
    res.json(videos);
  } catch (e) {
    res.json({ videos: [], error: e.message });
  }
});

// API: list stoic market posts
app.get('/api/stoic-posts', (req, res) => {
  const stoicFile = path.join(__dirname, 'data', 'stoic_posts.json');
  try {
    const posts = JSON.parse(fs.readFileSync(stoicFile, 'utf8'));
    res.json(posts);
  } catch (e) {
    res.json({ posts: [], error: e.message });
  }
});

// API: list all images in directory
app.get('/api/images', (req, res) => {
  const imagesDir = path.join(__dirname, 'public', 'images');
  try {
    const files = fs.readdirSync(imagesDir)
      .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
      .sort()
      .map(f => {
        const stat = fs.statSync(path.join(imagesDir, f));
        return { filename: f, size: stat.size, url: `/images/${encodeURIComponent(f)}` };
      });
    res.json({ count: files.length, images: files });
  } catch (e) {
    res.json({ count: 0, images: [], error: e.message });
  }
});

// Serve index.html for all other routes
app.use(express.static(__dirname));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✝ Luz da Palavra Hub running on port ${PORT}`);
  const imagesDir = path.join(__dirname, 'public', 'images');
  try {
    const files = fs.readdirSync(imagesDir).filter(f => /\.(png|jpg)$/i.test(f));
    console.log(`🖼️  ${files.length} images available`);
  } catch (e) {
    console.log('⚠️  No images directory found');
  }
});
