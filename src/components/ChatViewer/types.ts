export interface Conversation {
  id: string;
  contactName: string;
  phoneNumber: string;
  lastReceivedMessage: string;
  lastSentMessage: string;
  lastMessageTime: Date;
  status: 'agente_activo' | 'intervencion_humana' | 'estancada' | 'agendada';
  messagesCount: number;
  averageResponseTime?: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  timestamp: Date;
  isFromUser: boolean;
  isFromAgent: boolean;
}

export interface DashboardMetrics {
  totalConversacionesActivas: number;
  conversacionesAgente: number;
  intervenciouesHumanas: number;
  citasAgendadas: number;
  conversacionesEstancadas: number;
  tiempoPromedioRespuesta: number; // en minutos
  tiempoPromedioAgendamiento: number; // en minutos
}

export type ConversationStatus = 'agente_activo' | 'intervencion_humana' | 'estancada' | 'agendada';