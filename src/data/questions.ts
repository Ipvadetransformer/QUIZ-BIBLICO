import { Question } from '../types';

export const BIBLICAL_QUESTIONS: Question[] = [
  // =========================================================================
  // 1. GINCANA BÍBLICA: NOVO TESTAMENTO — CARTAS PAULINAS
  // =========================================================================
  {
    id: 'paulinas-1',
    numberInSource: 1,
    text: 'Segundo a carta aos Filipenses, o que Paulo afirma ter aprendido a fazer em toda e qualquer situação?',
    options: [
      { key: 'A', text: 'Pregar o evangelho sem depender de ninguém' },
      { key: 'B', text: 'Viver contente em qualquer circunstância' },
      { key: 'C', text: 'Suportar qualquer perseguição sem sofrer' },
      { key: 'D', text: 'Permanecer sempre alegre, independentemente das circunstâncias' }
    ],
    correctKey: 'B',
    biblicalReference: 'Filipenses 4:11-12',
    explanation: 'Paulo afirma que aprendeu a viver contente tanto na fartura quanto na necessidade, em toda e qualquer circunstância, fortalecido em Cristo.',
    difficulty: 'facil',
    theme: 'paulinas',
    themeName: 'Cartas Paulinas',
    sourceDocument: 'Gincana Bíblica — Cartas Paulinas',
    tags: ['Filipenses', 'Contentamento', 'Apóstolo Paulo']
  },
  {
    id: 'paulinas-2',
    numberInSource: 2,
    text: 'Na carta aos Romanos, qual destes NÃO é apresentado por Paulo como um propósito da Lei?',
    options: [
      { key: 'A', text: 'Dar conhecimento do pecado' },
      { key: 'B', text: 'Tornar o pecado evidente' },
      { key: 'C', text: 'Justificar o pecador diante de Deus' },
      { key: 'D', text: 'Calar toda boca e tornar o mundo culpável diante de Deus' }
    ],
    correctKey: 'C',
    biblicalReference: 'Romanos 3:19-20',
    explanation: 'Paulo ensina que pela Lei vem o conhecimento do pecado, mas que ninguém é justificado diante de Deus pelas obras da Lei.',
    difficulty: 'facil',
    theme: 'paulinas',
    themeName: 'Cartas Paulinas',
    sourceDocument: 'Gincana Bíblica — Cartas Paulinas',
    tags: ['Romanos', 'Lei e Graça', 'Justificação']
  },
  {
    id: 'paulinas-3',
    numberInSource: 3,
    text: 'Em 1 Coríntios 15, Paulo apresenta uma sequência relacionada à ressurreição. Quem ele afirma que ressuscitou primeiro, como "as primícias"?',
    options: [
      { key: 'A', text: 'Lázaro' },
      { key: 'B', text: 'Jesus Cristo' },
      { key: 'C', text: 'O apóstolo Paulo' },
      { key: 'D', text: 'Estêvão' }
    ],
    correctKey: 'B',
    biblicalReference: '1 Coríntios 15:20-23',
    explanation: 'Cristo é apresentado como "as primícias dos que dormem", sendo o primeiro na ordem da ressurreição para a vida incorruptível.',
    difficulty: 'medio',
    theme: 'paulinas',
    themeName: 'Cartas Paulinas',
    sourceDocument: 'Gincana Bíblica — Cartas Paulinas',
    tags: ['1 Coríntios', 'Ressurreição', 'Primícias']
  },
  {
    id: 'paulinas-4',
    numberInSource: 4,
    text: 'Em sua primeira carta aos coríntios, Paulo afirma que alguns cristãos estavam dizendo: "Eu sou de Paulo", "eu sou de Apolo" e "eu sou de Cefas". Qual era o problema que Paulo estava combatendo?',
    options: [
      { key: 'A', text: 'A falta de conhecimento sobre os dons espirituais' },
      { key: 'B', text: 'A divisão e formação de partidos dentro da igreja' },
      { key: 'C', text: 'A rejeição da autoridade dos apóstolos' },
      { key: 'D', text: 'A influência dos falsos profetas sobre a igreja' }
    ],
    correctKey: 'B',
    biblicalReference: '1 Coríntios 1:10-13',
    explanation: 'Paulo combate com veemência as divisões na igreja, nas quais os cristãos se apegavam a preferências pessoais e partidos facciosos.',
    difficulty: 'medio',
    theme: 'paulinas',
    themeName: 'Cartas Paulinas',
    sourceDocument: 'Gincana Bíblica — Cartas Paulinas',
    tags: ['1 Coríntios', 'Unidade da Igreja', 'Comunhão']
  },
  {
    id: 'paulinas-5',
    numberInSource: 5,
    text: 'Em sua defesa diante dos coríntios, Paulo afirma que recebeu do Senhor uma experiência extraordinária. Quantos anos ele diz ter passado desde essa experiência até o momento em que escreve?',
    options: [
      { key: 'A', text: 'Três anos' },
      { key: 'B', text: 'Sete anos' },
      { key: 'C', text: 'Catorze anos' },
      { key: 'D', text: 'Vinte anos' }
    ],
    correctKey: 'C',
    biblicalReference: '2 Coríntios 12:2',
    explanation: 'Paulo relata que conheceu "um homem em Cristo" que, havia catorze anos, fora arrebatado até o terceiro céu ao paraíso divino.',
    difficulty: 'dificil',
    theme: 'paulinas',
    themeName: 'Cartas Paulinas',
    sourceDocument: 'Gincana Bíblica — Cartas Paulinas',
    tags: ['2 Coríntios', 'Terceiro Céu', 'Visões']
  },
  {
    id: 'paulinas-6',
    numberInSource: 6,
    text: 'Em Romanos 16, Paulo recomenda uma mulher chamada Febe. Qual função Paulo atribui a ela?',
    options: [
      { key: 'A', text: 'Presbítera da igreja de Roma' },
      { key: 'B', text: 'Profetisa da igreja de Cencreia' },
      { key: 'C', text: 'Diaconisa da igreja de Cencreia' },
      { key: 'D', text: 'Missionária da igreja de Jerusalém' }
    ],
    correctKey: 'C',
    biblicalReference: 'Romanos 16:1-2',
    explanation: 'Paulo apresenta Febe como "nossa irmã, a qual é diaconisa da igreja que está em Cencreia", elogiando seu socorro e dedicação aos santos.',
    difficulty: 'dificil',
    theme: 'paulinas',
    themeName: 'Cartas Paulinas',
    sourceDocument: 'Gincana Bíblica — Cartas Paulinas',
    tags: ['Romanos', 'Mulheres na Bíblia', 'Febe']
  },

  // =========================================================================
  // 2. CLASSE CATECÚMENOS (DOUTRIANA, FUNDAMENTOS & TEOLOGIA)
  // =========================================================================
  {
    id: 'catecumenos-1',
    numberInSource: 1,
    text: 'Qual é a diferença clássica entre revelação, inspiração e iluminação na compreensão das Sagradas Escrituras?',
    options: [
      { key: 'A', text: 'Revelação: conhecer; inspiração: escrever; iluminação: compreender.' },
      { key: 'B', text: 'Revelação: escrever; inspiração: compreender; iluminação: conhecer.' },
      { key: 'C', text: 'Revelação: compreender; inspiração: conhecer; iluminação: escrever.' },
      { key: 'D', text: 'São termos com o mesmo significado e sem distinção.' }
    ],
    correctKey: 'A',
    biblicalReference: '2 Timóteo 3:16-17; 1 Coríntios 2:12-14',
    explanation: 'Deus revela Sua verdade para ser conhecida, inspirou os escritores bíblicos para registrar fielmente sem erro, e ilumina o coração do leitor para compreender.',
    difficulty: 'facil',
    theme: 'catecumenos',
    themeName: 'Doutrina & Teologia',
    sourceDocument: 'Classe Catecúmenos (Estudo 2)',
    tags: ['Bibliologia', 'Inspiração', 'Revelação']
  },
  {
    id: 'catecumenos-2',
    numberInSource: 2,
    text: 'Qual alternativa apresenta somente atributos exclusivos de Deus?',
    options: [
      { key: 'A', text: 'Eterno, onipotente e imutável.' },
      { key: 'B', text: 'Limitado, eterno e mutável.' },
      { key: 'C', text: 'Mortal, onisciente e dependente.' },
      { key: 'D', text: 'Mutável, limitado e eterno.' }
    ],
    correctKey: 'A',
    biblicalReference: 'Malaquias 3:6; Salmos 90:2; Salmos 139:1-4',
    explanation: 'Deus é eterno (sem princípio nem fim), onipotente (tem todo poder) e imutável (não varia em sua essência, propósitos e santidade).',
    difficulty: 'facil',
    theme: 'catecumenos',
    themeName: 'Doutrina & Teologia',
    sourceDocument: 'Classe Catecúmenos (Estudo 3)',
    tags: ['Teologia Própria', 'Atributos Divinos', 'Soberania']
  },
  {
    id: 'catecumenos-3',
    numberInSource: 3,
    text: 'O que significa o ser humano ser criado à "imagem e semelhança" de Deus?',
    options: [
      { key: 'A', text: 'Possuir a própria essência e natureza divina.' },
      { key: 'B', text: 'Ter a aparência física idêntica a Deus.' },
      { key: 'C', text: 'Refletir características e propósitos dados por Deus.' },
      { key: 'D', text: 'Ser perfeito e totalmente incapaz de pecar.' }
    ],
    correctKey: 'C',
    biblicalReference: 'Gênesis 1:26-28; Colossenses 3:10',
    explanation: 'Ser imagem de Deus (Imago Dei) não é aspecto físico, mas refletir Sua santidade, capacidade relacional, justiça, sabedoria e cuidar da criação.',
    difficulty: 'medio',
    theme: 'catecumenos',
    themeName: 'Doutrina & Teologia',
    sourceDocument: 'Classe Catecúmenos (Estudo 4)',
    tags: ['Antropologia', 'Criação', 'Imago Dei']
  },
  {
    id: 'catecumenos-4',
    numberInSource: 4,
    text: 'De acordo com o ensino bíblico sobre o Plano de Salvação, por que o ser humano necessita urgentemente da salvação?',
    options: [
      { key: 'A', text: 'Porque é um ser mortal.' },
      { key: 'B', text: 'Porque é pecador e está destituído da glória de Deus.' },
      { key: 'C', text: 'Porque é limitado em suas forças intelectuais.' },
      { key: 'D', text: 'Apenas porque não conhece a história bíblica.' }
    ],
    correctKey: 'B',
    biblicalReference: 'Romanos 3:23; Romanos 6:23; Efésios 2:1-5',
    explanation: 'Todos pecaram e o salário do pecado é a morte e a separação de Deus. Somente por meio da salvação em Cristo o homem é reconciliado com o Pai.',
    difficulty: 'medio',
    theme: 'catecumenos',
    themeName: 'Doutrina & Teologia',
    sourceDocument: 'Classe Catecúmenos (Estudo 5)',
    tags: ['Soteriologia', 'Salvação', 'Graça']
  },
  {
    id: 'catecumenos-5',
    numberInSource: 5,
    text: 'Qual é o verdadeiro propósito bíblico da celebração da Santa Ceia do Senhor?',
    options: [
      { key: 'A', text: 'Apenas um memorial nostálgico para lembrar a figura de Cristo.' },
      { key: 'B', text: 'Conceder salvação automática por meio dos elementos físicos.' },
      { key: 'C', text: 'Comunicar e nutrir espiritualmente os benefícios de Cristo pela fé.' },
      { key: 'D', text: 'Substituir a pregação da Palavra nos cultos solenes.' }
    ],
    correctKey: 'C',
    biblicalReference: 'Mateus 26:26-28; 1 Coríntios 10:16-17; 11:23-29',
    explanation: 'A Ceia é sacramento e meio de graça: não gera salvação mágica nem é mero ritual sem vida, mas fortalece a fé e a comunhão no corpo de Cristo.',
    difficulty: 'dificil',
    theme: 'catecumenos',
    themeName: 'Doutrina & Teologia',
    sourceDocument: 'Classe Catecúmenos (Estudo 11)',
    tags: ['Sacramentos', 'Santa Ceia', 'Comunhão']
  },
  {
    id: 'catecumenos-6',
    numberInSource: 6,
    text: 'Na doutrina das últimas coisas (Escatologia), qual sequência cronológica expressa a ordem bíblica correta?',
    options: [
      { key: 'A', text: 'Morte → ressurreição → juízo → eternidade.' },
      { key: 'B', text: 'Morte → juízo → ressurreição → eternidade.' },
      { key: 'C', text: 'Ressurreição → morte → juízo → eternidade.' },
      { key: 'D', text: 'Morte → aniquilação → juízo → eternidade.' }
    ],
    correctKey: 'A',
    biblicalReference: '1 Coríntios 15:20-23; 1 Tessalonicenses 4:13-18; Mateus 25:31-46',
    explanation: 'A ordem bíblica revela a morte física, a ressurreição corpórea de justos e injustos, o Juízo Final perante o trono de Deus e a entrada no estado eterno.',
    difficulty: 'dificil',
    theme: 'catecumenos',
    themeName: 'Doutrina & Teologia',
    sourceDocument: 'Classe Catecúmenos (Estudo 13)',
    tags: ['Escatologia', 'Ressurreição', 'Eternidade']
  },

  // =========================================================================
  // 3. QUIZ EBD 2025 (HISTÓRIAS BÍBLICAS, PERSONAGENS & DOUTRINA)
  // =========================================================================
  {
    id: 'ebd2025-1',
    text: 'Como o homem foi criado originalmente no início por Deus?',
    options: [
      { key: 'A', text: 'Culpado' },
      { key: 'B', text: 'Sem culpa' },
      { key: 'C', text: 'Santo' },
      { key: 'D', text: 'Restaurado' }
    ],
    correctKey: 'C',
    biblicalReference: 'Eclesiastes 7:29; Gênesis 1:31',
    explanation: 'Deus fez o homem reto e santo, mas a humanidade buscou muitas invenções pecaminosas. No princípio da criação, tudo era muito bom.',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Gênesis', 'Criação', 'Santidade']
  },
  {
    id: 'ebd2025-2',
    text: 'Qual é a regra de ouro histórica para a interpretação fiel da Bíblia Sagrada?',
    options: [
      { key: 'A', text: 'A Bíblia é a nossa única regra de fé e prática.' },
      { key: 'B', text: 'A Bíblia interpreta a própria Bíblia.' },
      { key: 'C', text: 'A Bíblia é a Palavra de Deus.' },
      { key: 'D', text: 'A Bíblia contém a Palavra de Deus.' }
    ],
    correctKey: 'B',
    biblicalReference: '2 Pedro 1:20-21; 1 Coríntios 2:13',
    explanation: 'A "regra de ouro" da hermenêutica reformada (analogia da Escritura) ensina que a própria Escritura é sua melhor e mais segura intérprete.',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Hermenêutica', 'Bíblia', 'Regra de Ouro']
  },
  {
    id: 'ebd2025-3',
    text: 'Quem foi o autor do Evangelho que se inicia apresentando a linhagem e genealogia de Jesus Cristo?',
    options: [
      { key: 'A', text: 'Lucas' },
      { key: 'B', text: 'João' },
      { key: 'C', text: 'Mateus' },
      { key: 'D', text: 'Marcos' }
    ],
    correctKey: 'C',
    biblicalReference: 'Mateus 1:1-17',
    explanation: 'O Evangelho de Mateus abre com o "Livro da genealogia de Jesus Cristo, filho de Davi, filho de Abraão", demonstrando Jesus como o Messias prometido.',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Evangelhos', 'Mateus', 'Genealogia de Jesus']
  },
  {
    id: 'ebd2025-4',
    text: 'O que significa dizer que Deus é ONISCIENTE?',
    options: [
      { key: 'A', text: 'Ele conhece apenas o que já se tornou passado.' },
      { key: 'B', text: 'Ele conhece perfeitamente tudo: passado, presente, futuro e até o que poderia acontecer.' },
      { key: 'C', text: 'Ele adquire novos conhecimentos conforme o tempo corre.' },
      { key: 'D', text: 'Ele só se interessa por assuntos de ordem religiosa.' }
    ],
    correctKey: 'B',
    biblicalReference: 'Salmos 139:1-6; 1 João 3:20; Isaías 46:9-10',
    explanation: 'Onisciência é o atributo pelo qual Deus conhece exaustiva e perfeitamente todas as coisas reais e possíveis em um único relance eterno.',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Deus', 'Onisciência', 'Atributos Divinos']
  },
  {
    id: 'ebd2025-5',
    text: 'O que Sara fez em sua tenda quando ouviu a promessa do Senhor a Abraão de que teriam um filho na velhice?',
    options: [
      { key: 'A', text: 'Agradeceu alegremente em oração' },
      { key: 'B', text: 'Riu consigo mesma' },
      { key: 'C', text: 'Se emocionou e chamou os servos' },
      { key: 'D', text: 'Gritou de euforia e júbilo' }
    ],
    correctKey: 'B',
    biblicalReference: 'Gênesis 18:12-15; 21:6',
    explanation: 'Sara riu consigo mesma dizendo: "Depois de velha terei ainda deleite?". Por isso, o filho recebeu o nome de Isaque ("ele ri / riso").',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Gênesis', 'Sara', 'Abraão', 'Promessa']
  },
  {
    id: 'ebd2025-6',
    text: 'O que a Bíblia ensina quando afirma que Deus é ONIPRESENTE?',
    options: [
      { key: 'A', text: 'Deus é a própria natureza física; todas as coisas são Deus (Panteísmo).' },
      { key: 'B', text: 'Deus está em todo lugar com a totalidade do Seu ser, mas não se confunde com a criação.' },
      { key: 'C', text: 'Deus viaja em altíssima velocidade se deslocando entre galáxias.' },
      { key: 'D', text: 'Deus habita apenas no céu e apenas desce para visitas esporádicas.' }
    ],
    correctKey: 'B',
    biblicalReference: 'Salmos 139:7-10; Jeremias 23:23-24',
    explanation: 'Deus preenche os céus e a terra: está presente em todos os pontos do espaço com todo o Seu ser, sem ser parte material da criação.',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Deus', 'Onipresença', 'Atributos']
  },
  {
    id: 'ebd2025-7',
    text: 'Contra qual numeroso exército opressor Gideão e seus trezentos homens lutaram sob as ordens de Deus?',
    options: [
      { key: 'A', text: 'Caldeus' },
      { key: 'B', text: 'Midianitas' },
      { key: 'C', text: 'Heveus' },
      { key: 'D', text: 'Amorreus' }
    ],
    correctKey: 'B',
    biblicalReference: 'Juízes 7:1-25',
    explanation: 'Deus reduziu o exército de Gideão a apenas 300 homens para que a glória da vitória sobre os midianitas pertencesse exclusivamente ao Senhor.',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Juízes', 'Gideão', 'Batalhas']
  },
  {
    id: 'ebd2025-8',
    text: 'Qual foi o nome do primeiro filho nascido de Abrão com a serva Agar?',
    options: [
      { key: 'A', text: 'Israel' },
      { key: 'B', text: 'Isaque' },
      { key: 'C', text: 'Ismael' },
      { key: 'D', text: 'Samuel' }
    ],
    correctKey: 'C',
    biblicalReference: 'Gênesis 16:15-16',
    explanation: 'Agar deu à luz um filho a Abrão, e Abrão chamou o nome de seu filho de Ismael, tendo Abrão 86 anos nessa ocasião.',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Gênesis', 'Abrão', 'Ismael']
  },
  {
    id: 'ebd2025-9',
    text: 'Quem foi o pai de Ló, o sobrinho que acompanhou Abraão em sua jornada?',
    options: [
      { key: 'A', text: 'Tera' },
      { key: 'B', text: 'Naor' },
      { key: 'C', text: 'Zanir' },
      { key: 'D', text: 'Harã' }
    ],
    correctKey: 'D',
    biblicalReference: 'Gênesis 11:27',
    explanation: 'Esta é a genealogia de Tera: Tera gerou a Abrão, Naor e Harã; e Harã gerou a Ló.',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Gênesis', 'Genealogia', 'Ló', 'Harã']
  },
  {
    id: 'ebd2025-10',
    text: 'Qual discípulo negou a Jesus por três vezes antes que o galo cantasse na noite da prisão do Mestre?',
    options: [
      { key: 'A', text: 'Pedro' },
      { key: 'B', text: 'Tiago' },
      { key: 'C', text: 'Tomé' },
      { key: 'D', text: 'Judas' }
    ],
    correctKey: 'A',
    biblicalReference: 'Mateus 26:69-75',
    explanation: 'Pedro negou Jesus três vezes no pátio do sumo sacerdote e, ao ouvir o cantar do galo, lembrou-se da profecia de Cristo e chorou amargamente.',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Evangelhos', 'Pedro', 'Discípulos']
  },
  {
    id: 'ebd2025-11',
    text: 'Na teologia bíblica clássica, em quais duas grandes categorias se dividem os atributos de Deus?',
    options: [
      { key: 'A', text: 'Pai, Filho e Espírito Santo' },
      { key: 'B', text: 'Comunicáveis e Incomunicáveis' },
      { key: 'C', text: 'Estáveis e Instáveis' },
      { key: 'D', text: 'Onipotente, Onisciente e Onipresente' }
    ],
    correctKey: 'B',
    biblicalReference: 'Salmos 145:1-9; 1 Pedro 1:15-16',
    explanation: 'Atributos Incomunicáveis pertencem apenas a Deus (eternidade, onipresença); já os Comunicáveis Ele compartilha analogamente com o ser humano (amor, justiça, verdade).',
    difficulty: 'medio',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Teologia Sistemática', 'Atributos de Deus']
  },
  {
    id: 'ebd2025-12',
    text: 'Em Atos 2, no dia solene de Pentecostes, quantas pessoas aproximadamente creram e foram batizadas após o sermão de Pedro?',
    options: [
      { key: 'A', text: '2.000 pessoas' },
      { key: 'B', text: '1.000 pessoas' },
      { key: 'C', text: '5.000 pessoas' },
      { key: 'D', text: '3.000 pessoas' }
    ],
    correctKey: 'D',
    biblicalReference: 'Atos 2:41',
    explanation: 'Os que aceitaram a sua palavra foram batizados, e naquele dia houve um acréscimo de cerca de três mil pessoas à igreja de Cristo.',
    difficulty: 'medio',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Atos dos Apóstolos', 'Pentecostes', 'Primeira Igreja']
  },
  {
    id: 'ebd2025-13',
    text: 'Qual das seguintes afirmações melhor descreve a AUTOEXISTÊNCIA (Aseidade) de Deus?',
    options: [
      { key: 'A', text: 'Deus precisa da adoração contínua do homem para manter Sua força.' },
      { key: 'B', text: 'Deus existe por Si mesmo e não depende de nada nem ninguém fora dEle.' },
      { key: 'C', text: 'Deus surgiu espontaneamente no instante em que o tempo teve início.' },
      { key: 'D', text: 'Deus retira Sua energia vital das galáxias e do universo físico.' }
    ],
    correctKey: 'B',
    biblicalReference: 'Êxodo 3:14; Atos 17:24-25; João 5:26',
    explanation: 'A autoexistência (do latim a se: "de Si mesmo") significa que Deus é independente, sem causa e tem vida em Si próprio, sendo a fonte de tudo o que existe.',
    difficulty: 'medio',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Teologia', 'Aseidade', 'Natureza de Deus']
  },
  {
    id: 'ebd2025-14',
    text: 'Onde estava o apóstolo Pedro quando os discípulos de Jope enviaram mensageiros para chamá-lo com urgência após a morte de Dorcas?',
    options: [
      { key: 'A', text: 'Lida' },
      { key: 'B', text: 'Frígia' },
      { key: 'C', text: 'Damasco' },
      { key: 'D', text: 'Jerusalém' }
    ],
    correctKey: 'A',
    biblicalReference: 'Atos 9:36-39',
    explanation: 'Como Lida ficava perto de Jope, os discípulos, ouvindo que Pedro estava ali, enviaram-lhe dois homens rogando: "Não te demores em vir até nós".',
    difficulty: 'medio',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Atos', 'Pedro', 'Lida', 'Dorcas']
  },
  {
    id: 'ebd2025-15',
    text: 'Dentre as muitas promessas grandiosas que o Senhor fez a Abraão, qual foi a terra prometida para sua descendência?',
    options: [
      { key: 'A', text: 'Canaã' },
      { key: 'B', text: 'Neguebe' },
      { key: 'C', text: 'Egito' },
      { key: 'D', text: 'Manre' }
    ],
    correctKey: 'A',
    biblicalReference: 'Gênesis 12:5-7; 15:18-21',
    explanation: 'Abrão partiu para a terra de Canaã e o Senhor lhe apareceu dizendo: "À tua descendência darei esta terra".',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Gênesis', 'Terra Prometida', 'Canaã']
  },
  {
    id: 'ebd2025-16',
    text: 'O que Deus fez contra o faraó do Egito quando este tomou Sarai pensando ser apenas irmã de Abrão?',
    options: [
      { key: 'A', text: 'Falou diretamente com o faraó em um sonho' },
      { key: 'B', text: 'Apareceu fisicamente diante do trono do faraó' },
      { key: 'C', text: 'Não interferiu e nada aconteceu' },
      { key: 'D', text: 'Mandou grandes pragas e feriu a casa do faraó' }
    ],
    correctKey: 'D',
    biblicalReference: 'Gênesis 12:17',
    explanation: 'O Senhor, porém, feriu o faraó e a sua casa com grandes pragas, por causa de Sarai, mulher de Abrão, preservando sua fidelidade.',
    difficulty: 'medio',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Gênesis', 'Abrão e Sarai', 'Egito', 'Pragas']
  },
  {
    id: 'ebd2025-17',
    text: 'Qual epístola de Paulo escrita na prisão em Roma é popularmente conhecida na história cristã como a "carta da alegria"?',
    options: [
      { key: 'A', text: 'Filipenses' },
      { key: 'B', text: 'Colossenses' },
      { key: 'C', text: 'Gálatas' },
      { key: 'D', text: '2ª Tessalonicenses' }
    ],
    correctKey: 'A',
    biblicalReference: 'Filipenses 4:4',
    explanation: 'Filipenses é chamada de carta da alegria pois repete o verbo regozijar e alegrar mais de 16 vezes, destacando: "Alegrai-vos sempre no Senhor; outra vez digo: alegrai-vos!".',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Filipenses', 'Cartas Paulinas', 'Alegria']
  },
  {
    id: 'ebd2025-18',
    text: 'Na eternidade, antes da fundação do mundo, o Pai estabeleceu um acordo eterno com o Filho para resgatar os eleitos. Como a teologia bíblica denomina essa aliança?',
    options: [
      { key: 'A', text: 'Pacto da Redenção' },
      { key: 'B', text: 'Pacto da Graça' },
      { key: 'C', text: 'Pacto das Obras' },
      { key: 'D', text: 'Pacto do Testemunho' }
    ],
    correctKey: 'A',
    biblicalReference: 'Efésios 1:3-5; 2 Timóteo 1:9; Tito 1:2',
    explanation: 'O Pacto da Redenção (Pactum Salutis) é o acordo intra-trinitário eterno em que o Pai enviou o Filho e o Filho aceitou voluntariamente se fazer homem e sofrer em redenção dos pecadores.',
    difficulty: 'medio',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Pactos Bíblicos', 'Pacto da Redenção', 'Trindade']
  },
  {
    id: 'ebd2025-19',
    text: 'Qual declaração do Seu nome o Senhor mandou Moisés dizer aos israelitas no monte Horebe quando lhe perguntaram quem o enviara?',
    options: [
      { key: 'A', text: 'Eu sou Adonai' },
      { key: 'B', text: 'Eu sou El Shadday' },
      { key: 'C', text: 'Eu sou o que sou' },
      { key: 'D', text: 'Eu sou o Santo de Israel' }
    ],
    correctKey: 'C',
    biblicalReference: 'Êxodo 3:14',
    explanation: 'Disse Deus a Moisés: "EU SOU O QUE SOU". Disse mais: "Assim dirás aos filhos de Israel: EU SOU me enviou a vós". Revelando Seu nome soberano Yahweh.',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Êxodo', 'Moisés', 'Nomes de Deus', 'Eu Sou']
  },
  {
    id: 'ebd2025-20',
    text: 'Quem foi o piedoso rei de Salém e sacerdote do Deus Altíssimo a quem Abrão entregou a décima parte de tudo após resgatar Ló?',
    options: [
      { key: 'A', text: 'Mauquisedan' },
      { key: 'B', text: 'Maalalel' },
      { key: 'C', text: 'Melquisedeque' },
      { key: 'D', text: 'Anrafel' }
    ],
    correctKey: 'C',
    biblicalReference: 'Gênesis 14:18-20; Hebreus 7:1-3',
    explanation: 'Melquisedeque, rei de Salém e sacerdote do Deus Altíssimo, trouxe pão e vinho e abençoou Abrão; e Abrão deu-lhe o dízimo de tudo.',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Gênesis', 'Melquisedeque', 'Dízimo']
  },
  {
    id: 'ebd2025-21',
    text: 'A célebre cidade natal do apóstolo Paulo chamava-se Tarso. A qual importante província pertencia?',
    options: [
      { key: 'A', text: 'Cilícia' },
      { key: 'B', text: 'Palestina' },
      { key: 'C', text: 'Galileia' },
      { key: 'D', text: 'Judeia' }
    ],
    correctKey: 'A',
    biblicalReference: 'Atos 21:39; 22:3',
    explanation: 'Paulo disse ao comandante: "Eu sou judeu, cidadão de Tarso da Cilícia, cidade não insignificante; e peço-te que me permitas falar ao povo".',
    difficulty: 'medio',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Paulo', 'Geografia Bíblica', 'Tarso', 'Cilícia']
  },
  {
    id: 'ebd2025-22',
    text: 'Quais são os célebres Cinco Pontos do Calvinismo formulados no Sínodo de Dort (conhecidos pela sigla TULIP)?',
    options: [
      { key: 'A', text: 'Sola Scriptura, Sola Gratia, Solus Christus, Sola Fide e Soli Deo Gloria.' },
      { key: 'B', text: 'Depravação Total, Eleição Incondicional, Expiação Limitada, Graça Irresistível e Perseverança dos Santos.' },
      { key: 'C', text: 'Graça Salvadora, Arrependimento, Fé, Crer em Cristo e Observar a Escritura.' },
      { key: 'D', text: 'Livre Arbítrio, Vontade Humana, Cooperação, Boa Conduta e Salvação Plena.' }
    ],
    correctKey: 'B',
    biblicalReference: 'Efésios 1:4-11; João 6:37-44; Romanos 8:28-39',
    explanation: 'Os 5 pontos da teologia reformada de Dort resumem: Depravação Total, Eleição Incondicional, Expiação Limitada (Definida), Graça Irresistível e Perseverança dos Santos.',
    difficulty: 'dificil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Doutrinas da Graça', 'TULIP', 'Calvinismo']
  },
  {
    id: 'ebd2025-23',
    text: 'Quais as duas atitudes e respostas essenciais necessárias para que um pecador seja salvo ao ouvir o Evangelho de Cristo?',
    options: [
      { key: 'A', text: 'Crer na existência de Deus e frequentar uma igreja semanalmente.' },
      { key: 'B', text: 'Arrependimento e Fé salvadora em Jesus Cristo.' },
      { key: 'C', text: 'Apenas ler a Bíblia e praticar boas obras comunitárias.' },
      { key: 'D', text: 'Ser batizado e contribuir fielmente com ofertas.' }
    ],
    correctKey: 'B',
    biblicalReference: 'Marcos 1:15; Atos 20:21',
    explanation: 'Jesus pregava: "O tempo está cumprido, e o reino de Deus está próximo; arrependei-vos e crede no evangelho". Arrependimento e fé andam juntos na conversão.',
    difficulty: 'facil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Salvação', 'Arrependimento', 'Fé']
  },
  {
    id: 'ebd2025-24',
    text: 'Na Epístola aos Hebreus, Jesus é comparado a qual sacerdócio do Antigo Testamento que é superior ao sacerdócio levítico?',
    options: [
      { key: 'A', text: 'Ordem de Moisés' },
      { key: 'B', text: 'Ordem de Elias' },
      { key: 'C', text: 'Ordem de Melquisedeque' },
      { key: 'D', text: 'Ordem de Davi' }
    ],
    correctKey: 'C',
    biblicalReference: 'Hebreus 5:6; 7:1-17; Salmos 110:4',
    explanation: 'Jesus é declarado Sumo Sacerdote para sempre segundo a ordem de Melquisedeque, cujo sacerdócio não tem fim e é eterno, superior ao de Arão.',
    difficulty: 'dificil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Hebreus', 'Melquisedeque', 'Sacerdócio de Cristo']
  },
  {
    id: 'ebd2025-25',
    text: 'Sobre o conhecimento infinito de Deus e Seu soberano governo do mundo, qual afirmação é teologicamente correta?',
    options: [
      { key: 'A', text: 'Deus conhece apenas fatos passados; o restante Ele assiste conforme acontece.' },
      { key: 'B', text: 'Deus não conhece as possibilidades ou caminhos que as criaturas poderiam ter escolhido.' },
      { key: 'C', text: 'Deus conhece tanto o que vai acontecer quanto o que poderia acontecer em qualquer situação, e usa esse conhecimento no Seu governo sábio da história.' },
      { key: 'D', text: 'Deus precisa mudar de planos e adaptar Seu decreto quando o homem toma decisões inesperadas.' }
    ],
    correctKey: 'C',
    biblicalReference: '1 Samuel 23:11-13; Mateus 11:21-23; Isaías 46:9-10',
    explanation: 'A sabedoria de Deus abrange o conhecimento do que é real e do que é contingente/possível, orquestrando tudo segundo o sábio conselho de Sua vontade.',
    difficulty: 'dificil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Providência Divina', 'Onisciência', 'Soberania']
  },
  {
    id: 'ebd2025-26',
    text: 'Segundo o relato do livro de Gênesis, quantos anos tinham Abraão e seu filho Ismael no dia em que foram circuncidados?',
    options: [
      { key: 'A', text: '99 anos e 13 anos' },
      { key: 'B', text: '98 anos e 15 anos' },
      { key: 'C', text: '100 anos e 8 anos' },
      { key: 'D', text: '95 anos e 11 anos' }
    ],
    correctKey: 'A',
    biblicalReference: 'Gênesis 17:24-25',
    explanation: 'Abraão tinha 99 anos quando foi circuncidado na carne do seu prepúcio; e Ismael, seu filho, tinha 13 anos na mesma ocasião.',
    difficulty: 'dificil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['Gênesis', 'Abraão', 'Ismael', 'Circuncisão']
  },
  {
    id: 'ebd2025-27',
    text: 'Em sua última carta (2 Timóteo), qual discípulo e companheiro Paulo relata ter deixado doente na cidade de Mileto?',
    options: [
      { key: 'A', text: 'Silvano' },
      { key: 'B', text: 'Epafras' },
      { key: 'C', text: 'Zenas' },
      { key: 'D', text: 'Trófimo' }
    ],
    correctKey: 'D',
    biblicalReference: '2 Timóteo 4:20',
    explanation: 'Paulo escreve a Timóteo: "Erasto ficou em Corinto; mas a Trófimo deixei doente em Mileto", demonstrando a humanidade e as realidades da jornada missionária.',
    difficulty: 'dificil',
    theme: 'ebd2025',
    themeName: 'Histórias & Personagens',
    sourceDocument: 'Quiz EBD 2025',
    tags: ['2 Timóteo', 'Trófimo', 'Companheiros de Paulo']
  },

  // =========================================================================
  // 4. GINCANA EBD ADULTOS (COMUNHÃO, DISCIPULADO & VIDA CRISTÃ)
  // =========================================================================
  {
    id: 'adultos-1',
    numberInSource: 1,
    text: 'De acordo com as Escrituras, qual é a base fundamental e o alicerce do acolhimento cristão genuíno na igreja?',
    options: [
      { key: 'A', text: 'A afinidade social, cultural ou de idade entre as pessoas.' },
      { key: 'B', text: 'O objetivo numérico de crescimento estatístico da igreja.' },
      { key: 'C', text: 'O acolhimento e a graça que nós próprios recebemos em Cristo.' },
      { key: 'D', text: 'O potencial financeiro ou de contribuição que a pessoa possui.' },
      { key: 'E', text: 'O comportamento impecável e impecabilidade inicial do visitante.' }
    ],
    correctKey: 'C',
    biblicalReference: 'Romanos 15:7',
    explanation: 'Como nos exorta a Palavra: "Portanto, acolhei-vos uns aos outros, como também Cristo vos acolheu para a glória de Deus".',
    difficulty: 'facil',
    theme: 'ebdAdultos',
    themeName: 'Vida Cristã & Discipulado',
    sourceDocument: 'Gincana EBD Adultos',
    tags: ['Acolhimento', 'Amor Cristão', 'Igreja']
  },
  {
    id: 'adultos-2',
    numberInSource: 2,
    text: 'Na formação dos hábitos e do caráter cristão no cotidiano, o que verdadeiramente molda e conforma a nossa mente?',
    options: [
      { key: 'A', text: 'Aquilo que contemplamos, repetimos e praticamos constantemente.' },
      { key: 'B', text: 'Somente os livros acadêmicos e teológicos que estudamos.' },
      { key: 'C', text: 'Apenas as experiências emocionais intensas do passado.' },
      { key: 'D', text: 'Apenas frases e mensagens religiosas decoradas.' },
      { key: 'E', text: 'Apenas os pensamentos que aceitamos em momentos formais.' }
    ],
    correctKey: 'A',
    biblicalReference: 'Provérbios 4:23; Romanos 12:2; Filipenses 4:8',
    explanation: 'A mente é moldada pela repetição e meditação diária. "Tudo o que é verdadeiro, respeitável e justo, nisso pensai" e praticai.',
    difficulty: 'facil',
    theme: 'ebdAdultos',
    themeName: 'Vida Cristã & Discipulado',
    sourceDocument: 'Gincana EBD Adultos',
    tags: ['Renovação da Mente', 'Santificação', 'Hábitos']
  },
  {
    id: 'adultos-3',
    numberInSource: 3,
    text: 'Em Filipenses 2:3–4, a exortação apostólica de "considerar os outros superiores a nós mesmos" tem como verdadeiro significado:',
    options: [
      { key: 'A', text: 'Anular ou ignorar completamente todas as nossas necessidades legítimas.' },
      { key: 'B', text: 'Esconder covardemente os talentos e capacidades que Deus nos concedeu.' },
      { key: 'C', text: 'Concordar passivamente com todos os erros de opinião alheios.' },
      { key: 'D', text: 'Dar prioridade amorosa e serviço ao outro, sem negar a nossa dignidade dada por Deus.' },
      { key: 'E', text: 'Ajudar apenas quando não houver qualquer custo ou renúncia pessoal.' }
    ],
    correctKey: 'D',
    biblicalReference: 'Filipenses 2:3-5',
    explanation: 'A humildade de Cristo não é auto-depreciação destrutiva, mas amor desinteressado que serve e estima o próximo com altruísmo e respeito mútuo.',
    difficulty: 'medio',
    theme: 'ebdAdultos',
    themeName: 'Vida Cristã & Discipulado',
    sourceDocument: 'Gincana EBD Adultos',
    tags: ['Humildade', 'Filipenses', 'Serviço ao Próximo']
  },
  {
    id: 'adultos-4',
    numberInSource: 4,
    text: 'Se uma comunidade recebe a todos na entrada, mas na prática só integra e valoriza os mais influentes e ricos, segundo Tiago 2 isso revela:',
    options: [
      { key: 'A', text: 'Uma estratégia administrativa legítima e prudente de integração.' },
      { key: 'B', text: 'Favoritismo e acepção de pessoas, apesar da cordialidade aparente.' },
      { key: 'C', text: 'Hospitalidade plenamente suficiente e aceitável perante Deus.' },
      { key: 'D', text: 'Uma prudência louvável na escolha de quem deve liderar.' },
      { key: 'E', text: 'Respeito sadio às diferenças e hierarquias sociais vigentes.' }
    ],
    correctKey: 'B',
    biblicalReference: 'Tiago 2:1-9',
    explanation: 'Tiago denuncia a acepção de pessoas: "Se fazeis acepção de pessoas, cometeis pecado e sois julgados pela Lei como transgressores". Deus não vê a aparência.',
    difficulty: 'medio',
    theme: 'ebdAdultos',
    themeName: 'Vida Cristã & Discipulado',
    sourceDocument: 'Gincana EBD Adultos',
    tags: ['Tiago', 'Acepção de Pessoas', 'Justiça na Igreja']
  },
  {
    id: 'adultos-5',
    numberInSource: 5,
    text: 'À luz das aulas sobre Bartimeu e pertencimento, o que falta a uma igreja que recebe bem, mas não acompanha as pessoas?',
    options: [
      { key: 'A', text: 'Concentrar todo o cuidado na equipe de recepção.' },
      { key: 'B', text: 'Usar a frequência como prova de integração.' },
      { key: 'C', text: 'Substituir o acompanhamento por eventos mais frequentes.' },
      { key: 'D', text: 'Considerar a integração concluída após um curso.' },
      { key: 'E', text: 'Criar vínculos e manter o cuidado mútuo.' }
    ],
    correctKey: 'E',
    biblicalReference: 'Marcos 10:46-52; Gálatas 6:2; Hebreus 10:24-25',
    explanation: 'Jesus parou, chamou Bartimeu e caminhou com ele. Pertencimento real não é apenas aperto de mão no domingo, mas criação de laços fraternos e pastoreio mútuo.',
    difficulty: 'dificil',
    theme: 'ebdAdultos',
    themeName: 'Vida Cristã & Discipulado',
    sourceDocument: 'Gincana EBD Adultos',
    tags: ['Discipulado', 'Bartimeu', 'Cuidado Mútuo']
  },
  {
    id: 'adultos-6',
    numberInSource: 6,
    text: 'Alguém ouve pregações, aprende versículos e continua desprezando pessoas. Qual conclusão expressa a aula sobre renovação da mente?',
    options: [
      { key: 'A', text: 'Consumir conteúdo religioso já comprova transformação.' },
      { key: 'B', text: 'O problema se resolve apenas reduzindo o tempo de tela.' },
      { key: 'C', text: 'É preciso examinar o ensino e praticar obediência e amor.' },
      { key: 'D', text: 'Sentir-se encorajado confirma a fidelidade das mensagens.' },
      { key: 'E', text: 'Identificar erros alheios é prova suficiente de maturidade.' }
    ],
    correctKey: 'C',
    biblicalReference: 'Tiago 1:22-25; 1 João 4:20-21; Romanos 12:2',
    explanation: '"Sede praticantes da palavra e não somente ouvintes, enganando-vos a vós mesmos". Quem diz amar a Deus a quem não vê, mas não ama a seu irmão a quem vê, engana a si mesmo.',
    difficulty: 'dificil',
    theme: 'ebdAdultos',
    themeName: 'Vida Cristã & Discipulado',
    sourceDocument: 'Gincana EBD Adultos',
    tags: ['Tiago', 'Praticantes da Palavra', 'Amor Genuíno', 'Renovação da Mente']
  }
];

export const THEME_INFO = {
  todas: {
    id: 'todas',
    name: 'Gincana Completa (Todos os Temas)',
    description: 'Abrange todas as cartas paulinas, catecúmenos, histórias da EBD 2025 e vida cristã.',
    icon: 'BookOpenCheck',
    color: 'amber'
  },
  paulinas: {
    id: 'paulinas',
    name: 'Cartas Paulinas (Novo Testamento)',
    description: 'Romanos, 1 e 2 Coríntios, Filipenses e cartas pastorais.',
    icon: 'Scroll',
    color: 'emerald'
  },
  catecumenos: {
    id: 'catecumenos',
    name: 'Doutrina & Classe Catecúmenos',
    description: 'A Bíblia Sagrada, atributos de Deus, criação do homem, salvação e sacramentos.',
    icon: 'Flame',
    color: 'rose'
  },
  ebd2025: {
    id: 'ebd2025',
    name: 'Histórias & Personagens (Quiz EBD 2025)',
    description: 'Gênesis, patriarcas, juízes, apóstolos e grandes momentos bíblicos.',
    icon: 'Compass',
    color: 'blue'
  },
  ebdAdultos: {
    id: 'ebdAdultos',
    name: 'Vida Cristã & Discipulado (Adultos)',
    description: 'Acolhimento, renovação da mente, Tiago, humildade e cuidado mútuo na igreja.',
    icon: 'Users',
    color: 'purple'
  }
} as const;
