import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  RefreshCw,
  MessageSquare,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";

import { DashboardMetrics } from "@/components/ChatViewer/DashboardMetrics";
import { ConversationCard } from "@/components/ChatViewer/ConversationCard";
import { ChatHistoryModal } from "@/components/ChatViewer/ChatHistoryModal";
import { 
  mockConversations, 
  mockDashboardMetrics, 
  mockChatMessages 
} from "@/components/ChatViewer/mockData";
import { Conversation, ConversationStatus, ChatMessage, TimeFilter } from "@/components/ChatViewer/types";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [metrics, setMetrics] = useState(mockDashboardMetrics);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | "todas">("todas");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("semana");
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const { toast } = useToast();

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
      // Simular actualización de datos
      setMetrics(prev => ({
        ...prev,
        totalConversacionesActivas: prev.totalConversacionesActivas + Math.floor(Math.random() * 3) - 1
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (id: string, newStatus: ConversationStatus) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, status: newStatus } : conv
      )
    );
    
    // Actualizar métricas
    const updatedConversations = conversations.map(conv => 
      conv.id === id ? { ...conv, status: newStatus } : conv
    );
    
    setMetrics({
      ...metrics,
      conversacionesAgente: updatedConversations.filter(c => c.status === 'agente_activo').length,
      intervenciouesHumanas: updatedConversations.filter(c => c.status === 'intervencion_humana').length,
      citasAgendadas: updatedConversations.filter(c => c.status === 'agendada').length,
      conversacionesSinResponder: updatedConversations.filter(c => c.status === 'sin_responder').length,
      pendientesAgendar: updatedConversations.filter(c => c.status === 'pendiente_agendar').length,
    });

    const statusLabels = {
      agente_activo: "Agente IA",
      intervencion_humana: "Intervención Humana",
      sin_responder: "Sin Responder",
      agendada: "Agendada",
      pendiente_agendar: "Pendiente Agendar"
    };

    toast({
      title: "Estado actualizado",
      description: `Conversación cambiada a: ${statusLabels[newStatus]}`,
    });
  };

  const handleOpenChat = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    const messages = mockChatMessages[id] || [];
    
    setSelectedConversation(conversation || null);
    setChatMessages(messages);
    setIsModalOpen(true);
  };

  const handleSendMessage = (conversationId: string, message: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      content: message,
      timestamp: new Date(),
      isFromUser: false,
      isFromAgent: false // Mensaje de operador humano
    };

    // Actualizar los mensajes del chat
    setChatMessages(prev => [...prev, newMessage]);
    
    // Actualizar la conversación con el último mensaje enviado
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { 
              ...conv, 
              lastSentMessage: message,
              lastMessageTime: new Date(),
              messagesCount: conv.messagesCount + 1
            } 
          : conv
      )
    );

    toast({
      title: "Mensaje enviado",
      description: "Tu respuesta ha sido enviada al usuario",
    });
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.phoneNumber.includes(searchTerm);
    const matchesStatus = statusFilter === "todas" || conv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const refreshData = () => {
    setLastRefresh(new Date());
    toast({
      title: "Datos actualizados",
      description: "La información ha sido actualizada correctamente",
    });
  };

  return (
    <div className="min-h-screen bg-whatsapp-bg">
      {/* Header */}
      <div className="bg-gradient-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">ChatViewer - Gestor de Conversaciones</h1>
                <p className="text-whatsapp-light text-sm">
                  Sistema de monitoreo WhatsApp Business
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span>Última actualización: {lastRefresh.toLocaleTimeString()}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Dashboard Metrics */}
        <Card className="border-0 shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Panel de Control en Tiempo Real</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardMetrics 
              metrics={metrics} 
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
            />
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card className="border-0 shadow-card-custom">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Tabs 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value as ConversationStatus | "todas")}
                  className="w-auto"
                >
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="todas">Todas</TabsTrigger>
                    <TabsTrigger value="agente_activo">Agente</TabsTrigger>
                    <TabsTrigger value="intervencion_humana">Humano</TabsTrigger>
                    <TabsTrigger value="agendada">Agendadas</TabsTrigger>
                    <TabsTrigger value="pendiente_agendar">Pendientes</TabsTrigger>
                    <TabsTrigger value="sin_responder">Sin Responder</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversations List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Conversaciones Activas 
              <Badge variant="secondary" className="ml-2">
                {filteredConversations.length}
              </Badge>
            </h2>
          </div>
          
          {filteredConversations.length === 0 ? (
            <Card className="border-0 shadow-card-custom">
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No se encontraron conversaciones
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || statusFilter !== "todas" 
                    ? "Prueba ajustando los filtros de búsqueda" 
                    : "No hay conversaciones activas en este momento"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredConversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                  onStatusChange={handleStatusChange}
                  onOpenChat={handleOpenChat}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat History Modal */}
      <ChatHistoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        conversation={selectedConversation}
        messages={chatMessages}
        onStatusChange={handleStatusChange}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Index;
