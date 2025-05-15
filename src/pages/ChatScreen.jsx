
    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Card } from '@/components/ui/card.jsx';
    import { Send, MessageSquare, ArrowLeft, Info } from 'lucide-react';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import { cn } from '@/lib/utils.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { useParams, useNavigate, useLocation } from 'react-router-dom';

    const mockConversations = [
      { id: 'chat_userArtistId_contractor1_booking1', otherUserId: 'contractor1', otherUserName: 'Restaurante Harmonia', otherUserType: 'Contratante', lastMessage: 'Podemos ajustar o repertório?', timestamp: 'Ontem', unread: 2, avatarQuery: 'restaurant logo design', relatedBookingId: 'booking1', relatedBookingVenue: 'Restaurante Solar' },
      { id: 'chat_userArtistId_contractor2_booking3', otherUserId: 'contractor2', otherUserName: 'Bar Eclipse', otherUserType: 'Contratante', lastMessage: 'Confirmado!', timestamp: 'Segunda', unread: 0, avatarQuery: 'modern bar logo', relatedBookingId: 'booking3', relatedBookingVenue: 'Café Central' },
      { id: 'chat_userContractorId_artist1_bookingShowX', otherUserId: 'artist1', otherUserName: 'Banda Som Celestial', otherUserType: 'Artista', lastMessage: 'Combinado! Até lá.', timestamp: '10:30', unread: 0, avatarQuery: 'acoustic band logo', relatedBookingId: 'bookingShowX', relatedBookingVenue: 'Evento Privado Y' },
    ];

    const mockMessages = {
      'chat_userArtistId_contractor1_booking1': [
        { id: 'msg1', senderId: 'user', text: 'Olá! Sobre o show no Restaurante Solar...', time: 'Ontem 14:50' },
        { id: 'msg2', senderId: 'contractor1', text: 'Olá! Sim?', time: 'Ontem 14:50' },
        { id: 'msg3', senderId: 'contractor1', text: 'Podemos ajustar o repertório?', time: 'Ontem 14:51' },
      ],
      'chat_userArtistId_contractor2_booking3': [
        { id: 'msg4', senderId: 'user', text: 'Tudo pronto para o Café Central?', time: 'Segunda 09:15' },
        { id: 'msg5', senderId: 'contractor2', text: 'Confirmado!', time: 'Segunda 09:20' },
      ],
      'chat_userContractorId_artist1_bookingShowX': [
        { id: 'msg6', senderId: 'user', text: 'Oi, Banda Som Celestial! Tudo certo para o show?', time: '10:28' },
        { id: 'msg7', senderId: 'artist1', text: 'Tudo certo sim! Animados!', time: '10:29' },
        { id: 'msg8', senderId: 'user', text: 'Ótimo!', time: '10:29' },
        { id: 'msg9', senderId: 'artist1', text: 'Combinado! Até lá.', time: '10:30' },
      ]
    };


    const ChatScreen = () => {
      const [user] = useLocalStorage('no-palco-user', null);
      const { conversationId: paramConversationId } = useParams();
      const location = useLocation();
      const navigate = useNavigate();
      const { toast } = useToast();
      
      const [selectedConversationId, setSelectedConversationId] = useState(paramConversationId || null);
      const [messageInput, setMessageInput] = useState('');

      useEffect(() => {
        if (paramConversationId) {
            setSelectedConversationId(paramConversationId);
        }
         if (location.state?.bookingDetails && !paramConversationId) {
           const { bookingDetails, otherPartyName, otherPartyType } = location.state;
           const newConversationId = `chat_${user?.id}_${bookingDetails.contractorId || bookingDetails.artistId}_${bookingDetails.id}`;
           
           const existingConvo = mockConversations.find(c => c.id === newConversationId);
           if(!existingConvo) {
                mockConversations.unshift({
                    id: newConversationId,
                    otherUserId: bookingDetails.contractorId || bookingDetails.artistId,
                    otherUserName: otherPartyName,
                    otherUserType: otherPartyType,
                    lastMessage: 'Nova conversa iniciada sobre o show.',
                    timestamp: 'Agora',
                    unread: 0,
                    avatarQuery: otherPartyType === 'Contratante' ? 'restaurant logo design' : 'musician portrait',
                    relatedBookingId: bookingDetails.id,
                    relatedBookingVenue: bookingDetails.venueName
                });
                if(!mockMessages[newConversationId]) mockMessages[newConversationId] = [];
           }
           setSelectedConversationId(newConversationId);
           navigate(`/mensagens/${newConversationId}`, { replace: true }); 
        }
      }, [paramConversationId, location.state, user?.id, navigate]);
      
      const conversationsForUser = mockConversations.filter(c => {
        const parts = c.id.split('_');
        return (user?.type === 'Artista' && parts[1] === user?.id) || (user?.type === 'Contratante' && parts[2] === user?.id) || c.id.includes(user?.id);
      });

      const selectedConversation = conversationsForUser.find(c => c.id === selectedConversationId);
      const messages = selectedConversationId ? mockMessages[selectedConversationId] || [] : [];

      const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedConversationId) return;
        
        const newMessage = {
            id: `msg-${Date.now()}`,
            senderId: user?.id, 
            text: messageInput,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'})
        };

        if(mockMessages[selectedConversationId]){
            mockMessages[selectedConversationId].push(newMessage);
        } else {
            mockMessages[selectedConversationId] = [newMessage];
        }
        
        const convoIndex = mockConversations.findIndex(c => c.id === selectedConversationId);
        if (convoIndex > -1) {
            mockConversations[convoIndex].lastMessage = messageInput;
            mockConversations[convoIndex].timestamp = 'Agora';
        }

        toast({title: "Mensagem Enviada (Simulação)", description: `"${messageInput}" para ${selectedConversation.otherUserName}`});
        setMessageInput('');
      };
      

      if (!user) return <p className="text-center text-muted-foreground p-10">Faça login para ver suas mensagens.</p>;

      const brandColor = user.type === 'Artista' ? 'brand-artist' : 'brand-contractor';

      if (selectedConversationId && selectedConversation) {
        return (
          <motion.div 
            className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-80px)] bg-card/70 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <header className={`flex items-center p-3 border-b border-border/50 bg-${brandColor}/10`}>
              <Button variant="ghost" size="icon" onClick={() => {setSelectedConversationId(null); navigate('/mensagens')}} className="mr-2">
                <ArrowLeft className={`h-5 w-5 text-${brandColor}`} />
              </Button>
              <Avatar className="h-10 w-10 mr-3 border-2 border-border">
                <img  class="object-cover w-full h-full" alt={selectedConversation.otherUserName} src="https://images.unsplash.com/photo-1697256200022-f61abccad430" />
                <AvatarFallback>{selectedConversation.otherUserName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className={`text-lg font-semibold text-${brandColor}`}>{selectedConversation.otherUserName}</h2>
                <p className="text-xs text-muted-foreground">Referente a: {selectedConversation.relatedBookingVenue}</p>
              </div>
            </header>
            <div className="flex-grow p-4 space-y-3 overflow-y-auto">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-2.5 rounded-xl ${msg.senderId === user.id ? `bg-${brandColor} text-${brandColor}-foreground rounded-br-none` : 'bg-muted text-foreground rounded-bl-none'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.senderId === user.id ? 'text-right text-white/70' : 'text-left text-muted-foreground/70'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
               <p className="text-xs text-center text-muted-foreground py-4">Este é um chat simulado. As mensagens não são persistidas.</p>
            </div>
            <form onSubmit={handleSendMessage} className="p-3 border-t border-border/50 bg-card flex items-center gap-2">
              <Input 
                value={messageInput} 
                onChange={(e) => setMessageInput(e.target.value)} 
                placeholder="Digite sua mensagem..." 
                className="flex-grow bg-background/50 dark:bg-slate-800/50 border-border dark:border-slate-700 focus:border-brand-yellow"
              />
              <Button type="submit" size="icon" className={`bg-${brandColor} hover:bg-${brandColor}/90 text-${brandColor}-foreground`}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        );
      }

      return (
        <motion.div
          className="space-y-4 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="py-4">
            <h1 className={`text-3xl font-bold text-${brandColor} flex items-center`}><MessageSquare className="mr-2"/>Mensagens</h1>
            <p className="text-muted-foreground">Suas conversas sobre shows confirmados.</p>
             {user?.type === 'Artista' && <p className="text-xs text-muted-foreground mt-1 flex items-center"><Info size={12} className="mr-1"/> O chat é iniciado a partir da aba 'Alertas' após um show ser aceito.</p>}
             {user?.type === 'Contratante' && <p className="text-xs text-muted-foreground mt-1 flex items-center"><Info size={12} className="mr-1"/> Para iniciar um chat, vá para o perfil do artista após a confirmação do show.</p>}

          </header>
          {conversationsForUser.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">Nenhuma conversa iniciada.</p>
          ) : (
            <div className="space-y-2">
              {conversationsForUser.map((convo, index) => (
                <motion.div
                  key={convo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                <Card 
                  onClick={() => {setSelectedConversationId(convo.id); navigate(`/mensagens/${convo.id}`)}}
                  className="p-3 cursor-pointer hover:bg-muted/50 transition-colors bg-card/80 backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-border">
                       <img  class="object-cover w-full h-full" alt={convo.otherUserName} src="https://images.unsplash.com/photo-1620886434979-5cc4ddc31858" />
                      <AvatarFallback>{convo.otherUserName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-semibold truncate ${convo.unread > 0 ? `text-${brandColor}` : 'text-foreground'}`}>{convo.otherUserName}</h3>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{convo.timestamp}</span>
                      </div>
                      <p className={`text-sm truncate ${convo.unread > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{convo.lastMessage}</p>
                      <p className="text-xs text-muted-foreground/80 truncate">Show: {convo.relatedBookingVenue}</p>
                    </div>
                    {convo.unread > 0 && (
                      <div className={`h-5 w-5 rounded-full bg-${brandColor} flex items-center justify-center text-xs text-${brandColor}-foreground flex-shrink-0`}>
                        {convo.unread}
                      </div>
                    )}
                  </div>
                </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      );
    };

    export default ChatScreen;
  