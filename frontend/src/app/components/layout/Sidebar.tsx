import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Database, 
  FileText, 
  Bot, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { cn } from '../ui/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Bases de Conocimiento', href: '/app/knowledge-bases', icon: Database },
  { label: 'Documentos', href: '/app/documents', icon: FileText },
  { label: 'Configuración del Bot', href: '/app/bot-config', icon: Bot },
  { label: 'Chat', href: '/app/chat', icon: MessageSquare },
  { label: 'Usuarios y Roles', href: '/app/users', icon: Users },
  { label: 'Uso & Costos', href: '/app/usage', icon: BarChart3 },
  { label: 'Ajustes', href: '/app/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-sidebar-foreground">KnowledgeBot</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
