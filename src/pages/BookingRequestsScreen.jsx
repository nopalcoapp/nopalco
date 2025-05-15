
    import React, { useState } from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
    import { Check, X, CalendarClock, MailOpen, FileText, MessageSquare, Bell } from 'lucide-react';
    import { motion } from 'framer-motion';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogFooter,
    } from "@/components/ui/dialog.jsx";
    import { Label } from "@/components/ui/label.jsx";
    import { Input } from "@/components/ui/input.jsx"; 
    import { useNavigate } from 'react-router-dom';


    const mockContractors = {
      'contractor1': { name: 'Contratante NoPalco', imageQuery: 'modern restaurant manager portrait' },
      'contractor2': { name: 'Bar Harmonia', imageQuery: 'cozy bar interior' },
    };
    
    const mockInitialBookings = [
        { id: 'booking1', artistId: 'artist1', contractorId: 'contractor1', contractorName: 'Contratante NoPalco', date: '2025-06-10', time: '20:00', venueName: 'Restaurante Solar', status: 'pending_artist_action', amount: 300, message: 'Gostaríamos de uma apresentação de MPB para nosso jantar especial.' },
        { id: 'booking2', artistId: 'artist1', contractorId: 'contractor2', contractorName: 'Bar Harmonia', date: '2025-06-15', time: '22:00', venueName: 'Bar Lunar', status: 'pending_artist_action', amount: 450, message: 'Procuramos um show animado para sexta à noite.' },
        { id: 'booking3', artistId: 'artist1', contractorId: 'contractor1', contractorName: 'Contratante NoPalco', date: '2025-05-20', time: '19:00', venueName: 'Café Central', status: 'accepted', amount: 250, message: 'Show acústico para happy hour.' },
    ];

    const BookingRequestsScreen = () => {
      const [user] = useLocalStorage('no-palco-user', null);
      const [bookings, setBookings] = useLocalStorage(`no-palco-bookings-${user?.id}`, mockInitialBookings.filter(b => b.artistId === user?.id || b.artistId === 'artist1')); 
      const [artistAgenda, setArtistAgenda] = useLocalStorage('no-palco-artist-agenda', {});
      const [notifications, setNotifications] = useLocalStorage('no-palco-notifications', []);
      const { toast } = useToast();
      const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
      const [termsAccepted, setTermsAccepted] = useState(false);
      const [currentBookingForTerms, setCurrentBookingForTerms] = useState(null);
      const navigate = useNavigate();


      const handleAcceptWithTerms = (booking) => {
        setCurrentBookingForTerms(booking);
        setIsTermsModalOpen(true);
      };

      const confirmAcceptance = () => {
        if (!termsAccepted || !currentBookingForTerms) {
            toast({ title: 'Termos Não Aceitos', description: 'Você precisa aceitar os termos para confirmar.', variant: 'destructive'});
            return;
        }
        handleBookingAction(currentBookingForTerms.id, 'accepted');
        setIsTermsModalOpen(false);
        setTermsAccepted(false);
        setCurrentBookingForTerms(null);
      };


      const handleBookingAction = (bookingId, newStatus) => {
        let actedBooking = null;
        setBookings(prevBookings => 
          prevBookings.map(b => {
            if (b.id === bookingId) {
                actedBooking = { ...b, status: newStatus };
                return actedBooking;
            }
            return b;
          })
        );

        if (newStatus === 'accepted' && actedBooking) {
            setArtistAgenda(prevAgenda => {
                const dateKey = actedBooking.date;
                const newShow = {
                    id: actedBooking.id,
                    artist: user?.name || 'Artista',
                    venue: actedBooking.venueName,
                    time: actedBooking.time,
                    genre: 'A definir', 
                    status: 'confirmed',
                    payment: actedBooking.amount,
                    details: actedBooking.message,
                    type: 'platform',
                    paymentStatus: 'pending', 
                    paymentConfirmedByArtist: false,
                    contractorName: actedBooking.contractorName,
                    contractorId: actedBooking.contractorId,
                    photoQuery: user?.profileImageQuery || 'musician on stage'
                };
                const updatedDayAgenda = prevAgenda[dateKey] ? [...prevAgenda[dateKey], newShow] : [newShow];
                return { ...prevAgenda, [dateKey]: updatedDayAgenda };
            });

            const contractorNotification = {
                id: `notif-${Date.now()}`,
                userId: actedBooking.contractorId, 
                type: 'booking_accepted',
                title: 'Reserva Confirmada!',
                message: `${user?.name || 'O artista'} aceitou sua solicitação para ${actedBooking.venueName} em ${new Date(actedBooking.date).toLocaleDateString('pt-BR')}.`,
                date: new Date().toISOString(),
                isRead: false,
                link: `/agenda` 
            };
            setNotifications(prev => [contractorNotification, ...prev]);
        }
         if (newStatus === 'rejected' && actedBooking) {
            const contractorNotification = {
                id: `notif-${Date.now()}`,
                userId: actedBooking.contractorId, 
                type: 'booking_rejected',
                title: 'Solicitação Recusada.',
                message: `${user?.name || 'O artista'} recusou sua solicitação para ${actedBooking.venueName} em ${new Date(actedBooking.date).toLocaleDateString('pt-BR')}.`,
                date: new Date().toISOString(),
                isRead: false,
                link: `/buscar-artistas` 
            };
            setNotifications(prev => [contractorNotification, ...prev]);
        }


        toast({
          title: `Solicitação ${newStatus === 'accepted' ? 'Aceita' : 'Recusada'}`,
          description: `A solicitação de reserva foi ${newStatus === 'accepted' ? 'aceita' : 'recusada'} com sucesso.`,
        });
      };

      const handleOpenChat = (booking) => {
        const conversationId = `chat_${user?.id}_${booking.contractorId}_${booking.id}`;
        navigate(`/mensagens/${conversationId}`, { state: { bookingDetails: booking, otherPartyName: booking.contractorName, otherPartyType: 'Contratante' } });
      };
      
      const pendingBookings = bookings.filter(b => b.status === 'pending_artist_action');
      const otherBookings = bookings.filter(b => b.status !== 'pending_artist_action');


      return (
        <motion.div 
          className="space-y-6 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="py-4">
            <h1 className="text-3xl font-bold text-brand-artist flex items-center"><Bell className="mr-2"/>Alertas e Solicitações</h1>
            <p className="text-muted-foreground">Gerencie os pedidos de shows e comunique-se com contratantes.</p>
          </header>

          {pendingBookings.length > 0 && (
            <Card className="shadow-lg bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-brand-pink">Novas Solicitações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingBookings.map((booking, index) => {
                  const contractor = mockContractors[booking.contractorId] || {name: booking.contractorName || 'Contratante Desconhecido', imageQuery: 'default user avatar'};
                  return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="bg-background/50 dark:bg-slate-800/50 border border-brand-artist/30">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <img  class="object-cover w-full h-full" alt={contractor.name} src="https://images.unsplash.com/photo-1702948545240-b44e3c1b86f4" />
                            <AvatarFallback>{contractor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg text-foreground">{contractor.name}</CardTitle>
                            <CardDescription className="text-brand-pink">{booking.venueName}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground flex items-center mb-1">
                          <CalendarClock size={16} className="mr-2 text-brand-artist"/> {new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">Valor: <span className="text-brand-artist font-semibold">R$ {booking.amount.toFixed(2)}</span></p>
                        {booking.message && <p className="text-sm text-slate-600 dark:text-slate-300 italic p-2 bg-slate-200 dark:bg-slate-700/50 rounded-md">"{booking.message}"</p>}
                      </CardContent>
                      <CardFooter className="flex justify-end space-x-3">
                        <Button variant="destructive" size="sm" onClick={() => handleBookingAction(booking.id, 'rejected')}>
                          <X className="mr-1 h-4 w-4"/> Recusar
                        </Button>
                        <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleAcceptWithTerms(booking)}>
                          <Check className="mr-1 h-4 w-4"/> Aceitar
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )})}
              </CardContent>
            </Card>
          )}
          
          {otherBookings.length > 0 && (
             <Card className="shadow-lg bg-card/90 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-brand-artist">Histórico e Chats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {otherBookings.map(booking => {
                   const contractor = mockContractors[booking.contractorId] || {name: booking.contractorName || 'Contratante Desconhecido', imageQuery: 'default user avatar'};
                   const isAccepted = booking.status === 'accepted';
                   return (
                    <div key={booking.id} className="p-3 rounded-md border border-border dark:border-slate-700 bg-background/30 dark:bg-slate-800/30 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                            <p className="font-semibold text-foreground">{contractor.name} - {booking.venueName}</p>
                            <p className="text-sm text-muted-foreground">{new Date(booking.date).toLocaleDateString('pt-BR')} - R$ {booking.amount.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${isAccepted ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {isAccepted ? 'Aceito' : 'Recusado'}
                            </span>
                            {isAccepted && (
                                <Button variant="outline" size="sm" onClick={() => handleOpenChat(booking)} className="text-xs border-brand-artist text-brand-artist hover:bg-brand-artist/10">
                                    <MessageSquare size={14} className="mr-1.5"/> Chat
                                </Button>
                            )}
                        </div>
                    </div>
                )})}
              </CardContent>
            </Card>
          )}

          {bookings.length === 0 && (
            <p className="text-muted-foreground text-center py-10">Nenhuma solicitação de reserva ou alerta encontrado.</p>
          )}

            <Dialog open={isTermsModalOpen} onOpenChange={setIsTermsModalOpen}>
                <DialogContent className="bg-card text-card-foreground">
                    <DialogHeader>
                        <DialogTitle className="text-brand-artist">Termos e Condições para Aceite</DialogTitle>
                        <DialogDescription>
                            Confirme que você leu e aceita os termos para esta reserva.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3 max-h-[50vh] overflow-y-auto text-sm text-muted-foreground">
                        <p>Ao aceitar esta reserva, você concorda em:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Realizar a apresentação na data, horário e local combinados.</li>
                            <li>Comunicar qualquer imprevisto com antecedência ao contratante.</li>
                            <li>Manter um comportamento profissional durante o evento.</li>
                            <li>O valor acordado será pago pelo contratante conforme combinado. A plataforma No Palco pode registrar o status, mas não processa pagamentos diretamente nesta fase.</li>
                            <li>Detalhes sobre equipamento de som devem ser alinhados com o contratante.</li>
                        </ul>
                        <p>Estes são termos simulados para fins de prototipagem.</p>
                    </div>
                     <div className="flex items-center space-x-2 mt-4">
                        <Input type="checkbox" id="artistTerms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="h-4 w-4 accent-brand-artist" />
                        <Label htmlFor="artistTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Li e aceito os termos e condições para esta reserva.
                        </Label>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {setIsTermsModalOpen(false); setTermsAccepted(false); setCurrentBookingForTerms(null);}}>Cancelar</Button>
                        <Button onClick={confirmAcceptance} disabled={!termsAccepted} className="bg-green-600 hover:bg-green-700 text-white">
                            <FileText size={16} className="mr-2"/> Confirmar Aceite
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </motion.div>
      );
    };

    export default BookingRequestsScreen;
  