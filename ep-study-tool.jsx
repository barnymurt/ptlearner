import { useState, useEffect, useCallback } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────────

const TOP_25_VERBS = [
  { verb: "ser", meaning: "to be (permanent)", conj: ["sou","és","é","somos","sois","são"] },
  { verb: "estar", meaning: "to be (temporary)", conj: ["estou","estás","está","estamos","estais","estão"] },
  { verb: "ter", meaning: "to have", conj: ["tenho","tens","tem","temos","tendes","têm"] },
  { verb: "fazer", meaning: "to do/make", conj: ["faço","fazes","faz","fazemos","fazeis","fazem"] },
  { verb: "ir", meaning: "to go", conj: ["vou","vais","vai","vamos","ides","vão"] },
  { verb: "poder", meaning: "to be able to", conj: ["posso","podes","pode","podemos","podeis","podem"] },
  { verb: "dizer", meaning: "to say", conj: ["digo","dizes","diz","dizemos","dizeis","dizem"] },
  { verb: "dar", meaning: "to give", conj: ["dou","dás","dá","damos","dais","dão"] },
  { verb: "saber", meaning: "to know (facts)", conj: ["sei","sabes","sabe","sabemos","sabeis","sabem"] },
  { verb: "querer", meaning: "to want", conj: ["quero","queres","quer","queremos","quereis","querem"] },
  { verb: "ver", meaning: "to see", conj: ["vejo","vês","vê","vemos","vedes","veem"] },
  { verb: "vir", meaning: "to come", conj: ["venho","vens","vem","vimos","vindes","vêm"] },
  { verb: "falar", meaning: "to speak", conj: ["falo","falas","fala","falamos","falais","falam"] },
  { verb: "comer", meaning: "to eat", conj: ["como","comes","come","comemos","comeis","comem"] },
  { verb: "viver", meaning: "to live", conj: ["vivo","vives","vive","vivemos","viveis","vivem"] },
  { verb: "trabalhar", meaning: "to work", conj: ["trabalho","trabalhas","trabalha","trabalhamos","trabalhais","trabalham"] },
  { verb: "precisar", meaning: "to need", conj: ["preciso","precisas","precisa","precisamos","precisais","precisam"] },
  { verb: "encontrar", meaning: "to find", conj: ["encontro","encontras","encontra","encontramos","encontrais","encontram"] },
  { verb: "pôr", meaning: "to put", conj: ["ponho","pões","põe","pomos","pondes","põem"] },
  { verb: "ficar", meaning: "to stay/become", conj: ["fico","ficas","fica","ficamos","ficais","ficam"] },
  { verb: "dever", meaning: "to owe/should", conj: ["devo","deves","deve","devemos","deveis","devem"] },
  { verb: "trazer", meaning: "to bring", conj: ["trago","trazes","traz","trazemos","trazeis","trazem"] },
  { verb: "esperar", meaning: "to wait/hope", conj: ["espero","esperas","espera","esperamos","esperais","esperam"] },
  { verb: "beber", meaning: "to drink", conj: ["bebo","bebes","bebe","bebemos","bebeis","bebem"] },
  { verb: "conhecer", meaning: "to know (people)", conj: ["conheço","conheces","conhece","conhecemos","conheceis","conhecem"] },
];

const PRONOUNS = ["eu","tu","ele/ela","nós","vós","eles/elas"];

const CONJUGATION_PATTERNS = {
  "Presente": {
    ar: ["-o","-as","-a","-amos","-ais","-am"],
    er: ["-o","-es","-e","-emos","-eis","-em"],
    ir: ["-o","-es","-e","-imos","-is","-em"],
    example_ar: "falar → falo, falas, fala, falamos, falais, falam",
    example_er: "comer → como, comes, come, comemos, comeis, comem",
    example_ir: "partir → parto, partes, parte, partimos, partis, partem",
  },
  "Pretérito Perfeito": {
    ar: ["-ei","-aste","-ou","-ámos","-astes","-aram"],
    er: ["-i","-este","-eu","-emos","-estes","-eram"],
    ir: ["-i","-iste","-iu","-imos","-istes","-iram"],
    example_ar: "falar → falei, falaste, falou, falámos, falastes, falaram",
    example_er: "comer → comi, comeste, comeu, comemos, comestes, comeram",
    example_ir: "partir → parti, partiste, partiu, partimos, partistes, partiram",
  },
  "Pretérito Imperfeito": {
    ar: ["-ava","-avas","-ava","-ávamos","-áveis","-avam"],
    er: ["-ia","-ias","-ia","-íamos","-íeis","-iam"],
    ir: ["-ia","-ias","-ia","-íamos","-íeis","-iam"],
    example_ar: "falar → falava, falavas, falava, falávamos, faláveis, falavam",
    example_er: "comer → comia, comias, comia, comíamos, comíeis, comiam",
    example_ir: "partir → partia, partias, partia, partíamos, partíeis, partiam",
  },
  "Futuro": {
    ar: ["-arei","-arás","-ará","-aremos","-areis","-arão"],
    er: ["-erei","-erás","-erá","-eremos","-ereis","-erão"],
    ir: ["-irei","-irás","-irá","-iremos","-ireis","-irão"],
    example_ar: "falar → falarei, falarás, falará, falaremos, falareis, falarão",
    example_er: "comer → comerei, comerás, comerá, comeremos, comereis, comerão",
    example_ir: "partir → partirei, partirás, partirá, partiremos, partireis, partirão",
  },
  "Condicional": {
    ar: ["-aria","-arias","-aria","-aríamos","-aríeis","-ariam"],
    er: ["-eria","-erias","-eria","-eríamos","-eríeis","-eriam"],
    ir: ["-iria","-irias","-iria","-iríamos","-iríeis","-iriam"],
    example_ar: "falar → falaria, falarias, falaria, falaríamos, falaríeis, falariam",
    example_er: "comer → comeria, comerias, comeria, comeríamos, comeríeis, comeriam",
    example_ir: "partir → partiria, partirias, partiria, partiríamos, partiríeis, partiriam",
  },
};

const ADJECTIVES = [
  ["grande","big"], ["pequeno","small"], ["bom","good"], ["mau","bad"],
  ["feliz","happy"], ["triste","sad"], ["velho","old"], ["novo","new"],
  ["bonito","beautiful"], ["feio","ugly"], ["forte","strong"], ["fraco","weak"],
  ["alto","tall"], ["baixo","short"], ["largo","wide"], ["estreito","narrow"],
  ["limpo","clean"], ["sujo","dirty"], ["doce","sweet"], ["amargo","bitter"],
  ["claro","clear/light"], ["escuro","dark"], ["devagar","slow"], ["rápido","fast"],
  ["cheio","full"], ["vazio","empty"], ["rico","rich"], ["pobre","poor"],
  ["quente","hot"], ["frio","cold"], ["caro","expensive"], ["barato","cheap"],
  ["pesado","heavy"], ["leve","light"], ["seguro","safe"], ["perigoso","dangerous"],
  ["fácil","easy"], ["difícil","difficult"], ["aberto","open"], ["fechado","closed"],
];

const PREPOSITION_EXERCISES = [
  { sentence: "O gato está ___ a cama.", answer: "em", hint: "location: on/in" },
  { sentence: "Vamos viajar ___ carro amanhã.", answer: "de", hint: "means of transport" },
  { sentence: "Ela falou muito ___ o problema.", answer: "sobre", hint: "about a topic" },
  { sentence: "O livro foi escrito ___ uma autora famosa.", answer: "por", hint: "by someone" },
  { sentence: "Eles estão ___ o parque.", answer: "no", hint: "at a place (em + o)" },
  { sentence: "Ele saiu ___ casa muito cedo.", answer: "de", hint: "from a place" },
  { sentence: "Chegámos ___ aeroporto atrasados.", answer: "ao", hint: "to a place (a + o)" },
  { sentence: "Posso contar ___ você?", answer: "com", hint: "rely on someone" },
  { sentence: "Este café é feito ___ leite.", answer: "com", hint: "made with" },
  { sentence: "Vou mandar este e-mail ___ meu chefe.", answer: "para", hint: "to someone (destination)" },
  { sentence: "Ele passou ___ o túnel rapidamente.", answer: "por", hint: "through a place" },
  { sentence: "Hoje estou ___ paciência para isso.", answer: "sem", hint: "without" },
  { sentence: "A loja fica ___ a farmácia e o banco.", answer: "entre", hint: "between two things" },
  { sentence: "Vou estudar ___ às dez horas.", answer: "até", hint: "until a time" },
  { sentence: "Ela pôs o livro ___ a mesa.", answer: "sobre", hint: "on top of" },
  { sentence: "Isto é ___ ti.", answer: "para", hint: "for someone" },
  { sentence: "Estou ___ Lisboa há dois anos.", answer: "em", hint: "in a city" },
  { sentence: "Ele foi ___ Portugal no verão.", answer: "a", hint: "to (a country, short trip)" },
  { sentence: "O comboio passa ___ aqui.", answer: "por", hint: "passes through/by here" },
  { sentence: "Não consigo viver ___ música.", answer: "sem", hint: "without something" },
];

const PRONOUNS_DATA = {
  "Sujeito (Subject)": [
    ["eu","I"], ["tu","you (informal)"], ["ele/ela","he/she"],
    ["você","you (formal)"], ["nós","we"], ["vós","you (pl.)"], ["eles/elas","they"]
  ],
  "Objeto Direto (Direct Object)": [
    ["me","me"], ["te","you"], ["o/a","him/her"],
    ["nos","us"], ["vos","you (pl.)"], ["os/as","them"]
  ],
  "Objeto Indireto (Indirect Object)": [
    ["me","to me"], ["te","to you"], ["lhe","to him/her"],
    ["nos","to us"], ["vos","to you (pl.)"], ["lhes","to them"]
  ],
  "Reflexivo (Reflexive)": [
    ["me","myself"], ["te","yourself"], ["se","himself/herself"],
    ["nos","ourselves"], ["vos","yourselves"], ["se","themselves"]
  ],
  "Possessivo (Possessive)": [
    ["meu/minha","my"], ["teu/tua","your"], ["seu/sua","his/her"],
    ["nosso/nossa","our"], ["vosso/vossa","your (pl.)"], ["seu/sua","their"]
  ],
};

const VOCABULARY = {
  "Família": [
    ["a mãe","mother"],["o pai","father"],["o filho","son"],["a filha","daughter"],
    ["o irmão","brother"],["a irmã","sister"],["o avô","grandfather"],["a avó","grandmother"],
    ["o tio","uncle"],["a tia","aunt"],["o primo","cousin (m)"],["a prima","cousin (f)"],
    ["o marido","husband"],["a mulher","wife"],["o sobrinho","nephew"],["a sobrinha","niece"],
  ],
  "Comida e Bebida": [
    ["o pão","bread"],["o queijo","cheese"],["a carne","meat"],["o peixe","fish"],
    ["o arroz","rice"],["a sopa","soup"],["a salada","salad"],["a fruta","fruit"],
    ["o café","coffee"],["o chá","tea"],["a água","water"],["o sumo","juice"],
    ["o vinho","wine"],["a cerveja","beer"],["o leite","milk"],["o azeite","olive oil"],
  ],
  "Casa": [
    ["a cozinha","kitchen"],["a sala","living room"],["o quarto","bedroom"],
    ["a casa de banho","bathroom"],["o jardim","garden"],["a janela","window"],
    ["a porta","door"],["a mesa","table"],["a cadeira","chair"],["o sofá","sofa"],
    ["a cama","bed"],["o espelho","mirror"],["a escada","stairs"],["o telhado","roof"],
    ["a parede","wall"],["o chão","floor"],
  ],
  "Corpo": [
    ["a cabeça","head"],["o olho","eye"],["o nariz","nose"],["a boca","mouth"],
    ["a orelha","ear"],["o braço","arm"],["a mão","hand"],["o dedo","finger"],
    ["a perna","leg"],["o pé","foot"],["o peito","chest"],["as costas","back"],
    ["o ombro","shoulder"],["o joelho","knee"],["o pescoço","neck"],["o cabelo","hair"],
  ],
  "Cidade": [
    ["a rua","street"],["a praça","square"],["o supermercado","supermarket"],
    ["a farmácia","pharmacy"],["o hospital","hospital"],["a estação","station"],
    ["o restaurante","restaurant"],["o café","café"],["a loja","shop"],
    ["o banco","bank"],["os correios","post office"],["a igreja","church"],
    ["o parque","park"],["a biblioteca","library"],["o museu","museum"],["a escola","school"],
  ],
  "Tempo e Clima": [
    ["hoje","today"],["amanhã","tomorrow"],["ontem","yesterday"],["agora","now"],
    ["sempre","always"],["nunca","never"],["às vezes","sometimes"],["cedo","early"],
    ["tarde","late"],["o sol","sun"],["a chuva","rain"],["o vento","wind"],
    ["quente","hot"],["frio","cold"],["nublado","cloudy"],["o tempo","weather/time"],
  ],
  "Transportes": [
    ["o carro","car"],["o autocarro","bus"],["o comboio","train"],["o avião","plane"],
    ["o metro","metro"],["o elétrico","tram"],["a bicicleta","bicycle"],["o táxi","taxi"],
    ["a paragem","stop"],["a estação","station"],["o aeroporto","airport"],["o bilhete","ticket"],
    ["a viagem","trip"],["o condutor","driver"],["o passageiro","passenger"],["a mala","suitcase"],
  ],
  "Trabalho": [
    ["o escritório","office"],["o computador","computer"],["a reunião","meeting"],
    ["o colega","colleague"],["o chefe","boss"],["o emprego","job"],["o salário","salary"],
    ["as férias","holidays"],["o horário","schedule"],["a empresa","company"],
    ["o cliente","client"],["o projeto","project"],["o contrato","contract"],
    ["a entrevista","interview"],["o currículo","CV"],["a experiência","experience"],
  ],
};

const MODAL_VERBS = [
  {
    verb: "poder", meaning: "can / to be able to",
    presente: ["posso","podes","pode","podemos","podeis","podem"],
    usage: "Ability or permission: Posso abrir a janela? (Can I open the window?)",
    examples: ["Eu posso ajudar-te.","Tu não podes entrar.","Ela pode falar três línguas."],
  },
  {
    verb: "dever", meaning: "should / must / to owe",
    presente: ["devo","deves","deve","devemos","deveis","devem"],
    usage: "Obligation or advice: Deves estudar mais. (You should study more.)",
    examples: ["Eu devo ir ao médico.","Tu deves ter cuidado.","Nós devemos sair agora."],
  },
  {
    verb: "querer", meaning: "to want",
    presente: ["quero","queres","quer","queremos","quereis","querem"],
    usage: "Desire or wish: Quero um café, por favor. (I want a coffee, please.)",
    examples: ["Eu quero aprender português.","Tu queres ir ao cinema?","Eles querem viajar."],
  },
  {
    verb: "precisar de", meaning: "to need",
    presente: ["preciso","precisas","precisa","precisamos","precisais","precisam"],
    usage: "Necessity (always followed by 'de'): Preciso de ajuda. (I need help.)",
    examples: ["Eu preciso de dormir.","Tu precisas de um casaco.","Nós precisamos de tempo."],
  },
  {
    verb: "conseguir", meaning: "to manage to / to be able to",
    presente: ["consigo","consegues","consegue","conseguimos","conseguis","conseguem"],
    usage: "Achievement or success: Consegui terminar! (I managed to finish!)",
    examples: ["Eu consigo ver daqui.","Tu consegues perceber?","Ela não consegue dormir."],
  },
  {
    verb: "ter de/que", meaning: "to have to",
    presente: ["tenho","tens","tem","temos","tendes","têm"],
    usage: "Strong obligation: Tenho de ir embora. (I have to leave.)",
    examples: ["Eu tenho de trabalhar.","Tu tens que estudar.","Nós temos de decidir."],
  },
];

const ARTICLES_DATA = {
  definite: {
    title: "Artigos Definidos",
    forms: [
      { label: "Masculino Singular", article: "o", example: "o livro (the book)" },
      { label: "Feminino Singular", article: "a", example: "a casa (the house)" },
      { label: "Masculino Plural", article: "os", example: "os livros (the books)" },
      { label: "Feminino Plural", article: "as", example: "as casas (the houses)" },
    ],
    contractions: [
      ["a + o = ao", "a + a = à", "a + os = aos", "a + as = às"],
      ["de + o = do", "de + a = da", "de + os = dos", "de + as = das"],
      ["em + o = no", "em + a = na", "em + os = nos", "em + as = nas"],
      ["por + o = pelo", "por + a = pela", "por + os = pelos", "por + as = pelas"],
    ],
  },
  indefinite: {
    title: "Artigos Indefinidos",
    forms: [
      { label: "Masculino Singular", article: "um", example: "um livro (a book)" },
      { label: "Feminino Singular", article: "uma", example: "uma casa (a house)" },
      { label: "Masculino Plural", article: "uns", example: "uns livros (some books)" },
      { label: "Feminino Plural", article: "umas", example: "umas casas (some houses)" },
    ],
  },
};

const ARTICLES_EXERCISES = [
  { sentence: "___ menino está na escola.", answer: "O", hint: "definite, masc. sing." },
  { sentence: "Vou comprar ___ livro.", answer: "um", hint: "indefinite, masc. sing." },
  { sentence: "___ raparigas estão no parque.", answer: "As", hint: "definite, fem. pl." },
  { sentence: "Preciso ___ caneta.", answer: "de uma", hint: "de + indefinite, fem. sing." },
  { sentence: "Ela foi ___ supermercado.", answer: "ao", hint: "a + definite, masc. sing." },
  { sentence: "Os livros estão ___ mesa.", answer: "na", hint: "em + definite, fem. sing." },
  { sentence: "Recebi ___ carta ___ amigos.", answer: "uma / dos", hint: "indef. fem. / de + def. masc. pl." },
  { sentence: "Ele vem ___ Brasil.", answer: "do", hint: "de + definite, masc. sing." },
  { sentence: "Ela gosta ___ flores.", answer: "das", hint: "de + definite, fem. pl." },
  { sentence: "Vou ___ praia.", answer: "à", hint: "a + definite, fem. sing." },
];

const IDIOMS = [
  { pt: "Estar com os azeites", en: "To be in a bad mood", literal: "To be with the olive oils" },
  { pt: "Ficar a ver navios", en: "To be left empty-handed", literal: "To stay watching ships" },
  { pt: "Meter água", en: "To fail / go wrong", literal: "To take on water" },
  { pt: "Dar o braço a torcer", en: "To admit you were wrong", literal: "To give the arm to twist" },
  { pt: "Pôr os pontos nos is", en: "To set things straight", literal: "To put the dots on the i's" },
  { pt: "Andar com a cabeça na lua", en: "To be distracted/daydreaming", literal: "To walk with head on the moon" },
  { pt: "Fazer das tripas coração", en: "To make a big effort", literal: "To make heart from guts" },
  { pt: "Custa os olhos da cara", en: "It costs a fortune", literal: "It costs the eyes of the face" },
  { pt: "Engolir sapos", en: "To put up with unpleasant things", literal: "To swallow frogs" },
  { pt: "Ir com os porcos", en: "To die / to fail completely", literal: "To go with the pigs" },
  { pt: "Ter macaquinhos no sótão", en: "To be a bit crazy", literal: "To have little monkeys in the attic" },
  { pt: "Não ter papas na língua", en: "To speak bluntly", literal: "To not have porridge on the tongue" },
  { pt: "Estar-se nas tintas", en: "To not care at all", literal: "To be in the paints" },
  { pt: "Andar à nora", en: "To be confused / going in circles", literal: "To walk at the waterwheel" },
  { pt: "Meter o Rossio na Betesga", en: "To try the impossible", literal: "To fit Rossio square into a narrow alley" },
];

const SENTENCE_STRUCTURE = [
  { pattern: "Sujeito + Verbo + Objeto", example: "Eu como pão.", translation: "I eat bread." },
  { pattern: "Sujeito + Verbo + Adjetivo", example: "A casa é bonita.", translation: "The house is beautiful." },
  { pattern: "Sujeito + Verbo + Preposição + Objeto", example: "Eu vou ao mercado.", translation: "I go to the market." },
  { pattern: "Advérbio + Sujeito + Verbo", example: "Hoje eu trabalho.", translation: "Today I work." },
  { pattern: "Sujeito + Não + Verbo", example: "Eu não sei.", translation: "I don't know." },
  { pattern: "Verbo + Sujeito + ? (question)", example: "Falas português?", translation: "Do you speak Portuguese?" },
  { pattern: "Pronome Reflexivo + Verbo", example: "Eu levanto-me cedo.", translation: "I get up early." },
  { pattern: "Estar + a + Infinitivo (EP continuous)", example: "Estou a estudar.", translation: "I am studying." },
];

const FALSE_FRIENDS = [
  { pt: "puxar", seems: "to push", actually: "to pull" },
  { pt: "constipado", seems: "constipated", actually: "having a cold" },
  { pt: "exquisito", seems: "exquisite", actually: "weird/strange" },
  { pt: "pretender", seems: "to pretend", actually: "to intend" },
  { pt: "assistir", seems: "to assist", actually: "to watch/attend" },
  { pt: "engraçado", seems: "embarrassed", actually: "funny" },
  { pt: "prato", seems: "plate (only)", actually: "dish/course (food)" },
  { pt: "sensível", seems: "sensible", actually: "sensitive" },
  { pt: "parentes", seems: "parents", actually: "relatives" },
  { pt: "propina", seems: "bribe", actually: "tuition fee" },
  { pt: "compromisso", seems: "compromise", actually: "appointment/commitment" },
  { pt: "pasta", seems: "pasta (food)", actually: "folder/briefcase" },
  { pt: "notícia", seems: "notice", actually: "news item" },
  { pt: "atualmente", seems: "actually", actually: "currently" },
  { pt: "fábrica", seems: "fabric", actually: "factory" },
];

// ─── SECTIONS CONFIG ───────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "verbs25", label: "25 Verbos", icon: "⚡" },
  { id: "conjugation", label: "Conjugação", icon: "📐" },
  { id: "pronouns", label: "Pronomes", icon: "👤" },
  { id: "adjectives", label: "Adjetivos", icon: "🎨" },
  { id: "prepositions", label: "Preposições", icon: "📍" },
  { id: "articles", label: "Artigos", icon: "📝" },
  { id: "vocabulary", label: "Vocabulário", icon: "📚" },
  { id: "modals", label: "Modais", icon: "🔧" },
  { id: "idioms", label: "Expressões", icon: "🇵🇹" },
  { id: "falsefriends", label: "Falsos Amigos", icon: "⚠️" },
  { id: "structure", label: "Frases", icon: "🧱" },
];

// ─── STYLES ────────────────────────────────────────────────────────────────────

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
`;

const styles = {
  app: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh",
    background: "#0a0f0d",
    color: "#e8e6e1",
    position: "relative",
    overflow: "hidden",
  },
  header: {
    padding: "32px 24px 16px",
    textAlign: "center",
    position: "relative",
    zIndex: 2,
  },
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "clamp(28px, 5vw, 42px)",
    fontWeight: 400,
    color: "#00c875",
    margin: 0,
    letterSpacing: "-0.5px",
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: "13px",
    color: "#7a8a80",
    marginTop: "8px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  nav: {
    display: "flex",
    gap: "6px",
    padding: "12px 16px",
    overflowX: "auto",
    scrollbarWidth: "none",
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "rgba(10,15,13,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,200,117,0.1)",
  },
  navBtn: (active) => ({
    padding: "8px 14px",
    borderRadius: "8px",
    border: active ? "1px solid #00c875" : "1px solid rgba(255,255,255,0.08)",
    background: active ? "rgba(0,200,117,0.12)" : "rgba(255,255,255,0.03)",
    color: active ? "#00c875" : "#7a8a80",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  }),
  content: {
    padding: "20px 16px 80px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "clamp(22px, 4vw, 32px)",
    color: "#00c875",
    marginBottom: "6px",
  },
  sectionDesc: {
    fontSize: "14px",
    color: "#7a8a80",
    marginBottom: "24px",
    lineHeight: 1.5,
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "12px",
    transition: "all 0.2s",
  },
  cardHover: {
    background: "rgba(255,255,255,0.05)",
    borderColor: "rgba(0,200,117,0.2)",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "10px",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "8px",
  },
  verbHeader: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "20px",
    color: "#fff",
  },
  verbMeaning: {
    fontSize: "13px",
    color: "#00c875",
    fontWeight: 500,
  },
  conjGrid: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "4px 16px",
    marginTop: "12px",
  },
  pronoun: {
    fontSize: "12px",
    color: "#7a8a80",
    fontFamily: "'JetBrains Mono', monospace",
    textAlign: "right",
    padding: "2px 0",
  },
  conjForm: {
    fontSize: "14px",
    color: "#e8e6e1",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 500,
    padding: "2px 0",
  },
  tag: (color = "#00c875") => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 600,
    background: `${color}18`,
    color: color,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  }),
  input: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#e8e6e1",
    fontSize: "14px",
    fontFamily: "'JetBrains Mono', monospace",
    outline: "none",
    width: "80px",
    textAlign: "center",
    transition: "border-color 0.2s",
  },
  inputCorrect: {
    borderColor: "#00c875",
    background: "rgba(0,200,117,0.08)",
  },
  inputWrong: {
    borderColor: "#ff4757",
    background: "rgba(255,71,87,0.08)",
  },
  btn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "1px solid #00c875",
    background: "rgba(0,200,117,0.1)",
    color: "#00c875",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
  },
  toggleRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 4px",
  },
  th: {
    textAlign: "left",
    padding: "8px 12px",
    fontSize: "11px",
    color: "#7a8a80",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  td: {
    padding: "10px 12px",
    fontSize: "14px",
    background: "rgba(255,255,255,0.02)",
  },
  flashcard: {
    background: "rgba(0,200,117,0.04)",
    border: "1px solid rgba(0,200,117,0.15)",
    borderRadius: "16px",
    padding: "40px 24px",
    textAlign: "center",
    cursor: "pointer",
    minHeight: "160px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s",
    userSelect: "none",
  },
  progressBar: {
    height: "3px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "2px",
    overflow: "hidden",
    marginBottom: "20px",
  },
  progressFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: "linear-gradient(90deg, #00c875, #00a86b)",
    borderRadius: "2px",
    transition: "width 0.4s ease",
  }),
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "2px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 600,
    background: "rgba(0,200,117,0.1)",
    color: "#00c875",
  },
};

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

function VerbCard({ verb, meaning, conj }) {
  const [show, setShow] = useState(false);
  return (
    <div style={styles.card} onClick={() => setShow(!show)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={styles.verbHeader}>{verb}</span>
        <span style={styles.verbMeaning}>{meaning}</span>
      </div>
      {show && (
        <div style={styles.conjGrid}>
          {PRONOUNS.map((p, i) => (
            <React.Fragment key={p}>
              <span style={styles.pronoun}>{p}</span>
              <span style={styles.conjForm}>{conj[i]}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      <div style={{ fontSize: "11px", color: "#555", marginTop: "8px", textAlign: "center" }}>
        {show ? "tap to hide" : "tap to reveal"}
      </div>
    </div>
  );
}

function FlashcardDrill({ items, frontKey, backKey, title }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const shuffled = useState(() => [...items].sort(() => Math.random() - 0.5))[0];
  const current = shuffled[idx % shuffled.length];

  const next = (correct) => {
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setFlipped(false);
    setIdx(i => i + 1);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={styles.badge}>{Math.min(idx + 1, shuffled.length)} / {shuffled.length}</span>
        {score.total > 0 && (
          <span style={{ fontSize: "13px", color: "#7a8a80" }}>
            {score.correct}/{score.total} correct
          </span>
        )}
      </div>
      <div style={styles.progressBar}>
        <div style={styles.progressFill(((idx % shuffled.length) / shuffled.length) * 100)} />
      </div>
      <div style={styles.flashcard} onClick={() => setFlipped(!flipped)}>
        {!flipped ? (
          <>
            <div style={{ fontSize: "11px", color: "#7a8a80", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
              {title || "Português"}
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", color: "#fff" }}>
              {typeof frontKey === "function" ? frontKey(current) : current[frontKey]}
            </div>
            <div style={{ fontSize: "12px", color: "#555", marginTop: "16px" }}>tap to flip</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: "11px", color: "#7a8a80", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
              English
            </div>
            <div style={{ fontSize: "22px", color: "#00c875", fontWeight: 500 }}>
              {typeof backKey === "function" ? backKey(current) : current[backKey]}
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button style={{ ...styles.btn, borderColor: "#ff4757", color: "#ff4757", background: "rgba(255,71,87,0.1)" }} onClick={(e) => { e.stopPropagation(); next(false); }}>
                Again
              </button>
              <button style={styles.btn} onClick={(e) => { e.stopPropagation(); next(true); }}>
                Got it
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FillGapExercise({ exercises }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [showHints, setShowHints] = useState(false);

  const check = (i) => {
    const userAns = (answers[i] || "").trim().toLowerCase();
    const correct = exercises[i].answer.toLowerCase();
    setChecked(c => ({ ...c, [i]: userAns === correct }));
  };

  const checkAll = () => {
    const newChecked = {};
    exercises.forEach((ex, i) => {
      const userAns = (answers[i] || "").trim().toLowerCase();
      newChecked[i] = userAns === ex.answer.toLowerCase();
    });
    setChecked(newChecked);
  };

  const score = Object.values(checked).filter(Boolean).length;
  const attempted = Object.keys(checked).length;

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <button style={styles.btn} onClick={() => setShowHints(!showHints)}>
          {showHints ? "Hide Hints" : "Show Hints"}
        </button>
        <button style={styles.btn} onClick={checkAll}>Check All</button>
        {attempted > 0 && (
          <span style={styles.badge}>{score}/{attempted} correct</span>
        )}
      </div>
      {exercises.map((ex, i) => {
        const parts = ex.sentence.split("___");
        const isChecked = checked[i] !== undefined;
        const isCorrect = checked[i];
        return (
          <div key={i} style={{ ...styles.card, display: "flex", flexDirection: "column", gap: "8px", padding: "14px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", fontSize: "15px" }}>
              <span style={{ color: "#7a8a80", fontSize: "12px", fontWeight: 700, marginRight: "8px" }}>{i + 1}.</span>
              <span>{parts[0]}</span>
              <input
                style={{
                  ...styles.input,
                  ...(isChecked ? (isCorrect ? styles.inputCorrect : styles.inputWrong) : {}),
                }}
                value={answers[i] || ""}
                onChange={(e) => {
                  setAnswers(a => ({ ...a, [i]: e.target.value }));
                  setChecked(c => { const n = { ...c }; delete n[i]; return n; });
                }}
                onKeyDown={(e) => e.key === "Enter" && check(i)}
                placeholder="..."
              />
              <span>{parts[1]}</span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              {showHints && <span style={{ fontSize: "12px", color: "#7a8a80", fontStyle: "italic" }}>{ex.hint}</span>}
              {isChecked && !isCorrect && (
                <span style={{ fontSize: "12px", color: "#ff4757" }}>→ {ex.answer}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SECTION VIEWS ─────────────────────────────────────────────────────────────

function Verbs25Section() {
  const [mode, setMode] = useState("grid");
  return (
    <div>
      <h2 style={styles.sectionTitle}>25 Verbos Mais Usados</h2>
      <p style={styles.sectionDesc}>The essential verbs you need for A2. Master these in present tense first, then expand to past and future.</p>
      <div style={styles.toggleRow}>
        <button style={styles.navBtn(mode === "grid")} onClick={() => setMode("grid")}>Reference</button>
        <button style={styles.navBtn(mode === "flash")} onClick={() => setMode("flash")}>Flashcards</button>
      </div>
      {mode === "grid" ? (
        <div style={styles.grid2}>
          {TOP_25_VERBS.map(v => <VerbCard key={v.verb} {...v} />)}
        </div>
      ) : (
        <FlashcardDrill
          items={TOP_25_VERBS}
          frontKey="verb"
          backKey="meaning"
          title="Verbo"
        />
      )}
    </div>
  );
}

function ConjugationSection() {
  const [tense, setTense] = useState("Presente");
  const data = CONJUGATION_PATTERNS[tense];
  return (
    <div>
      <h2 style={styles.sectionTitle}>Conjugação Regular</h2>
      <p style={styles.sectionDesc}>Regular verb endings for -AR, -ER, and -IR verbs. Learn the patterns and you can conjugate hundreds of verbs.</p>
      <div style={styles.toggleRow}>
        {Object.keys(CONJUGATION_PATTERNS).map(t => (
          <button key={t} style={styles.navBtn(tense === t)} onClick={() => setTense(t)}>{t}</button>
        ))}
      </div>
      <div style={styles.grid3}>
        {["ar", "er", "ir"].map(type => (
          <div key={type} style={{ ...styles.card, borderLeft: `3px solid ${type === "ar" ? "#00c875" : type === "er" ? "#4ecdc4" : "#ffe66d"}` }}>
            <div style={{ ...styles.tag(type === "ar" ? "#00c875" : type === "er" ? "#4ecdc4" : "#ffe66d"), marginBottom: "12px" }}>
              -{type.toUpperCase()} verbs
            </div>
            <div style={styles.conjGrid}>
              {PRONOUNS.map((p, i) => (
                <React.Fragment key={p}>
                  <span style={styles.pronoun}>{p}</span>
                  <span style={{ ...styles.conjForm, color: type === "ar" ? "#00c875" : type === "er" ? "#4ecdc4" : "#ffe66d" }}>
                    stem {data[type][i]}
                  </span>
                </React.Fragment>
              ))}
            </div>
            <div style={{ fontSize: "12px", color: "#7a8a80", marginTop: "12px", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>
              {data[`example_${type}`]}
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...styles.card, marginTop: "16px", background: "rgba(0,200,117,0.04)" }}>
        <div style={{ fontSize: "13px", color: "#7a8a80", lineHeight: 1.6 }}>
          <strong style={{ color: "#00c875" }}>EP Note:</strong> In European Portuguese, the present continuous uses <strong>estar + a + infinitive</strong>: "Estou a falar" (I am speaking), not "Estou falando" (Brazilian form).
        </div>
      </div>
    </div>
  );
}

function PronounsSection() {
  const [category, setCategory] = useState(Object.keys(PRONOUNS_DATA)[0]);
  return (
    <div>
      <h2 style={styles.sectionTitle}>Pronomes Portugueses</h2>
      <p style={styles.sectionDesc}>European Portuguese pronoun system. Note: "tu" is widely used in EP, unlike Brazilian Portuguese where "você" dominates.</p>
      <div style={styles.toggleRow}>
        {Object.keys(PRONOUNS_DATA).map(c => (
          <button key={c} style={styles.navBtn(category === c)} onClick={() => setCategory(c)}>
            {c.split(" (")[0]}
          </button>
        ))}
      </div>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Português</th>
              <th style={styles.th}>English</th>
            </tr>
          </thead>
          <tbody>
            {PRONOUNS_DATA[category].map(([pt, en], i) => (
              <tr key={i}>
                <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "#00c875", borderRadius: i === 0 ? "8px 0 0 0" : i === PRONOUNS_DATA[category].length - 1 ? "0 0 0 8px" : 0 }}>{pt}</td>
                <td style={{ ...styles.td, color: "#c0b8a8", borderRadius: i === 0 ? "0 8px 0 0" : i === PRONOUNS_DATA[category].length - 1 ? "0 0 8px 0" : 0 }}>{en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ ...styles.card, marginTop: "8px", background: "rgba(0,200,117,0.04)" }}>
        <div style={{ fontSize: "13px", color: "#7a8a80", lineHeight: 1.6 }}>
          <strong style={{ color: "#00c875" }}>EP Tip:</strong> In EP, object pronouns typically come <em>after</em> the verb with a hyphen: "Ele deu-<strong>me</strong> o livro" (He gave me the book). They move before the verb after negation, question words, and certain conjunctions: "<strong>Não me</strong> deu o livro."
        </div>
      </div>
    </div>
  );
}

function AdjectivesSection() {
  const [mode, setMode] = useState("grid");
  return (
    <div>
      <h2 style={styles.sectionTitle}>40 Adjetivos Essenciais</h2>
      <p style={styles.sectionDesc}>Core adjectives for A2. Remember: most adjectives agree in gender and number with the noun they describe.</p>
      <div style={styles.toggleRow}>
        <button style={styles.navBtn(mode === "grid")} onClick={() => setMode("grid")}>Reference</button>
        <button style={styles.navBtn(mode === "flash")} onClick={() => setMode("flash")}>Flashcards</button>
      </div>
      {mode === "grid" ? (
        <div style={styles.grid2}>
          {ADJECTIVES.map(([pt, en], i) => (
            <div key={i} style={{ ...styles.card, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "#00c875" }}>{pt}</span>
              <span style={{ fontSize: "13px", color: "#7a8a80" }}>{en}</span>
            </div>
          ))}
        </div>
      ) : (
        <FlashcardDrill
          items={ADJECTIVES.map(([pt, en]) => ({ pt, en }))}
          frontKey="pt"
          backKey="en"
          title="Adjetivo"
        />
      )}
    </div>
  );
}

function PrepositionsSection() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Preposições — Preenche os espaços</h2>
      <p style={styles.sectionDesc}>Practice with: em, de, para, com, sem, entre, sobre, a, por, até — and their contracted forms (no, na, ao, à, do, da...)</p>
      <FillGapExercise exercises={PREPOSITION_EXERCISES} />
    </div>
  );
}

function ArticlesSection() {
  const [view, setView] = useState("ref");
  return (
    <div>
      <h2 style={styles.sectionTitle}>Artigos e Contrações</h2>
      <p style={styles.sectionDesc}>Definite and indefinite articles, plus the essential contractions with prepositions that trip up every learner.</p>
      <div style={styles.toggleRow}>
        <button style={styles.navBtn(view === "ref")} onClick={() => setView("ref")}>Reference</button>
        <button style={styles.navBtn(view === "practice")} onClick={() => setView("practice")}>Practice</button>
      </div>
      {view === "ref" ? (
        <>
          {["definite", "indefinite"].map(type => (
            <div key={type} style={{ ...styles.card, marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px", color: "#fff", marginBottom: "12px" }}>
                {ARTICLES_DATA[type].title}
              </h3>
              <div style={styles.grid2}>
                {ARTICLES_DATA[type].forms.map((f, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: "12px", color: "#7a8a80" }}>{f.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      <strong style={{ color: "#00c875", fontSize: "16px" }}>{f.article}</strong>
                      <span style={{ fontSize: "12px", color: "#555", marginLeft: "8px" }}>{f.example}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={styles.card}>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px", color: "#fff", marginBottom: "12px" }}>
              Contrações (Contractions)
            </h3>
            {ARTICLES_DATA.definite.contractions.map((row, i) => (
              <div key={i} style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                {row.map((c, j) => (
                  <span key={j} style={{ ...styles.tag("#4ecdc4"), fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>{c}</span>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <FillGapExercise exercises={ARTICLES_EXERCISES} />
      )}
    </div>
  );
}

function VocabularySection() {
  const [topic, setTopic] = useState(Object.keys(VOCABULARY)[0]);
  const [mode, setMode] = useState("grid");
  return (
    <div>
      <h2 style={styles.sectionTitle}>Vocabulário por Tema</h2>
      <p style={styles.sectionDesc}>A2 vocabulary organized by CIPLE exam topics. Learn with the articles — they're essential in Portuguese!</p>
      <div style={styles.toggleRow}>
        {Object.keys(VOCABULARY).map(t => (
          <button key={t} style={styles.navBtn(topic === t)} onClick={() => { setTopic(t); setMode("grid"); }}>{t}</button>
        ))}
      </div>
      <div style={{ marginBottom: "12px" }}>
        <button style={styles.navBtn(mode === "grid")} onClick={() => setMode("grid")}>Reference</button>
        <button style={{ ...styles.navBtn(mode === "flash"), marginLeft: "6px" }} onClick={() => setMode("flash")}>Flashcards</button>
      </div>
      {mode === "grid" ? (
        <div style={styles.grid2}>
          {VOCABULARY[topic].map(([pt, en], i) => (
            <div key={i} style={{ ...styles.card, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, color: "#00c875", fontSize: "14px" }}>{pt}</span>
              <span style={{ fontSize: "13px", color: "#7a8a80" }}>{en}</span>
            </div>
          ))}
        </div>
      ) : (
        <FlashcardDrill
          items={VOCABULARY[topic].map(([pt, en]) => ({ pt, en }))}
          frontKey="pt"
          backKey="en"
          title={topic}
        />
      )}
    </div>
  );
}

function ModalsSection() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Verbos Modais</h2>
      <p style={styles.sectionDesc}>Modal verbs express ability, obligation, desire, and necessity. These are critical for A2 communication.</p>
      {MODAL_VERBS.map((m, i) => (
        <div key={i} style={{ ...styles.card, borderLeft: "3px solid #00c875" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
            <span style={styles.verbHeader}>{m.verb}</span>
            <span style={styles.verbMeaning}>{m.meaning}</span>
          </div>
          <div style={{ fontSize: "13px", color: "#c0b8a8", margin: "10px 0", lineHeight: 1.5 }}>{m.usage}</div>
          <div style={styles.conjGrid}>
            {PRONOUNS.map((p, j) => (
              <React.Fragment key={p}>
                <span style={styles.pronoun}>{p}</span>
                <span style={styles.conjForm}>{m.presente[j]}</span>
              </React.Fragment>
            ))}
          </div>
          <div style={{ marginTop: "12px" }}>
            {m.examples.map((ex, j) => (
              <div key={j} style={{ fontSize: "13px", color: "#7a8a80", fontStyle: "italic", padding: "2px 0", fontFamily: "'JetBrains Mono', monospace" }}>
                {ex}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function IdiomsSection() {
  const [mode, setMode] = useState("list");
  return (
    <div>
      <h2 style={styles.sectionTitle}>Expressões Idiomáticas</h2>
      <p style={styles.sectionDesc}>Common Portuguese expressions. Knowing these will impress in conversation and help you sound more natural.</p>
      <div style={styles.toggleRow}>
        <button style={styles.navBtn(mode === "list")} onClick={() => setMode("list")}>Reference</button>
        <button style={styles.navBtn(mode === "flash")} onClick={() => setMode("flash")}>Flashcards</button>
      </div>
      {mode === "list" ? (
        IDIOMS.map((idiom, i) => (
          <div key={i} style={{ ...styles.card, padding: "14px 18px" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "17px", color: "#fff" }}>"{idiom.pt}"</div>
            <div style={{ fontSize: "14px", color: "#00c875", fontWeight: 500, marginTop: "4px" }}>{idiom.en}</div>
            <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>Literal: {idiom.literal}</div>
          </div>
        ))
      ) : (
        <FlashcardDrill
          items={IDIOMS}
          frontKey="pt"
          backKey={(item) => `${item.en}\n(Literal: ${item.literal})`}
          title="Expressão"
        />
      )}
    </div>
  );
}

function FalseFriendsSection() {
  const [mode, setMode] = useState("list");
  return (
    <div>
      <h2 style={styles.sectionTitle}>Falsos Amigos</h2>
      <p style={styles.sectionDesc}>Words that look like English words but mean something different. Essential to avoid embarrassing mistakes!</p>
      <div style={styles.toggleRow}>
        <button style={styles.navBtn(mode === "list")} onClick={() => setMode("list")}>Reference</button>
        <button style={styles.navBtn(mode === "flash")} onClick={() => setMode("flash")}>Flashcards</button>
      </div>
      {mode === "list" ? (
        <div style={styles.grid2}>
          {FALSE_FRIENDS.map((ff, i) => (
            <div key={i} style={styles.card}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "16px", fontWeight: 600, color: "#fff" }}>{ff.pt}</div>
              <div style={{ fontSize: "12px", color: "#ff4757", marginTop: "6px" }}>
                <span style={{ textDecoration: "line-through" }}>✗ {ff.seems}</span>
              </div>
              <div style={{ fontSize: "14px", color: "#00c875", fontWeight: 500, marginTop: "4px" }}>
                ✓ {ff.actually}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <FlashcardDrill
          items={FALSE_FRIENDS}
          frontKey="pt"
          backKey={(item) => `NOT "${item.seems}" → ${item.actually}`}
          title="Falso Amigo"
        />
      )}
    </div>
  );
}

function StructureSection() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>Estrutura das Frases</h2>
      <p style={styles.sectionDesc}>Core sentence patterns for A2. European Portuguese follows SVO order but is flexible with emphasis shifts.</p>
      {SENTENCE_STRUCTURE.map((s, i) => (
        <div key={i} style={styles.card}>
          <div style={{ ...styles.tag("#4ecdc4"), marginBottom: "10px" }}>{s.pattern}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "16px", color: "#fff", marginBottom: "4px" }}>{s.example}</div>
          <div style={{ fontSize: "13px", color: "#7a8a80" }}>{s.translation}</div>
        </div>
      ))}
      <div style={{ ...styles.card, marginTop: "16px", background: "rgba(0,200,117,0.04)" }}>
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px", color: "#fff", marginBottom: "10px" }}>EP-Specific Patterns</h3>
        <div style={{ fontSize: "13px", color: "#c0b8a8", lineHeight: 1.8 }}>
          <div><strong style={{ color: "#00c875" }}>Continuous:</strong> estar + a + infinitive → "Estou a comer" (not "Estou comendo")</div>
          <div><strong style={{ color: "#00c875" }}>Clitic placement:</strong> After verb: "Ele deu-me" / Before with negation: "Ele não me deu"</div>
          <div><strong style={{ color: "#00c875" }}>Mesoclisis (future):</strong> "Dir-lhe-ei amanhã" (I will tell him tomorrow) — unique to EP</div>
          <div><strong style={{ color: "#00c875" }}>Personal infinitive:</strong> "É importante estudarmos" (It's important for us to study)</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────

const SECTION_MAP = {
  verbs25: Verbs25Section,
  conjugation: ConjugationSection,
  pronouns: PronounsSection,
  adjectives: AdjectivesSection,
  prepositions: PrepositionsSection,
  articles: ArticlesSection,
  vocabulary: VocabularySection,
  modals: ModalsSection,
  idioms: IdiomsSection,
  falsefriends: FalseFriendsSection,
  structure: StructureSection,
};

export default function App() {
  const [section, setSection] = useState("verbs25");
  const SectionComponent = SECTION_MAP[section];

  return (
    <div style={styles.app}>
      <style>{fonts}</style>
      <div style={{
        position: "fixed", top: "-50%", left: "-20%", width: "80%", height: "100%",
        background: "radial-gradient(ellipse, rgba(0,200,117,0.03) 0%, transparent 60%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-40%", right: "-20%", width: "70%", height: "100%",
        background: "radial-gradient(ellipse, rgba(78,205,196,0.02) 0%, transparent 60%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <header style={styles.header}>
        <h1 style={styles.title}>Português Europeu A2</h1>
        <p style={styles.subtitle}>Guia Interativo de Estudo · CIPLE Prep</p>
      </header>
      <nav style={styles.nav}>
        {SECTIONS.map(s => (
          <button key={s.id} style={styles.navBtn(section === s.id)} onClick={() => setSection(s.id)}>
            <span style={{ marginRight: "4px" }}>{s.icon}</span> {s.label}
          </button>
        ))}
      </nav>
      <main style={styles.content}>
        <SectionComponent />
      </main>
    </div>
  );
}
