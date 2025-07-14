import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Bot, 
  X, 
  Phone,
  Clock,
  MessageSquare,
  Send,
  AlertTriangle,
  Calendar,
  RefreshCw
} from "lucide-react";
import { Conversation, ChatMessage, ConversationStatus } from "./types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface ChatHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
  messages: ChatMessage[];
  onStatusChange: (id: string, newStatus: ConversationStatus) => void;
  onSendMessage?: (conversationId: string, message: string) => void;
}

export const ChatHistoryModal = ({ 
  isOpen, 
  onClose, 
  conversation, 
  messages,
  onStatusChange,
  onSendMessage
}: ChatHistoryModalProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  
  if (!conversation) return null;

  const handleStatusChange = (newStatus: ConversationStatus) => {
    onStatusChange(conversation.id, newStatus);
    
    const statusLabels = {
      agente_activo: "Agente IA",
      intervencion_humana: "Intervención Humana",
      sin_responder: "Sin Responder",
      agendada: "Agendada",
      pendiente_agendar: "Pendiente Agendar"
    };

    toast({
      title: "Modo de atención cambiado",
      description: `Conversación cambiada a: ${statusLabels[newStatus]}`,
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    setIsTyping(true);
    
    // Simular envío de mensaje
    setTimeout(() => {
      if (onSendMessage) {
        onSendMessage(conversation.id, newMessage.trim());
      }
      setNewMessage("");
      setIsTyping(false);
      
      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado correctamente",
      });
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
              {conversation.status === 'sin_responder' && 'Sin Responder'}
              {conversation.status === 'agendada' && 'Cita Agendada'}
              {conversation.status === 'pendiente_agendar' && 'Pendiente Agendar'}
            </Badge>
          </div>
        </DialogHeader>

        {/* Control de Modo de Atención */}
        <div className="px-6 pb-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Cambiar modo de atención:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={conversation.status === 'agente_activo' ? "default" : "outline"}
                  onClick={() => handleStatusChange('agente_activo')}
                  disabled={conversation.status === 'agente_activo'}
                >
                  <Bot className="h-3 w-3 mr-1" />
                  Agente IA
                </Button>
                <Button
                  size="sm"
                  variant={conversation.status === 'intervencion_humana' ? "default" : "outline"}
                  onClick={() => handleStatusChange('intervencion_humana')}
                  disabled={conversation.status === 'intervencion_humana'}
                >
                  <User className="h-3 w-3 mr-1" />
                  Intervención Humana
                </Button>
                {conversation.status !== 'sin_responder' && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleStatusChange('sin_responder')}
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Sin Responder
                  </Button>
                )}
                {conversation.status !== 'pendiente_agendar' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange('pendiente_agendar')}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Pendiente Agendar
                  </Button>
                )}
                {conversation.status !== 'agendada' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleStatusChange('agendada')}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Marcar Agendada
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 px-6">
          <ScrollArea className="h-[50vh] pr-4">
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

        {/* Área de envío de mensajes (solo si es intervención humana) */}
        {conversation.status === 'intervencion_humana' && (
          <div className="px-6 py-4 border-t bg-muted/30">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Modo intervención humana activo - Puedes responder directamente</span>
              </div>
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Escribe tu respuesta aquí... (Presiona Enter para enviar, Shift+Enter para nueva línea)"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isTyping}
                  className="flex-1 min-h-[60px] resize-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className="self-end"
                >
                  {isTyping ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

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