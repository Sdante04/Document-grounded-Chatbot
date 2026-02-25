import { Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

export default function Settings() {
  const handleSave = () => {
    toast.success('Ajustes guardados correctamente');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Ajustes</h1>
        <p className="text-muted-foreground">
          Configuración general de la aplicación
        </p>
      </div>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Organización</CardTitle>
          <CardDescription>
            Información básica de tu organización
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Nombre de la Organización</Label>
            <Input id="org-name" defaultValue="Acme Corp" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-domain">Dominio</Label>
            <Input id="org-domain" defaultValue="acme.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan">Plan Actual</Label>
            <Select defaultValue="pro">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de API</CardTitle>
          <CardDescription>
            Conecta tu cuenta de OpenAI para procesamiento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              defaultValue="sk-proj-xxxxxxxxxxxxx"
            />
            <p className="text-xs text-muted-foreground">
              Tu API key se almacena de forma segura y solo se usa para procesar documentos
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Modelo por Defecto</Label>
            <Select defaultValue="gpt-4-turbo">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>
            Gestiona cómo y cuándo recibes notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificaciones por Email</Label>
              <p className="text-sm text-muted-foreground">
                Recibe actualizaciones importantes por correo
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alertas de Indexación</Label>
              <p className="text-sm text-muted-foreground">
                Notificar cuando la indexación termine o falle
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reporte Semanal de Uso</Label>
              <p className="text-sm text-muted-foreground">
                Resumen de tokens y costos cada semana
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
          <CardDescription>
            Opciones de seguridad y privacidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Autenticación de Dos Factores</Label>
              <p className="text-sm text-muted-foreground">
                Añade una capa extra de seguridad
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sesiones Concurrentes</Label>
              <p className="text-sm text-muted-foreground">
                Permite múltiples sesiones simultáneas
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="session-timeout">Tiempo de Inactividad (minutos)</Label>
            <Select defaultValue="60">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Datos & Privacidad</CardTitle>
          <CardDescription>
            Gestión de datos y opciones de retención
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="retention">Retención de Datos de Chat</Label>
            <Select defaultValue="90">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 días</SelectItem>
                <SelectItem value="90">90 días</SelectItem>
                <SelectItem value="180">180 días</SelectItem>
                <SelectItem value="365">1 año</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compartir Datos para Mejoras</Label>
              <p className="text-sm text-muted-foreground">
                Ayúdanos a mejorar con datos anónimos de uso
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        <Save className="w-4 h-4 mr-2" />
        Guardar Cambios
      </Button>
    </div>
  );
}
