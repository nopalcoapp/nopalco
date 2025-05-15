
    import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { Checkbox } from '@/components/ui/checkbox.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogFooter,
    } from "@/components/ui/dialog.jsx";

    const DAYS_OF_WEEK = [
        { id: 0, label: 'Domingo' },
        { id: 1, label: 'Segunda-feira' },
        { id: 2, label: 'Terça-feira' },
        { id: 3, label: 'Quarta-feira' },
        { id: 4, label: 'Quinta-feira' },
        { id: 5, label: 'Sexta-feira' },
        { id: 6, label: 'Sábado' },
    ];

    const ContractorAgendaSettingsModal = ({ isOpen, setIsOpen, currentMusicDays, onSave }) => {
        const [selectedDays, setSelectedDays] = useState(currentMusicDays);

        useEffect(() => {
            setSelectedDays(currentMusicDays);
        }, [currentMusicDays, isOpen]);

        const handleDayToggle = (dayId) => {
            setSelectedDays(prev => 
                prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
            );
        };

        const handleSubmit = () => {
            onSave(selectedDays);
            setIsOpen(false);
        };
        
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-card text-card-foreground sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-brand-contractor">Configurar Dias com Música</DialogTitle>
                        <DialogDescription>Selecione os dias da semana que você costuma ter música ao vivo no seu estabelecimento. Isso ajudará a visualizar sua agenda.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {DAYS_OF_WEEK.map(day => (
                            <div key={day.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={`day-${day.id}`}
                                    checked={selectedDays.includes(day.id)}
                                    onCheckedChange={() => handleDayToggle(day.id)}
                                    className="data-[state=checked]:bg-brand-contractor data-[state=checked]:border-brand-contractor"
                                />
                                <Label htmlFor={`day-${day.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {day.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                        <Button type="button" onClick={handleSubmit} className="bg-brand-contractor hover:bg-brand-contractor/90 text-brand-contractor-foreground">Salvar Configurações</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };
    export default ContractorAgendaSettingsModal;
  