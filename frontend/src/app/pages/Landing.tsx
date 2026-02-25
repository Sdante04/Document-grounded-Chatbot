import { Link } from 'react-router';
import { Bot, Upload, Database, MessageSquare, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: [
      '1 Knowledge Base',
      '10 documentos',
      '100 preguntas/mes',
      'Soporte por email',
    ],
  },
  {
    name: 'Pro',
    price: '$49',
    features: [
      '5 Knowledge Bases',
      '1,000 documentos',
      '10,000 preguntas/mes',
      'Soporte prioritario',
      'API access',
    ],
    popular: true,
  },
  {
    name: 'Team',
    price: '$149',
    features: [
      'Knowledge Bases ilimitadas',
      'Documentos ilimitados',
      '50,000 preguntas/mes',
      'Soporte 24/7',
      'API access',
      'Usuarios ilimitados',
    ],
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl">KnowledgeBot</span>
          </div>
          <Link to="/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Crea tu chatbot experto con tus documentos
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transforma tu conocimiento en un asistente inteligente. 
            Sube tus documentos, indexa el contenido y chatea con respuestas precisas citando fuentes.
          </p>
          <Link to="/login">
            <Button size="lg" className="text-lg px-8">
              Comenzar Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Cómo funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>1. Subir Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Carga tus PDFs, Word, Excel o texto plano. Soporta múltiples formatos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>2. Indexar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nuestro sistema procesa y organiza tu contenido con vectores semánticos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>3. Chatear con Citas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Haz preguntas y recibe respuestas precisas con referencias a documentos originales.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Planes y Precios
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.popular ? 'border-primary shadow-lg' : ''}>
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                    Más Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/login">
                    <Button 
                      className="w-full mt-6" 
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Comenzar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; 2026 KnowledgeBot. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
