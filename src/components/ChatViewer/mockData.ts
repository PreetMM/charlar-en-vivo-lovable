import { Conversation, ChatMessage, DashboardMetrics } from "./types";

// Datos simulados para las conversaciones
export const mockConversations: Conversation[] = [
  {
    id: "1",
    contactName: "María González",
    phoneNumber: "+34 612 345 678",
    lastReceivedMessage: "Hola, me gustaría agendar una cita para el próximo viernes por la mañana",
    lastSentMessage: "Perfecto María, tengo disponibilidad el viernes a las 10:00 AM. ¿Te viene bien?",
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
    status: "agente_activo",
    messagesCount: 8,
    averageResponseTime: 2.5
  },
  {
    id: "2",
    contactName: "Carlos Rodríguez",
    phoneNumber: "+34 687 543 210",
    lastReceivedMessage: "No entiendo las instrucciones que me ha dado el sistema",
    lastSentMessage: "Te voy a transferir con un agente humano que podrá ayudarte mejor",
    lastMessageTime: new Date(Date.now() - 8 * 60 * 1000), // 8 minutos atrás
    status: "intervencion_humana",
    messagesCount: 12,
    averageResponseTime: 5.2
  },
  {
    id: "3",
    contactName: "Ana Martín",
    phoneNumber: "+34 654 987 321",
    lastReceivedMessage: "Vale, perfecto, nos vemos el lunes entonces",
    lastSentMessage: "Excelente Ana, tu cita está confirmada para el lunes 18 de marzo a las 14:00. Te enviaré un recordatorio el día anterior.",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    status: "agendada",
    messagesCount: 15,
    averageResponseTime: 1.8
  },
  {
    id: "4",
    contactName: "Juan Pérez",
    phoneNumber: "+34 623 456 789",
    lastReceivedMessage: "Hola?",
    lastSentMessage: "Hola Juan, ¿en qué puedo ayudarte hoy?",
    lastMessageTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutos atrás
    status: "sin_responder",
    messagesCount: 3,
    averageResponseTime: 1.2
  },
  {
    id: "5",
    contactName: "Laura Sánchez",
    phoneNumber: "+34 698 765 432",
    lastReceivedMessage: "Necesito cambiar mi cita de la semana que viene",
    lastSentMessage: "Por supuesto Laura, ¿qué día y hora te vendría mejor?",
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
    status: "agente_activo",
    messagesCount: 6,
    averageResponseTime: 3.1
  },
  {
    id: "6",
    contactName: "Roberto López",
    phoneNumber: "+34 677 888 999",
    lastReceivedMessage: "El sistema no me deja completar el proceso de pago",
    lastSentMessage: "Veo que hay un problema técnico. Te voy a conectar con soporte técnico especializado.",
    lastMessageTime: new Date(Date.now() - 20 * 60 * 1000), // 20 minutos atrás
    status: "intervencion_humana",
    messagesCount: 9,
    averageResponseTime: 4.7
  },
  {
    id: "7",
    contactName: "Patricia Fernández",
    phoneNumber: "+34 645 123 456",
    lastReceivedMessage: "Me gustaría agendar una cita para la próxima semana",
    lastSentMessage: "Perfecto Patricia, voy a revisar las opciones disponibles para ti.",
    lastMessageTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutos atrás
    status: "pendiente_agendar",
    messagesCount: 5,
    averageResponseTime: 2.8
  }
];

// Mensajes simulados para el historial de chat
export const mockChatMessages: { [conversationId: string]: ChatMessage[] } = {
  "1": [
    {
      id: "m1",
      conversationId: "1",
      content: "Hola, me gustaría obtener información sobre sus servicios",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isFromUser: true,
      isFromAgent: false
    },
    {
      id: "m2",
      conversationId: "1",
      content: "¡Hola María! Encantado de ayudarte. Ofrecemos servicios de consultoría empresarial, desarrollo web y marketing digital. ¿Hay algún área específica que te interese?",
      timestamp: new Date(Date.now() - 58 * 60 * 1000),
      isFromUser: false,
      isFromAgent: true
    },
    {
      id: "m3",
      conversationId: "1",
      content: "Me interesa especialmente el desarrollo web. ¿Podrían ayudarme con una página web para mi negocio?",
      timestamp: new Date(Date.now() - 55 * 60 * 1000),
      isFromUser: true,
      isFromAgent: false
    },
    {
      id: "m4",
      conversationId: "1",
      content: "¡Por supuesto! Nos especializamos en desarrollo web personalizado. Para poder ofrecerte la mejor propuesta, me gustaría conocer más detalles. ¿Podrías agendar una consulta?",
      timestamp: new Date(Date.now() - 53 * 60 * 1000),
      isFromUser: false,
      isFromAgent: true
    },
    {
      id: "m5",
      conversationId: "1",
      content: "Sí, me gustaría agendar una cita para el próximo viernes por la mañana",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isFromUser: true,
      isFromAgent: false
    },
    {
      id: "m6",
      conversationId: "1",
      content: "Perfecto María, tengo disponibilidad el viernes a las 10:00 AM. ¿Te viene bien?",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      isFromUser: false,
      isFromAgent: true
    }
  ],
  "2": [
    {
      id: "m7",
      conversationId: "2",
      content: "Hola, tengo problemas para entender cómo funciona su plataforma",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isFromUser: true,
      isFromAgent: false
    },
    {
      id: "m8",
      conversationId: "2",
      content: "Hola Carlos, estaré encantado de ayudarte. ¿Podrías decirme específicamente en qué parte tienes dificultades?",
      timestamp: new Date(Date.now() - 28 * 60 * 1000),
      isFromUser: false,
      isFromAgent: true
    },
    {
      id: "m9",
      conversationId: "2",
      content: "No entiendo las instrucciones que me ha dado el sistema",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      isFromUser: true,
      isFromAgent: false
    },
    {
      id: "m10",
      conversationId: "2",
      content: "Te voy a transferir con un agente humano que podrá ayudarte mejor",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isFromUser: false,
      isFromAgent: true
    }
  ]
};

// Métricas simuladas para el dashboard
export const mockDashboardMetrics: DashboardMetrics = {
  totalConversacionesActivas: 52,
  conversacionesAgente: 32,
  intervenciouesHumanas: 8,
  citasAgendadas: 12,
  conversacionesSinResponder: 7,
  pendientesAgendar: 5,
  tiempoPromedioRespuesta: 2.5,
  tiempoPromedioAgendamiento: 12,
  tiempoManualAhorrado: 24.5,
  asistenciaCitas: 87
};