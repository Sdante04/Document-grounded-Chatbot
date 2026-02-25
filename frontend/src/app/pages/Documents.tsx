import { useState } from 'react';
import { Upload, FileText, Search, MoreVertical, Download, Trash2, AlertCircle } from 'lucide-react';
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
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';

const mockDocuments = [
  {
    id: 'd1',
    name: 'Manual de Usuario v2.3.pdf',
    type: 'PDF',
    kb: 'Soporte Técnico',
    uploadedBy: 'María González',
    date: '2026-02-24',
    size: '2.4 MB',
    status: 'ready' as const,
  },
  {
    id: 'd2',
    name: 'Políticas_RRHH_2026.docx',
    type: 'DOCX',
    kb: 'Recursos Humanos',
    uploadedBy: 'Carlos Méndez',
    date: '2026-02-23',
    size: '856 KB',
    status: 'indexing' as const,
  },
  {
    id: 'd3',
    name: 'catalogo_productos.xlsx',
    type: 'XLSX',
    kb: 'Ventas',
    uploadedBy: 'Ana Rodríguez',
    date: '2026-02-22',
    size: '1.2 MB',
    status: 'ready' as const,
  },
  {
    id: 'd4',
    name: 'FAQ_clientes.txt',
    type: 'TXT',
    kb: 'Soporte Técnico',
    uploadedBy: 'Laura Torres',
    date: '2026-02-20',
    size: '45 KB',
    status: 'failed' as const,
  },
];

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUpload(e.target.files);
    }
  };

  const handleUpload = (files: FileList) => {
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            setUploadProgress(0);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ready: { label: 'Listo', className: 'bg-success text-success-foreground' },
      indexing: { label: 'Indexando', className: 'bg-warning text-warning-foreground' },
      uploaded: { label: 'Subido', className: 'bg-info text-info-foreground' },
      failed: { label: 'Fallido', className: 'bg-destructive text-destructive-foreground' },
    };
    const config = variants[status as keyof typeof variants] || variants.ready;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documentos</h1>
          <p className="text-muted-foreground">
            Gestiona y monitorea tus documentos indexados
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              Arrastra archivos aquí o haz click para seleccionar
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Soporta PDF, DOCX, XLSX, TXT (máx. 10MB)
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              accept=".pdf,.docx,.xlsx,.txt"
            />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>Seleccionar Archivos</span>
              </Button>
            </label>
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Subiendo archivos...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
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
              <TableHead>Tipo</TableHead>
              <TableHead>Knowledge Base</TableHead>
              <TableHead>Subido por</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    {doc.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.type}</Badge>
                </TableCell>
                <TableCell>{doc.kb}</TableCell>
                <TableCell className="text-muted-foreground">{doc.uploadedBy}</TableCell>
                <TableCell>{new Date(doc.date).toLocaleDateString('es-ES')}</TableCell>
                <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                <TableCell className="text-center">{getStatusBadge(doc.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </DropdownMenuItem>
                      {doc.status === 'failed' && (
                        <DropdownMenuItem>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Ver Error
                        </DropdownMenuItem>
                      )}
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
