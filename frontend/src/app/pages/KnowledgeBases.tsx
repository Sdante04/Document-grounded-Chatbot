import { useState } from 'react';
import { Plus, Search, MoreVertical, Pencil, Trash2, ExternalLink } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const mockKBs = [
  {
    id: 'kb1',
    name: 'Soporte Técnico',
    description: 'Base de conocimiento para atención al cliente',
    documents: 245,
    status: 'active' as const,
    updatedAt: '2026-02-24',
    language: 'es',
  },
  {
    id: 'kb2',
    name: 'Recursos Humanos',
    description: 'Políticas y procedimientos de RRHH',
    documents: 89,
    status: 'active' as const,
    updatedAt: '2026-02-23',
    language: 'es',
  },
  {
    id: 'kb3',
    name: 'Ventas',
    description: 'Material de producto y argumentario comercial',
    documents: 156,
    status: 'indexing' as const,
    updatedAt: '2026-02-25',
    language: 'es',
  },
];

export default function KnowledgeBases() {
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: 'es',
    visibility: 'admin',
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, label: 'Activa', className: 'bg-success text-success-foreground' },
      indexing: { variant: 'secondary' as const, label: 'Indexando', className: 'bg-warning text-warning-foreground' },
      error: { variant: 'destructive' as const, label: 'Error', className: '' },
    };
    const config = variants[status as keyof typeof variants] || variants.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleCreate = () => {
    console.log('Creating KB:', formData);
    setOpen(false);
    setFormData({ name: '', description: '', language: 'es', visibility: 'admin' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bases de Conocimiento</h1>
          <p className="text-muted-foreground">
            Gestiona tus repositorios de documentos
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear Knowledge Base
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Knowledge Base</DialogTitle>
              <DialogDescription>
                Crea un nuevo repositorio para organizar tus documentos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Ej: Soporte Técnico"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el propósito de esta base de conocimiento"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Idioma por defecto</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
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
                <Label htmlFor="visibility">Visibilidad por rol</Label>
                <Select value={formData.visibility} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Solo Administradores</SelectItem>
                    <SelectItem value="editor">Admin + Editores</SelectItem>
                    <SelectItem value="all">Todos los usuarios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>
                Crear
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
            placeholder="Buscar knowledge bases..."
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
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-center">Documentos</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead>Última actualización</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockKBs.map((kb) => (
              <TableRow key={kb.id}>
                <TableCell className="font-medium">{kb.name}</TableCell>
                <TableCell className="text-muted-foreground">{kb.description}</TableCell>
                <TableCell className="text-center">{kb.documents}</TableCell>
                <TableCell className="text-center">{getStatusBadge(kb.status)}</TableCell>
                <TableCell>{new Date(kb.updatedAt).toLocaleDateString('es-ES')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Detalle
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
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
    </div>
  );
}
