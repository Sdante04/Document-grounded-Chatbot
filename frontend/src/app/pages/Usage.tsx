import { useState } from 'react';
import { DollarSign, Activity, MessageSquare, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const metrics = [
  { label: 'Tokens este mes', value: '487,234', icon: Activity, color: 'text-primary' },
  { label: 'Requests totales', value: '3,421', icon: MessageSquare, color: 'text-info' },
  { label: 'Costo estimado', value: '$24.36', icon: DollarSign, color: 'text-success' },
  { label: 'Promedio diario', value: '19,434', icon: Calendar, color: 'text-warning' },
];

const usageByKB = [
  { name: 'Soporte Técnico', tokens: 245000, requests: 1845 },
  { name: 'RRHH', tokens: 123000, requests: 892 },
  { name: 'Ventas', tokens: 119234, requests: 684 },
];

const usageByDay = [
  { date: 'Lun', tokens: 18000 },
  { date: 'Mar', tokens: 22000 },
  { date: 'Mié', tokens: 19500 },
  { date: 'Jue', tokens: 24000 },
  { date: 'Vie', tokens: 21000 },
];

const recentEvents = [
  {
    id: 'e1',
    type: 'chat' as const,
    user: 'Ana Rodríguez',
    kb: 'Soporte Técnico',
    tokens: 1250,
    timestamp: '2026-02-25 14:32',
  },
  {
    id: 'e2',
    type: 'indexing' as const,
    user: 'Sistema',
    kb: 'RRHH',
    tokens: 8500,
    timestamp: '2026-02-25 13:15',
  },
  {
    id: 'e3',
    type: 'chat' as const,
    user: 'Carlos Méndez',
    kb: 'Ventas',
    tokens: 980,
    timestamp: '2026-02-25 12:45',
  },
  {
    id: 'e4',
    type: 'chat' as const,
    user: 'María González',
    kb: 'Soporte Técnico',
    tokens: 1450,
    timestamp: '2026-02-25 11:20',
  },
];

const COLORS = ['var(--primary)', 'var(--info)', 'var(--success)'];

export default function Usage() {
  const [period, setPeriod] = useState('month');

  const getEventBadge = (type: string) => {
    const variants = {
      chat: { label: 'Chat', className: 'bg-primary text-primary-foreground' },
      indexing: { label: 'Indexación', className: 'bg-warning text-warning-foreground' },
      api: { label: 'API', className: 'bg-info text-info-foreground' },
    };
    const config = variants[type as keyof typeof variants];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Uso & Costos</h1>
          <p className="text-muted-foreground">
            Monitorea el consumo de recursos y estimaciones de costos
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="month">Este mes</SelectItem>
            <SelectItem value="quarter">Trimestre</SelectItem>
          </SelectContent>
        </Select>
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Usage by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Uso Diario (Tokens)</CardTitle>
            <CardDescription>Últimos 5 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageByDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="tokens" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Usage by KB */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Knowledge Base</CardTitle>
            <CardDescription>Tokens consumidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usageByKB}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="tokens"
                  >
                    {usageByKB.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas por Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Knowledge Base</TableHead>
                  <TableHead className="text-right">Tokens</TableHead>
                  <TableHead className="text-right">Requests</TableHead>
                  <TableHead className="text-right">Promedio/Request</TableHead>
                  <TableHead className="text-right">Costo Est.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageByKB.map((kb) => (
                  <TableRow key={kb.name}>
                    <TableCell className="font-medium">{kb.name}</TableCell>
                    <TableCell className="text-right">{kb.tokens.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{kb.requests.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {Math.round(kb.tokens / kb.requests).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ${((kb.tokens / 1000) * 0.05).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Knowledge Base</TableHead>
                  <TableHead className="text-right">Tokens</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{getEventBadge(event.type)}</TableCell>
                    <TableCell className="text-muted-foreground">{event.user}</TableCell>
                    <TableCell>{event.kb}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {event.tokens.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {event.timestamp}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
