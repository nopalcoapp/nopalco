
    import React, { useState } from 'react';
    import { Bell } from 'lucide-react';
    import { Button } from '@/components/ui/button.jsx';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu.jsx';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import { useNavigate } from 'react-router-dom';
    import { cn } from '@/lib/utils.jsx';

    const NotificationBell = () => {
      const [user] = useLocalStorage('no-palco-user', null);
      const [notifications, setNotifications] = useLocalStorage('no-palco-notifications', []);
      const navigate = useNavigate();

      if (!user) return null;

      const userNotifications = notifications.filter(n => n.userId === user.id || n.userId === 'all');
      const unreadCount = userNotifications.filter(n => !n.isRead).length;

      const handleNotificationClick = (notification) => {
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? {...n, isRead: true} : n)
        );
        if (notification.link) {
          navigate(notification.link);
        }
      };

      const markAllAsRead = () => {
        setNotifications(prev => 
          prev.map(n => (n.userId === user.id || n.userId === 'all') ? {...n, isRead: true} : n)
        );
      };

      return (
        <div className="fixed top-4 right-4 z-[101]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full relative bg-card hover:bg-muted">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-card border-border shadow-lg">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notificações</span>
                {unreadCount > 0 && <Button variant="link" size="sm" className="p-0 h-auto text-xs text-brand-yellow" onClick={markAllAsRead}>Marcar todas como lidas</Button>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userNotifications.length === 0 ? (
                <DropdownMenuItem disabled className="text-muted-foreground text-center py-3">Nenhuma notificação</DropdownMenuItem>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                {userNotifications.slice(0, 10).map(notif => (
                  <DropdownMenuItem 
                    key={notif.id} 
                    onClick={() => handleNotificationClick(notif)}
                    className={cn("cursor-pointer flex flex-col items-start whitespace-normal py-2", !notif.isRead && "bg-primary/10 font-semibold")}
                  >
                    <p className={cn("text-sm", !notif.isRead && "text-foreground")}>{notif.title}</p>
                    <p className={cn("text-xs", !notif.isRead ? "text-muted-foreground" : "text-muted-foreground/70")}>{notif.message}</p>
                    <p className="text-xs text-muted-foreground/50 mt-1">{new Date(notif.date).toLocaleDateString('pt-BR', {hour:'2-digit', minute:'2-digit'})}</p>
                  </DropdownMenuItem>
                ))}
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/notificacoes')} className="justify-center text-brand-yellow focus:bg-brand-yellow/20 focus:text-brand-yellow">
                Ver todas as notificações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    };

    export default NotificationBell;
  