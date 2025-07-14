import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Bot, 
  X, 
  Phone,
  Clock,
  MessageSquare
} from "lucide-react";
import { Conversation, ChatMessage } from "./types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ChatHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
  messages: ChatMessage[];
}

export const ChatHistoryModal = ({ 
  isOpen, 
  onClose, 
  conversation, 
  messages 
}: ChatHistoryModalProps) => {
  if (!conversation) return null;

  const formatMessageTime = (timestamp: Date) => {
    return format(timestamp, "dd/MM/yyyy HH:mm", { locale: es });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-whatsapp-primary" />
                <DialogTitle className="text-xl">
                  {conversation.contactName || "Contacto sin nombre"}
                </DialogTitle>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-1" />
                {conversation.phoneNumber}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {messages.length} mensajes
            </div>
            <Badge variant="outline">
              {conversation.status === 'agente_activo' && 'Agente IA Activo'}
              {conversation.status === 'intervencion_humana' && 'Intervención Humana'}
              {conversation.status === 'estancada' && 'Conversación Estancada'}
              {conversation.status === 'agendada' && 'Cita Agendada'}
            </Badge>
          </div>
        </DialogHeader>

        {/* Chat Messages */}
        <div className="flex-1 p-6 pt-4">
          <ScrollArea className="h-[60vh] pr-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay mensajes en esta conversación</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isFromUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.isFromUser
                          ? 'bg-whatsapp-primary text-white'
                          : message.isFromAgent
                          ? 'bg-muted border'
                          : 'bg-secondary border'
                      }`}
                    >
                      {/* Message sender indicator */}
                      <div className="flex items-center space-x-2 mb-1">
                        {message.isFromUser ? (
                          <User className="h-3 w-3" />
                        ) : message.isFromAgent ? (
                          <Bot className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        <span className="text-xs opacity-75">
                          {message.isFromUser 
                            ? 'Usuario' 
                            : message.isFromAgent 
                            ? 'Agente IA' 
                            : 'Operador'
                          }
                        </span>
                        <span className="text-xs opacity-75">
                          {formatMessageTime(message.timestamp)}
                        </span>
                      </div>
                      
                      {/* Message content */}
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer with stats */}
        <div className="p-6 pt-0 border-t bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-primary">
                {messages.filter(m => m.isFromUser).length}
              </div>
              <div className="text-xs text-muted-foreground">
                Mensajes del usuario
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-whatsapp-primary">
                {messages.filter(m => m.isFromAgent).length}
              </div>
              <div className="text-xs text-muted-foreground">
                Respuestas del agente
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-status-human">
                {messages.filter(m => !m.isFromUser && !m.isFromAgent).length}
              </div>
              <div className="text-xs text-muted-foreground">
                Intervenciones humanas
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};