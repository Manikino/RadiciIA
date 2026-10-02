// Generated data.js for Le Radici dell'IA Poster
function getStoredDividers() {
  try {
    const saved = localStorage.getItem('pixel_poster_dividers');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {
  "dividerY1": 1281,
  "dividerY2": 2012
};
}

let RISK_DIVIDERS = getStoredDividers();

const RISK_SECTIONS = [
  {
    id: "low",
    title: "Livello di Rischio Minimo e Limitato",
    subtitle: "Superficie & Radici Superiori",
    badge: "RISCHIO MINIMO / LIMITATO",
    color: "#00ff9d",
    bgColor: "#092e1e",
    borderColor: "#00ff9d",
    glowColor: "rgba(0, 255, 157, 0.4)",
    introTitle: "Di cosa parliamo?",
    introContent: "In questa parte dell'albero si trovano le tecnologie e le situazioni con cui interagiamo tutti i giorni. Non parliamo di minacce estreme o catastrofiche (quelle saranno nel taglio netto dei rischi inaccettabili!), ma di strumenti che richiedono solo un po' di attenzione. Qui la parola d'ordine è consapevolezza: bastano piccole precauzioni per godersi il meglio dell'IA senza cadere nelle trappole della rete!",
    yRange: [0, RISK_DIVIDERS.dividerY1]
  },
  {
    id: "high",
    title: "ALTO RISCHIO",
    subtitle: "Radici Profonde & Substrato Critico",
    badge: "ALTO RISCHIO - ATTENZIONE",
    color: "#ffb700",
    bgColor: "#382300",
    borderColor: "#ffb700",
    glowColor: "rgba(255, 183, 0, 0.4)",
    introTitle: "Consapevolezza e Controllo",
    introContent: "In questa parte del nostro poster esploriamo l'universo delle tecnologie ad Alto Rischio. Non parliamo di divieti assoluti o scenari catastrofici, ma di strumenti utili e ormai diffusissimi che toccano da vicino la nostra vita di tutti i giorni: dalla scuola al lavoro, fino alla salute. La parola d'ordine qui è consapevolezza e controllo: algoritmi potentissimi che possono migliorarci la vita, a patto che sia sempre l'uomo a tenere saldamente le redini della situazione!",
    yRange: [RISK_DIVIDERS.dividerY1, RISK_DIVIDERS.dividerY2]
  },
  {
    id: "unacceptable",
    title: "Rischio Inaccettabile",
    subtitle: "Abisso Infernale - Oltre la Linea Rossa",
    badge: "RISCHIO INACCETTABILE - DIVIETO",
    color: "#ff2a6d",
    bgColor: "#3b0818",
    borderColor: "#ff2a6d",
    glowColor: "rgba(255, 42, 109, 0.5)",
    introTitle: "Oltre la Linea Rossa",
    introContent: "Nelle profondità vediamo tecnologie che comportano una violazione dei diritti fondamentali dell’uomo e una minaccia all’autonomia e alla capacità decisionale delle persone. Ci stiamo addentrando oltre la linea rossa che queste tecnologie AI non devono superare: dove smettono di emanciparsi e iniziano a controllarci. Anche solo regolamentarle è pericoloso, dato che le legittimerebbe, dando spazio in futuro ad una diminuzione di queste restrizioni e un’aggravazione dell’asimmetria di potere che già esiste.",
    yRange: [RISK_DIVIDERS.dividerY2, 2850]
  }
];

const DEFAULT_NODE_ITEMS = [
  {
    "id": 1,
    "tier": "low",
    "title": "Chi usa l'IA con la testa",
    "icon": "brain-gear",
    "isSpecial": false,
    "content": "Utilizza gli strumenti tecnologici come supporto per amplificare la propria creatività e produttività, mantenendo il controllo finale e verificando ogni risultato. Promuove un uso etico e responsabile degli algoritmi, proteggendo la privacy e sostenendo regole come il Kids Act per difendere i minori dai contenuti sintetici spazzatura.",
    "relX": 0.21487645348837212,
    "relY": 410,
    "customColor": "#54e76a",
    "type": "normal"
  },
  {
    "id": 2,
    "tier": "low",
    "title": "Chi usa l'IA nel modo sbagliato",
    "icon": "warning-tri",
    "isSpecial": false,
    "content": "Sfrutta la potenza dell'automazione per scopi scorretti, pigri o dannosi. Genera risposte non verificate, crea truffe, effettua plagi non dichiarati o intasa la rete con materiale ingannevole senza porsi problemi etici né valutare il valore effettivo di ciò che produce.",
    "relX": 0.7497916666666667,
    "relY": 412,
    "customColor": "#52e86b",
    "type": "normal"
  },
  {
    "id": 3,
    "tier": "low",
    "title": "Chi usa i contenuti IA intelligentemente",
    "icon": "magnifier",
    "isSpecial": false,
    "content": "Analizza criticamente i prodotti, le immagini e le risposte fornite dai sistemi automatici. Riconosce i limiti dell'algoritmo e le possibili allucinazioni, elabora le informazioni ricevute come un punto di partenza e ne verifica l'accuratezza prima di utilizzarle o condividerle.",
    "relX": 0.275,
    "relY": 577,
    "customColor": "#73df56",
    "type": "normal"
  },
  {
    "id": 4,
    "tier": "low",
    "title": "Chi usa i contenuti IA in modo sbagliato",
    "icon": "zombie-brain",
    "isSpecial": false,
    "content": "Accetta passivamente qualsiasi risposta o prodotto dell'IA come fosse una verità assoluta e inconfutabile. Consuma contenuti sintetici di bassa qualità e brainrot senza porsi domande, diffondendo disinformazione e cedendo dati personali senza la minima consapevolezza.",
    "relX": 0.6041666666666666,
    "relY": 568,
    "customColor": "#71df57",
    "type": "normal"
  },
  {
    "id": 5,
    "tier": "low",
    "title": "Naviga sul web con occhio critico!",
    "icon": "eye-radar",
    "isSpecial": false,
    "content": "Guarda foto, video e articoli chiedendoti sempre se siano reali. Impara a riconoscere le piccole stranezze dei contenuti sintetici e verifica le notizie su fonti affidabili prima di crederci.",
    "relX": 0.234375,
    "relY": 760,
    "customColor": "#97d440",
    "type": "normal"
  },
  {
    "id": 6,
    "tier": "low",
    "title": "Profili Falsi e Deepfake",
    "icon": "mask",
    "isSpecial": false,
    "content": "Oggi un algoritmo può creare volti e voci identici a quelli umani. Se vedi profili social troppo perfetti o video strani, fai attenzione: gli gnomi ti ricordano che dietro potrebbe esserci un bot!",
    "relX": 0.7677083333333333,
    "relY": 721,
    "customColor": "#90d645",
    "type": "normal"
  },
  {
    "id": 7,
    "tier": "low",
    "title": "Kids Act",
    "icon": "robot-thief",
    "isSpecial": false,
    "content": "Normative e linee guida volte a regolamentare il consumo di contenuti IA da parte dei bambini. Servono a tutelare i minori dall'esposizione passiva a contenuti ipnotici, ripetitivi o privi di valore educativo (brainrot).",
    "relX": 0.2999078462348605,
    "relY": 979,
    "customColor": "#c3c825",
    "type": "normal"
  },
  {
    "id": 8,
    "tier": "low",
    "title": "Vulnerabilità Informatiche",
    "icon": "shield-lock",
    "isSpecial": false,
    "content": "Anche i sistemi di intelligenza artificiale possono avere \"buchi\" di sicurezza. I pirati informatici usano trucchi di testo per ingannarle e farsi rivelare dati riservati.",
    "relX": 0.7895833333333333,
    "relY": 997,
    "customColor": "#c6c723",
    "type": "normal"
  },
  {
    "id": 9,
    "tier": "low",
    "title": "Chatbot Amichevoli",
    "icon": "chat-bubble",
    "isSpecial": false,
    "content": "Comodi per fare domande veloci o farsi spiegare un argomento difficile, ma non sono infallibili. Elaborano solo i dati su cui sono stati allenati e non hanno la verità assoluta in tasca.",
    "relX": 0.46979166666666666,
    "relY": 1042,
    "customColor": "#cfc41d",
    "type": "normal"
  },
  {
    "id": 10,
    "tier": "low",
    "title": "La Famiglia dell'IA: LLM, Agent e Immagini",
    "icon": "bug-code",
    "isSpecial": false,
    "content": "Gli LLM elaborano e scrivono testi fluidi, i generatori grafici creano immagini da una frase, mentre gli Agent sono piccoli robot virtuali capaci di svolgere azioni al posto tuo.",
    "relX": 0.2119215705634545,
    "relY": 1040,
    "customColor": "#cfc51e",
    "type": "normal"
  },
  {
    "id": 11,
    "tier": "low",
    "title": "Frodi con Bot",
    "icon": "family-tree",
    "isSpecial": false,
    "content": "Messaggi di spam intelligenti, chiamate automatiche e bot che svuotano le offerte online. Imparare a capire quando si sta parlando con un programma ti evita truffe e spiacevoli sorprese.",
    "relX": 0.85625,
    "relY": 839,
    "customColor": "#a7d036",
    "type": "normal"
  },
  {
    "id": 12,
    "tier": "low",
    "title": "Fact-Checking e Privacy",
    "icon": "civic-building",
    "isSpecial": false,
    "content": "Le IA sanno parlare benissimo, ma a volte inventano risposte di sana pianta! Verifica sempre i fatti su fonti ufficiali e ricorda la regola d'oro: mai inserire dati personali o password nelle chat dell'IA.",
    "relX": 0.36802083333333335,
    "relY": 1107,
    "customColor": "#dcc115",
    "type": "normal"
  },
  {
    "id": 13,
    "tier": "low",
    "title": "Dead Internet Theory",
    "icon": "child-shield",
    "isSpecial": false,
    "content": "E se gran parte di internet fosse ormai popolata da bot? Questa teoria sostiene che moltissimi post e commenti in rete non siano scritti da persone reali, ma da algoritmi che interagiscono tra loro.",
    "relX": 0.6038541666666667,
    "relY": 1019,
    "customColor": "#cbc620",
    "type": "normal"
  },
  {
    "id": 14,
    "tier": "low",
    "title": "Utilizzo dell'IA per Scopi Pubblici",
    "icon": "ghost-web",
    "isSpecial": false,
    "content": "L'impiego degli algoritmi in settori chiave come sanità, magistratura e pubblica istruzione richiede una costante supervisione umana per evitare errori valutativi e discriminazioni automatiche su questioni delicate.",
    "relX": 0.27347682991047917,
    "relY": 1218,
    "customColor": "#f2bb08",
    "type": "normal"
  },
  {
    "id": 15,
    "tier": "low",
    "title": "Lo Sapevi? Gli AI Companions e il matrimonio di Yurina Noguchi",
    "icon": "heart-ring",
    "isSpecial": true,
    "content": "In Giappone, una ragazza di 32 anni di nome Yurina Noguchi ha celebrato un matrimonio simbolico con \"Klaus\", un personaggio virtuale creato e personalizzato tramite ChatGPT. Dopo aver parlato con l'IA per superare un periodo complicato, ha persino indossato l'abito da sposa e usato occhiali per la realtà augmented per scambiare gli anelli durante una vera cerimonia! Questo caso mostra quanto gli AI Companions possano creare legami emotivi profondi, ricordandoci però l'importanza di non isolarsi dalla realtà e di mantenere sempre il controllo sulla propria vita.",
    "relX": 0.5976041666666666,
    "relY": 812,
    "customColor": "#39abd0",
    "isEditable": true,
    "type": "special"
  },
  {
    "id": 16,
    "tier": "high",
    "title": "Chi pretende la supervisione umana",
    "icon": "puppet-strings",
    "isSpecial": false,
    "content": "Pretende che la tecnologia rimanga solo un supporto al servizio delle persone. Riconosce i limiti dell'IA, verifica l'imparzialità dei dati e garantisce che l'ultima parola spetti sempre a un professionista in carne ed ossa.",
    "relX": 0.2953125,
    "relY": 1620,
    "customColor": "#ff7633",
    "type": "normal"
  },
  {
    "id": 17,
    "tier": "high",
    "title": "Chi subisce l'algoritmo in modo passivo",
    "icon": "hand-stop",
    "isSpecial": false,
    "content": "Accetta le valutazioni automatiche come una verità inconfutabile, lasciando che software non controllati decidano su assunzioni, voti scolastici o diagnosi mediche, alimentando ingiustizie, doppi standard e vecchi pregiudizi.",
    "relX": 0.75,
    "relY": 1319,
    "customColor": "#ffb006",
    "type": "normal"
  },
  {
    "id": 18,
    "tier": "high",
    "title": "Supervisione Umana in Sanità",
    "icon": "balance-tilt",
    "isSpecial": false,
    "content": "L'IA è un fantastico assistente per la diagnostica, ma non è il tuo medico. La scelta della terapia e la responsabilità della cura restano al dottore, che ha il potere e il dovere di disattivare il sistema se nota anomalie o indicazioni errate.",
    "relX": 0.41041666666666665,
    "relY": 1604,
    "customColor": "#ff7930",
    "type": "normal"
  },
  {
    "id": 19,
    "tier": "high",
    "title": "Il Circuito dei Feedback Loop",
    "icon": "recycle-spin",
    "isSpecial": false,
    "content": "Quando un software di reclutamento continua ad auto-alimentarsi con le sue stesse decisioni, le distorsioni iniziali non si correggono, ma si amplificano nel tempo. I gruppi già vulnerabili finiscono così per essere automaticamente esclusi dal mondo del lavoro.",
    "relX": 0.897219589257504,
    "relY": 1369,
    "customColor": "#ffa60d",
    "type": "normal"
  },
  {
    "id": 20,
    "tier": "high",
    "title": "Supervisione Umana a Scuola",
    "icon": "school-hat",
    "isSpecial": false,
    "content": "Niente giudizi o bocciature automatizzate! In ambito scolastico l'IA può aiutare ad analizzare i dati dell'apprendimento, ma la decisione finale su un'ammissione o un voto deve rimanere sempre nelle mani di insegnanti e commissioni esaminatrici.",
    "relX": 0.17291666666666666,
    "relY": 1636,
    "customColor": "#ff7335",
    "type": "normal"
  },
  {
    "id": 21,
    "tier": "high",
    "title": "Bias nella Selezione del Personale",
    "icon": "stethoscope",
    "isSpecial": false,
    "content": "Se un algoritmo per le assunzioni viene addestrato su dati del passato, impara ed eredita vecchie discriminazioni legate a genere, età o origine. Il rischio reale è applicare doppi standard e penalizzare i candidati migliori solo perché non rientrano nei vecchi schemi di selezione.",
    "relX": 0.8,
    "relY": 1640,
    "customColor": "#ff7236",
    "type": "normal"
  },
  {
    "id": 22,
    "tier": "high",
    "title": "Tecnologie ad Alto Rischio: Utili ma Sorvegliate",
    "icon": "eye-shield",
    "isSpecial": false,
    "content": "Sistemi legali e utilissimi — come i test d'ingresso universitari, il triage di emergenza negli ospedali, i software di selezione e la gestione delle infrastrutture critiche — che possono entrare sul mercato solo se rispettano rigorosi controlli di sicurezza.",
    "relX": 0.2933025605581885,
    "relY": 1759,
    "customColor": "#ff5b47",
    "type": "normal"
  },
  {
    "id": 23,
    "tier": "high",
    "title": "Lo Sapevi? L'algoritmo di selezione di Amazon accantonato per bias di genere",
    "icon": "amazon-box",
    "isSpecial": true,
    "content": "Nel 2018, il colosso Amazon ha dovuto abbandonare un software sperimentale di intelligenza artificiale sviluppato per selezionare automaticamente i curriculum dei candidati. Il motivo? L'algoritmo era stato addestrato sui dati delle assunzioni degli ultimi dieci anni, dominati storicamente da uomini. Il sistema ha così imparato da solo che i profili maschili erano da preferire, arrivando a declassare automaticamente i curriculum che contenevano la parola \"femminile\" (come \"capitano della squadra di scacchi femminile\"). Questo caso celebre ha dimostrato al mondo intero quanto sia pericoloso lasciare le decisioni di assunzione in mano a un'IA priva di supervisione!",
    "relX": 0.7322916666666667,
    "relY": 1938,
    "customColor": "#39abd0",
    "isEditable": true,
    "type": "special"
  },
  {
    "id": 24,
    "tier": "unacceptable",
    "title": "Social Scoring",
    "icon": "skull-card",
    "isSpecial": false,
    "content": "Il social scoring può spingere le persone ad autocensurarsi e conformarsi per ottenere ricompense o evitare punizioni, limitando spontaneità, libertà di scelta e dissenso. Un esempio è il sistema di credito sociale cinese, associato al monitoraggio di comportamenti e all’eventuale limitazione dell’accesso ad alcuni servizi.",
    "relX": 0.14101105845181677,
    "relY": 2522,
    "customColor": "#ff1d71",
    "type": "normal"
  },
  {
    "id": 25,
    "tier": "unacceptable",
    "title": "Manipolazione subliminale",
    "icon": "brain-hypno",
    "isSpecial": false,
    "content": "Attraverso messaggi subliminali è possibile condizionare le decisioni senza la consapevolezza della persona, spingendola verso azioni che non avrebbe scelto liberamente. Il rischio aumenta in presenza di vulnerabilità, come giovane età, ansia, difficoltà economiche o disabilità.",
    "relX": 0.7445833333333334,
    "relY": 2174,
    "customColor": "#ff266e",
    "type": "normal"
  },
  {
    "id": 26,
    "tier": "unacceptable",
    "title": "Polizia preventiva",
    "icon": "cctv-scanner",
    "isSpecial": false,
    "content": "Il tracciamento dei volti e degli stati d’animo può creare un “effetto congelamento”, spingendo le persone a limitare movimenti, proteste e libertà nello spazio pubblico per paura di essere controllate o schedate. Nel caso estremo della polizia predittiva, si rischierebbe di agire su persone ritenute potenzialmente criminali prima che commettano un reato, mettendo in discussione il principio di innocenza fino a prova contraria.",
    "relX": 0.3104166666666667,
    "relY": 2519,
    "customColor": "#ff1d71",
    "type": "normal"
  },
  {
    "id": 27,
    "tier": "unacceptable",
    "title": "Scaping non mirato",
    "icon": "database-bio",
    "isSpecial": false,
    "content": "La raccolta indiscriminata di immagini dai social e dalle telecamere di sorveglianza porta a una schedatura di massa, mettendo a rischio l’anonimato e la privacy. Le enormi banche dati biometriche possono causare identificazioni errate e creare vulnerabilità informatiche, esponendo i dati personali ad accessi non autorizzati.",
    "relX": 0.6090244865718799,
    "relY": 2243,
    "customColor": "#ff246f",
    "type": "normal"
  },
  {
    "id": 30,
    "tier": "unacceptable",
    "title": "Lo Sapevi? In Cina il social scoring è una realtà",
    "icon": "star-special",
    "isSpecial": true,
    "isEditable": true,
    "content": "In Cina esistono sistemi di credito sociale che raccolgono e valutano informazioni sul comportamento dei cittadini. Un punteggio o una valutazione negativa può comportare limitazioni nell’accesso a determinati servizi e opportunità, come trasporti, prestiti o istruzione.",
    "relX": 0.9182291666666667,
    "relY": 2456,
    "customColor": "#39abd0",
    "type": "special"
  }
];

function getStoredNodes() {
  try {
    const saved = localStorage.getItem('pixel_poster_nodes');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_NODE_ITEMS;
}

let NODE_ITEMS = getStoredNodes();

const DEFAULT_NODE_LINKS = [
  {
    "id": 2,
    "fromId": 3,
    "toId": 5,
    "points": [
      {
        "relX": 0.2359375,
        "relY": 649
      }
    ],
    "style": {
      "color": "#72df57",
      "colorStart": "#72df57",
      "colorEnd": "#97d440",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 3,
    "fromId": 5,
    "toId": 7,
    "points": [
      {
        "relX": 0.2557291666666667,
        "relY": 792
      },
      {
        "relX": 0.25833333333333336,
        "relY": 854
      },
      {
        "relX": 0.28125,
        "relY": 891
      }
    ],
    "style": {
      "color": "#97d440",
      "colorStart": "#97d440",
      "colorEnd": "#dbc116",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 4,
    "fromId": 7,
    "toId": 12,
    "points": [
      {
        "relX": 0.321875,
        "relY": 1012
      },
      {
        "relX": 0.3541666666666667,
        "relY": 1054
      }
    ],
    "style": {
      "color": "#dbc116",
      "colorStart": "#dbc116",
      "colorEnd": "#c6c723",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 6,
    "fromId": 10,
    "toId": 14,
    "points": [
      {
        "relX": 0.2234375,
        "relY": 1118
      }
    ],
    "style": {
      "color": "#a7d036",
      "colorStart": "#a7d036",
      "colorEnd": "#dcc115",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 7,
    "fromId": 3,
    "toId": 9,
    "points": [
      {
        "relX": 0.25677083333333334,
        "relY": 700
      },
      {
        "relX": 0.3109375,
        "relY": 768
      },
      {
        "relX": 0.3458333333333333,
        "relY": 907
      },
      {
        "relX": 0.39114583333333336,
        "relY": 941
      },
      {
        "relX": 0.4114583333333333,
        "relY": 1002
      }
    ],
    "style": {
      "color": "#72df57",
      "colorStart": "#72df57",
      "colorEnd": "#bfc928",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 13,
    "fromId": 3,
    "toId": 20,
    "points": [
      {
        "relX": 0.17604166666666668,
        "relY": 730
      },
      {
        "relX": 0.18541666666666667,
        "relY": 809
      },
      {
        "relX": 0.17083333333333334,
        "relY": 914
      },
      {
        "relX": 0.19427083333333334,
        "relY": 1073
      },
      {
        "relX": 0.1515625,
        "relY": 1179
      },
      {
        "relX": 0.165625,
        "relY": 1278
      },
      {
        "relX": 0.1546875,
        "relY": 1364
      },
      {
        "relX": 0.1890625,
        "relY": 1451
      },
      {
        "relX": 0.15833333333333333,
        "relY": 1526
      }
    ],
    "style": {
      "color": "#72df57",
      "colorStart": "#72df57",
      "colorEnd": "#ff7335",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 14,
    "fromId": 14,
    "toId": 16,
    "points": [
      {
        "relX": 0.3067708333333333,
        "relY": 1283
      },
      {
        "relX": 0.29791666666666666,
        "relY": 1337
      },
      {
        "relX": 0.2557291666666667,
        "relY": 1367
      },
      {
        "relX": 0.2578125,
        "relY": 1406
      },
      {
        "relX": 0.2833333333333333,
        "relY": 1443
      }
    ],
    "style": {
      "color": "#dcc115",
      "colorStart": "#dcc115",
      "colorEnd": "#ffb006",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 15,
    "fromId": 14,
    "toId": 18,
    "points": [
      {
        "relX": 0.315625,
        "relY": 1325
      },
      {
        "relX": 0.33697916666666666,
        "relY": 1349
      },
      {
        "relX": 0.3515625,
        "relY": 1388
      },
      {
        "relX": 0.371875,
        "relY": 1462
      },
      {
        "relX": 0.4015625,
        "relY": 1504
      }
    ],
    "style": {
      "color": "#dcc115",
      "colorStart": "#dcc115",
      "colorEnd": "#ff7236",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 23,
    "fromId": 24,
    "toId": 26,
    "points": [
      {
        "relX": 0.2480252764612954,
        "relY": 2523
      }
    ],
    "style": {
      "color": "#ff276e",
      "colorStart": "#ff276e",
      "colorEnd": "#ff1d71",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 27,
    "fromId": 3,
    "toId": 10,
    "points": [
      {
        "relX": 0.2635416666666667,
        "relY": 692
      },
      {
        "relX": 0.30833333333333335,
        "relY": 787
      },
      {
        "relX": 0.2833333333333333,
        "relY": 876
      },
      {
        "relX": 0.24583333333333332,
        "relY": 930
      }
    ],
    "style": {
      "color": "#72df57",
      "colorStart": "#72df57",
      "colorEnd": "#a7d036",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 28,
    "fromId": 16,
    "toId": 22,
    "points": [
      {
        "relX": 0.2985781990521327,
        "relY": 1689
      }
    ],
    "style": {
      "color": "#ffb006",
      "colorStart": "#ffb006",
      "colorEnd": "#ff3d5f",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 29,
    "fromId": 18,
    "toId": 22,
    "points": [
      {
        "relX": 0.41390205371248023,
        "relY": 1703
      },
      {
        "relX": 0.3744075829383886,
        "relY": 1760
      },
      {
        "relX": 0.3048973143759874,
        "relY": 1754
      }
    ],
    "style": {
      "color": "#ff7236",
      "colorStart": "#ff7236",
      "colorEnd": "#ff3d5f",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 30,
    "fromId": 20,
    "toId": 22,
    "points": [
      {
        "relX": 0.17956819378620326,
        "relY": 1724
      },
      {
        "relX": 0.23170089520800422,
        "relY": 1758
      },
      {
        "relX": 0.29583333333333334,
        "relY": 1759
      }
    ],
    "style": {
      "color": "#ff7335",
      "colorStart": "#ff7335",
      "colorEnd": "#ff3d5f",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 31,
    "fromId": 27,
    "toId": 26,
    "points": [
      {
        "relX": 0.5229067930489731,
        "relY": 2305
      },
      {
        "relX": 0.4807793575566087,
        "relY": 2460
      },
      {
        "relX": 0.41179568193786203,
        "relY": 2499
      },
      {
        "relX": 0.38335966298051605,
        "relY": 2517
      }
    ],
    "style": {
      "color": "#ff1a72",
      "colorStart": "#ff1a72",
      "colorEnd": "#ff1d71",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 33,
    "fromId": 2,
    "toId": 4,
    "points": [
      {
        "relX": 0.7369791666666666,
        "relY": 484
      },
      {
        "relX": 0.7130208333333333,
        "relY": 504
      },
      {
        "relX": 0.6864583333333333,
        "relY": 524
      },
      {
        "relX": 0.6546875,
        "relY": 522
      },
      {
        "relX": 0.6380208333333334,
        "relY": 491
      },
      {
        "relX": 0.6130208333333333,
        "relY": 442
      },
      {
        "relX": 0.5828125,
        "relY": 444
      },
      {
        "relX": 0.5651041666666666,
        "relY": 459
      },
      {
        "relX": 0.546875,
        "relY": 487
      },
      {
        "relX": 0.5359375,
        "relY": 536
      },
      {
        "relX": 0.5432291666666667,
        "relY": 568
      },
      {
        "relX": 0.5604166666666667,
        "relY": 580
      },
      {
        "relX": 0.58125,
        "relY": 578
      }
    ],
    "style": {
      "color": "#58e667",
      "colorStart": "#58e667",
      "colorEnd": "#6de05a",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 34,
    "fromId": 4,
    "toId": 6,
    "points": [
      {
        "relX": 0.6276041666666666,
        "relY": 569
      },
      {
        "relX": 0.6453125,
        "relY": 568
      },
      {
        "relX": 0.6635416666666667,
        "relY": 565
      },
      {
        "relX": 0.6822916666666666,
        "relY": 565
      },
      {
        "relX": 0.70625,
        "relY": 567
      },
      {
        "relX": 0.7234375,
        "relY": 582
      },
      {
        "relX": 0.7416666666666667,
        "relY": 603
      },
      {
        "relX": 0.7536458333333333,
        "relY": 634
      },
      {
        "relX": 0.7578125,
        "relY": 667
      }
    ],
    "style": {
      "color": "#6de05a",
      "colorStart": "#6de05a",
      "colorEnd": "#90d645",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 35,
    "fromId": 6,
    "toId": 11,
    "points": [
      {
        "relX": 0.7703125,
        "relY": 769
      },
      {
        "relX": 0.7786458333333334,
        "relY": 789
      },
      {
        "relX": 0.7880208333333333,
        "relY": 808
      },
      {
        "relX": 0.8026041666666667,
        "relY": 826
      },
      {
        "relX": 0.8151041666666666,
        "relY": 836
      },
      {
        "relX": 0.8338541666666667,
        "relY": 839
      }
    ],
    "style": {
      "color": "#90d645",
      "colorStart": "#90d645",
      "colorEnd": "#bdca28",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 36,
    "fromId": 11,
    "toId": 8,
    "points": [
      {
        "relX": 0.8776041666666666,
        "relY": 900
      },
      {
        "relX": 0.8776041666666666,
        "relY": 901
      },
      {
        "relX": 0.8807291666666667,
        "relY": 928
      },
      {
        "relX": 0.8786458333333333,
        "relY": 960
      },
      {
        "relX": 0.8692708333333333,
        "relY": 984
      },
      {
        "relX": 0.8494791666666667,
        "relY": 1005
      },
      {
        "relX": 0.8260416666666667,
        "relY": 1009
      },
      {
        "relX": 0.8036458333333333,
        "relY": 1003
      }
    ],
    "style": {
      "color": "#bdca28",
      "colorStart": "#bdca28",
      "colorEnd": "#c9c621",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 37,
    "fromId": 8,
    "toId": 13,
    "points": [
      {
        "relX": 0.7666666666666667,
        "relY": 976
      },
      {
        "relX": 0.7458333333333333,
        "relY": 964
      },
      {
        "relX": 0.7166666666666667,
        "relY": 949
      },
      {
        "relX": 0.6854166666666667,
        "relY": 952
      },
      {
        "relX": 0.6625,
        "relY": 965
      },
      {
        "relX": 0.6401041666666667,
        "relY": 980
      },
      {
        "relX": 0.61875,
        "relY": 1005
      }
    ],
    "style": {
      "color": "#c9c621",
      "colorStart": "#c9c621",
      "colorEnd": "#eabd0d",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 38,
    "fromId": 13,
    "toId": 17,
    "points": [
      {
        "relX": 0.6,
        "relY": 1078
      },
      {
        "relX": 0.6130208333333333,
        "relY": 1127
      },
      {
        "relX": 0.6296875,
        "relY": 1162
      },
      {
        "relX": 0.6557291666666667,
        "relY": 1191
      },
      {
        "relX": 0.6817708333333333,
        "relY": 1208
      },
      {
        "relX": 0.696875,
        "relY": 1223
      },
      {
        "relX": 0.7192708333333333,
        "relY": 1260
      }
    ],
    "style": {
      "color": "#eabd0d",
      "colorStart": "#eabd0d",
      "colorEnd": "#ff7633",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 39,
    "fromId": 17,
    "toId": 19,
    "points": [
      {
        "relX": 0.7791666666666667,
        "relY": 1375
      },
      {
        "relX": 0.8067708333333333,
        "relY": 1378
      },
      {
        "relX": 0.8307291666666666,
        "relY": 1365
      },
      {
        "relX": 0.8588541666666667,
        "relY": 1331
      },
      {
        "relX": 0.8822916666666667,
        "relY": 1327
      }
    ],
    "style": {
      "color": "#ff7633",
      "colorStart": "#ff7633",
      "colorEnd": "#ff8b22",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 40,
    "fromId": 17,
    "toId": 21,
    "points": [
      {
        "relX": 0.7572916666666667,
        "relY": 1376
      },
      {
        "relX": 0.7479166666666667,
        "relY": 1418
      },
      {
        "relX": 0.7286458333333333,
        "relY": 1477
      },
      {
        "relX": 0.7041666666666667,
        "relY": 1516
      },
      {
        "relX": 0.6859375,
        "relY": 1567
      },
      {
        "relX": 0.7020833333333333,
        "relY": 1626
      },
      {
        "relX": 0.7359375,
        "relY": 1627
      },
      {
        "relX": 0.7677083333333333,
        "relY": 1616
      }
    ],
    "style": {
      "color": "#ff7633",
      "colorStart": "#ff7633",
      "colorEnd": "#ff7930",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 41,
    "fromId": 21,
    "toId": 25,
    "points": [
      {
        "relX": 0.8276041666666667,
        "relY": 1655
      },
      {
        "relX": 0.8411458333333334,
        "relY": 1689
      },
      {
        "relX": 0.8442708333333333,
        "relY": 1733
      },
      {
        "relX": 0.84375,
        "relY": 1799
      },
      {
        "relX": 0.8380208333333333,
        "relY": 1848
      },
      {
        "relX": 0.8177083333333334,
        "relY": 1927
      },
      {
        "relX": 0.7979166666666667,
        "relY": 1984
      },
      {
        "relX": 0.7755208333333333,
        "relY": 2048
      },
      {
        "relX": 0.7651041666666667,
        "relY": 2096
      },
      {
        "relX": 0.7619791666666667,
        "relY": 2127
      }
    ],
    "style": {
      "color": "#ff7930",
      "colorStart": "#ff7930",
      "colorEnd": "#ff266e",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 42,
    "fromId": 1,
    "toId": 3,
    "points": [
      {
        "relX": 0.2265625,
        "relY": 467
      },
      {
        "relX": 0.24114583333333334,
        "relY": 494
      },
      {
        "relX": 0.253125,
        "relY": 504
      },
      {
        "relX": 0.26510416666666664,
        "relY": 522
      }
    ],
    "style": {
      "color": "#54e76a",
      "colorStart": "#54e76a",
      "colorEnd": "#72df57",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  },
  {
    "id": 43,
    "fromId": 25,
    "toId": 27,
    "points": [
      {
        "relX": 0.7166666666666667,
        "relY": 2173
      },
      {
        "relX": 0.6994791666666667,
        "relY": 2207
      },
      {
        "relX": 0.6791666666666667,
        "relY": 2240
      },
      {
        "relX": 0.6479166666666667,
        "relY": 2246
      }
    ],
    "style": {
      "color": "#ff266e",
      "colorStart": "#ff266e",
      "colorEnd": "#ff1a72",
      "gradient": true,
      "gradientMode": "nodes",
      "width": 3,
      "glow": 14,
      "opacity": 0.9,
      "dash": 24,
      "animated": true
    }
  }
];

function getStoredLinks() {
  try {
    const saved = localStorage.getItem('pixel_poster_links');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_NODE_LINKS;
}

let NODE_LINKS = getStoredLinks();

function updateRiskSectionRanges() {
  RISK_SECTIONS[0].yRange = [0, RISK_DIVIDERS.dividerY1];
  RISK_SECTIONS[1].yRange = [RISK_DIVIDERS.dividerY1, RISK_DIVIDERS.dividerY2];
  RISK_SECTIONS[2].yRange = [RISK_DIVIDERS.dividerY2, 2850];
}

updateRiskSectionRanges();

if (typeof module !== 'undefined') {
  module.exports = { RISK_DIVIDERS, RISK_SECTIONS, NODE_ITEMS, DEFAULT_NODE_ITEMS, NODE_LINKS, DEFAULT_NODE_LINKS, updateRiskSectionRanges };
}
