
    import React, { useState } from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { DollarSign, BarChart2, TrendingUp, AlertTriangle, CheckCircle2, CalendarDays, Download, Filter, Check } from 'lucide-react';
    import { motion } from 'framer-motion';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    } from "@/components/ui/select.jsx";
    import { useToast } from '@/components/ui/use-toast.jsx';

    const mockFinancialDataArtist = [
      { id: 'show1', date: '2025-04-20', venue: 'Restaurante Harmonia', amount: 350.00, status: 'received', paymentConfirmedByArtist: true },
      { id: 'show2', date: '2025-05-05', venue: 'Bar Eclipse', amount: 400.00, status: 'received', paymentConfirmedByArtist: true },
      { id: 'show3', date: '2025-05-15', venue: 'Café Melodia', amount: 300.00, status: 'pending_receipt', paymentConfirmedByArtist: false },
      { id: 'show4', date: '2025-05-28', venue: 'Evento Corporativo X', amount: 750.00, status: 'upcoming', paymentConfirmedByArtist: false },
      { id: 'show5', date: '2025-03-10', venue: 'Festa Particular', amount: 500.00, status: 'received', paymentConfirmedByArtist: true },
      { id: 'show6', date: '2024-12-15', venue: 'Show de Natal', amount: 600.00, status: 'received', paymentConfirmedByArtist: true },
      { id: 'show7', date: '2024-11-01', venue: 'Evento Beneficente (Externo)', amount: 250.00, status: 'pending_receipt', paymentConfirmedByArtist: false, type: 'external' },
    ];
    
    const FinancialsScreen = () => {
      const [user] = useLocalStorage('no-palco-user', null);
      const [financials, setFinancials] = useLocalStorage(`no-palco-financials-${user?.id}`, mockFinancialDataArtist);
      const [filterPeriod, setFilterPeriod] = useState('all'); // 'all', 'monthly', 'yearly'
      const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
      const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
      const { toast } = useToast();

      const brandColor = user?.type === 'Artista' ? 'text-brand-artist' : 'text-brand-contractor';

      const handleConfirmReceipt = (showId) => {
        setFinancials(prev => 
          prev.map(item => 
            item.id === showId ? { ...item, paymentConfirmedByArtist: true, status: 'received' } : item
          )
        );
        toast({ title: "Recebimento Confirmado!", description: "Você confirmou o recebimento deste pagamento." });
      };

      const getFilteredFinancials = () => {
        if (filterPeriod === 'all') return financials;
        return financials.filter(item => {
          const itemDate = new Date(item.date);
          if (filterPeriod === 'monthly') {
            return itemDate.getFullYear() === selectedYear && itemDate.getMonth() + 1 === selectedMonth;
          }
          if (filterPeriod === 'yearly') {
            return itemDate.getFullYear() === selectedYear;
          }
          return true;
        });
      };

      const filteredData = getFilteredFinancials();

      const totalEarned = filteredData.filter(f => f.status === 'received' && f.paymentConfirmedByArtist).reduce((sum, item) => sum + item.amount, 0);
      const pendingReceipt = filteredData.filter(f => f.status === 'pending_receipt' && !f.paymentConfirmedByArtist).reduce((sum, item) => sum + item.amount, 0);
      const upcomingValue = filteredData.filter(f => f.status === 'upcoming').reduce((sum, item) => sum + item.amount, 0);
      const showsCount = filteredData.length;
      
      const getStatusIcon = (status, confirmed) => {
        if (status === 'received' && confirmed) return <CheckCircle2 className="text-green-500" />;
        if (status === 'pending_receipt' && !confirmed) return <AlertTriangle className="text-yellow-500" />;
        if (status === 'upcoming') return <CalendarDays className="text-blue-500" />;
        return <AlertTriangle className="text-orange-500" />;
      };
      
      const getStatusText = (status, confirmed) => {
        if (status === 'received' && confirmed) return "Recebido";
        if (status === 'pending_receipt' && !confirmed) return "Recebimento Pendente";
        if (status === 'upcoming') return "Show Futuro";
        return "Status Desconhecido";
      };

      const years = Array.from(new Set(financials.map(item => new Date(item.date).getFullYear()))).sort((a,b) => b-a);
      const months = [
        {value: 1, label: 'Janeiro'}, {value: 2, label: 'Fevereiro'}, {value: 3, label: 'Março'},
        {value: 4, label: 'Abril'}, {value: 5, label: 'Maio'}, {value: 6, label: 'Junho'},
        {value: 7, label: 'Julho'}, {value: 8, label: 'Agosto'}, {value: 9, label: 'Setembro'},
        {value: 10, label: 'Outubro'}, {value: 11, label: 'Novembro'}, {value: 12, label: 'Dezembro'}
      ];

      return (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="py-4">
            <h1 className={`text-3xl font-bold text-${brandColor} flex items-center`}><DollarSign className="mr-2"/>Controle Financeiro</h1>
            <p className="text-muted-foreground">Acompanhe seus recebimentos.</p>
          </header>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className={`text-${brandColor} flex items-center`}><Filter className="mr-2"/>Filtrar Relatório</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-full sm:w-[180px] bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent className="bg-card border-slate-700">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
              {filterPeriod !== 'all' && (
                <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(parseInt(val))}>
                  <SelectTrigger className="w-full sm:w-[120px] bg-slate-800/50 border-slate-700">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-slate-700">
                    {years.map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
              {filterPeriod === 'monthly' && (
                <Select value={selectedMonth.toString()} onValueChange={(val) => setSelectedMonth(parseInt(val))}>
                  <SelectTrigger className="w-full sm:w-[150px] bg-slate-800/50 border-slate-700">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-slate-700">
                    {months.map(month => <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium text-${brandColor}`}>Total Recebido</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {totalEarned.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium text-${brandColor}`}>Recebimentos Pendentes</CardTitle>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {pendingReceipt.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium text-${brandColor}`}>Shows Futuros (Valor)</CardTitle>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {upcomingValue.toFixed(2)}</div>
              </CardContent>
            </Card>
             <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium text-${brandColor}`}>Nº de Shows (Período)</CardTitle>
                <CalendarDays className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{showsCount}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg bg-card/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className={`text-${brandColor} flex items-center`}><BarChart2 className="mr-2"/>Histórico de Shows</CardTitle>
              <Button variant="outline" className={`border-${brandColor} text-${brandColor} hover:bg-${brandColor}/10`}>
                <Download size={16} className="mr-2"/> Exportar Relatório
              </Button>
            </CardHeader>
            <CardContent>
              {filteredData.length > 0 ? (
                <ul className="space-y-4">
                  {filteredData.map((item, index) => (
                    <motion.li 
                      key={item.id} 
                      className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border border-slate-700 rounded-lg bg-slate-800/50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="mb-2 sm:mb-0">
                        <p className="font-semibold text-foreground">{item.venue} {item.type === 'external' && <span className="text-xs text-muted-foreground">(Externo)</span>}</p>
                        <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className={`font-semibold text-lg text-${brandColor}`}>R$ {item.amount.toFixed(2)}</p>
                        <p className={`text-xs flex items-center justify-end ${
                          item.status === 'received' && item.paymentConfirmedByArtist ? 'text-green-400' : 
                          item.status === 'pending_receipt' && !item.paymentConfirmedByArtist ? 'text-yellow-400' : 
                          item.status === 'upcoming' ? 'text-blue-400' : 'text-orange-400'
                        }`}>
                          {getStatusIcon(item.status, item.paymentConfirmedByArtist)} <span className="ml-1">{getStatusText(item.status, item.paymentConfirmedByArtist)}</span>
                        </p>
                        {item.status === 'pending_receipt' && !item.paymentConfirmedByArtist && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                            onClick={() => handleConfirmReceipt(item.id)}
                          >
                            <Check size={14} className="mr-1"/> Confirmar Recebimento
                          </Button>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-5">Nenhum registro financeiro encontrado para o período selecionado.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default FinancialsScreen;
  