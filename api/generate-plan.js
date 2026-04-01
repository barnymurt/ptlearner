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
  
  const addRec = (id, reason) => {
    if (!recommendations.includes(id)) {
      recommendations.push(id);
      reasons[id] = reason;
    }
  };
  
  const level = text.includes('beginner') || text.includes('never') || text.includes('zero') || text.includes('a1') || text.includes('starting') || text.includes('new to');
  const intermediate = text.includes('intermediate') || text.includes('some basics') || text.includes('basic') || text.includes('a2') || text.includes('some knowledge');
  
  if (level) {
    addRec('verbs25', 'Start with the 25 most essential verbs - they form the foundation of everyday Portuguese conversation');
    addRec('conjugation', 'Learn how verbs change form across tenses - critical for building basic sentences');
    addRec('pronouns', 'Understanding pronouns (eu, tu, ele, nós) is essential for sentence structure');
    addRec('vocabulary', 'Build your vocabulary with themed word sets for daily situations');
    addRec('articles', 'Learn the gender system (o, a, os, as) - Portuguese nouns have gender');
  } else if (intermediate) {
    addRec('verbs25', 'Refresh and expand your verb knowledge with essential verbs');
    addRec('conjugation', 'Master verb conjugations across multiple tenses');
    addRec('vocabulary', 'Expand vocabulary in specific areas relevant to your goals');
    addRec('prepositions', 'Prepositions (em, de, para, com) are crucial for natural speech');
    addRec('articles', 'Solidify your understanding of article usage and gender');
    addRec('modals', 'Modal verbs (poder, dever, querer) are key for expressing needs');
    addRec('structure', 'Understand Portuguese sentence structure patterns');
  } else {
    addRec('preterito', 'Master the past tense forms - Pretérito Perfeito and Imperfeito');
    addRec('serestar', 'Understand the subtle differences between ser and estar');
    addRec('idioms', 'Learn natural Portuguese expressions and idioms');
    addRec('falsefriends', 'Avoid common mistakes that trip up even advanced learners');
    addRec('escrita', 'Practice formal writing for exams or professional contexts');
  }
  
  const speak = text.includes('speak') || text.includes('talk') || text.includes('conversation');
  const write = text.includes('write') || text.includes('essay') || text.includes('exam');
  
  if (speak) {
    addRec('oral', 'Practice speaking with shadow dialogues - repeat phrases to improve pronunciation');
  }
  if (write) {
    addRec('escrita', 'Practice formal writing with model answers and templates');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('verbs25', 'vocabulary', 'conjugation', 'prepositions', 'oral');
  }
  
  return recommendations.slice(0, 6).map(id => ({
    id,
    ...SECTIONS_MAP[id],
    reason: reasons[id] || SECTIONS_MAP[id]?.desc
  }));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers } = req.body;
  
  if (!answers || !answers.level || !answers.goal || !answers.context || !answers.time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.MINIMAX_API_KEY;
  
  if (!apiKey) {
    return res.status(200).json({ plan: generateLessonPlanFallback(answers), source: 'fallback', reason: 'No API key configured' });
  }

  const sectionsContent = Object.entries(SECTIONS_MAP).map(([id, section]) => {
    return `${section.icon} ${section.labelEn}: ${section.desc}`;
  }).join('\n');

  const prompt = `You are Patrick, a warm and experienced Portuguese teacher. Create a highly personalized learning plan based on this student's unique situation.

STUDENT PROFILE:
- Current Level: ${answers.level}
- Main Goal: ${answers.goal}
- Where they'll use it: ${answers.context}
- Time available: ${answers.time}

APP SECTIONS:
${sectionsContent}

IMPORTANT CONTEXT FROM THEIR ANSWERS:
- They want to speak with their GIRLFRIEND and her DAUGHTER - this is personal, intimate communication
- They have local knowledge but terrible ACCENT - pronunciation is a priority
- This is for DAILY LIFE in Lisbon - street conversations, family home, casual settings
- They need to build a DAILY HABIT - suggest micro-learning strategies

TASK:
Create a plan of 5-7 sections that addresses their specific needs. For each section explain EXACTLY why it helps them with their girlfriend, her daughter, and daily Lisbon life.

Be specific about:
- Which vocabulary topics (family words, emotions, daily routines, food, etc.)
- Which oral/speaking exercises help with accent
- Which expressions sound natural in Portugal (not Brazil)
- How to build a 20-minute daily habit

Return JSON:
[
  {"id": "sectionId", "icon": "emoji", "labelEn": "Section Name", "reason": "Specific reason tied to their situation"}
]`;

  try {
    const response = await fetch('https://api.minimaxi.chat/v1/text/chatcompletion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'MiniMax-Text-01',
        messages: [
          { role: 'system', content: 'You are Patrick, a warm and experienced Portuguese teacher from Lisbon. You specialize in helping people communicate with their partners and families. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error('MiniMax API failed: ' + response.status);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const plan = JSON.parse(cleanedContent);
      return res.status(200).json({ plan, source: 'llm' });
    }
  } catch (error) {
    console.error('LLM API error:', error);
    return res.status(200).json({ plan: generateLessonPlanFallback(answers), source: 'fallback', reason: error.message });
  }
  
  return res.status(200).json({ plan: generateLessonPlanFallback(answers), source: 'fallback' });
};
