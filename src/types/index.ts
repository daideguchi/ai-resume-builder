export interface Question {
  id: string;
  question: string;
  category: string;
  required: boolean;
}

export interface UserAnswer {
  questionId: string;
  answer: string;
  category: string;
}

export interface PersonalInfo {
  name?: string;
  birthDate?: string;
  address?: string;
  phone?: string;
  email?: string;
  education?: string[];
  experience?: string[];
  qualifications?: string[];
  skills?: string[];
  motivation?: string;
  selfPR?: string;
}

export type Step = 'start' | 'questionnaire' | 'preview' | 'export';

export interface ExportFormat {
  type: 'excel' | 'csv';
  filename: string;
  data: Record<string, string>;
} 