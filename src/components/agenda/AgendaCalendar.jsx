
    import React from 'react';
    import { Calendar } from '@/components/ui/calendar.jsx';
    import { cn } from '@/lib/utils.jsx';

    const AgendaCalendar = ({ 
        selectedDate, 
        onSelectDate, 
        artistAgenda, 
        contractorAgenda, 
        userType, 
        contractorMusicDays, 
        brandColorClass, 
        brandButtonClass 
    }) => {

      const getDayClassNameForArtist = (day) => {
        const dateStr = day.toISOString().split('T')[0];
        const showsOnDay = artistAgenda[dateStr];
        if (showsOnDay && showsOnDay.length > 0) {
            if (showsOnDay.some(s => s.status === 'confirmed')) return 'bg-brand-artist text-brand-artist-foreground hover:bg-brand-artist/90 focus:bg-brand-artist/95'; 
            if (showsOnDay.some(s => s.status === 'pending')) return 'bg-yellow-500 text-black hover:bg-yellow-500/90 focus:bg-yellow-500/95';
            if (showsOnDay.some(s => s.status === 'unavailable')) return 'bg-red-600 text-white hover:bg-red-600/90 focus:bg-red-600/95';
        }
        return 'bg-green-600 text-white hover:bg-green-600/90 focus:bg-green-600/95'; 
      };

      const getDayClassNameForContractor = (day) => {
        const dayOfWeek = day.getDay(); 
        const dateStr = day.toISOString().split('T')[0];
        const showsOnDay = contractorAgenda[dateStr];
        
        const wantsMusicToday = contractorMusicDays.includes(dayOfWeek);

        if (!wantsMusicToday) return 'opacity-50 cursor-not-allowed bg-muted/30 hover:bg-muted/40'; 

        if (showsOnDay && showsOnDay.length > 0) {
            if (showsOnDay.some(s => s.status === 'confirmed' || s.status === 'completed')) return 'bg-brand-contractor text-brand-contractor-foreground hover:bg-brand-contractor/90 focus:bg-brand-contractor/95'; 
            if (showsOnDay.some(s => s.status === 'pending')) return 'bg-yellow-500 text-black hover:bg-yellow-500/90 focus:bg-yellow-500/95'; 
        }
        return 'bg-blue-600 text-white hover:bg-blue-600/90 focus:bg-blue-600/95'; 
      };

      return (
        <div className="flex justify-center">
            <Calendar
              selected={selectedDate}
              onSelect={onSelectDate}
              className="shadow-lg bg-card border border-border/50 rounded-lg p-3"
              weekStartsOn={1} 
              dayClassName={(day) => {
                const baseClass = 'rounded-md transition-opacity duration-150 h-10 w-10 p-0 font-normal';
                let specificClass = '';
                if (userType === 'Artista') {
                  specificClass = getDayClassNameForArtist(day);
                } else {
                  specificClass = getDayClassNameForContractor(day);
                }
                return cn(baseClass, specificClass);
              }}
              classNames={{
                caption_label: `${brandColorClass} text-lg font-semibold`,
                day_selected: `${brandButtonClass} focus:${brandButtonClass} ring-2 ring-offset-1 ring-offset-background ${userType === 'Artista' ? 'ring-brand-artist' : 'ring-brand-contractor'}`,
                nav_button_previous: `hover:bg-muted/80`,
                nav_button_next: `hover:bg-muted/80`,
                head_cell: "text-muted-foreground text-xs font-medium",
                cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                day: cn(
                  "h-10 w-10 p-0 font-normal aria-selected:opacity-100"
                ),
                day_disabled: "text-muted-foreground opacity-50",
                day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
        </div>
      );
    };

    export default AgendaCalendar;
  