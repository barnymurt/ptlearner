const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = require('../src/App.jsx').default;
const fs = require('fs');
const path = require('path');

const SECTIONS_MAP = {
  'verbs25': { label: '25 Verbos', labelEn: '25 Most Used Verbs', icon: '⚡', desc: 'Essential verbs for everyday conversation', keywords: ['beginner', 'essential', 'basic', 'common', 'most used', 'core', 'fundamental', 'starter'] },
  'conjugation': { label: 'Conjugação', labelEn: 'Conjugation', icon: '📐', desc: 'Learn how verbs change form', keywords: ['grammar', 'verbs', 'endings', 'patterns', 'tenses', 'present', 'past', 'future'] },
  'pronouns': { label: 'Pronomes', labelEn: 'Pronouns', icon: '👤', desc: 'I, you, he, she - who is doing it', keywords: ['pronouns', 'subject', 'object', 'possessive', 'demonstrative', 'personal'] },
  'adjectives': { label: 'Adjetivos', labelEn: 'Adjectives', icon: '🎨', desc: 'Words to describe people and things', keywords: ['describing', 'descriptions', 'appearance', 'personality', 'character'] },
  'prepositions': { label: 'Preposições', labelEn: 'Prepositions', icon: '📍', desc: 'Words like in, on, with, from', keywords: ['location', 'movement', 'prepositions', 'place', 'position', 'direction'] },
  'articles': { label: 'Artigos', labelEn: 'Articles', icon: '📝', desc: 'The, a, an - and gender in Portuguese', keywords: ['articles', 'definite', 'indefinite', 'the', 'a', 'an', 'gender'] },
  'vocabulary': { label: 'Vocabulário', labelEn: 'Vocabulary', icon: '📚', desc: '20 themed word sets for daily life', keywords: ['vocabulary', 'words', 'topics', 'themes', 'daily', 'everyday', 'topics'] },
  'verbos999': { label: '999 Verbos', labelEn: '999 Verbs', icon: '📕', desc: 'Complete verb reference dictionary', keywords: ['verbs', 'complete', 'reference', 'all', 'extensive', 'comprehensive'] },
  'modals': { label: 'Modais', labelEn: 'Modals', icon: '🔧', desc: 'Can, must, should, want, need', keywords: ['ability', 'permission', 'obligation', 'modals', 'can', 'must', 'should', 'want', 'need'] },
  'idioms': { label: 'Expressões', labelEn: 'Expressions', icon: '🇵🇹', desc: 'Sound like a native speaker', keywords: ['idioms', 'natural', 'native', 'speaking', 'expressions', 'slang', 'informal', 'fluency'] },
  'falsefriends': { label: 'Falsos Amigos', labelEn: 'False Friends', icon: '⚠️', desc: 'Words that trick English speakers', keywords: ['traps', 'mistakes', 'confusing', 'similar', 'english', 'cognates'] },
  'structure': { label: 'Frases', labelEn: 'Phrases', icon: '🧱', desc: 'How to build sentences correctly', keywords: ['sentence', 'structure', 'word order', 'patterns', 'svo', 'construction'] },
  'preterito': { label: 'Pretéritos', labelEn: 'Past Tense', icon: '⏱️', desc: 'Talking about the past', keywords: ['past', 'history', 'yesterday', 'completed', 'imperfect', 'perfect', 'telling stories'] },
  'serestar': { label: 'Ser/Estar', labelEn: 'Ser/Estar', icon: '🔄', desc: 'Two ways to say "to be"', keywords: ['be', 'being', 'identity', 'states', 'permanent', 'temporary', 'characteristics'] },
  'escrita': { label: 'Escrita', labelEn: 'Writing', icon: '✍️', desc: 'Practice writing for exams', keywords: ['writing', 'exam', 'cile', 'practice', 'essay', 'formal'] },
  'oral': { label: 'Oral', labelEn: 'Speaking', icon: '🗣️', desc: 'Shadow dialogues to improve pronunciation', keywords: ['speaking', 'conversation', 'dialogue', 'listening', 'pronunciation', 'shadowing'] },
  'escuta': { label: 'Escuta', labelEn: 'Listening', icon: '🎧', desc: 'Watch and listen to real Portuguese', keywords: ['listening', 'comprehension', 'audio', 'media', 'youtube', 'tv', 'movies'] },
  'glossary': { label: 'Glossário', labelEn: 'Glossary', icon: '📖', desc: 'Grammar terms explained simply', keywords: ['grammar', 'terms', 'definitions', 'reference', 'help', 'explanations'] },
};

function generateLessonPlanFallback(answers) {
  const text = `level: ${answers.level}. goal: ${answers.goal}. context: ${answers.context}. time: ${answers.time}`.toLowerCase();
  const recommendations = [];
  const reasons = {};
  const addRec = (id, reason) => { if (!recommendations.includes(id)) { recommendations.push(id); reasons[id] = reason; } };
  const level = text.includes('beginner') || text.includes('never') || text.includes('zero') || text.includes('a1') || text.includes('starting') || text.includes('new to');
  const intermediate = text.includes('intermediate') || text.includes('some basics') || text.includes('basic') || text.includes('a2') || text.includes('some knowledge');
  if (level) { addRec('verbs25', 'Start with the 25 most essential verbs - they form the foundation of everyday Portuguese conversation'); addRec('conjugation', 'Learn how verbs change form across tenses - critical for building basic sentences'); addRec('pronouns', 'Understanding pronouns (eu, tu, ele, nós) is essential for sentence structure'); addRec('vocabulary', 'Build your vocabulary with themed word sets for daily situations'); addRec('articles', 'Learn the gender system (o, a, os, as) - Portuguese nouns have gender'); }
  else if (intermediate) { addRec('verbs25', 'Refresh and expand your verb knowledge with essential verbs'); addRec('conjugation', 'Master verb conjugations across multiple tenses'); addRec('vocabulary', 'Expand vocabulary in specific areas relevant to your goals'); addRec('prepositions', 'Prepositions (em, de, para, com) are crucial for natural speech'); addRec('articles', 'Solidify your understanding of article usage and gender'); addRec('modals', 'Modal verbs (poder, dever, querer) are key for expressing needs'); addRec('structure', 'Understand Portuguese sentence structure patterns'); }
  else { addRec('preterito', 'Master the past tense forms - Pretérito Perfeito and Imperfeito'); addRec('serestar', 'Understand the subtle differences between ser and estar'); addRec('idioms', 'Learn natural Portuguese expressions and idioms'); addRec('falsefriends', 'Avoid common mistakes that trip up even advanced learners'); addRec('escrita', 'Practice formal writing for exams or professional contexts'); }
  const speak = text.includes('speak') || text.includes('talk') || text.includes('conversation');
  const write = text.includes('write') || text.includes('essay') || text.includes('exam');
  if (speak) addRec('oral', 'Practice speaking with shadow dialogues - repeat phrases to improve pronunciation');
  if (write) addRec('escrita', 'Practice formal writing with model answers and templates');
  if (recommendations.length === 0) recommendations.push('verbs25', 'vocabulary', 'conjugation', 'prepositions', 'oral');
  return recommendations.slice(0, 6).map(id => ({ id, ...SECTIONS_MAP[id], reason: reasons[id] || SECTIONS_MAP[id]?.desc }));
}

const htmlTemplate = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, shrink-to-fit=no" />
  <title>PT Learner — Português Europeu A2</title>
  <meta name="description" content="Interactive European Portuguese A2 study tool for CIPLE exam preparation" />
  <meta name="theme-color" content="#0a0f0d" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🇵🇹</text></svg>" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  __CSS__
</head>
<body>
  <div id="root"></div>
  __JS__
</body>
</html>`;

let distPath;
try {
  distPath = path.join(__dirname, '..', 'dist');
} catch {}

const loadDist = (file) => {
  if (!distPath) return null;
  try { return fs.readFileSync(path.join(distPath, file)); } catch { return null; }
};

const htmlContent = loadDist('index.html');
const cssContent = loadDist('assets/index-5g_E038S.css');
const jsContent = loadDist('assets/index-DgTFlRQ4.js');

module.exports = async function handler(req, res) {
  const url = req.url || '';

  if (url.startsWith('/api')) {
    if (req.method === 'POST' && req.body && req.body.action === 'translate') {
      const { phrase } = req.body;
      if (!phrase || !phrase.trim()) return res.status(400).json({ error: 'No phrase provided' });
      const apiKey = process.env.MINIMAX_API_KEY;
      if (!apiKey) return res.status(200).json({ error: 'No API key configured' });
      try {
        const response = await fetch('https://api.minimax.io/v1/text/chatcompletion_v2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: 'MiniMax-Text-01',
            messages: [
              { role: 'system', content: 'You are a Portuguese language teacher. Translate the user\'s phrase to European Portuguese. Return ONLY valid JSON: {"portuguese":"...", "pronunciation":"...", "context":"..."}' },
              { role: 'user', content: `Translate this English phrase to European Portuguese: "${phrase}"` }
            ],
            temperature: 0.3,
            max_tokens: 500
          })
        });
        if (!response.ok) throw new Error('MiniMax API failed: ' + response.status);
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) throw new Error('No content in response');
        const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const translation = JSON.parse(cleaned);
        return res.status(200).json({ translation });
      } catch (error) {
        console.error('Translation error:', error);
        return res.status(200).json({ error: error.message });
      }
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { answers } = req.body || {};
    if (!answers || !answers.level || !answers.goal || !answers.context || !answers.time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) return res.status(200).json({ plan: generateLessonPlanFallback(answers), source: 'fallback', reason: 'No API key configured' });
    const sectionsContent = Object.entries(SECTIONS_MAP).map(([id, section]) => `${section.icon} ${section.labelEn}: ${section.desc}`).join('\n');
    const prompt = `You are Patrick, a warm and experienced Portuguese teacher. Create a highly personalized learning plan based on this student's unique situation.\n\nSTUDENT PROFILE:\n- Current Level: ${answers.level}\n- Main Goal: ${answers.goal}\n- Where they'll use it: ${answers.context}\n- Time available: ${answers.time}\n\nAPP SECTIONS:\n${sectionsContent}\n\nIMPORTANT CONTEXT FROM THEIR ANSWERS:\n- They want to speak with their GIRLFRIEND and her DAUGHTER - this is personal, intimate communication\n- They have local knowledge but terrible ACCENT - pronunciation is a priority\n- This is for DAILY LIFE in Lisbon - street conversations, family home, casual settings\n- They need to build a DAILY HABIT - suggest micro-learning strategies\n\nTASK:\nCreate a plan of 5-7 sections that addresses their specific needs. For each section explain EXACTLY why it helps them with their girlfriend, her daughter, and daily Lisbon life.\n\nBe specific about:\n- Which vocabulary topics (family words, emotions, daily routines, food, etc.)\n- Which oral/speaking exercises help with accent\n- Which expressions sound natural in Portugal (not Brazil)\n- How to build a 20-minute daily habit\n\nReturn JSON:\n[\n  {"id": "sectionId", "icon": "emoji", "labelEn": "Section Name", "reason": "Specific reason tied to their situation"}\n]`;
    try {
      const response = await fetch('https://api.minimax.io/v1/text/chatcompletion_v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: 'MiniMax-Text-01', messages: [{ role: 'system', content: 'You are Patrick, a warm and experienced Portuguese teacher from Lisbon. You specialize in helping people communicate with their partners and families. Always respond with valid JSON.' }, { role: 'user', content: prompt }], temperature: 0.8, max_tokens: 2000 })
      });
      if (!response.ok) throw new Error('MiniMax API failed: ' + response.status);
      const data = await response.json();
      if (data.base_resp?.status_code === 1002) throw new Error('Rate limit exceeded. Please wait a minute and try again.');
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('No content in response');
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const plan = JSON.parse(cleanedContent);
      return res.status(200).json({ plan, source: 'llm' });
    } catch (error) {
      console.error('LLM API error:', error);
      return res.status(200).json({ plan: generateLessonPlanFallback(answers), source: 'fallback', error: error.message });
    }
  }

  if (url.startsWith('/assets/')) {
    if (jsContent && url.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
      return res.send(jsContent);
    }
    if (cssContent && url.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
      return res.send(cssContent);
    }
  }

  if (jsContent && cssContent && htmlContent) {
    const html = htmlTemplate
      .replace('__CSS__', `<style>${cssContent}</style>`)
      .replace('__JS__', `<script type="module">${jsContent}</script>`);
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  res.status(200).send('<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Fluência</title></head><body><div id="root">Loading...</div><script>window.__LOADING__=true</script></body></html>');
};