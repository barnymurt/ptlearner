import React, { useState, useCallback, useEffect, useMemo } from 'react';

const TOP_25_VERBS = [
  { verb: "ser", meaning: "to be (permanent)", conj: ["sou","és","é","somos","sois","são"], conjEn: ["am","are","is","are","are","are"] },
  { verb: "estar", meaning: "to be (temporary)", conj: ["estou","estás","está","estamos","estais","estão"], conjEn: ["am","are","is","are","are","are"] },
  { verb: "ter", meaning: "to have", conj: ["tenho","tens","tem","temos","tendes","têm"], conjEn: ["have","have","has","have","have","have"] },
  { verb: "fazer", meaning: "to do/make", conj: ["faço","fazes","faz","fazemos","fazeis","fazem"], conjEn: ["do","do","does","do","do","do"] },
  { verb: "ir", meaning: "to go", conj: ["vou","vais","vai","vamos","ides","vão"], conjEn: ["go","go","goes","go","go","go"] },
  { verb: "poder", meaning: "to be able to", conj: ["posso","podes","pode","podemos","podeis","podem"], conjEn: ["can","can","can","can","can","can"] },
  { verb: "dizer", meaning: "to say", conj: ["digo","dizes","diz","dizemos","dizeis","dizem"], conjEn: ["say","say","says","say","say","say"] },
  { verb: "dar", meaning: "to give", conj: ["dou","dás","dá","damos","dais","dão"], conjEn: ["give","give","gives","give","give","give"] },
  { verb: "saber", meaning: "to know (facts)", conj: ["sei","sabes","sabe","sabemos","sabeis","sabem"], conjEn: ["know","know","knows","know","know","know"] },
  { verb: "querer", meaning: "to want", conj: ["quero","queres","quer","queremos","quereis","querem"], conjEn: ["want","want","wants","want","want","want"] },
  { verb: "ver", meaning: "to see", conj: ["vejo","vês","vê","vemos","vedes","veem"], conjEn: ["see","see","sees","see","see","see"] },
  { verb: "vir", meaning: "to come", conj: ["venho","vens","vem","vimos","vindes","vêm"], conjEn: ["come","come","comes","come","come","come"] },
  { verb: "falar", meaning: "to speak", conj: ["falo","falas","fala","falamos","falais","falam"], conjEn: ["speak","speak","speaks","speak","speak","speak"] },
  { verb: "comer", meaning: "to eat", conj: ["como","comes","come","comemos","comeis","comem"], conjEn: ["eat","eat","eats","eat","eat","eat"] },
  { verb: "viver", meaning: "to live", conj: ["vivo","vives","vive","vivemos","viveis","vivem"], conjEn: ["live","live","lives","live","live","live"] },
  { verb: "trabalhar", meaning: "to work", conj: ["trabalho","trabalhas","trabalha","trabalhamos","trabalhais","trabalham"], conjEn: ["work","work","works","work","work","work"] },
  { verb: "precisar", meaning: "to need", conj: ["preciso","precisas","precisa","precisamos","precisais","precisam"], conjEn: ["need","need","needs","need","need","need"] },
  { verb: "encontrar", meaning: "to find", conj: ["encontro","encontras","encontra","encontramos","encontrais","encontram"], conjEn: ["find","find","finds","find","find","find"] },
  { verb: "pôr", meaning: "to put", conj: ["ponho","pões","põe","pomos","pondes","põem"], conjEn: ["put","put","puts","put","put","put"] },
  { verb: "ficar", meaning: "to stay/become", conj: ["fico","ficas","fica","ficamos","ficais","ficam"], conjEn: ["stay","stay","stays","stay","stay","stay"] },
  { verb: "dever", meaning: "to owe/should", conj: ["devo","deves","deve","devemos","deveis","devem"], conjEn: ["must","must","must","must","must","must"] },
  { verb: "trazer", meaning: "to bring", conj: ["trago","trazes","traz","trazemos","trazeis","trazem"], conjEn: ["bring","bring","brings","bring","bring","bring"] },
  { verb: "esperar", meaning: "to wait/hope", conj: ["espero","esperas","espera","esperamos","esperais","esperam"], conjEn: ["wait","wait","waits","wait","wait","wait"] },
  { verb: "beber", meaning: "to drink", conj: ["bebo","bebes","bebe","bebemos","bebeis","bebem"], conjEn: ["drink","drink","drinks","drink","drink","drink"] },
  { verb: "conhecer", meaning: "to know (people)", conj: ["conheço","conheces","conhece","conhecemos","conheceis","conhecem"], conjEn: ["know","know","knows","know","know","know"] },
];

const PRONOUNS = ["eu","tu","ele/ela","nós","vós","eles/elas"];

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
  { sentence: "O gato está ___ a cama.", sentenceEn: "The cat is ___ the bed.", answer: "em", hint: "location: on/in" },
  { sentence: "Vamos viajar ___ carro amanhã.", sentenceEn: "We are going to travel ___ car tomorrow.", answer: "de", hint: "means of transport" },
  { sentence: "Ela falou muito ___ o problema.", sentenceEn: "She talked a lot ___ the problem.", answer: "sobre", hint: "about a topic" },
  { sentence: "O livro foi escrito ___ uma autora famosa.", sentenceEn: "The book was written ___ a famous author.", answer: "por", hint: "by someone" },
  { sentence: "Eles estão ___ o parque.", sentenceEn: "They are ___ the park.", answer: "no", hint: "at a place (em + o)" },
  { sentence: "Ele saiu ___ casa muito cedo.", sentenceEn: "He left ___ home very early.", answer: "de", hint: "from a place" },
  { sentence: "Chegámos ___ aeroporto atrasados.", sentenceEn: "We arrived ___ the airport late.", answer: "ao", hint: "to a place (a + o)" },
  { sentence: "Posso contar ___ você?", sentenceEn: "Can I count ___ you?", answer: "com", hint: "rely on someone" },
  { sentence: "Este café é feito ___ leite.", sentenceEn: "This coffee is made ___ milk.", answer: "com", hint: "made with" },
  { sentence: "Vou mandar este e-mail ___ meu chefe.", sentenceEn: "I'm going to send this email ___ my boss.", answer: "para", hint: "to someone (destination)" },
  { sentence: "Ele passou ___ o túnel rapidamente.", sentenceEn: "He passed ___ the tunnel quickly.", answer: "por", hint: "through a place" },
  { sentence: "Hoje estou ___ paciência para isso.", sentenceEn: "Today I am ___ patience for this.", answer: "sem", hint: "without" },
  { sentence: "A loja fica ___ a farmácia e o banco.", sentenceEn: "The store is ___ the pharmacy and the bank.", answer: "entre", hint: "between two things" },
  { sentence: "Vou estudar ___ às dez horas.", sentenceEn: "I am going to study ___ ten o'clock.", answer: "até", hint: "until a time" },
  { sentence: "Ela pôs o livro ___ a mesa.", sentenceEn: "She put the book ___ the table.", answer: "sobre", hint: "on top of" },
  { sentence: "Isto é ___ ti.", sentenceEn: "This is ___ you.", answer: "para", hint: "for someone" },
  { sentence: "Estou ___ Lisboa há dois anos.", sentenceEn: "I have been ___ Lisbon for two years.", answer: "em", hint: "in a city" },
  { sentence: "Ele foi ___ Portugal no verão.", sentenceEn: "He went ___ Portugal in the summer.", answer: "a", hint: "to (a country)" },
  { sentence: "O comboio passa ___ aqui.", sentenceEn: "The train passes ___ here.", answer: "por", hint: "passes through" },
  { sentence: "Não consigo viver ___ música.", sentenceEn: "I can't live ___ music.", answer: "sem", hint: "without something" },
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

const ALL_VERBS = [
["abandonar","to abandon","-ar"],["abastecer","to supply","-er"],["abdicar","to abdicate","-ar"],["abolir","to abolish","-ir"],["aborrecer","to annoy/bore","-er"],["abraçar","to hug","-ar"],["abrandar","to slow down","-ar"],["abreviar","to abbreviate","-ar"],["abrigar","to shelter","-ar"],["abrir","to open","-ir"],["absorver","to absorb","-er"],["abster-se","to abstain","-er"],["abusar","to abuse","-ar"],["acabar","to finish","-ar"],["acalmar","to calm","-ar"],["acampar","to camp","-ar"],["acariciar","to caress","-ar"],["aceitar","to accept","-ar"],["acender","to light/turn on","-er"],["acentuar","to accentuate","-ar"],["acertar","to get right","-ar"],["achar","to find/think","-ar"],["acidentar","to have an accident","-ar"],["aclamar","to acclaim","-ar"],["acolher","to welcome","-er"],["acomodar","to accommodate","-ar"],["acompanhar","to accompany","-ar"],["aconselhar","to advise","-ar"],["acontecer","to happen","-er"],["acordar","to wake up/agree","-ar"],["acostumar","to get used to","-ar"],["acreditar","to believe","-ar"],["acrescentar","to add","-ar"],["acudir","to rush to help","-ir"],["acumular","to accumulate","-ar"],["acusar","to accuse","-ar"],["adaptar","to adapt","-ar"],["adicionar","to add","-ar"],["adiar","to postpone","-ar"],["adivinhar","to guess","-ar"],["administrar","to manage","-ar"],["admirar","to admire","-ar"],["admitir","to admit","-ir"],["adoecer","to fall ill","-er"],["adorar","to adore","-ar"],["adormecer","to fall asleep","-er"],["adotar","to adopt","-ar"],["adquirir","to acquire","-ir"],["advertir","to warn","-ir"],["afastar","to move away","-ar"],["afetar","to affect","-ar"],["afirmar","to affirm","-ar"],["afligir","to afflict","-ir"],["afogar","to drown","-ar"],["agarrar","to grab","-ar"],["agir","to act","-ir"],["agitar","to shake/agitate","-ar"],["agradar","to please","-ar"],["agradecer","to thank","-er"],["agravar","to worsen","-ar"],["agredir","to assault","-ir"],["agrupar","to group","-ar"],["aguentar","to endure","-ar"],["ajudar","to help","-ar"],["ajustar","to adjust","-ar"],["alargar","to widen","-ar"],["alcançar","to reach/achieve","-ar"],["alegrar","to cheer up","-ar"],["alertar","to alert","-ar"],["alimentar","to feed","-ar"],["alinhar","to align","-ar"],["aliviar","to relieve","-ar"],["almoçar","to have lunch","-ar"],["alugar","to rent","-ar"],["amar","to love","-ar"],["ameaçar","to threaten","-ar"],["amolecer","to soften","-er"],["ampliar","to expand","-ar"],["analisar","to analyse","-ar"],["andar","to walk/go","-ar"],["animar","to encourage","-ar"],["aniquilar","to annihilate","-ar"],["anotar","to note down","-ar"],["antecipar","to anticipate","-ar"],["anular","to cancel/annul","-ar"],["anunciar","to announce","-ar"],["apagar","to erase/turn off","-ar"],["apanhar","to catch/pick up","-ar"],["aparecer","to appear","-er"],["aparentar","to seem","-ar"],["apassivar","to make passive","-ar"],["apelar","to appeal","-ar"],["apertar","to tighten","-ar"],["aplicar","to apply","-ar"],["apoiar","to support","-ar"],["apontar","to point","-ar"],["apreciar","to appreciate","-ar"],["aprender","to learn","-er"],["apresentar","to present","-ar"],["apressar","to hurry","-ar"],["aprovar","to approve","-ar"],["aproveitar","to take advantage","-ar"],["aproximar","to bring closer","-ar"],["arrancar","to pull out/start","-ar"],["arranjar","to arrange/fix","-ar"],["arrastar","to drag","-ar"],["arrecadar","to collect","-ar"],["arrepender-se","to regret","-er"],["arriscar","to risk","-ar"],["arruinar","to ruin","-ar"],["arrumar","to tidy up","-ar"],["aspirar","to aspire/vacuum","-ar"],["assaltar","to assault/rob","-ar"],["assassinar","to murder","-ar"],["assegurar","to ensure","-ar"],["assinalar","to mark/signal","-ar"],["assinar","to sign","-ar"],["assistir","to watch/attend","-ir"],["associar","to associate","-ar"],["assustar","to scare","-ar"],["assumir","to assume","-ir"],["atacar","to attack","-ar"],["atar","to tie","-ar"],["atingir","to reach/hit","-ir"],["atrair","to attract","irr"],["atrasar","to delay","-ar"],["atravessar","to cross","-ar"],["atrever-se","to dare","-er"],["atribuir","to attribute","-ir"],["atualizar","to update","-ar"],["atuar","to act/perform","-ar"],["aumentar","to increase","-ar"],["autorizar","to authorize","-ar"],["avaliar","to evaluate","-ar"],["avançar","to advance","-ar"],["avisar","to warn/notify","-ar"],["baixar","to lower/download","-ar"],["balançar","to swing/balance","-ar"],["banhar","to bathe","-ar"],["baralhar","to shuffle/confuse","-ar"],["basear","to base","-ar"],["bater","to hit/knock","-er"],["batizar","to baptize","-ar"],["beber","to drink","-er"],["beneficiar","to benefit","-ar"],["bloquear","to block","-ar"],["borbulhar","to bubble","-ar"],["bordar","to embroider","-ar"],["brilhar","to shine","-ar"],["brincar","to play (children)","-ar"],["bronzear","to tan","-ar"],["buscar","to look for/fetch","-ar"],["caber","to fit","irr"],["caçar","to hunt","-ar"],["cair","to fall","irr"],["calar","to silence/shut up","-ar"],["calcular","to calculate","-ar"],["calhar","to happen to","-ar"],["caminhar","to walk/hike","-ar"],["cancelar","to cancel","-ar"],["cansar","to tire","-ar"],["cantar","to sing","-ar"],["capturar","to capture","-ar"],["caracterizar","to characterize","-ar"],["carregar","to carry/charge","-ar"],["casar","to marry","-ar"],["castigar","to punish","-ar"],["causar","to cause","-ar"],["cavar","to dig","-ar"],["cear","to have supper","-ar"],["ceder","to yield/give in","-er"],["celebrar","to celebrate","-ar"],["censurar","to censor","-ar"],["certificar","to certify","-ar"],["chatear","to annoy/bore","-ar"],["chegar","to arrive","-ar"],["cheirar","to smell","-ar"],["chocar","to shock/crash","-ar"],["chorar","to cry","-ar"],["chover","to rain","-er"],["chutar","to kick","-ar"],["circular","to circulate","-ar"],["citar","to quote","-ar"],["clarificar","to clarify","-ar"],["classificar","to classify","-ar"],["cobrar","to charge (money)","-ar"],["cobrir","to cover","-ir"],["coçar","to scratch","-ar"],["coincidir","to coincide","-ir"],["colaborar","to collaborate","-ar"],["colar","to glue/stick","-ar"],["colecionar","to collect","-ar"],["colocar","to place/put","-ar"],["colorir","to colour","-ir"],["combater","to combat","-er"],["combinar","to combine/arrange","-ar"],["começar","to start","-ar"],["comentar","to comment","-ar"],["comer","to eat","-er"],["comercializar","to commercialize","-ar"],["cometer","to commit","-er"],["comparar","to compare","-ar"],["comparecer","to attend/appear","-er"],["compartilhar","to share","-ar"],["compensar","to compensate","-ar"],["competir","to compete","-ir"],["complementar","to complement","-ar"],["completar","to complete","-ar"],["complicar","to complicate","-ar"],["compor","to compose","irr"],["comportar-se","to behave","-ar"],["comprar","to buy","-ar"],["compreender","to understand","-er"],["comprometer","to compromise","-er"],["comprovar","to prove","-ar"],["comunicar","to communicate","-ar"],["conceber","to conceive","-er"],["conceder","to grant","-er"],["concentrar","to concentrate","-ar"],["concluir","to conclude","-ir"],["concordar","to agree","-ar"],["concorrer","to compete","-er"],["condenar","to condemn","-ar"],["conduzir","to drive/lead","-ir"],["conferir","to check/verify","-ir"],["confessar","to confess","-ar"],["confiar","to trust","-ar"],["confirmar","to confirm","-ar"],["confundir","to confuse","-ir"],["conhecer","to know (people)","-er"],["conjugar","to conjugate","-ar"],["conquistar","to conquer","-ar"],["conseguir","to manage/achieve","-ir"],["consentir","to consent","-ir"],["conservar","to preserve","-ar"],["considerar","to consider","-ar"],["consistir","to consist","-ir"],["consolar","to console","-ar"],["consolidar","to consolidate","-ar"],["constar","to record/consist of","-ar"],["constatar","to verify","-ar"],["constituir","to constitute","-ir"],["construir","to build","-ir"],["consultar","to consult","-ar"],["consumir","to consume","-ir"],["contactar","to contact","-ar"],["contagiar","to infect","-ar"],["contaminar","to contaminate","-ar"],["contar","to tell/count","-ar"],["contemplar","to contemplate","-ar"],["conter","to contain","irr"],["contestar","to contest","-ar"],["continuar","to continue","-ar"],["contradizer","to contradict","irr"],["contrair","to contract","irr"],["contratar","to hire","-ar"],["contribuir","to contribute","-ir"],["controlar","to control","-ar"],["convencer","to convince","-er"],["convergir","to converge","-ir"],["conversar","to chat/converse","-ar"],["converter","to convert","-er"],["convidar","to invite","-ar"],["conviver","to coexist","-er"],["convocar","to summon","-ar"],["cooperar","to cooperate","-ar"],["coordenar","to coordinate","-ar"],["copiar","to copy","-ar"],["correr","to run","-er"],["corresponder","to match/correspond","-er"],["corrigir","to correct","-ir"],["corromper","to corrupt","-er"],["cortar","to cut","-ar"],["costumar","to usually do","-ar"],["costurar","to sew","-ar"],["cozer","to boil/cook","-er"],["cozinhar","to cook","-ar"],["crescer","to grow","-er"],["criar","to create/raise","-ar"],["criticar","to criticize","-ar"],["cruzar","to cross","-ar"],["cuidar","to care for","-ar"],["culminar","to culminate","-ar"],["cultivar","to cultivate","-ar"],["cumprir","to fulfil","-ir"],["curar","to cure","-ar"],["cursar","to study (a course)","-ar"],["curvar","to curve/bend","-ar"],["cuspir","to spit","-ir"],["custar","to cost","-ar"],["dançar","to dance","-ar"],["dar","to give","irr"],["debater","to debate","-er"],["decidir","to decide","-ir"],["declarar","to declare","-ar"],["declinar","to decline","-ar"],["decorar","to decorate/memorize","-ar"],["decorrer","to take place","-er"],["dedicar","to dedicate","-ar"],["deduzir","to deduce","-ir"],["defender","to defend","-er"],["definir","to define","-ir"],["deitar","to lay down/throw away","-ar"],["deixar","to leave/let","-ar"],["delegar","to delegate","-ar"],["demorar","to take long","-ar"],["demonstrar","to demonstrate","-ar"],["denunciar","to denounce","-ar"],["depender","to depend","-er"],["depositar","to deposit","-ar"],["deprimir","to depress","-ir"],["derivar","to derive","-ar"],["derramar","to spill","-ar"],["derrotar","to defeat","-ar"],["desabafar","to vent","-ar"],["desafiar","to challenge","-ar"],["desagradar","to displease","-ar"],["desaparecer","to disappear","-er"],["desarmar","to disarm","-ar"],["descansar","to rest","-ar"],["descarregar","to unload/download","-ar"],["descer","to go down/descend","-er"],["descobrir","to discover","-ir"],["desconfiar","to suspect","-ar"],["descrever","to describe","-er"],["desculpar","to excuse","-ar"],["desejar","to wish/desire","-ar"],["desempenhar","to perform/play a role","-ar"],["desenhar","to draw","-ar"],["desenvolver","to develop","-er"],["desertar","to desert","-ar"],["desesperar","to despair","-ar"],["desistir","to give up","-ir"],["desligar","to turn off/disconnect","-ar"],["deslocar","to move/displace","-ar"],["desmontar","to dismantle","-ar"],["desobedecer","to disobey","-er"],["despedir","to fire/say goodbye","-ir"],["desperdiçar","to waste","-ar"],["despertar","to awaken","-ar"],["despir","to undress","-ir"],["destacar","to highlight","-ar"],["destinar","to destine","-ar"],["destruir","to destroy","-ir"],["desviar","to divert/deviate","-ar"],["detestar","to detest","-ar"],["determinar","to determine","-ar"],["dever","should/must/owe","-er"],["devolver","to return (give back)","-er"],["diagnosticar","to diagnose","-ar"],["ditar","to dictate","-ar"],["diferenciar","to differentiate","-ar"],["dificultar","to hinder","-ar"],["difundir","to spread","-ir"],["digerir","to digest","-ir"],["diminuir","to decrease","-ir"],["dirigir","to direct/drive","-ir"],["disciplinar","to discipline","-ar"],["discordar","to disagree","-ar"],["discriminar","to discriminate","-ar"],["discursar","to give a speech","-ar"],["discutir","to discuss/argue","-ir"],["disfarçar","to disguise","-ar"],["dispensar","to dispense/excuse","-ar"],["disponibilizar","to make available","-ar"],["dispor","to arrange/dispose","irr"],["disputar","to dispute","-ar"],["dissolver","to dissolve","-er"],["distinguir","to distinguish","-ir"],["distribuir","to distribute","-ir"],["divertir","to amuse","-ir"],["dividir","to divide","-ir"],["divorciar","to divorce","-ar"],["divulgar","to disclose/publicize","-ar"],["dizer","to say","irr"],["doar","to donate","-ar"],["dobrar","to fold/double","-ar"],["documentar","to document","-ar"],["doer","to hurt/ache","-er"],["dominar","to dominate","-ar"],["dormir","to sleep","-ir"],["dourar","to gild/brown","-ar"],["duvidar","to doubt","-ar"],["durar","to last","-ar"],["economizar","to save (money)","-ar"],["edificar","to build/edify","-ar"],["editar","to edit","-ar"],["educar","to educate","-ar"],["efetuar","to carry out","-ar"],["elaborar","to elaborate","-ar"],["eleger","to elect","-er"],["elevar","to elevate","-ar"],["eliminar","to eliminate","-ar"],["embarcar","to board/embark","-ar"],["emitir","to emit/broadcast","-ir"],["emocionar","to move (emotionally)","-ar"],["empacotar","to pack","-ar"],["empenhar-se","to commit/strive","-ar"],["empolgar","to excite/grip","-ar"],["empreender","to undertake","-er"],["empregar","to employ","-ar"],["empurrar","to push","-ar"],["encantar","to enchant","-ar"],["encerrar","to close/end","-ar"],["encher","to fill","-er"],["encomendar","to order (goods)","-ar"],["encontrar","to find/meet","-ar"],["encorajar","to encourage","-ar"],["endurecer","to harden","-er"],["enfraquecer","to weaken","-er"],["enfrentar","to face/confront","-ar"],["enganar","to deceive","-ar"],["engolir","to swallow","-ir"],["engordar","to gain weight","-ar"],["enlouquecer","to go crazy","-er"],["enriquecer","to enrich","-er"],["ensaiar","to rehearse","-ar"],["ensinar","to teach","-ar"],["entender","to understand","-er"],["enterrar","to bury","-ar"],["entrar","to enter","-ar"],["entregar","to deliver/hand over","-ar"],["entrevistar","to interview","-ar"],["entristecer","to sadden","-er"],["envelhecer","to age","-er"],["envergonhar","to embarrass","-ar"],["enviar","to send","-ar"],["envolver","to involve","-er"],["equilibrar","to balance","-ar"],["equipar","to equip","-ar"],["erguer","to raise/lift","-er"],["errar","to err/make a mistake","-ar"],["escapar","to escape","-ar"],["esclarecer","to clarify","-er"],["escolher","to choose","-er"],["esconder","to hide","-er"],["escrever","to write","-er"],["escutar","to listen","-ar"],["esfolar","to skin/scrape","-ar"],["esforçar-se","to make an effort","-ar"],["esgotar","to exhaust/run out","-ar"],["esmagar","to crush","-ar"],["espantar","to amaze/scare","-ar"],["esperar","to wait/hope","-ar"],["espirrar","to sneeze","-ar"],["esquecer","to forget","-er"],["estabelecer","to establish","-er"],["estacionar","to park","-ar"],["estar","to be (temporary)","irr"],["estender","to extend/stretch","-er"],["estimular","to stimulate","-ar"],["estipular","to stipulate","-ar"],["esticar","to stretch","-ar"],["estimar","to estimate/esteem","-ar"],["estragar","to damage/spoil","-ar"],["estranhar","to find strange","-ar"],["estrear","to debut/premiere","-ar"],["estudar","to study","-ar"],["evacuar","to evacuate","-ar"],["evitar","to avoid","-ar"],["evocar","to evoke","-ar"],["evoluir","to evolve","-ir"],["exagerar","to exaggerate","-ar"],["examinar","to examine","-ar"],["exceder","to exceed","-er"],["exclamar","to exclaim","-ar"],["excluir","to exclude","-ir"],["executar","to execute","-ar"],["exercer","to exercise/practise","-er"],["exercitar","to exercise","-ar"],["exibir","to exhibit","-ir"],["exigir","to demand","-ir"],["existir","to exist","-ir"],["expandir","to expand","-ir"],["experimentar","to try/experiment","-ar"],["explicar","to explain","-ar"],["explorar","to explore","-ar"],["exportar","to export","-ar"],["expor","to expose","irr"],["expressar","to express","-ar"],["expulsar","to expel","-ar"],["extrair","to extract","irr"],["fabricar","to manufacture","-ar"],["facilitar","to facilitate","-ar"],["falhar","to fail","-ar"],["falar","to speak","-ar"],["falsificar","to falsify","-ar"],["faltar","to be missing/lack","-ar"],["fascinar","to fascinate","-ar"],["favorecer","to favour","-er"],["fazer","to do/make","irr"],["fechar","to close","-ar"],["felicitar","to congratulate","-ar"],["ferir","to wound","-ir"],["ferver","to boil","-er"],["festejar","to celebrate/party","-ar"],["ficar","to stay/become","-ar"],["filmar","to film","-ar"],["filtrar","to filter","-ar"],["financiar","to finance","-ar"],["fingir","to pretend","-ir"],["fixar","to fix/set","-ar"],["florescer","to flourish","-er"],["fluir","to flow","-ir"],["focar","to focus","-ar"],["folhear","to leaf through","-ar"],["forçar","to force","-ar"],["formar","to form/train","-ar"],["formular","to formulate","-ar"],["fornecer","to supply/provide","-er"],["fortalecer","to strengthen","-er"],["fotografar","to photograph","-ar"],["frear","to brake","-ar"],["frequentar","to attend/frequent","-ar"],["fritar","to fry","-ar"],["frustrar","to frustrate","-ar"],["fugir","to flee","-ir"],["fumar","to smoke","-ar"],["funcionar","to function/work","-ar"],["fundar","to found","-ar"],["fundir","to melt/merge","-ir"],["furar","to pierce/drill","-ar"],["furtar","to steal","-ar"],["gabar-se","to boast","-ar"],["ganhar","to win/earn","-ar"],["garantir","to guarantee","-ir"],["gastar","to spend (money)","-ar"],["gemer","to groan","-er"],["generalizar","to generalize","-ar"],["gerar","to generate","-ar"],["gerir","to manage","-ir"],["glorificar","to glorify","-ar"],["gostar","to like","-ar"],["governar","to govern","-ar"],["gravar","to record/engrave","-ar"],["gritar","to shout","-ar"],["guardar","to keep/store","-ar"],["guiar","to guide","-ar"],["habitar","to inhabit","-ar"],["habituar","to accustom","-ar"],["harmonizar","to harmonize","-ar"],["herdar","to inherit","-ar"],["hesitar","to hesitate","-ar"],["hidratar","to hydrate","-ar"],["homenagear","to honour/pay tribute","-ar"],["honrar","to honour","-ar"],["hospedar","to host","-ar"],["humilhar","to humiliate","-ar"],["identificar","to identify","-ar"],["ignorar","to ignore","-ar"],["iluminar","to illuminate","-ar"],["ilustrar","to illustrate","-ar"],["imaginar","to imagine","-ar"],["imigrar","to immigrate","-ar"],["imitar","to imitate","-ar"],["impedir","to prevent","-ir"],["implicar","to imply/involve","-ar"],["impor","to impose","irr"],["importar","to import/matter","-ar"],["impressionar","to impress","-ar"],["imprimir","to print","-ir"],["improvisar","to improvise","-ar"],["inaugurar","to inaugurate","-ar"],["inchar","to swell","-ar"],["incluir","to include","-ir"],["incorporar","to incorporate","-ar"],["indicar","to indicate","-ar"],["indignar","to outrage","-ar"],["induzir","to induce","-ir"],["infectar","to infect","-ar"],["influenciar","to influence","-ar"],["informar","to inform","-ar"],["iniciar","to initiate/start","-ar"],["injetar","to inject","-ar"],["inovar","to innovate","-ar"],["inscrever","to enrol/register","-er"],["inserir","to insert","-ir"],["insinuar","to insinuate","-ar"],["insistir","to insist","-ir"],["inspecionar","to inspect","-ar"],["inspirar","to inspire","-ar"],["instalar","to install","-ar"],["instruir","to instruct","-ir"],["insultar","to insult","-ar"],["integrar","to integrate","-ar"],["interessar","to interest","-ar"],["interligar","to interconnect","-ar"],["interpretar","to interpret","-ar"],["interrogar","to interrogate","-ar"],["interromper","to interrupt","-er"],["intervir","to intervene","irr"],["intimidar","to intimidate","-ar"],["introduzir","to introduce","-ir"],["invadir","to invade","-ir"],["inventar","to invent","-ar"],["investigar","to investigate","-ar"],["investir","to invest","-ir"],["ir","to go","irr"],["irritar","to irritate","-ar"],["isolar","to isolate","-ar"],["jantar","to have dinner","-ar"],["jogar","to play (game/sport)","-ar"],["julgar","to judge","-ar"],["juntar","to join/gather","-ar"],["jurar","to swear","-ar"],["justificar","to justify","-ar"],["lamentar","to regret/lament","-ar"],["lançar","to launch/throw","-ar"],["largar","to let go/drop","-ar"],["lavar","to wash","-ar"],["legalizar","to legalize","-ar"],["legislar","to legislate","-ar"],["legitimar","to legitimize","-ar"],["ler","to read","irr"],["levantar","to raise/get up","-ar"],["levar","to take/carry","-ar"],["libertar","to liberate","-ar"],["lidar","to deal with","-ar"],["liderar","to lead","-ar"],["ligar","to turn on/connect/call","-ar"],["limitar","to limit","-ar"],["limpar","to clean","-ar"],["localizar","to locate","-ar"],["lutar","to fight/struggle","-ar"],["machucar","to hurt/bruise","-ar"],["maldizer","to curse/badmouth","irr"],["maltratar","to mistreat","-ar"],["manchar","to stain","-ar"],["mandar","to send/order","-ar"],["manifestar","to manifest","-ar"],["manipular","to manipulate","-ar"],["manter","to maintain","irr"],["marcar","to mark/book","-ar"],["marchar","to march","-ar"],["mastigar","to chew","-ar"],["matar","to kill","-ar"],["matricular","to enrol","-ar"],["mediar","to mediate","-ar"],["medicar","to medicate","-ar"],["medir","to measure","-ir"],["melhorar","to improve","-ar"],["mencionar","to mention","-ar"],["mentir","to lie","-ir"],["merecer","to deserve","-er"],["mergulhar","to dive","-ar"],["meter","to put/insert","-er"],["mexer","to move/stir","-er"],["migrar","to migrate","-ar"],["misturar","to mix","-ar"],["mobilizar","to mobilize","-ar"],["modelar","to model","-ar"],["moderar","to moderate","-ar"],["modernizar","to modernize","-ar"],["modificar","to modify","-ar"],["moer","to grind","irr"],["molestar","to bother/molest","-ar"],["molhar","to wet","-ar"],["montar","to assemble/ride","-ar"],["morar","to live/reside","-ar"],["morder","to bite","-er"],["morrer","to die","-er"],["mostrar","to show","-ar"],["motivar","to motivate","-ar"],["mover","to move","-er"],["mudar","to change/move","-ar"],["multiplicar","to multiply","-ar"],["murmurar","to murmur","-ar"],["nadar","to swim","-ar"],["namorar","to date/court","-ar"],["narrar","to narrate","-ar"],["nascer","to be born","-er"],["navegar","to navigate/sail","-ar"],["necessitar","to need","-ar"],["negar","to deny","-ar"],["negociar","to negotiate","-ar"],["nevar","to snow","-ar"],["nomear","to nominate/name","-ar"],["normalizar","to normalize","-ar"],["notar","to notice","-ar"],["notificar","to notify","-ar"],["numerar","to number","-ar"],["nutrir","to nourish","-ir"],["obedecer","to obey","-er"],["objetivar","to objectify","-ar"],["obrigar","to force/oblige","-ar"],["observar","to observe","-ar"],["obter","to obtain","irr"],["ocupar","to occupy","-ar"],["odiar","to hate","-ar"],["ofender","to offend","-er"],["oferecer","to offer","-er"],["olhar","to look","-ar"],["omitir","to omit","-ir"],["operar","to operate","-ar"],["opor","to oppose","irr"],["oprimir","to oppress","-ir"],["optar","to opt","-ar"],["orar","to pray","-ar"],["ordenar","to order/sort","-ar"],["organizar","to organize","-ar"],["orientar","to guide/orient","-ar"],["originar","to originate","-ar"],["ousar","to dare","-ar"],["ouvir","to hear","irr"],["pagar","to pay","-ar"],["parar","to stop","-ar"],["parecer","to seem","-er"],["participar","to participate","-ar"],["partir","to leave/break","-ir"],["passar","to pass/spend","-ar"],["passear","to stroll/walk","-ar"],["patrocinar","to sponsor","-ar"],["pausar","to pause","-ar"],["pedir","to ask for","-ir"],["pegar","to grab/catch","-ar"],["penalizar","to penalize","-ar"],["pendurar","to hang","-ar"],["penetrar","to penetrate","-ar"],["pensar","to think","-ar"],["perceber","to understand/realize","-er"],["percorrer","to travel through","-er"],["perder","to lose","-er"],["perdoar","to forgive","-ar"],["perfurar","to perforate","-ar"],["perguntar","to ask (a question)","-ar"],["permitir","to allow","-ir"],["perseguir","to pursue/persecute","-ir"],["persistir","to persist","-ir"],["personalizar","to personalize","-ar"],["pertencer","to belong","-er"],["perturbar","to disturb","-ar"],["pescar","to fish","-ar"],["pesquisar","to research","-ar"],["picar","to sting/chop","-ar"],["pilotar","to pilot","-ar"],["pintar","to paint","-ar"],["pisar","to step on","-ar"],["planear","to plan (EP)","-ar"],["plantar","to plant","-ar"],["poder","to be able to","irr"],["polir","to polish","-ir"],["poluir","to pollute","-ir"],["ponderar","to ponder","-ar"],["pontuar","to punctuate","-ar"],["popularizar","to popularize","-ar"],["pôr","to put","irr"],["portar-se","to behave","-ar"],["posar","to pose","-ar"],["posicionar","to position","-ar"],["possibilitar","to make possible","-ar"],["possuir","to possess","-ir"],["poupar","to save/spare","-ar"],["pousar","to land/put down","-ar"],["praticar","to practise","-ar"],["precisar","to need","-ar"],["predizer","to predict","irr"],["preferir","to prefer","-ir"],["prejudicar","to harm/damage","-ar"],["premiar","to award","-ar"],["prender","to arrest/attach","-er"],["preocupar","to worry","-ar"],["preparar","to prepare","-ar"],["prescrever","to prescribe","-er"],["preservar","to preserve","-ar"],["presidir","to preside","-ir"],["pressionar","to pressure","-ar"],["prestar","to provide/render","-ar"],["presumir","to presume","-ir"],["pretender","to intend","-er"],["prevenir","to prevent","-ir"],["prever","to foresee","irr"],["priorizar","to prioritize","-ar"],["privar","to deprive","-ar"],["privilegiar","to privilege","-ar"],["processar","to process/sue","-ar"],["proclamar","to proclaim","-ar"],["procurar","to look for","-ar"],["produzir","to produce","-ir"],["progredir","to progress","-ir"],["proibir","to prohibit","-ir"],["prolongar","to prolong","-ar"],["prometer","to promise","-er"],["promover","to promote","-er"],["pronunciar","to pronounce","-ar"],["propagar","to propagate","-ar"],["propor","to propose","irr"],["proporcionar","to provide","-ar"],["prosperar","to prosper","-ar"],["proteger","to protect","-er"],["protestar","to protest","-ar"],["provar","to prove/taste","-ar"],["provocar","to provoke","-ar"],["publicar","to publish","-ar"],["pular","to jump","-ar"],["punir","to punish","-ir"],["puxar","to pull","-ar"],["qualificar","to qualify","-ar"],["quebrar","to break","-ar"],["queimar","to burn","-ar"],["queixar-se","to complain","-ar"],["querer","to want","irr"],["questionar","to question","-ar"],["raciocinar","to reason","-ar"],["rasgar","to tear","-ar"],["rastejar","to crawl","-ar"],["reagir","to react","-ir"],["realizar","to carry out/realize","-ar"],["reaparecer","to reappear","-er"],["recear","to fear","-ar"],["receber","to receive","-er"],["reciclar","to recycle","-ar"],["reclamar","to complain/claim","-ar"],["recomendar","to recommend","-ar"],["recompensar","to reward","-ar"],["reconciliar","to reconcile","-ar"],["reconhecer","to recognize","-er"],["recordar","to remember/recall","-ar"],["recorrer","to resort to","-er"],["recuperar","to recover","-ar"],["recusar","to refuse","-ar"],["redescobrir","to rediscover","-ir"],["redigir","to draft/write","-ir"],["reduzir","to reduce","-ir"],["referir","to refer","-ir"],["refletir","to reflect","-ir"],["reformar","to reform","-ar"],["reforçar","to reinforce","-ar"],["refugiar-se","to take refuge","-ar"],["regar","to water (plants)","-ar"],["regatear","to haggle","-ar"],["registar","to register (EP)","-ar"],["regressar","to return","-ar"],["regular","to regulate","-ar"],["reinar","to reign","-ar"],["reinventar","to reinvent","-ar"],["reivindicar","to claim/demand","-ar"],["rejeitar","to reject","-ar"],["relacionar","to relate","-ar"],["relaxar","to relax","-ar"],["relembrar","to remind/recall","-ar"],["reluzir","to glitter","-ir"],["remarcar","to reschedule","-ar"],["remediar","to remedy","-ar"],["remeter","to send/remit","-er"],["remover","to remove","-er"],["render","to yield/surrender","-er"],["renovar","to renew","-ar"],["renunciar","to renounce","-ar"],["reparar","to repair/notice","-ar"],["repartir","to distribute","-ir"],["repetir","to repeat","-ir"],["repor","to replace/restore","irr"],["representar","to represent","-ar"],["reprimir","to repress","-ir"],["reproduzir","to reproduce","-ir"],["reputar","to repute","-ar"],["requerer","to require","irr"],["reservar","to reserve","-ar"],["residir","to reside","-ir"],["resistir","to resist","-ir"],["resolver","to solve/resolve","-er"],["respeitar","to respect","-ar"],["respirar","to breathe","-ar"],["responder","to respond","-er"],["responsabilizar","to hold responsible","-ar"],["ressaltar","to stand out/emphasize","-ar"],["restaurar","to restore","-ar"],["restringir","to restrict","-ir"],["resultar","to result","-ar"],["resumir","to summarize","-ir"],["reter","to retain","irr"],["retirar","to remove/withdraw","-ar"],["retomar","to resume","-ar"],["retornar","to return","-ar"],["retratar","to portray","-ar"],["reunir","to gather/meet","-ir"],["revelar","to reveal","-ar"],["rever","to review","irr"],["revisar","to revise","-ar"],["revoltar","to revolt","-ar"],["rezar","to pray","-ar"],["rir","to laugh","irr"],["rivalizar","to rival","-ar"],["roubar","to steal/rob","-ar"],["rodar","to rotate","-ar"],["rodear","to surround","-ar"],["romper","to break/rupture","-er"],["roncar","to snore","-ar"],["rugir","to roar","-ir"],["saber","to know (facts)","irr"],["sacrificar","to sacrifice","-ar"],["sacudir","to shake","-ir"],["sair","to leave/go out","irr"],["saltar","to jump","-ar"],["salvar","to save","-ar"],["sarar","to heal","-ar"],["satisfazer","to satisfy","irr"],["saudar","to greet","-ar"],["secar","to dry","-ar"],["seduzir","to seduce","-ir"],["seguir","to follow","-ir"],["segurar","to hold/secure","-ar"],["selecionar","to select","-ar"],["semear","to sow","-ar"],["sentar","to sit","-ar"],["sentir","to feel","-ir"],["separar","to separate","-ar"],["ser","to be (permanent)","irr"],["servir","to serve","-ir"],["significar","to mean","-ar"],["silenciar","to silence","-ar"],["simbolizar","to symbolize","-ar"],["simpatizar","to sympathize","-ar"],["simplificar","to simplify","-ar"],["simular","to simulate","-ar"],["sinalizar","to signal","-ar"],["situar","to situate","-ar"],["soar","to sound","-ar"],["sobrar","to be left over","-ar"],["sobrecarregar","to overload","-ar"],["sobressair","to stand out","irr"],["sobreviver","to survive","-er"],["socializar","to socialize","-ar"],["socorrer","to help/rescue","-er"],["sofrer","to suffer","-er"],["soltar","to release/let go","-ar"],["solucionar","to solve","-ar"],["sonhar","to dream","-ar"],["soprar","to blow","-ar"],["sorrir","to smile","irr"],["soterrar","to bury","-ar"],["subir","to go up/climb","-ir"],["sublinhar","to underline","-ar"],["submeter","to submit","-er"],["substituir","to substitute","-ir"],["subtrair","to subtract","irr"],["suceder","to happen/succeed","-er"],["sufocar","to suffocate","-ar"],["sugerir","to suggest","-ir"],["sujar","to dirty","-ar"],["suportar","to endure/support","-ar"],["supor","to suppose","irr"],["suprimir","to suppress","-ir"],["surgir","to emerge/arise","-ir"],["surpreender","to surprise","-er"],["suspeitar","to suspect","-ar"],["suspender","to suspend","-er"],["suspirar","to sigh","-ar"],["sustentar","to sustain","-ar"],["tapar","to cover/block","-ar"],["tardar","to delay","-ar"],["tecer","to weave","-er"],["telefonar","to telephone","-ar"],["temer","to fear","-er"],["temperar","to season","-ar"],["tender","to tend","-er"],["tentar","to try/attempt","-ar"],["ter","to have","irr"],["terminar","to finish","-ar"],["testemunhar","to witness","-ar"],["tirar","to take/remove","-ar"],["tocar","to touch/play (music)","-ar"],["tolerar","to tolerate","-ar"],["tomar","to take/drink","-ar"],["torcer","to twist/support (team)","-er"],["tornar","to become/make","-ar"],["torrar","to toast/roast","-ar"],["torturar","to torture","-ar"],["tossir","to cough","-ir"],["trabalhar","to work","-ar"],["traduzir","to translate","-ir"],["trair","to betray","irr"],["trancar","to lock","-ar"],["transferir","to transfer","-ir"],["transformar","to transform","-ar"],["transmitir","to transmit","-ir"],["transportar","to transport","-ar"],["tratar","to treat/deal with","-ar"],["travar","to brake/engage","-ar"],["trazer","to bring","irr"],["treinar","to train","-ar"],["tremer","to tremble","-er"],["trocar","to exchange/swap","-ar"],["tropeçar","to trip/stumble","-ar"],["ultrapassar","to overtake/surpass","-ar"],["unificar","to unify","-ar"],["unir","to unite","-ir"],["urgir","to be urgent","-ir"],["usar","to use/wear","-ar"],["usufruir","to enjoy (a right)","-ir"],["utilizar","to utilize","-ar"],["vacinar","to vaccinate","-ar"],["valer","to be worth","irr"],["valorizar","to value","-ar"],["variar","to vary","-ar"],["varrer","to sweep","-er"],["vencer","to win/overcome","-er"],["vender","to sell","-er"],["venerar","to venerate","-ar"],["vestir","to dress/wear","-ir"],["viajar","to travel","-ar"],["vir","to come","irr"],["virar","to turn","-ar"],["visitar","to visit","-ar"],["viver","to live","-er"],["voar","to fly","-ar"],["voltar","to return/go back","-ar"],["votar","to vote","-ar"],["zelar","to look after","-ar"],["zoar","to tease","-ar"],
];

const VERB_LETTERS = [...new Set(ALL_VERBS.map(v => v[0][0].toUpperCase()))].sort();
const VERB_TYPES = ["-ar", "-er", "-ir", "irr"];
const VERB_TYPE_COLORS = { "-ar": "#00a870", "-er": "#008a8a", "-ir": "#c9963c", "irr": "#c0392b" };
const VERB_TYPE_LABELS = { "-ar": "-AR", "-er": "-ER", "-ir": "-IR", "irr": "Irregular" };
const A2_PRIORITY_VERBS = new Set([
"ser","estar","ter","fazer","ir","poder","dizer","dar","saber","querer","ver","vir",
"falar","comer","viver","trabalhar","precisar","encontrar","pôr","ficar","dever",
"trazer","esperar","beber","conhecer","abrir","acabar","achar","acordar","acreditar",
"ajudar","almoçar","amar","andar","apanhar","aparecer","aprender","apresentar",
"assistir","atender","avisar","baixar","bater","brincar","buscar","cair","calhar",
"caminhar","cantar","casar","chegar","chamar","chorar","chover","começar","comprar",
"compreender","comunicar","concordar","conduzir","confessar","confiar","confirmar",
"conhecer","conseguir","considerar","construir","contar","continuar","convidar",
"correr","cortar","costumar","cozinhar","crescer","criar","cuidar","dançar",
"decidir","deixar","demorar","descansar","descer","descobrir","desculpar","desejar",
"desenhar","desenvolver","desistir","desligar","despedir","dormir","duvidar",
"educar","encontrar","ensinar","entender","entrar","entregar","enviar","errar",
"escolher","escrever","escutar","esquecer","estudar","evitar","experimentar",
"explicar","fechar","felicitar","funcionar","ganhar","gastar","gostar","gritar",
"guardar","imaginar","importar","informar","interessar","ir","jantar","jogar",
"julgar","juntar","lavar","ler","levantar","levar","ligar","limpar","lutar",
"mandar","marcar","matar","melhorar","mentir","merecer","meter","mexer","morar",
"morrer","mostrar","mudar","nadar","nascer","navegar","negar","notar","obedecer",
"odiar","oferecer","olhar","ouvir","pagar","parar","parecer","participar","partir",
"passar","passear","pedir","pegar","pensar","perceber","perder","perdoar",
"perguntar","permitir","pertencer","pesquisar","pintar","poder","poupar",
"praticar","precisar","preferir","preocupar","preparar","pretender","procurar",
"prometer","propor","proteger","provar","publicar","puxar","quebrar","queimar",
"querer","reagir","realizar","receber","reclamar","recomendar","reconhecer",
"recordar","recusar","reduzir","registar","regressar","relaxar","reparar",
"repetir","reservar","resolver","respeitar","respirar","responder","resultar",
"retirar","reunir","rir","roubar","saber","sair","saltar","salvar","saudar",
"secar","seguir","segurar","sentar","sentir","separar","ser","servir",
"significar","situar","sobreviver","sofrer","sonhar","sorrir","subir",
"sugerir","telefonar","tentar","ter","terminar","tirar","tocar","tomar",
"tornar","trabalhar","traduzir","tratar","trazer","treinar","trocar",
"ultrapassar","usar","utilizar","valer","varrer","vender","ver","verificar",
"vestir","viajar","vir","virar","visitar","viver","voar","voltar","votar"
]);

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
  { sentence: "___ menino está na escola.", sentenceEn: "___ boy is at school.", answer: "O", hint: "definite, masc. sing." },
  { sentence: "Vou comprar ___ livro.", sentenceEn: "I am going to buy ___ book.", answer: "um", hint: "indefinite, masc. sing." },
  { sentence: "___ raparigas estão no parque.", sentenceEn: "___ girls are in the park.", answer: "As", hint: "definite, fem. pl." },
  { sentence: "Preciso ___ caneta.", sentenceEn: "I need ___ pen.", answer: "de uma", hint: "de + indefinite, fem. sing." },
  { sentence: "Ela foi ___ supermercado.", sentenceEn: "She went ___ supermarket.", answer: "ao", hint: "a + definite, masc. sing." },
  { sentence: "Os livros estão ___ mesa.", sentenceEn: "The books are ___ table.", answer: "na", hint: "em + definite, fem. sing." },
  { sentence: "Recebi ___ carta ___ amigos.", sentenceEn: "I received ___ letter ___ friends.", answer: "uma / dos", hint: "indef. fem. / de + def. masc. pl." },
  { sentence: "Ele vem ___ Brasil.", sentenceEn: "He comes ___ Brazil.", answer: "do", hint: "de + definite, masc. sing." },
  { sentence: "Ela gosta ___ flores.", sentenceEn: "She likes ___ flowers.", answer: "das", hint: "de + definite, fem. pl." },
  { sentence: "Vou ___ praia.", sentenceEn: "I'm going ___ beach.", answer: "à", hint: "a + definite, fem. sing." },
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
  { id: 1, sentence: "Eu ___ (falar) com ele ontem ao telefone.", sentenceEn: "I ___ (speak) with him yesterday on the phone.", correct_perfeito: "falei", correct_imperfeito: "falava", required: "perfeito", hint: "Specific completed action — a one-time event", explanation: "'Falei' describes a specific completed conversation that happened and finished yesterday." },
  { id: 2, sentence: "Quando eu ___ (ser) criança, ___ (morar) em Lisboa.", sentenceEn: "When I ___ (be) a child, I ___ (live) in Lisbon.", correct_perfeito: "fui / moriei", correct_imperfeito: "era / morava", required: "imperfeito", hint: "Habitual or ongoing state in the past", explanation: "'Era' and 'morava' describe what your life was like over a period of time in the past." },
  { id: 3, sentence: "Ele ___ (chegar) às três horas e ___ (sair) às cinco.", sentenceEn: "He ___ (arrive) at three o'clock and ___ (leave) at five.", correct_perfeito: "chegou / saiu", correct_imperfeito: "chegava / saía", required: "perfeito", hint: "Two specific actions at defined times", explanation: "'Chegou' and 'saiu' tell us exactly when these happened." },
  { id: 4, sentence: "Eu ___ (estudar) português todos os dias durante dois anos.", sentenceEn: "I ___ (study) Portuguese every day for two years.", correct_perfeito: "estudei", correct_imperfeito: "estudava", required: "imperfeito", hint: "A habitual action repeated over a period", explanation: "'Estudava' describes a habit continued over time with no defined beginning or end." },
  { id: 5, sentence: "A Maria ___ (ser) muito bonita quando ___ (ter) vinte anos.", sentenceEn: "Maria ___ (be) very beautiful when she ___ (have) twenty years old.", correct_perfeito: "foi / teve", correct_imperfeito: "era / tinha", required: "perfeito", hint: "A specific moment in time in the past", explanation: "When referring to a specific age, use Perfeito: 'foi' and 'teve'." },
  { id: 6, sentence: "Nós ___ (viver) no Porto antes de ___ (mudar) para Lisboa.", sentenceEn: "We ___ (live) in Porto before ___ (move) to Lisbon.", correct_perfeito: "vivemos / mudamos", correct_imperfeito: "vivíamos / mudávamos", required: "perfeito", hint: "Two sequential completed actions", explanation: "'Viver' and 'mudar' describe a sequence of completed events." },
  { id: 7, sentence: "Eu ___ (estar) cansado porque ___ (trabalhar) muito.", sentenceEn: "I ___ (be) tired because I ___ (work) a lot.", correct_perfeito: "estive / trabalhei", correct_imperfeito: "estava / trabalhava", required: "imperfeito", hint: "Describing a past state (no specific time)", explanation: "'Estava cansado' describes how you felt — a state. Use Imperfeito for past states." },
  { id: 8, sentence: "Ontem, eu ___ (comer) arroz e peixe no restaurante.", sentenceEn: "Yesterday, I ___ (eat) rice and fish at the restaurant.", correct_perfeito: "comi", correct_imperfeito: "comia", required: "perfeito", hint: "A specific meal at a specific time (ontem)", explanation: "'Comi' tells us what you ate yesterday — a specific completed action." },
  { id: 9, sentence: "Ele sempre ___ (dizer) que ___ (querer) viajar.", sentenceEn: "He always ___ (say) that he ___ (want) to travel.", correct_perfeito: "disse / quis", correct_imperfeito: "dizia / queria", required: "imperfeito", hint: "'Sempre' (always) signals a habitual past action", explanation: "'Sempre dizia' describes something he repeatedly said in the past." },
  { id: 10, sentence: "Quando eu ___ (ver) o filme, ele já ___ (ser) muito famoso.", sentenceEn: "When I ___ (see) the film, it already ___ (be) very famous.", correct_perfeito: "vi / era", correct_imperfeito: "via / era", required: "perfeito", hint: "Two events: completed action + ongoing state", explanation: "'Vi' is the completed action. 'Era' describes the state at that moment." },
  { id: 11, sentence: "___ (haver) muitos problemas naquela altura.", sentenceEn: "There ___ (be) many problems at that time.", correct_perfeito: "houve", correct_imperfeito: "havia", required: "imperfeito", hint: "Describing what existed over a past period", explanation: "'Havia' describes what existed or happened habitually in the past." },
  { id: 12, sentence: "Eu não ___ (saber) que tu ___ (estar) aqui.", sentenceEn: "I didn't ___ (know) that you ___ (be) here.", correct_perfeito: "soube / estavas", correct_imperfeito: "sabia / estavas", required: "imperfeito", hint: "Describing a state of not knowing in the past", explanation: "'Não sabia' describes the state of not knowing — an ongoing condition." },
  { id: 13, sentence: "Naquele dia, nós ___ (ir) ao cinema e depois ___ (jantar) fora.", sentenceEn: "That day, we ___ (go) to the cinema and then ___ (dine) out.", correct_perfeito: "fomos / jantamos", correct_imperfeito: "íamos / jantávamos", required: "perfeito", hint: "A sequence of specific completed events", explanation: "'Fomos' and 'jantamos' describe the specific activities of a particular day." },
  { id: 14, sentence: "Eu ___ (estudar) muito, por isso ___ (passar) no exame.", sentenceEn: "I ___ (study) a lot, that's why I ___ (pass) the exam.", correct_perfeito: "estudei / passei", correct_imperfeito: "estudava / passava", required: "perfeito", hint: "Cause-and-effect between two completed actions", explanation: "'Estudei' and 'passei' describe specific completed actions where one caused the other." },
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
  { id: 1, type: "Email informal", title: "Email a um Amigo", description: "Escreve um e-mail a um amigo sobre o teu fim de semana.", topic: "Fim de semana", targetWords: 60, modelAnswer: "Olá Pedro!\n\nComo estás? O meu fim de semana foi muito divertido.\n\nNo sábado, acordei tarde e fui ao café com a minha família. Comi ovos e pão com manteiga — estava delicioso! À tarde, fui ao parque com os meus amigos.\n\nNo domingo, levantei-me cedo e fui às compras. Comprei fruta e legumes no mercado. À noite, estudei português para o exame.\n\nE tu? O que fizeste no fim de semana?\n\nUm abraço,\n[O teu nome]", englishAnswer: "Hi Pedro!\n\nHow are you? My weekend was really fun.\n\nOn Saturday, I woke up late and went to the café with my family. I ate eggs and bread with butter — it was delicious! In the afternoon, I went to the park with my friends.\n\nOn Sunday, I got up early and went shopping. I bought fruit and vegetables at the market. In the evening, I studied Portuguese for the exam.\n\nAnd you? What did you do on the weekend?\n\nHugs,\n[Your name]", keyVocab: ["fins de semana","divertido","acordar","ir ao café","delicioso"] },
  { id: 2, type: "Email formal", title: "Email a uma Empresa", description: "Escreve um e-mail formal a pedir informações sobre um produto.", topic: "Pedido de informação", targetWords: 50, modelAnswer: "Exmos. Senhores,\n\nChamo-me [nome] e escrevo para pedir informações sobre o produto que vi no vosso website.\n\nGostaria de saber o preço, o prazo de entrega e se aceitam pagamento por cartão de crédito.\n\nAguardo uma resposta com a maior brevidade possível.\n\nCom os melhores cumprimentos,\n[Nome]", englishAnswer: "Dear Sirs,\n\nMy name is [name] and I am writing to request information about the product I saw on your website.\n\nI would like to know the price, the delivery time, and whether you accept credit card payment.\n\nI look forward to your prompt reply.\n\nBest regards,\n[Name]", keyVocab: ["pretendo","gostaria de saber","prazo de entrega","pagamento","aguardar"] },
  { id: 3, type: "Descrição", title: "A Minha Casa", description: "Descreve a tua casa ou apartamento. Que divisões tens?", topic: "Casa e divisões", targetWords: 70, modelAnswer: "Moro num apartamento pequeno no centro da cidade. A minha casa tem três divisões: a sala, o quarto e a cozinha.\n\nA sala é espaçosa e tem um sofá azul, uma mesa de centro e uma estante com muitos livros.\n\nO quarto tem uma cama grande, um armário branco e uma mesa de cabeceira.\n\nA cozinha é pequena mas funcional. Tem um fogão, um frigorífico e uma bancada. Adoro fazer café de manhã!\n\nNo total, a casa tem cerca de 60 metros quadrados. Não é grande, mas é aconchegante.", englishAnswer: "I live in a small apartment in the city centre. My home has three rooms: the living room, the bedroom, and the kitchen.\n\nThe living room is spacious and has a blue sofa, a coffee table, and a bookshelf with many books.\n\nThe bedroom has a large bed, a white wardrobe, and a bedside table.\n\nThe kitchen is small but functional. It has a stove, a refrigerator, and a counter. I love making coffee in the morning!\n\nIn total, the apartment is about 60 square metres. It's not big, but it's cozy.", keyVocab: ["apartamento","divisões","espaçoso","aconchegante","funcional","cerca de"] },
  { id: 4, type: "Descrição", title: "A Minha Família", description: "Descreve a tua família. Quem são? O que fazem?", topic: "Família", targetWords: 80, modelAnswer: "A minha família é pequena. Somos quatro: os meus pais, a minha irmã e eu.\n\nO meu pai chama-se António e tem 48 anos. É alto e trabalha como engenheiro. É muito trabalhador e simpático.\n\nA minha mãe chama-se Maria e tem 45 anos. É professora de português. Adora ler e cozinhar.\n\nA minha irmã chama-se Sofia e tem 18 anos. É estudante e quer ser médica.\n\nEu tenho 22 anos e estudo informática. Gosto de música e de jogar computador.\n\nSomos muito unidos e passamos muito tempo juntos aos fins de semana.", englishAnswer: "My family is small. We are four: my parents, my sister, and me.\n\nMy father's name is António and he is 48 years old. He is tall and works as an engineer. He is very hardworking and friendly.\n\nMy mother's name is Maria and she is 45 years old. She is a Portuguese teacher. She loves reading and cooking.\n\nMy sister's name is Sofia and she is 18 years old. She is a student and wants to be a doctor.\n\nI am 22 years old and I study computer science. I like music and playing computer games.\n\nWe are very close and we spend a lot of time together on weekends.", keyVocab: ["família","unidos","trabalhador","estudante","inteligente","passar tempo"] },
  { id: 5, type: "Diálogo", title: "No Café", description: "Escreve um diálogo entre duas pessoas num café.", topic: "No café", targetWords: 40, modelAnswer: "Empregada: Olá! O que deseja?\nCliente: Olá! Queria um café com leite, por favor.\nEmpregada: Com açúcar ou sem açúcar?\nCliente: Sem açúcar, obrigado. E também quero um bolo de chocolate.\nEmpregada: São três euros no total.\nCliente: Aqui tem. Pode dar-me o troco?\nEmpregada: Claro! Aqui tem. Bom proveito!", englishAnswer: "Waitress: Hello! What would you like?\nCustomer: Hello! I would like a coffee with milk, please.\nWaitress: With sugar or without sugar?\nCustomer: Without sugar, thank you. And I also want a chocolate cake.\nWaitress: That's three euros in total.\nCustomer: Here you go. Can you give me the change?\nWaitress: Of course! Here you go. Enjoy your meal!", keyVocab: ["deseja","queria","por favor","obrigado","quanto custa","o troco"] },
  { id: 6, type: "Descrição", title: "Um Dia Típico", description: "Descreve um dia típico na tua vida.", topic: "Rotina diária", targetWords: 90, modelAnswer: "O meu dia típico começa às sete da manhã. Levanto-me, tomo um duche e pequeno-almoço.\n\nDe manhã, vou para o trabalho. Chego às nove e trabalho até à hora de almoço.\n\nÀ uma hora, almoço. Geralmente como uma sandes e uma peça de fruta.\n\nDepois do trabalho, vou às vezes ao ginásio ou encontro amigos.\n\nÀ noite, janto por volta das sete e meia. Depois, vejo televisão ou estudo português. Deito-me às onze.\n\nAos fins de semana, a minha rotina muda. Durmo mais e passo tempo com a família.", englishAnswer: "My typical day starts at seven in the morning. I get up, take a shower, and have breakfast.\n\nIn the morning, I go to work. I arrive at nine and work until lunchtime.\n\nAt one o'clock, I have lunch. I usually eat a sandwich and a piece of fruit.\n\nAfter work, I sometimes go to the gym or meet friends.\n\nIn the evening, I have dinner around half past seven. Then I watch television or study Portuguese. I go to bed at eleven.\n\nOn weekends, my routine changes. I sleep more and spend time with family.", keyVocab: ["levantar-se","pequeno-almoço","geralmente","por volta das","às vezes","aos fins de semana"] },
  { id: 7, type: "Narração", title: "Uma Viagem", description: "Descreve uma viagem que fizeste.", topic: "Viagem", targetWords: 80, modelAnswer: "No verão passado, fui a Portugal com a minha família. Viajámos de carro e demorámos cerca de seis horas.\n\nFicámos numa pequena pensão perto da praia. O quarto era simples mas limpo.\n\nNo primeiro dia, fomos à praia. O mar estava quente e havia poucos banhistas. Foi muito relaxante!\n\nNo segundo dia, visitámos uma cidade histórica com castelo medieval. A vista era incrível.\n\nNo último dia, comprámos lembranças para a família.\n\nFoi uma viagem muito agradável. Quero voltar!", englishAnswer: "Last summer, I went to Portugal with my family. We drove and it took about six hours.\n\nWe stayed in a small guesthouse near the beach. The room was simple but clean.\n\nOn the first day, we went to the beach. The sea was warm and there were few swimmers. It was very relaxing!\n\nOn the second day, we visited a historic town with a medieval castle. The view was incredible.\n\nOn the last day, we bought souvenirs for the family.\n\nIt was a very pleasant trip. I want to go back!", keyVocab: ["no verão passado","ficámos","relaxante","incrível","lembranças"] },
  { id: 8, type: "Opinião", title: "Planos para o Futuro", description: "Descreve os teus planos para os próximos cinco anos.", topic: "Planos futuros", targetWords: 60, modelAnswer: "Nos próximos cinco anos, tenho vários planos.\n\nPrimeiro, quero terminar os meus estudos. Se tudo correr bem, vou acabar o curso e receber o diploma.\n\nDepois, quero encontrar um bom emprego na minha área. Gostaria de trabalhar numa empresa grande onde possa aprender muito.\n\nTambém quero poupar dinheiro para fazer uma viagem longa. Sempre quis visitar o Brasil e Portugal.\n\nPara alcançar estes objetivos, sei que tenho de trabalhar muito. Mas estou motivado.", englishAnswer: "In the next five years, I have several plans.\n\nFirst, I want to finish my studies. If all goes well, I will complete the course and receive my diploma.\n\nThen, I want to find a good job in my field. I would like to work in a large company where I can learn a lot.\n\nI also want to save money to take a long trip. I have always wanted to visit Brazil and Portugal.\n\nTo achieve these goals, I know I have to work hard. But I am motivated.", keyVocab: ["se tudo correr bem","progredir","poupar dinheiro","a longo prazo","alcançar","motivado"] },
];

const ORAL_DIALOGUES = [
  { id: 1, title: "Cumprimentos", difficulty: "Fácil", dialogue: [{speaker:"A",text:"Olá! Como estás?"},{speaker:"B",text:"Olá! Estou bem, obrigado. E tu?"},{speaker:"A",text:"Também estou bem. Tudo bem com a família?"},{speaker:"B",text:"Tudo bem! Até amanhã!"},{speaker:"A",text:"Até amanhã! Adeus!"}], englishDialogue: [{speaker:"A",text:"Hi! How are you?"},{speaker:"B",text:"Hi! I'm fine, thanks. And you?"},{speaker:"A",text:"I'm fine too. Is everything okay with the family?"},{speaker:"B",text:"All good! See you tomorrow!"},{speaker:"A",text:"See you tomorrow! Bye!"}], keyPhrases: ["Olá! Como estás?","Estou bem, obrigado.","E tu?","Tudo bem com a família?","Até amanhã!","Adeus!"], tip: "In EP, 'tu' is used widely (unlike BP)." },
  { id: 2, title: "No Café", difficulty: "Fácil", dialogue: [{speaker:"Empregada",text:"Bom dia! O que deseja?"},{speaker:"Cliente",text:"Queria um café, por favor."},{speaker:"Empregada",text:"Com açúcar?"},{speaker:"Cliente",text:"Sim, obrigado."},{speaker:"Empregada",text:"São 80 cêntimos."},{speaker:"Cliente",text:"Aqui tem."},{speaker:"Empregada",text:"Muito obrigada! Bom proveito!"}], englishDialogue: [{speaker:"Waitress",text:"Good morning! What would you like?"},{speaker:"Customer",text:"I'd like a coffee with milk, please."},{speaker:"Waitress",text:"With sugar or without?"},{speaker:"Customer",text:"Without sugar, thank you."},{speaker:"Waitress",text:"That's 80 cents."},{speaker:"Customer",text:"Here you go."},{speaker:"Waitress",text:"Thank you very much! Enjoy!"}], keyPhrases: ["O que deseja?","Queria um café, por favor.","Com açúcar?","Aqui tem.","Bom proveito!"], tip: "In Portugal, you always pay at the counter before sitting down." },
  { id: 3, title: "Reservar Mesa", difficulty: "Médio", dialogue: [{speaker:"Restaurante",text:"Restaurante O Telheiro, bom dia!"},{speaker:"Cliente",text:"Queria fazer uma reserva para amanhã à noite."},{speaker:"Restaurante",text:"Para quantas pessoas?"},{speaker:"Cliente",text:"Para quatro pessoas. Às oito horas."},{speaker:"Restaurante",text:"Em nome de quem?"},{speaker:"Cliente",text:"Em nome de Silva."},{speaker:"Restaurante",text:"Muito bem! Até amanhã!"}], englishDialogue: [{speaker:"Restaurant",text:"Restaurante O Telheiro, good morning!"},{speaker:"Customer",text:"I'd like to make a reservation for tomorrow evening."},{speaker:"Restaurant",text:"For how many people?"},{speaker:"Customer",text:"For four people. At eight o'clock."},{speaker:"Restaurant",text:"In whose name?"},{speaker:"Customer",text:"In the name of Silva."},{speaker:"Restaurant",text:"Very well! See you tomorrow!"}], keyPhrases: ["Queria fazer uma reserva.","Para quantas pessoas?","Às oito horas.","Em nome de quem?","Até amanhã!"], tip: "Portuguese restaurants often close one day per week — always call ahead." },
  { id: 4, title: "No Médico", difficulty: "Médio", dialogue: [{speaker:"Médico",text:"Bom dia! Em que posso ajudá-lo?"},{speaker:"Paciente",text:"Não me sinto bem desde ontem."},{speaker:"Médico",text:"Que sintomas tem?"},{speaker:"Paciente",text:"Tenho dores de cabeça e febre."},{speaker:"Médico",text:"Não se preocupe. É uma constipação. Descanse e beba muitos líquidos."}], englishDialogue: [{speaker:"Doctor",text:"Good morning! How can I help you?"},{speaker:"Patient",text:"I haven't been feeling well since yesterday."},{speaker:"Doctor",text:"What symptoms do you have?"},{speaker:"Patient",text:"I have headaches and a fever."},{speaker:"Doctor",text:"Don't worry. It's a cold. Rest and drink plenty of fluids."}], keyPhrases: ["Não me sinto bem.","Que sintomas tem?","Tenho dores de cabeça e febre.","Não se preocupe.","Descanse e beba muitos líquidos."], tip: "In Portugal, go to the 'Centro de Saúde' first for non-emergencies." },
  { id: 5, title: "Pedir Direções", difficulty: "Médio", dialogue: [{speaker:"Turista",text:"Com licença! Estou perdido."},{speaker:"Português",text:"Claro! Onde quer ir?"},{speaker:"Turista",text:"Queria ir à estação de comboios."},{speaker:"Português",text:"Vire à direita. Ande sempre em frente até ao semáforo."},{speaker:"Turista",text:"Muito obrigado!"},{speaker:"Português",text:"De nada! Boa viagem!"}], englishDialogue: [{speaker:"Tourist",text:"Excuse me! I am lost."},{speaker:"Portuguese",text:"Of course! Where do you want to go?"},{speaker:"Tourist",text:"I'd like to go to the train station."},{speaker:"Portuguese",text:"Turn right. Keep going straight until the traffic light."},{speaker:"Tourist",text:"Thank you very much!"},{speaker:"Portuguese",text:"You're welcome! Have a good trip!"}], keyPhrases: ["Com licença!","Estou perdido.","Onde quer ir?","Vire à direita.","Ande sempre em frente.","Muito obrigado!"], tip: "Portuguese people are generally helpful." },
  { id: 6, title: "Na Loja de Roupa", difficulty: "Fácil", dialogue: [{speaker:"Vendedora",text:"Posso ajudá-la?"},{speaker:"Cliente",text:"Estou a procurar um casaco azul."},{speaker:"Vendedora",text:"Que tamanho usa?"},{speaker:"Cliente",text:"Uso tamanho M."},{speaker:"Vendedora",text:"Temos este aqui. Quer experimentar?"},{speaker:"Cliente",text:"Sim! Onde é o provador?"},{speaker:"Vendedora",text:"Ali ao fundo, à direita."},{speaker:"Cliente",text:"Fica perfeito! Quanto custa?"}], englishDialogue: [{speaker:"Shop assistant",text:"Can I help you?"},{speaker:"Customer",text:"I'm looking for a blue jacket."},{speaker:"Shop assistant",text:"What size do you wear?"},{speaker:"Customer",text:"I wear size M."},{speaker:"Shop assistant",text:"We have this one here. Would you like to try it?"},{speaker:"Customer",text:"Yes! Where is the fitting room?"},{speaker:"Shop assistant",text:"Down there on the right."},{speaker:"Customer",text:"It fits perfectly! How much does it cost?"}], keyPhrases: ["Estou a procurar...","Que tamanho usa?","Quer experimentar?","Onde é o provador?","Fica perfeito!","Quanto custa?"], tip: "'Fica perfeito!' = 'It fits perfectly!'" },
  { id: 7, title: "No Aeroporto", difficulty: "Difícil", dialogue: [{speaker:"Funcionário",text:"Bom dia! Passaporte e bilhete, por favor."},{speaker:"Passageiro",text:"Aqui tem."},{speaker:"Funcionário",text:"Destino? Lisboa?"},{speaker:"Passageiro",text:"Sim. Qual é o portão de embarque?"},{speaker:"Funcionário",text:"Portão 12. Embarque às 14h30."},{speaker:"Funcionário",text:"Tenha um bom voo!"}], englishDialogue: [{speaker:"Official",text:"Good morning! Passport and ticket, please."},{speaker:"Passenger",text:"Here you go."},{speaker:"Official",text:"Destination? Lisbon?"},{speaker:"Passenger",text:"Yes. What is the boarding gate?"},{speaker:"Official",text:"Gate 12. Boarding at 14:30."},{speaker:"Official",text:"Have a good flight!"}], keyPhrases: ["Passaporte e bilhete, por favor.","Qual é o portão de embarque?","Embarque às...","Tenha um bom voo!"], tip: "Show up at least 2 hours before domestic flights." },
  { id: 8, title: "Marcar Consulta", difficulty: "Médio", dialogue: [{speaker:"Centro",text:"Centro de Saúde, bom dia!"},{speaker:"Paciente",text:"Queria marcar uma consulta com o médico."},{speaker:"Operadora",text:"Qual é o seu número de utente?"},{speaker:"Paciente",text:"É o 123456789."},{speaker:"Operadora",text:"Tem disponível na quartafeira às 10h30. Convém?"},{speaker:"Paciente",text:"Sim, convém perfeitamente!"}], englishDialogue: [{speaker:"Centre",text:"Health Centre, good morning!"},{speaker:"Patient",text:"I'd like to book an appointment with the doctor."},{speaker:"Operator",text:"What is your patient number?"},{speaker:"Patient",text:"It's 123456789."},{speaker:"Operator",text:"We have available on Wednesday at 10:30. Does that suit?"},{speaker:"Patient",text:"Yes, that suits perfectly!"}], keyPhrases: ["Queria marcar uma consulta.","Qual é o seu número de utente?","Tem disponível...","Convém?","Até quarta-feira!"], tip: "'Convém' means 'it suits/suitably'." },
  { id: 9, title: "Rotina Diária", difficulty: "Médio", dialogue: [{speaker:"A",text:"Conta-me: o que fazes num dia normal?"},{speaker:"B",text:"Acordo às sete, tomo o pequeno-almoço e vou trabalhar."},{speaker:"A",text:"A que horas começas?"},{speaker:"B",text:"Começo às nove. Trabalho até à uma."},{speaker:"A",text:"E depois do trabalho?"},{speaker:"B",text:"Geralmente vou ao ginásio ou encontro amigos. Às sextas vamos sempre ao cinema."}], englishDialogue: [{speaker:"A",text:"Tell me: what do you do on a normal day?"},{speaker:"B",text:"I wake up at seven, have breakfast, and go to work."},{speaker:"A",text:"What time do you start?"},{speaker:"B",text:"I start at nine. I work until one."},{speaker:"A",text:"And after work?"},{speaker:"B",text:"I usually go to the gym or meet friends. On Fridays we always go to the cinema."}], keyPhrases: ["Acordar às sete","tomo o pequeno-almoço","Trabalho até à uma.","Geralmente","Às sextas","Passo tempo com eles"], tip: "Use 'às' with days for regular events." },
  { id: 10, title: "Opinião sobre Filmes", difficulty: "Fácil", dialogue: [{speaker:"A",text:"Viste aquele filme novo?"},{speaker:"B",text:"Ainda não vi. É bom?"},{speaker:"A",text:"É óptimo! Os actores são fantásticos."},{speaker:"B",text:"Que tipo de filme é?"},{speaker:"A",text:"É um thriller. Recomendo!"},{speaker:"B",text:"Tens de ir vê-lo!"}], englishDialogue: [{speaker:"A",text:"Did you see that new film?"},{speaker:"B",text:"Not yet. Is it good?"},{speaker:"A",text:"It's great! The actors are fantastic."},{speaker:"B",text:"What kind of film is it?"},{speaker:"A",text:"It's a thriller. I recommend it!"},{speaker:"B",text:"You have to go see it!"}], keyPhrases: ["É bom?","Os actores são fantásticos.","Que tipo de filme é?","É um thriller.","Recomendo!","Tens de ir vê-lo!"], tip: "'Sair de cartaz' = to stop being shown at the cinema." },
];

const LISTENING_RESOURCES = [
  { id: 1, title: "RTP Ensina — Portuguese for Beginners", description: "Short lessons teaching basic Portuguese phrases. Clear European Portuguese pronunciation.", type: "video", difficulty: "Fácil", url: "https://www.rtp.pt/ensina/", transcript: "Multiple short clips covering greetings, introductions, and everyday phrases.", englishTranscript: "Short lessons covering greetings, introductions, and everyday phrases — clear EP pronunciation for beginners.", topics: ["Cumprimentos","Números","Frases básicas"] },
  { id: 2, title: "Portuguese with Carlota", description: "YouTube channel with European Portuguese lessons on everyday conversation.", type: "video", difficulty: "Fácil", url: "https://www.youtube.com/results?search_query=portuguese+with+carlota+european", transcript: "Conversational EP lessons on daily topics.", englishTranscript: "Conversational EP lessons covering daily topics like shopping, directions, ordering food, and making conversation.", topics: ["Conversação","Vida diária","Vocabulário"] },
  { id: 3, title: "Practice Portuguese — A2 Listening", description: "Structured listening exercises for A2 level with transcripts and slow playback.", type: "audio", difficulty: "Médio", url: "https://practiceportuguese.com/", transcript: "Various dialogues at A2 level including restaurant, shopping, and travel scenarios.", englishTranscript: "Dialogues set in everyday situations: at the restaurant, making a phone call, asking for directions, and booking appointments.", topics: ["Diálogos","Gramática","A2"] },
  { id: 4, title: "YouGlish — European Portuguese", description: "Search any Portuguese phrase and hear it used by real EP speakers in videos.", type: "video", difficulty: "Variado", url: "https://youglish.com/portuguese", transcript: "Search any phrase to hear authentic EP usage from YouTube videos.", englishTranscript: "Search any Portuguese phrase to hear it used naturally by real European Portuguese speakers in authentic video clips.", topics: ["Pronúncia","Frases","EP autêntico"] },
  { id: 5, title: "Learning Portuguese with Paulissa", description: "Numbers, days, months, and time expressions with native speaker audio.", type: "audio", difficulty: "Fácil", url: "https://www.youtube.com/results?search_query=learning+portuguese+with+paulissa", transcript: "Numbers 1-100, days of the week, months of the year, and telling the time.", englishTranscript: "Learn numbers from 1 to 100, the days of the week, months of the year, and how to tell the time in European Portuguese.", topics: ["Números","Dias","Meses","Horas"] },
  { id: 6, title: "Easy Portuguese — Street Interviews", description: "Real Portuguese people interviewed on the street about everyday topics.", type: "video", difficulty: "Médio", url: "https://www.youtube.com/results?search_query=easy+portuguese", transcript: "Spontaneous interviews about family, work, hobbies, and daily routines.", englishTranscript: "Real Portuguese people on the street talking about their families, jobs, hobbies, and what they do in their free time.", topics: ["Entrevistas","Vida real","Conversação"] },
  { id: 7, title: "CIPLE Exam Sample Listening", description: "Sample listening comprehension from past CIPLE exams.", type: "audio", difficulty: "Difícil", url: "https://www.dge.mec.pt/ple", transcript: "Exam-style dialogues with comprehension questions at B1/B2 level.", englishTranscript: "Official CIPLE exam dialogues testing comprehension of formal and informal conversations, announcements, and messages.", topics: ["CIPLE","Exame","Compreensão"] },
  { id: 8, title: "Talk Portuguese — BBC Series", description: "BBC's European Portuguese course with video lessons.", type: "video", difficulty: "Fácil", url: "https://www.bbc.co.uk/languages/portuguese/", transcript: "Structured lessons on greetings, introductions, and basic conversation skills.", englishTranscript: "BBC's EP course covering greetings, introducing yourself, asking for directions, and basic social conversations.", topics: ["Aulas","Iniciantes","Conversação"] },
  { id: 9, title: "Portuguese Music for Learners", description: "Fado and pop music. Great for advanced A2/B1 listening practice.", type: "audio", difficulty: "Avançado", url: "https://www.youtube.com/results?search_query=fado+português+letras", transcript: "Various Portuguese songs including fado and pop with lyrics.", englishTranscript: "Traditional fado and modern pop songs with Portuguese lyrics — great for advanced listening practice and cultural immersion.", topics: ["Fado","Música","Cultura","A2-B1"] },
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
  { id: 'verbs25', label: '25 Verbos', labelEn: '25 Verbs', icon: '⚡' },
  { id: 'conjugation', label: 'Conjugação', labelEn: 'Conjugation', icon: '📐' },
  { id: 'pronouns', label: 'Pronomes', labelEn: 'Pronouns', icon: '👤' },
  { id: 'adjectives', label: 'Adjetivos', labelEn: 'Adjectives', icon: '🎨' },
  { id: 'prepositions', label: 'Preposições', labelEn: 'Prepositions', icon: '📍' },
  { id: 'articles', label: 'Artigos', labelEn: 'Articles', icon: '📝' },
  { id: 'vocabulary', label: 'Vocabulário', labelEn: 'Vocabulary', icon: '📚' },
  { id: 'verbos999', label: '999 Verbos', labelEn: '999 Verbs', icon: '📕' },
  { id: 'modals', label: 'Modais', labelEn: 'Modals', icon: '🔧' },
  { id: 'idioms', label: 'Expressões', labelEn: 'Expressions', icon: '🇵🇹' },
  { id: 'falsefriends', label: 'Falsos Amigos', labelEn: 'False Friends', icon: '⚠️' },
  { id: 'structure', label: 'Frases', labelEn: 'Phrases', icon: '🧱' },
  { id: 'preterito', label: 'Pretéritos', labelEn: 'Past Tense', icon: '⏱️' },
  { id: 'serestar', label: 'Ser/Estar', labelEn: 'Ser/Estar', icon: '🔄' },
  { id: 'escrita', label: 'Escrita', labelEn: 'Writing', icon: '✍️' },
  { id: 'oral', label: 'Oral', labelEn: 'Speaking', icon: '🗣️' },
  { id: 'escuta', label: 'Escuta', labelEn: 'Listening', icon: '🎧' },
  { id: 'glossary', label: 'Glossário', labelEn: 'Glossary', icon: '📖' },
  { id: 'progresso', label: 'Progresso', labelEn: 'Progress', icon: '📊' },
];

// Styles are now in index.css — using CSS class names throughout
const S = {
  app: {},
  header: {},
  title: {},
  subtitle: {},
  nav: {},
  navBtn: () => ({}),
  content: {},
  secTitle: {},
  secDesc: {},
  card: {},
  grid2: {},
  grid3: {},
  verbH: {},
  verbM: {},
  conjGrid: {},
  pron: {},
  conjF: {},
  tag: () => ({}),
  input: {},
  inputC: {},
  inputW: {},
  btn: {},
  toggleRow: {},
  table: {},
  th: {},
  td: {},
  flashcard: {},
  progressBar: {},
  progressFill: () => ({}),
  badge: {},
  badgeGray: {},
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

let currentUtterance = null;

function speakPortuguese(text) {
  if (!window.speechSynthesis) return;
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find(v => 
    v.lang === 'pt-PT' || 
    (v.lang.startsWith('pt') && v.name.toLowerCase().includes('portugal'))
  ) || voices.find(v => v.lang.startsWith('pt'));
  if (ptVoice) {
    utterance.voice = ptVoice;
    utterance.lang = 'pt-PT';
  } else {
    utterance.lang = 'pt';
  }
  utterance.rate = 0.85;
  utterance.pitch = 1;
  currentUtterance = utterance;
  utterance.onend = () => { currentUtterance = null; };
  window.speechSynthesis.speak(utterance);
}

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

function generateLessonPlan(answers) {
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
  const advanced = text.includes('advanced') || text.includes('fluent') || text.includes('b1') || text.includes('b2') || text.includes('c1') || text.includes('proficient');
  
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
  } else if (advanced) {
    addRec('preterito', 'Master the past tense forms - Pretérito Perfeito and Imperfeito');
    addRec('serestar', 'Understand the subtle differences between ser and estar');
    addRec('idioms', 'Learn natural Portuguese expressions and idioms');
    addRec('falsefriends', 'Avoid common mistakes that trip up even advanced learners');
    addRec('escrita', 'Practice formal writing for exams or professional contexts');
  }
  
  const speak = text.includes('speak') || text.includes('talk') || text.includes('conversation') || text.includes('pronunciation') || text.includes('oral');
  const listen = text.includes('listen') || text.includes('audio') || text.includes('video') || text.includes('watch') || text.includes('podcast');
  const write = text.includes('write') || text.includes('essay') || text.includes('exam') || text.includes('cile') || text.includes('writing');
  const read = text.includes('read') || text.includes('reading') || text.includes('text');
  
  if (speak) {
    addRec('oral', 'Practice speaking with shadow dialogues - repeat phrases to improve pronunciation');
    addRec('vocabulary', 'Focus on conversational vocabulary and phrases');
    if (!advanced) addRec('modals', 'Modal verbs help express needs and abilities in conversation');
  }
  if (listen) {
    addRec('escuta', 'Access real Portuguese media - RTP, YouTube channels, podcasts');
    addRec('oral', 'Listen and repeat to improve comprehension and pronunciation');
  }
  if (write) {
    addRec('escrita', 'Practice formal writing with model answers and templates');
    addRec('structure', 'Understand proper sentence construction for written Portuguese');
    addRec('vocabulary', 'Learn formal vocabulary for writing essays and emails');
  }
  if (read) {
    addRec('vocabulary', 'Build vocabulary across different topics and contexts');
  }
  
  const travel = text.includes('travel') || text.includes('vacation') || text.includes('holiday') || text.includes('tourism') || text.includes('trip');
  const living = text.includes('live') || text.includes('living') || text.includes('residence') || text.includes('move') || text.includes('immigrat');
  const business = text.includes('work') || text.includes('business') || text.includes('job') || text.includes('professional') || text.includes('career');
  const family = text.includes('family') || text.includes('husband') || text.includes('wife') || text.includes('partner') || text.includes('children') || text.includes('friend') || text.includes('portuguese partner');
  const exam = text.includes('exam') || text.includes('cile') || text.includes('certification') || text.includes('diploma') || text.includes('test');
  const school = text.includes('school') || text.includes('study') || text.includes('university') || text.includes('student');
  
  if (travel) {
    addRec('vocabulary', 'Essential travel phrases and vocabulary for common situations');
    addRec('oral', 'Practice ordering food, asking directions, and everyday interactions');
    addRec('prepositions', 'Prepositions help with directions and locations while traveling');
    addRec('articles', 'Article usage is crucial for proper pronunciation');
  }
  if (living) {
    addRec('vocabulary', 'Vocabulary for daily life - housing, shopping, healthcare');
    addRec('prepositions', 'Essential for understanding directions and locations');
    addRec('oral', 'Daily conversation practice for integrating into Portuguese life');
    addRec('conjugation', 'Verb forms for discussing daily routines and plans');
  }
  if (business) {
    addRec('escrita', 'Formal email and document writing skills');
    addRec('modals', 'Express obligation, permission, and ability professionally');
    addRec('vocabulary', 'Business vocabulary - meetings, emails, presentations');
    addRec('structure', 'Professional communication structure');
  }
  if (family) {
    addRec('vocabulary', 'Family-related vocabulary for personal conversations');
    addRec('oral', 'Practice informal conversation about daily life');
    addRec('idioms', 'Sound more natural in family conversations');
  }
  if (exam) {
    addRec('escrita', 'Exam writing practice with model answers');
    addRec('oral', 'Oral exam preparation with dialogue practice');
    addRec('structure', 'Grammar and sentence structure for exam success');
    addRec('preterito', 'Past tense is frequently tested in exams');
  }
  if (school) {
    addRec('conjugation', 'Verb conjugations are fundamental for academic Portuguese');
    addRec('vocabulary', 'Academic vocabulary for studying');
    addRec('glossary', 'Grammar terminology in plain language');
  }
  
  const intensive = text.includes('intensive') || text.includes('many hours') || text.includes('full time') || text.includes('dedicated');
  const casual = text.includes('casual') || text.includes('few hours') || text.includes('limited') || text.includes('busy') || text.includes('30 minutes') || text.includes('1 hour');
  
  if (intensive) {
    recommendations.push('verbs999', 'adjectives', 'falsefriends');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('verbs25', 'vocabulary', 'conjugation', 'prepositions', 'oral');
  }
  
  const finalPlan = recommendations.slice(0, 6).map(id => ({
    id,
    ...SECTIONS_MAP[id],
    reason: reasons[id] || SECTIONS_MAP[id]?.desc
  }));
  
  return finalPlan;
}

function OnboardingChat({ onComplete, onSavePlan, savedPlan }) {
  const [answers, setAnswers] = useState({ level: '', goal: '', context: '', time: '' });
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [activeRecordingQuestion, setActiveRecordingQuestion] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [pauseTimer, setPauseTimer] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [durationInterval, setDurationInterval] = useState(null);
  const [maxDurationInterval, setMaxDurationInterval] = useState(null);
  const [lessonPlan, setLessonPlan] = useState(savedPlan || []);
  const [isGenerating, setIsGenerating] = useState(false);

  const questions = [
    { id: 'level', label: "What's your current level in Portuguese?", hint: 'Complete beginner, some basics, or intermediate' },
    { id: 'goal', label: "What brings you to learn Portuguese?", hint: 'Exam, travel, work, family, or just for fun' },
    { id: 'context', label: "Where will you use Portuguese most?", hint: 'Portugal, Brazil, business, daily life, or social' },
    { id: 'time', label: "How much time can you study each week?", hint: 'A few hours, 30 minutes daily, or intensive' }
  ];

  const allAnswered = Object.values(answers).every(a => a.trim());

  const initRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    return rec;
  };

  const stopVoice = (shouldReset = true) => {
    if (recognition) {
      try { recognition.stop(); } catch(e) {}
    }
    if (pauseTimer) clearTimeout(pauseTimer);
    if (durationInterval) clearInterval(durationInterval);
    if (maxDurationInterval) clearTimeout(maxDurationInterval);
    if (shouldReset) {
      setIsListening(false);
      setActiveRecordingQuestion(null);
      setRecognition(null);
      setPauseTimer(null);
      setMaxDurationInterval(null);
      setRecordingDuration(0);
    }
  };

  const startVoice = (questionId) => {
    if (isListening) {
      stopVoice(true);
    }

    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      return;
    }

    const rec = initRecognition();
    if (!rec) return;

    setRecognition(rec);
    setIsListening(true);
    setActiveRecordingQuestion(questionId);
    setTranscript('');
    setActiveQuestion(questionId);
    setCurrentAnswer('');
    setRecordingDuration(0);

    const durInterval = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    setDurationInterval(durInterval);

    const maxDur = setTimeout(() => {
      stopVoice(true);
    }, 60000);
    setMaxDurationInterval(maxDur);

    let latestPauseTimer = null;
    const resetPauseTimer = () => {
      if (latestPauseTimer) clearTimeout(latestPauseTimer);
      latestPauseTimer = setTimeout(() => {
        stopVoice(true);
      }, 12000);
      setPauseTimer(latestPauseTimer);
    };

    rec.onstart = () => {
      setIsListening(true);
      setRecordingDuration(0);
      resetPauseTimer();
    };

    rec.onresult = (event) => {
      const results = Array.from(event.results);
      const transcriptText = results.map(r => r[0].transcript).join('');
      setTranscript(transcriptText);
      setCurrentAnswer(transcriptText);
      resetPauseTimer();

      if (event.results[event.results.length - 1].isFinal) {
        const finalTranscript = event.results[event.results.length - 1][0].transcript;
        setCurrentAnswer(finalTranscript);
        setTranscript(finalTranscript);
        stopVoice(true);
      }
    };

    rec.onerror = () => {
      stopVoice(true);
    };

    rec.onend = () => {
      stopVoice(true);
    };

    try {
      rec.start();
    } catch (e) {
      stopVoice(true);
    }
  };

  const handleQuestionClick = (questionId) => {
    if (isListening) stopVoice();
    setActiveQuestion(questionId);
    setCurrentAnswer(answers[questionId] || '');
    setTranscript(answers[questionId] || '');
  };

  const handleSaveAnswer = (questionId) => {
    if (isListening) stopVoice();
    const textToSave = currentAnswer.trim() || transcript.trim();
    if (textToSave) {
      setAnswers(prev => ({ ...prev, [questionId]: textToSave }));
      setActiveQuestion(null);
      setCurrentAnswer('');
      setTranscript('');
    }
  };

  const handleInputChange = (text) => {
    setCurrentAnswer(text);
    setTranscript(text);
  };

  const [planSource, setPlanSource] = useState('');

  const handleGeneratePlan = async () => {
    if (!allAnswered) return;
    setIsGenerating(true);
    
    try {
      const result = await generateLessonPlanWithLLM(answers);
      setLessonPlan(result.plan || result);
      setPlanSource(result.source || '');
    } catch (error) {
      const plan = generateLessonPlan(answers);
      setLessonPlan(plan);
      setPlanSource('error');
    }
    
    setIsGenerating(false);
  };

  const handleSavePlanToProfile = () => {
    if (lessonPlan.length > 0 && onSavePlan) {
      onSavePlan({ plan: lessonPlan, answers });
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (lessonPlan.length > 0) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px' }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎯</div>
            <h3 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)', fontWeight: 700 }}>Your Personalized Plan</h3>
            <p style={{ margin: '8px 0 0', fontSize: '15px', color: 'var(--text-secondary)' }}>Based on your goals, here's what to study:</p>
            {planSource && (
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: planSource === 'llm' ? 'var(--accent)' : 'var(--warning)' }}>
                {planSource === 'llm' ? '✨ Tailored by Patrick (AI)' : '📋 Generated from your answers'}
              </p>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {lessonPlan.map((item, idx) => (
              <div key={item.id} style={{ 
                background: 'var(--bg)', 
                borderRadius: '12px', 
                padding: '16px',
                borderLeft: `4px solid var(--accent)`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.labelEn}</span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{item.reason}</p>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => onComplete(lessonPlan.map(p => p.id))} 
            style={{ width: '100%', padding: '18px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '17px', fontWeight: 600, boxShadow: '0 4px 16px rgba(0,168,112,0.3)', marginBottom: '12px' }}
          >
            Let's Go! 🚀
          </button>
          
          <button 
            onClick={handleSavePlanToProfile}
            style={{ width: '100%', padding: '16px', background: 'var(--accent-light)', color: 'var(--accent)', border: '2px solid var(--accent)', borderRadius: '14px', cursor: 'pointer', fontSize: '16px', fontWeight: 600 }}
          >
            💾 Save Plan to My Plan
          </button>
          
          <button 
            onClick={() => { setLessonPlan([]); setAnswers({}); setActiveQuestion(null); setCurrentAnswer(''); }} 
            style={{ width: '100%', marginTop: '12px', padding: '14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '15px' }}
          >
            Start over ↺
          </button>
        </div>
        <button onClick={() => onComplete([])} style={{ display: 'block', margin: '20px auto 0', padding: '12px 24px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Browse all sections →
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>💬 Tell me about yourself</h2>
        <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)' }}>Click any question to answer in any order. All questions help create your perfect plan.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id]?.trim();
          const isActive = activeQuestion === q.id;
          const isThisRecording = isListening && activeRecordingQuestion === q.id;
          const hasTranscript = transcript.trim().length > 0;
          
          return (
            <div 
              key={q.id}
              style={{ 
                padding: '20px',
                borderRadius: '16px',
                background: 'var(--bg-card)',
                border: isActive || isThisRecording ? '2px solid var(--accent)' : '2px solid transparent',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease'
              }}
            >
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isActive ? '12px' : '8px', cursor: 'pointer' }}
                onClick={() => handleQuestionClick(q.id)}
              >
                <span style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: isAnswered ? 'var(--accent)' : 'var(--bg-muted)',
                  color: isAnswered ? 'white' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {isAnswered ? '✓' : idx + 1}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{q.label}</span>
              </div>
              
              {isAnswered && !isActive && !isThisRecording && (
                <div 
                  style={{ paddingLeft: '44px', cursor: 'pointer' }}
                  onClick={() => handleQuestionClick(q.id)}
                >
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{answers[q.id]}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--accent)' }}>Tap to edit</p>
                </div>
              )}
              
              {(isActive || isThisRecording) && (
                <div style={{ paddingLeft: '44px' }}>
                  <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--text-tertiary)' }}>{q.hint}</p>
                  
                  <input 
                    type="text" 
                    value={currentAnswer}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Type your answer or tap Record..."
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '15px', outline: 'none', background: 'var(--bg)', marginBottom: '12px', boxSizing: 'border-box' }}
                  />
                  
                  {hasTranscript && (
                    <div style={{ marginBottom: '12px', padding: '12px', background: 'var(--accent-light)', borderRadius: '10px', borderLeft: '3px solid var(--accent)' }}>
                      <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>Voice note:</p>
                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{transcript}</p>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => isThisRecording ? stopVoice() : startVoice(q.id)} 
                      style={{ 
                        padding: '14px 24px', 
                        background: isThisRecording ? '#ff4444' : 'var(--accent)', 
                        border: 'none', 
                        borderRadius: '12px', 
                        cursor: 'pointer', 
                        fontSize: '15px',
                        transition: 'all 0.2s',
                        boxShadow: isThisRecording ? '0 4px 16px rgba(255,68,68,0.4)' : '0 4px 12px rgba(0,168,112,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'white',
                        fontWeight: 600,
                        minWidth: '140px',
                        justifyContent: 'center'
                      }}
                    >
                      {isThisRecording ? (
                        <>
                          ⏹️ Stop ({formatDuration(recordingDuration)})
                        </>
                      ) : (
                        <>
                          🎙️ Record
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => handleSaveAnswer(q.id)}
                      disabled={!hasTranscript && !currentAnswer.trim()}
                      style={{ 
                        padding: '14px 24px', 
                        background: (hasTranscript || currentAnswer.trim()) ? 'var(--accent)' : 'var(--border)',
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '12px', 
                        cursor: (hasTranscript || currentAnswer.trim()) ? 'pointer' : 'not-allowed',
                        fontWeight: 600, 
                        fontSize: '15px',
                        opacity: (hasTranscript || currentAnswer.trim()) ? 1 : 0.5
                      }}
                    >
                      ✓ Save Answer
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button 
          onClick={handleGeneratePlan} 
          disabled={!allAnswered || isGenerating}
          style={{ 
            padding: '18px 48px', 
            background: allAnswered ? (isGenerating ? '#007a52' : 'var(--accent)') : 'var(--border)',
            color: 'white', 
            border: 'none', 
            borderRadius: '14px', 
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            fontSize: '17px',
            fontWeight: 600,
            boxShadow: allAnswered ? '0 4px 20px rgba(0,168,112,0.4)' : 'none',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '0 auto'
          }}
        >
          {isGenerating ? (
            <>⏳ Generating your plan...</>
          ) : (
            <>✨ {allAnswered ? 'Generate My Plan' : `Answer all questions (${Object.values(answers).filter(a => a.trim()).length}/4)`}</>
          )}
        </button>
        <div style={{ marginTop: '16px' }}>
          <button onClick={() => onComplete([])} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Browse all sections →
          </button>
        </div>
      </div>
    </div>
  );
}

async function generateLessonPlanWithLLM(answers) {
  try {
    const response = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers })
    });

    if (!response.ok) {
      throw new Error('API call failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Plan generation error:', error);
  }
  
  return generateLessonPlan(answers);
}

function FloatingChatButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00a870, #008a5a)',
        border: 'none',
        boxShadow: '0 4px 20px rgba(0,168,112,0.4)',
        cursor: 'pointer',
        fontSize: '24px',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      💬
    </button>
  );
}

function ChatModal({ isOpen, onClose }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  
  const addMessage = (text, isUser = false) => {
    setChatHistory(prev => [...prev, { text, isUser, id: Date.now() + Math.random() }]);
  };
  
  const initRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = true;
    return rec;
  };
  
  const startVoice = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      addMessage("Voice recording isn't supported. Try Chrome!");
      return;
    }
    
    const rec = initRecognition();
    if (!rec) return;
    
    setRecognition(rec);
    setIsListening(true);
    setTranscript('');
    
    rec.onstart = () => setIsListening(true);
    
    rec.onresult = (event) => {
      const results = Array.from(event.results);
      const transcriptText = results.map(r => r[0].transcript).join('');
      setTranscript(transcriptText);
      
      if (event.results[event.results.length - 1].isFinal) {
        const finalTranscript = event.results[event.results.length - 1][0].transcript;
        setInput(finalTranscript);
        setIsListening(false);
        handleSubmit(finalTranscript);
      }
    };
    
    rec.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        addMessage("Microphone access denied. Please allow mic permissions.");
      }
    };
    
    rec.onend = () => {
      if (isListening && transcript) {
        handleSubmit(transcript);
      }
      setIsListening(false);
    };
    
    try {
      rec.start();
    } catch (e) {
      setIsListening(false);
    }
  };
  
  const stopVoice = () => {
    if (recognition) recognition.stop();
    setIsListening(false);
  };
  
  const handleSubmit = (text) => {
    if (!text.trim()) return;
    setTranscript('');
    addMessage(text, true);
    const plan = generateLessonPlan(text);
    addMessage(`Based on your goals: ${plan.map(id => SECTIONS_MAP[id]?.icon + ' ' + SECTIONS_MAP[id]?.labelEn).join(', ')}`);
  };
  
  if (!isOpen) return null;
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'var(--bg-card)', borderRadius: '16px 16px 0 0', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px' }}>💬 Patrick</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>Ask me anything about learning Portuguese</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {chatHistory.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', padding: '20px' }}>
              <p>👋 Hi! I'm Patrick. Ask me anything about Portuguese learning!</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>Or tell me your goals and I'll suggest sections.</p>
            </div>
          )}
          {chatHistory.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isUser ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                maxWidth: '80%', 
                padding: '10px 14px', 
                borderRadius: msg.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.isUser ? 'var(--accent)' : 'var(--bg-secondary)',
                color: msg.isUser ? 'white' : 'var(--text-primary)',
                fontSize: '14px',
                lineHeight: 1.5
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {isListening && transcript && (
            <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '14px', fontStyle: 'italic' }}>
              {transcript}...
            </div>
          )}
        </div>
        
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(input)}
            placeholder={isListening ? "Listening..." : "Ask Patrick..."}
            style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none' }}
          />
          <button 
            onClick={isListening ? stopVoice : startVoice} 
            style={{ 
              padding: '12px', 
              background: isListening ? '#ff4444' : 'transparent', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              cursor: 'pointer', 
              fontSize: '16px',
              transition: 'all 0.2s'
            }}
          >
            🎙️
          </button>
          <button onClick={() => handleSubmit(input)} style={{ padding: '12px 16px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>→</button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

const PRONOUNS_EN = {
  'eu': 'I',
  'tu': 'you (informal)',
  'ele': 'he',
  'ela': 'she',
  'você': 'you (formal)',
  'nós': 'we',
  'eles': 'they (m)',
  'elas': 'they (f)',
  'Eu': 'I',
  'Tu': 'you (informal)',
  'Ele': 'he',
  'Ela': 'she',
  'Você': 'you (formal)',
  'Nós': 'we',
  'Eles': 'they (m)',
  'Elas': 'they (f)',
};

function VerbCard({ verb, meaning, conj, conjEn, showEnglish }) {
  const [show, setShow] = useState(false);
  const displayPronouns = showEnglish ? PRONOUNS.map(p => PRONOUNS_EN[p] || p) : PRONOUNS;
  const displayConj = showEnglish && conjEn ? conjEn : conj;
  return (
    <div className="card verb-card" onClick={() => setShow(!show)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="verb-text">{verb}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); speakPortuguese(verb); }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '2px 6px', borderRadius: '4px' }}
            title="Listen to pronunciation"
          >🔊</button>
        </div>
        <span className="verb-meaning">{meaning}</span>
      </div>
      {show && (
        <div className="conj-grid">
          {displayPronouns.map((p, i) => <React.Fragment key={p}><span className="conj-pronoun">{p}</span><span className="conj-form">{displayConj[i]}</span></React.Fragment>)}
        </div>
      )}
      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '8px', textAlign: 'center' }}>{show ? '▲ hide' : '▼ reveal'}</div>
    </div>
  );
}

function VocabCard({ pt, en }) {
  const [show, setShow] = useState(false);
  return (
    <div className="card verb-card" onClick={() => setShow(!show)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="verb-text">{pt}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); speakPortuguese(pt); }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '2px 6px', borderRadius: '4px' }}
            title="Listen to pronunciation"
          >🔊</button>
        </div>
        <span className="verb-meaning">{en}</span>
      </div>
      {show && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div style={{ fontStyle: 'italic' }}>{pt}</div>
        </div>
      )}
      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '8px', textAlign: 'center' }}>{show ? '▲ hide' : '▼ reveal'}</div>
    </div>
  );
}

function AdjectiveCard({ pt, en }) {
  const [show, setShow] = useState(false);
  const masculine = pt;
  const feminine = pt.replace(/o$/, 'a') || pt.replace(/r$/, 'ra') || pt;
  const plural = pt + 's';
  return (
    <div className="card verb-card" onClick={() => setShow(!show)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="verb-text">{pt}</span>
          <button onClick={(e) => { e.stopPropagation(); speakPortuguese(pt); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '2px 6px', borderRadius: '4px' }}>🔊</button>
        </div>
        <span className="verb-meaning">{en}</span>
      </div>
      {show && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div style={{ marginBottom: '6px' }}><strong style={{ color: 'var(--accent)' }}>Masculine:</strong> {masculine}</div>
            <div style={{ marginBottom: '6px' }}><strong style={{ color: '#008a8a' }}>Feminine:</strong> {feminine}</div>
            <div><strong style={{ color: 'var(--warning)' }}>Plural:</strong> {plural}</div>
          </div>
        </div>
      )}
      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '8px', textAlign: 'center' }}>{show ? '▲ hide' : '▼ reveal'}</div>
    </div>
  );
}

function ExpandableCard({ title, children, defaultOpen = false, accentColor }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  return (
    <div className={`expandable-card ${expanded ? 'expanded' : ''}`} style={accentColor ? { borderLeft: `3px solid ${accentColor}` } : {}}>
      <div className="expandable-header" onClick={() => setExpanded(!expanded)}>
        <div className="expandable-title">{title}</div>
        <div className="expandable-chevron">{expanded ? '▲' : '▼'}</div>
      </div>
      {expanded && <div className="expandable-content">{children}</div>}
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
        <span className="badge">{Math.min(idx+1, items.length)} / {items.length}</span>
        {score.total > 0 && <span style={{ fontSize: '12px', color: '#7a8a80' }}>{score.correct}/{score.total} correct</span>}
      </div>
      <div className="progress-bar"><div className="progress-fill" style={{width: ((idx % items.length) / items.length) * 100 + "%"}} /></div>
      <div className="flashcard" onClick={() => setFlipped(!flipped)}>
        {!flipped ? (
          <><div style={{ fontSize: '10px', color: '#7a8a80', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '1px' }}>{title || 'Português'}</div><div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '26px', color: '#1a1a1a' }}>{typeof frontKey === 'function' ? frontKey(current) : current[frontKey]}</div><div style={{ fontSize: '11px', color: '#444', marginTop: '14px' }}>tap to flip</div></>
        ) : (
          <><div style={{ fontSize: '10px', color: '#7a8a80', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '1px' }}>English</div><div style={{ fontSize: '20px', color: '#00a870', fontWeight: 500 }}>{typeof backKey === 'function' ? backKey(current) : current[backKey]}</div><div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}><button style={{ ...S.btn, borderColor: '#b82035', color: '#b82035', background: 'rgba(184,32,53,0.1)', padding: '8px 16px' }} onClick={(e) => { e.stopPropagation(); next(false); }}>Again</button><button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); next(true); }}>Got it</button></div></>
        )}
      </div>
    </div>
  );
}

function FillGap({ exercises, showEnglish }) {
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
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => setShowHints(!showHints)}>{showHints ? 'Hide Hints' : 'Show Hints'}</button>
        <button className="btn btn-primary" onClick={checkAll}>Check All</button>
        {attempted > 0 && <span className="badge">{score}/{attempted} correct</span>}
      </div>
      {exercises.map((ex, i) => {
        const sentence = showEnglish && ex.sentenceEn ? ex.sentenceEn : ex.sentence;
        const parts = sentence.split('___');
        const isChk = checked[i] !== undefined;
        const isCorr = checked[i];
        return (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '15px' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 600, minWidth: '24px' }}>{i+1}.</span>
              <span style={{ color: 'var(--text-primary)' }}>{parts[0]}</span>
              <input className="input" style={{ width: '120px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 600 }} value={answers[i] || ''} onChange={(e) => { setAnswers(a => ({ ...a, [i]: e.target.value })); setChecked(c => { const n = { ...c }; delete n[i]; return n; }); }} onKeyDown={(e) => e.key === 'Enter' && check(i)} placeholder="..." />
              <span style={{ color: 'var(--text-primary)' }}>{parts[1]}</span>
              <button onClick={() => speakPortuguese(ex.sentence)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 6px' }}>🔊</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {showHints && <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{ex.hint}</span>}
              {isChk && !isCorr && <span style={{ fontSize: '12px', color: 'var(--error)' }}>→ {ex.answer}</span>}
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
    <ExpandableCard title={<span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>"{scenario}" <button onClick={(e) => { e.stopPropagation(); speakPortuguese(scenario); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px 4px' }}>🔊</button></span>} accentColor="var(--border-strong)" defaultOpen>
      <div style={{ marginTop: '8px' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{question}</div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          {['ser','estar'].map(c => (
            <button key={c} onClick={() => handleSelect(c)} style={{ padding: '8px 20px', borderRadius: '8px', border: '2px solid ' + (selected === c ? (c === correct ? 'var(--accent)' : 'var(--error)') : 'var(--border)'), background: selected === c ? (c === correct ? 'var(--accent-light)' : 'var(--error-light)') : 'transparent', color: selected === c ? (c === correct ? 'var(--accent)' : 'var(--error)') : 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' }}>{c}</button>
          ))}
        </div>
        {revealed && (
          <div style={{ padding: '12px', background: selected === correct ? 'var(--accent-light)' : 'var(--error-light)', borderRadius: '8px', border: '1px solid ' + (selected === correct ? 'var(--accent)' : 'var(--error)') }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: selected === correct ? 'var(--accent)' : 'var(--error)', marginBottom: '6px' }}>{selected === correct ? '✓ Correct!' : `✗ Wrong — answer: ${correct}`}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{explanation}</div>
            {note && <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px', fontStyle: 'italic' }}>💡 {note}</div>}
          </div>
        )}
      </div>
    </ExpandableCard>
  );
}

function WritingTask({ task, showEnglish }) {
  const [showPT, setShowPT] = useState(false);
  const effectiveShowEn = showEnglish && !showPT;
  return (
    <ExpandableCard
      title={task.title}
      accentColor="var(--accent)"
    >
      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span className="tag tag-teal">{task.type}</span>
          <span className="tag">{task.targetWords} words</span>
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>{task.description}</div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Key vocabulary</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {task.keyVocab.map((v, i) => <span key={i} style={{ background: 'rgba(0,138,138,0.08)', color: '#008a8a', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>{v}</span>)}
          </div>
        </div>
        <div style={{ background: 'rgba(0,168,112,0.04)', border: '1px solid rgba(0,168,112,0.12)', borderRadius: '8px', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Model Answer {effectiveShowEn ? '(EN)' : '(PT)'}</div>
            {task.englishAnswer && <button onClick={() => setShowPT(!showPT)} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(0,138,138,0.3)', background: showPT ? 'rgba(0,138,138,0.1)' : 'transparent', color: '#008a8a', cursor: 'pointer' }}>{showPT ? 'Show EN' : 'Show PT'}</button>}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', flex: 1 }}>{effectiveShowEn ? task.englishAnswer : task.modelAnswer}</div>
            <button onClick={() => speakPortuguese(task.modelAnswer)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>🔊</button>
          </div>
        </div>
      </div>
    </ExpandableCard>
  );
}

function OralDialogue({ dialogue, showEnglish }) {
  const [showPT, setShowPT] = useState(false);
  const effectiveShowEn = showEnglish && !showPT;
  const difficultyColor = dialogue.difficulty === 'Fácil' ? 'var(--accent)' : dialogue.difficulty === 'Médio' ? 'var(--warning)' : 'var(--error)';
  const dialogueLines = effectiveShowEn && dialogue.englishDialogue ? dialogue.englishDialogue : dialogue.dialogue;
  return (
    <ExpandableCard
      title={dialogue.title}
      accentColor={difficultyColor}
    >
      <div style={{ marginTop: '12px' }}>
        {dialogue.tip && <div style={{ fontSize: '12px', color: '#008a8a', fontStyle: 'italic', marginBottom: '12px', padding: '8px 12px', background: 'rgba(0,138,138,0.06)', borderRadius: '6px' }}>💡 {dialogue.tip}</div>}
        <div style={{ marginBottom: '12px' }}>
          {dialogueLines.map((line, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '14px', alignItems: 'flex-start' }}>
              <span style={{ fontWeight: 700, color: line.speaker === 'A' || line.speaker === 'Cliente' || line.speaker === 'Paciente' || line.speaker === 'Passageiro' ? 'var(--accent)' : '#008a8a', minWidth: '80px' }}>{line.speaker}:</span>
              <span style={{ color: 'var(--text-primary)', flex: 1 }}>{line.text}</span>
              <button onClick={() => speakPortuguese(line.text)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 4px' }}>🔊</button>
            </div>
          ))}
        </div>
        {dialogue.englishDialogue && (
          <button onClick={() => setShowPT(!showPT)} style={{ marginBottom: '12px', fontSize: '12px', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(0,138,138,0.3)', background: showPT ? 'rgba(0,138,138,0.1)' : 'transparent', color: '#008a8a', cursor: 'pointer' }}>{showPT ? 'Show EN' : 'Show PT'}</button>
        )}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Key phrases</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{dialogue.keyPhrases.map((p, i) => <span key={i} style={{ background: 'rgba(0,138,138,0.08)', color: '#008a8a', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>{p} <button onClick={() => speakPortuguese(p)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '11px', padding: '2px' }}>🔊</button></span>)}</div>
        </div>
      </div>
    </ExpandableCard>
  );
}

function ListeningItem({ item, showEnglish }) {
  const [showTranscript, setShowTranscript] = useState(false);
  const effectiveShowTranscript = showTranscript || showEnglish;
  const difficultyColor = item.difficulty === 'Fácil' ? 'var(--accent)' : item.difficulty === 'Médio' ? 'var(--warning)' : 'var(--error)';
  
  return (
    <ExpandableCard
      title={item.title}
      accentColor={difficultyColor}
    >
      <div style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>{item.description}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>{item.topics.map((t, i) => <span key={i} style={{ background: 'rgba(0,138,138,0.08)', color: '#008a8a', padding: '4px 10px', borderRadius: '6px', fontSize: '11px' }}>{t}</span>)}</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">▶ Open Resource</a>
          <button style={{ border: '1px solid #008a8a', color: '#008a8a', background: effectiveShowTranscript ? 'rgba(0,138,138,0.1)' : 'transparent', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }} onClick={() => setShowTranscript(!showTranscript)}>{effectiveShowTranscript ? 'Hide Transcript' : 'Show Transcript'}</button>
        </div>
        {effectiveShowTranscript && (
          <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(0,138,138,0.04)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: '#008a8a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 600 }}>{effectiveShowTranscript && item.englishTranscript ? 'English' : 'Portuguese'}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.7, fontFamily: 'var(--font-mono)' }}>{effectiveShowTranscript && item.englishTranscript ? item.englishTranscript : item.transcript}</div>
          </div>
        )}
      </div>
    </ExpandableCard>
  );
}

function GlossaryEntry({ term }) {
  return (
    <ExpandableCard title={<span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{term.term} <button onClick={(e) => { e.stopPropagation(); speakPortuguese(term.term); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px 4px' }}>🔊</button></span>} accentColor="var(--accent)">
      <div style={{ marginTop: '8px' }}>
        <span className="badge" style={{ marginBottom: '10px', display: 'inline-block' }}>{term.category}</span>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '10px' }}>{term.explanation}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Example: {term.example} <button onClick={() => speakPortuguese(term.example)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px 4px' }}>🔊</button></div>
      </div>
    </ExpandableCard>
  );
}

function ProgressSection({ showEnglish }) {
  const [wrongKey] = useLocal('wrong', {});
  const [totalSessions] = useLocal('sessions', 0);
  const wrongCount = Object.values(wrongKey).reduce((a, b) => a + b, 0);
  const uniqueWrong = Object.keys(wrongKey).length;
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Your Progress' : 'O Teu Progresso'}</h2>
      <p className="sec-desc">{showEnglish ? 'Track your study progress. Data is stored locally in your browser.' : 'Acompanha o teu progresso de estudo. Os dados são guardados no teu navegador.'}</p>
      <div className="grid-2">
        <div style={{ ...S.card, background: 'rgba(0,168,112,0.05)', border: '1px solid rgba(0,168,112,0.15)' }}>
          <div style={{ fontSize: '32px', fontFamily: "'DM Serif Display',serif", color: '#00a870', marginBottom: '4px' }}>{totalSessions}</div>
          <div style={{ fontSize: '12px', color: '#7a8a80' }}>{showEnglish ? 'Study sessions' : 'Sessões de estudo'}</div>
        </div>
        <div style={{ ...S.card, background: 'rgba(184,32,53,0.05)', border: '1px solid rgba(184,32,53,0.15)' }}>
          <div style={{ fontSize: '32px', fontFamily: "'DM Serif Display',serif", color: '#b82035', marginBottom: '4px' }}>{wrongCount}</div>
          <div style={{ fontSize: '12px', color: '#7a8a80' }}>{showEnglish ? 'Wrong answers' : 'Respostas erradas'}</div>
        </div>
        <div style={{ ...S.card, background: 'rgba(0,138,138,0.05)', border: '1px solid rgba(0,138,138,0.15)' }}>
          <div style={{ fontSize: '32px', fontFamily: "'DM Serif Display',serif", color: '#008a8a', marginBottom: '4px' }}>{uniqueWrong}</div>
          <div style={{ fontSize: '12px', color: '#7a8a80' }}>{showEnglish ? 'Words to review' : 'Palavras a rever'}</div>
        </div>
        <div style={{ ...S.card }}>
          <div style={{ fontSize: '13px', color: '#7a8a80', lineHeight: 1.6 }}>
            <p style={{ marginBottom: '8px' }}>💡 <strong style={{ color: '#1a1a1a' }}>{showEnglish ? 'Tip' : 'Dica'}:</strong> {showEnglish ? 'Use flashcards regularly to memorize vocabulary.' : 'Usa os flashcards regularmente para memorizar vocabulário.'}</p>
            <p>{showEnglish ? '❌ Wrong words appear more frequently in flashcards.' : '❌ As palavras erradas aparecem com mais frequência nos flashcards.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION VIEWS ─────────────────────────────────────────────────────────────

function Verbs25Section({ showEnglish }) {
  const [mode, setMode] = useState('grid');
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? '25 Most Used Verbs' : '25 Verbos Mais Usados'}</h2>
      <p className="sec-desc">{showEnglish ? 'Essential verbs for A2. Master these in present tense first, then expand to past and future.' : 'Essential verbs for A2. Master these in present tense first, then expand to past and future.'}</p>
      <div className="toggle-row">
        <button className={mode === 'grid' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setMode('grid')}>{showEnglish ? 'Reference' : 'Reference'}</button>
        <button className={mode === 'flash' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setMode('flash')}>{showEnglish ? 'Flashcards' : 'Flashcards'}</button>
      </div>
      {mode === 'grid' ? <div className="grid-2">{TOP_25_VERBS.map(v => <VerbCard key={v.verb} {...v} showEnglish={showEnglish} />)}</div> : <FlashcardDrill items={TOP_25_VERBS} frontKey="verb" backKey="meaning" title="Verbo" sectionId="verbs25" />}
    </div>
  );
}

function ConjugationSection({ showEnglish }) {
  const [tense, setTense] = useState('Presente');
  const data = CONJUGATION_PATTERNS[tense];
  const tenseLabels = showEnglish ? { 'Presente': 'Present', 'Pretérito Perfeito': 'Perfect', 'Pretérito Imperfeito': 'Imperfect', 'Futuro': 'Future', 'Condicional': 'Conditional' } : {};
  const displayPronouns = showEnglish ? PRONOUNS.map(p => PRONOUNS_EN[p] || p) : PRONOUNS;
  const exampleArEn = "falar → falo, falas, fala, falamos, falais, falam";
  const exampleErEn = "comer → como, comes, come, comemos, comeis, comem";
  const exampleIrEn = "partir → parto, partes, parte, partimos, partis, partem";
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Regular Conjugation' : 'Conjugação Regular'}</h2>
      <p className="sec-desc">{showEnglish ? 'Regular verb endings for -AR, -ER, and -IR verbs. Learn the patterns and conjugate hundreds.' : 'Regular verb endings for -AR, -ER, and -IR verbs. Learn the patterns and conjugate hundreds.'}</p>
      <div className="toggle-row">{Object.keys(CONJUGATION_PATTERNS).map(t => <button key={t} className={tense === t ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setTense(t)}>{tenseLabels[t] || t}</button>)}</div>
      {[['ar','var(--accent)'],['er','#008a8a'],['ir','var(--warning)']].map(([type,col]) => (
        <ExpandableCard key={type} title={showEnglish ? `-${type.toUpperCase()} verbs` : `-${type.toUpperCase()} verbs`} accentColor={col}>
          <div style={{ marginTop: '12px' }}>
            <div className="conj-grid">{displayPronouns.map((p, i) => <React.Fragment key={p}><span className="conj-pronoun">{p}</span><span style={{ color: col, fontWeight: 600 }}>{data[type][i]}</span></React.Fragment>)}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px', fontFamily: 'var(--font-mono)', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>{showEnglish ? (type === 'ar' ? exampleArEn : type === 'er' ? exampleErEn : exampleIrEn) : data['example_'+type]}</div>
          </div>
        </ExpandableCard>
      ))}
      <div className="card" style={{ marginTop: '16px', background: 'rgba(0,168,112,0.06)', border: '1px solid rgba(0,168,112,0.15)' }}>
        <strong style={{ color: 'var(--accent)' }}>EP Note:</strong> {showEnglish ? 'In European Portuguese, present continuous uses' : 'In European Portuguese, present continuous uses'} <strong>estar + a + infinitive</strong>: "Estou a falar" (I am speaking), not "Estou falando" (BP).
      </div>
    </div>
  );
}

function PronounsSection({ showEnglish }) {
  const [cat, setCat] = useState(Object.keys(PRONOUNS_DATA)[0]);
  const catLabels = showEnglish ? { 'Pessoais': 'Personal', 'Demonstrativos': 'Demonstrative', 'Possessivos': 'Possessive', 'Relativos': 'Relative', 'Indefinidos': 'Indefinite' } : {};
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Portuguese Pronouns' : 'Pronomes Portugueses'}</h2>
      <p className="sec-desc">{showEnglish ? 'European Portuguese pronoun system. Note: "tu" is widely used in EP, unlike Brazilian Portuguese where "você" dominates.' : 'European Portuguese pronoun system. Note: "tu" is widely used in EP, unlike Brazilian Portuguese where "você" dominates.'}</p>
      <div className="toggle-row">{Object.keys(PRONOUNS_DATA).map(c => <button key={c} className={cat === c ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setCat(c)}>{catLabels[c] || c}</button>)}</div>
      <div className="card">
        <table className="data-table"><thead><tr><th>Português</th><th>English</th></tr></thead>
          <tbody>{PRONOUNS_DATA[cat].map(([pt,en], i) => <tr key={i}><td className="col-pt">{pt}</td><td className="col-en">{en}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="card" style={{ marginTop: '12px', background: 'rgba(0,168,112,0.04)', border: '1px solid rgba(0,168,112,0.15)' }}>
        <strong style={{ color: 'var(--accent)' }}>EP Tip:</strong> {showEnglish ? 'In EP, object pronouns come after the verb with a hyphen:' : 'In EP, object pronouns come after the verb with a hyphen:'} "Ele deu-<strong>me</strong> o livro" (He gave me the book).
      </div>
    </div>
  );
}

function AdjectivesSection({ showEnglish }) {
  const [mode, setMode] = useState('grid');
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? '40 Essential Adjectives' : '40 Adjetivos Essenciais'}</h2>
      <p className="sec-desc">{showEnglish ? 'Core adjectives for A2. Remember: most adjectives agree in gender and number. Tap any adjective to see masculine, feminine, and plural forms.' : 'Core adjectives for A2. Remember: most adjectives agree in gender and number. Tap any adjective to see masculine, feminine, and plural forms.'}</p>
      <div className="toggle-row"><button className={mode === 'grid' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setMode('grid')}>{showEnglish ? 'Reference' : 'Reference'}</button><button className={mode === 'flash' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setMode('flash')}>{showEnglish ? 'Flashcards' : 'Flashcards'}</button></div>
      {mode === 'grid' ? <div className="grid-2">{ADJECTIVES.map(([pt,en], i) => <AdjectiveCard key={i} pt={pt} en={en} />)}</div> : <FlashcardDrill items={ADJECTIVES.map(([pt,en]) => ({ pt, en }))} frontKey="pt" backKey="en" title="Adjetivo" sectionId="adjectives" />}
    </div>
  );
}

function PrepositionsSection({ showEnglish }) {
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Prepositions — Fill in the blanks' : 'Preposições — Preenche os espaços'}</h2>
      <p className="sec-desc">{showEnglish ? 'Practice with: em, de, para, com, sem, entre, sobre, a, por, até — and their contracted forms (no, na, ao, à, do, da...)' : 'Practice with: em, de, para, com, sem, entre, sobre, a, por, até — and their contracted forms (no, na, ao, à, do, da...)'}</p>
      <FillGap exercises={PREPOSITION_EXERCISES} showEnglish={showEnglish} />
    </div>
  );
}

function ArticlesSection({ showEnglish }) {
  const [view, setView] = useState('ref');
  const articleTitles = showEnglish ? { 'definite': 'Definite Articles', 'indefinite': 'Indefinite Articles' } : {};
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Articles & Contractions' : 'Artigos e Contrações'}</h2>
      <p className="sec-desc">{showEnglish ? 'Definite and indefinite articles, plus essential contractions with prepositions.' : 'Definite and indefinite articles, plus essential contractions with prepositions.'}</p>
      <div className="toggle-row"><button className={view === 'ref' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setView('ref')}>{showEnglish ? 'Reference' : 'Reference'}</button><button className={view === 'practice' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setView('practice')}>{showEnglish ? 'Practice' : 'Practice'}</button></div>
      {view === 'ref' ? (
        <>
          {['definite','indefinite'].map(type => (
            <div key={type} className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '12px' }}>{articleTitles[type] || ARTICLES_DATA[type].title}</h3>
              <table className="data-table"><thead><tr><th>Usage</th><th>Article</th><th>Example</th></tr></thead>
                <tbody>{ARTICLES_DATA[type].forms.map((f, i) => <tr key={i}><td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{f.label}</td><td className="col-pt" style={{ fontSize: '15px' }}>{f.article}</td><td style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>{f.example} <button onClick={() => speakPortuguese(f.example)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '11px', padding: '2px' }}>🔊</button></td></tr>)}</tbody>
              </table>
            </div>
          ))}
          <ExpandableCard title={showEnglish ? 'Contractions' : 'Contrações'} accentColor="#008a8a">
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ARTICLES_DATA.definite.contractions.map((row, i) => <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>{row.map((c, j) => <span key={j} style={{ background: 'rgba(0,138,138,0.08)', color: '#008a8a', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{c}</span>)}</div>)}
            </div>
          </ExpandableCard>
        </>
      ) : <FillGap exercises={ARTICLES_EXERCISES} showEnglish={showEnglish} />}
    </div>
  );
}

function VocabularySection({ showEnglish }) {
  const [topic, setTopic] = useState(Object.keys(VOCABULARY)[0]);
  const [mode, setMode] = useState('grid');
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Vocabulary by Topic' : 'Vocabulário por Tema'}</h2>
      <p className="sec-desc">{showEnglish ? 'A2+ vocabulary organized by CIPLE exam topics. Learn with the articles!' : 'A2+ vocabulary organized by CIPLE exam topics. Learn with the articles!'}</p>
      <div className="toggle-row">{Object.keys(VOCABULARY).map(t => <button key={t} className={topic === t ? 'toggle-btn active' : 'toggle-btn'} onClick={() => { setTopic(t); setMode('grid'); }}>{showEnglish ? t : t}</button>)}</div>
      <div style={{ marginBottom: '10px' }}><button className={mode === 'grid' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setMode('grid')}>{showEnglish ? 'Reference' : 'Reference'}</button><button style={{ ...S.navBtn(mode === 'flash'), marginLeft: '5px' }} onClick={() => setMode('flash')}>{showEnglish ? 'Flashcards' : 'Flashcards'}</button></div>
      {mode === 'grid' ? <div className="grid-2">{VOCABULARY[topic].map(([pt,en], i) => <VocabCard key={i} pt={pt} en={en} />)}</div> : <FlashcardDrill items={VOCABULARY[topic].map(([pt,en]) => ({ pt, en }))} frontKey="pt" backKey="en" title={topic} sectionId={'vocab_'+topic} />}
    </div>
  );
}

function ModalsSection({ showEnglish }) {
  const displayPronouns = showEnglish ? PRONOUNS.map(p => PRONOUNS_EN[p] || p) : PRONOUNS;
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Modal Verbs' : 'Verbos Modais'}</h2>
      <p className="sec-desc">{showEnglish ? 'Modal verbs express ability, obligation, desire, and necessity. Critical for A2 communication.' : 'Modal verbs express ability, obligation, desire, and necessity. Critical for A2 communication.'}</p>
      {MODAL_VERBS.map((m, i) => (
        <ExpandableCard key={i} title={`${m.verb} — ${m.meaning}`} accentColor="var(--accent)">
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{m.usage}</div>
              <button onClick={() => speakPortuguese(m.verb)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 6px', borderRadius: '4px' }}>🔊</button>
            </div>
            <div className="conj-grid">{displayPronouns.map((p, j) => <React.Fragment key={p}><span className="conj-pronoun">{p}</span><span className="conj-form">{m.presente[j]}</span></React.Fragment>)}</div>
            <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              {m.examples.map((ex, j) => <div key={j} style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '4px 0', fontFamily: 'var(--font-mono)' }}>{ex} <button onClick={() => speakPortuguese(ex)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px 4px' }}>🔊</button></div>)}
            </div>
          </div>
        </ExpandableCard>
      ))}
    </div>
  );
}

function IdiomsSection({ showEnglish }) {
  const [mode, setMode] = useState('list');
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Idiomatic Expressions' : 'Expressões Idiomáticas'}</h2>
      <p className="sec-desc">{showEnglish ? 'Common Portuguese expressions. Knowing these will impress in conversation.' : 'Common Portuguese expressions. Knowing these will impress in conversation.'}</p>
      <div className="toggle-row"><button className={mode === 'list' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setMode('list')}>{showEnglish ? 'Reference' : 'Reference'}</button><button className={mode === 'flash' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setMode('flash')}>{showEnglish ? 'Flashcards' : 'Flashcards'}</button></div>
      {mode === 'list' ? IDIOMS.map((idiom, i) => (
        <ExpandableCard key={i} title={showEnglish ? `"${idiom.en}"` : `"${idiom.pt}"`} accentColor="var(--accent)">
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--accent)', fontWeight: 500 }}>
              <span>{showEnglish ? idiom.pt : idiom.en}</span>
              <button onClick={() => speakPortuguese(showEnglish ? idiom.pt : idiom.en)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 6px' }}>🔊</button>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>Literal: {idiom.literal}</div>
          </div>
        </ExpandableCard>
      )) : <FlashcardDrill items={IDIOMS} frontKey="pt" backKey={(item) => item.en+'\n(Literal: '+item.literal+')'} title={showEnglish ? 'Expression' : 'Expressão'} sectionId="idioms" />}
    </div>
  );
}

function FalseFriendsSection({ showEnglish }) {
  const [mode, setMode] = useState('list');
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'False Friends' : 'Falsos Amigos'}</h2>
      <p className="sec-desc">{showEnglish ? 'Words that look like English but mean something different. Essential to avoid mistakes!' : 'Words that look like English but mean something different. Essential to avoid mistakes!'}</p>
      <div className="toggle-row"><button className={mode === 'list' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setMode('list')}>{showEnglish ? 'Reference' : 'Reference'}</button><button className={mode === 'flash' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setMode('flash')}>{showEnglish ? 'Flashcards' : 'Flashcards'}</button></div>
      {mode === 'list' ? FALSE_FRIENDS.map((ff, i) => (
        <ExpandableCard key={i} title={showEnglish ? ff.pt : ff.pt} accentColor="var(--error)">
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--error)', marginBottom: '4px' }}>
              <span><span style={{ textDecoration: 'line-through' }}>✗ {ff.seems}</span></span>
              <button onClick={() => speakPortuguese(ff.pt)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px 4px' }}>🔊</button>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: 500 }}>✓ {ff.actually}</div>
          </div>
        </ExpandableCard>
      )) : <FlashcardDrill items={FALSE_FRIENDS} frontKey="pt" backKey={(item) => 'NOT "'+item.seems+'" → '+item.actually} title={showEnglish ? 'False Friend' : 'Falso Amigo'} sectionId="falsefriends" />}
    </div>
  );
}

function StructureSection({ showEnglish }) {
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Sentence Structure' : 'Estrutura das Frases'}</h2>
      <p className="sec-desc">{showEnglish ? 'Core sentence patterns for A2. European Portuguese follows SVO order. Tap each pattern to see examples and usage tips.' : 'Core sentence patterns for A2. European Portuguese follows SVO order. Tap each pattern to see examples and usage tips.'}</p>
      {SENTENCE_STRUCTURE.map((s, i) => (
        <ExpandableCard key={i} title={s.pattern} accentColor="#008a8a">
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '6px' }}>
              <span>{s.example}</span>
              <button onClick={() => speakPortuguese(s.example)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 6px' }}>🔊</button>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{s.translation}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{showEnglish ? 'Usage: Replace the highlighted words with your own vocabulary to create sentences.' : 'Usage: Replace the highlighted words with your own vocabulary to create sentences.'}</div>
          </div>
        </ExpandableCard>
      ))}
      <div className="card" style={{ marginTop: '16px', background: 'rgba(0,168,112,0.04)', border: '1px solid rgba(0,168,112,0.15)' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)', marginBottom: '10px' }}>{showEnglish ? 'How to Use These Patterns' : 'How to Use These Patterns'}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <p style={{ marginBottom: '8px' }}>1. <strong>Identify the pattern type</strong> — statement, question, negation, etc.</p>
          <p style={{ marginBottom: '8px' }}>2. <strong>Replace the placeholder words</strong> with your own vocabulary while keeping the structure.</p>
          <p style={{ marginBottom: '8px' }}>3. <strong>Notice the word order</strong> — EP uses SVO (Subject-Verb-Object) like English.</p>
          <p>4. <strong>Practice aloud</strong> — shadow the examples to improve pronunciation.</p>
        </div>
      </div>
      <ExpandableCard title={showEnglish ? 'EP-Specific Patterns' : 'EP-Specific Patterns'} accentColor="var(--accent)">
        <div style={{ marginTop: '8px', fontSize: '14px', lineHeight: 1.8 }}>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: 'var(--accent)' }}>Continuous:</strong> Use <strong>estar + a + infinitive</strong> for ongoing actions<br/>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>→ "Estou a comer" (I am eating) — not "Estou comendo" (BP) <button onClick={() => speakPortuguese('Estou a comer')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px 4px' }}>🔊</button></span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: 'var(--accent)' }}>Clitic placement:</strong> Pronouns come after the verb, joined by hyphen<br/>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>→ "Ele deu-me o livro" (He gave me the book) <button onClick={() => speakPortuguese('Ele deu-me o livro')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px 4px' }}>🔊</button></span>
          </div>
          <div>
            <strong style={{ color: 'var(--accent)' }}>Mesoclisis:</strong> Pronouns insert into the future/past verb<br/>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>→ "Dir-lhe-ei amanhã" (I will tell him tomorrow) — unique to EP <button onClick={() => speakPortuguese('Dir-lhe-ei amanhã')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px 4px' }}>🔊</button></span>
          </div>
        </div>
      </ExpandableCard>
    </div>
  );
}

function PreteritoSection({ showEnglish }) {
  const [mode, setMode] = useState('explain');
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Past Tense: Perfect vs Imperfect' : 'Pretérito Perfeito vs Imperfeito'}</h2>
      <p className="sec-desc">{showEnglish ? 'The most important grammar distinction in Portuguese past tense. Most learners fail here at A2.' : 'The most important grammar distinction in Portuguese past tense. Most learners fail here at A2.'}</p>
      <div className="toggle-row">
        <button className={mode === 'explain' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setMode('explain')}>{showEnglish ? 'Explanation' : 'Explanation'}</button>
        <button className={mode === 'practice' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setMode('practice')}>{showEnglish ? 'Practice' : 'Practice'}</button>
      </div>
      {mode === 'explain' ? (
        <>
          <ExpandableCard title={showEnglish ? "Perfect — Specific, Completed" : "Pretérito Perfeito — Specific, Completed"} accentColor="var(--accent)" defaultOpen>
            <div style={{ marginTop: '12px', fontSize: '14px', lineHeight: 1.7 }}>
              <p style={{ marginBottom: '8px' }}>Use <strong>Perfeito</strong> when:</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
                <li>The action happened at a <strong>specific time</strong> (ontem, às três horas, no verão passado)</li>
                <li>The action is <strong>completed</strong> — it has a clear beginning and end</li>
                <li>You're describing a <strong>one-time event</strong></li>
              </ul>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--accent)', padding: '8px 12px', background: 'var(--accent-light)', borderRadius: '6px' }}>Falei com ele ontem. (I spoke with him yesterday.)</div>
            </div>
          </ExpandableCard>
          <ExpandableCard title={showEnglish ? "Imperfect — Ongoing, Habitual, Descriptive" : "Pretérito Imperfeito — Ongoing, Habitual, Descriptive"} accentColor="#008a8a">
            <div style={{ marginTop: '12px', fontSize: '14px', lineHeight: 1.7 }}>
              <p style={{ marginBottom: '8px' }}>Use <strong>Imperfeito</strong> when:</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
                <li>The action was <strong>habitual</strong> or repeated (todos os dias, sempre)</li>
                <li>You're <strong>describing</strong> what something was like in the past</li>
                <li>There's <strong>no specific time</strong> mentioned</li>
                <li>Describing someone's <strong>age, personality, or physical state</strong> in the past</li>
              </ul>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#008a8a', padding: '8px 12px', background: 'rgba(0,138,138,0.06)', borderRadius: '6px' }}>Falava português todos os dias. (I used to speak Portuguese every day.)</div>
            </div>
          </ExpandableCard>
          <ExpandableCard title={showEnglish ? "Key Signal Words" : "Key Signal Words"} accentColor="var(--warning)">
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ background: 'var(--warning-light)', color: 'var(--warning)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>Perfeito: ontem, às 3h, no verão passado, já, uma vez</span>
              <span style={{ background: 'rgba(0,138,138,0.08)', color: '#008a8a', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>Imperfeito: sempre, todos os dias, frequentemente, quando era novo</span>
            </div>
          </ExpandableCard>
        </>
      ) : (
        <div>
          {PRETERITO_EXERCISES.map(ex => (
            <ExpandableCard key={ex.id} title={<span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{showEnglish && ex.sentenceEn ? ex.sentenceEn : ex.sentence} <button onClick={(e) => { e.stopPropagation(); speakPortuguese(ex.sentence); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px 4px' }}>🔊</button></span>} accentColor="var(--border-strong)">
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontStyle: 'italic', marginBottom: '8px' }}>Hint: {ex.hint}</div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--accent)' }}>✓ Perfeito: <strong>{ex.correct_perfeito}</strong></span>
                  <span style={{ fontSize: '13px', color: '#008a8a' }}>✓ Imperfeito: <strong>{ex.correct_imperfeito}</strong></span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>{ex.explanation}</div>
              </div>
            </ExpandableCard>
          ))}
        </div>
      )}
    </div>
  );
}

function SerEstarSection({ showEnglish }) {
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Ser vs Estar' : 'Ser vs Estar'}</h2>
      <p className="sec-desc">{showEnglish ? 'The most important distinction in Portuguese. Both mean "to be" but are used differently.' : 'The most important distinction in Portuguese. Both mean "to be" but are used differently.'}</p>
      <div className="card" style={{ marginBottom: '16px', background: 'rgba(0,168,112,0.04)', border: '1px solid rgba(0,168,112,0.15)' }}>
        <p style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: 600, marginBottom: '8px' }}>SER = permanent, identity, origin, time, profession, essential characteristics</p>
        <p style={{ fontSize: '14px', color: '#008a8a', fontWeight: 600 }}>ESTAR = temporary states, location, ongoing actions, conditions that can change</p>
      </div>
      {SER_ESTAR_SCENARIOS.map(s => <ScenarioCard key={s.id} {...s} />)}
    </div>
  );
}

function EscritaSection({ showEnglish }) {
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Writing — CIPLE Practice' : 'Escrita — Prática CIPLE'}</h2>
      <p className="sec-desc">{showEnglish ? 'CIPLE-style writing tasks. Read the task, write your answer, then check the model.' : 'CIPLE-style writing tasks. Read the task, write your answer, then check the model.'}</p>
      {WRITING_TASKS.map(t => <WritingTask key={t.id} task={t} showEnglish={showEnglish} />)}
    </div>
  );
}

function OralSection({ showEnglish }) {
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Speaking — Dialogue Practice' : 'Oral — Diálogos para Praticar'}</h2>
      <p className="sec-desc">{showEnglish ? 'Read the dialogues aloud, then try to say the lines yourself. Shadowing is the fastest way to improve pronunciation.' : 'Read the dialogues aloud, then try to say the lines yourself. Shadowing is the fastest way to improve pronunciation.'}</p>
      {ORAL_DIALOGUES.map(d => <OralDialogue key={d.id} dialogue={d} showEnglish={showEnglish} />)}
    </div>
  );
}

function EscutaSection({ showEnglish }) {
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Listening — Audio Resources' : 'Escuta — Recursos de Audio'}</h2>
      <p className="sec-desc">{showEnglish ? 'Curated EP listening resources. Click to open and listen, then try the transcript toggle to check your understanding.' : 'Curated EP listening resources. Click to open and listen, then try the transcript toggle to check your understanding.'}</p>
      {LISTENING_RESOURCES.map(item => <ListeningItem key={item.id} item={item} showEnglish={showEnglish} />)}
    </div>
  );
}

function GlossarySection({ showEnglish }) {
  const [filter, setFilter] = useState('');
  const filtered = GLOSSARY_TERMS.filter(t => t.term.toLowerCase().includes(filter.toLowerCase()) || t.category.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div>
      <h2 className="sec-title">{showEnglish ? 'Glossary — Grammar Terms' : 'Glossário — Grammar Terms'}</h2>
      <p className="sec-desc">{showEnglish ? 'Plain-English explanations of Portuguese grammar terminology. Tap any term to expand.' : 'Plain-English explanations of Portuguese grammar terminology. Tap any term to expand.'}</p>
      <div className="search-wrap" style={{ marginBottom: '16px' }}>
        <input className="input" style={{ width: '100%' }} placeholder={showEnglish ? "Search terms..." : "Search terms..."} value={filter} onChange={e => setFilter(e.target.value)} />
        {filter && <button className="search-clear" onClick={() => setFilter('')}>×</button>}
      </div>
      {filtered.map((t, i) => <GlossaryEntry key={i} term={t} />)}
      {filtered.length === 0 && <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{showEnglish ? 'No terms match your search.' : 'No terms match your search.'}</div>}
    </div>
  );
}

function Verbos999Section({ showEnglish }) {
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [a2Only, setA2Only] = useState(false);
  const [mode, setMode] = useState("list");
  const [flashIdx, setFlashIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [visibleCount, setVisibleCount] = useState(100);

  const filtered = useMemo(() => {
    return ALL_VERBS.filter(([verb, meaning, type]) => {
      if (search) {
        const q = search.toLowerCase();
        if (!verb.toLowerCase().includes(q) && !meaning.toLowerCase().includes(q)) return false;
      }
      if (letter && verb[0].toUpperCase() !== letter) return false;
      if (typeFilter && type !== typeFilter) return false;
      if (a2Only && !A2_PRIORITY_VERBS.has(verb.replace(/-se$/, ""))) return false;
      return true;
    });
  }, [search, letter, typeFilter, a2Only]);

  const shuffled = useMemo(() => {
    return [...filtered].sort(() => Math.random() - 0.5);
  }, [filtered, mode]);

  const clearFilters = () => {
    setSearch(""); setLetter(null); setTypeFilter(null); setA2Only(false); setVisibleCount(100);
  };

  const typeCounts = useMemo(() => {
    const c = {};
    filtered.forEach(([,,t]) => { c[t] = (c[t]||0) + 1; });
    return c;
  }, [filtered]);

  const nextFlash = (correct) => {
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setFlipped(false);
    setFlashIdx(i => (i + 1) % Math.max(shuffled.length, 1));
  };

  const currentFlash = shuffled[flashIdx % Math.max(shuffled.length, 1)];

  const tc = typeCounts;

  return (
    <div>
      <div className="sec-header">
        <h2 className="sec-title">{showEnglish ? '999 Portuguese Verbs' : '999 Verbos Portugueses'}</h2>
        <p className="sec-desc">{showEnglish ? 'Complete searchable verb reference with ~1000 European Portuguese verbs. Use filters or drill with flashcards.' : 'Complete searchable verb reference with ~1000 European Portuguese verbs. Use filters or drill with flashcards.'}</p>
      </div>

      <div className="search-wrap">
        <input
          className="input"
          value={search}
          onChange={e => { setSearch(e.target.value); setVisibleCount(100); }}
          placeholder={showEnglish ? "Search verbs or meanings..." : "Search verbs or meanings..."}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>×</button>
        )}
      </div>

      <div className="toggle-row">
        {[['list', showEnglish ? 'Reference' : 'Reference'],['flash', showEnglish ? 'Flashcards' : 'Flashcards']].map(([m, label]) => (
          <button key={m} className={mode === m ? 'toggle-btn active' : 'toggle-btn'} onClick={() => { setMode(m); setFlashIdx(0); setFlipped(false); setScore({correct:0,total:0}); }}>{label}</button>
        ))}
        <button className={a2Only ? 'toggle-btn active' : 'toggle-btn'} onClick={() => { setA2Only(!a2Only); setVisibleCount(100); }}>
          {a2Only ? (showEnglish ? '★ A2 Active' : '★ A2 Ativo') : (showEnglish ? '☆ A2 Filter' : '☆ A2 Filtro')}
        </button>
        {(search || letter || typeFilter || a2Only) && (
          <button className="toggle-btn" onClick={clearFilters}>{showEnglish ? 'Clear' : 'Limpar'}</button>
        )}
      </div>

      <div className="type-pills">
        {VERB_TYPES.map(t => (
          <button key={t} className={typeFilter === t ? `type-pill active-${t.replace('-','')}` : 'type-pill'} onClick={() => { setTypeFilter(typeFilter === t ? null : t); setVisibleCount(100); }}>
            {VERB_TYPE_LABELS[t]} {tc[t] ? `(${tc[t]})` : ''}
          </button>
        ))}
      </div>

      <div className="letter-bar">
        {VERB_LETTERS.map(l => (
          <button key={l} className={letter === l ? 'letter-btn active' : 'letter-btn'} onClick={() => { setLetter(letter === l ? null : l); setVisibleCount(100); }}>{l}</button>
        ))}
      </div>

      <div className="filter-count">
        {showEnglish ? 'Showing' : 'A mostrar'} {filtered.length} {showEnglish ? 'of' : 'de'} {ALL_VERBS.length} {showEnglish ? 'verbs' : 'verbos'}
      </div>

      {mode === 'list' ? (
        <div>
          <div className="grid-2">
            {filtered.slice(0, visibleCount).map(([verb, meaning, type], i) => (
              <div key={i} className="card" style={{ padding: '10px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {A2_PRIORITY_VERBS.has(verb.replace(/-se$/, "")) && <span style={{ color: '#c9963c', fontSize: '10px' }}>★</span>}
                    <span className="verb-text">{verb}</span>
                    <button onClick={() => speakPortuguese(verb)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 4px' }}>🔊</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="verb-meaning">{meaning}</span>
                    <span className={`verb-type-badge verb-type-${type.replace('-','')}`}>{type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {visibleCount < filtered.length && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={() => setVisibleCount(v => v + 100)}>
                {showEnglish ? 'Load more' : 'Carregar mais'} ({filtered.length - visibleCount} {showEnglish ? 'remaining' : 'restantes'})
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {filtered.length === 0 ? (
            <div className="empty-state">{showEnglish ? 'No verbs match your filters' : 'Nenhum verbo corresponde aos filtros'}</div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge">{(flashIdx % shuffled.length) + 1} / {shuffled.length}</span>
                {score.total > 0 && <span style={{ fontSize: '12px', color: '#767676' }}>{score.correct}/{score.total} correct</span>}
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width: (flashIdx % shuffled.length) / Math.max(shuffled.length, 1) * 100 + '%'}} /></div>
              <div className="flashcard" onClick={() => setFlipped(!flipped)}>
                {!flipped ? (
                  <>
                    <div className="flashcard-label">{showEnglish ? 'Verb' : 'Verbo'} <span className={`verb-type-badge verb-type-${currentFlash[2].replace('-','')}`}>{currentFlash[2]}</span></div>
                    <div className="flashcard-verb">{currentFlash[0]}</div>
                    <div className="flashcard-hint">{showEnglish ? 'tap to flip' : 'tocar para virar'}</div>
                  </>
                ) : (
                  <>
                    <div className="flashcard-label">English</div>
                    <div className="flashcard-meaning">{currentFlash[1]}</div>
                    <div className="flashcard-actions">
                      <button className="btn btn-danger" onClick={e => { e.stopPropagation(); nextFlash(false); }}>{showEnglish ? 'Again' : 'Errei'}</button>
                      <button className="btn btn-primary" onClick={e => { e.stopPropagation(); nextFlash(true); }}>{showEnglish ? 'Got it' : 'Consegui'}</button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SECTION MAP ────────────────────────────────────────────────────────────────

const SECTION_MAP = {
  myplan: MyPlanSection,
  verbs25: Verbs25Section, conjugation: ConjugationSection, pronouns: PronounsSection,
  adjectives: AdjectivesSection, prepositions: PrepositionsSection, articles: ArticlesSection,
  vocabulary: VocabularySection, modals: ModalsSection, idioms: IdiomsSection,
  falsefriends: FalseFriendsSection, structure: StructureSection, preterito: PreteritoSection,
  serestar: SerEstarSection, escrita: EscritaSection, oral: OralSection,
  escuta: EscutaSection, glossary: GlossarySection, progresso: ProgressSection,
  verbos999: Verbos999Section,
};

// Global error catch
window.onerror = (msg, src, line, col, err) => console.error('[Global Error]', msg, 'at', src + ':' + line + ':' + col, err);
window.onunhandledrejection = e => console.error('[Unhandled Promise]', e.reason);

// ─── HOME SCREEN ───────────────────────────────────────────────────────────────

const SECTION_GROUPS = [
  {
    label: 'My Plan',
    labelPt: 'O Meu Plano',
    sections: [
      { id: 'myplan', label: 'O Meu Plano', labelEn: 'My Plan', icon: '🎯', desc: 'Your personalized learning plan' },
    ],
  },
  {
    label: 'Reference',
    labelPt: 'Referência',
    sections: [
      { id: 'verbs25', label: '25 Verbos', labelEn: '25 Verbs', icon: '⚡', desc: 'Essential verbs for A2' },
      { id: 'conjugation', label: 'Conjugação', labelEn: 'Conjugation', icon: '📐', desc: 'Verb conjugation patterns' },
      { id: 'pronouns', label: 'Pronomes', labelEn: 'Pronouns', icon: '👤', desc: 'All Portuguese pronouns' },
      { id: 'adjectives', label: 'Adjetivos', labelEn: 'Adjectives', icon: '🎨', desc: 'Common adjectives' },
    ],
  },
  {
    label: 'Grammar',
    labelPt: 'Gramática',
    sections: [
      { id: 'prepositions', label: 'Preposições', labelEn: 'Prepositions', icon: '📍', desc: 'Preposition usage drills' },
      { id: 'articles', label: 'Artigos', labelEn: 'Articles', icon: '📝', desc: 'Definite & indefinite articles' },
      { id: 'modals', label: 'Modais', labelEn: 'Modals', icon: '🔧', desc: 'Modal verb conjugations' },
      { id: 'serestar', label: 'Ser/Estar', labelEn: 'Ser/Estar', icon: '🔄', desc: 'Ser vs Estar distinction' },
    ],
  },
  {
    label: 'Vocabulary',
    labelPt: 'Vocabulário',
    sections: [
      { id: 'vocabulary', label: 'Vocabulário', labelEn: 'Vocabulary', icon: '📚', desc: '20 themed vocabulary sets' },
      { id: 'verbos999', label: '999 Verbos', labelEn: '999 Verbs', icon: '📕', desc: 'Complete verb reference' },
    ],
  },
  {
    label: 'Practice',
    labelPt: 'Prática',
    sections: [
      { id: 'idioms', label: 'Expressões', labelEn: 'Expressions', icon: '🇵🇹', desc: 'Portuguese idioms & phrases' },
      { id: 'falsefriends', label: 'Falsos Amigos', labelEn: 'False Friends', icon: '⚠️', desc: 'False friends trap quiz' },
      { id: 'structure', label: 'Frases', labelEn: 'Phrases', icon: '🧱', desc: 'Sentence structure patterns' },
      { id: 'preterito', label: 'Pretéritos', labelEn: 'Past Tense', icon: '⏱️', desc: 'Perfeito vs Imperfeito drill' },
    ],
  },
  {
    label: 'Communication',
    labelPt: 'Comunicação',
    sections: [
      { id: 'escrita', label: 'Escrita', labelEn: 'Writing', icon: '✍️', desc: 'Writing tasks with model answers' },
      { id: 'oral', label: 'Oral', labelEn: 'Speaking', icon: '🗣️', desc: 'Shadowing dialogues' },
      { id: 'escuta', label: 'Escuta', labelEn: 'Listening', icon: '🎧', desc: 'Listening resources' },
    ],
  },
  {
    label: 'Tools',
    labelPt: 'Ferramentas',
    sections: [
      { id: 'glossary', label: 'Glossário', labelEn: 'Glossary', icon: '📖', desc: 'Grammar terms in plain English' },
      { id: 'progresso', label: 'Progresso', labelEn: 'Progress', icon: '📊', desc: 'Track your learning journey' },
    ],
  },
];

function LandingPage({ onComplete, onSavePlan, savedPlan }) {
  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <OnboardingChat onComplete={onComplete} onSavePlan={onSavePlan} savedPlan={savedPlan} />
    </div>
  );
}

function MyPlanSection({ savedPlan, onSelectSection }) {
  if (!savedPlan || !savedPlan.plan || savedPlan.plan.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 8px', color: 'var(--text-primary)' }}>My Plan</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
          Complete the questionnaire to get your personalized learning plan.
        </p>
        <button 
          onClick={() => onSelectSection(null)}
          style={{ padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
        >
          Start Questionnaire
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>🎯 My Learning Plan</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Your personalized path to Portuguese fluency</p>
      </div>
      
      {savedPlan.answers && (
        <div style={{ background: 'var(--bg-muted)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Level:</span> <span style={{ color: 'var(--text-secondary)' }}>{savedPlan.answers.level}</span></div>
            <div><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Goal:</span> <span style={{ color: 'var(--text-secondary)' }}>{savedPlan.answers.goal}</span></div>
            <div><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Context:</span> <span style={{ color: 'var(--text-secondary)' }}>{savedPlan.answers.context}</span></div>
            <div><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Time:</span> <span style={{ color: 'var(--text-secondary)' }}>{savedPlan.answers.time}</span></div>
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {savedPlan.plan.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => onSelectSection(item.id)}
            style={{
              padding: '16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              borderLeft: `4px solid var(--accent)`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.labelEn}</span>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{item.reason}</p>
          </button>
        ))}
      </div>
      
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button 
          onClick={() => onSelectSection(null)}
          style={{ padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
        >
          Update My Plan →
        </button>
      </div>
    </div>
  );
}

function Sidebar({ section, onSelect, isOpen, onClose, showEnglish, onOpenChat }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-row">
          <div>
            <h1 className="sidebar-title">Fluência</h1>
            <p className="sidebar-subtitle">{showEnglish ? 'European Portuguese A2' : 'Português Europeu A2'}</p>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>✕</button>
        </div>
      </div>
      <nav className="sidebar-nav">
        {SECTION_GROUPS.map(group => (
          <div key={group.label} className="sidebar-group">
            <div className="sidebar-group-label">{showEnglish ? group.label : group.labelPt}</div>
            {group.sections.map(s => (
              <button
                key={s.id}
                className={`sidebar-item ${section === s.id ? 'active' : ''}`}
                data-group={(showEnglish ? group.label : group.labelPt).toLowerCase()}
                onClick={() => onSelect(s.id)}
              >
                <span className="sidebar-item-icon">{s.icon}</span>
                <span className="sidebar-item-label">{showEnglish ? s.labelEn : s.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
        <button 
          onClick={() => { onClose(); onOpenChat(); }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            background: 'linear-gradient(135deg, #00a870, #008a5a)', 
            color: '#fff', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,168,112,0.3)'
          }}
        >
          💬 Chat with Patrick
        </button>
        <a 
          href="https://ko-fi.com/fluencia" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            background: '#13c3ba', 
            color: '#fff', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '14px'
          }}
        >
          ☕ Support Fluência
        </a>
      </div>
    </aside>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────────

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) {
    console.error('[PT Learner Error]', error);
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#c0392b', background: '#f5f3f0', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2 style={{ marginBottom: '16px', color: '#1c1c1c' }}>App Error</h2>
          <pre style={{ textAlign: 'left', fontSize: '12px', color: '#767676', maxWidth: '600px', margin: '0 auto', border: '1px solid #e2e0dd', padding: '12px', borderRadius: '8px' }}>{String(this.state.error?.message || this.state.error)}</pre>
          <button onClick={() => this.setState({hasError: false})} style={{ marginTop: '20px', padding: '10px 20px', background: '#00a870', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [section, setSection] = useState(null);
  const [showEnglish, setShowEnglish] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [savedPlan, setSavedPlan] = useState(null);
  const SectionComp = section ? (SECTION_MAP[section] || Verbs25Section) : null;

  useEffect(() => {
    try {
      const prev = parseInt(localStorage.getItem('sessions') || '0', 10);
      localStorage.setItem('sessions', String(prev + 1));
    } catch {}

    try {
      const saved = localStorage.getItem('fluencia_plan');
      if (saved) {
        setSavedPlan(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleSavePlan = (planData) => {
    setSavedPlan(planData);
    try {
      localStorage.setItem('fluencia_plan', JSON.stringify(planData));
    } catch {}
  };

  const handleSectionSelect = (id) => {
    setSection(id);
    setSidebarOpen(false);
  };

  const handleBackToHome = () => {
    setSection(null);
    setSidebarOpen(false);
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>
        <Sidebar section={section} onSelect={handleSectionSelect} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} showEnglish={showEnglish} onOpenChat={() => setChatOpen(true)} />
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        <main className="main-content">
          <div className="section-nav">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span className="hamburger-icon">{sidebarOpen ? '✕' : '☰'}</span>
            </button>
            {section ? (
              <>
                <button onClick={handleBackToHome} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', marginRight: '8px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                  ← <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-primary)' }}>Fluência</span>
                </button>
                <div className="section-nav-title">
                  {section === 'myplan' ? '🎯 My Plan' : (showEnglish ? (SECTIONS.find(s => s.id === section)?.labelEn || section) : (SECTIONS.find(s => s.id === section)?.label || section))}
                </div>
              </>
            ) : (
              <div className="section-nav-title" style={{ fontFamily: 'var(--font-display)', fontSize: '18px', cursor: 'pointer' }} onClick={handleBackToHome}>Fluência</div>
            )}
            {section && (
              <button className={showEnglish ? 'btn btn-primary' : 'btn btn-ghost'} onClick={() => setShowEnglish(!showEnglish)} style={{ fontSize: '12px', padding: '6px 12px', marginLeft: 'auto' }}>
                {showEnglish ? 'PT' : 'EN'}
              </button>
            )}
          </div>
          <div className="content">
            {section === 'myplan' ? (
              <MyPlanSection savedPlan={savedPlan} onSelectSection={(id) => {
                if (id === null) {
                  setSection(null);
                } else {
                  setSection(id);
                }
              }} />
            ) : section ? (
              <SectionComp showEnglish={showEnglish} savedPlan={savedPlan} onSavePlan={handleSavePlan} />
            ) : (
              <div className="welcome-screen">
                <LandingPage onComplete={(recommendedSections) => {
                  if (recommendedSections.length > 0) {
                    setSection(recommendedSections[0]);
                  }
                }} onSavePlan={handleSavePlan} savedPlan={savedPlan} />
              </div>
            )}
          </div>
        </main>
        <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        <FloatingChatButton onClick={() => setChatOpen(true)} />
      </div>
    </ErrorBoundary>
  );
}
