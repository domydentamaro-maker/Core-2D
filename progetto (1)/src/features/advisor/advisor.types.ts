export interface AdvisorMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
