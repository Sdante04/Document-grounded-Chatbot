import { Plus, Upload, MessageSquare, FileText, Database as DatabaseIcon, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const metrics = [
  { label: 'Documentos Totales', value: '1,247', icon: FileText, color: 'text-primary' },
  { label: 'Listos', value: '1,189', icon: DatabaseIcon, color: 'text-success' },
  { label: 'Indexando', value: '12', icon: Clock, color: 'text-warning' },
  { label: 'Sesiones Hoy', value: '342', icon: MessageSquare, color: 'text-info' },
];

const usageData = [
  { date: '18 Feb', tokens: 12000 },
  { date: '19 Feb', tokens: 15000 },
  { date: '20 Feb', tokens: 13500 },
  { date: '21 Feb', tokens: 18000 },
  { date: '22 Feb', tokens: 16500 },
  { date: '23 Feb', tokens: 21000 },
  { date: '24 Feb', tokens: 19000 },
];

const recentActivity = [
  { id: 1, user: 'Ana Rodríguez', action: 'Subió 3 documentos', kb: 'Soporte Técnico', time: 'Hace 5 min' },
  { id: 2, user: 'Carlos Méndez', action: 'Creó sesión de chat', kb: 'Ventas', time: 'Hace 12 min' },
  { id: 3, user: 'Laura Torres', action: 'Actualizó configuración', kb: 'RRHH', time: 'Hace 1 hora' },
  { id: 4, user: 'Sistema', action: 'Indexación completada', kb: 'Soporte Técnico', time: 'Hace 2 horas' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen de actividad y métricas clave
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Crear KB
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Subir Documento
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.label}
                </CardTitle>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Uso de Tokens (Últimos 7 días)</CardTitle>
          <CardDescription>
            Tokens consumidos por solicitudes al modelo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px' 
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--primary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between border-b border-border last:border-0 pb-4 last:pb-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    {activity.kb}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <DatabaseIcon className="w-6 h-6" />
              <span>Crear Knowledge Base</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <Upload className="w-6 h-6" />
              <span>Subir Documento</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <MessageSquare className="w-6 h-6" />
              <span>Abrir Chat</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
