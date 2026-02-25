import { useState } from 'react';
import { Plus, Search, MoreVertical, Mail, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

const mockUsers = [
  {
    id: 'u1',
    name: 'María González',
    email: 'maria@empresa.com',
    role: 'admin' as const,
    kbs: ['Soporte Técnico', 'RRHH', 'Ventas'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
  },
  {
    id: 'u2',
    name: 'Carlos Méndez',
    email: 'carlos@empresa.com',
    role: 'editor' as const,
    kbs: ['Soporte Técnico', 'Ventas'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  },
  {
    id: 'u3',
    name: 'Ana Rodríguez',
    email: 'ana@empresa.com',
    role: 'user' as const,
    kbs: ['Soporte Técnico'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
  },
];

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'user',
  });

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: { label: 'Admin', className: 'bg-primary text-primary-foreground' },
      editor: { label: 'Editor', className: 'bg-info text-info-foreground' },
      user: { label: 'Usuario', className: 'bg-secondary text-secondary-foreground' },
    };
    const config = variants[role as keyof typeof variants];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleInvite = () => {
    console.log('Inviting user:', formData);
    setOpen(false);
    setFormData({ email: '', role: 'user' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios y Roles</h1>
          <p className="text-muted-foreground">
            Gestiona el acceso y permisos de tu equipo
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Invitar Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invitar Usuario</DialogTitle>
              <DialogDescription>
                Envía una invitación por email a un nuevo miembro del equipo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="user">Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleInvite}>
                <Mail className="w-4 h-4 mr-2" />
                Enviar Invitación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Knowledge Bases Habilitadas</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.kbs.map((kb, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {kb}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar Permisos</DropdownMenuItem>
                      <DropdownMenuItem>Cambiar Rol</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Role Descriptions */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-lg p-4">
          <Badge className="bg-primary text-primary-foreground mb-2">Admin</Badge>
          <h3 className="font-medium mb-2">Administrador</h3>
          <p className="text-sm text-muted-foreground">
            Acceso completo. Puede gestionar usuarios, configuración y todos los knowledge bases.
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <Badge className="bg-info text-info-foreground mb-2">Editor</Badge>
          <h3 className="font-medium mb-2">Editor</h3>
          <p className="text-sm text-muted-foreground">
            Puede subir y editar documentos, configurar bots, pero no gestionar usuarios.
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <Badge className="bg-secondary text-secondary-foreground mb-2">Usuario</Badge>
          <h3 className="font-medium mb-2">Usuario Final</h3>
          <p className="text-sm text-muted-foreground">
            Solo puede chatear con el asistente. Sin acceso a configuración ni documentos.
          </p>
        </div>
      </div>
    </div>
  );
}
