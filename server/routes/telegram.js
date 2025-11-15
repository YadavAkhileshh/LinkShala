import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const router = express.Router();

// In-memory history storage 
let repoHistory = [];
const MAX_HISTORY = 100;

// Get repo history 
router.get('/github-repos/history', async (req, res) => {
  try {
    res.json(repoHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.get('/github-repos', async (req, res) => {
  try {
    console.log('Fetching from Telegram...');
    
    const telegramUrl = process.env.TELEGRAM_CHANNEL;
    const { data } = await axios.get(telegramUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 10000
    });
    
    console.log('HTML fetched, parsing...');
    const $ = cheerio.load(data);
    const repos = [];
    
    $('.tgme_widget_message').each((i, elem) => {
      const textElem = $(elem).find('.tgme_widget_message_text');
      const text = textElem.text();
      const date = $(elem).find('.tgme_widget_message_date time').attr('datetime');
      
      // Extract GitHub URL from text or links
      let githubUrl = textElem.find('a[href*="github.com"]').attr('href');
      if (!githubUrl) {
        const urlMatch = text.match(/https?:\/\/github\.com\/[^\s]+/);
        githubUrl = urlMatch ? urlMatch[0] : null;
      }
      
      if (githubUrl) {
        const githubMatch = githubUrl.match(/github\.com\/([^\/\s]+)\/([^\/\s?#]+)/);
        
        if (githubMatch) {
          const owner = githubMatch[1];
          const repoName = githubMatch[2];
          
          // Extract title
          const lines = text.split('\n').filter(l => l.trim());
          const title = lines[0] || `${owner}/${repoName}`;
          
          // Extract description
          const description = lines.slice(1).join(' ').trim() || 'No description available';
          
          repos.push({
            id: $(elem).attr('data-post') || `${owner}-${repoName}-${i}`,
            owner,
            repoName,
            title: title.replace(/^GitHub\s*-\s*/i, '').trim(),
            description: description.replace(githubUrl, '').trim(),
            url: `https://github.com/${owner}/${repoName}`,
            date: date || new Date().toISOString(),
            fullText: text.trim()
          });
        }
      }
    });
    
    console.log(`Found ${repos.length} repos`);
    // Store in history (avoid duplicates)
    repos.forEach(repo => {
      const exists = repoHistory.find(h => h.url === repo.url);
      if (!exists) {
        repoHistory.unshift({ ...repo, addedAt: new Date().toISOString() });
      }
    });
    
    // Keep only last MAX_HISTORY items
    if (repoHistory.length > MAX_HISTORY) {
      repoHistory = repoHistory.slice(0, MAX_HISTORY);
    }
    
    res.json(repos.slice(0, 20));
  } catch (error) {
    console.error('Telegram fetch error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Telegram data',
      details: error.message 
    });
  }
});

export default router;
