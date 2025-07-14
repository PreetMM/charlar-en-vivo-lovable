import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  User, 
  AlertTriangle, 
  Calendar, 
  MessageSquare,
  Clock,
  Phone
} from "lucide-react";
import { Conversation, ConversationStatus } from "./types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface ConversationCardProps {
  conversation: Conversation;
  onStatusChange: (id: string, newStatus: ConversationStatus) => void;
  onOpenChat: (id: string) => void;
}

const statusConfig = {
  agente_activo: {
    label: "Agente conversacional activo",
    icon: Bot,
    color: "bg-status-active text-white",
    badge: "default"
  },
  intervencion_humana: {
    label: "Intervención humana",
    icon: User,
    color: "bg-status-human text-white",
    badge: "secondary"
  },
  sin_responder: {
    label: "Sin responder",
    icon: AlertTriangle,
    color: "bg-status-stalled text-white",
    badge: "destructive"
  },
  agendada: {
    label: "Agendada",
    icon: Calendar,
    color: "bg-status-scheduled text-white",
    badge: "outline"
  },
  pendiente_agendar: {
    label: "Pendiente agendar",
    icon: Calendar,
    color: "bg-orange-500 text-white",
    badge: "secondary"
  }
} as const;

export const ConversationCard = ({ 
  conversation, 
  onStatusChange, 
  onOpenChat 
}: ConversationCardProps) => {
  const config = statusConfig[conversation.status];
  const StatusIcon = config.icon;

  const handleToggleMode = () => {
    const newStatus = conversation.status === 'agente_activo' 
      ? 'intervencion_humana' 
      : 'agente_activo';
    onStatusChange(conversation.id, newStatus);
  };

  const handleMarkStalled = () => {
    onStatusChange(conversation.id, 'sin_responder');
  };

  const timeAgo = formatDistanceToNow(conversation.lastMessageTime, {
    addSuffix: true,
    locale: es
  });

  const truncateMessage = (message: string, maxLength: number = 60) => {
    return message.length > maxLength 
      ? `${message.substring(0, maxLength)}...` 
      : message;
  };

  return (
    <Card className="border-0 shadow-chat hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
      <CardContent className="p-4">
        {/* Layout optimizado para lista */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Información principal del contacto */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-foreground truncate">
                  {conversation.contactName || "Contacto sin nombre"}
                </h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Phone className="h-3 w-3 mr-1" />
                  {conversation.phoneNumber}
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-right lg:hidden">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {timeAgo}
                </div>
              </div>
            </div>
            
            <Badge 
              variant={config.badge as any}
              className={`${config.color} text-xs mb-3`}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>

            {/* Mensajes en diseño horizontal para lista */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Último recibido:
                </div>
                <p className="text-sm text-foreground">
                  {truncateMessage(conversation.lastReceivedMessage, 45)}
                </p>
              </div>
              <div className="bg-whatsapp-light/50 rounded-lg p-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Último enviado:
                </div>
                <p className="text-sm text-foreground">
                  {truncateMessage(conversation.lastSentMessage, 45)}
                </p>
              </div>
            </div>
          </div>

          {/* Información de tiempo y estadísticas */}
          <div className="flex flex-col items-end justify-center space-y-2 min-w-0 lg:min-w-[120px]">
            <div className="text-xs text-muted-foreground text-right hidden lg:block">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {timeAgo}
              </div>
              <div className="mt-1">
                {conversation.messagesCount} mensajes
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap lg:flex-col gap-2 lg:min-w-[200px]">
            <Button
              size="sm"
              variant={conversation.status === 'agente_activo' ? "outline" : "default"}
              onClick={handleToggleMode}
              className="flex-1 lg:w-full"
            >
              {conversation.status === 'agente_activo' ? (
                <>
                  <User className="h-3 w-3 mr-1" />
                  Intervención Humana
                </>
              ) : (
                <>
                  <Bot className="h-3 w-3 mr-1" />
                  Modo Agente IA
                </>
              )}
            </Button>
            
            <div className="flex gap-2 lg:w-full">
              {conversation.status !== 'sin_responder' && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleMarkStalled}
                  className="flex-1"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Sin Responder</span>
                  <span className="sm:hidden">Sin Responder</span>
                </Button>
              )}
              
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onOpenChat(conversation.id)}
                className="flex-1"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Ver Historial</span>
                <span className="sm:hidden">Historial</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};