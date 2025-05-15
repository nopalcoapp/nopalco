
    import React from 'react';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { motion } from 'framer-motion';
    import { Clock, DollarSign, MapPin, Info } from 'lucide-react';
    import { Dialog, DialogTrigger } from "@/components/ui/dialog.jsx";
    import ShowDetailsModal from '@/components/agenda/ShowDetailsModal.jsx';

    const ShowCard = ({ show, index, userType, brandColorClass, onUpdateShowStatus, onDeleteShow, onConfirmPaymentByArtist }) => {
      let statusText = '';
      let statusColorClass = '';

      if (userType === 'Artista') {
        switch (show.status) {
          case 'confirmed': statusText = 'Confirmado'; statusColorClass = 'text-green-400'; break;
          case 'pending': statusText = 'Pendente'; statusColorClass = 'text-yellow-400'; break;
          case 'unavailable': statusText = 'Indisponível (Externo)'; statusColorClass = 'text-blue-400'; break;
          default: statusText = 'Outro'; statusColorClass = 'text-gray-400';
        }
        if (show.paymentStatus === 'paid_by_contractor' && !show.paymentConfirmedByArtist) {
             statusText = 'Pagamento informado pelo Contratante'; statusColorClass = 'text-yellow-400';
        } else if (show.paymentStatus === 'paid_by_contractor' && show.paymentConfirmedByArtist) {
             statusText = 'Recebimento Confirmado'; statusColorClass = 'text-green-400';
        }


      } else { // Contratante
        switch (show.paymentStatus) {
          case 'paid': statusText = 'Pago e Confirmado'; statusColorClass = 'text-green-400'; break;
          case 'paid_by_contractor': statusText = show.paymentConfirmedByArtist ? 'Pago e Confirmado' : 'Pago (Aguard. Artista)'; statusColorClass = show.paymentConfirmedByArtist ? 'text-green-400' : 'text-blue-400'; break;
          case 'pending': statusText = 'Pendente'; statusColorClass = 'text-yellow-400'; break;
          case 'due': statusText = 'Vencido'; statusColorClass = 'text-red-400'; break;
          default: statusText = 'Agendado'; statusColorClass = 'text-gray-400';
        }
      }
      

      return (
        <motion.div
          key={show.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className={`${brandColorClass}`}>{userType === 'Artista' ? show.venue : show.artist}</CardTitle>
              <CardDescription>{show.genre}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {userType === 'Contratante' && <p className="flex items-center"><MapPin size={16} className={`mr-2 ${brandColorClass}`} /> {show.venue}</p>}
              <p className="flex items-center"><Clock size={16} className={`mr-2 ${brandColorClass}`} /> {show.time} {show.endTime ? `até ${show.endTime}`: ''}</p>
              <p className="flex items-center"><DollarSign size={16} className={`mr-2 ${brandColorClass}`} /> R$ {show.payment?.toFixed(2)}</p>
              <p className={`text-xs font-medium ${statusColorClass}`}>
                {userType === 'Artista' ? 'Status Show: ' : 'Pagamento: '} {statusText}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className={`border-${brandColorClass.replace('text-','')} text-${brandColorClass} hover:bg-${brandColorClass.replace('text-','')}/10`}>
                    <Info size={16} className="mr-2" /> Detalhes
                  </Button>
                </DialogTrigger>
                <ShowDetailsModal 
                    show={show} 
                    userType={userType} 
                    onUpdateShowStatus={onUpdateShowStatus} 
                    onDeleteShow={onDeleteShow}
                    onConfirmPaymentByArtist={onConfirmPaymentByArtist}
                />
              </Dialog>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };
    export default ShowCard;
  