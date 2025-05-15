
    import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { Input } from '@/components/ui/input.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card.jsx';
    import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
    import { Star, Filter, Search, Music, Award, CheckCircle, MinusCircle, MessageSquare } from 'lucide-react';
    import { motion } from 'framer-motion';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
      DialogFooter,
      DialogClose,
    } from "@/components/ui/dialog.jsx";
    import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.jsx";
    import { Label } from "@/components/ui/label.jsx";


    const allArtistsData = [
      { id: 'banda-som-celestial', name: 'Banda Som Celestial', genre: 'MPB Acústico', rating: 4.8, imageQuery: 'acoustic band performing on stage', videos: [{title: "Show ao Vivo Acústico", url: "https://www.youtube.com/embed/dQw4w9WgXcQ"}], isPremium: true },
      { id: 'dj-vibracao-noturna', name: 'DJ Vibração Noturna', genre: 'Eletrônica', rating: 4.5, imageQuery: 'DJ performing at a nightclub with lights', videos: [{title: "Set Eletrônico Verão", url: "https://www.youtube.com/embed/HEXWRTEbj1I"}], isPremium: false },
      { id: 'trio-jazz-alma', name: 'Trio Jazz & Alma', genre: 'Jazz', rating: 4.9, imageQuery: 'jazz trio playing instruments', videos: [], isPremium: true },
      { id: 'samba-raiz', name: 'Grupo Samba Raiz', genre: 'Samba', rating: 4.6, imageQuery: 'samba group playing in a bar', videos: [{title: "Roda de Samba", url: "https://www.youtube.com/embed/HEXWRTEbj1I"}], isPremium: false },
      { id: 'rock-cover-br', name: 'Rock Cover Brasil', genre: 'Rock', rating: 4.3, imageQuery: 'rock band playing live on stage', videos: [], isPremium: false },
    ];
    
    const genres = ['Todos', 'MPB Acústico', 'Eletrônica', 'Jazz', 'Samba', 'Rock', 'Pop', 'Sertanejo'];

    const ContractorFeedbackModal = ({ artist, existingFeedback, onSaveFeedback }) => {
        const [feedbackStatus, setFeedbackStatus] = useState(existingFeedback?.status || null);
        const [notes, setNotes] = useState(existingFeedback?.notes || '');

        const handleSave = () => {
            onSaveFeedback(artist.id, { status: feedbackStatus, notes });
        };
        
        return (
            <DialogContent className="bg-card text-card-foreground">
                <DialogHeader>
                    <DialogTitle>Feedback para {artist.name}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <p className="text-sm text-muted-foreground">Como foi sua experiência com este artista?</p>
                    <RadioGroup value={feedbackStatus} onValueChange={setFeedbackStatus} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="positive" id={`fb-positive-${artist.id}`} className="text-green-500 border-green-500 data-[state=checked]:bg-green-500"/>
                            <Label htmlFor={`fb-positive-${artist.id}`} className="text-green-400">Positivo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="neutral" id={`fb-neutral-${artist.id}`} className="text-yellow-500 border-yellow-500 data-[state=checked]:bg-yellow-500"/>
                            <Label htmlFor={`fb-neutral-${artist.id}`} className="text-yellow-400">Neutro</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="negative" id={`fb-negative-${artist.id}`} className="text-red-500 border-red-500 data-[state=checked]:bg-red-500"/>
                            <Label htmlFor={`fb-negative-${artist.id}`} className="text-red-400">Negativo</Label>
                        </div>
                    </RadioGroup>
                    <div>
                        <Label htmlFor={`notes-${artist.id}`} className="text-muted-foreground">Suas Anotações (Privado)</Label>
                        <Input id={`notes-${artist.id}`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Lembretes sobre a contratação..." className="bg-slate-800/50 border-slate-700"/>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                    <DialogClose asChild><Button onClick={handleSave} className="bg-brand-contractor text-brand-contractor-foreground">Salvar Feedback</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        );
    };


    const ArtistSearchScreen = () => {
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedGenre, setSelectedGenre] = useState('Todos');
      const [minRating, setMinRating] = useState(0);
      const [filteredArtists, setFilteredArtists] = useState([]);
      const [user] = useLocalStorage('no-palco-user', null);
      const [contractorBookings, setContractorBookings] = useLocalStorage(`no-palco-contractor-agenda`, []);
      const [artistFeedback, setArtistFeedback] = useLocalStorage(`no-palco-artist-feedback-${user?.id}`, {});


      useEffect(() => {
        let artists = [...allArtistsData].sort((a,b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0) || b.rating - a.rating);
        
        if (searchTerm) {
          artists = artists.filter(artist => artist.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (selectedGenre !== 'Todos') {
          artists = artists.filter(artist => artist.genre === selectedGenre);
        }
        artists = artists.filter(artist => artist.rating >= minRating);
        setFilteredArtists(artists);
      }, [searchTerm, selectedGenre, minRating]);
      
      const hasBeenHired = (artistId) => {
          return contractorBookings.some(booking => booking.artistId === artistId && (booking.status === 'completed' || booking.status === 'confirmed'));
      };

      const handleSaveFeedback = (artistId, feedback) => {
        setArtistFeedback(prev => ({...prev, [artistId]: feedback}));
      };

      return (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="py-4 sticky top-0 bg-background z-10">
            <h1 className="text-3xl font-bold text-brand-yellow flex items-center"><Search className="mr-2"/>Buscar Artistas</h1>
            <p className="text-muted-foreground">Encontre o talento perfeito para o seu evento.</p>
          </header>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-brand-pink flex items-center"><Filter className="mr-2"/>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:flex md:space-y-0 md:space-x-4">
              <Input 
                placeholder="Nome do artista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow bg-slate-800/50 border-slate-700 focus:border-brand-yellow"
              />
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-full md:w-[180px] bg-slate-800/50 border-slate-700 focus:border-brand-yellow">
                  <SelectValue placeholder="Gênero Musical" />
                </SelectTrigger>
                <SelectContent className="bg-card border-slate-700">
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre} className="focus:bg-brand-yellow/20">{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={String(minRating)} onValueChange={(val) => setMinRating(Number(val))}>
                <SelectTrigger className="w-full md:w-[180px] bg-slate-800/50 border-slate-700 focus:border-brand-yellow">
                  <SelectValue placeholder="Avaliação Mínima" />
                </SelectTrigger>
                <SelectContent className="bg-card border-slate-700">
                  {[0, 1, 2, 3, 4, 5].map(rate => (
                    <SelectItem key={rate} value={String(rate)} className="focus:bg-brand-yellow/20">
                      {rate === 0 ? 'Qualquer' : `${rate}+ Estrelas`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArtists.length > 0 ? filteredArtists.map((artist, index) => {
              const hiredBefore = hasBeenHired(artist.id);
              const feedback = artistFeedback[artist.id];
              return (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden transition-all hover:shadow-xl hover:shadow-brand-yellow/20 bg-card/80 backdrop-blur-sm relative">
                   {artist.isPremium && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-semibold flex items-center z-10">
                            <Award size={12} className="mr-1" /> Destaque
                        </div>
                    )}
                  <div className="h-48 w-full bg-muted relative">
                    <img  class="w-full h-full object-cover" alt={artist.name} src="https://images.unsplash.com/photo-1702360372833-f54607516730" />
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" /> {artist.rating.toFixed(1)}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-brand-yellow hover:underline">
                        <Link to={`/artista/${artist.id}`}>{artist.name}</Link>
                    </CardTitle>
                    <CardDescription className="text-sm text-brand-pink flex items-center"><Music size={14} className="mr-1"/>{artist.genre}</CardDescription>
                    {hiredBefore && (
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            <CheckCircle size={14} className="mr-1 text-green-500"/> Já contratado
                            {feedback && (
                                <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                                    feedback.status === 'positive' ? 'bg-green-500/20 text-green-400' :
                                    feedback.status === 'neutral' ? 'bg-yellow-500/20 text-yellow-400' :
                                    feedback.status === 'negative' ? 'bg-red-500/20 text-red-400' : ''
                                }`}>
                                    Seu Feedback: {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                                </span>
                            )}
                        </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Link to={`/reservar/${artist.id}`}>
                        <Button variant="outline" className="w-full border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-primary-foreground">
                            Ver Perfil & Solicitar Reserva
                        </Button>
                    </Link>
                    {hiredBefore && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs text-muted-foreground hover:text-brand-yellow">
                                    <MessageSquare size={14} className="mr-1" /> {feedback ? 'Editar Feedback' : 'Adicionar Feedback Privado'}
                                </Button>
                            </DialogTrigger>
                            <ContractorFeedbackModal artist={artist} existingFeedback={feedback} onSaveFeedback={handleSaveFeedback} />
                        </Dialog>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}) : (
              <p className="text-muted-foreground col-span-full text-center py-10">Nenhum artista encontrado com os filtros selecionados.</p>
            )}
          </div>
        </motion.div>
      );
    };

    export default ArtistSearchScreen;
  