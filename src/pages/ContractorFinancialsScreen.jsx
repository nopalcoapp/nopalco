
    import React, { useState, useMemo } from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { DollarSign, BarChart2, CreditCard, CheckCircle2, AlertTriangle, CalendarDays, Download, Filter, Users, Copy, Check, Building } from 'lucide-react';
    import { motion } from 'framer-motion';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    } from "@/components/ui/select.jsx";
    import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu.jsx";


    const mockFinancialDataContractor = {
     'establishment1': [
        { id: 'show1-e1', date: '2025-05-15', artist: 'Banda Som Celestial', venue: 'Restaurante Harmonia', amount: 350.00, status: 'paid', paymentConfirmedByArtist: true, pixKey: 'celestial@pix.com' },
        { id: 'show2-e1', date: '2025-05-28', artist: 'DJ Vibração Noturna', venue: 'Restaurante Harmonia', amount: 400.00, status: 'pending_payment', paymentConfirmedByArtist: false, pixKey: 'djvibracao@pix.com' },
      ],
      'establishment2': [
        { id: 'show3-e2', date: '2025-06-10', artist: 'Trio Jazz & Alma', venue: 'Bar Eclipse', amount: 300.00, status: 'due', paymentConfirmedByArtist: false, pixKey: 'jazzalma@pix.com' },
        { id: 'show4-e2', date: '2025-04-01', artist: 'Rock Cover Brasil', venue: 'Bar Eclipse', amount: 600.00, status: 'paid', paymentConfirmedByArtist: true, pixKey: 'rockcover@pix.com' },
      ]
    };

    const establishments = [
        { id: 'establishment1', name: 'Restaurante Harmonia' },
        { id: 'establishment2', name: 'Bar Eclipse' },
        { id: 'establishment3', name: 'Café Melodia (Novo)' },
    ];
    
    const ContractorFinancialsScreen = () => {
      const [user] = useLocalStorage('no-palco-user', null);
      const [allFinancials, setAllFinancials] = useLocalStorage(`no-palco-contractor-financials-all-${user?.id}`, mockFinancialDataContractor);
      const [selectedEstablishmentId, setSelectedEstablishmentId] = useState(establishments[0].id);
      
      const financials = allFinancials[selectedEstablishmentId] || [];

      const setFinancialsForCurrentEstablishment = (newFinancialsCallback) => {
        setAllFinancials(prevAll => {
            const currentEstablishmentData = prevAll[selectedEstablishmentId] || [];
            const updatedData = typeof newFinancialsCallback === 'function' ? newFinancialsCallback(currentEstablishmentData) : newFinancialsCallback;
            return {
                ...prevAll,
                [selectedEstablishmentId]: updatedData
            };
        });
      };


      const [filterPeriod, setFilterPeriod] = useState('weekly'); 
      const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
      const [displayMode, setDisplayMode] = useState('pending'); 
      const { toast } = useToast();

      const brandColor = 'brand-contractor';

      const handleMarkAsPaid = (showId) => {
        setFinancialsForCurrentEstablishment(prev => 
            prev.map(item => 
                item.id === showId ? { ...item, status: 'paid_by_contractor' } : item
            )
        );
        toast({ title: "Pagamento Registrado", description: "O pagamento foi marcado como realizado. Aguardando confirmação do artista."});
      };


      const getWeekRange = (offset = 0) => {
        const today = new Date();
        const currentDay = today.getDay(); 
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - currentDay + (offset * 7)); 
        startDate.setHours(0,0,0,0);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); 
        endDate.setHours(23,59,59,999);
        return { startDate, endDate };
      };
      
      const filteredFinancials = useMemo(() => {
        let dataToFilter = financials;
        if (displayMode === 'pending') {
            dataToFilter = financials.filter(item => item.status === 'pending_payment' || item.status === 'due');
        } else if (displayMode === 'due') {
            dataToFilter = financials.filter(item => item.status === 'due');
        }


        if (filterPeriod === 'all') return dataToFilter;

        const { startDate, endDate } = getWeekRange(selectedWeekOffset);
        
        return dataToFilter.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }, [financials, filterPeriod, selectedWeekOffset, displayMode]);


      const totalPaidThisWeek = useMemo(() => {
        const { startDate, endDate } = getWeekRange(selectedWeekOffset);
        return financials
            .filter(f => (f.status === 'paid' || (f.status === 'paid_by_contractor' && f.paymentConfirmedByArtist)) && new Date(f.date) >= startDate && new Date(f.date) <= endDate)
            .reduce((sum, item) => sum + item.amount, 0);
      }, [financials, selectedWeekOffset]);


      const pendingPaymentOverall = financials.filter(f => f.status === 'pending_payment').reduce((sum, item) => sum + item.amount, 0);
      const duePaymentOverall = financials.filter(f => f.status === 'due').reduce((sum, item) => sum + item.amount, 0);
      
      const getStatusIcon = (status, confirmedByArtist) => {
        if (status === 'paid' || (status === 'paid_by_contractor' && confirmedByArtist)) return <CheckCircle2 className="text-green-500" />;
        if (status === 'paid_by_contractor' && !confirmedByArtist) return <AlertTriangle className="text-blue-500" />;
        if (status === 'pending_payment') return <AlertTriangle className="text-yellow-500" />;
        if (status === 'due') return <AlertTriangle className="text-red-500" />;
        return <CalendarDays className="text-gray-500" />;
      };
      
      const getStatusText = (status, confirmedByArtist) => {
        if (status === 'paid' || (status === 'paid_by_contractor' && confirmedByArtist)) return "Pago e Confirmado";
        if (status === 'paid_by_contractor' && !confirmedByArtist) return "Pago (Aguard. Confirmação Artista)";
        if (status === 'pending_payment') return "Pendente";
        if (status === 'due') return "Vencido";
        return "Agendado";
      };

      const handlePayNow = (pixKey, showId) => {
        navigator.clipboard.writeText(pixKey);
        toast({
            title: "Chave PIX Copiada!",
            description: `A chave PIX "${pixKey}" foi copiada. Registre o pagamento abaixo.`,
        });
        handleMarkAsPaid(showId);
      };
      
      const currentWeekDisplay = getWeekRange(selectedWeekOffset);
      const weekLabel = `Semana: ${currentWeekDisplay.startDate.toLocaleDateString('pt-BR', {day:'2-digit', month:'short'})} - ${currentWeekDisplay.endDate.toLocaleDateString('pt-BR', {day:'2-digit', month:'short'})}`;
      const selectedEstablishmentName = establishments.find(e => e.id === selectedEstablishmentId)?.name || 'Estabelecimento';


      return (
        <motion.div 
          className="space-y-6 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="py-4 flex justify-between items-center">
            <div>
                <h1 className={`text-3xl font-bold text-${brandColor} flex items-center`}><CreditCard className="mr-2"/>Controle de Pagamentos</h1>
                <p className="text-muted-foreground">Acompanhe os pagamentos dos shows contratados.</p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={`border-${brandColor} text-${brandColor} hover:bg-${brandColor}/10`}>
                        <Building size={16} className="mr-2"/> {selectedEstablishmentName}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border">
                    <DropdownMenuLabel>Selecionar Estabelecimento</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {establishments.map(est => (
                        <DropdownMenuItem key={est.id} onSelect={() => setSelectedEstablishmentId(est.id)} className={`focus:bg-${brandColor}/20`}>
                            {est.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className={`text-${brandColor} flex items-center`}><Filter className="mr-2"/>Filtros e Visualização ({selectedEstablishmentName})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Select value={filterPeriod} onValueChange={(value) => {setFilterPeriod(value); setSelectedWeekOffset(0);}}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-slate-800/50 border-slate-700">
                        <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-slate-700">
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="all">Todos os Pagamentos</SelectItem>
                        </SelectContent>
                    </Select>
                    {filterPeriod === 'weekly' && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => setSelectedWeekOffset(prev => prev - 1)}>Anterior</Button>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">{weekLabel}</span>
                            <Button variant="outline" onClick={() => setSelectedWeekOffset(prev => prev + 1)}>Próxima</Button>
                        </div>
                    )}
                </div>
                 <Tabs value={displayMode} onValueChange={setDisplayMode} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="pending">Pendentes</TabsTrigger>
                        <TabsTrigger value="due">Vencidos</TabsTrigger>
                        <TabsTrigger value="all">Todos</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium text-${brandColor}`}>Pago (Semana)</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {totalPaidThisWeek.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium text-${brandColor}`}>Pendentes (Total)</CardTitle>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {pendingPaymentOverall.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium text-${brandColor}`}>Vencidos (Total)</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {duePaymentOverall.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg bg-card/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className={`text-${brandColor} flex items-center`}><BarChart2 className="mr-2"/>
                {displayMode === 'pending' ? 'Pagamentos Pendentes' : displayMode === 'due' ? 'Pagamentos Vencidos' : 'Histórico de Pagamentos'} ({filterPeriod === 'weekly' ? weekLabel : 'Geral'})
              </CardTitle>
              <Button variant="outline" className={`border-${brandColor} text-${brandColor} hover:bg-${brandColor}/10`}>
                <Download size={16} className="mr-2"/> Exportar
              </Button>
            </CardHeader>
            <CardContent>
              {filteredFinancials.length > 0 ? (
                <ul className="space-y-4">
                  {filteredFinancials.map((item, index) => (
                    <motion.li 
                      key={item.id} 
                      className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border border-slate-700 rounded-lg bg-slate-800/50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="mb-2 sm:mb-0">
                        <p className="font-semibold text-foreground flex items-center"><Users size={16} className="mr-2 text-muted-foreground"/>{item.artist}</p>
                        <p className="text-sm text-muted-foreground ml-6">{item.venue} - {new Date(item.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-lg text-${brandColor}`}>R$ {item.amount.toFixed(2)}</p>
                        <p className={`text-xs flex items-center justify-end ${
                          (item.status === 'paid' || (item.status === 'paid_by_contractor' && item.paymentConfirmedByArtist)) ? 'text-green-400' : 
                          item.status === 'paid_by_contractor' && !item.paymentConfirmedByArtist ? 'text-blue-400' :
                          item.status === 'pending_payment' ? 'text-yellow-400' : 
                          item.status === 'due' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {getStatusIcon(item.status, item.paymentConfirmedByArtist)} <span className="ml-1">{getStatusText(item.status, item.paymentConfirmedByArtist)}</span>
                        </p>
                        {(item.status === 'pending_payment' || item.status === 'due') && (
                            <Button size="sm" className={`mt-2 bg-${brandColor} hover:bg-${brandColor}/90 text-brand-contractor-foreground`} onClick={() => handlePayNow(item.pixKey, item.id)}>
                                <Copy size={14} className="mr-1.5"/> Copiar PIX e Marcar Pago
                            </Button>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-5">Nenhum registro financeiro encontrado para os filtros selecionados.</p>
              )}
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground pt-4">
                Mostrando {filteredFinancials.length} de {financials.length} registros ({selectedEstablishmentName}).
             </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default ContractorFinancialsScreen;
  