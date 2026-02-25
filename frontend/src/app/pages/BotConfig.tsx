import { useState } from 'react';
import { Save, Bot } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';

export default function BotConfig() {
  const [config, setConfig] = useState({
    name: 'Asistente KnowledgeBot',
    avatar: '',
    language: 'es',
    tone: 'formal',
    detailLevel: 'medium',
    dontInvent: true,
    citeSource: true,
    indicateNoEvidence: true,
    responseFormat: 'markdown',
  });

  const handleSave = () => {
    toast.success('Configuración guardada correctamente');
    console.log('Config saved:', config);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Configuración del Bot</h1>
        <p className="text-muted-foreground">
          Personaliza el comportamiento y estilo de tu asistente
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Identidad del Bot</CardTitle>
              <CardDescription>
                Define el nombre y apariencia de tu asistente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Bot</Label>
                <Input
                  id="name"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  placeholder="Ej: Asistente de Soporte"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">URL del Avatar (opcional)</Label>
                <Input
                  id="avatar"
                  value={config.avatar}
                  onChange={(e) => setConfig({ ...config, avatar: e.target.value })}
                  placeholder="https://ejemplo.com/avatar.png"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estilo de Comunicación</CardTitle>
              <CardDescription>
                Ajusta cómo el bot se comunica con los usuarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select value={config.language} onValueChange={(value) => setConfig({ ...config, language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tono</Label>
                <Select value={config.tone} onValueChange={(value) => setConfig({ ...config, tone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Amigable</SelectItem>
                    <SelectItem value="technical">Técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail">Nivel de Detalle</Label>
                <Select value={config.detailLevel} onValueChange={(value) => setConfig({ ...config, detailLevel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concise">Conciso</SelectItem>
                    <SelectItem value="medium">Medio</SelectItem>
                    <SelectItem value="detailed">Detallado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reglas de Comportamiento</CardTitle>
              <CardDescription>
                Define restricciones y directrices para las respuestas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>No inventar información</Label>
                  <p className="text-sm text-muted-foreground">
                    Solo responder con información de los documentos
                  </p>
                </div>
                <Switch
                  checked={config.dontInvent}
                  onCheckedChange={(checked) => setConfig({ ...config, dontInvent: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Citar fuentes</Label>
                  <p className="text-sm text-muted-foreground">
                    Incluir referencias a documentos en las respuestas
                  </p>
                </div>
                <Switch
                  checked={config.citeSource}
                  onCheckedChange={(checked) => setConfig({ ...config, citeSource: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Indicar falta de evidencia</Label>
                  <p className="text-sm text-muted-foreground">
                    Avisar cuando no hay información relevante
                  </p>
                </div>
                <Switch
                  checked={config.indicateNoEvidence}
                  onCheckedChange={(checked) => setConfig({ ...config, indicateNoEvidence: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formato de Respuesta</CardTitle>
              <CardDescription>
                Selecciona cómo se presentan las respuestas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="format">Formato</Label>
                <Select value={config.responseFormat} onValueChange={(value) => setConfig({ ...config, responseFormat: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="markdown">Markdown con formato</SelectItem>
                    <SelectItem value="bullets">Lista de puntos</SelectItem>
                    <SelectItem value="plain">Texto plano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Guardar Configuración
          </Button>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Vista previa de tu asistente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  {config.avatar ? (
                    <img src={config.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <Bot className="w-6 h-6 text-primary-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">{config.name}</p>
                  <div className="bg-muted rounded-lg p-3 text-sm">
                    {config.tone === 'formal' && (
                      <p>Buenos días. Basándome en los documentos disponibles, puedo ayudarle con su consulta.</p>
                    )}
                    {config.tone === 'friendly' && (
                      <p>¡Hola! 👋 Estoy aquí para ayudarte. Déjame revisar lo que tenemos en nuestros documentos.</p>
                    )}
                    {config.tone === 'technical' && (
                      <p>Sistema inicializado. Procesando query contra knowledge base. Respuesta basada en documentación técnica.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Idioma: {config.language.toUpperCase()}</p>
                <p>• Tono: {config.tone}</p>
                <p>• Detalle: {config.detailLevel}</p>
                <p>• Cita fuentes: {config.citeSource ? 'Sí' : 'No'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
