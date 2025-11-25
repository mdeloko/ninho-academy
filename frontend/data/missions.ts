export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
  codeSnippet?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  theory: {
    title: string;
    content: string[]; // Paragraphs
    codeSnippet?: string;
  };
  quizzes: Quiz[];
  practice: {
    id: string; // Firmware mission ID (e.g., MISSION_1_BLINK)
    title: string;
    description: string;
    checklist: string[];
    firmwareCommand: string; // e.g., MISSION_1_BLINK
  };
  simulation: {
    title: string;
    content: string;
  };
}

export const missions: Mission[] = [
  {
    id: "0",
    title: "Introdução – O que é um Microcontrolador?",
    description: "Entenda os conceitos básicos de eletrônica e programação para ESP32.",
    theory: {
      title: "Fundamentos: Microcontroladores e IoT",
      content: [
        "Um **microcontrolador** é um computador pequeno que controla dispositivos eletrônicos. O **ESP32** é um microcontrolador poderoso com Wi-Fi e Bluetooth integrados, perfeito para projetos de **Internet das Coisas (IoT)**.",
        "**Pinos digitais** são como botões: podem estar `HIGH` (5V, ligado) ou `LOW` (0V, desligado). Usamos pinos como entrada (receber dados de sensores) ou saída (controlar LEDs, motores, etc).",
        "**Linguagem Arduino** é uma linguagem simplificada baseada em C/C++. Todo programa tem duas funções principais:",
        "• `setup()` - executada **uma vez** quando o ESP32 liga. Aqui configuramos os pinos e inicializamos componentes.",
        "• `loop()` - executada **repetidamente** enquanto o ESP32 está ligado. Aqui colocamos o comportamento que queremos.",
        "Um **LED (Light Emitting Diode)** é um componente que emite luz. Precisa estar conectado corretamente: a perna longa vai para o pino (via resistor de proteção), a perna curta vai para GND (terra).",
        "Neste curso aprenderemos a usar o ESP32 para controlar componentes eletrônicos, ler sensores e criar projetos IoT incríveis! 🚀",
      ],
      codeSnippet: `// Estrutura básica de um programa Arduino
void setup() {
  // Executado UMA VEZ ao ligar
  Serial.begin(9600);          // inicializa comunicação serial
  pinMode(2, OUTPUT);          // configura pino 2 como saída
  Serial.println("ESP32 iniciado!");
}

void loop() {
  // Executado CONTINUAMENTE em loop
  Serial.println("Olá do loop!");
  delay(1000);                 // aguarda 1 segundo
}`,
    },
    quizzes: [
      {
        id: "q1",
        question: "Qual é a principal diferença entre setup() e loop()?",
        options: ["setup() roda uma vez, loop() roda continuamente.", "setup() é mais importante que loop().", "setup() é apenas para ESP32, loop() é para todos os microcontroladores."],
        correctIndex: 0,
        feedback: "Exato! setup() é executado uma única vez na inicialização, enquanto loop() fica se repetindo infinitamente enquanto o dispositivo está ligado.",
      },
      {
        id: "q2",
        question: "O que significa um pino estar em estado HIGH?",
        options: ["O pino está desligado (0V).", "O pino está danificado.", "O pino está ligado (5V ou 3.3V, dependendo do microcontrolador)."],
        correctIndex: 2,
        feedback: "HIGH significa que o pino está energizado com a tensão de funcionamento (geralmente 3.3V no ESP32). Isso é o estado 'ligado'.",
      },
      {
        id: "q3",
        question: "Por que é necessário usar um resistor com um LED?",
        options: ["Para deixar o LED mais brilhante.", "Para proteger o LED e o pino de corrente excessiva.", "Para melhorar a velocidade do ESP32."],
        correctIndex: 1,
        feedback: "O resistor limita a corrente que passa pelo LED. Sem ele, passaria corrente demais e queimaria tanto o LED quanto o pino do ESP32.",
      },
      {
        id: "q4",
        question: "O que significa IoT?",
        options: ["Internet of Things (Internet das Coisas)", "Input/Output Technology", "Integrated Operating Technology"],
        correctIndex: 0,
        feedback: "IoT é a sigla para 'Internet of Things'. Refere-se à rede de dispositivos conectados à internet que coletam e compartilham dados.",
      },
    ],
    practice: {
      id: "INTRO",
      title: "Sem prática nesta lição",
      description: "Esta é uma lição teórica. Próximos desafios terão componentes práticos!",
      checklist: [],
      firmwareCommand: "INTRO",
    },
    simulation: {
      title: "Conceito Teórico",
      content: "Nesta lição aprendemos os fundamentos. Nos próximos desafios, você colocará em prática esses conceitos com o ESP32!",
    },
  },
  {
    id: "1",
    title: "Missão 1 – LED (Saída Digital)",

    description: "Aprenda a controlar um LED com o ESP32.",
    theory: {
      title: "Como o ESP32 acende um LED",
      content: [
        "O ESP32 tem **pinos de saída digital**, que podem ser `HIGH` (ligado) ou `LOW` (desligado), configurados com `pinMode(ledPin, OUTPUT);`.",
        "Um LED precisa estar ligado a um pino de saída + resistor e GND.",
        "O programa Arduino tem duas partes: `setup()` (roda uma vez) e `loop()` (roda sem parar).",
      ],
      codeSnippet: `const int LED_PIN = 2;

void setup() {
  pinMode(LED_PIN, OUTPUT);        // configura o pino como saída
}

void loop() {
  digitalWrite(LED_PIN, HIGH);     // liga o LED
  delay(1000);                     // espera 1 segundo (1000 ms)
  digitalWrite(LED_PIN, LOW);      // desliga o LED
  delay(1000);                     // espera 1 segundo
}`,
    },
    quizzes: [
      {
        id: "q1",
        question: "O que esse programa faz com o LED?",
        codeSnippet: `void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}`,
        options: ["Mantém o LED sempre aceso.", "Faz o LED piscar: 1 segundo ligado, 1 segundo desligado.", "Lê o valor de um sensor."],
        correctIndex: 1,
        feedback: "Note a sequência: liga (HIGH), espera, desliga (LOW), espera novamente. Como isso acontece dentro do loop infinito, o efeito visual é o piscar contínuo.",
      },
      {
        id: "q2",
        question: "Complete o código para configurar o pino:",
        codeSnippet: `void setup() {
  pinMode(LED_PIN, ______);
}`,
        options: ["INPUT", "OUTPUT", "INPUT_PULLUP"],
        correctIndex: 1,
        feedback: "Para comandar um LED precisamos que o pino seja configurado como OUTPUT; como entrada ele só leria sinais e não mudaria o estado do componente.",
      },
      {
        id: "q3",
        question: "Qual comando LIGA o LED?",
        options: ["digitalWrite(LED_PIN, LOW);", "digitalWrite(LED_PIN, HIGH);", "pinMode(LED_PIN, OUTPUT);"],
        correctIndex: 1,
        feedback: "Quando escrevemos HIGH numa saída digital estamos energizando o pino: LED recebe tensão e acende.",
      },
    ],
    practice: {
      id: "MISSION_1_BLINK",
      title: "Desafio Prático: LED Piscando",
      description: "Vamos fazer o LED piscar na prática!",
      checklist: ["Conecte o ESP32 via USB.", "Conecte um LED (perna maior) no pino 2 (ou D2).", "Conecte um resistor entre a perna menor do LED e o GND."],
      firmwareCommand: "MISSION_1_BLINK",
    },
    simulation: {
      title: "Simulação: LED",
      content: "Imagine o LED acendendo e apagando a cada segundo. Se trocarmos delay(1000) por delay(200), ele piscaria muito mais rápido!",
    },
  },
  {
    id: "2",
    title: "Missão 2 – LED Externo (Resistor)",
    description: "Aprenda a conectar um LED externo com resistor e controlar seu tempo.",
    theory: {
      title: "LEDs Externos e Resistores",
      content: [
        "Para conectar um LED externo, precisamos de um **resistor** para limitar a corrente e não queimar o componente.",
        "Nesta missão, usaremos um resistor de **1kΩ** (marrom, preto, vermelho) e um LED conectado a um pino diferente.",
        "Vamos programar o LED para piscar em um intervalo mais lento (2 segundos).",
      ],
      codeSnippet: `// Pisca a cada 2 segundos
digitalWrite(PIN_LED_2, HIGH);
delay(2000);
digitalWrite(PIN_LED_2, LOW);
delay(2000);`,
    },
    quizzes: [
      {
        id: "q1",
        question: "Qual a função do resistor no circuito do LED?",
        options: ["Aumentar o brilho.", "Limitar a corrente para proteger o LED.", "Fazer o LED piscar."],
        correctIndex: 1,
        feedback: "O resistor é essencial para evitar que corrente excessiva passe pelo LED e o queime.",
      },
      {
        id: "q2",
        question: "Se aumentarmos o delay para 2000, o que acontece?",
        options: ["O LED pisca mais rápido.", "O LED pisca mais devagar (a cada 2 segundos).", "O LED não acende."],
        correctIndex: 1,
        feedback: "2000 milissegundos equivalem a 2 segundos. O intervalo será maior.",
      },
      {
        id: "q3",
        question: "Onde conectamos a perna menor do LED?",
        options: ["No pino digital.", "No 3V3.", "No GND (Terra)."],
        correctIndex: 2,
        feedback: "A perna menor (cátodo) deve ser conectada ao GND (terra) para fechar o circuito.",
      },
    ],
    practice: {
      id: "MISSION_2_LED_1K",
      title: "Desafio Prático: LED Externo",
      description: "Monte um circuito com LED externo e resistor de 1kΩ.",
      checklist: ["Conecte o LED (perna maior) no pino 5.", "Conecte o resistor de 1kΩ na perna menor do LED.", "Conecte a outra ponta do resistor no GND.", "O LED deve piscar a cada 2 segundos."],
      firmwareCommand: "MISSION_2_LED_1K",
    },
    simulation: {
      title: "Simulação: LED Externo",
      content: "Imagine conectar os componentes na protoboard. O código fará o pino 5 ligar e desligar.",
    },
  },
  {
    id: "3",
    title: "Missão 3 – Buzzer (Música)",
    description: "Faça o ESP32 tocar uma melodia usando um Buzzer.",
    theory: {
      title: "Produzindo Som com Buzzer",
      content: [
        "Um **Buzzer** é um componente que produz som quando energizado com uma frequência específica.",
        "Usamos a função `tone(pino, frequencia, duracao)` para tocar notas musicais.",
        "Podemos criar melodias sequenciando várias notas.",
      ],
      codeSnippet: `tone(BUZZER_PIN, 262, 500); // Toca Dó (C4) por 500ms
delay(500);
tone(BUZZER_PIN, 294, 500); // Toca Ré (D4) por 500ms`,
    },
    quizzes: [
      {
        id: "q1",
        question: "Qual função usamos para gerar som no Buzzer?",
        options: ["digitalWrite()", "analogWrite()", "tone()"],
        correctIndex: 2,
        feedback: "A função tone() gera um sinal PWM na frequência desejada para fazer o buzzer vibrar e produzir som.",
      },
      {
        id: "q2",
        question: "O que o segundo parâmetro de tone() define?",
        options: ["O pino.", "A frequência (nota musical).", "A duração."],
        correctIndex: 1,
        feedback: "tone(pino, frequencia, duracao). O segundo parâmetro é a frequência em Hertz.",
      },
      {
        id: "q3",
        question: "O buzzer deve ser conectado a qual tipo de pino?",
        options: ["Apenas analógico.", "Qualquer pino digital capaz de saída.", "Apenas pino 1."],
        correctIndex: 1,
        feedback: "Podemos usar qualquer pino digital configurado como saída para controlar o buzzer.",
      },
    ],
    practice: {
      id: "MISSION_3_BUZZER",
      title: "Desafio Prático: Tocando Música",
      description: "Conecte o Buzzer e ouça a melodia.",
      checklist: ["Conecte o pino positivo do Buzzer no pino 18.", "Conecte o pino negativo do Buzzer no GND.", "Aguarde a melodia começar!"],
      firmwareCommand: "MISSION_3_BUZZER",
    },
    simulation: {
      title: "Simulação: Buzzer",
      content: "O buzzer vibrará nas frequências das notas musicais, criando a melodia programada.",
    },
  },
  {
    id: "4",
    title: "Missão 4 – Máquina de Estados",
    description: "Crie modos de funcionamento.",
    theory: {
      title: "Modos de funcionamento",
      content: [
        "Podemos usar uma variável `modo` para guardar o estado atual.",
        "0: Desligado, 1: Aceso, 2: Piscando.",
        "A cada aperto do botão, somamos 1 ao modo. Se passar de 2, volta para 0.",
        "Comentário: Três modos foram escolhidos para evidenciar ciclo finito e transições explícitas; o incremento com reset torna visível o conceito de máquina de estados simples.",
      ],
      codeSnippet: `if (botao == HIGH) {
  modo++;
  if (modo > 2) modo = 0;
}`,
    },
    quizzes: [
      {
        id: "q1",
        question: "Qual variável guarda o modo atual?",
        options: ["LED_PIN", "BUTTON_PIN", "modo"],
        correctIndex: 2,
        feedback: "A variável 'modo' faz o papel de memória: guarda em qual etapa lógica estamos (apagado, aceso ou piscando).",
      },
      {
        id: "q2",
        question: "O que faz: if (modo > 2) modo = 0; ?",
        options: ["Mantém o modo sempre em 0.", "Faz o modo ciclar (0 -> 1 -> 2 -> 0).", "Desliga o LED."],
        correctIndex: 1,
        feedback: "Ao detectar que passou de 2, voltamos para 0 e o ciclo se torna circular (loop de modos).",
      },
      {
        id: "q3",
        question: "Complete a condição para o modo 1:",
        codeSnippet: "else if (__________) { digitalWrite(LED_PIN, HIGH); }",
        options: ["modo = 1", "modo == 1", "modo > 1"],
        correctIndex: 1,
        feedback: "Empregamos '==' para comparar sem alterar o valor; usar '=' aqui causaria bug ao atribuir em vez de verificar.",
      },
    ],
    practice: {
      id: "MISSION_4_STATE_MACHINE",
      title: "Desafio Prático: Lanterna Multimodo",
      description: "Crie uma lanterna com 3 modos: Apagada, Acesa, Piscando.",
      checklist: ["LED no pino 2.", "Botão no pino 4."],
      firmwareCommand: "MISSION_4_STATE_MACHINE",
    },
    simulation: {
      title: "Simulação: Modos",
      content: "Aperte o botão virtual. A cada clique, o comportamento muda. 0: Off -> 1: On -> 2: Blink -> 0: Off...",
    },
  },
  {
    id: "5",
    title: "Missão 5 – Projeto Final",
    description: "Controle de luz completo com modos.",
    theory: {
      title: "Projeto Final",
      content: ["Vamos juntar tudo!", "Entrada: Botão. Saída: LED.", "Lógica: Máquina de estados com 3 modos.", "Modo 0: Escuro. Modo 1: Luz Normal. Modo 2: Alerta (pisca rápido)."],
    },
    quizzes: [
      {
        id: "q1",
        question: "Qual é a ENTRADA desse projeto?",
        options: ["LED", "Botão"],
        correctIndex: 1,
        feedback: "O botão atua como fonte de interação humana: é a entrada que dispara mudança de estado.",
      },
      {
        id: "q2",
        question: "Qual é a SAÍDA principal?",
        options: ["ESP32", "LED"],
        correctIndex: 1,
        feedback: "O LED materializa a saída: cada modo altera seu comportamento visível (apagado, contínuo, alerta).",
      },
      {
        id: "q3",
        question: "Complete: int modo = ___; (valor inicial)",
        options: ["0", "2", "HIGH"],
        correctIndex: 0,
        feedback: "Inicializamos em 0 para garantir estado previsível e seguro: começa apagado até uma ação do usuário.",
      },
    ],
    practice: {
      id: "MISSION_5_FINAL",
      title: "Projeto Final: Controle de Luz",
      description: "Implemente o sistema completo de iluminação.",
      checklist: ["Verifique todas as conexões.", "LED no pino 2, Botão no pino 4.", "Teste todos os modos."],
      firmwareCommand: "MISSION_5_FINAL",
    },
    simulation: {
      title: "Simulação Final",
      content: "Parabéns! Você completou a trilha. Na simulação, verifique se o modo 'Alerta' pisca mais rápido que o normal.",
    },
  },
];
