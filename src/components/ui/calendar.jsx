
    import React from 'react';
    import { ChevronLeft, ChevronRight } from 'lucide-react';
    import { Button } from '@/components/ui/button.jsx';
    import { cn } from '@/lib/utils.jsx';

    function Calendar({
      className,
      selected,
      onSelect,
      currentMonth: initialCurrentMonth = new Date(),
      classNames = {},
      dayClassName,
    }) {
      const [currentMonth, setCurrentMonth] = React.useState(initialCurrentMonth);

      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      const startDate = new Date(startOfMonth);
      startDate.setDate(startDate.getDate() - startDate.getDay()); 
      // Ensure calendar grid always shows 6 weeks (42 days)
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 41);


      const days = [];
      let date = new Date(startDate);
      while(date <= endDate) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }

      const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
      };

      const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
      };

      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

      return (
        <div className={cn('p-3 bg-card rounded-md border w-full max-w-md', className)}>
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon" onClick={handlePrevMonth} className={classNames.nav_button_previous}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className={cn("text-lg font-semibold font-serif", classNames.caption_label)}>
              {currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <Button variant="outline" size="icon" onClick={handleNextMonth} className={classNames.nav_button_next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm text-muted-foreground mb-2">
            {dayNames.map((day) => (
              <div key={day} className={classNames.head_cell}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isCurrentDisplayMonth = day.getMonth() === currentMonth.getMonth();
              const isSelected = selected && day.toDateString() === selected.toDateString();
              const customDayClass = dayClassName ? dayClassName(day) : '';
              
              return (
                <Button
                  key={index}
                  variant={isSelected ? 'default' : 'ghost'}
                  size="icon"
                  className={cn(
                    'h-10 w-10 p-0 font-normal transition-all duration-150 ease-in-out',
                    !isCurrentDisplayMonth && 'text-muted-foreground opacity-30 hover:opacity-50',
                     isCurrentDisplayMonth && !isSelected && 'hover:bg-muted/50',
                    isSelected && (classNames.day_selected || 'bg-primary text-primary-foreground hover:bg-primary/90'),
                    !isSelected && isCurrentDisplayMonth && (classNames.day || ''),
                    customDayClass 
                  )}
                  onClick={() => onSelect && isCurrentDisplayMonth && onSelect(day)}
                  disabled={!isCurrentDisplayMonth}
                >
                  {day.getDate()}
                </Button>
              );
            })}
          </div>
        </div>
      );
    }
    Calendar.displayName = 'Calendar';

    export { Calendar };
  