
    import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Checkbox } from '@/components/ui/checkbox.jsx';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogFooter,
    } from "@/components/ui/dialog.jsx";
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';

    const PRESET_VENUES = ['Restaurante Harmonia', 'Bar Eclipse', 'Café Melodia', 'Praça da Cidade', 'Evento Corporativo X'];
    const PRESET_AMOUNTS = [150, 200, 250, 300, 350, 400, 500, 750, 1000];

    const AddEditShowModal = ({ isOpen, setIsOpen, existingShow, onSaveShow, selectedDateProp }) => {
        const [artistAgenda] = useLocalStorage('no-palco-artist-agenda', {});
        const [knownVenues, setKnownVenues] = useState(PRESET_VENUES);
        const [knownAmounts, setKnownAmounts] = useState(PRESET_AMOUNTS);

        useEffect(() => {
            const venuesFromAgenda = Object.values(artistAgenda).flat().map(s => s.venue);
            const amountsFromAgenda = Object.values(artistAgenda).flat().map(s => s.payment).filter(p => p > 0);
            setKnownVenues(prev => Array.from(new Set([...PRESET_VENUES, ...venuesFromAgenda])));
            setKnownAmounts(prev => Array.from(new Set([...PRESET_AMOUNTS, ...amountsFromAgenda])).sort((a,b) => a-b));
        }, [artistAgenda]);


        const [showData, setShowData] = useState({
            venue: '', time: '', endTime: '', interval: '', payment: '', genre: '', details: '', 
            date: selectedDateProp ? selectedDateProp.toISOString().split('T')[0] : new Date().toISOString().split('T')[0], 
            recurring: false, type: 'external', artist: 'Você', status: 'unavailable' 
        });

        useEffect(() => {
            if (existingShow) {
                setShowData({...existingShow, date: existingShow.date || (selectedDateProp ? selectedDateProp.toISOString().split('T')[0] : new Date().toISOString().split('T')[0])});
            } else {
                 setShowData(prev => ({ 
                    ...prev, 
                    venue: '', time: '', endTime: '', interval: '', payment: '', genre: '', details: '', recurring: false,
                    date: selectedDateProp ? selectedDateProp.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    type: 'external', artist: 'Você', status: 'unavailable' 
                }));
            }
        }, [existingShow, selectedDateProp, isOpen]);


        const handleChange = (e) => {
            const { name, value, type, checked } = e.target;
            setShowData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        };
        
        const handleSelectChange = (name, value) => {
             setShowData(prev => ({ ...prev, [name]: value }));
        }

        const handleSubmit = (e) => {
            e.preventDefault();
            const newShow = { ...showData, id: existingShow?.id || Date.now().toString(), payment: parseFloat(showData.payment) || 0 };
            onSaveShow(newShow);
            setIsOpen(false);
        };
        
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-card text-card-foreground sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-brand-artist">{existingShow ? 'Editar Show' : 'Adicionar Novo Show'}</DialogTitle>
                        <DialogDescription>Preencha os detalhes do seu show.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                        <div>
                            <Label htmlFor="venue" className="text-muted-foreground">Local</Label>
                            <div className="flex gap-2">
                                <Input id="venue" name="venue" list="knownVenues" value={showData.venue} onChange={handleChange} required className="bg-slate-800/50 border-slate-700 focus:border-brand-artist flex-grow" />
                                <datalist id="knownVenues">
                                    {knownVenues.map(v => <option key={v} value={v} />)}
                                </datalist>
                                <Select onValueChange={(val) => val && handleSelectChange('venue', val)}>
                                    <SelectTrigger className="w-[150px] bg-slate-800/50 border-slate-700 text-xs p-2 h-10"><SelectValue placeholder="Recentes"/></SelectTrigger>
                                    <SelectContent className="bg-card border-slate-700">
                                        {knownVenues.slice(0,5).map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="date" className="text-muted-foreground">Data</Label>
                            <Input id="date" name="date" type="date" value={showData.date} onChange={handleChange} required className="bg-slate-800/50 border-slate-700 focus:border-brand-artist" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="time" className="text-muted-foreground">Horário Início</Label>
                                <Input id="time" name="time" type="time" value={showData.time} onChange={handleChange} required className="bg-slate-800/50 border-slate-700 focus:border-brand-artist" />
                            </div>
                            <div>
                                <Label htmlFor="endTime" className="text-muted-foreground">Horário Fim</Label>
                                <Input id="endTime" name="endTime" type="time" value={showData.endTime} onChange={handleChange} className="bg-slate-800/50 border-slate-700 focus:border-brand-artist" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="interval" className="text-muted-foreground">Intervalo (ex: 15 min)</Label>
                            <Input id="interval" name="interval" value={showData.interval} onChange={handleChange} className="bg-slate-800/50 border-slate-700 focus:border-brand-artist" />
                        </div>
                        <div>
                            <Label htmlFor="payment" className="text-muted-foreground">Valor (R$)</Label>
                             <div className="flex gap-2">
                                <Input id="payment" name="payment" type="number" value={showData.payment} onChange={handleChange} className="bg-slate-800/50 border-slate-700 focus:border-brand-artist flex-grow" />
                                <Select onValueChange={(val) => val && handleSelectChange('payment', val)}>
                                    <SelectTrigger className="w-[150px] bg-slate-800/50 border-slate-700 text-xs p-2 h-10"><SelectValue placeholder="Valores"/></SelectTrigger>
                                    <SelectContent className="bg-card border-slate-700">
                                        {knownAmounts.map(v => <SelectItem key={v} value={String(v)}>R$ {v.toFixed(2)}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="genre" className="text-muted-foreground">Gênero Musical</Label>
                            <Input id="genre" name="genre" value={showData.genre} onChange={handleChange} className="bg-slate-800/50 border-slate-700 focus:border-brand-artist" />
                        </div>
                        <div>
                            <Label htmlFor="details" className="text-muted-foreground">Detalhes Adicionais</Label>
                            <Input id="details" name="details" value={showData.details} onChange={handleChange} className="bg-slate-800/50 border-slate-700 focus:border-brand-artist" />
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="recurring" name="recurring" checked={showData.recurring} onCheckedChange={(checked) => setShowData(prev => ({...prev, recurring: Boolean(checked)}))} />
                            <Label htmlFor="recurring" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Evento Recorrente (Ex: Semanalmente nesta data/horário)
                            </Label>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-brand-artist hover:bg-brand-artist/90 text-brand-artist-foreground">{existingShow ? 'Salvar Alterações' : 'Adicionar Show'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    };
    export default AddEditShowModal;
  