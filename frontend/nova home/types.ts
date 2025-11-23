import { LucideIcon } from 'lucide-react';

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RoadmapStep {
  id: number;
  title: string;
  isCompleted: boolean;
  isCurrent: boolean;
  icon?: LucideIcon;
}