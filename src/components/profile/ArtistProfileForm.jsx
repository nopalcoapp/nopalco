
    import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Textarea } from '@/components/ui/textarea.jsx';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { UploadCloud, Image as ImageIcon, Video, Music2, Trash2 } from 'lucide-react';

    const ArtistProfileForm = ({ initialData, onSave }) => {
      const [formData, setFormData] = useState({
        name: '',
        genre: '',
        bio: '',
        profileImageUrl: '',
        bannerImageUrl: '',
        socialLinks: { instagram: '', youtube: '', spotify: '' },
        videos: [], 
        photos: [], 
        baseValue: 0,
        location: '',
        contactEmail: '',
        contactPhone: '',
        ...initialData,
      });
      const { toast } = useToast();

      useEffect(() => {
        setFormData(prev => ({ ...prev, ...initialData }));
      }, [initialData]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
          const [parent, child] = name.split('.');
          setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [child]: value }
          }));
        } else {
          setFormData(prev => ({ ...prev, [name]: value }));
        }
      };
      
      const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (field === 'profileImageUrl' || field === 'bannerImageUrl') {
              setFormData(prev => ({ ...prev, [field]: reader.result }));
            } else if (field === 'photos') {
              setFormData(prev => ({ ...prev, photos: [...prev.photos, {id: Date.now(), url: reader.result, caption: ''}] }));
            }
          };
          reader.readAsDataURL(file);
        }
      };

      const handleVideoUrlChange = (e, index) => {
        const { value } = e.target;
        setFormData(prev => {
            const newVideos = [...prev.videos];
            newVideos[index] = {...newVideos[index], url: value};
            return {...prev, videos: newVideos};
        });
      };
      
      const addVideoField = () => {
        setFormData(prev => ({...prev, videos: [...prev.videos, {id: Date.now(), url: '', title: ''}]}));
      };
      
      const removeVideoField = (id) => {
        setFormData(prev => ({...prev, videos: prev.videos.filter(v => v.id !== id)}));
      };

      const removePhoto = (id) => {
        setFormData(prev => ({...prev, photos: prev.photos.filter(p => p.id !== id)}));
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
              <CardTitle className="text-brand-artist">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Artístico / Banda</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Seu nome artístico" />
              </div>
              <div>
                <Label htmlFor="genre">Gênero Musical Principal</Label>
                <Input id="genre" name="genre" value={formData.genre} onChange={handleChange} placeholder="Ex: MPB, Rock, Jazz" />
              </div>
              <div>
                <Label htmlFor="location">Localização (Cidade/Estado)</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Ex: São Paulo/SP" />
              </div>
              <div>
                <Label htmlFor="baseValue">Valor Base por Show (R$)</Label>
                <Input id="baseValue" name="baseValue" type="number" value={formData.baseValue} onChange={handleChange} placeholder="Ex: 400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-brand-artist">Sobre Você</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="bio">Biografia Curta</Label>
                <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Conte um pouco sobre sua música, trajetória e o que te inspira." rows={4} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-brand-artist">Mídia</CardTitle>
              <CardDescription>Adicione fotos e vídeos para mostrar seu trabalho.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profileImageUrl" className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-brand-artist">
                  <UploadCloud size={18} /> Foto de Perfil (URL ou Upload)
                </Label>
                <Input id="profileImageUrl" name="profileImageUrl" value={formData.profileImageUrl} onChange={handleChange} placeholder="https://exemplo.com/sua-foto.jpg" className="mb-2" />
                <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profileImageUrl')} className="text-xs" />
                {formData.profileImageUrl && <img-replace src={formData.profileImageUrl} alt="Preview Foto Perfil" class="mt-2 rounded-md max-h-32 object-contain" />}
              </div>
              <div>
                <Label htmlFor="bannerImageUrl" className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-brand-artist">
                  <UploadCloud size={18} /> Foto de Capa (URL ou Upload)
                </Label>
                <Input id="bannerImageUrl" name="bannerImageUrl" value={formData.bannerImageUrl} onChange={handleChange} placeholder="https://exemplo.com/sua-capa.jpg" className="mb-2" />
                <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'bannerImageUrl')} className="text-xs" />
                {formData.bannerImageUrl && <img-replace src={formData.bannerImageUrl} alt="Preview Foto Capa" class="mt-2 rounded-md max-h-40 object-cover w-full" />}
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><ImageIcon size={18} /> Galeria de Fotos</Label>
                <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photos')} className="text-xs mb-2" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {formData.photos?.map((photo) => (
                        <div key={photo.id} className="relative group">
                            <img-replace src={photo.url} alt={`Foto ${photo.id}`} class="rounded-md aspect-square object-cover" />
                            <Button variant="destructive" size="icon" onClick={() => removePhoto(photo.id)} className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={14}/>
                            </Button>
                        </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Video size={18} /> Vídeos (Links do YouTube)</Label>
                {formData.videos?.map((video, index) => (
                  <div key={video.id || index} className="flex items-center gap-2">
                    <Input 
                        type="url" 
                        value={video.url} 
                        onChange={(e) => handleVideoUrlChange(e, index)} 
                        placeholder="https://youtube.com/watch?v=seuVideoID" 
                        className="flex-grow"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeVideoField(video.id)}><Trash2 size={16} className="text-destructive"/></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addVideoField} className="text-xs">Adicionar Vídeo</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-brand-artist">Redes Sociais e Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="socialLinks.instagram">Instagram URL</Label>
                <Input id="socialLinks.instagram" name="socialLinks.instagram" value={formData.socialLinks.instagram} onChange={handleChange} placeholder="https://instagram.com/seuusuario" />
              </div>
              <div>
                <Label htmlFor="socialLinks.youtube">YouTube Canal URL</Label>
                <Input id="socialLinks.youtube" name="socialLinks.youtube" value={formData.socialLinks.youtube} onChange={handleChange} placeholder="https://youtube.com/c/seucanal" />
              </div>
              <div>
                <Label htmlFor="socialLinks.spotify">Spotify Artista URL</Label>
                <Input id="socialLinks.spotify" name="socialLinks.spotify" value={formData.socialLinks.spotify} onChange={handleChange} placeholder="https://open.spotify.com/artist/seuartistid" />
              </div>
              <div>
                <Label htmlFor="contactEmail">E-mail de Contato</Label>
                <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} placeholder="contato@suabanda.com" />
              </div>
              <div>
                <Label htmlFor="contactPhone">Telefone de Contato (Opcional)</Label>
                <Input id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="(XX) XXXXX-XXXX" />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full bg-brand-artist hover:bg-brand-artist/90 text-brand-artist-foreground">Salvar Alterações</Button>
        </form>
      );
    };

    export default ArtistProfileForm;
  