export interface Conversation {
  id: string;
  contactName: string;
  phoneNumber: string;
  lastReceivedMessage: string;
  lastSentMessage: string;
  lastMessageTime: Date;
  status: 'agente_activo' | 'intervencion_humana' | 'sin_responder' | 'agendada' | 'pendiente_agendar';
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
  conversacionesSinResponder: number;
  pendientesAgendar: number;
  tiempoPromedioRespuesta: number; // en minutos
  tiempoPromedioAgendamiento: number; // en minutos
  tiempoManualAhorrado: number; // en horas
  asistenciaCitas: number; // porcentaje
}

export type ConversationStatus = 'agente_activo' | 'intervencion_humana' | 'sin_responder' | 'agendada' | 'pendiente_agendar';

export type TimeFilter = 'hora' | 'semana' | 'mes';