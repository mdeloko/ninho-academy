export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  avatarUrl?: string;
}

export interface Module {
  id: string;
  title: string;
  type: 'theory' | 'practice';
  description: string;
  isLocked: boolean;
  isCompleted: boolean;
  xpReward: number;
  icon: string;
  order: number;
  firmwareCommand?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TheoryModule {
  id: string;
  title: string;
  sections: TheorySection[];
  quiz: Question[];
}

export interface TheorySection {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export interface PracticeStep {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  instruction: string;
}

export interface PracticeModule {
  id: string;
  title: string;
  description: string;
  steps: PracticeStep[];
  firmwareCommand?: string;
}

export interface Telemetry {
  type: 'TELEMETRY';
  userId: string;
  missionId: string;
  readings: {
    led: number;
    btn: number;
    pot: number;
  };
}
