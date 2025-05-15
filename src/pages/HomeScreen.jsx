
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { MapPin, CalendarClock, DollarSign, Users, BarChart3, Eye, ListChecks, CreditCard, CheckCircle, XCircle, AlarmClock as ClockIcon, AlertCircle, Sparkles, MessageCircle as MessageCircleQuestion, Bot } from 'lucide-react';
    import { motion } from 'framer-motion';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';

    const mockShowsForContractor = [
      { id: 1, artist: 'Banda Som Celestial', venue: 'Restaurante Harmonia', date: '2025-05-15', time: '20:00', genre: 'MPB Acústico', imageQuery: 'band playing live music in a cozy restaurant', status: 'completed', payment: 'paid' },
      { id: 2, artist: 'DJ Vibração Noturna', venue: 'Bar Eclipse', date: '2025-05-28', time: '22:00', genre: 'Eletrônica', imageQuery: 'DJ playing electronic music at a bar', status: 'upcoming', payment: 'pending' },
      { id: 3, artist: 'Trio Jazz & Alma', venue: 'Café Melodia', date: '2025-06-10', time: '19:30', genre: 'Jazz Instrumental', imageQuery: 'jazz trio performing in a cafe', status: 'upcoming', payment: 'due' },
    ];

    const contractorFinancialSummary = {
      totalPaid: 350.00,
      upcomingPayments: 400.00 + 300.00,
    };

    const artistUpcomingShows = [
        { id: 'show3', date: '2025-05-15', venue: 'Café Melodia', amount: 300.00, status: 'confirmed' },
        { id: 'show4', date: '2025-05-28', venue: 'Evento Corporativo X', amount: 750.00, status: 'confirmed' },
        { id: 'show5', date: '2025-06-05', venue: 'Bar Central', amount: 400.00, status: 'confirmed' },
    ];
    const artistFinancialSummary = {
        pending: 300.00,
        nextPayout: 750.00,
    };


    const HomeScreen = () => {
      const [user] = useLocalStorage('no-palco-user', null);
      const [contractorAgendaByEstablishment] = useLocalStorage('no-palco-contractor-agenda-all', {});
      const [selectedEstablishmentId] = useLocalStorage('no-palco-selected-establishment', 'establishment1');
      const contractorAgenda = contractorAgendaByEstablishment[selectedEstablishmentId] || {};


      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.1, duration: 0.5 }
        },
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
      };

      const checkOpenSlotsForWeek = () => {
        const today = new Date();
        let openSlotsExist = false;
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            const dateString = currentDate.toISOString().split('T')[0];
            const showsOnDay = contractorAgenda[dateString] || [];
            if (showsOnDay.length === 0) { 
                openSlotsExist = true;
                break;
            }
        }
        return openSlotsExist;
      };
      
      const hasOpenSlots = user?.type === 'Contratante' ? checkOpenSlotsForWeek() : false;


      if (!user) {
        return <div className="text-center py-10 text-muted-foreground">Carregando...</div>;
      }

      const commonSections = (
        <motion.section variants={itemVariants}>
            <Card className="bg-card/80 backdrop-blur-sm border-blue-500/30">
                <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center"><Bot className="mr-2"/>Serena IA</CardTitle>
                    <CardDescription>Sua assistente especialista em equipamentos de som e dúvidas gerais. (Simulado)</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Conversar com Serena</Button>
                </CardContent>
            </Card>
        </motion.section>
      );

      if (user.type === 'Artista') {
        return (
          <motion.div 
            className="space-y-6 max-w-2xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.header className="py-4" variants={itemVariants}>
              <h1 className="text-3xl font-bold text-brand-artist">Bem-vindo, {user.name}!</h1>
              <p className="text-muted-foreground">Seu painel No Palco.</p>
            </motion.header>

            <motion.section variants={itemVariants}>
              <Card className="bg-card/80 backdrop-blur-sm border-brand-artist/30">
                <CardHeader>
                  <CardTitle className="text-brand-artist flex items-center"><CalendarClock className="mr-2"/>Próximos Shows</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {artistUpcomingShows.length > 0 ? artistUpcomingShows.map(show => (
                    <div key={show.id} className="p-3 rounded-md bg-background/50 dark:bg-slate-800/50">
                      <p className="font-semibold text-foreground">{show.venue}</p>
                      <p className="text-sm text-muted-foreground">{new Date(show.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})} - R$ {show.amount.toFixed(2)}</p>
                    </div>
                  )) : <p className="text-muted-foreground">Nenhum show agendado.</p>}
                  <Button variant="link" className="text-brand-artist p-0 h-auto" asChild><Link to="/agenda">Ver todos os shows</Link></Button>
                </CardContent>
              </Card>
            </motion.section>

            <motion.section variants={itemVariants}>
              <Card className="bg-card/80 backdrop-blur-sm border-brand-artist/30">
                <CardHeader>
                  <CardTitle className="text-brand-artist flex items-center"><DollarSign className="mr-2"/>Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">Pendente: <span className="font-semibold text-foreground">R$ {artistFinancialSummary.pending.toFixed(2)}</span></p>
                  <p className="text-muted-foreground">Próximo Pagamento: <span className="font-semibold text-foreground">R$ {artistFinancialSummary.nextPayout.toFixed(2)}</span></p>
                  <Button variant="link" className="text-brand-artist p-0 h-auto" asChild><Link to="/financas">Ver detalhes financeiros</Link></Button>
                </CardContent>
              </Card>
            </motion.section>
            {commonSections}
          </motion.div>
        );
      }

      const contractorShowsForDisplay = Object.values(contractorAgenda).flat().slice(0,3);

      return (
        <motion.div 
          className="space-y-6 max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.header className="py-4" variants={itemVariants}>
            <h1 className="text-3xl font-bold text-brand-contractor">Olá, {user.name}!</h1>
            <p className="text-muted-foreground">Seu painel de gerenciamento de shows.</p>
          </motion.header>

          {hasOpenSlots && (
             <motion.section variants={itemVariants}>
                <Card className="bg-yellow-500/10 border-yellow-500/50">
                    <CardHeader className="flex flex-row items-center space-x-3 space-y-0">
                        <AlertCircle className="h-6 w-6 text-yellow-500"/>
                        <CardTitle className="text-yellow-400 text-lg">Programação da Semana</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-yellow-300/90 text-sm">Você possui horários sem shows agendados para esta semana. Que tal encontrar um artista?</p>
                        <Button className="mt-3 bg-brand-contractor hover:bg-brand-contractor/90 text-brand-contractor-foreground" asChild size="sm">
                            <Link to="/buscar-artistas">Encontrar Artistas</Link>
                        </Button>
                    </CardContent>
                </Card>
            </motion.section>
          )}

          <motion.section variants={itemVariants}>
            <Card className="bg-card/80 backdrop-blur-sm border-brand-contractor/30">
              <CardHeader>
                <CardTitle className="text-brand-contractor flex items-center"><ListChecks className="mr-2"/>Resumo dos Shows</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contractorShowsForDisplay.length > 0 ? contractorShowsForDisplay.map(show => ( 
                  <div key={show.id} className="p-3 rounded-md bg-background/50 dark:bg-slate-800/50 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">{show.artist} <span className="text-xs text-muted-foreground">em {show.venue}</span></p>
                      <p className="text-sm text-muted-foreground">{new Date(show.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})} - {show.time}</p>
                    </div>
                    <div className="text-right">
                      {show.status === 'completed' && <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 flex items-center"><CheckCircle size={14} className="mr-1"/>Concluído</span>}
                      {show.status === 'confirmed' && <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 flex items-center"><ClockIcon size={14} className="mr-1"/>Confirmado</span>}
                      {show.status === 'pending' && <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center"><AlertCircle size={14} className="mr-1"/>Pendente</span>}
                    </div>
                  </div>
                )) : <p className="text-muted-foreground">Nenhum show para exibir no resumo.</p>}
                <Button variant="link" className="text-brand-contractor p-0 h-auto" asChild><Link to="/agenda">Ver todos os shows contratados</Link></Button>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section variants={itemVariants}>
            <Card className="bg-card/80 backdrop-blur-sm border-brand-contractor/30">
              <CardHeader>
                <CardTitle className="text-brand-contractor flex items-center"><CreditCard className="mr-2"/>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">Total Pago: <span className="font-semibold text-foreground">R$ {contractorFinancialSummary.totalPaid.toFixed(2)}</span></p>
                <p className="text-muted-foreground">Pagamentos Futuros: <span className="font-semibold text-foreground">R$ {contractorFinancialSummary.upcomingPayments.toFixed(2)}</span></p>
                <Button variant="link" className="text-brand-contractor p-0 h-auto" asChild><Link to="/financas-contratante">Ver detalhes financeiros</Link></Button>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section variants={itemVariants}>
            <Card className="bg-card/80 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center"><Sparkles className="mr-2"/>Recomendações para Você</CardTitle>
                  <CardDescription>Artistas que combinam com seu público e agenda (simulado).</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {['Artista Pop Animado', 'Voz e Violão Suave', 'DJ Eclético'].map(rec => (
                            <div key={rec} className="p-3 bg-background/50 dark:bg-slate-800/50 rounded-md text-center">
                                <Users size={24} className="mx-auto mb-1 text-purple-400"/>
                                <p className="text-xs font-medium text-foreground">{rec}</p>
                            </div>
                        ))}
                    </div>
                   <Button className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white" asChild>
                    <Link to={`/buscar-artistas`}>Ver Recomendações</Link>
                  </Button>
                </CardContent>
              </Card>
          </motion.section>
          {commonSections}
        </motion.div>
      );
    };

    export default HomeScreen;
  