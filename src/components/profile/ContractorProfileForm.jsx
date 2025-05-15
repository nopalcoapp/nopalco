
    import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Textarea } from '@/components/ui/textarea.jsx';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { UploadCloud, Building, Trash2 } from 'lucide-react';

    const ContractorProfileForm = ({ initialData, onSave }) => {
      const [formData, setFormData] = useState({
        name: '', // Nome do contratante (pessoa)
        establishments: [{ id: Date.now(), name: '', address: '', description: '', logoUrl: '', bannerImageUrl: '' }],
        contactEmail: '',
        contactPhone: '',
        ...initialData,
      });
      const { toast } = useToast();

      useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ 
                ...prev, 
                ...initialData,
                establishments: initialData.establishments && initialData.establishments.length > 0 ? initialData.establishments : [{ id: Date.now(), name: '', address: '', description: '', logoUrl: '', bannerImageUrl: '' }]
            }));
        }
      }, [initialData]);

      const handleMainChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleEstablishmentChange = (index, e) => {
        const { name, value } = e.target;
        const newEstablishments = [...formData.establishments];
        newEstablishments[index] = { ...newEstablishments[index], [name]: value };
        setFormData(prev => ({ ...prev, establishments: newEstablishments }));
      };
      
      const handleEstablishmentFileChange = (index, e, field) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const newEstablishments = [...formData.establishments];
            newEstablishments[index] = { ...newEstablishments[index], [field]: reader.result };
            setFormData(prev => ({ ...prev, establishments: newEstablishments }));
          };
          reader.readAsDataURL(file);
        }
      };

      const addEstablishment = () => {
        setFormData(prev => ({
          ...prev,
          establishments: [...prev.establishments, { id: Date.now(), name: '', address: '', description: '', logoUrl: '', bannerImageUrl: '' }]
        }));
      };
      
      const removeEstablishment = (id) => {
        setFormData(prev => ({
          ...prev,
          establishments: prev.establishments.filter(est => est.id !== id)
        }));
      };


      const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        toast({ title: "Perfil Atualizado!", description: "Suas informações foram salvas com sucesso." });
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-brand-contractor">Informações do Contratante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Seu Nome Completo</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleMainChange} placeholder="Nome do responsável" />
              </div>
              <div>
                <Label htmlFor="contactEmail">E-mail Principal de Contato</Label>
                <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleMainChange} placeholder="seuemail@exemplo.com" />
              </div>
              <div>
                <Label htmlFor="contactPhone">Telefone Principal de Contato (Opcional)</Label>
                <Input id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleMainChange} placeholder="(XX) XXXXX-XXXX" />
              </div>
            </CardContent>
          </Card>

          {formData.establishments.map((est, index) => (
            <Card key={est.id}>
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle className="text-brand-contractor flex items-center"><Building size={20} className="mr-2"/>Estabelecimento {index + 1}</CardTitle>
                    <CardDescription>Detalhes do local que contrata shows.</CardDescription>
                </div>
                {formData.establishments.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeEstablishment(est.id)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 size={18}/>
                    </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`estName-${index}`}>Nome do Estabelecimento</Label>
                  <Input id={`estName-${index}`} name="name" value={est.name} onChange={(e) => handleEstablishmentChange(index, e)} placeholder="Ex: Bar Central, Restaurante Vista Linda" />
                </div>
                <div>
                  <Label htmlFor={`estAddress-${index}`}>Endereço Completo</Label>
                  <Input id={`estAddress-${index}`} name="address" value={est.address} onChange={(e) => handleEstablishmentChange(index, e)} placeholder="Rua, Número, Bairro, Cidade - Estado" />
                </div>
                <div>
                  <Label htmlFor={`estDescription-${index}`}>Descrição Curta do Local</Label>
                  <Textarea id={`estDescription-${index}`} name="description" value={est.description} onChange={(e) => handleEstablishmentChange(index, e)} placeholder="Tipo de ambiente, público, especialidades da casa." rows={3} />
                </div>
                <div>
                    <Label htmlFor={`estLogoUrl-${index}`} className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-brand-contractor">
                    <UploadCloud size={18} /> Logo do Estabelecimento (URL ou Upload)
                    </Label>
                    <Input id={`estLogoUrl-${index}`} name="logoUrl" value={est.logoUrl} onChange={(e) => handleEstablishmentChange(index, e)} placeholder="https://exemplo.com/logo.png" className="mb-2" />
                    <Input type="file" accept="image/*" onChange={(e) => handleEstablishmentFileChange(index, e, 'logoUrl')} className="text-xs" />
                    {est.logoUrl && <img-replace src={est.logoUrl} alt={`Preview Logo ${est.name}`} class="mt-2 rounded-md max-h-24 object-contain bg-muted p-1" />}
                </div>
                <div>
                    <Label htmlFor={`estBannerImageUrl-${index}`} className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-brand-contractor">
                    <UploadCloud size={18} /> Foto de Capa do Estabelecimento (URL ou Upload)
                    </Label>
                    <Input id={`estBannerImageUrl-${index}`} name="bannerImageUrl" value={est.bannerImageUrl} onChange={(e) => handleEstablishmentChange(index, e)} placeholder="https://exemplo.com/capa-local.jpg" className="mb-2" />
                    <Input type="file" accept="image/*" onChange={(e) => handleEstablishmentFileChange(index, e, 'bannerImageUrl')} className="text-xs" />
                    {est.bannerImageUrl && <img-replace src={est.bannerImageUrl} alt={`Preview Capa ${est.name}`} class="mt-2 rounded-md max-h-40 object-cover w-full" />}
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button type="button" variant="outline" onClick={addEstablishment} className="w-full">Adicionar Outro Estabelecimento</Button>

          <Button type="submit" className="w-full bg-brand-contractor hover:bg-brand-contractor/90 text-brand-contractor-foreground">Salvar Alterações</Button>
        </form>
      );
    };

    export default ContractorProfileForm;
  