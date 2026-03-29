import { useState, useCallback } from 'react';

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

const CONJUGATION_PATTERNS = {
  "Presente": { ar: ["-o","-as","-a","-amos","-ais","-am"], er: ["-o","-es","-e","-emos","-eis","-em"], ir: ["-o","-es","-e","-imos","-is","-em"], example_ar: "falar → falo, falas, fala, falamos, falais, falam", example_er: "comer → como, comes, come, comemos, comeis, comem", example_ir: "partir → parto, partes, parte, partimos, partis, partem" },
  "Pretérito Perfeito": { ar: ["-ei","-aste","-ou","-ámos","-astes","-aram"], er: ["-i","-este","-eu","-emos","-estes","-eram"], ir: ["-i","-iste","-iu","-imos","-istes","-iram"], example_ar: "falar → falei, falaste, falou, falámos, falastes, falaram", example_er: "comer → comi, comeste, comeu, comemos, comestes, comeram", example_ir: "partir → parti, partiste, partiu, partimos, partistes, partiram" },
  "Pretérito Imperfeito": { ar: ["-ava","-avas","-ava","-ávamos","-áveis","-avam"], er: ["-ia","-ias","-ia","-íamos","-íeis","-iam"], ir: ["-ia","-ias","-ia","-íamos","-íeis","-iam"], example_ar: "falar → falava, falavas, falava, falávamos, faláveis, falavam", example_er: "comer → comia, comias, comia, comíamos, comíeis, comiam", example_ir: "partir → partia, partias, partia, partíamos, partíeis, partiam" },
  "Futuro": { ar: ["-arei","-arás","-ará","-aremos","-areis","-arão"], er: ["-erei","-erás","-erá","-eremos","-ereis","-erão"], ir: ["-irei","-irás","-irá","-iremos","-ireis","-irão"], example_ar: "falar → falarei, falarás, falará, falaremos, falareis, falarão", example_er: "comer → comerei, comerás, comerá, comeremos, comereis, comerão", example_ir: "partir → partirei, partirás, partirá, partiremos, partireis, partirão" },
  "Condicional": { ar: ["-aria","-arias","-aria","-aríamos","-aríeis","-ariam"], er: ["-eria","-erias","-eria","-eríamos","-eríeis","-eriam"], ir: ["-iria","-irias","-iria","-iríamos","-iríeis","-iriam"], example_ar: "falar → falaria, falarias, falaria, falaríamos, falaríeis, falariam", example_er: "comer → comeria, comerias, comeria, comeríamos, comeríeis, comeriam", example_ir: "partir → partiria, partirias, partiria, partiríamos, partiríeis, partiriam" },
};

const ADJECTIVES = [
  ["grande","big"],["pequeno","small"],["bom","good"],["mau","bad"],["feliz","happy"],["triste","sad"],["velho","old"],["novo","new"],["bonito","beautiful"],["feio","ugly"],["forte","strong"],["fraco","weak"],["alto","tall"],["baixo","short"],["largo","wide"],["estreito","narrow"],["limpo","clean"],["sujo","dirty"],["doce","sweet"],["amargo","bitter"],["claro","clear/light"],["escuro","dark"],["devagar","slow"],["rápido","fast"],["cheio","full"],["vazio","empty"],["rico","rich"],["pobre","poor"],["quente","hot"],["frio","cold"],["caro","expensive"],["barato","cheap"],["pesado","heavy"],["leve","light"],["seguro","safe"],["perigoso","dangerous"],["fácil","easy"],["difícil","difficult"],["aberto","open"],["fechado","closed"],
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
  { sentence: "Ele foi ___ Portugal no verão.", answer: "a", hint: "to (a country)" },
  { sentence: "O comboio passa ___ aqui.", answer: "por", hint: "passes through" },
  { sentence: "Não consigo viver ___ música.", answer: "sem", hint: "without something" },
];

const PRONOUNS_DATA = {
  "Sujeito": [["eu","I"],["tu","you (informal)"],["ele/ela","he/she"],["você","you (formal)"],["nós","we"],["vós","you (pl.)"],["eles/elas","they"]],
  "Obj. Direto": [["me","me"],["te","you"],["o/a","him/her"],["nos","us"],["vos","you (pl.)"],["os/as","them"]],
  "Obj. Indireto": [["me","to me"],["te","to you"],["lhe","to him/her"],["nos","to us"],["vos","to you (pl.)"],["lhes","to them"]],
  "Reflexivo": [["me","myself"],["te","yourself"],["se","himself/herself"],["nos","ourselves"],["vos","yourselves"],["se","themselves"]],
  "Possessivo": [["meu/minha","my"],["teu/tua","your"],["seu/sua","his/her"],["nosso/nossa","our"],["vosso/vossa","your (pl.)"],["seu/sua","their"]],
};

const VOCABULARY = {
  "Família": [["a mãe","mother"],["o pai","father"],["o filho","son"],["a filha","daughter"],["o irmão","brother"],["a irmã","sister"],["o avô","grandfather"],["a avó","grandmother"],["o tio","uncle"],["a tia","aunt"],["o primo","cousin (m)"],["a prima","cousin (f)"],["o marido","husband"],["a mulher","wife"],["o sobrinho","nephew"],["a sobrinha","niece"]],
  "Comida e Bebida": [["o pão","bread"],["o queijo","cheese"],["a carne","meat"],["o peixe","fish"],["o arroz","rice"],["a sopa","soup"],["a salada","salad"],["a fruta","fruit"],["o café","coffee"],["o chá","tea"],["a água","water"],["o sumo","juice"],["o vinho","wine"],["a cerveja","beer"],["o leite","milk"],["o azeite","olive oil"]],
  "Casa": [["a cozinha","kitchen"],["a sala","living room"],["o quarto","bedroom"],["a casa de banho","bathroom"],["o jardim","garden"],["a janela","window"],["a porta","door"],["a mesa","table"],["a cadeira","chair"],["o sofá","sofa"],["a cama","bed"],["o espelho","mirror"],["a escada","stairs"],["o telhado","roof"],["a parede","wall"],["o chão","floor"]],
  "Corpo": [["a cabeça","head"],["o olho","eye"],["o nariz","nose"],["a boca","mouth"],["a orelha","ear"],["o braço","arm"],["a mão","hand"],["o dedo","finger"],["a perna","leg"],["o pé","foot"],["o peito","chest"],["as costas","back"],["o ombro","shoulder"],["o joelho","knee"],["o pescoço","neck"],["o cabelo","hair"]],
  "Cidade": [["a rua","street"],["a praça","square"],["o supermercado","supermarket"],["a farmácia","pharmacy"],["o hospital","hospital"],["a estação","station"],["o restaurante","restaurant"],["o café","café"],["a loja","shop"],["o banco","bank"],["os correios","post office"],["a igreja","church"],["o parque","park"],["a biblioteca","library"],["o museu","museum"],["a escola","school"]],
  "Tempo e Clima": [["hoje","today"],["amanhã","tomorrow"],["ontem","yesterday"],["agora","now"],["sempre","always"],["nunca","never"],["às vezes","sometimes"],["cedo","early"],["tarde","late"],["o sol","sun"],["a chuva","rain"],["o vento","wind"],["quente","hot"],["frio","cold"],["nublado","cloudy"],["o tempo","weather/time"],["ainda","still/yet"],["já","already/yet"],["depressa","quickly"],["devagar","slowly"],["antes","before"],["depois","after"],["quase","almost"],["muito","very"]],
  "Transportes": [["o carro","car"],["o autobus","bus"],["o comboio","train"],["o avião","plane"],["o metro","metro"],["o elétrico","tram"],["a bicicleta","bicycle"],["o táxi","taxi"],["a paragem","stop"],["a estação","station"],["o aeroporto","airport"],["o bilhete","ticket"],["a viagem","trip"],["o condutor","driver"],["o passageiro","passenger"],["a mala","suitcase"]],
  "Trabalho": [["o escritório","office"],["o computador","computer"],["a reunião","meeting"],["o colega","colleague"],["o chefe","boss"],["o emprego","job"],["o salário","salary"],["as férias","holidays"],["o horário","schedule"],["a empresa","company"],["o cliente","client"],["o projeto","project"],["o contrato","contract"],["a entrevista","interview"],["o currículo","CV"],["a experiência","experience"]],
  "Vestuário": [["as calças","trousers"],["a saia","skirt"],["a camisa","shirt"],["o vestido","dress"],["o sapato","shoe"],["o casaco","jacket"],["a blusa","blouse"],["as meias","socks"],["a gravata","tie"],["o cachecol","scarf"],["as luvas","gloves"],["o chapéu","hat"],["o guarda-chuva","umbrella"],["a carteira","wallet"],["a mala","bag"],["os óculos","glasses"]],
  "Animais": [["o cão","dog"],["o gato","cat"],["o cavalo","horse"],["o pássaro","bird"],["o peixe","fish"],["o frango","chicken"],["o porco","pig"],["a vaca","cow"],["a ovelha","sheep"],["o coelho","rabbit"],["a tartaruga","turtle"],["a borboleta","butterfly"],["a abelha","bee"],["a formiga","ant"],["o mosquito","mosquito"],["o ratinho","mouse"]],
  "Cores": [["azul","blue"],["verde","green"],["amarelo","yellow"],["branco","white"],["preto","black"],["vermelho","red"],["castanho","brown"],["cor-de-rosa","pink"],["cor-de-laranja","orange"],["cinzento","grey"],["dourado","golden"],["prateado","silver"],["roxo","purple"],["bege","beige"],["lilás","lilac"]],
  "Números": [["um/uma","one"],["dois/duas","two"],["três","three"],["quatro","four"],["cinco","five"],["seis","six"],["sete","seven"],["oito","eight"],["nove","nine"],["dez","ten"],["onze","eleven"],["doze","twelve"],["treze","thirteen"],["catorze","fourteen"],["quinze","fifteen"],["dezasseis","sixteen"],["dezassete","seventeen"],["dezoito","eighteen"],["dezanove","nineteen"],["vinte","twenty"],["trinta","thirty"],["quarenta","forty"],["cinquenta","fifty"],["cem","hundred"],["mil","thousand"],["um milhão","million"]],
  "Dias e Meses": [["segunda-feira","Monday"],["terça-feira","Tuesday"],["quarta-feira","Wednesday"],["quinta-feira","Thursday"],["sexta-feira","Friday"],["sábado","Saturday"],["domingo","Sunday"],["janeiro","January"],["fevereiro","February"],["março","March"],["abril","April"],["maio","May"],["junho","June"],["julho","July"],["agosto","August"],["setembro","September"],["outubro","October"],["novembro","November"],["dezembro","December"]],
  "Nacionalidades": [["português/portuguesa","Portuguese"],["brasileiro/brasileira","Brazilian"],["inglês/inglesa","English"],["espanhol/espanhola","Spanish"],["francês/francesa","French"],["alemão/alemã","German"],["italiano/italiana","Italian"],["chinês/chinesa","Chinese"],["japonês/japonesa","Japanese"],["americano/americana","American"],["africano/africana","African"],["mexicano/mexicana","Mexican"],["canadiano/canadiana","Canadian"]],
  "Profissões": [["médico/médica","doctor"],["professor/professora","teacher"],["engenheiro/engenheira","engineer"],["advogado/advogada","lawyer"],["arquiteto/arquiteta","architect"],["cozinheiro/cozinheira","cook/chef"],["motorista","driver"],["secretário/secretária","secretary"],["bombeiro/bombeira","firefighter"],["polícia","police officer"],["enfermeiro/enfermeira","nurse"],["jornalista","journalist"],["escritor/escritora","writer"],["artista","artist"],["músico/música","musician"]],
  "Escola": [["a escola","school"],["o professor","teacher"],["o aluno","student (m)"],["a aluna","student (f)"],["o livro","book"],["o caderno","notebook"],["a caneta","pen"],["o lápis","pencil"],["a mochila","backpack"],["a cadeira","chair"],["a mesa","desk/table"],["o quadro","blackboard"],["o exame","exam"],["a aula","class/lesson"],["a biblioteca","library"],["o intervalo","break"]],
  "Natureza": [["a árvore","tree"],["a flor","flower"],["a relva","grass"],["o mar","sea"],["a montanha","mountain"],["o rio","river"],["o lago","lake"],["a floresta","forest"],["o campo","countryside/field"],["o jardim","garden"],["a planta","plant"],["a pedra","stone"],["o céu","sky"],["a terra","earth/soil"],["o sol","sun"],["a lua","moon"],["a estrela","star"],["a nuvem","cloud"],["a neve","snow"],["a praia","beach"],["a ilha","island"]],
  "Compras": [["a loja","shop"],["o preço","price"],["euro","euro"],["a carta","letter"],["os selos","stamps"],["o troco","change (money)"],["barato","cheap"],["caro","expensive"],["o desconto","discount"],["a oferta","offer/special"],["as compras","shopping/groceries"],["o supermercado","supermarket"],["o mercado","market"],["pagar","to pay"],["vender","to sell"],["comprar","to buy"],["gastar","to spend"]],
  "Descrição": [["perto","near"],["longe","far"],["dentro","inside"],["fora","outside"],["em cima","on top"],["em baixo","below"],["ao lado","beside"],["entre","between"],["certo","right/correct"],["errado","wrong"],["importante","important"],["interessante","interesting"],["necessário","necessary"],["possível","possible"],["provável","probable"],["feliz","happy"],["triste","sad"],["contente","content"],["nervoso","nervous"],["cansado","tired"],["doente","ill/sick"]],
};

const MODAL_VERBS = [
  { verb: "poder", meaning: "can / to be able to", presente: ["posso","podes","pode","podemos","podeis","podem"], usage: "Ability or permission: Posso abrir a janela?", examples: ["Eu posso ajudar-te.","Tu não podes entrar.","Ela pode falar três línguas."] },
  { verb: "dever", meaning: "should / must / to owe", presente: ["devo","deves","deve","devemos","deveis","devem"], usage: "Obligation or advice: Deves estudar mais.", examples: ["Eu devo ir ao médico.","Tu deves ter cuidado.","Nós devemos sair agora."] },
  { verb: "querer", meaning: "to want", presente: ["quero","queres","quer","queremos","quereis","querem"], usage: "Desire or wish: Quero um café, por favor.", examples: ["Eu quero aprender português.","Tu queres ir ao cinema?","Eles querem viajar."] },
  { verb: "precisar de", meaning: "to need", presente: ["preciso","precisas","precisa","precisamos","precisais","precisam"], usage: "Necessity (always followed by 'de'): Preciso de ajuda.", examples: ["Eu preciso de dormir.","Tu precisas de um casaco.","Nós precisamos de tempo."] },
  { verb: "conseguir", meaning: "to manage to / to be able to", presente: ["consigo","consegues","consegue","conseguimos","conseguis","conseguem"], usage: "Achievement or success: Consegui terminar!", examples: ["Eu consigo ver daqui.","Tu consegues perceber?","Ela não consegue dormir."] },
  { verb: "ter de/que", meaning: "to have to", presente: ["tenho","tens","tem","temos","tendes","têm"], usage: "Strong obligation: Tenho de ir embora.", examples: ["Eu tenho de trabalhar.","Tu tens que estudar.","Nós temos de decidir."] },
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
      ["a+o = ao","a+a = à","a+os = aos","a+as = às"],
      ["de+o = do","de+a = da","de+os = dos","de+as = das"],
      ["em+o = no","em+a = na","em+os = nos","em+as = nas"],
      ["por+o = pelo","por+a = pela","por+os = pelos","por+as = pelas"],
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
  { pt: "Ter macaquinhos no sótão", en: "To be a bit crazy", literal: "To have little monkeys in the attic" },
  { pt: "Não ter papas na língua", en: "To speak bluntly", literal: "To not have porridge on the tongue" },
  { pt: "Estar-se nas tintas", en: "To not care at all", literal: "To be in the paints" },
  { pt: "Andar à nora", en: "To be confused / going in circles", literal: "To walk at the waterwheel" },
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

const PRETERITO_EXERCISES = [
  { id: 1, sentence: "Eu ___ (falar) com ele ontem ao telefone.", correct_perfeito: "falei", correct_imperfeito: "falava", required: "perfeito", hint: "Specific completed action — a one-time event", explanation: "'Falei' describes a specific completed conversation that happened and finished yesterday." },
  { id: 2, sentence: "Quando eu ___ (ser) criança, ___ (morar) em Lisboa.", correct_perfeito: "fui / moriei", correct_imperfeito: "era / morava", required: "imperfeito", hint: "Habitual or ongoing state in the past", explanation: "'Era' and 'morava' describe what your life was like over a period of time in the past." },
  { id: 3, sentence: "Ele ___ (chegar) às três horas e ___ (sair) às cinco.", correct_perfeito: "chegou / saiu", correct_imperfeito: "chegava / saía", required: "perfeito", hint: "Two specific actions at defined times", explanation: "'Chegou' and 'saiu' tell us exactly when these happened." },
  { id: 4, sentence: "Eu ___ (estudar) português todos os dias durante dois anos.", correct_perfeito: "estudei", correct_imperfeito: "estudava", required: "imperfeito", hint: "A habitual action repeated over a period", explanation: "'Estudava' describes a habit continued over time with no defined beginning or end." },
  { id: 5, sentence: "A Maria ___ (ser) muito bonita quando ___ (ter) vinte anos.", correct_perfeito: "foi / teve", correct_imperfeito: "era / tinha", required: "perfeito", hint: "A specific moment in time in the past", explanation: "When referring to a specific age, use Perfeito: 'foi' and 'teve'." },
  { id: 6, sentence: "Nós ___ (viver) no Porto antes de ___ (mudar) para Lisboa.", correct_perfeito: "vivemos / mudamos", correct_imperfeito: "vivíamos / mudávamos", required: "perfeito", hint: "Two sequential completed actions", explanation: "'Viver' and 'mudar' describe a sequence of completed events." },
  { id: 7, sentence: "Eu ___ (estar) cansado porque ___ (trabalhar) muito.", correct_perfeito: "estive / trabalhei", correct_imperfeito: "estava / trabalhava", required: "imperfeito", hint: "Describing a past state (no specific time)", explanation: "'Estava cansado' describes how you felt — a state. Use Imperfeito for past states." },
  { id: 8, sentence: "Ontem, eu ___ (comer) arroz e peixe no restaurante.", correct_perfeito: "comi", correct_imperfeito: "comia", required: "perfeito", hint: "A specific meal at a specific time (ontem)", explanation: "'Comi' tells us what you ate yesterday — a specific completed action." },
  { id: 9, sentence: "Ele sempre ___ (dizer) que ___ (querer) viajar.", correct_perfeito: "disse / quis", correct_imperfeito: "dizia / queria", required: "imperfeito", hint: "'Sempre' (always) signals a habitual past action", explanation: "'Sempre dizia' describes something he repeatedly said in the past." },
  { id: 10, sentence: "Quando eu ___ (ver) o filme, ele já ___ (ser) muito famoso.", correct_perfeito: "vi / era", correct_imperfeito: "via / era", required: "perfeito", hint: "Two events: completed action + ongoing state", explanation: "'Vi' is the completed action. 'Era' describes the state at that moment." },
  { id: 11, sentence: "___ (haver) muitos problemas naquela altura.", correct_perfeito: "houve", correct_imperfeito: "havia", required: "imperfeito", hint: "Describing what existed over a past period", explanation: "'Havia' describes what existed or happened habitually in the past." },
  { id: 12, sentence: "Eu não ___ (saber) que tu ___ (estar) aqui.", correct_perfeito: "soube / estavas", correct_imperfeito: "sabia / estavas", required: "imperfeito", hint: "Describing a state of not knowing in the past", explanation: "'Não sabia' describes the state of not knowing — an ongoing condition." },
  { id: 13, sentence: "Naquele dia, nós ___ (ir) ao cinema e depois ___ (jantar) fora.", correct_perfeito: "fomos / jantamos", correct_imperfeito: "íamos / jantávamos", required: "perfeito", hint: "A sequence of specific completed events", explanation: "'Fomos' and 'jantamos' describe the specific activities of a particular day." },
  { id: 14, sentence: "Eu ___ (estudar) muito, por isso ___ (passar) no exame.", correct_perfeito: "estudei / passei", correct_imperfeito: "estudava / passava", required: "perfeito", hint: "Cause-and-effect between two completed actions", explanation: "'Estudei' and 'passei' describe specific completed actions where one caused the other." },
];

const SER_ESTAR_SCENARIOS = [
  { id: 1, scenario: "O João é médico.", question: "Ser or Estar?", correct: "ser", explanation: "'Ser médico' describes a profession — something that defines who the person is. Professions use 'SER'.", note: "This is permanent — being a doctor is a fundamental part of his identity." },
  { id: 2, scenario: "Hoje estou muito cansado.", question: "Ser or Estar?", correct: "estar", explanation: "'Estar cansado' describes a temporary physical state. Temporary conditions use 'ESTAR'.", note: "Fatigue comes and goes — this is clearly temporary." },
  { id: 3, scenario: "A Maria é alta e loira.", question: "Ser or Estar?", correct: "ser", explanation: "Physical descriptions (height, hair color) are permanent characteristics. Use 'SER'.", note: "Even if someone dyes their hair, we describe their natural appearance with 'ser'." },
  { id: 4, scenario: "Estamos em Lisboa.", question: "Ser or Estar?", correct: "estar", explanation: "Location uses 'ESTAR'. 'Ser em Lisboa' is grammatically incorrect.", note: "Compare: 'Sou de Lisboa' (origin) vs 'Estou em Lisboa' (location)" },
  { id: 5, scenario: "É madrugada, por isso as ruas estão vazias.", question: "Ser or Estar? (both — why?)", correct: "ser / estar", explanation: "'É madrugada' uses 'ser' for TIME. 'Estão vazias' uses 'estar' for a CURRENT STATE.", note: "Rule: Time expressions → SER. States/conditions → ESTAR." },
  { id: 6, scenario: "O Pedro está nervoso porque tem um exame amanhã.", question: "Ser or Estar?", correct: "estar", explanation: "'Estar nervoso' describes an emotional state — nervousness is temporary. Use 'ESTAR'.", note: "'Sou nervoso' would mean 'I am a nervous person by nature'." },
  { id: 7, scenario: "Esta sopa está deliciosa!", question: "Ser or Estar?", correct: "estar", explanation: "'Estar deliciosa' describes how the soup TASTES RIGHT NOW — a temporary quality.", note: "'É deliciosa' would imply an inherent, permanent quality." },
  { id: 8, scenario: "A Teresa é simpática. Todos a adoram.", question: "Ser or Estar?", correct: "ser", explanation: "'Ser simpática' describes Teresa's permanent personality trait.", note: "'A Teresa está muito simpática hoje' = she's being especially kind TODAY (temporary behavior)." },
  { id: 9, scenario: "O meu telemóvel está quebrado.", question: "Ser or Estar?", correct: "estar", explanation: "'Estar quebrado' describes the current CONDITION of the phone.", note: "'É quebrado' would not make sense for the phone's current state." },
  { id: 10, scenario: "São cinco horas. Ela está a dormir.", question: "Ser or Estar? (both)", correct: "ser / estar", explanation: "'São cinco horas' uses 'ser' for TIME. 'Está a dormir' uses EP continuous form.", note: "EP uses 'estar a + infinitive' (not 'estar + gerúndio' as in BP)." },
  { id: 11, scenario: "A água está fria.", question: "Ser or Estar?", correct: "estar", explanation: "'Estar fria' describes the CURRENT temperature — a temporary state.", note: "'É fria' would describe the inherent temperature characteristic." },
  { id: 12, scenario: "O Luís é lento a aprender línguas.", question: "Ser or Estar?", correct: "ser", explanation: "'Ser lento a aprender' describes an inherent characteristic or ability.", note: "'O Luís está lento hoje' = he's moving slowly TODAY." },
];

const WRITING_TASKS = [
  { id: 1, type: "Email informal", title: "Email a um Amigo", description: "Escreve um e-mail a um amigo sobre o teu fim de semana.", topic: "Fim de semana", targetWords: 60, modelAnswer: "Olá Pedro!\n\nComo estás? O meu fim de semana foi muito divertido.\n\nNo sábado, acordei tarde e fui ao café com a minha família. Comi ovos e pão com manteiga — estava delicioso! À tarde, fui ao parque com os meus amigos.\n\nNo domingo, levantei-me cedo e fui às compras. Comprei fruta e legumes no mercado. À noite, estudei português para o exame.\n\nE tu? O que fizeste no fim de semana?\n\nUm abraço,\n[O teu nome]", keyVocab: ["fins de semana","divertido","acordar","ir ao café","delicioso"] },
  { id: 2, type: "Email formal", title: "Email a uma Empresa", description: "Escreve um e-mail formal a pedir informações sobre um produto.", topic: "Pedido de informação", targetWords: 50, modelAnswer: "Exmos. Senhores,\n\nChamo-me [nome] e escrevo para pedir informações sobre o produto que vi no vosso website.\n\nGostaria de saber o preço, o prazo de entrega e se aceitam pagamento por cartão de crédito.\n\nAguardo uma resposta com a maior brevidade possível.\n\nCom os melhores cumprimentos,\n[Nome]", keyVocab: ["pretendo","gostaria de saber","prazo de entrega","pagamento","aguardar"] },
  { id: 3, type: "Descrição", title: "A Minha Casa", description: "Descreve a tua casa ou apartamento. Que divisões tens?", topic: "Casa e divisões", targetWords: 70, modelAnswer: "Moro num apartamento pequeno no centro da cidade. A minha casa tem três divisões: a sala, o quarto e a cozinha.\n\nA sala é espaçosa e tem um sofá azul, uma mesa de centro e uma estante com muitos livros.\n\nO quarto tem uma cama grande, um armário branco e uma mesa de cabeceira.\n\nA cozinha é pequena mas funcional. Tem um fogão, um frigorífico e uma bancada. Adoro fazer café de manhã!\n\nNo total, a casa tem cerca de 60 metros quadrados. Não é grande, mas é aconchegante.", keyVocab: ["apartamento","divisões","espaçoso","aconchegante","funcional","cerca de"] },
  { id: 4, type: "Descrição", title: "A Minha Família", description: "Descreve a tua família. Quem são? O que fazem?", topic: "Família", targetWords: 80, modelAnswer: "A minha família é pequena. Somos quatro: os meus pais, a minha irmã e eu.\n\nO meu pai chama-se António e tem 48 anos. É alto e trabalha como engenheiro. É muito trabalhador e simpático.\n\nA minha mãe chama-se Maria e tem 45 anos. É professora de português. Adora ler e cozinhar.\n\nA minha irmã chama-se Sofia e tem 18 anos. É estudante e quer ser médica.\n\nEu tenho 22 anos e estudo informática. Gosto de música e de jogar computador.\n\nSomos muito unidos e passamos muito tempo juntos aos fins de semana.", keyVocab: ["família","unidos","trabalhador","estudante","inteligente","passar tempo"] },
  { id: 5, type: "Diálogo", title: "No Café", description: "Escreve um diálogo entre duas pessoas num café.", topic: "No café", targetWords: 40, modelAnswer: "Empregada: Olá! O que deseja?\nCliente: Olá! Queria um café com leite, por favor.\nEmpregada: Com açúcar ou sem açúcar?\nCliente: Sem açúcar, obrigado. E também quero um bolo de chocolate.\nEmpregada: São três euros no total.\nCliente: Aqui tem. Pode dar-me o troco?\nEmpregada: Claro! Aqui tem. Bom proveito!", keyVocab: ["deseja","queria","por favor","obrigado","quanto custa","o troco"] },
  { id: 6, type: "Descrição", title: "Um Dia Típico", description: "Descreve um dia típico na tua vida.", topic: "Rotina diária", targetWords: 90, modelAnswer: "O meu dia típico começa às sete da manhã. Levanto-me, tomo um duche e pequeno-almoço.\n\nDe manhã, vou para o trabalho. Chego às nove e trabalho até à hora de almoço.\n\nÀ uma hora, almoço. Geralmente como uma sandes e uma peça de fruta.\n\nDepois do trabalho, vou às vezes ao ginásio ou encontro amigos.\n\nÀ noite, janto por volta das sete e meia. Depois, vejo televisão ou estudo português. Deito-me às onze.\n\nAos fins de semana, a minha rotina muda. Durmo mais e passo tempo com a família.", keyVocab: ["levantar-se","pequeno-almoço","geralmente","por volta das","às vezes","aos fins de semana"] },
  { id: 7, type: "Narração", title: "Uma Viagem", description: "Descreve uma viagem que fizeste.", topic: "Viagem", targetWords: 80, modelAnswer: "No verão passado, fui a Portugal com a minha família. Viajámos de carro e demorámos cerca de seis horas.\n\nFicámos numa pequena pensão perto da praia. O quarto era simples mas limpo.\n\nNo primeiro dia, fomos à praia. O mar estava quente e havia poucos banhistas. Foi muito relaxante!\n\nNo segundo dia, visitámos uma cidade histórica com castelo medieval. A vista era incrível.\n\nNo último dia, comprámos lembranças para a família.\n\nFoi uma viagem muito agradável. Quero voltar!", keyVocab: ["no verão passado","ficámos","relaxante","incrível","lembranças"] },
  { id: 8, type: "Opinião", title: "Planos para o Futuro", description: "Descreve os teus planos para os próximos cinco anos.", topic: "Planos futuros", targetWords: 60, modelAnswer: "Nos próximos cinco anos, tenho vários planos.\n\nPrimeiro, quero terminar os meus estudos. Se tudo correr bem, vou acabar o curso e receber o diploma.\n\nDepois, quero encontrar um bom emprego na minha área. Gostaria de trabalhar numa empresa grande onde possa aprender muito.\n\nTambém quero poupar dinheiro para fazer uma viagem longa. Sempre quis visitar o Brasil e Portugal.\n\nPara alcançar estes objetivos, sei que tenho de trabalhar muito. Mas estou motivado.", keyVocab: ["se tudo correr bem","progredir","poupar dinheiro","a longo prazo","alcançar","motivado"] },
];

const ORAL_DIALOGUES = [
  { id: 1, title: "Cumprimentos", difficulty: "Fácil", dialogue: [{speaker:"A",text:"Olá! Como estás?"},{speaker:"B",text:"Olá! Estou bem, obrigado. E tu?"},{speaker:"A",text:"Também estou bem. Tudo bem com a família?"},{speaker:"B",text:"Tudo bem! Até amanhã!"},{speaker:"A",text:"Até amanhã! Adeus!"}], keyPhrases: ["Olá! Como estás?","Estou bem, obrigado.","E tu?","Tudo bem com a família?","Até amanhã!","Adeus!"], tip: "In EP, 'tu' is used widely (unlike BP)." },
  { id: 2, title: "No Café", difficulty: "Fácil", dialogue: [{speaker:"Empregada",text:"Bom dia! O que deseja?"},{speaker:"Cliente",text:"Queria um café, por favor."},{speaker:"Empregada",text:"Com açúcar?"},{speaker:"Cliente",text:"Sim, obrigado."},{speaker:"Empregada",text:"São 80 cêntimos."},{speaker:"Cliente",text:"Aqui tem."},{speaker:"Empregada",text:"Muito obrigada! Bom proveito!"}], keyPhrases: ["O que deseja?","Queria um café, por favor.","Com açúcar?","Aqui tem.","Bom proveito!"], tip: "In Portugal, you always pay at the counter before sitting down." },
  { id: 3, title: "Reservar Mesa", difficulty: "Médio", dialogue: [{speaker:"Restaurante",text:"Restaurante O Telheiro, bom dia!"},{speaker:"Cliente",text:"Queria fazer uma reserva para amanhã à noite."},{speaker:"Restaurante",text:"Para quantas pessoas?"},{speaker:"Cliente",text:"Para quatro pessoas. Às oito horas."},{speaker:"Restaurante",text:"Em nome de quem?"},{speaker:"Cliente",text:"Em nome de Silva."},{speaker:"Restaurante",text:"Muito bem! Até amanhã!"}], keyPhrases: ["Queria fazer uma reserva.","Para quantas pessoas?","Às oito horas.","Em nome de quem?","Até amanhã!"], tip: "Portuguese restaurants often close one day per week — always call ahead." },
  { id: 4, title: "No Médico", difficulty: "Médio", dialogue: [{speaker:"Médico",text:"Bom dia! Em que posso ajudá-lo?"},{speaker:"Paciente",text:"Não me sinto bem desde ontem."},{speaker:"Médico",text:"Que sintomas tem?"},{speaker:"Paciente",text:"Tenho dores de cabeça e febre."},{speaker:"Médico",text:"Não se preocupe. É uma constipação. Descanse e beba muitos líquidos."}], keyPhrases: ["Não me sinto bem.","Que sintomas tem?","Tenho dores de cabeça e febre.","Não se preocupe.","Descanse e beba muitos líquidos."], tip: "In Portugal, go to the 'Centro de Saúde' first for non-emergencies." },
  { id: 5, title: "Pedir Direções", difficulty: "Médio", dialogue: [{speaker:"Turista",text:"Com licença! Estou perdido."},{speaker:"Português",text:"Claro! Onde quer ir?"},{speaker:"Turista",text:"Queria ir à estação de comboios."},{speaker:"Português",text:"Vire à direita. Ande sempre em frente até ao semáforo."},{speaker:"Turista",text:"Muito obrigado!"},{speaker:"Português",text:"De nada! Boa viagem!"}], keyPhrases: ["Com licença!","Estou perdido.","Onde quer ir?","Vire à direita.","Ande sempre em frente.","Muito obrigado!"], tip: "Portuguese people are generally helpful." },
  { id: 6, title: "Na Loja de Roupa", difficulty: "Fácil", dialogue: [{speaker:"Vendedora",text:"Posso ajudá-la?"},{speaker:"Cliente",text:"Estou a procurar um casaco azul."},{speaker:"Vendedora",text:"Que tamanho usa?"},{speaker:"Cliente",text:"Uso tamanho M."},{speaker:"Vendedora",text:"Temos este aqui. Quer experimentar?"},{speaker:"Cliente",text:"Sim! Onde é o provador?"},{speaker:"Vendedora",text:"Ali ao fundo, à direita."},{speaker:"Cliente",text:"Fica perfeito! Quanto custa?"}], keyPhrases: ["Estou a procurar...","Que tamanho usa?","Quer experimentar?","Onde é o provador?","Fica perfeito!","Quanto custa?"], tip: "'Fica perfeito!' = 'It fits perfectly!'" },
  { id: 7, title: "No Aeroporto", difficulty: "Difícil", dialogue: [{speaker:"Funcionário",text:"Bom dia! Passaporte e bilhete, por favor."},{speaker:"Passageiro",text:"Aqui tem."},{speaker:"Funcionário",text:"Destino? Lisboa?"},{speaker:"Passageiro",text:"Sim. Qual é o portão de embarque?"},{speaker:"Funcionário",text:"Portão 12. Embarque às 14h30."},{speaker:"Funcionário",text:"Tenha um bom voo!"}], keyPhrases: ["Passaporte e bilhete, por favor.","Qual é o portão de embarque?","Embarque às...","Tenha um bom voo!"], tip: "Show up at least 2 hours before domestic flights." },
  { id: 8, title: "Marcar Consulta", difficulty: "Médio", dialogue: [{speaker:"Centro",text:"Centro de Saúde, bom dia!"},{speaker:"Paciente",text:"Queria marcar uma consulta com o médico."},{speaker:"Operadora",text:"Qual é o seu número de utente?"},{speaker:"Paciente",text:"É o 123456789."},{speaker:"Operadora",text:"Tem disponível na quartafeira às 10h30. Convém?"},{speaker:"Paciente",text:"Sim, convém perfeitamente!"}], keyPhrases: ["Queria marcar uma consulta.","Qual é o seu número de utente?","Tem disponível...","Convém?","Até quarta-feira!"], tip: "'Convém' means 'it suits/suitably'." },
  { id: 9, title: "Rotina Diária", difficulty: "Médio", dialogue: [{speaker:"A",text:"Conta-me: o que fazes num dia normal?"},{speaker:"B",text:"Acordo às sete, tomo o pequeno-almoço e vou trabalhar."},{speaker:"A",text:"A que horas começas?"},{speaker:"B",text:"Começo às nove. Trabalho até à uma."},{speaker:"A",text:"E depois do trabalho?"},{speaker:"B",text:"Geralmente vou ao ginásio ou encontro amigos. Às sextas vamos sempre ao cinema."}], keyPhrases: ["Acordar às sete","tomo o pequeno-almoço","Trabalho até à uma.","Geralmente","Às sextas","Passo tempo com eles"], tip: "Use 'às' with days for regular events." },
  { id: 10, title: "Opinião sobre Filmes", difficulty: "Fácil", dialogue: [{speaker:"A",text:"Viste aquele filme novo?"},{speaker:"B",text:"Ainda não vi. É bom?"},{speaker:"A",text:"É óptimo! Os actores são fantásticos."},{speaker:"B",text:"Que tipo de filme é?"},{speaker:"A",text:"É um thriller. Recomendo!"},{speaker:"B",text:"Tens de ir vê-lo!"}], keyPhrases: ["É bom?","Os actores são fantásticos.","Que tipo de filme é?","É um thriller.","Recomendo!","Tens de ir vê-lo!"], tip: "'Sair de cartaz' = to stop being shown at the cinema." },
];

const LISTENING_RESOURCES = [
  { id: 1, title: "RTP Ensina — Portuguese for Beginners", description: "Short lessons teaching basic Portuguese phrases. Clear European Portuguese pronunciation.", type: "video", difficulty: "Fácil", url: "https://www.rtp.pt/ensina/", transcript: "Multiple short clips covering greetings, introductions, and everyday phrases.", topics: ["Cumprimentos","Números","Frases básicas"] },
  { id: 2, title: "Portuguese with Carlota", description: "YouTube channel with European Portuguese lessons on everyday conversation.", type: "video", difficulty: "Fácil", url: "https://www.youtube.com/results?search_query=portuguese+with+carlota+european", transcript: "Conversational EP lessons on daily topics.", topics: ["Conversação","Vida diária","Vocabulário"] },
  { id: 3, title: "Practice Portuguese — A2 Listening", description: "Structured listening exercises for A2 level with transcripts and slow playback.", type: "audio", difficulty: "Médio", url: "https://practiceportuguese.com/", transcript: "Various dialogues at A2 level.", topics: ["Diálogos","Gramática","A2"] },
  { id: 4, title: "YouGlish — European Portuguese", description: "Search any Portuguese phrase and hear it used by real EP speakers in videos.", type: "video", difficulty: "Variado", url: "https://youglish.com/portuguese", transcript: "Search any phrase to hear authentic EP usage.", topics: ["Pronúncia","Frases","EP autêntico"] },
  { id: 5, title: "Learning Portuguese with Paulissa", description: "Numbers, days, months, and time expressions with native speaker audio.", type: "audio", difficulty: "Fácil", url: "https://www.youtube.com/results?search_query=learning+portuguese+with+paulissa", transcript: "Numbers 1-100, days, months, telling time.", topics: ["Números","Dias","Meses","Horas"] },
  { id: 6, title: "Easy Portuguese — Street Interviews", description: "Real Portuguese people interviewed on the street about everyday topics.", type: "video", difficulty: "Médio", url: "https://www.youtube.com/results?search_query=easy+portuguese", transcript: "Spontaneous speech on family, work, hobbies.", topics: ["Entrevistas","Vida real","Conversação"] },
  { id: 7, title: "CIPLE Exam Sample Listening", description: "Sample listening comprehension from past CIPLE exams.", type: "audio", difficulty: "Difícil", url: "https://www.dge.mec.pt/ple", transcript: "Exam-style dialogues with comprehension questions.", topics: ["CIPLE","Exame","Compreensão"] },
  { id: 8, title: "Talk Portuguese — BBC Series", description: "BBC's European Portuguese course with video lessons.", type: "video", difficulty: "Fácil", url: "https://www.bbc.co.uk/languages/portuguese/", transcript: "Structured lessons on greetings and basic conversation.", topics: ["Aulas","Iniciantes","Conversação"] },
  { id: 9, title: "Portuguese Music for Learners", description: "Fado and pop music. Great for advanced A2/B1 listening practice.", type: "audio", difficulty: "Avançado", url: "https://www.youtube.com/results?search_query=fado+português+letras", transcript: "Various songs with lyrics.", topics: ["Fado","Música","Cultura","A2-B1"] },
];

const GLOSSARY_TERMS = [
  { term: "Substantivo", category: "Noun", explanation: "A word that names a thing: a person, a place, an object, or an idea.", example: "casa (house), Lisboa (city), mãe (mother)" },
  { term: "Verbo", category: "Verb", explanation: "A word that describes an action, a state, or an occurrence.", example: "falar (to speak), ser (to be), ir (to go)" },
  { term: "Adjetivo", category: "Adjective", explanation: "A word that describes or modifies a noun.", example: "grande (big), bonito (beautiful), português (Portuguese)" },
  { term: "Advérbio", category: "Adverb", explanation: "A word that modifies a verb, adjective, or another adverb.", example: "muito (very), bem (well), depressa (quickly), sempre (always)" },
  { term: "Pronome", category: "Pronoun", explanation: "A word that replaces a noun to avoid repetition.", example: "eu (I), tu (you), ele (he), nós (we)" },
  { term: "Preposição", category: "Preposition", explanation: "A word linking a noun/pronoun to another word (position, direction, time).", example: "em (in/on), de (of/from), para (for/to), com (with)" },
  { term: "Conjunção", category: "Conjunction", explanation: "A word that joins clauses or sentences.", example: "e (and), mas (but), porque (because), quando (when)" },
  { term: "Artigo", category: "Article", explanation: "A word that defines a noun as specific (the) or non-specific (a/an).", example: "o livro (the book), uma casa (a house)" },
  { term: "Conjugação", category: "Conjugation", explanation: "Changing a verb's form for person (I/you/he) and time (present/past/future).", example: "eu falo, tu falas, ele fala" },
  { term: "Singular", category: "Number", explanation: "Refers to ONE person, thing, or idea.", example: "o livro (the book), o cão (the dog)" },
  { term: "Plural", category: "Number", explanation: "Refers to MORE THAN ONE. Usually formed by adding -s or -es.", example: "os livros (the books), os cães (the dogs)" },
  { term: "Masculino", category: "Gender", explanation: "One of two grammatical genders. Nouns ending in -o are usually masculine.", example: "o livro, o carro, o irmão" },
  { term: "Feminino", category: "Gender", explanation: "One of two grammatical genders. Nouns ending in -a are usually feminine.", example: "a casa, a mesa, a irmã" },
  { term: "Pretérito", category: "Tense", explanation: "Past tense. In Portuguese: Perfeito (completed) vs Imperfeito (ongoing).", example: "Falei com ele ontem. vs Falava todos os dias." },
  { term: "Pretérito Perfeito", category: "Tense", explanation: "Past tense for completed, specific actions at a defined time.", example: "Comi às três. — a specific completed event" },
  { term: "Pretérito Imperfeito", category: "Tense", explanation: "Past tense for ongoing actions, habitual past actions, or describing past states.", example: "Comia sopa quando era criança. — habitual/ongoing" },
  { term: "Futuro", category: "Tense", explanation: "Future tense. Formed with 'ir' + infinitive or verb endings.", example: "Vou ao cinema amanhã. / Falarei com ele." },
  { term: "Condicional", category: "Tense", explanation: "Conditional tense. Describes what would/could happen. Like 'would' or 'could'.", example: "Eu falaria contigo se tivesse tempo." },
  { term: "Verbo Regular", category: "Verb Type", explanation: "A verb following the standard pattern for its group (-AR, -ER, -IR).", example: "falar → falo, falaste, falou" },
  { term: "Verbo Irregular", category: "Verb Type", explanation: "A verb NOT following the standard pattern. Forms must be memorized.", example: "pôr → ponho, pões, põe / ser → sou, és, é" },
  { term: "Verbo Reflexivo", category: "Verb Type", explanation: "A verb where subject and object are the same. Uses reflexive pronouns.", example: "Levanto-me cedo. / Arrependo-me." },
  { term: "Objeto Direto", category: "Grammar", explanation: "The thing that receives the verb's action directly, without a preposition.", example: "Vejo o gato. (I see the cat.)" },
  { term: "Objeto Indireto", category: "Grammar", explanation: "The person/thing receiving the action indirectly — 'to' or 'for' someone.", example: "Dou o livro ao João. (to João)" },
  { term: "Contrações", category: "Grammar", explanation: "When a preposition and article merge together. Essential in Portuguese.", example: "em+o=no / de+a=da / a+o=ao / por+o=pelo" },
  { term: "Mesoclise", category: "EP Feature", explanation: "A unique EP feature: pronoun inserted inside a verb (future/conditional).", example: "ver-me-ei / dir-lhe-ei / dar-te-ei" },
  { term: "Gerúndio", category: "Verb Form", explanation: "The -ING form. BP: falando. EP: a falar (estar + a + infinitive).", example: "BP: Estou falando. / EP: Estou a falar." },
  { term: "Infinitivo", category: "Verb Form", explanation: "The base form of a verb. Falar = to speak.", example: "Quero falar contigo. / Preciso de estudar." },
];

const SECTIONS = [
  { id: 'verbs25', label: '25 Verbos', icon: '⚡' },
  { id: 'conjugation', label: 'Conjugação', icon: '📐' },
  { id: 'pronouns', label: 'Pronomes', icon: '👤' },
  { id: 'adjectives', label: 'Adjetivos', icon: '🎨' },
  { id: 'prepositions', label: 'Preposições', icon: '📍' },
  { id: 'articles', label: 'Artigos', icon: '📝' },
  { id: 'vocabulary', label: 'Vocabulário', icon: '📚' },
  { id: 'modals', label: 'Modais', icon: '🔧' },
  { id: 'idioms', label: 'Expressões', icon: '🇵🇹' },
  { id: 'falsefriends', label: 'Falsos Amigos', icon: '⚠️' },
  { id: 'structure', label: 'Frases', icon: '🧱' },
  { id: 'preterito', label: 'Pretéritos', icon: '⏱️' },
  { id: 'serestar', label: 'Ser/Estar', icon: '🔄' },
  { id: 'escrita', label: 'Escrita', icon: '✍️' },
  { id: 'oral', label: 'Oral', icon: '🗣️' },
  { id: 'escuta', label: 'Escuta', icon: '🎧' },
  { id: 'glossary', label: 'Glossário', icon: '📖' },
  { id: 'progresso', label: 'Progresso', icon: '📊' },
];

// ─── STYLES ────────────────────────────────────────────────────────────────────

const S = {
  app: { fontFamily: "'DM Sans',sans-serif", minHeight: '100vh', background: '#0a0f0d', color: '#e8e6e1' },
  header: { padding: '24px 16px 12px', textAlign: 'center' },
  title: { fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(24px,5vw,36px)', color: '#00c875', margin: 0 },
  subtitle: { fontSize: '11px', color: '#7a8a80', marginTop: 6, letterSpacing: '2px', textTransform: 'uppercase' },
  nav: { display: 'flex', gap: '5px', padding: '10px 14px', overflowX: 'auto', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(10,15,13,0.95)', borderBottom: '1px solid rgba(0,200,117,0.1)' },
  navBtn: (a) => ({ padding: '7px 12px', borderRadius: '7px', border: a ? '1px solid #00c875' : '1px solid rgba(255,255,255,0.07)', background: a ? 'rgba(0,200,117,0.12)' : 'rgba(255,255,255,0.02)', color: a ? '#00c875' : '#7a8a80', fontSize: '11px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }),
  content: { padding: '18px 14px 80px', maxWidth: '920px', margin: '0 auto' },
  secTitle: { fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(20px,4vw,28px)', color: '#00c875', marginBottom: 4 },
  secDesc: { fontSize: '13px', color: '#7a8a80', marginBottom: 18, lineHeight: 1.5 },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', marginBottom: '10px' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' },
  verbH: { fontFamily: "'DM Serif Display',serif", fontSize: '18px', color: '#fff' },
  verbM: { fontSize: '12px', color: '#00c875', fontWeight: 500 },
  conjGrid: { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3px 14px', marginTop: '10px' },
  pron: { fontSize: '11px', color: '#7a8a80', fontFamily: 'monospace', textAlign: 'right', padding: '2px 0' },
  conjF: { fontSize: '13px', color: '#e8e6e1', fontFamily: 'monospace', fontWeight: 500, padding: '2px 0' },
  tag: (c='#00c875') => ({ display: 'inline-block', padding: '2px 9px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, background: c+'18', color: c, letterSpacing: '0.5px', textTransform: 'uppercase' }),
  input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', padding: '7px 10px', color: '#e8e6e1', fontSize: '13px', fontFamily: 'monospace', outline: 'none', width: '90px', textAlign: 'center', transition: 'border-color 0.2s' },
  inputC: { borderColor: '#00c875', background: 'rgba(0,200,117,0.08)' },
  inputW: { borderColor: '#ff4757', background: 'rgba(255,71,87,0.08)' },
  btn: { padding: '9px 18px', borderRadius: '8px', border: '1px solid #00c875', background: 'rgba(0,200,117,0.1)', color: '#00c875', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  toggleRow: { display: 'flex', gap: '7px', marginBottom: '18px', flexWrap: 'wrap' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px' },
  th: { textAlign: 'left', padding: '7px 11px', fontSize: '10px', color: '#7a8a80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' },
  td: { padding: '9px 11px', fontSize: '13px', background: 'rgba(255,255,255,0.02)' },
  flashcard: { background: 'rgba(0,200,117,0.04)', border: '1px solid rgba(0,200,117,0.15)', borderRadius: '16px', padding: '36px 22px', textAlign: 'center', cursor: 'pointer', minHeight: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' },
  progressBar: { height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', marginBottom: '18px' },
  progressFill: (p) => ({ height: '100%', width: p+'%', background: 'linear-gradient(90deg, #00c875, #00a86b)', borderRadius: '2px', transition: 'width 0.4s ease' }),
  badge: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, background: 'rgba(0,200,117,0.1)', color: '#00c875' },
  badgeGray: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: '#7a8a80' },
};

// ─── UTILITY ───────────────────────────────────────────────────────────────────

function useLocal(key, def) {
  const [v, setV] = useState(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; } });
  const setAndStore = useCallback((nv) => {
    const r = typeof nv === 'function' ? nv(v) : nv;
    setV(r);
    try { localStorage.setItem(key, JSON.stringify(r)); } catch {}
  }, [key, v]);
  return [v, setAndStore];
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

function VerbCard({ verb, meaning, conj }) {
  const [show, setShow] = useState(false);
  return (
    <div style={S.card} onClick={() => setShow(!show)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={S.verbH}>{verb}</span>
        <span style={S.verbM}>{meaning}</span>
      </div>
      {show && (
        <div style={S.conjGrid}>
          {PRONOUNS.map((p, i) => <React.Fragment key={p}><span style={S.pron}>{p}</span><span style={S.conjF}>{conj[i]}</span></React.Fragment>)}
        </div>
      )}
      <div style={{ fontSize: '10px', color: '#444', marginTop: '8px', textAlign: 'center' }}>{show ? 'tap to hide' : 'tap to reveal'}</div>
    </div>
  );
}

function FlashcardDrill({ items, frontKey, backKey, title, sectionId }) {
  const [wrongKey] = useLocal('wrong', {});
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const shuffled = useCallback(() => {
    const base = [...items];
    return base.sort((a, b) => {
      const kA = typeof a[frontKey] === 'string' ? a[frontKey] : JSON.stringify(a[frontKey]);
      const kB = typeof b[frontKey] === 'string' ? b[frontKey] : JSON.stringify(b[frontKey]);
      return (wrongKey[sectionId+'_'+kB]||0) - (wrongKey[sectionId+'_'+kA]||0);
    });
  }, [items, frontKey, sectionId, wrongKey]);

  const current = shuffled()[idx % items.length];

  const markWrong = useCallback((item) => {
    const k = typeof item[frontKey] === 'string' ? item[frontKey] : JSON.stringify(item[frontKey]);
    const cur = wrongKey[sectionId+'_'+k] || 0;
    const nw = { ...wrongKey, [sectionId+'_'+k]: cur + 1 };
    try { localStorage.setItem('wrong', JSON.stringify(nw)); } catch {}
  }, [wrongKey, sectionId, frontKey]);

  const next = (correct) => {
    if (!correct && sectionId) markWrong(current);
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setFlipped(false);
    setIdx(i => i + 1);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={S.badge}>{Math.min(idx+1, items.length)} / {items.length}</span>
        {score.total > 0 && <span style={{ fontSize: '12px', color: '#7a8a80' }}>{score.correct}/{score.total} correct</span>}
      </div>
      <div style={S.progressBar}><div style={S.progressFill(((idx % items.length) / items.length) * 100)} /></div>
      <div style={S.flashcard} onClick={() => setFlipped(!flipped)}>
        {!flipped ? (
          <><div style={{ fontSize: '10px', color: '#7a8a80', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '1px' }}>{title || 'Português'}</div><div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '26px', color: '#fff' }}>{typeof frontKey === 'function' ? frontKey(current) : current[frontKey]}</div><div style={{ fontSize: '11px', color: '#444', marginTop: '14px' }}>tap to flip</div></>
        ) : (
          <><div style={{ fontSize: '10px', color: '#7a8a80', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '1px' }}>English</div><div style={{ fontSize: '20px', color: '#00c875', fontWeight: 500 }}>{typeof backKey === 'function' ? backKey(current) : current[backKey]}</div><div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}><button style={{ ...S.btn, borderColor: '#ff4757', color: '#ff4757', background: 'rgba(255,71,87,0.1)', padding: '8px 16px' }} onClick={(e) => { e.stopPropagation(); next(false); }}>Again</button><button style={S.btn} onClick={(e) => { e.stopPropagation(); next(true); }}>Got it</button></div></>
        )}
      </div>
    </div>
  );
}

function FillGap({ exercises }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [showHints, setShowHints] = useState(false);

  const check = (i) => {
    const ua = (answers[i] || '').trim().toLowerCase();
    setChecked(c => ({ ...c, [i]: ua === exercises[i].answer.toLowerCase() }));
  };
  const checkAll = () => {
    const nc = {};
    exercises.forEach((ex, i) => { nc[i] = (answers[i] || '').trim().toLowerCase() === ex.answer.toLowerCase(); });
    setChecked(nc);
  };
  const score = Object.values(checked).filter(Boolean).length;
  const attempted = Object.keys(checked).length;

  return (
    <div>
      <div style={{ display: 'flex', gap: '7px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <button style={S.btn} onClick={() => setShowHints(!showHints)}>{showHints ? 'Hide Hints' : 'Show Hints'}</button>
        <button style={S.btn} onClick={checkAll}>Check All</button>
        {attempted > 0 && <span style={S.badge}>{score}/{attempted} correct</span>}
      </div>
      {exercises.map((ex, i) => {
        const parts = ex.sentence.split('___');
        const isChk = checked[i] !== undefined;
        const isCorr = checked[i];
        return (
          <div key={i} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '7px', padding: '13px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '3px', fontSize: '14px' }}>
              <span style={{ color: '#7a8a80', fontSize: '11px', fontWeight: 700, marginRight: '7px' }}>{i+1}.</span>
              <span>{parts[0]}</span>
              <input style={{ ...S.input, ...(isChk ? (isCorr ? S.inputC : S.inputW) : {}) }} value={answers[i] || ''} onChange={(e) => { setAnswers(a => ({ ...a, [i]: e.target.value })); setChecked(c => { const n = { ...c }; delete n[i]; return n; }); }} onKeyDown={(e) => e.key === 'Enter' && check(i)} placeholder="..." />
              <span>{parts[1]}</span>
            </div>
            <div style={{ display: 'flex', gap: '7px', alignItems: 'center', flexWrap: 'wrap' }}>
              {showHints && <span style={{ fontSize: '11px', color: '#7a8a80', fontStyle: 'italic' }}>{ex.hint}</span>}
              {isChk && !isCorr && <span style={{ fontSize: '11px', color: '#ff4757' }}>→ {ex.answer}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScenarioCard({ scenario, question, correct, explanation, note }) {
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState(null);
  const handleSelect = (c) => { setSelected(c); setRevealed(true); };
  return (
    <div style={{ ...S.card, padding: '16px 18px' }}>
      <div style={{ fontSize: '15px', color: '#fff', marginBottom: '6px', fontFamily: 'monospace' }}>"{scenario}"</div>
      <div style={{ fontSize: '12px', color: '#7a8a80', marginBottom: '14px' }}>{question}</div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        {['ser','estar'].map(c => (
          <button key={c} onClick={() => handleSelect(c)} style={{ padding: '7px 16px', borderRadius: '7px', border: '1px solid ' + (selected === c ? (c === correct ? '#00c875' : '#ff4757') : 'rgba(255,255,255,0.1)'), background: selected === c ? (c === correct ? 'rgba(0,200,117,0.12)' : 'rgba(255,71,87,0.1)') : 'rgba(255,255,255,0.03)', color: selected === c ? (c === correct ? '#00c875' : '#ff4757') : '#7a8a80', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' }}>{c}</button>
        ))}
      </div>
      {revealed && (
        <div style={{ ...S.card, background: 'rgba(0,200,117,0.05)', border: '1px solid rgba(0,200,117,0.12)', padding: '12px 14px' }}>
          <div style={{ fontSize: '12px', color: '#00c875', fontWeight: 600, marginBottom: '6px' }}>{selected === correct ? '✓ Correct!' : `✗ Wrong — answer is: ${correct}`}</div>
          <div style={{ fontSize: '12px', color: '#c0b8a8', lineHeight: 1.6, marginBottom: note ? '6px' : 0 }}>{explanation}</div>
          {note && <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic' }}>💡 {note}</div>}
        </div>
      )}
    </div>
  );
}

function WritingTask({ task }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ ...S.card, padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
        <div><span style={S.tag('#4ecdc4')}>{task.type}</span><span style={{ ...S.tag(), marginLeft: '5px' }}>{task.targetWords} words</span></div>
      </div>
      <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '17px', color: '#fff', marginBottom: '6px' }}>{task.title}</div>
      <div style={{ fontSize: '13px', color: '#7a8a80', marginBottom: '12px', lineHeight: 1.5 }}>{task.description}</div>
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', color: '#555', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Key vocabulary</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {task.keyVocab.map((v, i) => <span key={i} style={{ ...S.tag('#4ecdc4'), fontSize: '10px' }}>{v}</span>)}
        </div>
      </div>
      <button style={S.btn} onClick={() => setRevealed(!revealed)}>{revealed ? 'Hide Model Answer' : 'Show Model Answer'}</button>
      {revealed && (
        <div style={{ marginTop: '14px', background: 'rgba(0,200,117,0.04)', border: '1px solid rgba(0,200,117,0.12)', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#7a8a80', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Model Answer</div>
          <div style={{ fontSize: '13px', color: '#c0b8a8', lineHeight: 1.7, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{task.modelAnswer}</div>
        </div>
      )}
    </div>
  );
}

function OralDialogue({ dialogue }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ ...S.card, padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
        <div><span style={{ fontFamily: "'DM Serif Display',serif", fontSize: '16px', color: '#fff' }}>{dialogue.title}</span></div>
        <span style={{ ...S.tag(), background: dialogue.difficulty === 'Fácil' ? '#00c87518' : dialogue.difficulty === 'Médio' ? '#ffe66d18' : '#ff475718', color: dialogue.difficulty === 'Fácil' ? '#00c875' : dialogue.difficulty === 'Médio' ? '#ffe66d' : '#ff4757' }}>{dialogue.difficulty}</span>
      </div>
      {dialogue.tip && <div style={{ fontSize: '11px', color: '#4ecdc4', fontStyle: 'italic', marginBottom: '12px', padding: '8px 10px', background: 'rgba(78,205,196,0.06)', borderRadius: '6px' }}>💡 {dialogue.tip}</div>}
      <button style={S.btn} onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide Dialogue' : 'Show Dialogue'}</button>
      {expanded && (
        <div style={{ marginTop: '12px' }}>
          {dialogue.dialogue.map((line, i) => <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', fontSize: '13px' }}><span style={{ fontWeight: 700, color: line.speaker === 'A' || line.speaker === 'Cliente' || line.speaker === 'Paciente' || line.speaker === 'Passageiro' ? '#00c875' : '#4ecdc4', minWidth: '80px' }}>{line.speaker}:</span><span style={{ color: '#e8e6e1' }}>{line.text}</span></div>)}
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '10px', color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Key phrases</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>{dialogue.keyPhrases.map((p, i) => <span key={i} style={{ ...S.tag('#4ecdc4'), fontSize: '10px' }}>{p}</span>)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ListeningItem({ item }) {
  const [showTranscript, setShowTranscript] = useState(false);
  return (
    <div style={{ ...S.card, padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
        <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '16px', color: '#fff' }}>{item.title}</div>
        <span style={{ ...S.tag(), background: item.difficulty === 'Fácil' ? '#00c87518' : item.difficulty === 'Médio' ? '#ffe66d18' : '#ff475718', color: item.difficulty === 'Fácil' ? '#00c875' : item.difficulty === 'Médio' ? '#ffe66d' : '#ff4757' }}>{item.difficulty}</span>
      </div>
      <div style={{ fontSize: '12px', color: '#7a8a80', marginBottom: '10px', lineHeight: 1.5 }}>{item.description}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>{item.topics.map((t, i) => <span key={i} style={{ ...S.tag('#4ecdc4'), fontSize: '9px' }}>{t}</span>)}</div>
      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ ...S.btn, display: 'inline-block', textDecoration: 'none' }}>🔗 Open Resource</a>
      <button style={{ ...S.btn, marginTop: '8px', marginLeft: '7px', borderColor: '#4ecdc4', color: '#4ecdc4', background: 'rgba(78,205,196,0.08)' }} onClick={() => setShowTranscript(!showTranscript)}>{showTranscript ? 'Hide Transcript' : 'Show Transcript'}</button>
      {showTranscript && <div style={{ marginTop: '10px', fontSize: '12px', color: '#7a8a80', fontStyle: 'italic', lineHeight: 1.6, padding: '10px', background: 'rgba(78,205,196,0.04)', borderRadius: '8px' }}>{item.transcript}</div>}
    </div>
  );
}

function GlossaryEntry({ term }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ ...S.card, padding: '14px 16px', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: '15px', color: '#00c875' }}>{term.term}</span>
          <span style={S.badgeGray}>{term.category}</span>
        </div>
        <span style={{ fontSize: '11px', color: '#444' }}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && <div style={{ marginTop: '10px' }}><div style={{ fontSize: '12px', color: '#c0b8a8', lineHeight: 1.6, marginBottom: '8px' }}>{term.explanation}</div><div style={{ fontSize: '11px', color: '#7a8a80', fontStyle: 'italic' }}>Example: {term.example}</div></div>}
    </div>
  );
}

function ProgressSection() {
  const [wrongKey] = useLocal('wrong', {});
  const [totalSessions] = useLocal('sessions', 0);
  const wrongCount = Object.values(wrongKey).reduce((a, b) => a + b, 0);
  const uniqueWrong = Object.keys(wrongKey).length;
  return (
    <div>
      <h2 style={S.secTitle}>O Teu Progresso</h2>
      <p style={S.secDesc}>Acompanha o teu progresso de estudo. Os dados são guardados no teu navegador.</p>
      <div style={S.grid2}>
        <div style={{ ...S.card, background: 'rgba(0,200,117,0.05)', border: '1px solid rgba(0,200,117,0.15)' }}>
          <div style={{ fontSize: '32px', fontFamily: "'DM Serif Display',serif", color: '#00c875', marginBottom: '4px' }}>{totalSessions}</div>
          <div style={{ fontSize: '12px', color: '#7a8a80' }}>Sessões de estudo</div>
        </div>
        <div style={{ ...S.card, background: 'rgba(255,71,87,0.05)', border: '1px solid rgba(255,71,87,0.15)' }}>
          <div style={{ fontSize: '32px', fontFamily: "'DM Serif Display',serif", color: '#ff4757', marginBottom: '4px' }}>{wrongCount}</div>
          <div style={{ fontSize: '12px', color: '#7a8a80' }}>Respostas erradas</div>
        </div>
        <div style={{ ...S.card, background: 'rgba(78,205,196,0.05)', border: '1px solid rgba(78,205,196,0.15)' }}>
          <div style={{ fontSize: '32px', fontFamily: "'DM Serif Display',serif", color: '#4ecdc4', marginBottom: '4px' }}>{uniqueWrong}</div>
          <div style={{ fontSize: '12px', color: '#7a8a80' }}>Palavras a rever</div>
        </div>
        <div style={{ ...S.card }}>
          <div style={{ fontSize: '13px', color: '#7a8a80', lineHeight: 1.6 }}>
            <p style={{ marginBottom: '8px' }}>💡 <strong style={{ color: '#e8e6e1' }}>Dica:</strong> Usa os flashcards regularmente para memorizar vocabulário.</p>
            <p>❌ As palavras erradas aparecem com mais frequência nos flashcards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION VIEWS ─────────────────────────────────────────────────────────────

function Verbs25Section() {
  const [mode, setMode] = useState('grid');
  return (
    <div>
      <h2 style={S.secTitle}>25 Verbos Mais Usados</h2>
      <p style={S.secDesc}>Essential verbs for A2. Master these in present tense first, then expand to past and future.</p>
      <div style={S.toggleRow}>
        <button style={S.navBtn(mode === 'grid')} onClick={() => setMode('grid')}>Reference</button>
        <button style={S.navBtn(mode === 'flash')} onClick={() => setMode('flash')}>Flashcards</button>
      </div>
      {mode === 'grid' ? <div style={S.grid2}>{TOP_25_VERBS.map(v => <VerbCard key={v.verb} {...v} />)}</div> : <FlashcardDrill items={TOP_25_VERBS} frontKey="verb" backKey="meaning" title="Verbo" sectionId="verbs25" />}
    </div>
  );
}

function ConjugationSection() {
  const [tense, setTense] = useState('Presente');
  const data = CONJUGATION_PATTERNS[tense];
  return (
    <div>
      <h2 style={S.secTitle}>Conjugação Regular</h2>
      <p style={S.secDesc}>Regular verb endings for -AR, -ER, and -IR verbs. Learn the patterns and conjugate hundreds.</p>
      <div style={S.toggleRow}>{Object.keys(CONJUGATION_PATTERNS).map(t => <button key={t} style={S.navBtn(tense === t)} onClick={() => setTense(t)}>{t}</button>)}</div>
      <div style={S.grid3}>
        {[['ar','#00c875'],['er','#4ecdc4'],['ir','#ffe66d']].map(([type,col]) => (
          <div key={type} style={{ ...S.card, borderLeft: '3px solid '+col }}>
            <div style={{ ...S.tag(col), marginBottom: '10px' }}>-{type.toUpperCase()} verbs</div>
            <div style={S.conjGrid}>{PRONOUNS.map((p, i) => <React.Fragment key={p}><span style={S.pron}>{p}</span><span style={{ ...S.conjF, color: col }}>stem {data[type][i]}</span></React.Fragment>)}</div>
            <div style={{ fontSize: '11px', color: '#7a8a80', marginTop: '10px', fontFamily: 'monospace', lineHeight: 1.6 }}>{data['example_'+type]}</div>
          </div>
        ))}
      </div>
      <div style={{ ...S.card, marginTop: '14px', background: 'rgba(0,200,117,0.04)' }}>
        <div style={{ fontSize: '12px', color: '#7a8a80', lineHeight: 1.6 }}><strong style={{ color: '#00c875' }}>EP Note:</strong> In European Portuguese, present continuous uses <strong>estar + a + infinitive</strong>: "Estou a falar" (I am speaking), not "Estou falando" (BP).</div>
      </div>
    </div>
  );
}

function PronounsSection() {
  const [cat, setCat] = useState(Object.keys(PRONOUNS_DATA)[0]);
  return (
    <div>
      <h2 style={S.secTitle}>Pronomes Portugueses</h2>
      <p style={S.secDesc}>European Portuguese pronoun system. Note: "tu" is widely used in EP, unlike Brazilian Portuguese where "você" dominates.</p>
      <div style={S.toggleRow}>{Object.keys(PRONOUNS_DATA).map(c => <button key={c} style={S.navBtn(cat === c)} onClick={() => setCat(c)}>{c}</button>)}</div>
      <div style={S.card}>
        <table style={S.table}><thead><tr><th style={S.th}>Português</th><th style={S.th}>English</th></tr></thead>
          <tbody>{PRONOUNS_DATA[cat].map(([pt,en], i) => <tr key={i}><td style={{ ...S.td, fontFamily: 'monospace', fontWeight: 600, color: '#00c875' }}>{pt}</td><td style={{ ...S.td, color: '#c0b8a8' }}>{en}</td></tr>)}</tbody>
        </table>
      </div>
      <div style={{ ...S.card, marginTop: '7px', background: 'rgba(0,200,117,0.04)' }}>
        <div style={{ fontSize: '12px', color: '#7a8a80', lineHeight: 1.6 }}><strong style={{ color: '#00c875' }}>EP Tip:</strong> In EP, object pronouns come <em>after</em> the verb with a hyphen: "Ele deu-<strong>me</strong> o livro" (He gave me the book).</div>
      </div>
    </div>
  );
}

function AdjectivesSection() {
  const [mode, setMode] = useState('grid');
  return (
    <div>
      <h2 style={S.secTitle}>40 Adjetivos Essenciais</h2>
      <p style={S.secDesc}>Core adjectives for A2. Remember: most adjectives agree in gender and number.</p>
      <div style={S.toggleRow}><button style={S.navBtn(mode === 'grid')} onClick={() => setMode('grid')}>Reference</button><button style={S.navBtn(mode === 'flash')} onClick={() => setMode('flash')}>Flashcards</button></div>
      {mode === 'grid' ? <div style={S.grid2}>{ADJECTIVES.map(([pt,en], i) => <div key={i} style={{ ...S.card, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#00c875' }}>{pt}</span><span style={{ fontSize: '12px', color: '#7a8a80' }}>{en}</span></div>)}</div> : <FlashcardDrill items={ADJECTIVES.map(([pt,en]) => ({ pt, en }))} frontKey="pt" backKey="en" title="Adjetivo" sectionId="adjectives" />}
    </div>
  );
}

function PrepositionsSection() {
  return (
    <div>
      <h2 style={S.secTitle}>Preposições — Preenche os espaços</h2>
      <p style={S.secDesc}>Practice with: em, de, para, com, sem, entre, sobre, a, por, até — and their contracted forms (no, na, ao, à, do, da...)</p>
      <FillGap exercises={PREPOSITION_EXERCISES} />
    </div>
  );
}

function ArticlesSection() {
  const [view, setView] = useState('ref');
  return (
    <div>
      <h2 style={S.secTitle}>Artigos e Contrações</h2>
      <p style={S.secDesc}>Definite and indefinite articles, plus essential contractions with prepositions.</p>
      <div style={S.toggleRow}><button style={S.navBtn(view === 'ref')} onClick={() => setView('ref')}>Reference</button><button style={S.navBtn(view === 'practice')} onClick={() => setView('practice')}>Practice</button></div>
      {view === 'ref' ? (
        <>
          {['definite','indefinite'].map(type => (
            <div key={type} style={{ ...S.card, marginBottom: '14px' }}>
              <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '16px', color: '#fff', marginBottom: '10px' }}>{ARTICLES_DATA[type].title}</h3>
              <div style={S.grid2}>{ARTICLES_DATA[type].forms.map((f, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><span style={{ fontSize: '11px', color: '#7a8a80' }}>{f.label}</span><span><strong style={{ color: '#00c875', fontSize: '15px' }}>{f.article}</strong> <span style={{ fontSize: '11px', color: '#444' }}>{f.example}</span></span></div>)}</div>
            </div>
          ))}
          <div style={S.card}>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '16px', color: '#fff', marginBottom: '10px' }}>Contrações</h3>
            {ARTICLES_DATA.definite.contractions.map((row, i) => <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '7px' }}>{row.map((c, j) => <span key={j} style={{ ...S.tag('#4ecdc4'), fontSize: '11px', fontFamily: 'monospace' }}>{c}</span>)}</div>)}
          </div>
        </>
      ) : <FillGap exercises={ARTICLES_EXERCISES} />}
    </div>
  );
}

function VocabularySection() {
  const [topic, setTopic] = useState(Object.keys(VOCABULARY)[0]);
  const [mode, setMode] = useState('grid');
  return (
    <div>
      <h2 style={S.secTitle}>Vocabulário por Tema</h2>
      <p style={S.secDesc}>A2+ vocabulary organized by CIPLE exam topics. Learn with the articles!</p>
      <div style={S.toggleRow}>{Object.keys(VOCABULARY).map(t => <button key={t} style={S.navBtn(topic === t)} onClick={() => { setTopic(t); setMode('grid'); }}>{t}</button>)}</div>
      <div style={{ marginBottom: '10px' }}><button style={S.navBtn(mode === 'grid')} onClick={() => setMode('grid')}>Reference</button><button style={{ ...S.navBtn(mode === 'flash'), marginLeft: '5px' }} onClick={() => setMode('flash')}>Flashcards</button></div>
      {mode === 'grid' ? <div style={S.grid2}>{VOCABULARY[topic].map(([pt,en], i) => <div key={i} style={{ ...S.card, padding: '9px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontFamily: 'monospace', fontWeight: 500, color: '#00c875', fontSize: '13px' }}>{pt}</span><span style={{ fontSize: '12px', color: '#7a8a80' }}>{en}</span></div>)}</div> : <FlashcardDrill items={VOCABULARY[topic].map(([pt,en]) => ({ pt, en }))} frontKey="pt" backKey="en" title={topic} sectionId={'vocab_'+topic} />}
    </div>
  );
}

function ModalsSection() {
  return (
    <div>
      <h2 style={S.secTitle}>Verbos Modais</h2>
      <p style={S.secDesc}>Modal verbs express ability, obligation, desire, and necessity. Critical for A2 communication.</p>
      {MODAL_VERBS.map((m, i) => (
        <div key={i} style={{ ...S.card, borderLeft: '3px solid #00c875' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '7px' }}><span style={S.verbH}>{m.verb}</span><span style={S.verbM}>{m.meaning}</span></div>
          <div style={{ fontSize: '12px', color: '#c0b8a8', margin: '9px 0', lineHeight: 1.5 }}>{m.usage}</div>
          <div style={S.conjGrid}>{PRONOUNS.map((p, j) => <React.Fragment key={p}><span style={S.pron}>{p}</span><span style={S.conjF}>{m.presente[j]}</span></React.Fragment>)}</div>
          <div style={{ marginTop: '10px' }}>{m.examples.map((ex, j) => <div key={j} style={{ fontSize: '12px', color: '#7a8a80', fontStyle: 'italic', padding: '2px 0', fontFamily: 'monospace' }}>{ex}</div>)}</div>
        </div>
      ))}
    </div>
  );
}

function IdiomsSection() {
  const [mode, setMode] = useState('list');
  return (
    <div>
      <h2 style={S.secTitle}>Expressões Idiomáticas</h2>
      <p style={S.secDesc}>Common Portuguese expressions. Knowing these will impress in conversation.</p>
      <div style={S.toggleRow}><button style={S.navBtn(mode === 'list')} onClick={() => setMode('list')}>Reference</button><button style={S.navBtn(mode === 'flash')} onClick={() => setMode('flash')}>Flashcards</button></div>
      {mode === 'list' ? IDIOMS.map((idiom, i) => <div key={i} style={{ ...S.card, padding: '12px 16px' }}><div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '16px', color: '#fff' }}>"{idiom.pt}"</div><div style={{ fontSize: '13px', color: '#00c875', fontWeight: 500, marginTop: '3px' }}>{idiom.en}</div><div style={{ fontSize: '11px', color: '#444', marginTop: '3px' }}>Literal: {idiom.literal}</div></div>) : <FlashcardDrill items={IDIOMS} frontKey="pt" backKey={(item) => item.en+'\n(Literal: '+item.literal+')'} title="Expressão" sectionId="idioms" />}
    </div>
  );
}

function FalseFriendsSection() {
  const [mode, setMode] = useState('list');
  return (
    <div>
      <h2 style={S.secTitle}>Falsos Amigos</h2>
      <p style={S.secDesc}>Words that look like English but mean something different. Essential to avoid mistakes!</p>
      <div style={S.toggleRow}><button style={S.navBtn(mode === 'list')} onClick={() => setMode('list')}>Reference</button><button style={S.navBtn(mode === 'flash')} onClick={() => setMode('flash')}>Flashcards</button></div>
      {mode === 'list' ? <div style={S.grid2}>{FALSE_FRIENDS.map((ff, i) => <div key={i} style={S.card}><div style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 600, color: '#fff' }}>{ff.pt}</div><div style={{ fontSize: '11px', color: '#ff4757', marginTop: '5px' }}><span style={{ textDecoration: 'line-through' }}>✗ {ff.seems}</span></div><div style={{ fontSize: '13px', color: '#00c875', fontWeight: 500, marginTop: '3px' }}>✓ {ff.actually}</div></div>)}</div> : <FlashcardDrill items={FALSE_FRIENDS} frontKey="pt" backKey={(item) => 'NOT "'+item.seems+'" → '+item.actually} title="Falso Amigo" sectionId="falsefriends" />}
    </div>
  );
}

function StructureSection() {
  return (
    <div>
      <h2 style={S.secTitle}>Estrutura das Frases</h2>
      <p style={S.secDesc}>Core sentence patterns for A2. European Portuguese follows SVO order.</p>
      {SENTENCE_STRUCTURE.map((s, i) => <div key={i} style={S.card}><div style={{ ...S.tag('#4ecdc4'), marginBottom: '9px' }}>{s.pattern}</div><div style={{ fontFamily: 'monospace', fontSize: '15px', color: '#fff', marginBottom: '3px' }}>{s.example}</div><div style={{ fontSize: '12px', color: '#7a8a80' }}>{s.translation}</div></div>)}
      <div style={{ ...S.card, marginTop: '14px', background: 'rgba(0,200,117,0.04)' }}>
        <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '16px', color: '#fff', marginBottom: '9px' }}>EP-Specific Patterns</h3>
        <div style={{ fontSize: '13px', color: '#c0b8a8', lineHeight: 1.8 }}>
          <div><strong style={{ color: '#00c875' }}>Continuous:</strong> estar + a + infinitive → "Estou a comer" (not "Estou comendo")</div>
          <div><strong style={{ color: '#00c875' }}>Clitic placement:</strong> After verb: "Ele deu-me" / Before with negation: "Ele não me deu"</div>
          <div><strong style={{ color: '#00c875' }}>Mesoclisis (future):</strong> "Dir-lhe-ei amanhã" — unique to EP</div>
        </div>
      </div>
    </div>
  );
}

function PreteritoSection() {
  const [mode, setMode] = useState('explain');
  return (
    <div>
      <h2 style={S.secTitle}>Pretérito Perfeito vs Imperfeito</h2>
      <p style={S.secDesc}>The most important grammar distinction in Portuguese past tense. Most learners fail here at A2.</p>
      <div style={S.toggleRow}>
        <button style={S.navBtn(mode === 'explain')} onClick={() => setMode('explain')}>Explanation</button>
        <button style={S.navBtn(mode === 'practice')} onClick={() => setMode('practice')}>Practice</button>
      </div>
      {mode === 'explain' ? (
        <>
          <div style={{ ...S.card, background: 'rgba(0,200,117,0.04)', border: '1px solid rgba(0,200,117,0.15)', padding: '16px 18px', marginBottom: '14px' }}>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '17px', color: '#00c875', marginBottom: '10px' }}>Perfeito = Specific, Completed</h3>
            <p style={{ fontSize: '13px', color: '#c0b8a8', lineHeight: 1.6, marginBottom: '8px' }}>Use the <strong style={{ color: '#fff' }}>Pretérito Perfeito</strong> when:</p>
            <ul style={{ fontSize: '12px', color: '#7a8a80', lineHeight: 1.8, paddingLeft: '18px' }}>
              <li>The action happened at a <strong style={{ color: '#e8e6e1' }}>specific time</strong> (ontem, às três horas, no verão passado)</li>
              <li>The action is <strong style={{ color: '#e8e6e1' }}>completed</strong> — it has a clear beginning and end</li>
              <li>You're describing a <strong style={{ color: '#e8e6e1' }}>one-time event</strong></li>
            </ul>
            <p style={{ fontSize: '13px', color: '#00c875', fontFamily: 'monospace', marginTop: '10px' }}>Falei com ele ontem. (I spoke with him yesterday.)</p>
          </div>
          <div style={{ ...S.card, background: 'rgba(78,205,196,0.04)', border: '1px solid rgba(78,205,196,0.15)', padding: '16px 18px', marginBottom: '14px' }}>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '17px', color: '#4ecdc4', marginBottom: '10px' }}>Imperfeito = Ongoing, Habitual, Descriptive</h3>
            <p style={{ fontSize: '13px', color: '#c0b8a8', lineHeight: 1.6, marginBottom: '8px' }}>Use the <strong style={{ color: '#fff' }}>Pretérito Imperfeito</strong> when:</p>
            <ul style={{ fontSize: '12px', color: '#7a8a80', lineHeight: 1.8, paddingLeft: '18px' }}>
              <li>The action was <strong style={{ color: '#e8e6e1' }}>habitual</strong> or repeated (todos os dias, sempre)</li>
              <li>You're <strong style={{ color: '#e8e6e1' }}>describing</strong> what something was like in the past</li>
              <li>There's <strong style={{ color: '#e8e6e1' }}>no specific time</strong> mentioned</li>
              <li>Describing someone's <strong style={{ color: '#e8e6e1' }}>age, personality, or physical state</strong> in the past</li>
            </ul>
            <p style={{ fontSize: '13px', color: '#4ecdc4', fontFamily: 'monospace', marginTop: '10px' }}>Falava português todos os dias. (I used to speak Portuguese every day.)</p>
          </div>
          <div style={{ ...S.card, background: 'rgba(255,230,109,0.04)', border: '1px solid rgba(255,230,109,0.15)', padding: '16px 18px' }}>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '17px', color: '#ffe66d', marginBottom: '10px' }}>Key Signal Words</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              <span style={{ ...S.tag('#ffe66d') }}>Perfeito: ontem, às 3h, no verão passado, já, uma vez</span>
              <span style={{ ...S.tag('#4ecdc4') }}>Imperfeito: sempre, todos os dias, frequentemente, quando era novo</span>
            </div>
          </div>
        </>
      ) : (
        <div>
          {PRETERITO_EXERCISES.map(ex => (
            <div key={ex.id} style={{ ...S.card, padding: '14px 16px', marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', color: '#fff', marginBottom: '8px', fontFamily: 'monospace' }}>{ex.sentence}</div>
              <div style={{ fontSize: '11px', color: '#7a8a80', fontStyle: 'italic', marginBottom: '8px' }}>Hint: {ex.hint}</div>
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: '#00c875' }}>✓ Perfeito: <strong>{ex.correct_perfeito}</strong></span>
                <span style={{ fontSize: '12px', color: '#4ecdc4' }}>✓ Imperfeito: <strong>{ex.correct_imperfeito}</strong></span>
              </div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '8px', fontStyle: 'italic', lineHeight: 1.5 }}>{ex.explanation}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SerEstarSection() {
  return (
    <div>
      <h2 style={S.secTitle}>Ser vs Estar</h2>
      <p style={S.secDesc}>The most important distinction in Portuguese. Both mean "to be" but are used differently.</p>
      <div style={{ ...S.card, background: 'rgba(0,200,117,0.04)', border: '1px solid rgba(0,200,117,0.15)', padding: '14px 16px', marginBottom: '14px' }}>
        <p style={{ fontSize: '13px', color: '#c0b8a8', lineHeight: 1.6, marginBottom: '10px' }}><strong style={{ color: '#00c875' }}>SER</strong> = permanent, identity, origin, time, profession, essential characteristics</p>
        <p style={{ fontSize: '13px', color: '#c0b8a8', lineHeight: 1.6 }}><strong style={{ color: '#4ecdc4' }}>ESTAR</strong> = temporary states, location, ongoing actions, conditions that can change</p>
      </div>
      {SER_ESTAR_SCENARIOS.map(s => <ScenarioCard key={s.id} {...s} />)}
    </div>
  );
}

function EscritaSection() {
  return (
    <div>
      <h2 style={S.secTitle}>Escrita — Prática CIPLE</h2>
      <p style={S.secDesc}>CIPLE-style writing tasks. Read the task, write your answer, then check the model.</p>
      {WRITING_TASKS.map(t => <WritingTask key={t.id} task={t} />)}
    </div>
  );
}

function OralSection() {
  return (
    <div>
      <h2 style={S.secTitle}>Oral — Diálogos para Praticar</h2>
      <p style={S.secDesc}>Read the dialogues aloud, then try to say the lines yourself. Shadowing is the fastest way to improve pronunciation.</p>
      {ORAL_DIALOGUES.map(d => <OralDialogue key={d.id} dialogue={d} />)}
    </div>
  );
}

function EscutaSection() {
  return (
    <div>
      <h2 style={S.secTitle}>Escuta — Recursos de Audio</h2>
      <p style={S.secDesc}>Curated EP listening resources. Click to open and listen, then try the transcript toggle to check your understanding.</p>
      {LISTENING_RESOURCES.map(item => <ListeningItem key={item.id} item={item} />)}
    </div>
  );
}

function GlossarySection() {
  const [filter, setFilter] = useState('');
  const filtered = GLOSSARY_TERMS.filter(t => t.term.toLowerCase().includes(filter.toLowerCase()) || t.category.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div>
      <h2 style={S.secTitle}>Glossário — Grammar Terms</h2>
      <p style={S.secDesc}>Plain-English explanations of Portuguese grammar terminology. Tap any term to expand.</p>
      <div style={{ marginBottom: '14px' }}>
        <input style={{ ...S.input, width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: '8px' }} placeholder="Search terms..." value={filter} onChange={e => setFilter(e.target.value)} />
      </div>
      {filtered.map((t, i) => <GlossaryEntry key={i} term={t} />)}
      {filtered.length === 0 && <div style={{ ...S.card, textAlign: 'center', color: '#7a8a80' }}>No terms match your search.</div>}
    </div>
  );
}

// ─── SECTION MAP ────────────────────────────────────────────────────────────────

const SECTION_MAP = {
  verbs25: Verbs25Section, conjugation: ConjugationSection, pronouns: PronounsSection,
  adjectives: AdjectivesSection, prepositions: PrepositionsSection, articles: ArticlesSection,
  vocabulary: VocabularySection, modals: ModalsSection, idioms: IdiomsSection,
  falsefriends: FalseFriendsSection, structure: StructureSection, preterito: PreteritoSection,
  serestar: SerEstarSection, escrita: EscritaSection, oral: OralSection,
  escuta: EscutaSection, glossary: GlossarySection, progresso: ProgressSection,
};

// ─── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [section, setSection] = useState('verbs25');
  const SectionComp = SECTION_MAP[section] || Verbs25Section;

  useEffect(() => {
    try {
      const prev = parseInt(localStorage.getItem('sessions') || '0', 10);
      localStorage.setItem('sessions', String(prev + 1));
    } catch {}
  }, []);

  return (
    <div style={S.app}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0}body{background:#0a0f0d;min-height:100vh}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:rgba(255,255,255,0.03)}::-webkit-scrollbar-thumb{background:rgba(0,200,117,0.2);border-radius:3px}::selection{background:rgba(0,200,117,0.3);color:#fff}`}</style>
      <div style={{ position:'fixed', top:'-50%', left:'-20%', width:'80%', height:'100%', background:'radial-gradient(ellipse, rgba(0,200,117,0.03) 0%, transparent 60%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:'-40%', right:'-20%', width:'70%', height:'100%', background:'radial-gradient(ellipse, rgba(78,205,196,0.02) 0%, transparent 60%)', pointerEvents:'none', zIndex:0 }} />
      <header style={S.header}>
        <h1 style={S.title}>PT Learner</h1>
        <p style={S.subtitle}>Português Europeu A2 · CIPLE Prep</p>
      </header>
      <nav style={S.nav}>
        {SECTIONS.map(s => <button key={s.id} style={S.navBtn(section === s.id)} onClick={() => setSection(s.id)}><span>{s.icon}</span> {s.label}</button>)}
      </nav>
      <main style={S.content}>
        <SectionComp />
      </main>
    </div>
  );
}
