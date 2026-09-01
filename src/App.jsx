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

const VERB_EXAMPLES = {
  "ser": { pt: "Sou estudante.", en: "I am a student." },
  "estar": { pt: "Estou em casa.", en: "I am at home." },
  "ter": { pt: "Tenho dois irmãos.", en: "I have two siblings." },
  "fazer": { pt: "Faço o jantar hoje.", en: "I'm making dinner today." },
  "ir": { pt: "Vou ao cinema.", en: "I'm going to the cinema." },
  "poder": { pt: "Posso entrar?", en: "Can I come in?" },
  "dizer": { pt: "Ele diz a verdade.", en: "He tells the truth." },
  "dar": { pt: "Dou-te o livro.", en: "I'll give you the book." },
  "saber": { pt: "Sei o caminho.", en: "I know the way." },
  "querer": { pt: "Quero um café.", en: "I want a coffee." },
  "ver": { pt: "Vejo a televisão.", en: "I watch television." },
  "vir": { pt: "Venho de Lisboa.", en: "I come from Lisbon." },
  "falar": { pt: "Falo português.", en: "I speak Portuguese." },
  "comer": { pt: "Como às oito.", en: "I eat at eight." },
  "viver": { pt: "Vivo em Portugal.", en: "I live in Portugal." },
  "trabalhar": { pt: "Trabalho em Lisboa.", en: "I work in Lisbon." },
  "precisar": { pt: "Preciso de ajuda.", en: "I need help." },
  "encontrar": { pt: "Encontro-te às cinco.", en: "I'll meet you at five." },
  "pôr": { pt: "Ponho a mesa.", en: "I set the table." },
  "ficar": { pt: "Fico em casa hoje.", en: "I'm staying home today." },
  "dever": { pt: "Devo estudar mais.", en: "I should study more." },
  "trazer": { pt: "Trago o jantar.", en: "I'm bringing dinner." },
  "esperar": { pt: "Espero o autocarro.", en: "I wait for the bus." },
  "beber": { pt: "Bebo café de manhã.", en: "I drink coffee in the morning." },
  "conhecer": { pt: "Conheço Lisboa bem.", en: "I know Lisbon well." },
  "haver": { pt: "Há um livro na mesa.", en: "There is a book on the table." },
  "dormir": { pt: "Eu durmo cedo.", en: "I sleep early." },
  "sentir": { pt: "Sinto-me bem hoje.", en: "I feel good today." },
  "levantar": { pt: "Levanto-me às sete.", en: "I get up at seven." },
  "sentar": { pt: "Senta-te aqui.", en: "Sit here." },
  "chamar": { pt: "Como te chamas?", en: "What's your name?" },
  "pensar": { pt: "Penso que sim.", en: "I think so." },
  "perder": { pt: "Perdi as chaves.", en: "I lost my keys." },
  "ganhar": { pt: "Ganho pouco dinheiro.", en: "I earn little money." },
  "abrir": { pt: "Abre a porta, por favor.", en: "Open the door, please." },
  "fechar": { pt: "Fecha a janela.", en: "Close the window." },
  "pedir": { pt: "Posso pedir ajuda?", en: "Can I ask for help?" },
  "receber": { pt: "Recebi uma carta.", en: "I received a letter." },
  "vender": { pt: "Vendo livros usados.", en: "I sell used books." },
  "comprar": { pt: "Compro pão todos os dias.", en: "I buy bread every day." },
  "pagar": { pt: "Pago em dinheiro.", en: "I pay in cash." },
  "ajudar": { pt: "Ajuda-me, por favor.", en: "Help me, please." },
  "usar": { pt: "Uso óculos para ler.", en: "I use glasses to read." },
  "gostar": { pt: "Gosto de café.", en: "I like coffee." },
  "preferir": { pt: "Prefiro chá.", en: "I prefer tea." },
  "acabar": { pt: "Acabei o trabalho.", en: "I finished the work." },
  "começar": { pt: "Começo amanhã.", en: "I start tomorrow." },
  "continuar": { pt: "Continua a ler.", en: "Keep reading." },
  "tentar": { pt: "Tento de novo.", en: "I'll try again." },
  "aprender": { pt: "Aprendo português.", en: "I'm learning Portuguese." },
  "ensinar": { pt: "Ensino inglês.", en: "I teach English." },
  "estudar": { pt: "Estudo todos os dias.", en: "I study every day." },
  "ler": { pt: "Leio o jornal de manhã.", en: "I read the newspaper in the morning." },
  "escrever": { pt: "Escrevo uma carta.", en: "I'm writing a letter." },
  "ouvir": { pt: "Ouço música.", en: "I listen to music." },
  "lembrar": { pt: "Lembro-me disso.", en: "I remember that." },
  "esquecer": { pt: "Esqueci o nome dele.", en: "I forgot his name." },
  "perceber": { pt: "Não percebo nada.", en: "I don't understand anything." },
  "explicar": { pt: "Explica-me isto.", en: "Explain this to me." },
  "perguntar": { pt: "Pergunto-lhe o nome.", en: "I ask him his name." },
  "responder": { pt: "Respondo logo.", en: "I'll answer right away." },
  "contar": { pt: "Conto uma história.", en: "I tell a story." },
  "conversar": { pt: "Conversamos muito.", en: "We talked a lot." },
  "chegar": { pt: "Chego às dez horas.", en: "I arrive at ten o'clock." },
  "sair": { pt: "Saio à noite.", en: "I go out at night." },
  "entrar": { pt: "Entro na sala.", en: "I enter the room." },
  "voltar": { pt: "Volto amanhã.", en: "I come back tomorrow." },
  "passar": { pt: "Passo o dia a estudar.", en: "I spend the day studying." },
  "caminhar": { pt: "Caminho até ao trabalho.", en: "I walk to work." },
  "correr": { pt: "Corro no parque.", en: "I run in the park." },
  "parar": { pt: "O autocarro parou.", en: "The bus stopped." },
  "conduzir": { pt: "Conduzo devagar.", en: "I drive slowly." },
  "viajar": { pt: "Viajo muito.", en: "I travel a lot." },
  "morar": { pt: "Moro em Lisboa.", en: "I live in Lisbon." },
  "mudar": { pt: "Mudo de casa.", en: "I'm moving house." },
  "acontecer": { pt: "Aconteceu algo estranho.", en: "Something strange happened." },
  "existir": { pt: "Existe um problema.", en: "There is a problem." },
  "parecer": { pt: "Parece difícil.", en: "It seems difficult." },
  "significar": { pt: "O que significa isto?", en: "What does this mean?" },
  "decidir": { pt: "Decido depois.", en: "I'll decide later." },
  "escolher": { pt: "Escolho o azul.", en: "I choose the blue one." },
  "cortar": { pt: "Corto o pão.", en: "I cut the bread." },
  "cozinhar": { pt: "Cozinho bem.", en: "I cook well." },
  "lavar": { pt: "Lavo a roupa.", en: "I wash the clothes." },
  "limpar": { pt: "Limpo a casa.", en: "I clean the house." },
  "arranjar": { pt: "Arrango o carro.", en: "I fix the car." },
  "amar": { pt: "Amo-te muito.", en: "I love you a lot." },
  "odiar": { pt: "Odeio esperar.", en: "I hate waiting." },
  "rir": { pt: "Rio muito com ele.", en: "I laugh a lot with him." },
  "chorar": { pt: "Choro em filmes.", en: "I cry at movies." },
  "partir": { pt: "Eu parto às oito.", en: "I leave at eight." },
  "seguir": { pt: "Sigo em frente.", en: "I go straight ahead." },
  "servir": { pt: "Sirvo o jantar.", en: "I serve dinner." },
  "permitir": { pt: "Posso permitir isso?", en: "Can I allow that?" },
  "evitar": { pt: "Evito o trânsito.", en: "I avoid the traffic." },
  "oferecer": { pt: "Ofereço-te um café.", en: "I'll offer you a coffee." },
  "mostrar": { pt: "Mostro-te o caminho.", en: "I'll show you the way." },
  "casar": { pt: "Vou casar em junho.", en: "I'm getting married in June." },
  "morrer": { pt: "O avô morreu no ano passado.", en: "Grandfather died last year." },
  "nascer": { pt: "Nasci em Lisboa.", en: "I was born in Lisbon." },
  "crescer": { pt: "As crianças crescem depressa.", en: "Children grow up quickly." },
  "tocar": { pt: "Toco guitarra.", en: "I play guitar." },
  "dançar": { pt: "Danço bem.", en: "I dance well." },
  "nadar": { pt: "Nado no mar.", en: "I swim in the sea." },
  "pintar": { pt: "Pinto a casa.", en: "I'm painting the house." },
  "desenhar": { pt: "Desenho retratos.", en: "I draw portraits." },
  "abandonar": { pt: "Ele abandonou a família.", en: "He abandoned his family." },
  "abastecer": { pt: "Vou abastecer o carro.", en: "I'll fill up the car." },
  "abdicar": { pt: "O rei abdicou do trono.", en: "The king abdicated the throne." },
  "abolir": { pt: "A lei aboliu a escravatura.", en: "The law abolished slavery." },
  "aborrecer": { pt: "Ele aborrece-me.", en: "He annoys me." },
  "abraçar": { pt: "A mãe abraçou o filho.", en: "The mother hugged her son." },
  "abrandar": { pt: "A chuva abrandou.", en: "The rain slowed down." },
  "abreviar": { pt: "Vou abreviar o discurso.", en: "I'll shorten the speech." },
  "abrigar": { pt: "A casa abriga os refugiados.", en: "The house shelters the refugees." },
  "absorver": { pt: "A esponja absorve a água.", en: "The sponge absorbs the water." },
  "abster-se": { pt: "Abstenho-me de comentar.", en: "I refrain from commenting." },
  "abusar": { pt: "Ele abusa do poder.", en: "He abuses his power." },
  "acalmar": { pt: "A música acalma-me.", en: "Music calms me down." },
  "acampar": { pt: "Vamos acampar no Algarve.", en: "We're going camping in the Algarve." },
  "acariciar": { pt: "Ela acaricia o gato.", en: "She caresses the cat." },
  "aceitar": { pt: "Aceito o teu convite.", en: "I accept your invitation." },
  "acender": { pt: "Acendo a luz à noite.", en: "I turn on the light at night." },
  "acentuar": { pt: "A dor acentuou-se.", en: "The pain got worse." },
  "acertar": { pt: "Acertaste a resposta.", en: "You got the answer right." },
  "achar": { pt: "Acho que tens razão.", en: "I think you're right." },
  "acidentar": { pt: "Ele acidentou-se na estrada.", en: "He had an accident on the road." },
  "aclamar": { pt: "O povo aclamou o rei.", en: "The people acclaimed the king." },
  "acolher": { pt: "Ela acolhe os turistas.", en: "She welcomes the tourists." },
  "acomodar": { pt: "Acomoda-te aqui.", en: "Make yourself comfortable here." },
  "acompanhar": { pt: "Acompanho-te ao médico.", en: "I'll go with you to the doctor." },
  "aconselhar": { pt: "Aconselho-te a estudar.", en: "I advise you to study." },
  "acordar": { pt: "Acordo às sete da manhã.", en: "I wake up at seven in the morning." },
  "acostumar": { pt: "Acostumei-me ao calor.", en: "I got used to the heat." },
  "acreditar": { pt: "Acredito em ti.", en: "I believe in you." },
  "acrescentar": { pt: "Acrescento sal à sopa.", en: "I add salt to the soup." },
  "acudir": { pt: "Ele acudiu a tempo.", en: "He came to help in time." },
  "acumular": { pt: "Acumulei muitas dívidas.", en: "I accumulated many debts." },
  "acusar": { pt: "Ele acusou o colega.", en: "He accused his colleague." },
  "adaptar": { pt: "Adaptei-me à nova cidade.", en: "I adapted to the new city." },
  "adiar": { pt: "Vou adiar a reunião.", en: "I'll postpone the meeting." },
  "adicionar": { pt: "Adiciono açúcar ao café.", en: "I add sugar to the coffee." },
  "adivinhar": { pt: "Tenta adivinhar o número.", en: "Try to guess the number." },
  "administrar": { pt: "Ele administra a empresa.", en: "He manages the company." },
  "admirar": { pt: "Admiro a vista daqui.", en: "I admire the view from here." },
  "admitir": { pt: "Admito que estava errado.", en: "I admit I was wrong." },
  "adoecer": { pt: "Ele adoeceu gravemente.", en: "He fell seriously ill." },
  "adorar": { pt: "Adoro chocolate.", en: "I love chocolate." },
  "adormecer": { pt: "Adormeci no sofá.", en: "I fell asleep on the sofa." },
  "adotar": { pt: "Eles adotaram um cão.", en: "They adopted a dog." },
  "adquirir": { pt: "Adquiri um carro novo.", en: "I acquired a new car." },
  "advertir": { pt: "Ele advertiu-me do perigo.", en: "He warned me of the danger." },
  "afastar": { pt: "Afastei-me do fogo.", en: "I moved away from the fire." },
  "afetar": { pt: "A crise afetou o país.", en: "The crisis affected the country." },
  "afirmar": { pt: "Ele afirmou a verdade.", en: "He affirmed the truth." },
  "afligir": { pt: "A notícia afligiu-me.", en: "The news distressed me." },
  "afogar": { pt: "O cão quase se afogou.", en: "The dog almost drowned." },
  "agarrar": { pt: "Agarrei a mala com força.", en: "I grabbed the bag tightly." },
  "agir": { pt: "Ele age rapidamente.", en: "He acts quickly." },
  "agitar": { pt: "O vento agita as folhas.", en: "The wind shakes the leaves." },
  "agradar": { pt: "O presente agradou-me muito.", en: "I really liked the gift." },
  "agradecer": { pt: "Agradeço-te a ajuda.", en: "I thank you for the help." },
  "agravar": { pt: "A situação agravou-se.", en: "The situation got worse." },
  "agredir": { pt: "Ele agrediu o vizinho.", en: "He assaulted his neighbour." },
  "agrupar": { pt: "Agrupámos os livros.", en: "We grouped the books." },
  "aguentar": { pt: "Não aguento mais.", en: "I can't take it anymore." },
  "ajustar": { pt: "Ajusta o cinto, por favor.", en: "Adjust the belt, please." },
  "alargar": { pt: "Vamos alargar a estrada.", en: "We're going to widen the road." },
  "alcançar": { pt: "Alcancei o meu objectivo.", en: "I reached my goal." },
  "alegrar": { pt: "A música alegra-me.", en: "Music makes me happy." },
  "alertar": { pt: "Alertámos a polícia.", en: "We alerted the police." },
  "alimentar": { pt: "Alimento o bebé de quatro em quatro horas.", en: "I feed the baby every four hours." },
  "alinhar": { pt: "Os soldados alinharam.", en: "The soldiers lined up." },
  "aliviar": { pt: "Este remédio alivia a dor.", en: "This medicine relieves the pain." },
  "almoçar": { pt: "Almocei às duas horas.", en: "I had lunch at two o'clock." },
  "alugar": { pt: "Vou alugar um carro.", en: "I'm going to rent a car." },
  "ameaçar": { pt: "Ele ameaçou-me.", en: "He threatened me." },
  "amolecer": { pt: "O chocolate amoleceu.", en: "The chocolate softened." },
  "ampliar": { pt: "Vamos ampliar a casa.", en: "We're going to extend the house." },
  "analisar": { pt: "Analisei os resultados.", en: "I analysed the results." },
  "andar": { pt: "Ando a pé para o trabalho.", en: "I walk to work." },
  "animar": { pt: "O café animou-me.", en: "The coffee cheered me up." },
  "aniquilar": { pt: "O vírus foi aniquilado.", en: "The virus was annihilated." },
  "anotar": { pt: "Anotei o número de telefone.", en: "I noted down the phone number." },
  "antecipar": { pt: "Antecipei a partida.", en: "I anticipated the departure." },
  "anular": { pt: "Anulei a reserva.", en: "I cancelled the reservation." },
  "anunciar": { pt: "Anunciaram o produto na TV.", en: "They advertised the product on TV." },
  "apagar": { pt: "Apaguei a luz.", en: "I turned off the light." },
  "apanhar": { pt: "Apanhei o autocarro a tempo.", en: "I caught the bus in time." },
  "aparecer": { pt: "Ela apareceu de surpresa.", en: "She appeared unexpectedly." },
  "aparentar": { pt: "Ele aparenta ter vinte anos.", en: "He looks twenty years old." },
  "apelar": { pt: "Apelámos à calma.", en: "We appealed for calm." },
  "apertar": { pt: "Aperta o cinto de segurança.", en: "Tighten your seatbelt." },
  "aplicar": { pt: "Apliquei o creme.", en: "I applied the cream." },
  "apoiar": { pt: "Apoio a tua decisão.", en: "I support your decision." },
  "apontar": { pt: "Apontou para a porta.", en: "He pointed at the door." },
  "apreciar": { pt: "Aprecio música clássica.", en: "I appreciate classical music." },
  "apresentar": { pt: "Vou apresentar o meu projeto.", en: "I'm going to present my project." },
  "apressar": { pt: "Apressei-me para o trabalho.", en: "I hurried to work." },
  "aprovar": { pt: "O chefe aprovou o plano.", en: "The boss approved the plan." },
  "aproveitar": { pt: "Aproveitei o dia de sol.", en: "I made the most of the sunny day." },
  "aproximar": { pt: "Aproximei-me da janela.", en: "I approached the window." },
  "arrancar": { pt: "Arrancou a página do livro.", en: "He tore the page from the book." },
  "arrastar": { pt: "Arrastei a mala até ao carro.", en: "I dragged the suitcase to the car." },
  "arrecadar": { pt: "Arrecadámos fundos para a caridade.", en: "We raised funds for charity." },
  "arrepender-se": { pt: "Ele arrependeu-se do erro.", en: "He regretted the mistake." },
  "arriscar": { pt: "Arrisquei tudo no negócio.", en: "I risked everything in the business." },
  "arruinar": { pt: "A crise arruinou-o.", en: "The crisis ruined him." },
  "arrumar": { pt: "Arrumei o quarto.", en: "I tidied the room." },
  "aspirar": { pt: "Aspirei o pó da sala.", en: "I vacuumed the dust from the living room." },
  "assaltar": { pt: "Assaltaram o banco.", en: "They robbed the bank." },
  "assassinar": { pt: "O presidente foi assassinado.", en: "The president was assassinated." },
  "assegurar": { pt: "Assegurei-lhe o meu apoio.", en: "I assured him of my support." },
  "assinalar": { pt: "Assinalei a data no calendário.", en: "I marked the date on the calendar." },
  "assinar": { pt: "Assinei o contrato.", en: "I signed the contract." },
  "assistir": { pt: "Assistimos ao filme.", en: "We watched the film." },
  "associar": { pt: "Associei-me ao clube.", en: "I joined the club." },
  "assustar": { pt: "O barulho assustou o gato.", en: "The noise scared the cat." },
  "assumir": { pt: "Assumi o cargo de chefe.", en: "I took on the role of boss." },
  "atacar": { pt: "O cão atacou o carteiro.", en: "The dog attacked the postman." },
  "atar": { pt: "Atei o sapato.", en: "I tied my shoe." },
  "atingir": { pt: "Atingi o meu limite.", en: "I reached my limit." },
  "atrair": { pt: "Ela atrai muita atenção.", en: "She attracts a lot of attention." },
  "atrasar": { pt: "O comboio atrasou-se.", en: "The train was delayed." },
  "atravessar": { pt: "Atravessei a rua.", en: "I crossed the street." },
  "atrever-se": { pt: "Não me atrevo a dizer.", en: "I don't dare to say." },
  "atribuir": { pt: "Atribuí o prémio ao vencedor.", en: "I awarded the prize to the winner." },
  "atualizar": { pt: "Atualizei o currículo.", en: "I updated my CV." },
  "atuar": { pt: "Ele atua no teatro.", en: "He acts in the theatre." },
  "aumentar": { pt: "Aumentaram os preços.", en: "Prices have gone up." },
  "autorizar": { pt: "O pai autorizou a saída.", en: "The father authorised the outing." },
  "avaliar": { pt: "Avaliei o projeto.", en: "I evaluated the project." },
  "avançar": { pt: "Avançámos para a fase final.", en: "We advanced to the final phase." },
  "avisar": { pt: "Avisei-o do perigo.", en: "I warned him of the danger." },
  "baixar": { pt: "Baixei o volume.", en: "I turned down the volume." },
  "balançar": { pt: "O barco balança com as ondas.", en: "The boat rocks with the waves." },
  "banhar": { pt: "Banhei o bebé.", en: "I bathed the baby." },
  "baralhar": { pt: "Baralhou as cartas.", en: "He shuffled the cards." },
  "basear": { pt: "Baseio a minha opinião em factos.", en: "I base my opinion on facts." },
  "bater": { pt: "Bati à porta.", en: "I knocked on the door." },
  "batizar": { pt: "Batizaram o bebé.", en: "They baptised the baby." },
  "beneficiar": { pt: "Todos beneficiaram do desconto.", en: "Everyone benefited from the discount." },
  "bloquear": { pt: "A polícia bloqueou a rua.", en: "The police blocked the street." },
  "borbulhar": { pt: "A água está a borbulhar.", en: "The water is bubbling." },
  "bordar": { pt: "Ela borda lençóis à mão.", en: "She embroiders sheets by hand." },
  "brilhar": { pt: "As estrelas brilham à noite.", en: "The stars shine at night." },
  "brincar": { pt: "As crianças brincam no parque.", en: "The children play in the park." },
  "bronzear": { pt: "Bronzeei-me na praia.", en: "I got a tan at the beach." },
  "buscar": { pt: "Vou buscar os miúdos à escola.", en: "I'm picking up the kids from school." },
  "caber": { pt: "A mala não cabe no carro.", en: "The suitcase doesn't fit in the car." },
  "caçar": { pt: "Ele caça aos domingos.", en: "He hunts on Sundays." },
  "cair": { pt: "Caiu muita chuva hoje.", en: "A lot of rain fell today." },
  "calar": { pt: "Calou-se durante a reunião.", en: "He fell silent during the meeting." },
  "calcular": { pt: "Calculei o preço total.", en: "I calculated the total price." },
  "calhar": { pt: "Calhou bem na rifa.", en: "He got lucky in the raffle." },
  "cancelar": { pt: "Cancelei o encontro.", en: "I cancelled the meeting." },
  "cansar": { pt: "O exercício cansou-me.", en: "The exercise tired me out." },
  "cantar": { pt: "Ela canta muito bem.", en: "She sings very well." },
  "capturar": { pt: "O gato capturou um rato.", en: "The cat caught a mouse." },
  "caracterizar": { pt: "A honestidade caracteriza-o.", en: "Honesty characterises him." },
  "carregar": { pt: "Carreguei a bateria do telemóvel.", en: "I charged my phone battery." },
  "castigar": { pt: "A mãe castigou-o.", en: "The mother punished him." },
  "causar": { pt: "A chuva causou problemas.", en: "The rain caused problems." },
  "cavar": { pt: "Cavámos um buraco no jardim.", en: "We dug a hole in the garden." },
  "cear": { pt: "Ceámos cedo ontem.", en: "We had an early dinner yesterday." },
  "ceder": { pt: "Ele cedeu à pressão.", en: "He gave in to the pressure." },
  "celebrar": { pt: "Vamos celebrar o aniversário.", en: "We're going to celebrate the birthday." },
  "censurar": { pt: "O governo censurou o filme.", en: "The government censored the film." },
  "certificar": { pt: "Certifiquei-me de que estava certo.", en: "I made sure it was right." },
  "chatear": { pt: "Ele chateia-me muito.", en: "He annoys me a lot." },
  "cheirar": { pt: "A comida cheira bem.", en: "The food smells good." },
  "chocar": { pt: "O carro chocou com o poste.", en: "The car crashed into the post." },
  "chover": { pt: "Vai chover amanhã.", en: "It's going to rain tomorrow." },
  "chutar": { pt: "Ele chutou a bola.", en: "He kicked the ball." },
  "circular": { pt: "O autocarro circula devagar.", en: "The bus moves slowly." },
  "citar": { pt: "Citou um autor famoso.", en: "He quoted a famous author." },
  "clarificar": { pt: "Vou clarificar a situação.", en: "I'll clarify the situation." },
  "classificar": { pt: "Classifiquei os documentos.", en: "I sorted the documents." },
  "cobrar": { pt: "Cobrou-me dez euros.", en: "He charged me ten euros." },
  "cobrir": { pt: "Cobri a comida.", en: "I covered the food." },
  "coçar": { pt: "O gato coça-se na árvore.", en: "The cat scratches itself on the tree." },
  "coincidir": { pt: "As datas coincidem.", en: "The dates coincide." },
  "colaborar": { pt: "Colaborei no projeto.", en: "I collaborated on the project." },
  "colar": { pt: "Colei o poster na parede.", en: "I stuck the poster on the wall." },
  "colecionar": { pt: "Ele coleciona selos.", en: "He collects stamps." },
  "colocar": { pt: "Coloquei a chave na mesa.", en: "I put the key on the table." },
  "colorir": { pt: "As crianças colorem os desenhos.", en: "The children colour the drawings." },
  "combater": { pt: "Ele combateu na guerra.", en: "He fought in the war." },
  "combinar": { pt: "Combinei encontrá-la às cinco.", en: "I arranged to meet her at five." },
  "comentar": { pt: "Ela comentou o filme.", en: "She commented on the film." },
  "comercializar": { pt: "A empresa comercializa o produto.", en: "The company markets the product." },
  "cometer": { pt: "Ele cometeu um erro.", en: "He made a mistake." },
  "comparar": { pt: "Comparei os preços.", en: "I compared the prices." },
  "comparecer": { pt: "Compareci no tribunal.", en: "I appeared in court." },
  "compartilhar": { pt: "Partilhei a notícia.", en: "I shared the news." },
  "compensar": { pt: "O esforço compensou.", en: "The effort paid off." },
  "competir": { pt: "Ele compete em natação.", en: "He competes in swimming." },
  "complementar": { pt: "Complementei o prato com salada.", en: "I complemented the dish with salad." },
  "completar": { pt: "Completei o formulário.", en: "I completed the form." },
  "complicar": { pt: "Não compliques as coisas.", en: "Don't complicate things." },
  "compor": { pt: "Ele compõe música.", en: "He composes music." },
  "comportar-se": { pt: "Comporta-se bem na escola.", en: "He behaves well at school." },
  "compreender": { pt: "Compreendo a tua dor.", en: "I understand your pain." },
  "comprometer": { pt: "Ele comprometeu-se a ajudar.", en: "He committed to helping." },
  "comprovar": { pt: "Comprovei a identidade.", en: "I verified the identity." },
  "comunicar": { pt: "Comuniquei o problema ao chefe.", en: "I reported the problem to the boss." },
  "conceber": { pt: "Ela concebeu um plano.", en: "She conceived a plan." },
  "conceder": { pt: "Concederam-me uma entrevista.", en: "They granted me an interview." },
  "concentrar": { pt: "Concentre-se no trabalho.", en: "Focus on your work." },
  "concluir": { pt: "Concluí o relatório.", en: "I finished the report." },
  "concordar": { pt: "Concordo contigo.", en: "I agree with you." },
  "concorrer": { pt: "Vou concorrer ao emprego.", en: "I'm going to apply for the job." },
  "condenar": { pt: "O tribunal condenou-o.", en: "The court condemned him." },
  "conferir": { pt: "Confere os documentos.", en: "Check the documents." },
  "confessar": { pt: "Confessou o crime.", en: "He confessed to the crime." },
  "confiar": { pt: "Confio em ti.", en: "I trust you." },
  "confirmar": { pt: "Confirmei a reserva.", en: "I confirmed the reservation." },
  "confundir": { pt: "Confundi os nomes.", en: "I mixed up the names." },
  "conjugar": { pt: "Conjuguei o verbo no presente.", en: "I conjugated the verb in the present." },
  "conquistar": { pt: "Conquistou o coração dela.", en: "He won her heart." },
  "conseguir": { pt: "Consegui terminar a tempo.", en: "I managed to finish on time." },
  "consentir": { pt: "Ela não consente a saída.", en: "She doesn't allow the outing." },
  "conservar": { pt: "Conserve os alimentos no frio.", en: "Keep the food refrigerated." },
  "considerar": { pt: "Considero a proposta boa.", en: "I consider the proposal good." },
  "consistir": { pt: "O jantar consistiu em peixe.", en: "Dinner consisted of fish." },
  "consolar": { pt: "Tentei consolá-la.", en: "I tried to comfort her." },
  "consolidar": { pt: "Consolidámos a posição.", en: "We consolidated our position." },
  "constar": { pt: "Consta nos relatórios.", en: "It appears in the reports." },
  "constatar": { pt: "Constatei o erro.", en: "I noticed the error." },
  "constituir": { pt: "Constituem um grupo.", en: "They form a group." },
  "construir": { pt: "Construímos uma casa nova.", en: "We built a new house." },
  "consultar": { pt: "Consultei o médico.", en: "I consulted the doctor." },
  "consumir": { pt: "Consumo pouco açúcar.", en: "I consume little sugar." },
  "contactar": { pt: "Contactei o fornecedor.", en: "I contacted the supplier." },
  "contagiar": { pt: "Ele contagiou os colegas.", en: "He infected his colleagues." },
  "contaminar": { pt: "O petróleo contaminou o mar.", en: "The oil contaminated the sea." },
  "contemplar": { pt: "Contemplei o pôr do sol.", en: "I contemplated the sunset." },
  "conter": { pt: "A caixa contém livros.", en: "The box contains books." },
  "contestar": { pt: "Contestei a decisão.", en: "I contested the decision." },
  "contradizer": { pt: "Ele contradisse o chefe.", en: "He contradicted his boss." },
  "contrair": { pt: "Contraí uma doença.", en: "I contracted a disease." },
  "contratar": { pt: "Contratámos um novo funcionário.", en: "We hired a new employee." },
  "contribuir": { pt: "Contribuí para a festa.", en: "I contributed to the party." },
  "controlar": { pt: "Controlo os gastos.", en: "I control my expenses." },
  "convencer": { pt: "Convenci-o a vir.", en: "I convinced him to come." },
  "convergir": { pt: "Os caminhos convergem.", en: "The paths converge." },
  "converter": { pt: "Converteu euros em dólares.", en: "He converted euros to dollars." },
  "convidar": { pt: "Convidei os amigos.", en: "I invited my friends." },
  "conviver": { pt: "Convivo bem com os vizinhos.", en: "I get along well with the neighbours." },
  "convocar": { pt: "Convoquei uma reunião.", en: "I called a meeting." },
  "cooperar": { pt: "Cooperámos no projeto.", en: "We cooperated on the project." },
  "coordenar": { pt: "Coordenei a equipa.", en: "I coordinated the team." },
  "copiar": { pt: "Copiei o documento.", en: "I copied the document." },
  "corresponder": { pt: "Correspondi à carta.", en: "I replied to the letter." },
  "corrigir": { pt: "Corrijo os erros.", en: "I correct the mistakes." },
  "corromper": { pt: "A corrupção corrompe o sistema.", en: "Corruption corrupts the system." },
  "costumar": { pt: "Costumo acordar cedo.", en: "I usually wake up early." },
  "costurar": { pt: "Ela costura a roupa.", en: "She sews clothes." },
  "cozer": { pt: "Cozei o bolo por uma hora.", en: "I baked the cake for an hour." },
  "criar": { pt: "Criámos uma família.", en: "We raised a family." },
  "criticar": { pt: "Ele critica tudo.", en: "He criticises everything." },
  "cruzar": { pt: "Cruzei os braços.", en: "I crossed my arms." },
  "cuidar": { pt: "Cuido dos meus pais.", en: "I take care of my parents." },
  "culminar": { pt: "O jogo culminou num empate.", en: "The game ended in a draw." },
  "cultivar": { pt: "Cultivamos legumes.", en: "We grow vegetables." },
  "cumprir": { pt: "Cumpri a promessa.", en: "I kept the promise." },
  "curar": { pt: "O remédio curou-me.", en: "The medicine cured me." },
  "cursar": { pt: "Ele cursa medicina.", en: "He's studying medicine." },
  "curvar": { pt: "Curvei-me para apanhar a chave.", en: "I bent down to pick up the key." },
  "cuspir": { pt: "Não cuspas no chão.", en: "Don't spit on the floor." },
  "custar": { pt: "Custa dez euros.", en: "It costs ten euros." },
  "debater": { pt: "Debatemos o tema.", en: "We debated the topic." },
  "declarar": { pt: "Declarou amor por ela.", en: "He declared his love for her." },
  "declinar": { pt: "Declinou o convite.", en: "He declined the invitation." },
  "decorar": { pt: "Decorei a lição.", en: "I memorised the lesson." },
  "decorrer": { pt: "O evento decorreu bem.", en: "The event went well." },
  "dedicar": { pt: "Dediquei o livro aos meus pais.", en: "I dedicated the book to my parents." },
  "deduzir": { pt: "Deduzi a resposta.", en: "I deduced the answer." },
  "defender": { pt: "Defendeu a sua opinião.", en: "He defended his opinion." },
  "definir": { pt: "Defina o problema.", en: "Define the problem." },
  "deitar": { pt: "Deitei o lixo fora.", en: "I threw out the rubbish." },
  "deixar": { pt: "Deixa-me em paz.", en: "Leave me alone." },
  "delegar": { pt: "Deleguei tarefas à equipa.", en: "I delegated tasks to the team." },
  "demorar": { pt: "Demorou duas horas.", en: "It took two hours." },
  "demonstrar": { pt: "Ele demonstrou interesse.", en: "He showed interest." },
  "denunciar": { pt: "Denunciei o crime.", en: "I reported the crime." },
  "depender": { pt: "Dependo dos meus pais.", en: "I depend on my parents." },
  "depositar": { pt: "Depositei dinheiro no banco.", en: "I deposited money in the bank." },
  "deprimir": { pt: "O tempo deprimiu-me.", en: "The weather depressed me." },
  "derivar": { pt: "A palavra deriva do latim.", en: "The word derives from Latin." },
  "derramar": { pt: "Derramei o café.", en: "I spilled the coffee." },
  "derrotar": { pt: "Derrotámos o inimigo.", en: "We defeated the enemy." },
  "desabafar": { pt: "Desabafei com um amigo.", en: "I opened up to a friend." },
  "desafiar": { pt: "Desafiei-o para um jogo.", en: "I challenged him to a game." },
  "desagradar": { pt: "O barulho desagrada-me.", en: "The noise displeases me." },
  "desaparecer": { pt: "O sol desapareceu.", en: "The sun disappeared." },
  "desarmar": { pt: "A polícia desarmou o suspeito.", en: "The police disarmed the suspect." },
  "descansar": { pt: "Descansei no fim de semana.", en: "I rested on the weekend." },
  "descarregar": { pt: "Descarreguei as compras.", en: "I unloaded the shopping." },
  "descer": { pt: "Desci as escadas.", en: "I went down the stairs." },
  "descobrir": { pt: "Descobri a verdade.", en: "I discovered the truth." },
  "desconfiar": { pt: "Desconfio dele.", en: "I distrust him." },
  "descrever": { pt: "Descrevi a cena.", en: "I described the scene." },
  "desculpar": { pt: "Desculpe o atraso.", en: "Sorry for the delay." },
  "desejar": { pt: "Desejo-te boa sorte.", en: "I wish you good luck." },
  "desempenhar": { pt: "Ela desempenha um papel importante.", en: "She plays an important role." },
  "desenvolver": { pt: "Desenvolvi uma aplicação.", en: "I developed an application." },
  "desertar": { pt: "Ele desertou do exército.", en: "He deserted the army." },
  "desesperar": { pt: "Não desesperes.", en: "Don't despair." },
  "desistir": { pt: "Desisti de fumar.", en: "I gave up smoking." },
  "desligar": { pt: "Desliguei o telefone.", en: "I hung up the phone." },
  "deslocar": { pt: "Desloquei-me ao Porto.", en: "I travelled to Porto." },
  "desmontar": { pt: "Desmontei a estante.", en: "I disassembled the shelf." },
  "desobedecer": { pt: "Ele desobedeceu às ordens.", en: "He disobeyed the orders." },
  "despedir": { pt: "Despedi-me do chefe.", en: "I said goodbye to my boss." },
  "desperdiçar": { pt: "Não desperdiço comida.", en: "I don't waste food." },
  "despertar": { pt: "O alarme despertou-me.", en: "The alarm woke me up." },
  "despir": { pt: "Dispa o casaco.", en: "Take off your coat." },
  "destacar": { pt: "Ele destaca-se na equipa.", en: "He stands out in the team." },
  "destinar": { pt: "O livro destina-se a crianças.", en: "The book is aimed at children." },
  "destruir": { pt: "O fogo destruiu a casa.", en: "The fire destroyed the house." },
  "desviar": { pt: "Desviei o carro.", en: "I swerved the car." },
  "detestar": { pt: "Detesto acordar cedo.", en: "I hate waking up early." },
  "determinar": { pt: "Determinei a causa.", en: "I determined the cause." },
  "devolver": { pt: "Devolvi o livro à biblioteca.", en: "I returned the book to the library." },
  "diagnosticar": { pt: "Diagnosticaram-lhe gripe.", en: "They diagnosed him with the flu." },
  "ditar": { pt: "O professor ditou o texto.", en: "The teacher dictated the text." },
  "diferenciar": { pt: "As cores diferenciam-se.", en: "The colours differ." },
  "dificultar": { pt: "A chuva dificultou a viagem.", en: "The rain made the trip difficult." },
  "difundir": { pt: "Difundiram a notícia.", en: "They spread the news." },
  "digerir": { pt: "Não digeri bem a comida.", en: "I didn't digest the food well." },
  "diminuir": { pt: "O calor diminuiu.", en: "The heat decreased." },
  "dirigir": { pt: "Ele dirige a empresa.", en: "He runs the company." },
  "disciplinar": { pt: "Disciplinámos os alunos.", en: "We disciplined the students." },
  "discordar": { pt: "Discordo da opinião.", en: "I disagree with the opinion." },
  "discriminar": { pt: "Não discrimines ninguém.", en: "Don't discriminate against anyone." },
  "discursar": { pt: "Ele discursou na conferência.", en: "He gave a speech at the conference." },
  "discutir": { pt: "Discutimos o assunto.", en: "We discussed the matter." },
  "disfarçar": { pt: "Disfarcei a tristeza.", en: "I hid my sadness." },
  "dispensar": { pt: "Ele foi dispensado do trabalho.", en: "He was dismissed from work." },
  "disponibilizar": { pt: "Disponibilizei o relatório.", en: "I made the report available." },
  "dispor": { pt: "Dispomos de tempo.", en: "We have time available." },
  "disputar": { pt: "Disputámos o jogo.", en: "We played the game." },
  "dissolver": { pt: "Dissolvi o sal na água.", en: "I dissolved the salt in the water." },
  "distinguir": { pt: "Distingo as cores.", en: "I distinguish the colours." },
  "distribuir": { pt: "Distribuí os panfletos.", en: "I distributed the leaflets." },
  "divertir": { pt: "Divertimo-nos muito.", en: "We had a lot of fun." },
  "dividir": { pt: "Dividi a conta.", en: "I split the bill." },
  "divorciar": { pt: "Eles divorciaram-se.", en: "They got divorced." },
  "divulgar": { pt: "Divulguei a informação.", en: "I disclosed the information." },
  "doar": { pt: "Doei sangue ontem.", en: "I donated blood yesterday." },
  "dobrar": { pt: "Dobrei a roupa.", en: "I folded the laundry." },
  "documentar": { pt: "Documentei a viagem.", en: "I documented the trip." },
  "doer": { pt: "Dói-me a cabeça.", en: "My head hurts." },
  "dominar": { pt: "Ela domina três línguas.", en: "She speaks three languages fluently." },
  "dourar": { pt: "O sol dourava a paisagem.", en: "The sun gilded the landscape." },
  "duvidar": { pt: "Duvido das suas intenções.", en: "I doubt his intentions." },
  "durar": { pt: "O filme durou duas horas.", en: "The film lasted two hours." },
  "economizar": { pt: "Economizei dinheiro para a viagem.", en: "I saved money for the trip." },
  "edificar": { pt: "Edificámos uma igreja.", en: "We built a church." },
  "editar": { pt: "Editei o livro.", en: "I edited the book." },
  "educar": { pt: "Educo os meus filhos com carinho.", en: "I raise my children with care." },
  "efetuar": { pt: "Efetuei o pagamento.", en: "I made the payment." },
  "elaborar": { pt: "Ela elaborou o relatório.", en: "She drew up the report." },
  "eleger": { pt: "Elegeram-no presidente.", en: "They elected him president." },
  "elevar": { pt: "Elevei a voz.", en: "I raised my voice." },
  "eliminar": { pt: "Eliminei o lixo.", en: "I disposed of the rubbish." },
  "embarcar": { pt: "Embarquei no avião.", en: "I boarded the plane." },
  "emitir": { pt: "Emitiram o documento.", en: "They issued the document." },
  "emocionar": { pt: "O filme emocionou-me.", en: "The film moved me." },
  "empacotar": { pt: "Empacotei as prendas.", en: "I wrapped the gifts." },
  "empenhar-se": { pt: "Ele empenhou-se no trabalho.", en: "He dedicated himself to the work." },
  "empolgar": { pt: "A notícia empolgou-me.", en: "The news excited me." },
  "empreender": { pt: "Empreendi uma viagem.", en: "I undertook a journey." },
  "empregar": { pt: "Empreguei mil euros.", en: "I spent a thousand euros." },
  "empurrar": { pt: "Empurrei a porta.", en: "I pushed the door." },
  "encantar": { pt: "A música encantou-me.", en: "The music delighted me." },
  "encerrar": { pt: "A loja encerrou às dez.", en: "The shop closed at ten." },
  "encher": { pt: "Enchi o copo de água.", en: "I filled the glass with water." },
  "encomendar": { pt: "Encomendei uma pizza.", en: "I ordered a pizza." },
  "encorajar": { pt: "Ela encorajou-me.", en: "She encouraged me." },
  "endurecer": { pt: "O pão endureceu.", en: "The bread hardened." },
  "enfraquecer": { pt: "A doença enfraqueceu-o.", en: "The illness weakened him." },
  "enfrentar": { pt: "Enfrentei os meus medos.", en: "I faced my fears." },
  "enganar": { pt: "Ele enganou-me.", en: "He deceived me." },
  "engolir": { pt: "Engoli a comida.", en: "I swallowed the food." },
  "engordar": { pt: "Engordei três quilos.", en: "I gained three kilos." },
  "enlouquecer": { pt: "O barulho enlouqueceu-me.", en: "The noise drove me crazy." },
  "enriquecer": { pt: "Enriqueceu com o negócio.", en: "He got rich from the business." },
  "ensaiar": { pt: "Ensaiei a peça de teatro.", en: "I rehearsed the play." },
  "entender": { pt: "Entendo o problema.", en: "I understand the problem." },
  "enterrar": { pt: "Enterrei o animal.", en: "I buried the animal." },
  "entregar": { pt: "Entreguei o relatório ao chefe.", en: "I delivered the report to the boss." },
  "entrevistar": { pt: "Entrevistei o candidato.", en: "I interviewed the candidate." },
  "entristecer": { pt: "A notícia entristeceu-me.", en: "The news saddened me." },
  "envelhecer": { pt: "Ele envelheceu bem.", en: "He aged well." },
  "envergonhar": { pt: "Ele envergonhou-me.", en: "He embarrassed me." },
  "enviar": { pt: "Enviei o email.", en: "I sent the email." },
  "envolver": { pt: "Envolvi-me no projeto.", en: "I got involved in the project." },
  "equilibrar": { pt: "Equilibrei as contas.", en: "I balanced the accounts." },
  "equipar": { pt: "Equipámos a cozinha.", en: "We equipped the kitchen." },
  "erguer": { pt: "Ergueu os braços.", en: "He raised his arms." },
  "errar": { pt: "Errei o alvo.", en: "I missed the target." },
  "escapar": { pt: "O gato escapou pela janela.", en: "The cat escaped through the window." },
  "esclarecer": { pt: "Esclareci a dúvida.", en: "I clarified the doubt." },
  "esconder": { pt: "Escondi o presente.", en: "I hid the present." },
  "escutar": { pt: "Escutei a música.", en: "I listened to the music." },
  "esfolar": { pt: "Esfolei o joelho.", en: "I scraped my knee." },
  "esforçar-se": { pt: "Esforcei-me muito.", en: "I made a great effort." },
  "esgotar": { pt: "Esgotei a paciência.", en: "I exhausted my patience." },
  "esmagar": { pt: "Esmaguei o dedo na porta.", en: "I crushed my finger in the door." },
  "espantar": { pt: "A multidão espantou-se.", en: "The crowd was amazed." },
  "espirrar": { pt: "Espirrei durante a noite.", en: "I sneezed during the night." },
  "estabelecer": { pt: "Estabeleci regras claras.", en: "I established clear rules." },
  "estacionar": { pt: "Estacionei o carro.", en: "I parked the car." },
  "estender": { pt: "Estendi a toalha.", en: "I spread out the towel." },
  "estimular": { pt: "A música estimula a criatividade.", en: "Music stimulates creativity." },
  "estipular": { pt: "Estipulámos um prazo.", en: "We set a deadline." },
  "esticar": { pt: "Estiquei as pernas.", en: "I stretched my legs." },
  "estimar": { pt: "Estimo muito os meus amigos.", en: "I value my friends a lot." },
  "estragar": { pt: "Estraguei a roupa.", en: "I ruined the clothes." },
  "estranhar": { pt: "Estranhei o comportamento dele.", en: "I found his behaviour strange." },
  "estrear": { pt: "O filme estreou ontem.", en: "The film premiered yesterday." },
  "evacuar": { pt: "Evacuaram o prédio.", en: "They evacuated the building." },
  "evocar": { pt: "A música evocou memórias.", en: "The music evoked memories." },
  "evoluir": { pt: "O paciente evoluiu bem.", en: "The patient evolved well." },
  "exagerar": { pt: "Ele exagerou na história.", en: "He exaggerated the story." },
  "examinar": { pt: "Examinei o paciente.", en: "I examined the patient." },
  "exceder": { pt: "Excedi o limite de velocidade.", en: "I exceeded the speed limit." },
  "exclamar": { pt: "Ele exclamou de alegria.", en: "He exclaimed with joy." },
  "excluir": { pt: "Excluí essa opção.", en: "I excluded that option." },
  "executar": { pt: "Executei a tarefa.", en: "I performed the task." },
  "exercer": { pt: "Exerço advocacia.", en: "I practise law." },
  "exercitar": { pt: "Exercito-me todos os dias.", en: "I exercise every day." },
  "exibir": { pt: "Exibiu o seu trabalho.", en: "He exhibited his work." },
  "exigir": { pt: "Exijo uma explicação.", en: "I demand an explanation." },
  "expandir": { pt: "Expandimos o negócio.", en: "We expanded the business." },
  "experimentar": { pt: "Experimentei o prato.", en: "I tried the dish." },
  "explorar": { pt: "Explorámos a floresta.", en: "We explored the forest." },
  "exportar": { pt: "Exportamos vinho.", en: "We export wine." },
  "expor": { pt: "Expus a minha opinião.", en: "I exposed my opinion." },
  "expressar": { pt: "Expressei os meus sentimentos.", en: "I expressed my feelings." },
  "expulsar": { pt: "Expulsaram-no da sala.", en: "They threw him out of the room." },
  "extrair": { pt: "Extraí o dente.", en: "I had the tooth extracted." },
  "fabricar": { pt: "A empresa fabrica móveis.", en: "The company manufactures furniture." },
  "facilitar": { pt: "Facilitei o processo.", en: "I made the process easier." },
  "falhar": { pt: "Falhei o exame.", en: "I failed the exam." },
  "falsificar": { pt: "Falsificaram o documento.", en: "They forged the document." },
  "faltar": { pt: "Faltou ao trabalho hoje.", en: "He missed work today." },
  "fascinar": { pt: "A vista fascinou-me.", en: "The view fascinated me." },
  "favorecer": { pt: "O clima favoreceu a colheita.", en: "The weather favoured the harvest." },
  "felicitar": { pt: "Felicitámos o vencedor.", en: "We congratulated the winner." },
  "ferir": { pt: "Feri-me com a faca.", en: "I cut myself with the knife." },
  "ferver": { pt: "A água está a ferver.", en: "The water is boiling." },
  "festejar": { pt: "Festejámos o aniversário.", en: "We celebrated the birthday." },
  "filmar": { pt: "Filmei a festa.", en: "I filmed the party." },
  "filtrar": { pt: "Filtrei o café.", en: "I filtered the coffee." },
  "financiar": { pt: "O banco financiou a empresa.", en: "The bank financed the company." },
  "fingir": { pt: "Fingi que estava doente.", en: "I pretended to be sick." },
  "fixar": { pt: "Fixámos a data da reunião.", en: "We set the meeting date." },
  "florescer": { pt: "As flores floresceram na primavera.", en: "The flowers blossomed in spring." },
  "fluir": { pt: "A água flui para o mar.", en: "Water flows to the sea." },
  "focar": { pt: "Foquei a câmara.", en: "I focused the camera." },
  "folhear": { pt: "Folheei o livro.", en: "I leafed through the book." },
  "forçar": { pt: "Forcei a porta.", en: "I forced the door." },
  "formar": { pt: "Formei-me em engenharia.", en: "I trained in engineering." },
  "formular": { pt: "Formulei uma pergunta.", en: "I formulated a question." },
  "fornecer": { pt: "A empresa fornece materiais.", en: "The company supplies materials." },
  "fortalecer": { pt: "O treino fortalece os músculos.", en: "Training strengthens the muscles." },
  "fotografar": { pt: "Fotografei o pôr do sol.", en: "I photographed the sunset." },
  "frear": { pt: "Freei a tempo.", en: "I braked in time." },
  "frequentar": { pt: "Frequento o ginásio.", en: "I attend the gym." },
  "fritar": { pt: "Fritei os ovos.", en: "I fried the eggs." },
  "frustrar": { pt: "O resultado frustrou-me.", en: "The result frustrated me." },
  "fugir": { pt: "O ladrão fugiu.", en: "The thief ran away." },
  "fumar": { pt: "Ele fuma muito.", en: "He smokes a lot." },
  "funcionar": { pt: "O carro não funciona.", en: "The car doesn't work." },
  "fundar": { pt: "Fundei uma empresa.", en: "I founded a company." },
  "fundir": { pt: "O metal fundiu-se.", en: "The metal melted." },
  "furar": { pt: "Furei o pneu.", en: "I punctured the tyre." },
  "furtar": { pt: "Furtaram a carteira.", en: "They stole the wallet." },
  "gabar-se": { pt: "Ele gaba-se demais.", en: "He brags too much." },
  "garantir": { pt: "Garanti o produto.", en: "I guaranteed the product." },
  "gastar": { pt: "Gastei todo o dinheiro.", en: "I spent all the money." },
  "gemer": { pt: "Ela gemeu de dor.", en: "She groaned in pain." },
  "generalizar": { pt: "Não generalizes.", en: "Don't generalise." },
  "gerar": { pt: "O painel gera eletricidade.", en: "The panel generates electricity." },
  "gerir": { pt: "Giro o restaurante.", en: "I manage the restaurant." },
  "glorificar": { pt: "Glorificaram o herói.", en: "They glorified the hero." },
  "governar": { pt: "Ele governou o país.", en: "He governed the country." },
  "gravar": { pt: "Gravei o programa.", en: "I recorded the programme." },
  "gritar": { pt: "A criança gritou.", en: "The child shouted." },
  "guardar": { pt: "Guardei o segredo.", en: "I kept the secret." },
  "guiar": { pt: "Ele guiou-me até lá.", en: "He guided me there." },
  "habitar": { pt: "Eles habitam uma casa antiga.", en: "They live in an old house." },
  "habituar": { pt: "Habituei-me ao frio.", en: "I got used to the cold." },
  "harmonizar": { pt: "Harmonizei as cores.", en: "I matched the colours." },
  "herdar": { pt: "Herdei a casa do avô.", en: "I inherited my grandfather's house." },
  "hesitar": { pt: "Não hesites em perguntar.", en: "Don't hesitate to ask." },
  "hidratar": { pt: "Hidrato a pele todos os dias.", en: "I moisturise my skin every day." },
  "homenagear": { pt: "Homenageámos o professor.", en: "We paid tribute to the teacher." },
  "honrar": { pt: "Honro os meus pais.", en: "I honour my parents." },
  "hospedar": { pt: "Hospedei o meu amigo.", en: "I hosted my friend." },
  "humilhar": { pt: "Não humilhes ninguém.", en: "Don't humiliate anyone." },
  "identificar": { pt: "Identifiquei o suspeito.", en: "I identified the suspect." },
  "ignorar": { pt: "Ignorei o comentário.", en: "I ignored the comment." },
  "iluminar": { pt: "A lua iluminava o caminho.", en: "The moon lit the path." },
  "ilustrar": { pt: "Ilustrei o livro.", en: "I illustrated the book." },
  "imaginar": { pt: "Imagina um mundo melhor.", en: "Imagine a better world." },
  "imigrar": { pt: "Imigrou para o Brasil.", en: "He emigrated to Brazil." },
  "imitar": { pt: "O miúdo imita o pai.", en: "The kid imitates his father." },
  "impedir": { pt: "Impedi o acidente.", en: "I prevented the accident." },
  "implicar": { pt: "Não implica comigo.", en: "Don't pick on me." },
  "impor": { pt: "Impus a minha opinião.", en: "I imposed my opinion." },
  "importar": { pt: "Importamos café do Brasil.", en: "We import coffee from Brazil." },
  "impressionar": { pt: "O filme impressionou-me.", en: "The film impressed me." },
  "imprimir": { pt: "Imprimi o documento.", en: "I printed the document." },
  "improvisar": { pt: "Improvisei o jantar.", en: "I improvised dinner." },
  "inaugurar": { pt: "Inaugurámos a loja.", en: "We opened the shop." },
  "inchar": { pt: "O tornozelo inchou.", en: "The ankle swelled." },
  "incluir": { pt: "Incluí o nome na lista.", en: "I included the name in the list." },
  "incorporar": { pt: "Incorporei a empresa.", en: "I incorporated the company." },
  "indicar": { pt: "Indiquei o caminho.", en: "I indicated the way." },
  "indignar": { pt: "A decisão indignou-me.", en: "The decision outraged me." },
  "induzir": { pt: "Ele induziu-me em erro.", en: "He misled me." },
  "infectar": { pt: "O vírus infectou o computador.", en: "The virus infected the computer." },
  "influenciar": { pt: "Ela influenciou a decisão.", en: "She influenced the decision." },
  "informar": { pt: "Informei o chefe.", en: "I informed the boss." },
  "iniciar": { pt: "Iniciei o projeto.", en: "I started the project." },
  "injetar": { pt: "Injetaram a vacina.", en: "They injected the vaccine." },
  "inovar": { pt: "A empresa inova constantemente.", en: "The company constantly innovates." },
  "inscrever": { pt: "Inscrevi-me no curso.", en: "I enrolled in the course." },
  "inserir": { pt: "Inseri o cartão.", en: "I inserted the card." },
  "insinuar": { pt: "Ela insinuou algo.", en: "She insinuated something." },
  "insistir": { pt: "Insisti no assunto.", en: "I insisted on the matter." },
  "inspecionar": { pt: "Inspecionei o edifício.", en: "I inspected the building." },
  "inspirar": { pt: "O livro inspirou-me.", en: "The book inspired me." },
  "instalar": { pt: "Instalei o programa.", en: "I installed the programme." },
  "instruir": { pt: "Instruí os recrutas.", en: "I trained the recruits." },
  "insultar": { pt: "Ele insultou-me.", en: "He insulted me." },
  "integrar": { pt: "Integrei a equipa.", en: "I joined the team." },
  "interessar": { pt: "O tema interessa-me.", en: "The topic interests me." },
  "interligar": { pt: "Interliguei os sistemas.", en: "I interconnected the systems." },
  "interpretar": { pt: "Ele interpretou o papel.", en: "He played the role." },
  "interrogar": { pt: "A polícia interrogou-o.", en: "The police interrogated him." },
  "interromper": { pt: "Interrompi a reunião.", en: "I interrupted the meeting." },
  "intervir": { pt: "A polícia interveio.", en: "The police intervened." },
  "intimidar": { pt: "Ele intimidou-me.", en: "He intimidated me." },
  "introduzir": { pt: "Introduzi a chave na fechadura.", en: "I inserted the key in the lock." },
  "invadir": { pt: "Invadiram o país.", en: "They invaded the country." },
  "inventar": { pt: "Inventou uma história.", en: "He made up a story." },
  "investigar": { pt: "A polícia investigou o caso.", en: "The police investigated the case." },
  "investir": { pt: "Investi dinheiro na bolsa.", en: "I invested money in the stock market." },
  "irritar": { pt: "O barulho irritou-me.", en: "The noise irritated me." },
  "isolar": { pt: "Isolei o paciente.", en: "I isolated the patient." },
  "jantar": { pt: "Jantei fora ontem.", en: "I had dinner out yesterday." },
  "jogar": { pt: "Jogámos futebol no parque.", en: "We played football in the park." },
  "julgar": { pt: "Julguei mal a situação.", en: "I misjudged the situation." },
  "juntar": { pt: "Juntei os documentos.", en: "I gathered the documents." },
  "jurar": { pt: "Jurei dizer a verdade.", en: "I swore to tell the truth." },
  "justificar": { pt: "Justifiquei a minha ausência.", en: "I justified my absence." },
  "lamentar": { pt: "Lamento a sua perda.", en: "I'm sorry for your loss." },
  "lançar": { pt: "Lançaram o livro ontem.", en: "They launched the book yesterday." },
  "largar": { pt: "Larguei o emprego.", en: "I quit my job." },
  "legalizar": { pt: "Legalizaram o documento.", en: "They legalised the document." },
  "legislar": { pt: "O parlamento legisla.", en: "Parliament legislates." },
  "legitimar": { pt: "Legitimar a decisão.", en: "To legitimise the decision." },
  "levar": { pt: "Levei o cão ao veterinário.", en: "I took the dog to the vet." },
  "libertar": { pt: "Libertaram o prisioneiro.", en: "They freed the prisoner." },
  "lidar": { pt: "Lido bem com o stress.", en: "I cope well with stress." },
  "liderar": { pt: "Ela lidera a equipa.", en: "She leads the team." },
  "ligar": { pt: "Liguei o aquecedor.", en: "I turned on the heater." },
  "limitar": { pt: "O tempo limita-nos.", en: "Time limits us." },
  "localizar": { pt: "Localizei o problema.", en: "I located the problem." },
  "lutar": { pt: "Lutámos pela liberdade.", en: "We fought for freedom." },
  "machucar": { pt: "Machuquei o braço.", en: "I hurt my arm." },
  "maldizer": { pt: "Ele maldisse a sorte.", en: "He cursed his luck." },
  "maltratar": { pt: "Ele maltratou o animal.", en: "He mistreated the animal." },
  "manchar": { pt: "Manchei a camisa.", en: "I stained my shirt." },
  "mandar": { pt: "Mandei um email.", en: "I sent an email." },
  "manifestar": { pt: "Manifestámos contra a guerra.", en: "We protested against the war." },
  "manipular": { pt: "Ele manipula as pessoas.", en: "He manipulates people." },
  "manter": { pt: "Mantenho a casa limpa.", en: "I keep the house clean." },
  "marcar": { pt: "Marquei a reunião.", en: "I scheduled the meeting." },
  "marchar": { pt: "Marchámos pela cidade.", en: "We marched through the city." },
  "mastigar": { pt: "Mastigou a comida.", en: "He chewed the food." },
  "matar": { pt: "Matei a sede com água.", en: "I quenched my thirst with water." },
  "matricular": { pt: "Matriculei-me na universidade.", en: "I enrolled at university." },
  "mediar": { pt: "Ele mediou o conflito.", en: "He mediated the conflict." },
  "medicar": { pt: "Medicaram o doente.", en: "They medicated the patient." },
  "medir": { pt: "Medi a temperatura.", en: "I measured the temperature." },
  "melhorar": { pt: "A situação melhorou.", en: "The situation improved." },
  "mencionar": { pt: "Mencionei o problema.", en: "I mentioned the problem." },
  "mentir": { pt: "Ele mentiu-me.", en: "He lied to me." },
  "merecer": { pt: "Ele merece o prémio.", en: "He deserves the prize." },
  "mergulhar": { pt: "Mergulhei no mar.", en: "I dived into the sea." },
  "meter": { pt: "Mete a roupa na máquina.", en: "Put the clothes in the machine." },
  "mexer": { pt: "Mexi o café.", en: "I stirred the coffee." },
  "migrar": { pt: "Migrámos para a cidade.", en: "We migrated to the city." },
  "misturar": { pt: "Misturei os ingredientes.", en: "I mixed the ingredients." },
  "mobilizar": { pt: "Mobilizámos a equipa.", en: "We mobilised the team." },
  "modelar": { pt: "Modelei a argila.", en: "I modelled the clay." },
  "moderar": { pt: "Ele moderou o debate.", en: "He moderated the debate." },
  "modernizar": { pt: "Modernizámos a fábrica.", en: "We modernised the factory." },
  "modificar": { pt: "Modifiquei a receita.", en: "I modified the recipe." },
  "moer": { pt: "Moí o café.", en: "I ground the coffee." },
  "molestar": { pt: "Não moleste os animais.", en: "Don't bother the animals." },
  "molhar": { pt: "Molhei a planta.", en: "I watered the plant." },
  "montar": { pt: "Montei a estante.", en: "I assembled the shelf." },
  "morder": { pt: "O cão mordeu-me.", en: "The dog bit me." },
  "motivar": { pt: "O professor motivou os alunos.", en: "The teacher motivated the students." },
  "mover": { pt: "Movi a mesa.", en: "I moved the table." },
  "multiplicar": { pt: "Multipliquei os números.", en: "I multiplied the numbers." },
  "murmurar": { pt: "Ele murmurou algo.", en: "He muttered something." },
  "namorar": { pt: "Ele namora a Ana.", en: "He's dating Ana." },
  "narrar": { pt: "Narrou a história.", en: "He narrated the story." },
  "navegar": { pt: "Naveguei pela internet.", en: "I surfed the internet." },
  "necessitar": { pt: "Necessito de ajuda.", en: "I need help." },
  "negar": { pt: "Ele negou o facto.", en: "He denied the fact." },
  "negociar": { pt: "Negociámos o preço.", en: "We negotiated the price." },
  "nevar": { pt: "Nevou durante a noite.", en: "It snowed overnight." },
  "nomear": { pt: "Nomearam-na diretora.", en: "They appointed her director." },
  "normalizar": { pt: "A situação normalizou-se.", en: "The situation normalised." },
  "notar": { pt: "Notei a diferença.", en: "I noticed the difference." },
  "notificar": { pt: "Notifiquei as autoridades.", en: "I notified the authorities." },
  "numerar": { pt: "Numerei as páginas.", en: "I numbered the pages." },
  "nutrir": { pt: "A mãe nutre o bebé.", en: "The mother nourishes the baby." },
  "obedecer": { pt: "Obedeci às ordens.", en: "I obeyed the orders." },
  "objetivar": { pt: "Objectivámos o sucesso.", en: "We aimed for success." },
  "obrigar": { pt: "Obrigaram-me a sair.", en: "They forced me to leave." },
  "observar": { pt: "Observei o comportamento dele.", en: "I observed his behaviour." },
  "obter": { pt: "Obtive o diploma.", en: "I obtained the diploma." },
  "ocupar": { pt: "Ocupei o lugar dele.", en: "I took his seat." },
  "ofender": { pt: "Ele ofendeu-me.", en: "He offended me." },
  "olhar": { pt: "Olhei pela janela.", en: "I looked through the window." },
  "omitir": { pt: "Omiti os detalhes.", en: "I omitted the details." },
  "operar": { pt: "Operaram o paciente.", en: "They operated on the patient." },
  "opor": { pt: "Oponho-me à decisão.", en: "I oppose the decision." },
  "oprimir": { pt: "O regime oprimia o povo.", en: "The regime oppressed the people." },
  "optar": { pt: "Optei por ficar.", en: "I chose to stay." },
  "orar": { pt: "Ele orou antes de comer.", en: "He prayed before eating." },
  "ordenar": { pt: "Ordenei os livros.", en: "I ordered the books." },
  "organizar": { pt: "Organizei a festa.", en: "I organised the party." },
  "orientar": { pt: "Ele orientou-me na empresa.", en: "He mentored me at the company." },
  "originar": { pt: "O fogo originou-se na cozinha.", en: "The fire originated in the kitchen." },
  "ousar": { pt: "Não ousei contradizê-lo.", en: "I didn't dare contradict him." },
  "participar": { pt: "Participei na reunião.", en: "I participated in the meeting." },
  "passear": { pt: "Passei pelo parque.", en: "I walked through the park." },
  "patrocinar": { pt: "A empresa patrocinou o evento.", en: "The company sponsored the event." },
  "pausar": { pt: "Pausei o filme.", en: "I paused the film." },
  "pegar": { pt: "Peguei no livro.", en: "I picked up the book." },
  "penalizar": { pt: "Penalizaram o infrator.", en: "They penalised the offender." },
  "pendurar": { pt: "Pendurei o casaco.", en: "I hung up the coat." },
  "penetrar": { pt: "A luz penetrou a janela.", en: "The light penetrated through the window." },
  "percorrer": { pt: "Percorri o país inteiro.", en: "I travelled the whole country." },
  "perdoar": { pt: "Perdoei-o.", en: "I forgave him." },
  "perfurar": { pt: "Perfurei o papel.", en: "I punched a hole in the paper." },
  "perseguir": { pt: "O cão perseguiu o gato.", en: "The dog chased the cat." },
  "persistir": { pt: "Ele persistiu na ideia.", en: "He persisted with the idea." },
  "personalizar": { pt: "Personalizei o presente.", en: "I personalised the gift." },
  "pertencer": { pt: "O livro pertence-me.", en: "The book belongs to me." },
  "perturbar": { pt: "O barulho perturbou-me.", en: "The noise disturbed me." },
  "pescar": { pt: "Pescámos no rio.", en: "We fished in the river." },
  "pesquisar": { pt: "Pesquisei na internet.", en: "I searched the internet." },
  "picar": { pt: "O mosquito picou-me.", en: "The mosquito stung me." },
  "pilotar": { pt: "Ele pilota o avião.", en: "He pilots the plane." },
  "pisar": { pt: "Pisei a relva.", en: "I stepped on the grass." },
  "planear": { pt: "Planeei a viagem.", en: "I planned the trip." },
  "plantar": { pt: "Plantei uma árvore.", en: "I planted a tree." },
  "polir": { pt: "Poli a prata.", en: "I polished the silver." },
  "poluir": { pt: "A fábrica poluiu o rio.", en: "The factory polluted the river." },
  "ponderar": { pt: "Ponderei as opções.", en: "I weighed the options." },
  "pontuar": { pt: "Pontuei o teste.", en: "I scored the test." },
  "popularizar": { pt: "A música popularizou-se.", en: "The music became popular." },
  "portar-se": { pt: "Portou-se mal na festa.", en: "He behaved badly at the party." },
  "posar": { pt: "Ela posou para a foto.", en: "She posed for the photo." },
  "posicionar": { pt: "Posicionei a câmera.", en: "I positioned the camera." },
  "possibilitar": { pt: "O empréstimo possibilitou a compra.", en: "The loan enabled the purchase." },
  "possuir": { pt: "Possuo um carro.", en: "I own a car." },
  "poupar": { pt: "Poupámos para as férias.", en: "We saved for the holidays." },
  "pousar": { pt: "O pássaro pousou no ramo.", en: "The bird landed on the branch." },
  "praticar": { pt: "Pratico desporto todos os dias.", en: "I practise sport every day." },
  "predizer": { pt: "Predisse o resultado.", en: "He predicted the result." },
  "prejudicar": { pt: "A chuva prejudicou a colheita.", en: "The rain damaged the harvest." },
  "premiar": { pt: "Premiaram o melhor aluno.", en: "They awarded the best student." },
  "prender": { pt: "Prenderam o ladrão.", en: "They arrested the thief." },
  "preocupar": { pt: "Preocupo-me com o futuro.", en: "I worry about the future." },
  "preparar": { pt: "Preparei o jantar.", en: "I prepared dinner." },
  "prescrever": { pt: "O médico prescreveu um remédio.", en: "The doctor prescribed a medicine." },
  "preservar": { pt: "Preservámos a natureza.", en: "We preserved nature." },
  "presidir": { pt: "Ele presidiu a reunião.", en: "He chaired the meeting." },
  "pressionar": { pt: "Pressionei o botão.", en: "I pressed the button." },
  "prestar": { pt: "Prestei atenção.", en: "I paid attention." },
  "presumir": { pt: "Presumi que vieste.", en: "I assumed you came." },
  "pretender": { pt: "Pretendo viajar amanhã.", en: "I intend to travel tomorrow." },
  "prevenir": { pt: "Previni o problema.", en: "I prevented the problem." },
  "prever": { pt: "Previ a chuva.", en: "I predicted the rain." },
  "priorizar": { pt: "Priorizei a saúde.", en: "I prioritised health." },
  "privar": { pt: "Privar-se de doces.", en: "To deprive oneself of sweets." },
  "privilegiar": { pt: "Privilegiámos a qualidade.", en: "We privileged quality." },
  "processar": { pt: "Processaram o suspeito.", en: "They prosecuted the suspect." },
  "proclamar": { pt: "Proclamaram a independência.", en: "They proclaimed independence." },
  "procurar": { pt: "Procurei as chaves.", en: "I looked for the keys." },
  "produzir": { pt: "A fábrica produz carros.", en: "The factory produces cars." },
  "progredir": { pt: "Progredimos muito este ano.", en: "We progressed a lot this year." },
  "proibir": { pt: "Proibiram fumar aqui.", en: "Smoking is forbidden here." },
  "prolongar": { pt: "Prolonguei a estadia.", en: "I extended my stay." },
  "prometer": { pt: "Prometi voltar cedo.", en: "I promised to come back early." },
  "promover": { pt: "Promoveram-na a gerente.", en: "They promoted her to manager." },
  "pronunciar": { pt: "Pronunciei o nome.", en: "I pronounced the name." },
  "propagar": { pt: "Propagou-se a notícia.", en: "The news spread." },
  "propor": { pt: "Propus uma solução.", en: "I proposed a solution." },
  "proporcionar": { pt: "Proporcionou-me alegria.", en: "It gave me joy." },
  "prosperar": { pt: "O negócio prosperou.", en: "The business prospered." },
  "proteger": { pt: "Protegi a criança.", en: "I protected the child." },
  "protestar": { pt: "Protestámos contra o aumento.", en: "We protested against the rise." },
  "provar": { pt: "Provei o vinho.", en: "I tasted the wine." },
  "provocar": { pt: "Ele provocou uma discussão.", en: "He provoked an argument." },
  "publicar": { pt: "Publiquei o artigo.", en: "I published the article." },
  "pular": { pt: "Pulei a cerca.", en: "I jumped over the fence." },
  "punir": { pt: "Puniram o infrator.", en: "They punished the offender." },
  "puxar": { pt: "Puxei a cadeira.", en: "I pulled the chair." },
  "qualificar": { pt: "Qualifiquei o candidato.", en: "I qualified the candidate." },
  "quebrar": { pt: "Quebrei o copo.", en: "I broke the glass." },
  "queimar": { pt: "Queimei a mão.", en: "I burned my hand." },
  "queixar-se": { pt: "Queixei-me ao chefe.", en: "I complained to the boss." },
  "questionar": { pt: "Questionei a decisão.", en: "I questioned the decision." },
  "raciocinar": { pt: "Raciocinei com calma.", en: "I reasoned calmly." },
  "rasgar": { pt: "Rasguei o papel.", en: "I tore the paper." },
  "rastejar": { pt: "O bebé rastejou.", en: "The baby crawled." },
  "reagir": { pt: "Ela reagiu rapidamente.", en: "She reacted quickly." },
  "realizar": { pt: "Realizei o meu sonho.", en: "I achieved my dream." },
  "reaparecer": { pt: "O sol reapareceu.", en: "The sun reappeared." },
  "recear": { pt: "Receio o pior.", en: "I fear the worst." },
  "reciclar": { pt: "Reciclámos o papel.", en: "We recycled the paper." },
  "reclamar": { pt: "Reclamei do barulho.", en: "I complained about the noise." },
  "recomendar": { pt: "Recomendo este restaurante.", en: "I recommend this restaurant." },
  "recompensar": { pt: "Recompensaram o esforço.", en: "They rewarded the effort." },
  "reconciliar": { pt: "Reconciliaram-se.", en: "They made up." },
  "reconhecer": { pt: "Reconheci o erro.", en: "I acknowledged the mistake." },
  "recordar": { pt: "Recordo o passado com carinho.", en: "I remember the past fondly." },
  "recorrer": { pt: "Recorri ao tribunal.", en: "I appealed to the court." },
  "recuperar": { pt: "Recuperei do resfriado.", en: "I recovered from the cold." },
  "recusar": { pt: "Recusei o convite.", en: "I refused the invitation." },
  "redescobrir": { pt: "Redescobri a cidade.", en: "I rediscovered the city." },
  "redigir": { pt: "Redigi o relatório.", en: "I wrote the report." },
  "reduzir": { pt: "Reduzi o consumo de açúcar.", en: "I reduced my sugar intake." },
  "referir": { pt: "Referi o assunto.", en: "I referred to the matter." },
  "refletir": { pt: "Refleti sobre o problema.", en: "I reflected on the problem." },
  "reformar": { pt: "Reformámos a casa.", en: "We renovated the house." },
  "reforçar": { pt: "Reforcei as medidas de segurança.", en: "I strengthened the security measures." },
  "refugiar-se": { pt: "Ele refugiou-se na montanha.", en: "He took refuge in the mountain." },
  "regar": { pt: "Reguei as plantas.", en: "I watered the plants." },
  "regatear": { pt: "Regateámos o preço.", en: "We haggled over the price." },
  "registar": { pt: "Registei o carro.", en: "I registered the car." },
  "regressar": { pt: "Regressei a casa.", en: "I returned home." },
  "regular": { pt: "Regulei a temperatura.", en: "I adjusted the temperature." },
  "reinar": { pt: "A rainha reinou durante anos.", en: "The queen reigned for years." },
  "reinventar": { pt: "Reinventei a receita.", en: "I reinvented the recipe." },
  "reivindicar": { pt: "Reivindicámos os direitos.", en: "We claimed our rights." },
  "rejeitar": { pt: "Rejeitei a proposta.", en: "I rejected the proposal." },
  "relacionar": { pt: "Relacionei os factos.", en: "I connected the facts." },
  "relaxar": { pt: "Relaxe no sofá.", en: "Relax on the sofa." },
  "relembrar": { pt: "Relembrei os velhos tempos.", en: "I recalled the old times." },
  "reluzir": { pt: "O ouro reluzia.", en: "The gold was shining." },
  "remarcar": { pt: "Remarquei a consulta.", en: "I rescheduled the appointment." },
  "remediar": { pt: "Remediámos o problema.", en: "We remedied the problem." },
  "remeter": { pt: "Remeti o pacote.", en: "I sent the parcel." },
  "remover": { pt: "Removi a mancha.", en: "I removed the stain." },
  "render": { pt: "O trabalho rendeu.", en: "The work paid off." },
  "renovar": { pt: "Renovei o passaporte.", en: "I renewed my passport." },
  "renunciar": { pt: "Renunciei ao cargo.", en: "I resigned from the position." },
  "reparar": { pt: "Reparei o carro.", en: "I repaired the car." },
  "repartir": { pt: "Repartimos o bolo.", en: "We shared the cake." },
  "repetir": { pt: "Repeti o pedido.", en: "I repeated the request." },
  "repor": { pt: "Repus o livro na prateleira.", en: "I put the book back on the shelf." },
  "representar": { pt: "Ela representa a empresa.", en: "She represents the company." },
  "reprimir": { pt: "Ele reprimiu a emoção.", en: "He repressed the emotion." },
  "reproduzir": { pt: "Reproduzi a música.", en: "I played the music." },
  "reputar": { pt: "Reputam-no inteligente.", en: "They consider him intelligent." },
  "requerer": { pt: "O cargo requer experiência.", en: "The position requires experience." },
  "reservar": { pt: "Reservei uma mesa.", en: "I booked a table." },
  "residir": { pt: "Ele reside em Lisboa.", en: "He resides in Lisbon." },
  "resistir": { pt: "Resisti à tentação.", en: "I resisted the temptation." },
  "resolver": { pt: "Resolvi o problema.", en: "I solved the problem." },
  "respeitar": { pt: "Respeito os mais velhos.", en: "I respect my elders." },
  "respirar": { pt: "Respirei fundo.", en: "I breathed deeply." },
  "responsabilizar": { pt: "Responsabilizaram-no pelo erro.", en: "They held him responsible for the mistake." },
  "ressaltar": { pt: "Ressaltou a importância.", en: "He stressed the importance." },
  "restaurar": { pt: "Restaurámos o carro antigo.", en: "We restored the old car." },
  "restringir": { pt: "Restringi o acesso.", en: "I restricted the access." },
  "resultar": { pt: "O esforço resultou.", en: "The effort paid off." },
  "resumir": { pt: "Resumi o artigo.", en: "I summarised the article." },
  "reter": { pt: "Retive a informação.", en: "I retained the information." },
  "retirar": { pt: "Retirei o dinheiro.", en: "I withdrew the money." },
  "retomar": { pt: "Retomámos a conversa.", en: "We resumed the conversation." },
  "retornar": { pt: "Retornei ao trabalho.", en: "I returned to work." },
  "retratar": { pt: "Retratei a paisagem.", en: "I depicted the landscape." },
  "reunir": { pt: "Reunimos a família.", en: "We gathered the family." },
  "revelar": { pt: "Revelei o segredo.", en: "I revealed the secret." },
  "rever": { pt: "Revi os apontamentos.", en: "I reviewed the notes." },
  "revisar": { pt: "Revisei o texto.", en: "I revised the text." },
  "revoltar": { pt: "Ele revoltou-se contra a injustiça.", en: "He revolted against the injustice." },
  "rezar": { pt: "Ela reza todas as noites.", en: "She prays every night." },
  "rivalizar": { pt: "Eles rivalizam pelo título.", en: "They compete for the title." },
  "roubar": { pt: "Roubaram-me a carteira.", en: "They stole my wallet." },
  "rodar": { pt: "O filme rodou em Lisboa.", en: "The film was shot in Lisbon." },
  "rodear": { pt: "A cerca rodeia o jardim.", en: "The fence surrounds the garden." },
  "romper": { pt: "Ele rompeu o silêncio.", en: "He broke the silence." },
  "roncar": { pt: "Ele ressona alto.", en: "He snores loudly." },
  "rugir": { pt: "O leão rugia.", en: "The lion was roaring." },
  "sacrificar": { pt: "Sacrifiquei o meu tempo.", en: "I sacrificed my time." },
  "sacudir": { pt: "Sacudi o pó.", en: "I dusted off the dust." },
  "saltar": { pt: "Saltei o muro.", en: "I jumped the wall." },
  "salvar": { pt: "Salvou-me a vida.", en: "He saved my life." },
  "sarar": { pt: "A ferida sarou.", en: "The wound healed." },
  "satisfazer": { pt: "Satisfiz o cliente.", en: "I satisfied the customer." },
  "saudar": { pt: "Saudei o vizinho.", en: "I greeted the neighbour." },
  "secar": { pt: "Sequei as mãos.", en: "I dried my hands." },
  "seduzir": { pt: "Ela seduziu-o.", en: "She seduced him." },
  "segurar": { pt: "Segurei a mala.", en: "I held the bag." },
  "selecionar": { pt: "Selecionei os candidatos.", en: "I selected the candidates." },
  "semear": { pt: "Semeámos o campo.", en: "We sowed the field." },
  "separar": { pt: "Separei as roupas.", en: "I separated the clothes." },
  "silenciar": { pt: "Silenciei o telefone.", en: "I silenced the phone." },
  "simbolizar": { pt: "A pomba simboliza a paz.", en: "The dove symbolises peace." },
  "simpatizar": { pt: "Simpatizo com ele.", en: "I like him." },
  "simplificar": { pt: "Simplifiquei a explicação.", en: "I simplified the explanation." },
  "simular": { pt: "Ele simulou uma doença.", en: "He faked an illness." },
  "sinalizar": { pt: "Sinalizei a curva.", en: "I signalled the bend." },
  "situar": { pt: "A casa situa-se no centro.", en: "The house is located downtown." },
  "soar": { pt: "O alarme soou.", en: "The alarm sounded." },
  "sobrar": { pt: "Sobrou comida.", en: "There was food left over." },
  "sobrecarregar": { pt: "Não sobrecarregues o motor.", en: "Don't overload the engine." },
  "sobressair": { pt: "Ele sobressai na equipa.", en: "He stands out in the team." },
  "sobreviver": { pt: "Sobreviveu ao acidente.", en: "He survived the accident." },
  "socializar": { pt: "Gosto de socializar.", en: "I like to socialise." },
  "socorrer": { pt: "Socorreram o ferido.", en: "They helped the wounded." },
  "sofrer": { pt: "Sofreu muito com a perda.", en: "He suffered a lot from the loss." },
  "soltar": { pt: "Soltei o cão.", en: "I let the dog loose." },
  "solucionar": { pt: "Solucionei o problema.", en: "I solved the problem." },
  "sonhar": { pt: "Sonhei contigo.", en: "I dreamed about you." },
  "soprar": { pt: "O vento soprava forte.", en: "The wind was blowing hard." },
  "sorrir": { pt: "Ela sorriu para mim.", en: "She smiled at me." },
  "soterrar": { pt: "O deslizamento soterrou a casa.", en: "The landslide buried the house." },
  "subir": { pt: "Subi as escadas.", en: "I went up the stairs." },
  "sublinhar": { pt: "Sublinhei a frase.", en: "I underlined the sentence." },
  "submeter": { pt: "Submeti a candidatura.", en: "I submitted the application." },
  "substituir": { pt: "Substituí o chefe.", en: "I replaced the boss." },
  "subtrair": { pt: "Subtraí os números.", en: "I subtracted the numbers." },
  "suceder": { pt: "Sucedeu algo estranho.", en: "Something strange happened." },
  "sufocar": { pt: "O calor sufocou-me.", en: "The heat suffocated me." },
  "sugerir": { pt: "Sugeri um plano.", en: "I suggested a plan." },
  "sujar": { pt: "Sujou a camisa.", en: "He dirtied the shirt." },
  "suportar": { pt: "Não suporto o calor.", en: "I can't stand the heat." },
  "supor": { pt: "Suponho que tens razão.", en: "I suppose you're right." },
  "suprimir": { pt: "Suprimi os detalhes.", en: "I suppressed the details." },
  "surgir": { pt: "Surgiu um problema.", en: "A problem arose." },
  "surpreender": { pt: "A surpresa surpreendeu-me.", en: "The surprise surprised me." },
  "suspeitar": { pt: "Suspeito dele.", en: "I suspect him." },
  "suspender": { pt: "Suspenderam a reunião.", en: "They suspended the meeting." },
  "suspirar": { pt: "Ela suspirou de alívio.", en: "She sighed with relief." },
  "sustentar": { pt: "Sustento a família.", en: "I support the family." },
  "tapar": { pt: "Tapei o buraco.", en: "I covered the hole." },
  "tardar": { pt: "Não tardou a chegar.", en: "He didn't take long to arrive." },
  "tecer": { pt: "Teci uma colcha.", en: "I wove a blanket." },
  "telefonar": { pt: "Telefonei ao médico.", en: "I phoned the doctor." },
  "temer": { pt: "Temo o pior.", en: "I fear the worst." },
  "temperar": { pt: "Temperei a carne.", en: "I seasoned the meat." },
  "tender": { pt: "Ele tende a exagerar.", en: "He tends to exaggerate." },
  "terminar": { pt: "Terminei o trabalho.", en: "I finished the work." },
  "testemunhar": { pt: "Testemunhei o acidente.", en: "I witnessed the accident." },
  "tirar": { pt: "Tirei uma foto.", en: "I took a photo." },
  "tolerar": { pt: "Não tolero a injustiça.", en: "I don't tolerate injustice." },
  "tomar": { pt: "Tomei o pequeno-almoço.", en: "I had breakfast." },
  "torcer": { pt: "Torci pelo meu time.", en: "I cheered for my team." },
  "tornar": { pt: "O tempo tornou-se frio.", en: "The weather became cold." },
  "torrar": { pt: "Torrei o café.", en: "I roasted the coffee." },
  "torturar": { pt: "A dor torturava-o.", en: "The pain tortured him." },
  "tossir": { pt: "Ele tossiu durante a noite.", en: "He coughed during the night." },
  "traduzir": { pt: "Traduzi o texto.", en: "I translated the text." },
  "trair": { pt: "Ele traiu a confiança.", en: "He betrayed the trust." },
  "trancar": { pt: "Tranquei a porta.", en: "I locked the door." },
  "transferir": { pt: "Transferi o dinheiro.", en: "I transferred the money." },
  "transformar": { pt: "Transformei o quarto.", en: "I transformed the room." },
  "transmitir": { pt: "Transmitiram o jogo.", en: "They broadcast the game." },
  "transportar": { pt: "Transportámos as caixas.", en: "We transported the boxes." },
  "tratar": { pt: "Tratei do assunto.", en: "I dealt with the matter." },
  "travar": { pt: "Travei o carro.", en: "I braked the car." },
  "treinar": { pt: "Treinei para a maratona.", en: "I trained for the marathon." },
  "tremer": { pt: "Tremi de frio.", en: "I shivered with cold." },
  "trocar": { pt: "Troquei a lâmpada.", en: "I changed the light bulb." },
  "tropeçar": { pt: "Tropecei na pedra.", en: "I tripped on the stone." },
  "ultrapassar": { pt: "Ultrapassei o carro.", en: "I overtook the car." },
  "unificar": { pt: "Unificámos as equipas.", en: "We unified the teams." },
  "unir": { pt: "Unimos esforços.", en: "We joined forces." },
  "urgir": { pt: "Urge resolver o problema.", en: "The problem needs solving urgently." },
  "usufruir": { pt: "Usufruo das férias.", en: "I enjoy the holidays." },
  "utilizar": { pt: "Utilizei o martelo.", en: "I used the hammer." },
  "vacinar": { pt: "Vaccinei o gato.", en: "I vaccinated the cat." },
  "valer": { pt: "Vale a pena tentar.", en: "It's worth trying." },
  "valorizar": { pt: "Valorizo a honestidade.", en: "I value honesty." },
  "variar": { pt: "Os preços variam.", en: "Prices vary." },
  "varrer": { pt: "Varri o chão.", en: "I swept the floor." },
  "vencer": { pt: "Vencemos o jogo.", en: "We won the game." },
  "venerar": { pt: "Veneramos os nossos avós.", en: "We venerate our grandparents." },
  "vestir": { pt: "Vesti a camisa azul.", en: "I wore the blue shirt." },
  "virar": { pt: "Virei à esquerda.", en: "I turned left." },
  "visitar": { pt: "Visitei o museu.", en: "I visited the museum." },
  "voar": { pt: "O pássaro voou para longe.", en: "The bird flew away." },
  "votar": { pt: "Votei nas eleições.", en: "I voted in the elections." },
  "zelar": { pt: "Zelo pelos meus filhos.", en: "I care for my children." },
  "zoar": { pt: "Ele zoou o colega.", en: "He teased his colleague." },
  "apassivar": { pt: "A gramática apassiva o verbo.", en: "Grammar makes the verb passive." },
};

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

const ADJECTIVE_EXAMPLES = {
  "grande": { pt: "A casa é grande.", en: "The house is big." },
  "pequeno": { pt: "O apartamento é pequeno.", en: "The apartment is small." },
  "bom": { pt: "Este café é muito bom.", en: "This coffee is very good." },
  "mau": { pt: "O tempo está mau hoje.", en: "The weather is bad today." },
  "feliz": { pt: "Estou muito feliz.", en: "I am very happy." },
  "triste": { pt: "Ela está triste.", en: "She is sad." },
  "velho": { pt: "O carro é velho.", en: "The car is old." },
  "novo": { pt: "Tenho um emprego novo.", en: "I have a new job." },
  "bonito": { pt: "Que vestido bonito!", en: "What a beautiful dress!" },
  "feio": { pt: "O prédio é feio.", en: "The building is ugly." },
  "forte": { pt: "Ele é muito forte.", en: "He is very strong." },
  "fraco": { pt: "Estou fraco hoje.", en: "I am weak today." },
  "alto": { pt: "O João é alto.", en: "João is tall." },
  "baixo": { pt: "A mesa é baixa.", en: "The table is short." },
  "largo": { pt: "O corredor é largo.", en: "The hallway is wide." },
  "estreito": { pt: "A rua é estreita.", en: "The street is narrow." },
  "limpo": { pt: "O quarto está limpo.", en: "The room is clean." },
  "sujo": { pt: "O chão está sujo.", en: "The floor is dirty." },
  "doce": { pt: "Este bolo é doce.", en: "This cake is sweet." },
  "amargo": { pt: "O café está amargo.", en: "The coffee is bitter." },
  "claro": { pt: "O céu está claro.", en: "The sky is clear." },
  "escuro": { pt: "Está escuro aqui.", en: "It is dark here." },
  "devagar": { pt: "Fala devagar, por favor.", en: "Speak slowly, please." },
  "rápido": { pt: "O carro é rápido.", en: "The car is fast." },
  "cheio": { pt: "O copo está cheio.", en: "The glass is full." },
  "vazio": { pt: "O balde está vazio.", en: "The bucket is empty." },
  "rico": { pt: "Ele é um homem rico.", en: "He is a rich man." },
  "pobre": { pt: "A família é pobre.", en: "The family is poor." },
  "quente": { pt: "A sopa está quente.", en: "The soup is hot." },
  "frio": { pt: "O leite está frio.", en: "The milk is cold." },
  "caro": { pt: "Este restaurante é caro.", en: "This restaurant is expensive." },
  "barato": { pt: "Encontrei um hotel barato.", en: "I found a cheap hotel." },
  "pesado": { pt: "A mala está pesada.", en: "The suitcase is heavy." },
  "leve": { pt: "O jantar foi leve.", en: "Dinner was light." },
  "seguro": { pt: "Este lugar é seguro.", en: "This place is safe." },
  "perigoso": { pt: "É muito perigoso.", en: "It is very dangerous." },
  "fácil": { pt: "O teste é fácil.", en: "The test is easy." },
  "difícil": { pt: "Esta lição é difícil.", en: "This lesson is difficult." },
  "aberto": { pt: "A loja está aberta.", en: "The shop is open." },
  "fechado": { pt: "O museu está fechado.", en: "The museum is closed." },
};

const PREPOSITION_EXERCISES = [
  { sentence: "O gato está ___ a cama.", sentenceEn: "The cat is ___ the bed.", answer: "em", hint: "location: on/in" },
  { sentence: "Vamos viajar ___ carro amanhã.", sentenceEn: "We are going to travel ___ car tomorrow.", answer: "de", hint: "means of transport" },
  { sentence: "Ela falou muito ___ o problema.", sentenceEn: "She talked a lot ___ the problem.", answer: "sobre", hint: "about a topic" },
  { sentence: "O livro foi escrito ___ uma autora famosa.", sentenceEn: "The book was written ___ a famous author.", answer: "por", hint: "by someone" },
  { sentence: "Eles estão ___ o parque.", sentenceEn: "They are ___ the park.", answer: "no", hint: "at a place (em + o)" },
  { sentence: "Ele saiu ___ casa muito cedo.", sentenceEn: "He left ___ home very early.", answer: "de", hint: "from a place" },
  { sentence: "Chegámos ___ aeroporto atrasados.", sentenceEn: "We arrived ___ the airport late.", answer: "ao", hint: "to a place (a + o)" },
  { sentence: "Posso contar ___ ti?", sentenceEn: "Can I count ___ you?", answer: "com", hint: "rely on someone" },
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
  "Obj. Directo": [["me","me"],["te","you"],["o/a","him/her"],["nos","us"],["vos","you (pl.)"],["os/as","them"]],
  "Obj. Indirecto": [["me","to me"],["te","to you"],["lhe","to him/her"],["nos","to us"],["vos","to you (pl.)"],["lhes","to them"]],
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
  "Transportes": [["o carro","car"],["o autocarro","bus"],["o comboio","train"],["o avião","plane"],["o metro","metro"],["o elétrico","tram"],["a bicicleta","bicycle"],["o táxi","taxi"],["a paragem","stop"],["a estação","station"],["o aeroporto","airport"],["o bilhete","ticket"],["a viagem","trip"],["o condutor","driver"],["o passageiro","passenger"],["a mala","suitcase"]],
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

const VOCAB_EXAMPLES = {
  "Família": {
    "a mãe": { pt: "A minha mãe cozinha muito bem.", en: "My mother cooks very well." },
    "o pai": { pt: "O meu pai trabalha em Lisboa.", en: "My father works in Lisbon." },
    "o filho": { pt: "O filho mais velho tem vinte anos.", en: "The oldest son is twenty years old." },
    "a filha": { pt: "A filha da Ana estuda medicina.", en: "Ana's daughter studies medicine." },
    "o irmão": { pt: "O meu irmão joga futebol.", en: "My brother plays football." },
    "a irmã": { pt: "A minha irmã é mais nova.", en: "My sister is younger." },
    "o avô": { pt: "O meu avô conta histórias.", en: "My grandfather tells stories." },
    "a avó": { pt: "A avó faz bolos deliciosos.", en: "Grandmother makes delicious cakes." },
    "o tio": { pt: "O meu tio vive no Porto.", en: "My uncle lives in Porto." },
    "a tia": { pt: "A tia Maria é professora.", en: "Aunt Maria is a teacher." },
    "o primo": { pt: "O meu primo vem amanhã.", en: "My cousin comes tomorrow." },
    "a prima": { pt: "A minha prima tem um gato.", en: "My cousin has a cat." },
    "o marido": { pt: "O marido dela é médico.", en: "Her husband is a doctor." },
    "a mulher": { pt: "A mulher dele é advogada.", en: "His wife is a lawyer." },
    "o sobrinho": { pt: "O sobrinho tem cinco anos.", en: "The nephew is five years old." },
    "a sobrinha": { pt: "A sobrinha dança ballet.", en: "The niece dances ballet." },
  },
  "Comida e Bebida": {
    "o pão": { pt: "Compro pão todos os dias.", en: "I buy bread every day." },
    "o queijo": { pt: "Este queijo é do Alentejo.", en: "This cheese is from the Alentejo." },
    "a carne": { pt: "A carne está no frigorífico.", en: "The meat is in the fridge." },
    "o peixe": { pt: "O peixe está fresco.", en: "The fish is fresh." },
    "o arroz": { pt: "O arroz é um acompanhamento.", en: "Rice is a side dish." },
    "a sopa": { pt: "A sopa de hoje é de legumes.", en: "Today's soup is vegetable." },
    "a salada": { pt: "Quero uma salada verde.", en: "I want a green salad." },
    "a fruta": { pt: "A fruta está madura.", en: "The fruit is ripe." },
    "o café": { pt: "Bebo um café de manhã.", en: "I drink a coffee in the morning." },
    "o chá": { pt: "Prefiro chá verde.", en: "I prefer green tea." },
    "a água": { pt: "Quero um copo de água.", en: "I want a glass of water." },
    "o sumo": { pt: "O sumo de laranja é natural.", en: "The orange juice is natural." },
    "o vinho": { pt: "Este vinho é do Douro.", en: "This wine is from the Douro." },
    "a cerveja": { pt: "Vamos beber uma cerveja.", en: "Let's have a beer." },
    "o leite": { pt: "O leite está no frigorífico.", en: "The milk is in the fridge." },
    "o azeite": { pt: "O azeite português é excelente.", en: "Portuguese olive oil is excellent." },
  },
  "Casa": {
    "a cozinha": { pt: "A cozinha é grande.", en: "The kitchen is big." },
    "a sala": { pt: "A sala tem uma televisão.", en: "The living room has a television." },
    "o quarto": { pt: "O meu quarto é pequeno.", en: "My bedroom is small." },
    "a casa de banho": { pt: "A casa de banho é no fundo.", en: "The bathroom is at the end." },
    "o jardim": { pt: "O jardim tem flores bonitas.", en: "The garden has beautiful flowers." },
    "a janela": { pt: "A janela está aberta.", en: "The window is open." },
    "a porta": { pt: "A porta da frente é azul.", en: "The front door is blue." },
    "a mesa": { pt: "A mesa está posta.", en: "The table is set." },
    "a cadeira": { pt: "A cadeira é confortável.", en: "The chair is comfortable." },
    "o sofá": { pt: "O sofá é novo.", en: "The sofa is new." },
    "a cama": { pt: "A cama é muito grande.", en: "The bed is very big." },
    "o espelho": { pt: "O espelho está partido.", en: "The mirror is broken." },
    "a escada": { pt: "A escada é de madeira.", en: "The stairs are made of wood." },
    "o telhado": { pt: "O telhado é vermelho.", en: "The roof is red." },
    "a parede": { pt: "A parede é branca.", en: "The wall is white." },
    "o chão": { pt: "O chão está sujo.", en: "The floor is dirty." },
  },
  "Corpo": {
    "a cabeça": { pt: "Tenho dores de cabeça.", en: "I have a headache." },
    "o olho": { pt: "O olho esquerdo dói-me.", en: "My left eye hurts." },
    "o nariz": { pt: "O nariz está frio.", en: "The nose is cold." },
    "a boca": { pt: "Abre a boca, por favor.", en: "Open your mouth, please." },
    "a orelha": { pt: "A orelha direita dói-me.", en: "My right ear hurts." },
    "o braço": { pt: "Parti o braço esquerdo.", en: "I broke my left arm." },
    "a mão": { pt: "Lava as mãos antes de comer.", en: "Wash your hands before eating." },
    "o dedo": { pt: "Cortei o dedo.", en: "I cut my finger." },
    "a perna": { pt: "A perna direita dói-me.", en: "My right leg hurts." },
    "o pé": { pt: "O pé está inchado.", en: "The foot is swollen." },
    "o peito": { pt: "Sinto dor no peito.", en: "I feel pain in my chest." },
    "as costas": { pt: "Tenho dores nas costas.", en: "I have back pain." },
    "o ombro": { pt: "Parti o ombro.", en: "I broke my shoulder." },
    "o joelho": { pt: "O joelho está magoado.", en: "The knee is hurt." },
    "o pescoço": { pt: "Tenho o pescoço dorido.", en: "I have a sore neck." },
    "o cabelo": { pt: "O cabelo dela é comprido.", en: "Her hair is long." },
  },
  "Cidade": {
    "a rua": { pt: "Esta rua é muito estreita.", en: "This street is very narrow." },
    "a praça": { pt: "A praça central é bonita.", en: "The central square is beautiful." },
    "o supermercado": { pt: "O supermercado fecha às dez.", en: "The supermarket closes at ten." },
    "a farmácia": { pt: "A farmácia está aberta.", en: "The pharmacy is open." },
    "o hospital": { pt: "O hospital fica longe.", en: "The hospital is far." },
    "a estação": { pt: "A estação de comboios é aqui.", en: "The train station is here." },
    "o restaurante": { pt: "O restaurante serve peixe.", en: "The restaurant serves fish." },
    "o café": { pt: "Encontro-te no café.", en: "I'll meet you at the café." },
    "a loja": { pt: "A loja abre às nove.", en: "The shop opens at nine." },
    "o banco": { pt: "O banco está fechado hoje.", en: "The bank is closed today." },
    "os correios": { pt: "Os correios ficam perto.", en: "The post office is nearby." },
    "a igreja": { pt: "A igreja é muito antiga.", en: "The church is very old." },
    "o parque": { pt: "O parque é grande.", en: "The park is big." },
    "a biblioteca": { pt: "A biblioteca abre cedo.", en: "The library opens early." },
    "o museu": { pt: "O museu é gratuito ao domingo.", en: "The museum is free on Sunday." },
    "a escola": { pt: "A escola fica perto de casa.", en: "The school is near home." },
  },
  "Tempo e Clima": {
    "hoje": { pt: "Hoje é terça-feira.", en: "Today is Tuesday." },
    "amanhã": { pt: "Amanhã vou ao médico.", en: "Tomorrow I'm going to the doctor." },
    "ontem": { pt: "Ontem choveu muito.", en: "Yesterday it rained a lot." },
    "agora": { pt: "Agora estou em casa.", en: "Now I am at home." },
    "sempre": { pt: "Sempre acordo cedo.", en: "I always wake up early." },
    "nunca": { pt: "Nunca bebo café.", en: "I never drink coffee." },
    "às vezes": { pt: "Às vezes vou ao cinema.", en: "Sometimes I go to the cinema." },
    "cedo": { pt: "Chego cedo ao trabalho.", en: "I arrive at work early." },
    "tarde": { pt: "Cheguei tarde à reunião.", en: "I arrived late to the meeting." },
    "o sol": { pt: "O sol brilha hoje.", en: "The sun is shining today." },
    "a chuva": { pt: "A chuva parou.", en: "The rain stopped." },
    "o vento": { pt: "O vento está forte.", en: "The wind is strong." },
    "quente": { pt: "Está muito quente hoje.", en: "It is very hot today." },
    "frio": { pt: "Está frio lá fora.", en: "It is cold outside." },
    "nublado": { pt: "O céu está nublado.", en: "The sky is cloudy." },
    "o tempo": { pt: "O tempo está bom.", en: "The weather is nice." },
    "ainda": { pt: "Ainda estou a trabalhar.", en: "I am still working." },
    "já": { pt: "Já comi.", en: "I already ate." },
    "depressa": { pt: "Corre depressa!", en: "Run quickly!" },
    "devagar": { pt: "Fala devagar.", en: "Speak slowly." },
    "antes": { pt: "Antes morava no Porto.", en: "Before I lived in Porto." },
    "depois": { pt: "Depois vamos ao cinema.", en: "Afterward we'll go to the cinema." },
    "quase": { pt: "Quase acabei o trabalho.", en: "I almost finished the work." },
    "muito": { pt: "Trabalho muito.", en: "I work a lot." },
  },
  "Transportes": {
    "o carro": { pt: "O carro está na garagem.", en: "The car is in the garage." },
    "o autocarro": { pt: "O autocarro passa às oito.", en: "The bus passes at eight." },
    "o comboio": { pt: "O comboio parte às dez.", en: "The train leaves at ten." },
    "o avião": { pt: "O avião chega atrasado.", en: "The plane is arriving late." },
    "o metro": { pt: "O metro é rápido.", en: "The metro is fast." },
    "o elétrico": { pt: "O eléctrico passa pela avenida.", en: "The tram passes through the avenue." },
    "a bicicleta": { pt: "A bicicleta é verde.", en: "The bicycle is green." },
    "o táxi": { pt: "Chamei um táxi.", en: "I called a taxi." },
    "a paragem": { pt: "A paragem é ali.", en: "The stop is there." },
    "a estação": { pt: "A estação fica no centro.", en: "The station is downtown." },
    "o aeroporto": { pt: "O aeroporto é longe.", en: "The airport is far." },
    "o bilhete": { pt: "Comprei o bilhete online.", en: "I bought the ticket online." },
    "a viagem": { pt: "A viagem foi longa.", en: "The trip was long." },
    "o condutor": { pt: "O condutor é simpático.", en: "The driver is friendly." },
    "o passageiro": { pt: "O passageiro está sentado.", en: "The passenger is seated." },
    "a mala": { pt: "A mala é pesada.", en: "The suitcase is heavy." },
  },
  "Trabalho": {
    "o escritório": { pt: "O escritório é no centro.", en: "The office is downtown." },
    "o computador": { pt: "O computador é novo.", en: "The computer is new." },
    "a reunião": { pt: "A reunião começa às dez.", en: "The meeting starts at ten." },
    "o colega": { pt: "O meu colega é brasileiro.", en: "My colleague is Brazilian." },
    "o chefe": { pt: "O chefe está de férias.", en: "The boss is on holiday." },
    "o emprego": { pt: "Gosto do meu emprego.", en: "I like my job." },
    "o salário": { pt: "O salário é bom.", en: "The salary is good." },
    "as férias": { pt: "As férias foram óptimas.", en: "The holidays were great." },
    "o horário": { pt: "O horário é das nove às seis.", en: "The schedule is from nine to six." },
    "a empresa": { pt: "A empresa é internacional.", en: "The company is international." },
    "o cliente": { pt: "O cliente tem uma dúvida.", en: "The client has a question." },
    "o projeto": { pt: "O projeto é ambicioso.", en: "The project is ambitious." },
    "o contrato": { pt: "O contrato é por dois anos.", en: "The contract is for two years." },
    "a entrevista": { pt: "A entrevista foi difícil.", en: "The interview was difficult." },
    "o currículo": { pt: "Mandei o currículo hoje.", en: "I sent the CV today." },
    "a experiência": { pt: "Tenho muita experiência.", en: "I have a lot of experience." },
  },
  "Vestuário": {
    "as calças": { pt: "As calças são pretas.", en: "The trousers are black." },
    "a saia": { pt: "A saia é azul.", en: "The skirt is blue." },
    "a camisa": { pt: "A camisa é branca.", en: "The shirt is white." },
    "o vestido": { pt: "O vestido é bonito.", en: "The dress is beautiful." },
    "o sapato": { pt: "O sapato é novo.", en: "The shoe is new." },
    "o casaco": { pt: "O casaco é quente.", en: "The jacket is warm." },
    "a blusa": { pt: "A blusa é de seda.", en: "The blouse is silk." },
    "as meias": { pt: "As meias são vermelhas.", en: "The socks are red." },
    "a gravata": { pt: "A gravata é de seda.", en: "The tie is silk." },
    "o cachecol": { pt: "O cachecol é de lã.", en: "The scarf is wool." },
    "as luvas": { pt: "As luvas são de couro.", en: "The gloves are leather." },
    "o chapéu": { pt: "O chapéu é preto.", en: "The hat is black." },
    "o guarda-chuva": { pt: "Esqueci o guarda-chuva.", en: "I forgot the umbrella." },
    "a carteira": { pt: "A carteira está na mesa.", en: "The wallet is on the table." },
    "a mala": { pt: "A mala é grande.", en: "The bag is big." },
    "os óculos": { pt: "Os óculos são novos.", en: "The glasses are new." },
  },
  "Animais": {
    "o cão": { pt: "O cão é grande.", en: "The dog is big." },
    "o gato": { pt: "O gato está a dormir.", en: "The cat is sleeping." },
    "o cavalo": { pt: "O cavalo corre depressa.", en: "The horse runs fast." },
    "o pássaro": { pt: "O pássaro canta de manhã.", en: "The bird sings in the morning." },
    "o peixe": { pt: "O peixe nada no aquário.", en: "The fish swims in the aquarium." },
    "o frango": { pt: "O frango está no forno.", en: "The chicken is in the oven." },
    "o porco": { pt: "O porco é rosa.", en: "The pig is pink." },
    "a vaca": { pt: "A vaca dá leite.", en: "The cow gives milk." },
    "a ovelha": { pt: "A ovelha tem lã branca.", en: "The sheep has white wool." },
    "o coelho": { pt: "O coelho salta muito.", en: "The rabbit jumps a lot." },
    "a tartaruga": { pt: "A tartaruga é lenta.", en: "The turtle is slow." },
    "a borboleta": { pt: "A borboleta é colorida.", en: "The butterfly is colorful." },
    "a abelha": { pt: "A abelha faz mel.", en: "The bee makes honey." },
    "a formiga": { pt: "A formiga é pequena.", en: "The ant is small." },
    "o mosquito": { pt: "O mosquito pica-me.", en: "The mosquito is biting me." },
    "o ratinho": { pt: "O ratinho tem medo do gato.", en: "The mouse is afraid of the cat." },
  },
  "Cores": {
    "azul": { pt: "O céu é azul.", en: "The sky is blue." },
    "verde": { pt: "A relva é verde.", en: "The grass is green." },
    "amarelo": { pt: "O sol é amarelo.", en: "The sun is yellow." },
    "branco": { pt: "A neve é branca.", en: "The snow is white." },
    "preto": { pt: "O gato é preto.", en: "The cat is black." },
    "vermelho": { pt: "O carro é vermelho.", en: "The car is red." },
    "castanho": { pt: "O cabelo dela é castanho.", en: "Her hair is brown." },
    "cor-de-rosa": { pt: "A flor é cor-de-rosa.", en: "The flower is pink." },
    "cor-de-laranja": { pt: "A camisa é cor-de-laranja.", en: "The shirt is orange." },
    "cinzento": { pt: "O céu está cinzento.", en: "The sky is grey." },
    "dourado": { pt: "O anel é dourado.", en: "The ring is golden." },
    "prateado": { pt: "A colher é prateada.", en: "The spoon is silver." },
    "roxo": { pt: "O casaco é roxo.", en: "The jacket is purple." },
    "bege": { pt: "A mala é bege.", en: "The bag is beige." },
    "lilás": { pt: "A blusa é lilás.", en: "The blouse is lilac." },
  },
  "Números": {
    "um/uma": { pt: "Tenho um irmão.", en: "I have one brother." },
    "dois/duas": { pt: "Comprei duas maçãs.", en: "I bought two apples." },
    "três": { pt: "São três horas.", en: "It is three o'clock." },
    "quatro": { pt: "O bebé tem quatro meses.", en: "The baby is four months old." },
    "cinco": { pt: "Trabalho cinco dias por semana.", en: "I work five days a week." },
    "seis": { pt: "São seis pessoas.", en: "There are six people." },
    "sete": { pt: "O encontro é às sete.", en: "The meeting is at seven." },
    "oito": { pt: "O João tem oito anos.", en: "João is eight years old." },
    "nove": { pt: "A loja abre às nove.", en: "The shop opens at nine." },
    "dez": { pt: "São dez euros.", en: "It is ten euros." },
    "onze": { pt: "São onze da manhã.", en: "It is eleven in the morning." },
    "doze": { pt: "O almoço é ao meio-dia (doze).", en: "Lunch is at noon (twelve)." },
    "treze": { pt: "Dia treze é sexta-feira.", en: "The thirteenth is Friday." },
    "catorze": { pt: "Tem catorze anos.", en: "She is fourteen years old." },
    "quinze": { pt: "Faltam quinze dias.", en: "Fifteen days are missing." },
    "dezasseis": { pt: "Tenho dezasseis anos.", en: "I am sixteen years old." },
    "dezassete": { pt: "Faz dezassete graus hoje.", en: "It is seventeen degrees today." },
    "dezoito": { pt: "O exame é dia dezoito.", en: "The exam is on the eighteenth." },
    "dezanove": { pt: "Faltam dezanove dias.", en: "Nineteen days are missing." },
    "vinte": { pt: "O livro tem vinte páginas.", en: "The book has twenty pages." },
    "trinta": { pt: "Tenho trinta anos.", en: "I am thirty years old." },
    "quarenta": { pt: "O empregado tem quarenta anos.", en: "The employee is forty years old." },
    "cinquenta": { pt: "A distância é cinquenta quilómetros.", en: "The distance is fifty kilometres." },
    "cem": { pt: "O livro custa cem euros.", en: "The book costs a hundred euros." },
    "mil": { pt: "Vivem aqui mil pessoas.", en: "A thousand people live here." },
    "um milhão": { pt: "Lisboa tem um milhão de habitantes.", en: "Lisbon has a million inhabitants." },
  },
  "Dias e Meses": {
    "segunda-feira": { pt: "Segunda-feira vou ao médico.", en: "On Monday I'm going to the doctor." },
    "terça-feira": { pt: "Terça-feira é dia de reunião.", en: "Tuesday is meeting day." },
    "quarta-feira": { pt: "Quarta-feira é o meu dia livre.", en: "Wednesday is my day off." },
    "quinta-feira": { pt: "Quinta-feira janto fora.", en: "On Thursday I dine out." },
    "sexta-feira": { pt: "Sexta-feira é o último dia.", en: "Friday is the last day." },
    "sábado": { pt: "Sábado vamos à praia.", en: "On Saturday we go to the beach." },
    "domingo": { pt: "Domingo descanço.", en: "On Sunday I rest." },
    "janeiro": { pt: "Janeiro é frio.", en: "January is cold." },
    "fevereiro": { pt: "Fevereiro tem vinte e oito dias.", en: "February has twenty-eight days." },
    "março": { pt: "Março traz a primavera.", en: "March brings spring." },
    "abril": { pt: "Em abril chove muito.", en: "In April it rains a lot." },
    "maio": { pt: "Maio é o mês das flores.", en: "May is the month of flowers." },
    "junho": { pt: "Junho começa o verão.", en: "June starts the summer." },
    "julho": { pt: "Julho é muito quente.", en: "July is very hot." },
    "agosto": { pt: "Em agosto vou de férias.", en: "In August I go on holiday." },
    "setembro": { pt: "Setembro é a开学.", en: "September is back to school." },
    "outubro": { pt: "Outubro tem folhas castanhas.", en: "October has brown leaves." },
    "novembro": { pt: "Novembro é chuvoso.", en: "November is rainy." },
    "dezembro": { pt: "Dezembro tem o Natal.", en: "December has Christmas." },
  },
  "Nacionalidades": {
    "português/portuguesa": { pt: "Sou português.", en: "I am Portuguese." },
    "brasileiro/brasileira": { pt: "Ela é brasileira.", en: "She is Brazilian." },
    "inglês/inglesa": { pt: "O John é inglês.", en: "John is English." },
    "espanhol/espanhola": { pt: "O Pablo é espanhol.", en: "Pablo is Spanish." },
    "francês/francesa": { pt: "A Marie é francesa.", en: "Marie is French." },
    "alemão/alemã": { pt: "O Hans é alemão.", en: "Hans is German." },
    "italiano/italiana": { pt: "Sou italiano.", en: "I am Italian." },
    "chinês/chinesa": { pt: "O Wang é chinês.", en: "Wang is Chinese." },
    "japonês/japonesa": { pt: "A Yuki é japonesa.", en: "Yuki is Japanese." },
    "americano/americana": { pt: "Sou americano.", en: "I am American." },
    "africano/africana": { pt: "Ele é africano.", en: "He is African." },
    "mexicano/mexicana": { pt: "Ela é mexicana.", en: "She is Mexican." },
    "canadiano/canadiana": { pt: "O Tim é canadiano.", en: "Tim is Canadian." },
  },
  "Profissões": {
    "médico/médica": { pt: "A médica trabalha no hospital.", en: "The doctor works at the hospital." },
    "professor/professora": { pt: "O professor explica bem.", en: "The teacher explains well." },
    "engenheiro/engenheira": { pt: "O engenheiro desenha pontes.", en: "The engineer designs bridges." },
    "advogado/advogada": { pt: "A advogada defende o cliente.", en: "The lawyer defends the client." },
    "arquiteto/arquiteta": { pt: "O arquiteto projeta casas.", en: "The architect designs houses." },
    "cozinheiro/cozinheira": { pt: "O cozinheiro faz sopa.", en: "The cook makes soup." },
    "motorista": { pt: "O motorista conduz o autocarro.", en: "The driver drives the bus." },
    "secretário/secretária": { pt: "A secretária atende o telefone.", en: "The secretary answers the phone." },
    "bombeiro/bombeira": { pt: "O bombeiro apaga o fogo.", en: "The firefighter puts out the fire." },
    "polícia": { pt: "O polícia prende o ladrão.", en: "The police officer arrests the thief." },
    "enfermeiro/enfermeira": { pt: "A enfermeira cuida dos doentes.", en: "The nurse takes care of the sick." },
    "jornalista": { pt: "O jornalista escreve artigos.", en: "The journalist writes articles." },
    "escritor/escritora": { pt: "O escritor publicou um livro.", en: "The writer published a book." },
    "artista": { pt: "O artista pinta quadros.", en: "The artist paints pictures." },
    "músico/música": { pt: "O músico toca guitarra.", en: "The musician plays guitar." },
  },
  "Escola": {
    "a escola": { pt: "A escola abre às oito.", en: "The school opens at eight." },
    "o professor": { pt: "O professor dá aulas.", en: "The teacher gives classes." },
    "o aluno": { pt: "O aluno estuda muito.", en: "The student studies a lot." },
    "a aluna": { pt: "A aluna é muito inteligente.", en: "The student is very intelligent." },
    "o livro": { pt: "O livro é interessante.", en: "The book is interesting." },
    "o caderno": { pt: "O caderno é novo.", en: "The notebook is new." },
    "a caneta": { pt: "A caneta escreve bem.", en: "The pen writes well." },
    "o lápis": { pt: "O lápis está afiado.", en: "The pencil is sharpened." },
    "a mochila": { pt: "A mochila é pesada.", en: "The backpack is heavy." },
    "a cadeira": { pt: "A cadeira é de madeira.", en: "The chair is wooden." },
    "a mesa": { pt: "A mesa é grande.", en: "The desk is big." },
    "o quadro": { pt: "O quadro é preto.", en: "The blackboard is black." },
    "o exame": { pt: "O exame é difícil.", en: "The exam is difficult." },
    "a aula": { pt: "A aula começa às nove.", en: "The class starts at nine." },
    "a biblioteca": { pt: "A biblioteca é silenciosa.", en: "The library is silent." },
    "o intervalo": { pt: "O intervalo é às dez.", en: "The break is at ten." },
  },
  "Natureza": {
    "a árvore": { pt: "A árvore é grande.", en: "The tree is big." },
    "a flor": { pt: "A flor é bonita.", en: "The flower is beautiful." },
    "a relva": { pt: "A relva está verde.", en: "The grass is green." },
    "o mar": { pt: "O mar está calmo.", en: "The sea is calm." },
    "a montanha": { pt: "A montanha é alta.", en: "The mountain is tall." },
    "o rio": { pt: "O rio é largo.", en: "The river is wide." },
    "o lago": { pt: "O lago é profundo.", en: "The lake is deep." },
    "a floresta": { pt: "A floresta é densa.", en: "The forest is dense." },
    "o campo": { pt: "O campo é tranquilo.", en: "The countryside is quiet." },
    "o jardim": { pt: "O jardim tem rosas.", en: "The garden has roses." },
    "a planta": { pt: "A planta é verde.", en: "The plant is green." },
    "a pedra": { pt: "A pedra é pesada.", en: "The stone is heavy." },
    "o céu": { pt: "O céu está azul.", en: "The sky is blue." },
    "a terra": { pt: "A terra é fértil.", en: "The earth is fertile." },
    "o sol": { pt: "O sol brilha.", en: "The sun shines." },
    "a lua": { pt: "A lua está cheia.", en: "The moon is full." },
    "a estrela": { pt: "A estrela brilha à noite.", en: "The star shines at night." },
    "a nuvem": { pt: "A nuvem é branca.", en: "The cloud is white." },
    "a neve": { pt: "A neve cobre a montanha.", en: "The snow covers the mountain." },
    "a praia": { pt: "A praia é bonita.", en: "The beach is beautiful." },
    "a ilha": { pt: "A ilha é pequena.", en: "The island is small." },
  },
  "Compras": {
    "a loja": { pt: "A loja fecha às oito.", en: "The shop closes at eight." },
    "o preço": { pt: "O preço é alto.", en: "The price is high." },
    "euro": { pt: "Custa dez euros.", en: "It costs ten euros." },
    "a carta": { pt: "Mandei uma carta.", en: "I sent a letter." },
    "os selos": { pt: "Comprei os selos.", en: "I bought the stamps." },
    "o troco": { pt: "O troco é cinco euros.", en: "The change is five euros." },
    "barato": { pt: "Esta loja é barata.", en: "This shop is cheap." },
    "caro": { pt: "O restaurante é caro.", en: "The restaurant is expensive." },
    "o desconto": { pt: "O desconto é de dez por cento.", en: "The discount is ten percent." },
    "a oferta": { pt: "É uma boa oferta.", en: "It is a good offer." },
    "as compras": { pt: "Vou fazer as compras.", en: "I'm going shopping." },
    "o supermercado": { pt: "O supermercado é grande.", en: "The supermarket is big." },
    "o mercado": { pt: "O mercado é ao sábado.", en: "The market is on Saturday." },
    "pagar": { pt: "Vou pagar agora.", en: "I'll pay now." },
    "vender": { pt: "Vendo a casa.", en: "I'm selling the house." },
    "comprar": { pt: "Quero comprar um carro.", en: "I want to buy a car." },
    "gastar": { pt: "Gasto muito em livros.", en: "I spend a lot on books." },
  },
  "Descrição": {
    "perto": { pt: "A escola fica perto.", en: "The school is nearby." },
    "longe": { pt: "O hospital é longe.", en: "The hospital is far." },
    "dentro": { pt: "Estou dentro de casa.", en: "I am inside the house." },
    "fora": { pt: "Está frio lá fora.", en: "It is cold outside." },
    "em cima": { pt: "O livro está em cima da mesa.", en: "The book is on top of the table." },
    "em baixo": { pt: "O gato está em baixo da mesa.", en: "The cat is under the table." },
    "ao lado": { pt: "O café é ao lado do banco.", en: "The café is next to the bank." },
    "entre": { pt: "Entre o Porto e Lisboa.", en: "Between Porto and Lisbon." },
    "certo": { pt: "A resposta está certa.", en: "The answer is right." },
    "errado": { pt: "A resposta está errada.", en: "The answer is wrong." },
    "importante": { pt: "Isto é muito importante.", en: "This is very important." },
    "interessante": { pt: "O livro é interessante.", en: "The book is interesting." },
    "necessário": { pt: "É necessário estudar.", en: "It is necessary to study." },
    "possível": { pt: "É possível ir amanhã.", en: "It is possible to go tomorrow." },
    "provável": { pt: "É provável que chova.", en: "It is likely to rain." },
    "feliz": { pt: "Ela está feliz hoje.", en: "She is happy today." },
    "triste": { pt: "Estou triste.", en: "I am sad." },
    "contente": { pt: "Estou contente com o resultado.", en: "I am happy with the result." },
    "nervoso": { pt: "Ele fica nervoso antes do exame.", en: "He gets nervous before the exam." },
    "cansado": { pt: "Estou muito cansado.", en: "I am very tired." },
    "doente": { pt: "A criança está doente.", en: "The child is sick." },
  },
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
  { pattern: "Sujeito + Verbo + Objecto", example: "Eu como pão.", translation: "I eat bread." },
  { pattern: "Sujeito + Verbo + Adjetivo", example: "A casa é bonita.", translation: "The house is beautiful." },
  { pattern: "Sujeito + Verbo + Preposição + Objecto", example: "Eu vou ao mercado.", translation: "I go to the market." },
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
  { id: 8, type: "Opinião", title: "Planos para o Futuro", description: "Descreve os teus planos para os próximos cinco anos.", topic: "Planos futuros", targetWords: 60, modelAnswer: "Nos próximos cinco anos, tenho vários planos.\n\nPrimeiro, quero terminar os meus estudos. Se tudo correr bem, vou acabar o curso e receber o diploma.\n\nDepois, quero encontrar um bom emprego na minha área. Gostaria de trabalhar numa empresa grande onde possa aprender muito.\n\nTambém quero poupar dinheiro para fazer uma viagem longa. Sempre quis visitar o Brasil e Portugal.\n\nPara alcançar estes objectivos, sei que tenho de trabalhar muito. Mas estou motivado.", englishAnswer: "In the next five years, I have several plans.\n\nFirst, I want to finish my studies. If all goes well, I will complete the course and receive my diploma.\n\nThen, I want to find a good job in my field. I would like to work in a large company where I can learn a lot.\n\nI also want to save money to take a long trip. I have always wanted to visit Brazil and Portugal.\n\nTo achieve these goals, I know I have to work hard. But I am motivated.", keyVocab: ["se tudo correr bem","progredir","poupar dinheiro","a longo prazo","alcançar","motivado"] },
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
  { term: "Objecto Directo", category: "Grammar", explanation: "The thing that receives the verb's action directly, without a preposition.", example: "Vejo o gato. (I see the cat.)" },
  { term: "Objecto Indirecto", category: "Grammar", explanation: "The person/thing receiving the action indirectly — 'to' or 'for' someone.", example: "Dou o livro ao João. (to João)" },
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

function getEuropeanPortugueseVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  const ptPT = voices.find(v => v.lang === 'pt-PT' || v.lang === 'pt_PT');
  if (ptPT) return ptPT;
  const portugalByName = voices.find(v => {
    const n = (v.name || '').toLowerCase();
    const l = (v.lang || '').toLowerCase();
    return l.startsWith('pt') && (n.includes('portugal') || n.includes('europeu') || n.includes('european') || n.includes('helena') || n.includes('joana'));
  });
  if (portugalByName) return portugalByName;
  return null;
}

let epVoiceWarningShown = false;
function speakPortuguese(text) {
  if (!window.speechSynthesis) return;
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const epVoice = getEuropeanPortugueseVoice();
  if (epVoice) {
    utterance.voice = epVoice;
    utterance.lang = 'pt-PT';
  } else {
    const voices = window.speechSynthesis.getVoices();
    const anyPt = voices.find(v => (v.lang || '').toLowerCase().startsWith('pt'));
    if (anyPt) {
      utterance.voice = anyPt;
      utterance.lang = anyPt.lang || 'pt';
    } else {
      utterance.lang = 'pt-PT';
    }
    if (!epVoiceWarningShown) {
      epVoiceWarningShown = true;
      console.warn('[Fluência] No European Portuguese (pt-PT) voice found. Install one in your OS settings for authentic EP pronunciation. Falling back to:', anyPt ? anyPt.name : 'browser default');
    }
  }
  utterance.rate = 0.9;
  utterance.pitch = 1;
  currentUtterance = utterance;
  utterance.onend = () => { currentUtterance = null; };
  window.speechSynthesis.speak(utterance);
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    const v = getEuropeanPortugueseVoice();
    if (v) epVoiceWarningShown = false;
  };
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
    addRec('verbs999', 'Drill the full verb list with example sentences and audio pronunciation');
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
  const [lessonPlan, setLessonPlan] = useState(savedPlan || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recordings, setRecordings] = useState({});

  const questions = [
    { id: 'level', label: "What's your current level in Portuguese?", hint: 'Complete beginner, some basics, or intermediate' },
    { id: 'goal', label: "What brings you to learn Portuguese?", hint: 'Exam, travel, work, family, or just for fun' },
    { id: 'context', label: "Where will you use Portuguese most?", hint: 'Portugal, Brazil, business, daily life, or social' },
    { id: 'time', label: "How much time can you study each week?", hint: 'A few hours, 30 minutes daily, or intensive' }
  ];

  const allAnswered = Object.values(answers).every(a => a.trim());

  const getRecording = (questionId) => recordings[questionId] || { isRecording: false, transcript: '', duration: 0, recognition: null };

  const startRecording = (questionId) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = true;

    let duration = 0;
    let pauseTimerId = null;
    let maxTimerId = null;
    let intervalId = null;
    let manualStop = false;

    intervalId = setInterval(() => {
      duration += 1;
      setRecordings(prev => {
        const current = prev[questionId] || { isRecording: false, transcript: '', duration: 0 };
        return { ...prev, [questionId]: { ...current, duration } };
      });
    }, 1000);

    maxTimerId = setTimeout(() => {
      manualStop = true;
      finishRecording(questionId, rec, intervalId, pauseTimerId);
    }, 90000);

    const resetPauseTimer = () => {
      if (pauseTimerId) clearTimeout(pauseTimerId);
      pauseTimerId = setTimeout(() => {
        if (!manualStop) {
          manualStop = true;
          finishRecording(questionId, rec, intervalId, pauseTimerId);
        }
      }, 20000);
    };

    rec.onstart = () => {
      manualStop = false;
      setRecordings(prev => ({
        ...prev,
        [questionId]: { isRecording: true, transcript: '', duration: 0 }
      }));
    };

    rec.onresult = (event) => {
      const transcriptText = Array.from(event.results).map(r => r[0].transcript).join('');
      setRecordings(prev => {
        const current = prev[questionId] || { isRecording: false, transcript: '', duration: 0 };
        return { ...prev, [questionId]: { ...current, transcript: transcriptText } };
      });
      resetPauseTimer();

      if (event.results[event.results.length - 1].isFinal) {
        const finalTranscript = event.results[event.results.length - 1][0].transcript;
        setRecordings(prev => {
          const current = prev[questionId] || { isRecording: false, transcript: '', duration: 0 };
          return { ...prev, [questionId]: { ...current, transcript: finalTranscript } };
        });
      }
    };

    rec.onerror = (event) => {
      if (event.error === 'aborted' || manualStop) return;
      resetPauseTimer();
    };

    rec.onend = () => {
      if (manualStop) return;
      manualStop = true;
      finishRecording(questionId, rec, intervalId, pauseTimerId);
    };

    rec.start();
  };

  const finishRecording = (questionId, rec, intervalId, pauseTimerId) => {
    try { rec?.stop(); } catch(e) {}
    if (intervalId) clearInterval(intervalId);
    if (pauseTimerId) clearTimeout(pauseTimerId);
    
    setRecordings(prev => {
      const current = prev[questionId];
      if (!current) return prev;
      return {
        ...prev,
        [questionId]: { 
          isRecording: false, 
          transcript: current.transcript || '',
          duration: 0
        }
      };
    });
  };

  const stopRecording = (questionId) => {
    setRecordings(prev => {
      const current = prev[questionId];
      if (!current) return prev;
      return {
        ...prev,
        [questionId]: { 
          isRecording: false, 
          transcript: current.transcript || '',
          duration: 0
        }
      };
    });
  };

  const handleQuestionClick = (questionId) => {
    setActiveQuestion(questionId);
    setCurrentAnswer(answers[questionId] || '');
  };

  const handleSaveAnswer = (questionId) => {
    const rec = getRecording(questionId);
    if (rec.isRecording) {
      stopRecording(questionId);
    }
    const textToSave = currentAnswer.trim() || rec.transcript.trim();
    if (textToSave) {
      setAnswers(prev => ({ ...prev, [questionId]: textToSave }));
      setActiveQuestion(null);
      setCurrentAnswer('');
      setRecordings(prev => ({ ...prev, [questionId]: { isRecording: false, transcript: '', duration: 0 } }));
    }
  };

  const handleInputChange = (text) => {
    setCurrentAnswer(text);
  };

  const [planSource, setPlanSource] = useState('');
  const [planError, setPlanError] = useState('');

  const handleGeneratePlan = async () => {
    if (!allAnswered) return;
    setIsGenerating(true);
    setPlanSource('');
    setPlanError('');
    
    try {
      const result = await generateLessonPlanWithLLM(answers);
      console.log('Plan result:', result);
      setLessonPlan(result.plan || []);
      setPlanSource(result.source || 'error');
      setPlanError(result.error || '');
    } catch (error) {
      console.error('Plan generation error:', error);
      const plan = generateLessonPlan(answers);
      setLessonPlan(plan);
      setPlanSource('error');
      setPlanError(error.message);
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
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: 'clamp(12px, 4vw, 24px)', width: '100%', boxSizing: 'border-box', overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: 'clamp(16px, 4vw, 32px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎯</div>
            <h3 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)', fontWeight: 700 }}>Your Personalized Plan</h3>
            <p style={{ margin: '8px 0 0', fontSize: '15px', color: 'var(--text-secondary)' }}>Based on your goals, here's what to study:</p>
            {planSource === 'llm' && (
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>
                ✨ Tailored by Patrick (AI)
              </p>
            )}
            {planSource === 'fallback' && (
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--warning)' }}>
                📋 Generated from your answers
                {planError && <span style={{ display: 'block', fontSize: '10px', marginTop: '4px', opacity: 0.7 }}>Fallback reason: {planError}</span>}
              </p>
            )}
            {planSource === 'error' && (
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--error)' }}>
                ❌ Error generating plan
                {planError && <span style={{ display: 'block', fontSize: '10px', marginTop: '4px', fontFamily: 'monospace', opacity: 0.8 }}>{planError}</span>}
              </p>
            )}
            {isGenerating && (
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--accent)', fontWeight: 600, animation: 'pulse 1.5s infinite' }}>
                ✨ Calling Patrick (AI)...
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
            onClick={() => { handleSavePlanToProfile(); onComplete(['myplan']); }}
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(12px, 4vw, 24px)', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>💬 Tell me about yourself</h2>
        <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)' }}>Click any question to answer in any order. All questions help create your perfect plan.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id]?.trim();
          const isActive = activeQuestion === q.id;
          const recording = getRecording(q.id);
          const isThisRecording = recording.isRecording;
          const hasTranscript = (recording.transcript || currentAnswer).trim().length > 0;
          
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
              
              {isAnswered && !isActive && (
                <div 
                  style={{ paddingLeft: '44px', cursor: 'pointer' }}
                  onClick={() => handleQuestionClick(q.id)}
                >
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{answers[q.id]}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--accent)' }}>Tap to edit</p>
                </div>
              )}
              
              {isActive && (
                <div style={{ paddingLeft: '44px' }}>
                  <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--text-tertiary)' }}>{q.hint}</p>
                  
                  <input 
                    type="text" 
                    value={currentAnswer}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Type your answer or tap Record..."
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '15px', outline: 'none', background: 'var(--bg)', marginBottom: '12px', boxSizing: 'border-box' }}
                  />
                  
                  {recording.transcript && (
                    <div style={{ marginBottom: '12px', padding: '12px', background: 'var(--accent-light)', borderRadius: '10px', borderLeft: '3px solid var(--accent)', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>Voice note:</p>
                      <div style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>{recording.transcript}</div>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => isThisRecording ? stopRecording(q.id) : startRecording(q.id)} 
                      style={{ 
                        padding: '14px 24px', 
                        background: isThisRecording ? '#ff4444' : '#00a870', 
                        border: 'none', 
                        borderRadius: '12px', 
                        cursor: 'pointer', 
                        fontSize: '15px',
                        transition: 'background 0.2s',
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
                        <>⏹️ Stop ({formatDuration(recording.duration)})</>
                      ) : (
                        <>🎙️ Record</>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => handleSaveAnswer(q.id)}
                      disabled={!hasTranscript}
                      style={{ 
                        padding: '14px 24px', 
                        background: hasTranscript ? 'var(--accent)' : 'var(--border)',
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '12px', 
                        cursor: hasTranscript ? 'pointer' : 'not-allowed',
                        fontWeight: 600, 
                        fontSize: '15px',
                        opacity: hasTranscript ? 1 : 0.5
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

      <div style={{ marginTop: '24px', textAlign: 'center', overflowX: 'hidden' }}>
        <button
          onClick={handleGeneratePlan}
          disabled={!allAnswered || isGenerating}
          style={{
            padding: '14px clamp(16px, 5vw, 32px)',
            background: allAnswered ? (isGenerating ? '#007a52' : 'var(--accent)') : 'var(--border)',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            fontSize: 'clamp(14px, 4vw, 17px)',
            fontWeight: 600,
            boxShadow: allAnswered ? '0 4px 20px rgba(0,168,112,0.4)' : 'none',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            margin: '0 auto',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          {isGenerating ? (
            <>
              <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
              <span>Calling Patrick...</span>
            </>
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
    const response = await fetch('/api', {
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
    const plan = generateLessonPlan(answers);
    return { plan, source: 'error' };
  }
}

async function translatePhraseWithLLM(phrase) {
  try {
    const response = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'translate', phrase })
    });
    if (!response.ok) throw new Error('API call failed');
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.translation;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

function SignInPrompt({ onSignIn }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { signInWithGoogle } = await import('./firebase/config');
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Sign-in failed');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '60px 24px',
      gap: '16px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '56px', marginBottom: '8px' }}>🔐</div>
      <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Sign in to save your phrases</h2>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 8px', maxWidth: '280px' }}>
        Your phrases will be saved to your Google account and synced across all your devices
      </p>
      {error && (
        <div style={{ padding: '10px 14px', background: 'var(--error-light)', borderRadius: '8px', fontSize: '13px', color: 'var(--error)' }}>
          ❌ {error}
        </div>
      )}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 24px',
          background: '#fff',
          color: '#333',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '15px',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minWidth: '220px',
          justifyContent: 'center'
        }}
      >
        {isLoading ? (
          <>
            <div style={{ width: '18px', height: '18px', border: '2px solid #e2e0dd', borderTopColor: '#333', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Signing in...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.123 15.983 5.114 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.114 2 2.123 4.017.957 7.042l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </>
        )}
      </button>
    </div>
  );
}

function MyPhrasesSection({ user }) {
  const [phrases, setPhrases] = useState([]);
  const [input, setInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [loadingPhrases, setLoadingPhrases] = useState(true);

  const uid = user?.uid;

  useEffect(() => {
    if (!uid) return;
    async function loadPhrases() {
      try {
        const { getPhrases } = await import('./firebase/config');
        const data = await getPhrases(uid);
        setPhrases(data);
      } catch (err) {
        console.error('Failed to load phrases:', err);
      }
      setLoadingPhrases(false);
    }
    loadPhrases();
  }, [uid]);

  const handleTranslate = async () => {
    if (!input.trim() || !uid) return;
    setIsTranslating(true);
    setError('');
    setCurrentResult(null);
    try {
      const result = await translatePhraseWithLLM(input.trim());
      const newEntry = {
        english: input.trim(),
        portuguese: result.portuguese,
        pronunciation: result.pronunciation,
        context: result.context
      };
      const { savePhrase } = await import('./firebase/config');
      const docRef = await savePhrase(uid, newEntry);
      setPhrases(prev => [{ id: docRef.id, ...newEntry, createdAt: new Date().toISOString() }, ...prev]);
      setCurrentResult({ id: docRef.id, ...newEntry, createdAt: new Date().toISOString() });
      setInput('');
    } catch (err) {
      setError(err.message);
    }
    setIsTranslating(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const copyPortuguese = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const deletePhrase = async (id) => {
    try {
      const { deletePhrase } = await import('./firebase/config');
      await deletePhrase(uid, id);
      setPhrases(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete phrase:', err);
    }
  };

  const clearAll = async () => {
    if (!confirm('Delete all saved phrases?')) return;
    try {
      const { getPhrases } = await import('./firebase/config');
      const all = await getPhrases(uid);
      const { deletePhrase } = await import('./firebase/config');
      for (const p of all) await deletePhrase(uid, p.id);
      setPhrases([]);
    } catch (err) {
      console.error('Failed to clear phrases:', err);
    }
  };

  return (
    <div style={{ padding: 'clamp(12px, 4vw, 24px)', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>🌐 My Phrases</h2>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Type an English phrase to get the European Portuguese translation</p>
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>Signed in as {user?.displayName || user?.email}</p>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: 'clamp(16px, 4vw, 24px)', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a phrase you want to say in Portuguese... e.g. 'I miss you' or 'How was your day?'"
          rows={3}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            fontSize: '15px',
            fontFamily: 'inherit',
            background: 'var(--bg)',
            color: 'var(--text-primary)',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: '12px',
            lineHeight: 1.5
          }}
        />
        {error && (
          <div style={{ padding: '10px 14px', background: 'var(--error-light)', borderRadius: '8px', fontSize: '13px', color: 'var(--error)', marginBottom: '10px', fontFamily: 'monospace' }}>
            ❌ {error}
          </div>
        )}
        <button
          onClick={handleTranslate}
          disabled={!input.trim() || isTranslating}
          style={{
            width: '100%',
            padding: '14px',
            background: input.trim() ? 'var(--accent)' : 'var(--border)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            fontSize: '15px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {isTranslating ? (
            <>
              <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Translating...
            </>
          ) : (
            '🌐 Translate & Save'
          )}
        </button>
      </div>

      {currentResult && (
        <div style={{ background: 'var(--accent-light)', borderRadius: '16px', padding: 'clamp(16px, 4vw, 24px)', marginBottom: '20px', border: '2px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Latest Translation</div>
            <button onClick={() => speakPortuguese(currentResult.portuguese)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px' }}>🔊</button>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{currentResult.english}</div>
          <div style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 700, color: 'var(--accent)', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>{currentResult.portuguese}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '12px' }}>[{currentResult.pronunciation}]</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, padding: '10px 12px', background: 'var(--bg)', borderRadius: '8px' }}>{currentResult.context}</div>
        </div>
      )}

      {loadingPhrases ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div style={{ width: '24px', height: '24px', border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : phrases.length > 0 ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Saved Phrases ({phrases.length})
            </h3>
            <button onClick={clearAll} style={{ fontSize: '12px', color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
              Clear all
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {phrases.map(phrase => (
              <div key={phrase.id} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '14px 16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{phrase.english}</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => speakPortuguese(phrase.portuguese)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px' }}>🔊</button>
                    <button onClick={() => copyPortuguese(phrase.portuguese)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px 6px', color: 'var(--accent)' }}>
                      {copied ? '✓' : '📋'}
                    </button>
                    <button onClick={() => deletePhrase(phrase.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px', color: 'var(--error)' }}>✕</button>
                  </div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--accent)', marginBottom: '4px' }}>{phrase.portuguese}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>[{phrase.pronunciation}]</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-tertiary)' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
          <p style={{ fontSize: '14px', margin: 0 }}>Your saved phrases will appear here</p>
        </div>
      )}
    </div>
  );
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
  
  const handleSubmit = async (text) => {
    if (!text.trim()) return;
    setTranscript('');
    addMessage(text, true);
    
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', message: text, history: chatHistory })
      });
      const data = await response.json();
      if (data.error) {
        addMessage(`Sorry, I couldn't respond: ${data.error}`);
      } else {
        addMessage(data.reply);
      }
    } catch (err) {
      addMessage('Sorry, something went wrong. Please try again.');
    }
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

function VerbCard({ verb, meaning, conj, conjEn, showEnglish, example }) {
  const [show, setShow] = useState(false);
  const displayPronouns = showEnglish ? PRONOUNS.map(p => PRONOUNS_EN[p] || p) : PRONOUNS;
  const displayConj = showEnglish && conjEn ? conjEn : conj;
  const ex = example || VERB_EXAMPLES[verb];
  const hasConj = conj && displayConj;
  const hasEx = ex && ex.pt;
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
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {hasEx && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>{ex.pt}</span>
                <button onClick={(e) => { e.stopPropagation(); speakPortuguese(ex.pt); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '0 4px' }} title="Listen to example">🔊</button>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{ex.en}</div>
            </div>
          )}
          {hasConj && (
            <div className="conj-grid">
              {displayPronouns.map((p, i) => (
                <React.Fragment key={p}>
                  <span className="conj-pronoun">{p}</span>
                  <span className="conj-form" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {displayConj[i]}
                    <button
                      onClick={(e) => { e.stopPropagation(); speakPortuguese(displayConj[i]); }}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '0 2px' }}
                      title={`Listen to "${displayConj[i]}"`}
                    >🔊</button>
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '8px', textAlign: 'center' }}>{show ? '▲ hide' : (hasConj ? '▼ conjugation & example' : hasEx ? '▼ example' : '▼ reveal')}</div>
    </div>
  );
}

function VerbListCard({ verb, meaning, type, example }) {
  const [showEx, setShowEx] = useState(false);
  const hasEx = example && example.pt;
  return (
    <div className="card" style={{ padding: '10px 14px' }} onClick={() => hasEx && setShowEx(!showEx)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {A2_PRIORITY_VERBS.has(verb.replace(/-se$/, "")) && <span style={{ color: '#c9963c', fontSize: '10px' }}>★</span>}
          <span className="verb-text">{verb}</span>
          <button onClick={(e) => { e.stopPropagation(); speakPortuguese(verb); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 4px' }}>🔊</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="verb-meaning">{meaning}</span>
          <span className={`verb-type-badge verb-type-${type.replace('-','')}`}>{type}</span>
        </div>
      </div>
      {showEx && hasEx && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-primary)' }}>{example.pt}</span>
            <button onClick={(e) => { e.stopPropagation(); speakPortuguese(example.pt); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '0 4px' }}>🔊</button>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{example.en}</div>
        </div>
      )}
      {hasEx && (
        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '6px', textAlign: 'center' }}>{showEx ? '▲ hide' : '▼ example'}</div>
      )}
    </div>
  );
}

function VocabCard({ pt, en, example }) {
  const [show, setShow] = useState(false);
  const ex = example || (typeof pt === 'string' ? null : null);
  const hasEx = ex && ex.pt;
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
      {show && hasEx && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-primary)' }}>{ex.pt}</span>
            <button onClick={(e) => { e.stopPropagation(); speakPortuguese(ex.pt); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '0 4px' }} title="Listen to example">🔊</button>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{ex.en}</div>
        </div>
      )}
      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '8px', textAlign: 'center' }}>{show ? '▲ hide' : (hasEx ? '▼ example' : '▼ reveal')}</div>
    </div>
  );
}

function AdjectiveCard({ pt, en, example }) {
  const [show, setShow] = useState(false);
  const masculine = pt;
  const feminine = pt.replace(/o$/, 'a') || pt.replace(/r$/, 'ra') || pt;
  const plural = pt + 's';
  const ex = example || ADJECTIVE_EXAMPLES[pt];
  const hasEx = ex && ex.pt;
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
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {hasEx && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-primary)' }}>{ex.pt}</span>
                <button onClick={(e) => { e.stopPropagation(); speakPortuguese(ex.pt); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '0 4px' }} title="Listen to example">🔊</button>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{ex.en}</div>
            </div>
          )}
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div style={{ marginBottom: '6px' }}><strong style={{ color: 'var(--accent)' }}>Masculine:</strong> {masculine}</div>
            <div style={{ marginBottom: '6px' }}><strong style={{ color: '#008a8a' }}>Feminine:</strong> {feminine}</div>
            <div><strong style={{ color: 'var(--warning)' }}>Plural:</strong> {plural}</div>
          </div>
        </div>
      )}
      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '8px', textAlign: 'center' }}>{show ? '▲ hide' : (hasEx ? '▼ forms & example' : '▼ reveal')}</div>
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
      {mode === 'grid' ? <div className="grid-2">{TOP_25_VERBS.map(v => <VerbCard key={v.verb} {...v} showEnglish={showEnglish} />)}</div> : <FlashcardDrill items={TOP_25_VERBS} frontKey="verb" backKey={(item) => (
        <>
          <div style={{ fontSize: '20px', color: '#00a870', fontWeight: 500 }}>{item.meaning}</div>
          {VERB_EXAMPLES[item.verb] && (
            <>
              <div style={{ marginTop: '14px', fontSize: '10px', color: '#7a8a80', textTransform: 'uppercase', letterSpacing: '1px' }}>Exemplo</div>
              <div style={{ fontStyle: 'italic', fontSize: '15px', marginTop: '4px' }}>{VERB_EXAMPLES[item.verb].pt}</div>
              <div style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>{VERB_EXAMPLES[item.verb].en}</div>
            </>
          )}
        </>
      )} title="Verbo" sectionId="verbs25" />}
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
      {mode === 'grid' ? <div className="grid-2">{ADJECTIVES.map(([pt,en], i) => <AdjectiveCard key={i} pt={pt} en={en} />)}</div> : <FlashcardDrill items={ADJECTIVES.map(([pt,en]) => ({ pt, en, example: ADJECTIVE_EXAMPLES[pt] }))} frontKey="pt" backKey={(item) => (
        <>
          <div style={{ fontSize: '20px', color: '#00a870', fontWeight: 500 }}>{item.en}</div>
          {item.example && (
            <>
              <div style={{ marginTop: '14px', fontSize: '10px', color: '#7a8a80', textTransform: 'uppercase', letterSpacing: '1px' }}>Exemplo</div>
              <div style={{ fontStyle: 'italic', fontSize: '15px', marginTop: '4px' }}>{item.example.pt}</div>
              <div style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>{item.example.en}</div>
            </>
          )}
        </>
      )} title="Adjetivo" sectionId="adjectives" />}
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
      {mode === 'grid' ? <div className="grid-2">{VOCABULARY[topic].map(([pt,en], i) => <VocabCard key={i} pt={pt} en={en} example={VOCAB_EXAMPLES[topic]?.[pt]} />)}</div> : <FlashcardDrill items={VOCABULARY[topic].map(([pt,en]) => ({ pt, en, example: VOCAB_EXAMPLES[topic]?.[pt] }))} frontKey="pt" backKey={(item) => (
        <>
          <div style={{ fontSize: '20px', color: '#00a870', fontWeight: 500 }}>{item.en}</div>
          {item.example && (
            <>
              <div style={{ marginTop: '14px', fontSize: '10px', color: '#7a8a80', textTransform: 'uppercase', letterSpacing: '1px' }}>Exemplo</div>
              <div style={{ fontStyle: 'italic', fontSize: '15px', marginTop: '4px' }}>{item.example.pt}</div>
              <div style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>{item.example.en}</div>
            </>
          )}
        </>
      )} title={topic} sectionId={'vocab_'+topic} />}
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
  const SESSION_SIZE = 20;
  const HISTORY_MAX = 1000;
  const RECENT_WINDOW = 500;

  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [a2Only, setA2Only] = useState(false);
  const [mode, setMode] = useState("list");
  const [visibleCount, setVisibleCount] = useState(100);

  const [history, setHistory] = useLocal('verbs999_history', []);
  const [sessionCards, setSessionCards] = useState([]);
  const [sessionIdx, setSessionIdx] = useState(0);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);
  const [flipped, setFlipped] = useState(false);

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

  const clearFilters = () => {
    setSearch(""); setLetter(null); setTypeFilter(null); setA2Only(false); setVisibleCount(100);
  };

  const typeCounts = useMemo(() => {
    const c = {};
    filtered.forEach(([,,t]) => { c[t] = (c[t]||0) + 1; });
    return c;
  }, [filtered]);

  const startSession = () => {
    const recent = new Set(history.slice(-RECENT_WINDOW));
    const pool = ALL_VERBS.filter(([verb]) => !recent.has(verb));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, SESSION_SIZE);
    const cards = picked.length === SESSION_SIZE
      ? picked
      : picked.concat(ALL_VERBS.slice(0, SESSION_SIZE - picked.length));
    setSessionCards(cards);
    setSessionIdx(0);
    setSessionScore({ correct: 0, total: 0 });
    setSessionComplete(false);
    setFlipped(false);
  };

  const enterFlashMode = () => {
    setMode('flash');
    startSession();
  };

  const nextFlash = (correct) => {
    setSessionScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    const current = sessionCards[sessionIdx];
    if (current) {
      setHistory(prev => {
        const next = prev.concat([current[0]]);
        return next.length > HISTORY_MAX ? next.slice(-HISTORY_MAX) : next;
      });
    }
    const nextIdx = sessionIdx + 1;
    if (nextIdx >= SESSION_SIZE) {
      setSessionComplete(true);
    } else {
      setSessionIdx(nextIdx);
      setFlipped(false);
    }
  };

  const tc = typeCounts;
  const currentFlash = !sessionComplete && sessionCards.length > 0 ? sessionCards[sessionIdx] : null;

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
        <button className={mode === 'list' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setMode('list')}>{showEnglish ? 'Reference' : 'Reference'}</button>
        <button className={mode === 'flash' ? 'toggle-btn active' : 'toggle-btn'} onClick={enterFlashMode}>{showEnglish ? 'Flashcards' : 'Flashcards'}</button>
        <button className={a2Only ? 'toggle-btn active' : 'toggle-btn'} onClick={() => { setA2Only(!a2Only); setVisibleCount(100); }}>
          {a2Only ? (showEnglish ? '★ A2 Active' : '★ A2 Ativo') : (showEnglish ? '☆ A2 Filter' : '☆ A2 Filtro')}
        </button>
        {(search || letter || typeFilter || a2Only) && (
          <button className="toggle-btn" onClick={clearFilters}>{showEnglish ? 'Clear' : 'Limpar'}</button>
        )}
      </div>

      {mode === 'flash' && (
        <div style={{ fontSize: '12px', color: '#7a8a80', marginBottom: '10px' }}>
          {showEnglish ? 'Flashcards draw from all ~1000 verbs regardless of filters. No card repeats within a 500-card window.' : 'Os flashcards usam todos os ~1000 verbos independentemente dos filtros. Não há repetições dentro de uma janela de 500 cartões.'}
        </div>
      )}

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
              <VerbListCard key={i} verb={verb} meaning={meaning} type={type} example={VERB_EXAMPLES[verb]} />
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
          {sessionComplete ? (
            <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: '22px', fontFamily: "'DM Serif Display', serif", color: '#00a870', marginBottom: '8px' }}>
                {showEnglish ? 'Session complete!' : 'Sessão completa!'}
              </div>
              <div style={{ fontSize: '15px', color: '#1a1a1a', marginBottom: '6px' }}>
                {showEnglish ? `You got ${sessionScore.correct} out of ${sessionScore.total} correct.` : `Acertaste ${sessionScore.correct} de ${sessionScore.total}.`}
              </div>
              <div style={{ fontSize: '13px', color: '#7a8a80', marginBottom: '16px' }}>
                {sessionScore.correct >= Math.ceil(SESSION_SIZE * 0.8)
                  ? (showEnglish ? 'Strong session.' : 'Boa sessão.')
                  : sessionScore.correct >= Math.ceil(SESSION_SIZE * 0.5)
                    ? (showEnglish ? 'Keep going.' : 'Continua.')
                    : (showEnglish ? 'Tough one. Try again.' : 'Difícil. Tenta outra vez.')}
              </div>
              <button className="btn btn-primary" onClick={startSession}>
                {showEnglish ? 'Start new session' : 'Nova sessão'}
              </button>
            </div>
          ) : currentFlash ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge">{sessionIdx + 1} / {SESSION_SIZE}</span>
                {sessionScore.total > 0 && <span style={{ fontSize: '12px', color: '#767676' }}>{sessionScore.correct}/{sessionScore.total} correct</span>}
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width: (sessionIdx / SESSION_SIZE) * 100 + '%'}} /></div>
              <div className="flashcard" onClick={() => setFlipped(!flipped)}>
                {!flipped ? (
                  <>
                    <div className="flashcard-label">{showEnglish ? 'Verb' : 'Verbo'} <span className={`verb-type-badge verb-type-${currentFlash[2].replace('-','')}`}>{currentFlash[2]}</span></div>
                    <div className="flashcard-verb">{currentFlash[0]}</div>
                    <button
                      onClick={(e) => { e.stopPropagation(); speakPortuguese(currentFlash[0]); }}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '22px', padding: '4px 10px', marginTop: '6px', borderRadius: '6px' }}
                      title={showEnglish ? 'Listen' : 'Ouvir'}
                    >🔊</button>
                    <div className="flashcard-hint">{showEnglish ? 'tap to flip' : 'tocar para virar'}</div>
                  </>
                ) : (
                  <>
                    <div className="flashcard-label">English</div>
                    <div className="flashcard-meaning">{currentFlash[1]}</div>
                    {VERB_EXAMPLES[currentFlash[0]] && (
                      <>
                        <div style={{ marginTop: '12px', fontSize: '10px', color: '#7a8a80', textTransform: 'uppercase', letterSpacing: '1px' }}>Exemplo</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <span style={{ fontStyle: 'italic', fontSize: '14px' }}>{VERB_EXAMPLES[currentFlash[0]].pt}</span>
                          <button onClick={(e) => { e.stopPropagation(); speakPortuguese(VERB_EXAMPLES[currentFlash[0]].pt); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', padding: '0 4px', color: '#7a8a80' }} title={showEnglish ? 'Listen' : 'Ouvir'}>🔊</button>
                        </div>
                        <div style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>{VERB_EXAMPLES[currentFlash[0]].en}</div>
                      </>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); speakPortuguese(currentFlash[0]); }}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 8px', marginBottom: '10px', color: '#7a8a80' }}
                      title={showEnglish ? 'Listen again' : 'Ouvir novamente'}
                    >🔊 {showEnglish ? 'hear again' : 'ouvir'}</button>
                    <div className="flashcard-actions">
                      <button className="btn btn-danger" onClick={e => { e.stopPropagation(); nextFlash(false); }}>{showEnglish ? 'Again' : 'Errei'}</button>
                      <button className="btn btn-primary" onClick={e => { e.stopPropagation(); nextFlash(true); }}>{showEnglish ? 'Got it' : 'Consegui'}</button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">{showEnglish ? 'No verbs available' : 'Nenhum verbo disponível'}</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SECTION MAP ────────────────────────────────────────────────────────────────

const SECTION_MAP = {
  myplan: MyPlanSection,
  phrases: MyPhrasesSection,
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
      { id: 'phrases', label: 'Minhas Frases', labelEn: 'My Phrases', icon: '💬', desc: 'Save and review your personal phrases' },
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

function Sidebar({ section, onSelect, isOpen, onClose, showEnglish, onOpenChat, currentUser, onLogout }) {
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
        {currentUser ? (
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-muted)',
              color: 'var(--text-secondary)',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              fontSize: '13px'
            }}
          >
            <img src={currentUser.photoURL} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
            {currentUser.displayName || currentUser.email}
            <span style={{ marginLeft: 'auto', fontSize: '10px' }}>🚪</span>
          </button>
        ) : (
          <button
            onClick={async () => {
              try {
                const { signInWithGoogle } = await import('./firebase/config');
                await signInWithGoogle();
              } catch (err) {
                console.error('Sign-in error:', err);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'var(--accent)',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            🔐 Sign in to save phrases
          </button>
        )}
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
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
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

  useEffect(() => {
    let unsubscribe;
    async function initAuth() {
      const { onAuthChange } = await import('./firebase/config');
      unsubscribe = onAuthChange((user) => {
        setCurrentUser(user);
        setAuthLoading(false);
      });
    }
    initAuth();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    try {
      const { logOut } = await import('./firebase/config');
      await logOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

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

  const renderSection = () => {
    if (section === 'phrases') {
      if (authLoading) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        );
      }
      if (!currentUser) {
        return <SignInPrompt onSignIn={() => {}} />;
      }
      return <SectionComp user={currentUser} />;
    }

    if (section === 'myplan') {
      return <MyPlanSection savedPlan={savedPlan} onSelectSection={(id) => { setSection(id); setSidebarOpen(false); }} />;
    }
    if (section) {
      return <SectionComp showEnglish={showEnglish} savedPlan={savedPlan} onSavePlan={handleSavePlan} />;
    }
    return (
      <div className="welcome-screen">
        <LandingPage onComplete={(recommendedSections) => { if (recommendedSections.length > 0) setSection(recommendedSections[0]); }} onSavePlan={handleSavePlan} savedPlan={savedPlan} />
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>
        <Sidebar section={section} onSelect={handleSectionSelect} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} showEnglish={showEnglish} onOpenChat={() => setChatOpen(true)} currentUser={currentUser} onLogout={handleLogout} />
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
            {renderSection()}
          </div>
        </main>
        <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        <FloatingChatButton onClick={() => setChatOpen(true)} />
      </div>
    </ErrorBoundary>
  );
}
