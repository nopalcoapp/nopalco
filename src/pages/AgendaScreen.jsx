
    import React, { useState, useMemo, useEffect } from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { motion } from 'framer-motion';
    import { PlusCircle, Settings2, Building, Download, Users2 } from 'lucide-react';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import AgendaCalendar from '@/components/agenda/AgendaCalendar.jsx';
    import ShowCard from '@/components/agenda/ShowCard.jsx';
    import AddEditShowModal from '@/components/agenda/AddEditShowModal.jsx';
    import ContractorAgendaSettingsModal from '@/components/agenda/ContractorAgendaSettingsModal.jsx';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu.jsx";

    const initialArtistAgenda = {
      '2025-05-15': [{ id: 1, artist: 'Você', venue: 'Restaurante Harmonia', time: '20:00', endTime: '22:00', interval: '15 min', genre: 'MPB Acústico', status: 'confirmed', payment: 350.00, details: 'Show de MPB para jantar especial.', photoQuery: 'musician with acoustic guitar on cozy stage', type: 'platform', paymentStatus: 'paid_by_contractor', paymentConfirmedByArtist: false, artistProfileImageUrl: 'https://images.unsplash.com/photo-1599856413870-40540dd55110', contractorId: 'contractor1', establishmentId: 'establishment1' }],
      '2025-05-20': [{ id: 5, artist: 'Você', venue: 'Praça da Cidade', time: '17:00', endTime: '18:00', interval: '0 min', genre: 'Voz e Violão', status: 'unavailable', payment: 0, details: 'Show beneficente (externo).', type: 'external', paymentStatus: 'not_applicable', artistProfileImageUrl: 'https://images.unsplash.com/photo-1599856413870-40540dd55110' }],
      '2025-05-28': [{ id: 4, artist: 'Você', venue: 'Evento Corporativo X', time: '19:00', endTime: '21:00', interval: '20 min', genre: 'Pop Rock', status: 'pending', payment: 750.00, details: 'Abertura de evento empresarial.', photoQuery: 'singer performing at corporate event stage', type: 'platform', paymentStatus: 'pending', artistProfileImageUrl: 'https://images.unsplash.com/photo-1599856413870-40540dd55110', contractorId: 'contractor2', establishmentId: 'establishment2' }],
      '2025-06-03': [{ id: 'show-future-confirmed', artist: 'Você', venue: 'Festival da Primavera', time: '18:00', endTime: '19:30', interval: '10 min', genre: 'Indie Folk', status: 'confirmed', payment: 500.00, details: 'Apresentação no palco principal.', photoQuery: 'folk singer on outdoor stage', type: 'platform', paymentStatus: 'pending', artistProfileImageUrl: 'https://images.unsplash.com/photo-1599856413870-40540dd55110', contractorId: 'contractor1', establishmentId: 'establishment1' }],
      '2025-06-12': [{ id: 'show-future-confirmed-2', artist: 'Você', venue: 'Aniversário Particular', time: '20:30', endTime: '22:00', interval: '15 min', genre: 'Variado', status: 'confirmed', payment: 600.00, details: 'Festa de aniversário.', photoQuery: 'musician at private party', type: 'platform', paymentStatus: 'pending', artistProfileImageUrl: 'https://images.unsplash.com/photo-1599856413870-40540dd55110', contractorId: 'contractor-private', establishmentId: 'private-event' }],
    };

    const initialContractorAgendaByEstablishment = {
      'establishment1': {
        '2025-05-15': [{ id: 'show1-e1', artist: 'Banda Som Celestial', venue: 'Restaurante Harmonia', time: '20:00', genre: 'MPB Acústico', status: 'confirmed', payment: 350.00, paymentStatus: 'paid_by_contractor', paymentConfirmedByArtist: false, artistId: 'banda-som-celestial', establishmentId: 'establishment1', artistProfileImageUrl: 'https://images.unsplash.com/photo-1535389351109-7f656ed55699' }],
        '2025-05-28': [{ id: 'show2-e1', artist: 'DJ Vibração Noturna', venue: 'Restaurante Harmonia', time: '22:00', genre: 'Eletrônica', status: 'pending', payment: 400.00, paymentStatus: 'pending', artistId: 'dj-vibracao-noturna', establishmentId: 'establishment1', artistProfileImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2' }],
        '2025-06-07': [{ id: 'show-future-contractor', artist: 'Artista Revelação', venue: 'Restaurante Harmonia', time: '21:00', genre: 'Pop', status: 'confirmed', payment: 300.00, paymentStatus: 'pending', artistId: 'artista-revelacao', establishmentId: 'establishment1', artistProfileImageUrl: 'https://images.unsplash.com/photo-1582971805810-b24306e2cbc5' }],
        '2025-06-14': [{ id: 'show-future-contractor-2', artist: 'Nova Voz MPB', venue: 'Restaurante Harmonia', time: '20:00', genre: 'MPB', status: 'confirmed', payment: 320.00, paymentStatus: 'pending', artistId: 'nova-voz-mpb', establishmentId: 'establishment1', artistProfileImageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1' }],
      },
      'establishment2': {
        '2025-06-10': [{ id: 'show3-e2', artist: 'Trio Jazz & Alma', venue: 'Bar Eclipse', time: '19:30', genre: 'Jazz Instrumental', status: 'confirmed', payment: 300.00, paymentStatus: 'due', artistId: 'trio-jazz-alma', establishmentId: 'establishment2', artistProfileImageUrl: 'https://images.unsplash.com/photo-1600759837110-adb2100cc9b6' }],
      }
    };
    
    const DEFAULT_CONTRACTOR_MUSIC_DAYS = [4, 5, 6, 0]; 
    const initialEstablishmentsData = [
        { id: 'establishment1', name: 'Restaurante Harmonia', logoUrl: 'https://images.unsplash.com/photo-1688046671828-c26b7fd54596' },
        { id: 'establishment2', name: 'Bar Eclipse', logoUrl: 'https://images.unsplash.com/photo-1617576632001-de009c6a1237' },
        { id: 'establishment3', name: 'Café Melodia (Novo)', logoUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8' },
    ];

    const AgendaScreen = () => {
      const [selectedDate, setSelectedDate] = React.useState(new Date());
      const { toast } = useToast();
      const [user] = useLocalStorage('no-palco-user', null);
      const [artistAgenda, setArtistAgenda] = useLocalStorage('no-palco-artist-agenda', initialArtistAgenda);
      
      const [contractorAgendaByEstablishment, setContractorAgendaByEstablishment] = useLocalStorage('no-palco-contractor-agenda-all', initialContractorAgendaByEstablishment);
      const [establishmentsList, setEstablishmentsList] = useLocalStorage(`no-palco-establishments-${user?.id}`, initialEstablishmentsData);
      const [selectedEstablishmentId, setSelectedEstablishmentId] = useLocalStorage('no-palco-selected-establishment', establishmentsList[0]?.id || 'establishment1');
      
      const [contractorMusicDays, setContractorMusicDays] = useLocalStorage(`no-palco-music-days-${user?.id}-${selectedEstablishmentId}`, DEFAULT_CONTRACTOR_MUSIC_DAYS);
      
      const [isAddShowModalOpen, setIsAddShowModalOpen] = useState(false);
      const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

      useEffect(() => {
        const musicDaysForCurrentEst = JSON.parse(localStorage.getItem(`no-palco-music-days-${user?.id}-${selectedEstablishmentId}`)) || DEFAULT_CONTRACTOR_MUSIC_DAYS;
        setContractorMusicDays(musicDaysForCurrentEst);
      }, [selectedEstablishmentId, user?.id]);

      const contractorAgenda = useMemo(() => contractorAgendaByEstablishment[selectedEstablishmentId] || {}, [contractorAgendaByEstablishment, selectedEstablishmentId]);

      const brandColorClass = user?.type === 'Artista' ? 'text-brand-artist' : 'text-brand-contractor';
      const brandButtonClass = user?.type === 'Artista' ? 'bg-brand-artist hover:bg-brand-artist/90 text-brand-artist-foreground' : 'bg-brand-contractor hover:bg-brand-contractor/90 text-brand-contractor-foreground';
      
      const updateShowInAgenda = (agendaSetter, showId, dateKey, updateFn, isContractor = false) => {
        if (isContractor) {
            setContractorAgendaByEstablishment(prevAll => {
                const currentEstablishmentAgenda = prevAll[selectedEstablishmentId] || {};
                const updatedDayAgenda = (currentEstablishmentAgenda[dateKey] || []).map(s => s.id === showId ? updateFn(s) : s);
                return {
                    ...prevAll,
                    [selectedEstablishmentId]: {
                        ...currentEstablishmentAgenda,
                        [dateKey]: updatedDayAgenda
                    }
                };
            });
        } else {
            agendaSetter(prev => {
                const updatedAgenda = { ...prev };
                if (!updatedAgenda[dateKey]) return prev; 
                
                const showIndex = updatedAgenda[dateKey].findIndex(s => s.id === showId);
                if (showIndex > -1) {
                    updatedAgenda[dateKey][showIndex] = updateFn(updatedAgenda[dateKey][showIndex]);
                } else { return prev; }
                return updatedAgenda;
            });
        }
      };

      const handleSaveArtistShow = (newShow) => {
        setArtistAgenda(prev => {
            const updatedAgenda = { ...prev };
            const dateKey = newShow.date;

            Object.keys(updatedAgenda).forEach(dKey => {
                updatedAgenda[dKey] = updatedAgenda[dKey].filter(s => s.id !== newShow.id || s.date === dateKey);
            });
            
            if (updatedAgenda[dateKey] && updatedAgenda[dateKey].length === 0 && dateKey !== newShow.date) {
                delete updatedAgenda[dateKey];
            }
            
            if (!updatedAgenda[dateKey]) updatedAgenda[dateKey] = [];
            
            const existingShowIndex = updatedAgenda[dateKey].findIndex(s => s.id === newShow.id);
            if (existingShowIndex > -1) {
                updatedAgenda[dateKey][existingShowIndex] = newShow;
            } else {
                updatedAgenda[dateKey].push(newShow);
            }
            toast({title: "Show Salvo!", description: `${newShow.venue} foi ${existingShowIndex > -1 ? 'atualizado' : 'adicionado'} à sua agenda.`});
            return updatedAgenda;
        });
      };

      const handleDeleteArtistShow = (showId, showDate) => {
         setArtistAgenda(prev => {
            const updatedAgenda = { ...prev };
            if (updatedAgenda[showDate]) {
                updatedAgenda[showDate] = updatedAgenda[showDate].filter(s => s.id !== showId);
                if(updatedAgenda[showDate].length === 0) delete updatedAgenda[showDate];
            }
            toast({title: "Show Removido!", description: "O show externo foi removido da sua agenda."});
            return updatedAgenda;
        });
      };

      const handleUpdateContractorShowStatus = (showId, showDate, newPaymentStatus) => {
        updateShowInAgenda(setContractorAgendaByEstablishment, showId, showDate, (show) => ({...show, paymentStatus: newPaymentStatus}), true);
        
        if(newPaymentStatus === 'paid_by_contractor') {
            toast({ title: "Pagamento Marcado!", description: "O pagamento foi marcado como realizado. Aguardando confirmação do artista." });
            
             setArtistAgenda(prevArtistAgenda => {
                const updatedArtistAgenda = {...prevArtistAgenda};
                Object.keys(updatedArtistAgenda).forEach(dateKey => {
                    const showIndex = updatedArtistAgenda[dateKey].findIndex(s => s.id === showId); 
                    if(showIndex > -1) {
                        updatedArtistAgenda[dateKey][showIndex] = {...updatedArtistAgenda[dateKey][showIndex], paymentStatus: 'paid_by_contractor', paymentConfirmedByArtist: false};
                    }
                });
                return updatedArtistAgenda;
            });
        }
      };
      
      const handleConfirmPaymentByArtist = (showId, showDate) => {
        updateShowInAgenda(setArtistAgenda, showId, showDate, (show) => ({...show, paymentStatus: 'paid_by_contractor', paymentConfirmedByArtist: true}), false);
        toast({ title: "Recebimento Confirmado!", description: "Pagamento confirmado com sucesso." });

         setContractorAgendaByEstablishment(prevAll => {
            let updatedAll = {...prevAll};
            Object.keys(updatedAll).forEach(estId => {
                const currentEstAgenda = updatedAll[estId] || {};
                let estAgendaChanged = false;
                const newEstAgendaForDay = (currentEstAgenda[showDate] || []).map(s => {
                    if (s.id === showId) {
                        estAgendaChanged = true;
                        return {...s, paymentConfirmedByArtist: true, paymentStatus: 'paid'};
                    }
                    return s;
                });
                if (estAgendaChanged) {
                    updatedAll[estId] = {
                        ...currentEstAgenda,
                        [showDate]: newEstAgendaForDay
                    };
                }
            });
            return updatedAll;
        });
      };


      const handleDateSelect = (date) => {
        setSelectedDate(date);
      };
      
      const selectedDateString = selectedDate.toISOString().split('T')[0];
      const showsForSelectedDate = useMemo(() => {
        const currentAgenda = user?.type === 'Artista' ? artistAgenda : contractorAgenda;
        return currentAgenda[selectedDateString] ? currentAgenda[selectedDateString].map(s => ({...s, date: selectedDateString })) : [];
      }, [selectedDateString, artistAgenda, contractorAgenda, user?.type]);

      const handleSaveContractorSettings = (newMusicDays) => {
        localStorage.setItem(`no-palco-music-days-${user?.id}-${selectedEstablishmentId}`, JSON.stringify(newMusicDays));
        setContractorMusicDays(newMusicDays);
        toast({ title: "Configurações Salvas!", description: "Seus dias de música preferidos foram atualizados." });
      };
      
      const selectedEstablishment = establishmentsList.find(e => e.id === selectedEstablishmentId);
      const selectedEstablishmentName = selectedEstablishment?.name || 'Estabelecimento';
      const selectedEstablishmentLogo = selectedEstablishment?.logoUrl;


      const handleDownloadWeeklyPromo = () => {
        toast({ title: "Download Simulado", description: "Artes da semana seriam baixadas aqui." });
      };


      return (
        <motion.div 
          className="space-y-6 pb-20 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                {user?.type === 'Contratante' && selectedEstablishmentLogo && (
                    <Avatar className="h-12 w-12 rounded-md border border-border">
                        <AvatarImage src={selectedEstablishmentLogo} alt={`Logo ${selectedEstablishmentName}`} className="object-contain"/>
                        <AvatarFallback className="rounded-md bg-muted">{selectedEstablishmentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div>
                    <h1 className={`${brandColorClass} text-3xl font-bold`}>Agenda de Shows</h1>
                    <p className="text-muted-foreground">
                    {user?.type === 'Artista' ? 'Seus shows agendados.' : `Shows para ${selectedEstablishmentName}.`}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                {user?.type === 'Artista' && (
                    <>
                        <Button className={`${brandButtonClass}`} onClick={() => setIsAddShowModalOpen(true)}>
                            <PlusCircle size={18} className="mr-2" /> Adicionar Show
                        </Button>
                        <Button variant="outline" onClick={handleDownloadWeeklyPromo} className={`border-${brandColorClass.replace('text-','')} text-${brandColorClass} hover:bg-${brandColorClass.replace('text-','')}/10`}>
                            <Download size={18} className="mr-2" /> Divulgações da Semana
                        </Button>
                    </>
                )}
                {user?.type === 'Contratante' && (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={`border-${brandColorClass.replace('text-','')} text-${brandColorClass} hover:bg-${brandColorClass.replace('text-','')}/10`}>
                                    <Building size={16} className="mr-2"/> {selectedEstablishmentName}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-card border-border">
                                <DropdownMenuLabel>Selecionar Estabelecimento</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {establishmentsList.map(est => (
                                    <DropdownMenuItem key={est.id} onSelect={() => setSelectedEstablishmentId(est.id)} className={`focus:bg-${brandColorClass.replace('text-','')}/20`}>
                                        {est.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="outline" className={`border-${brandColorClass.replace('text-','')} text-${brandColorClass} hover:bg-${brandColorClass.replace('text-','')}/10`} onClick={() => setIsSettingsModalOpen(true)}>
                            <Settings2 size={18} className="mr-2" /> Configurar Dias
                        </Button>
                    </>
                )}
            </div>
          </header>

          <AgendaCalendar
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            artistAgenda={artistAgenda}
            contractorAgenda={contractorAgenda}
            userType={user?.type}
            contractorMusicDays={contractorMusicDays}
            brandColorClass={brandColorClass}
            brandButtonClass={brandButtonClass}
          />
          
          <section>
            <h2 className={`text-2xl font-semibold mb-4 ${brandColorClass}`}>
              Eventos para {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
              {user?.type === 'Contratante' && ` (${selectedEstablishmentName})`}
            </h2>
            {showsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {showsForSelectedDate.map((show, index) => (
                  <ShowCard
                    key={show.id}
                    show={show}
                    index={index}
                    userType={user?.type}
                    brandColorClass={brandColorClass}
                    onUpdateShowStatus={handleUpdateContractorShowStatus}
                    onDeleteShow={handleDeleteArtistShow}
                    onConfirmPaymentByArtist={handleConfirmPaymentByArtist}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhum show agendado para esta data {user?.type === 'Contratante' && `em ${selectedEstablishmentName}`}.</p>
            )}
          </section>
           {user?.type === 'Artista' && (
                <AddEditShowModal 
                    isOpen={isAddShowModalOpen} 
                    setIsOpen={setIsAddShowModalOpen} 
                    onSaveShow={handleSaveArtistShow}
                    selectedDateProp={selectedDate}
                />
            )}
            {user?.type === 'Contratante' && (
                <ContractorAgendaSettingsModal
                    isOpen={isSettingsModalOpen}
                    setIsOpen={setIsSettingsModalOpen}
                    currentMusicDays={contractorMusicDays}
                    onSave={handleSaveContractorSettings}
                />
            )}
        </motion.div>
      );
    };

    export default AgendaScreen;
  