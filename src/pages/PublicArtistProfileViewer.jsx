
    import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Mail, Music, Star, CalendarDays, MapPin, Youtube, PlayCircle, Edit, ChevronLeft, ChevronRight, Image as ImageIcon, Video } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import { Textarea } from '@/components/ui/textarea.jsx';
    import { Input } from '@/components/ui/input.jsx';

    const mockArtistData = {
      name: 'Artista Teste NoPalco',
      genre: 'Pop Rock Acústico',
      email: 'artista@email.com',
      bio: 'Músico versátil com anos de experiência em palcos de todos os tamanhos. Repertório variado que agrada a todos os públicos, com foco em pop rock nacional e internacional, além de releituras acústicas de grandes sucessos. Energia contagiante e profissionalismo garantido para seu evento.',
      rating: 4.7,
      profileImageQuery: 'musician with guitar on stage',
      coverImageQuery: 'concert stage with lights',
      photos: [
        { id: 'photo1', query: 'musician playing guitar close up', caption: 'Show no Bar Central' },
        { id: 'photo2', query: 'artist singing on stage with band', caption: 'Festival da Cidade' },
        { id: 'photo3', query: 'acoustic performance in a cafe', caption: 'Pocket show intimista' },
      ],
      videos: [
        { id: 'video1', title: "Performance Ao Vivo - Pop Rock Hits", url: "https://www.youtube.com/embed/HEXWRTEbj1I", thumbnailQuery: "live band performance energetic" },
        { id: 'video2', title: "Medley Acústico - Clássicos MPB", url: "https://www.youtube.com/embed/HEXWRTEbj1I", thumbnailQuery: "acoustic guitar player singing softly" },
      ],
      upcomingShows: [
        { venue: 'Restaurante Sabor & Arte', date: '2025-06-05', time: '20:30' },
        { venue: 'Pub Estação Rock', date: '2025-06-12', time: '22:00' },
      ],
      moreDetails: "Equipamento de som próprio para eventos de pequeno e médio porte. Flexibilidade para adaptação de repertório. Disponível para viagens."
    };

    const Carousel = ({ items, type }) => {
      const [currentIndex, setCurrentIndex] = useState(0);
      const hasItems = items && items.length > 0;

      const nextSlide = () => {
        if (hasItems) setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
      };
      const prevSlide = () => {
        if (hasItems) setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
      };

      if (!hasItems) {
        return <p className="text-muted-foreground text-sm">Nenhum {type === 'photos' ? 'foto' : 'vídeo'} adicionado.</p>;
      }

      return (
        <div className="relative w-full">
          <AnimatePresence initial={false} custom={currentIndex}>
            <motion.div
              key={currentIndex}
              custom={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              {type === 'photos' && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                  <img  class="w-full h-full object-cover" alt={items[currentIndex].caption} src="https://images.unsplash.com/photo-1620886434979-5cc4ddc31858" />
                  <p className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-white text-xs truncate">{items[currentIndex].caption}</p>
                </div>
              )}
              {type === 'videos' && (
                 <a href={items[currentIndex].url} target="_blank" rel="noopener noreferrer" className="block group">
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-md bg-muted">
                        <img  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={items[currentIndex].title} src="https://images.unsplash.com/photo-1690721606848-ac5bdcde45ea" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <PlayCircle className="h-16 w-16 text-white/80" />
                        </div>
                        <p className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-white text-xs truncate">{items[currentIndex].title}</p>
                    </div>
                </a>
              )}
            </motion.div>
          </AnimatePresence>
          {items.length > 1 && (
            <>
              <Button onClick={prevSlide} variant="outline" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 border-none text-white">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button onClick={nextSlide} variant="outline" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 border-none text-white">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      );
    };
    
    const PublicArtistProfileViewer = () => {
      const [user, setUser] = useLocalStorage('no-palco-user', null);
      const [artistData, setArtistData] = useLocalStorage(`no-palco-artist-profile-${user?.id}`, mockArtistData);
      const [isEditing, setIsEditing] = useState(false);
      const [editData, setEditData] = useState(artistData);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
      };
      
      const handleSave = () => {
        setArtistData(editData);
        setIsEditing(false);
      };


      if (!artistData) {
        return <div className="text-center py-10 text-muted-foreground">Perfil do artista não encontrado.</div>;
      }
      
      const currentDisplayData = isEditing ? editData : artistData;


      return (
        <motion.div 
          className="space-y-6 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="relative h-56 md:h-72 group">
            <img  class="w-full h-full object-cover rounded-b-xl shadow-lg" alt={currentDisplayData.name + " cover image"} src="https://images.unsplash.com/photo-1697256200022-f61abccad430" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-xl"></div>
            <div className="absolute bottom-0 left-0 p-4 md:p-6 flex items-end space-x-4">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-brand-artist shadow-xl bg-muted">
                 <img  class="w-full h-full object-cover rounded-full" alt={currentDisplayData.name} src="https://images.unsplash.com/photo-1565761427976-00b99e567d7f" />
                <AvatarFallback className="text-4xl bg-brand-artist text-brand-artist-foreground">
                    {currentDisplayData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                {isEditing ? (
                    <Input name="name" value={editData.name} onChange={handleInputChange} className="text-3xl md:text-4xl font-bold text-white bg-transparent border-b border-brand-artist/50 focus:border-brand-artist mb-1 p-0 h-auto" />
                ) : (
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{currentDisplayData.name}</h1>
                )}
                {isEditing ? (
                    <Input name="genre" value={editData.genre} onChange={handleInputChange} className="text-brand-artist text-lg bg-transparent border-b border-brand-artist/50 focus:border-brand-artist p-0 h-auto" />
                ) : (
                    <p className="text-brand-artist text-lg flex items-center"><Music size={18} className="mr-1.5"/>{currentDisplayData.genre}</p>
                )}
              </div>
            </div>
             <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-md flex items-center shadow-md">
                <Star className="h-5 w-5 text-yellow-400 mr-1.5" /> {currentDisplayData.rating.toFixed(1)}
            </div>
            <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} variant="outline" className="absolute top-4 left-4 bg-black/60 hover:bg-black/80 border-brand-artist text-brand-artist hover:text-brand-artist-foreground hover:bg-brand-artist">
                <Edit className="mr-2 h-4 w-4" /> {isEditing ? 'Salvar Alterações' : 'Editar Perfil'}
            </Button>
            {isEditing && <Button onClick={() => setIsEditing(false)} variant="ghost" className="absolute top-16 left-4 text-slate-300 hover:text-white">Cancelar</Button>}
          </header>
          
          <div className="px-2 sm:px-4 space-y-6">
            <Card className="shadow-lg bg-card/90 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-brand-artist flex items-center text-2xl">
                  Sobre
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                    <Textarea name="bio" value={editData.bio} onChange={handleInputChange} rows={5} className="text-muted-foreground leading-relaxed bg-slate-800/50 border-slate-700 focus:border-brand-artist" />
                ) : (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{currentDisplayData.bio}</p>
                )}
                {isEditing ? (
                    <Textarea name="moreDetails" value={editData.moreDetails} onChange={handleInputChange} rows={3} placeholder="Detalhes adicionais (equipamentos, disponibilidade...)" className="mt-3 text-sm text-slate-400 bg-slate-800/50 border-slate-700 focus:border-brand-artist" />
                ) : (
                    currentDisplayData.moreDetails && <p className="mt-3 text-sm text-slate-400 whitespace-pre-line">{currentDisplayData.moreDetails}</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-card/90 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-brand-artist flex items-center text-2xl">
                    <ImageIcon className="mr-2 h-6 w-6" /> Galeria de Fotos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Carousel items={currentDisplayData.photos} type="photos" />
                  {isEditing && <Button variant="outline" className="mt-3 w-full border-brand-artist text-brand-artist hover:text-brand-artist-foreground hover:bg-brand-artist">Adicionar/Gerenciar Fotos</Button>}
                </CardContent>
            </Card>

            <Card className="shadow-lg bg-card/90 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-brand-artist flex items-center text-2xl">
                  <Video className="mr-2 h-6 w-6" /> Vídeos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Carousel items={currentDisplayData.videos} type="videos" />
                {isEditing && <Button variant="outline" className="mt-3 w-full border-brand-artist text-brand-artist hover:text-brand-artist-foreground hover:bg-brand-artist">Adicionar/Gerenciar Vídeos</Button>}
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-card/90 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-brand-artist flex items-center text-2xl">
                  <CalendarDays className="mr-2 h-6 w-6" /> Próximos Shows (Exemplo)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentDisplayData.upcomingShows.length > 0 ? currentDisplayData.upcomingShows.map((show, index) => (
                  <div key={index} className="p-3 rounded-md border border-dashed border-brand-artist/50 bg-slate-800/30">
                    <p className="font-semibold text-foreground">{show.venue}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin size={14} className="mr-1 text-brand-artist" /> {new Date(show.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year: 'numeric'})} às {show.time}
                    </p>
                  </div>
                )) : (
                  <p className="text-muted-foreground">Nenhum show agendado publicamente no momento.</p>
                )}
                 {isEditing && <Button variant="outline" className="mt-3 w-full border-brand-artist text-brand-artist hover:text-brand-artist-foreground hover:bg-brand-artist">Gerenciar Agenda Pública</Button>}
              </CardContent>
            </Card>

            {!isEditing && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild className="flex-1 bg-brand-contractor hover:bg-brand-contractor/90 text-brand-contractor-foreground text-lg py-3">
                    <Link to={`/reservar/${user?.id || 'mock-artist-id'}`}>
                    <CalendarDays className="mr-2 h-5 w-5" /> Solicitar Reserva
                    </Link>
                </Button>
                <Button variant="outline" className="flex-1 border-brand-contractor text-brand-contractor hover:bg-brand-contractor/10 text-lg py-3">
                    <Mail className="mr-2 h-5 w-5" /> Enviar Mensagem
                </Button>
                </div>
            )}
          </div>
        </motion.div>
      );
    };

    export default PublicArtistProfileViewer;
  