import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Bot, 
  User, 
  Calendar, 
  AlertTriangle, 
  Clock,
  CalendarCheck
} from "lucide-react";
import { DashboardMetrics as MetricsType } from "./types";

interface DashboardMetricsProps {
  metrics: MetricsType;
}

export const DashboardMetrics = ({ metrics }: DashboardMetricsProps) => {
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  const metricsData = [
    {
      title: "Total Conversaciones Activas",
      value: metrics.totalConversacionesActivas,
      icon: MessageSquare,
      color: "bg-whatsapp-primary text-white",
      description: "Conversaciones en curso"
    },
    {
      title: "Atendidas por Agente",
      value: metrics.conversacionesAgente,
      icon: Bot,
      color: "bg-status-active text-white",
      description: "IA conversacional activa"
    },
    {
      title: "Intervenciones Humanas",
      value: metrics.intervenciouesHumanas,
      icon: User,
      color: "bg-status-human text-white",
      description: "Requieren atención manual"
    },
    {
      title: "Citas Agendadas",
      value: metrics.citasAgendadas,
      icon: Calendar,
      color: "bg-status-scheduled text-white",
      description: "Agendamientos completados"
    },
    {
      title: "Conversaciones Estancadas",
      value: metrics.conversacionesEstancadas,
      icon: AlertTriangle,
      color: "bg-status-stalled text-white",
      description: "Sin respuesta +30 min"
    }
  ];

  const timeMetrics = [
    {
      title: "Tiempo Promedio de Respuesta",
      value: formatTime(metrics.tiempoPromedioRespuesta),
      icon: Clock,
      description: "Respuesta del agente"
    },
    {
      title: "Tiempo Promedio hasta Agendamiento",
      value: formatTime(metrics.tiempoPromedioAgendamiento),
      icon: CalendarCheck,
      description: "Desde inicio hasta cita"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metricsData.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-card-custom">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  <metric.icon className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-foreground">
                {metric.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {timeMetrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-card-custom bg-gradient-card">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                  <metric.icon className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-primary">
                {metric.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Auto-refresh indicator */}
      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-status-active rounded-full animate-pulse"></div>
        <span>Actualización automática cada 30 segundos</span>
      </div>
    </div>
  );
};