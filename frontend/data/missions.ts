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
    title: "Missão 2 – Botão (Entrada Digital)",
    description: "Aprenda a ler um botão e tomar decisões.",
    theory: {
      title: "Lendo um botão com o ESP32",
      content: [
        "Um botão é lido em um pino configurado como **entrada**: `pinMode(BUTTON_PIN, INPUT);`.",
        "Para ler o estado: `int estado = digitalRead(BUTTON_PIN);` (retorna HIGH ou LOW).",
        "Usamos `if / else` para decidir o que fazer.",
        "Comentário: Optamos por INPUT simples assumindo resistor externo (pull-down). Se fosse interno, usaríamos INPUT_PULLUP e inverteríamos a lógica de leitura.",
      ],
      codeSnippet: `if (estado == HIGH) {
  // botão apertado
} else {
  // botão solto
}`,
    },
    quizzes: [
      {
        id: "q1",
        question: "O que esse programa faz?",
        codeSnippet: `if (estado == HIGH) {
  digitalWrite(LED_PIN, HIGH);
} else {
  digitalWrite(LED_PIN, LOW);
}`,
        options: ["O LED acende só enquanto o botão está apertado.", "O LED pisca sozinho.", "O botão liga o LED uma vez e nunca mais desliga."],
        correctIndex: 0,
        feedback: "Aqui o LED simplesmente espelha o botão: HIGH (apertado) mantém o LED aceso enquanto durar o pressionamento.",
      },
      {
        id: "q2",
        question: "Complete a condição do if:",
        codeSnippet: `int valor = digitalRead(BUTTON_PIN);
if (__________) {
  // botão apertado
}`,
        options: ["valor == HIGH", "valor == LOW", "digitalRead(BUTTON_PIN);"],
        correctIndex: 0,
        feedback: "A condição compara o valor lido com HIGH para detectar o momento em que o botão está fisicamente pressionado.",
      },
      {
        id: "q3",
        question: "Qual o modo correto do pino para um botão?",
        codeSnippet: "pinMode(BUTTON_PIN, ______ );",
        options: ["OUTPUT", "INPUT", "INPUT_PULLUP"],
        correctIndex: 1,
        feedback: "Botão é elemento de entrada: configuramos INPUT para poder ler se há nível alto ou baixo naquele pino.",
      },
    ],
    practice: {
      id: "MISSION_2_TOGGLE",
      title: "Desafio Prático: Interruptor",
      description: "Transforme o botão em um interruptor de luz (toggle).",
      checklist: ["Mantenha o LED no pino 2.", "Conecte um botão no pino 4 (D4) e no 3V3.", "Adicione um resistor de pull-down (10k) entre o pino 4 e o GND (se necessário)."],
      firmwareCommand: "MISSION_2_TOGGLE",
    },
    simulation: {
      title: "Simulação: Botão",
      content: "Ao clicar no botão virtual, o LED deve acender ou apagar. No código, usamos uma variável para lembrar se a luz estava acesa ou não.",
    },
  },
  {
    id: "3",
    title: "Missão 3 – Potenciômetro (ADC)",
    description: "Leia valores analógicos e controle brilho.",
    theory: {
      title: "Lendo valores que mudam",
      content: [
        "Sinais **analógicos** variam continuamente (não é só ligado/desligado).",
        "O ESP32 lê valores de 0 a 4095 com `analogRead(PIN);`.",
        "Podemos usar `map()` para converter esse valor para brilho (0-255).",
        "Comentário: Usamos map() porque o ADC do ESP32 fornece 12 bits (0–4095); o PWM comum trabalha em 8 bits (0–255). Isso deixa a transição de brilho suave sem perder resolução útil.",
      ],
      codeSnippet: `int leitura = analogRead(POT_PIN);
int brilho = map(leitura, 0, 4095, 0, 255);
analogWrite(LED_PIN, brilho);`,
    },
    quizzes: [
      {
        id: "q1",
        question: "Qual linha lê o valor do potenciômetro?",
        options: ["Serial.begin(115200);", "int leitura = analogRead(POT_PIN);", "Serial.println(leitura);"],
        correctIndex: 1,
        feedback: "A função analogRead obtém a amostra do conversor ADC (0–4095) daquele pino analógico.",
      },
      {
        id: "q2",
        question: "Complete para ler o pino:",
        codeSnippet: "int valor = __________(POT_PIN);",
        options: ["digitalRead", "analogRead", "digitalWrite"],
        correctIndex: 1,
        feedback: "Potenciômetro varia tensão continuamente: por isso usamos analogRead em vez de digitalRead.",
      },
      {
        id: "q3",
        question: "Qual o valor máximo para o PWM (brilho)?",
        codeSnippet: "map(leitura, 0, 4095, 0, ______ );",
        options: ["1", "255", "4095"],
        correctIndex: 1,
        feedback: "O canal de PWM trabalha normalmente em 8 bits: convertemos para 0–255 para ter resolução compatível de brilho.",
      },
    ],
    practice: {
      id: "MISSION_3_PWM",
      title: "Desafio Prático: Dimmer",
      description: "Controle o brilho do LED girando o potenciômetro.",
      checklist: ["LED no pino 2.", "Potenciômetro: pino do meio no pino 34 (D34).", "Pinos da ponta do potenciômetro no 3V3 e GND."],
      firmwareCommand: "MISSION_3_PWM",
    },
    simulation: {
      title: "Simulação: Dimmer",
      content: "Imagine um slider. No mínimo (0), o LED apaga. No máximo (4095), o LED brilha forte (255).",
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
