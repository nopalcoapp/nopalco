
    import React from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Mail, Music, Star, CalendarDays, MapPin, Youtube, PlayCircle } from 'lucide-react';
    import { motion } from 'framer-motion';

    const mockArtists = {
      'banda-som-celestial': {
        name: 'Banda Som Celestial',
        genre: 'MPB Acústico',
        email: 'somcelestial@email.com',
        bio: 'Levando harmonia e poesia em cada canção. A Banda Som Celestial encanta com seu repertório de MPB e bossa nova, perfeito para ambientes que buscam sofisticação e boa música.',
        rating: 4.8,
        imageQuery: 'acoustic band performing on stage live music',
        profileImageQuery: 'brazilian acoustic band portrait',
        videos: [{title: "Show ao Vivo Acústico", url: "https://www.youtube.com/embed/HEXWRTEbj1I", thumbnailQuery: "acoustic guitar player singing"}, {title: "Ensaio Bossa Nova", url: "https://www.youtube.com/embed/HEXWRTEbj1I", thumbnailQuery: "female singer with acoustic band"}],
        upcomingShows: [
          { venue: 'Restaurante Harmonia', date: '2025-05-15', time: '20:00' },
          { venue: 'Café Cultural', date: '2025-05-22', time: '19:00' },
        ],
        moreDetails: "Disponível para eventos corporativos, casamentos e festas particulares. Equipamento de som próprio opcional."
      },
      'dj-vibracao-noturna': {
        name: 'DJ Vibração Noturna',
        genre: 'Eletrônica / House',
        email: 'djvibracao@email.com',
        bio: 'Com sets energéticos e batidas contagiantes, DJ Vibração Noturna transforma qualquer noite em uma festa inesquecível. Experiência em eventos corporativos e casas noturnas.',
        rating: 4.5,
        imageQuery: 'DJ performing at a nightclub with colorful lights',
        profileImageQuery: 'professional DJ smiling portrait',
        videos: [{title: "Set Eletrônico Verão", url: "https://www.youtube.com/embed/HEXWRTEbj1I", thumbnailQuery: "DJ console with crowd dancing"}, {title: "Live Sunset Session", url: "https://www.youtube.com/embed/HEXWRTEbj1I", thumbnailQuery: "DJ playing music at sunset party"}],
        upcomingShows: [
          { venue: 'Bar Eclipse', date: '2025-05-17', time: '22:00' },
          { venue: 'Festa Privada Rooftop', date: '2025-05-25', time: '23:00' },
        ],
        moreDetails: "Especializado em Deep House, Tech House e Progressive House. Rider técnico disponível sob consulta."
      },
       'trio-jazz-alma': { name: 'Trio Jazz & Alma', genre: 'Jazz', email: "jazzalma@email.com", bio: "Música instrumental de alta qualidade para eventos refinados.", rating: 4.9, imageQuery: 'jazz trio playing instruments on a dark stage', profileImageQuery: "jazz trio formal portrait", videos: [], upcomingShows: [], moreDetails: "Repertório clássico e contemporâneo." },
       'samba-raiz': { name: 'Grupo Samba Raiz', genre: 'Samba', email: "sambaraiz@email.com", bio: "Alegria e tradição do samba de raiz.", rating: 4.6, imageQuery: 'samba group playing in a lively bar', profileImageQuery: "samba group smiling for camera", videos: [], upcomingShows: [], moreDetails: "Formação flexível, de 3 a 7 músicos." },
       'rock-cover-br': { name: 'Rock Cover Brasil', genre: 'Rock', email: "rockcover@email.com", bio: "Os maiores sucessos do rock nacional e internacional.", rating: 4.3, imageQuery: 'rock band performing energetically on stage', profileImageQuery: "rock band posing with instruments", videos: [], upcomingShows: [], moreDetails: "Ideal para bares, pubs e festivais." },
    };

    const ArtistProfileScreen = () => {
      const { artistId } = useParams();
      const artist = mockArtists[artistId];

      if (!artist) {
        return <div className="text-center py-10 text-muted-foreground">Artista não encontrado.</div>;
      }

      return (
        <motion.div 
          className="space-y-6 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="relative h-56 md:h-72 group">
            <img  class="w-full h-full object-cover rounded-b-xl shadow-lg" alt={artist.name + " cover image"}  src="https://images.unsplash.com/photo-1659797148729-f68ece33c282" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-b-xl"></div>
            <div className="absolute bottom-0 left-0 p-6 flex items-end space-x-4">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-brand-contractor shadow-xl">
                 <img  class="w-full h-full object-cover" alt={artist.name} src="https://images.unsplash.com/photo-1535389351109-7f656ed55699" />
                <AvatarFallback className="text-4xl bg-brand-contractor text-brand-contractor-foreground">
                    {artist.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-serif">{artist.name}</h1>
                <p className="text-brand-contractor text-lg flex items-center"><Music size={18} className="mr-1.5"/>{artist.genre}</p>
              </div>
            </div>
             <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-md flex items-center shadow-md">
                <Star className="h-5 w-5 text-yellow-400 mr-1.5" /> {artist.rating.toFixed(1)}
            </div>
          </header>
          
          <div className="px-2 sm:px-4 space-y-6">
            <Card className="shadow-lg bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-brand-contractor flex items-center text-2xl">
                  Sobre o Artista
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{artist.bio}</p>
                {artist.moreDetails && <p className="mt-3 text-sm text-slate-400">{artist.moreDetails}</p>}
              </CardContent>
            </Card>

            {artist.videos && artist.videos.length > 0 && (
              <Card className="shadow-lg bg-card/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-brand-contractor flex items-center text-2xl">
                    <Youtube className="mr-2 h-6 w-6" /> Vídeos
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {artist.videos.map((video, index) => (
                    <a key={index} href={video.url} target="_blank" rel="noopener noreferrer" className="block group">
                      <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                        <img  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={video.title} src="https://images.unsplash.com/photo-1579532582937-16c108930bf6" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <PlayCircle className="h-16 w-16 text-white/80" />
                        </div>
                        <p className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-white text-xs truncate">{video.title}</p>
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-brand-contractor flex items-center text-2xl">
                  <CalendarDays className="mr-2 h-6 w-6" /> Próximos Shows (Exemplo)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {artist.upcomingShows.length > 0 ? artist.upcomingShows.map((show, index) => (
                  <div key={index} className="p-3 rounded-md border border-dashed border-brand-contractor/50 bg-slate-800/30">
                    <p className="font-semibold text-foreground">{show.venue}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin size={14} className="mr-1 text-brand-contractor" /> {new Date(show.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year: 'numeric'})} às {show.time}
                    </p>
                  </div>
                )) : (
                  <p className="text-muted-foreground">Nenhum show agendado publicamente no momento.</p>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild className="flex-1 bg-brand-contractor hover:bg-brand-contractor/90 text-brand-contractor-foreground text-lg py-3">
                <Link to={`/reservar/${artistId}`}>
                  <CalendarDays className="mr-2 h-5 w-5" /> Solicitar Reserva
                </Link>
              </Button>
              <Button variant="outline" className="flex-1 border-brand-contractor text-brand-contractor hover:bg-brand-contractor/10 text-lg py-3">
                <Mail className="mr-2 h-5 w-5" /> Enviar Mensagem
              </Button>
            </div>
          </div>
        </motion.div>
      );
    };

    export default ArtistProfileScreen;
  