import OpenAI from 'openai';
import http from 'http';
import { URL } from 'url';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const LANGUAGES = [
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese (Brazilian)' },
  { code: 'ru', name: 'Russian' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'sw', name: 'Swahili' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'ko', name: 'Korean' },
  { code: 'th', name: 'Thai' },
  { code: 'it', name: 'Italian' },
  { code: 'pl', name: 'Polish' },
];

async function translateText(text, targetLanguage) {
  if (!text || text.trim() === '') return text;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text to ${targetLanguage}. 
                    Keep the same tone and meaning. Only output the translation, nothing else.
                    If the text contains technical terms or product names, keep them accurate.
                    Preserve any HTML tags exactly as they are.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_completion_tokens: 4096,
    });
    
    return response.choices[0]?.message?.content?.trim() || text;
  } catch (error) {
    console.error(`Translation error for ${targetLanguage}:`, error.message);
    throw error;
  }
}

async function translateContent(content) {
  const translations = {};
  
  for (const lang of LANGUAGES) {
    translations[lang.code] = {};
    for (const [key, value] of Object.entries(content)) {
      if (typeof value === 'string' && value.trim()) {
        translations[lang.code][key] = await translateText(value, lang.name);
      } else {
        translations[lang.code][key] = value;
      }
    }
  }
  
  return translations;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'translation' }));
    return;
  }
  
  if (url.pathname === '/translate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { text, targetLanguage } = JSON.parse(body);
        const translation = await translateText(text, targetLanguage);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ translation }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }
  
  if (url.pathname === '/translate-batch' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });
      
      try {
        const { items } = JSON.parse(body);
        const total = items.length * LANGUAGES.length;
        let completed = 0;
        
        res.write(`data: ${JSON.stringify({ type: 'start', total })}\n\n`);
        
        for (const item of items) {
          const translations = {};
          
          for (const lang of LANGUAGES) {
            translations[lang.code] = {};
            
            for (const [key, value] of Object.entries(item.content || {})) {
              if (typeof value === 'string' && value.trim()) {
                try {
                  translations[lang.code][key] = await translateText(value, lang.name);
                } catch (err) {
                  translations[lang.code][key] = value;
                  res.write(`data: ${JSON.stringify({ type: 'progress', completed, total, current: `Error: ${item.name} - ${lang.name}`, error: err.message })}\n\n`);
                }
              } else {
                translations[lang.code][key] = value;
              }
            }
            
            completed++;
            res.write(`data: ${JSON.stringify({ type: 'progress', completed, total, current: `Translating ${item.name} to ${lang.name}` })}\n\n`);
          }
          
          res.write(`data: ${JSON.stringify({ type: 'item_complete', id: item.id, type: item.type, translations })}\n\n`);
        }
        
        res.write(`data: ${JSON.stringify({ type: 'complete', total: completed })}\n\n`);
        res.end();
      } catch (error) {
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
        res.end();
      }
    });
    return;
  }
  
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = process.env.TRANSLATION_PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Translation service running on port ${PORT}`);
});
