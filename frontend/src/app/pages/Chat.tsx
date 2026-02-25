import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
}

interface Source {
  id: string;
  document: string;
  section: string;
  snippet: string;
  page?: number;
}

const mockConversations = [
  { id: 'c1', title: 'Configuración inicial', date: '2026-02-25' },
  { id: 'c2', title: 'Políticas de vacaciones', date: '2026-02-24' },
  { id: 'c3', title: 'Proceso de onboarding', date: '2026-02-23' },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de Knowledge Base. Puedo responder preguntas basándome en tus documentos. ¿En qué puedo ayudarte?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const mockSources: Source[] = [
        {
          id: 's1',
          document: 'Manual de Usuario v2.3.pdf',
          section: 'Configuración Inicial',
          snippet: 'Para configurar el sistema, accede al panel de administración y completa los campos requeridos...',
          page: 15,
        },
        {
          id: 's2',
          document: 'Políticas_RRHH_2026.docx',
          section: 'Vacaciones',
          snippet: 'Los empleados tienen derecho a 22 días hábiles de vacaciones anuales...',
          page: 8,
        },
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Basándome en los documentos disponibles, puedo ayudarte con eso.\n\n**Configuración Inicial:**\n\nPara comenzar, debes acceder al panel de administración y completar los campos requeridos. El proceso incluye:\n\n1. Verificar credenciales\n2. Configurar parámetros básicos\n3. Realizar pruebas de conexión\n\n**Vacaciones:**\n\nSegún nuestras políticas de RRHH, los empleados tienen derecho a 22 días hábiles de vacaciones anuales.\n\n¿Necesitas más detalles sobre algún punto específico?`,
        sources: mockSources,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Conversations History (Optional Left Panel) */}
      <Card className="w-64 flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-base">Conversaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-2">
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <p className="text-sm font-medium truncate">{conv.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(conv.date).toLocaleDateString('es-ES')}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Asistente KnowledgeBot</CardTitle>
                <p className="text-xs text-muted-foreground">Conectado a: Soporte Técnico</p>
              </div>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 max-w-3xl">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className={`flex-1 ${message.role === 'user' ? 'max-w-md' : ''}`}>
                    <div
                      className={`rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                placeholder="Escribe tu pregunta..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[60px] max-h-[200px] resize-none"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSend} 
                size="icon" 
                className="h-[60px] w-[60px]"
                disabled={!input.trim() || isTyping}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Sources Panel (Right) */}
      <Card className="w-80 flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-base">Fuentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            {messages
              .filter(m => m.role === 'assistant' && m.sources)
              .slice(-1)
              .map((message) => (
                <div key={message.id} className="space-y-3">
                  {message.sources?.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => setSelectedSource(source)}
                      className="w-full text-left p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{source.document}</p>
                          <p className="text-xs text-muted-foreground">{source.section}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {source.snippet}
                      </p>
                      {source.page && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Pág. {source.page}
                        </Badge>
                      )}
                    </button>
                  ))}
                  {(!message.sources || message.sources.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No hay fuentes disponibles para esta respuesta
                    </p>
                  )}
                </div>
              ))}
            {messages.filter(m => m.role === 'assistant').length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Las fuentes aparecerán aquí cuando recibas respuestas
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
