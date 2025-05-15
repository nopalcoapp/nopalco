
    import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { Calendar } from '@/components/ui/calendar.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Textarea } from '@/components/ui/textarea.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
    import { motion } from 'framer-motion';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import { AlertCircle, CheckCircle } from 'lucide-react';
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
      DialogFooter,
      DialogClose,
    } from "@/components/ui/dialog.jsx";

    const mockArtists = {
      'banda-som-celestial': { name: 'Banda Som Celestial', genre: 'MPB Acústico', profileImageQuery: 'brazilian acoustic band portrait', baseValue: 350 },
      'dj-vibracao-noturna': { name: 'DJ Vibração Noturna', genre: 'Eletrônica / House', profileImageQuery: 'professional DJ smiling portrait', baseValue: 450 },
      'trio-jazz-alma': { name: 'Trio Jazz & Alma', genre: 'Jazz', profileImageQuery: "jazz trio formal portrait", baseValue: 500 },
      'samba-raiz': { name: 'Grupo Samba Raiz', genre: 'Samba', profileImageQuery: "samba group smiling for camera" }, 
      'rock-cover-br': { name: 'Rock Cover Brasil', genre: 'Rock', profileImageQuery: "rock band posing with instruments", baseValue: 400 },
    };

    const DEFAULT_ESTIMATED_VALUE = 400;


    const BookingCalendarScreen = () => {
      const { artistId } = useParams();
      const navigate = useNavigate();
      const artist = mockArtists[artistId];
      const [selectedDate, setSelectedDate] = useState(null);
      const [time, setTime] = useState('20:00');
      const [venueName, setVenueName] = useState('');
      const [message, setMessage] = useState('');
      const [estimatedValue, setEstimatedValue] = useState(artist?.baseValue || DEFAULT_ESTIMATED_VALUE);
      const { toast } = useToast();
      const [user] = useLocalStorage('no-palco-user', null);
      const [bookings, setBookings] = useLocalStorage(`no-palco-bookings-${artistId}`, []); 
      const [artistAgenda, setArtistAgenda] = useLocalStorage('no-palco-artist-agenda', {});
      const [notifications, setNotifications] = useLocalStorage('no-palco-notifications', []);
      const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
      const [termsAccepted, setTermsAccepted] = useState(false);


      const handleDateSelect = (date) => {
        setSelectedDate(date);
      };

      const validateBooking = () => {
        if (!selectedDate) {
          toast({ title: 'Erro', description: 'Por favor, selecione uma data.', variant: 'destructive'});
          return false;
        }
        if (!time) {
          toast({ title: 'Erro', description: 'Por favor, informe o horário.', variant: 'destructive'});
          return false;
        }
        if (!venueName) {
          toast({ title: 'Erro', description: 'Por favor, informe o nome do local/evento.', variant: 'destructive'});
          return false;
        }
        return true;
      }

      const handleBookingRequest = () => {
        if (!validateBooking()) return;
        setIsTermsModalOpen(true);
      };

      const confirmBookingAfterTerms = () => {
        if (!termsAccepted) {
            toast({ title: 'Termos Não Aceitos', description: 'Você precisa aceitar os termos para continuar.', variant: 'destructive'});
            return;
        }

        const newBooking = {
          id: `booking-${Date.now()}`,
          artistId: artistId,
          artistName: artist.name,
          contractorId: user?.id || 'guest-contractor',
          contractorName: user?.name || 'Contratante Anônimo',
          date: selectedDate.toISOString().split('T')[0],
          time: time,
          venueName: venueName,
          message: message,
          status: 'pending_artist_action', 
          amount: estimatedValue, 
        };

        setBookings(prev => [...prev, newBooking]);
        
        const artistNotification = {
            id: `notif-${Date.now()}`,
            userId: artistId, 
            type: 'new_booking_request',
            title: 'Nova Solicitação de Show!',
            message: `${user?.name || 'Um contratante'} solicitou um show para ${newBooking.venueName} em ${new Date(newBooking.date).toLocaleDateString('pt-BR')}.`,
            date: new Date().toISOString(),
            isRead: false,
            link: `/solicitacoes` 
        };
        setNotifications(prev => [artistNotification, ...prev]);
        
        toast({
          title: 'Solicitação de Reserva Enviada!',
          description: `Sua solicitação para ${artist.name} em ${selectedDate.toLocaleDateString('pt-BR')} às ${time} foi enviada. O artista será notificado.`,
        });
        setIsTermsModalOpen(false);
        setTermsAccepted(false);
        navigate(`/artista/${artistId}`); 
      };

      if (!artist) {
        return <div className="text-center py-10 text-muted-foreground">Artista não encontrado.</div>;
      }

      return (
        <motion.div 
          className="space-y-6 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="py-4">
             <div className="flex items-center space-x-3 mb-2">
                <Avatar className="h-16 w-16 border-2 border-brand-yellow">
                    <img  className="object-cover w-full h-full" alt={artist.name} src="https://images.unsplash.com/photo-1535389351109-7f656ed55699" />
                    <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm text-muted-foreground">Solicitar reserva para:</p>
                    <h1 className="text-2xl font-bold text-brand-yellow">{artist.name}</h1>
                </div>
            </div>
            <p className="text-muted-foreground">Selecione data, horário e detalhes para o show.</p>
          </header>

          <Card className="shadow-lg bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-brand-pink">1. Escolha a Data</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Calendar
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="mb-4"
                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} 
              />
            </CardContent>
          </Card>
          
          {selectedDate && (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
            <Card className="shadow-lg bg-card/90 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-brand-pink">2. Detalhes do Evento</CardTitle>
                    <CardDescription>Data selecionada: <span className="font-semibold text-brand-yellow">{selectedDate.toLocaleDateString('pt-BR')}</span></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="venueName" className="text-slate-300">Nome do Local / Evento</Label>
                        <Input id="venueName" value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="Ex: Casamento Ana & Bruno, Bar Central" className="bg-slate-800/50 border-slate-700 focus:border-brand-yellow" />
                    </div>
                    <div>
                        <Label htmlFor="time" className="text-slate-300">Horário do Show</Label>
                        <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-slate-800/50 border-slate-700 focus:border-brand-yellow"/>
                    </div>
                    <div>
                        <Label htmlFor="message" className="text-slate-300">Mensagem para o artista (opcional)</Label>
                        <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Detalhes sobre o evento, tipo de público, repertório desejado, etc." className="bg-slate-800/50 border-slate-700 focus:border-brand-yellow"/>
                    </div>
                    <div className="p-3 bg-slate-800/60 rounded-md border border-slate-700">
                        <p className="text-sm text-muted-foreground">Valor estimado: <span className="text-brand-yellow font-bold text-lg">R$ {estimatedValue.toFixed(2)}</span></p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-start">
                            <AlertCircle size={14} className="mr-1.5 mt-0.5 text-yellow-500 flex-shrink-0"/>
                            <span>Este valor é uma estimativa e pode variar. Não inclui equipamento de sonorização completo (ex: caixas de som, mesa de som principal). Verifique com o artista sobre custos adicionais para equipamentos.</span>
                        </p>
                    </div>
                     <Button 
                        onClick={handleBookingRequest} 
                        className="w-full bg-brand-yellow hover:bg-brand-yellow/90 text-primary-foreground text-lg py-3 mt-4"
                    >
                        Enviar Solicitação de Reserva
                    </Button>
                </CardContent>
            </Card>
            </motion.div>
          )}

            <Dialog open={isTermsModalOpen} onOpenChange={setIsTermsModalOpen}>
                <DialogContent className="bg-card text-card-foreground">
                    <DialogHeader>
                        <DialogTitle className="text-brand-yellow">Termos e Condições da Reserva</DialogTitle>
                        <DialogDescription>
                            Por favor, leia e aceite os termos antes de prosseguir com a reserva.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3 max-h-[50vh] overflow-y-auto text-sm text-muted-foreground">
                        <p>Ao solicitar esta reserva, você concorda com os seguintes termos:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>O valor apresentado é uma estimativa e pode ser ajustado pelo artista.</li>
                            <li>O pagamento deve ser realizado conforme combinado com o artista. A plataforma No Palco pode facilitar o registro, mas não processa pagamentos diretamente nesta fase.</li>
                            <li>Cancelamentos estão sujeitos à política individual do artista.</li>
                            <li>O contratante é responsável por fornecer um ambiente seguro e adequado para a apresentação.</li>
                            <li>Equipamentos de sonorização (caixas de som, mesa de som principal, etc.) geralmente não estão inclusos no valor base, a menos que especificado pelo artista. Verifique os detalhes.</li>
                            <li>A plataforma No Palco atua como intermediária e não se responsabiliza por acordos diretos não registrados ou problemas durante o evento.</li>
                        </ul>
                        <p>Estes são termos simulados para fins de prototipagem.</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                        <Input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="h-4 w-4 accent-brand-yellow" />
                        <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Li e aceito os termos e condições.
                        </Label>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {setIsTermsModalOpen(false); setTermsAccepted(false);}}>Cancelar</Button>
                        <Button onClick={confirmBookingAfterTerms} disabled={!termsAccepted} className="bg-brand-yellow hover:bg-brand-yellow/90 text-primary-foreground">
                            <CheckCircle size={16} className="mr-2"/> Confirmar Solicitação
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </motion.div>
      );
    };

    export default BookingCalendarScreen;
  