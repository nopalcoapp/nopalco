
    import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
    import { BellRing, Trash2, CheckCircle2 } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { cn } from '@/lib/utils.jsx';

    const NotificationsScreen = () => {
      const [user] = useLocalStorage('no-palco-user', null);
      const [notifications, setNotifications] = useLocalStorage('no-palco-notifications', []);
      const navigate = useNavigate();

      const userNotifications = notifications
        .filter(n => n.userId === user?.id || n.userId === 'all')
        .sort((a, b) => new Date(b.date) - new Date(a.date));

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
          prev.map(n => (n.userId === user?.id || n.userId === 'all') ? {...n, isRead: true} : n)
        );
      };
      
      const deleteAllNotifications = () => {
         setNotifications(prev => prev.filter(n => n.userId !== user?.id && n.userId !== 'all'));
      };

      return (
        <motion.div
          className="space-y-6 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="py-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-brand-yellow flex items-center"><BellRing className="mr-2"/>Notificações</h1>
              <p className="text-muted-foreground">Todas as suas atualizações e alertas.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={markAllAsRead} size="sm" className="text-xs">
                    <CheckCircle2 size={14} className="mr-1.5"/> Marcar todas como lidas
                </Button>
                <Button variant="destructive" onClick={deleteAllNotifications} size="sm" className="text-xs">
                    <Trash2 size={14} className="mr-1.5"/> Limpar Todas
                </Button>
            </div>
          </header>

          {userNotifications.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardContent className="py-10 text-center text-muted-foreground">
                Você não tem nenhuma notificação no momento.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {userNotifications.map((notif, index) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card 
                    onClick={() => handleNotificationClick(notif)} 
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      !notif.isRead ? "bg-primary/5 border-primary/30" : "bg-card/70 border-border/30",
                      "hover:border-brand-yellow/50"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className={cn("text-base", !notif.isRead && "text-foreground font-semibold")}>{notif.title}</CardTitle>
                          <CardDescription className={cn("text-sm mt-0.5", !notif.isRead ? "text-muted-foreground" : "text-muted-foreground/80")}>{notif.message}</CardDescription>
                        </div>
                        {!notif.isRead && <div className="h-2.5 w-2.5 rounded-full bg-brand-yellow mt-1"></div>}
                      </div>
                      <p className="text-xs text-muted-foreground/60 mt-2">{new Date(notif.date).toLocaleString('pt-BR')}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      );
    };

    export default NotificationsScreen;
  