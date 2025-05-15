
    import React, { useState } from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { Music, DollarSign, Users, Share2, Info, Check, X as CloseIcon, Image as ImageIcon, Download as DownloadIcon, Users2 as GuestsIcon } from 'lucide-react';
    import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog.jsx";
    import ShowPromotionArtModal from '@/components/agenda/ShowPromotionArtModal.jsx';

    const ShowDetailsModal = ({ show, userType, onUpdateShowStatus, onDeleteShow, onConfirmPaymentByArtist }) => {
      const { toast } = useToast();
      const [isPromoArtModalOpen, setIsPromoArtModalOpen] = useState(false);
      
      const handleShare = () => {
        setIsPromoArtModalOpen(true);
      };

      const handleManageGuests = () => {
        toast({ title: "Gerenciar Convidados (Simulado)", description: "Aqui você poderia adicionar músicos auxiliares e compartilhar detalhes da agenda." });
      };

      return (
        <>
        <DialogContent className="bg-card text-card-foreground sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className={`text-2xl ${userType === 'Artista' ? 'text-brand-artist' : 'text-brand-contractor'}`}>
              {userType === 'Artista' ? show.venue : show.artist}
            </DialogTitle>
            <DialogDescription>
              {new Date(show.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} às {show.time}
              {show.endTime && ` - ${show.endTime}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="flex items-center">
              <Music size={16} className={`mr-2 ${userType === 'Artista' ? 'text-brand-artist' : 'text-brand-contractor'}`} />
              <span>Gênero: {show.genre}</span>
            </div>
            <div className="flex items-center">
              <DollarSign size={16} className={`mr-2 ${userType === 'Artista' ? 'text-brand-artist' : 'text-brand-contractor'}`} />
              <span>Valor: R$ {show.payment?.toFixed(2)}</span>
            </div>
            {show.interval && <p className="text-sm">Intervalo: {show.interval}</p>}
            {userType === 'Contratante' && (
              <div className="flex items-center">
                <Users size={16} className="mr-2 text-brand-contractor" />
                <span>Artista: {show.artist}</span>
              </div>
            )}
            {show.details && (
              <div>
                <h4 className="font-semibold mb-1">Detalhes Adicionais:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{show.details}</p>
              </div>
            )}
            {userType === 'Artista' && show.paymentStatus === 'paid_by_contractor' && !show.paymentConfirmedByArtist && (
                 <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                    <p className="text-sm text-yellow-400">O contratante marcou este show como pago. Por favor, confirme o recebimento.</p>
                 </div>
            )}
            {show.photoQuery && (
              <div className="mt-2">
                <h4 className="font-semibold mb-1">Arte para Divulgação (Exemplo):</h4>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                  <img  class="w-full h-full object-cover" alt={`Divulgação para ${show.artist} em ${show.venue}`} src="https://images.unsplash.com/flagged/photo-1567460687993-7385f565b123" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-white text-xl font-bold">{userType === 'Artista' ? 'Você' : show.artist}</h3>
                    <p className="text-brand-yellow text-sm">{show.venue}</p>
                    <p className="text-white text-xs">{new Date(show.date).toLocaleDateString('pt-BR')} - {show.time}</p>
                  </div>
                </div>
              </div>
            )}
            {userType === 'Artista' && show.type === 'platform' && (
                <div className="mt-3 pt-3 border-t border-border">
                    <h4 className="font-semibold mb-2 text-brand-artist">Opções da Gig</h4>
                    <Button variant="outline" size="sm" onClick={handleManageGuests} className="w-full justify-start text-left">
                        <GuestsIcon size={16} className="mr-2 text-brand-artist"/> Gerenciar Convidados/Músicos Auxiliares (Simulado)
                    </Button>
                </div>
            )}
          </div>
          <DialogFooter className="sm:justify-between flex-wrap gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Fechar</Button>
            </DialogClose>
            <div className="flex gap-2 flex-wrap">
            {userType === 'Artista' && (
              <>
                {show.type === 'external' && show.status !== 'payment_confirmed_by_artist' && <Button variant="destructive" size="sm" onClick={() => onDeleteShow && onDeleteShow(show.id, show.date)}>Excluir Show</Button>}
                {show.paymentStatus === 'paid_by_contractor' && !show.paymentConfirmedByArtist && (
                    <Button onClick={() => onConfirmPaymentByArtist && onConfirmPaymentByArtist(show.id, show.date)} className="bg-green-600 hover:bg-green-700 text-white">
                        <Check size={16} className="mr-2" /> Confirmar Recebimento
                    </Button>
                )}
                <Button onClick={handleShare} className="bg-brand-artist hover:bg-brand-artist/90 text-brand-artist-foreground">
                  <Share2 size={16} className="mr-2" /> Divulgar
                </Button>
              </>
            )}
             {userType === 'Contratante' && (show.paymentStatus === 'pending' || show.paymentStatus === 'due') && (
              <Button onClick={() => onUpdateShowStatus && onUpdateShowStatus(show.id, show.date, 'paid_by_contractor')} className="bg-brand-contractor hover:bg-brand-contractor/90 text-brand-contractor-foreground">
                <DollarSign size={16} className="mr-2" /> Marcar como Pago
              </Button>
            )}
            </div>
          </DialogFooter>
        </DialogContent>

        <Dialog open={isPromoArtModalOpen} onOpenChange={setIsPromoArtModalOpen}>
            <ShowPromotionArtModal show={show} artistName={userType === 'Artista' ? 'Você' : show.artist} closeModal={() => setIsPromoArtModalOpen(false)} />
        </Dialog>
        </>
      );
    };
    export default ShowDetailsModal;
  