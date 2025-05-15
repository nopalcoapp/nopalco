
    import React from 'react';
    import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog.jsx";
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from "@/components/ui/input.jsx";
    import { Label } from "@/components/ui/label.jsx";
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
    import { FileImage as ImageIcon } from 'lucide-react';

    const EditEstablishmentModal = ({ isOpen, setIsOpen, currentEstablishment, setCurrentEstablishment, onSave, onImageUpload }) => {
      if (!currentEstablishment) return null;

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle className="text-brand-contractor">{currentEstablishment.id.startsWith('est-') ? 'Adicionar Novo' : 'Editar'} Estabelecimento</DialogTitle>
              <DialogDescription>Atualize os dados do seu local.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="est-name">Nome do Estabelecimento</Label>
                <Input id="est-name" value={currentEstablishment.name} onChange={(e) => setCurrentEstablishment(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="est-address">Endereço</Label>
                <Input id="est-address" value={currentEstablishment.address} onChange={(e) => setCurrentEstablishment(prev => ({ ...prev, address: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="est-logo">Logo do Estabelecimento</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Avatar className="h-16 w-16 rounded-md border">
                    <AvatarImage src={currentEstablishment.logoUrl} alt="Logo" className="object-contain" />
                    <AvatarFallback className="rounded-md bg-muted"><ImageIcon /></AvatarFallback>
                  </Avatar>
                  <Input id="est-logo" type="file" accept="image/*" onChange={(e) => onImageUpload(e, 'establishmentLogo')} className="text-xs" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">URL atual (simulado): {currentEstablishment.logoUrl ? currentEstablishment.logoUrl.substring(0, 30) : 'Nenhuma logo'}...</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={onSave} className="bg-brand-contractor hover:bg-brand-contractor/90 text-brand-contractor-foreground">Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default EditEstablishmentModal;
  