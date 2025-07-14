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
  estancada: {
    label: "Conversación estancada",
    icon: AlertTriangle,
    color: "bg-status-stalled text-white",
    badge: "destructive"
  },
  agendada: {
    label: "Agendada",
    icon: Calendar,
    color: "bg-status-scheduled text-white",
    badge: "outline"
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
    onStatusChange(conversation.id, 'estancada');
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
    <Card className="border-0 shadow-chat hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-foreground">
                {conversation.contactName || "Contacto sin nombre"}
              </h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <Phone className="h-3 w-3 mr-1" />
                {conversation.phoneNumber}
              </div>
            </div>
            <Badge 
              variant={config.badge as any}
              className={`${config.color} text-xs`}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground text-right">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {timeAgo}
            </div>
            <div className="mt-1">
              {conversation.messagesCount} mensajes
            </div>
          </div>
        </div>

        {/* Messages Preview */}
        <div className="space-y-2 mb-4">
          <div className="bg-muted/50 rounded-lg p-2">
            <div className="text-xs text-muted-foreground mb-1">
              Último mensaje recibido:
            </div>
            <p className="text-sm text-foreground">
              {truncateMessage(conversation.lastReceivedMessage)}
            </p>
          </div>
          <div className="bg-whatsapp-light/50 rounded-lg p-2">
            <div className="text-xs text-muted-foreground mb-1">
              Último mensaje enviado:
            </div>
            <p className="text-sm text-foreground">
              {truncateMessage(conversation.lastSentMessage)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={conversation.status === 'agente_activo' ? "outline" : "default"}
            onClick={handleToggleMode}
            className="flex-1 min-w-0"
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
          
          {conversation.status !== 'estancada' && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleMarkStalled}
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Marcar Estancada
            </Button>
          )}
          
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onOpenChat(conversation.id)}
            className="flex-1 min-w-0"
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Ver Historial
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};