
    import React from 'react';
    import { NavLink, useLocation } from 'react-router-dom';
    import { Home, CalendarDays, UserCircle, Search, DollarSign, Bell, MessageSquare } from 'lucide-react';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import { cn } from '@/lib/utils.jsx';

    const BottomNav = () => {
      const [user] = useLocalStorage('no-palco-user', null);
      const location = useLocation();

      const getNavLinkClass = (path) => {
        const isActive = location.pathname === path || (path === '/home' && location.pathname === '/');
        const brandColor = user?.type === 'Artista' ? 'text-brand-artist' : 'text-brand-contractor';
        return cn(
          "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ease-in-out",
          isActive ? `${brandColor} scale-110 font-semibold` : "text-muted-foreground hover:text-foreground",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
          isActive ? (user?.type === 'Artista' ? 'focus:ring-brand-artist' : 'focus:ring-brand-contractor') : 'focus:ring-primary'
        );
      };
      
      const baseLinks = [
        { path: '/home', icon: Home, label: 'Início' },
        { path: '/agenda', icon: CalendarDays, label: 'Agenda' },
      ];
      
      const artistLinks = [
        ...baseLinks,
        { path: '/solicitacoes', icon: Bell, label: 'Alertas' }, 
        { path: '/financas', icon: DollarSign, label: 'Financeiro' },
        { path: '/perfil', icon: UserCircle, label: 'Conta' },
      ];
      
      const contractorLinks = [
        ...baseLinks,
        { path: '/buscar-artistas', icon: Search, label: 'Buscar' },
        { path: '/financas-contratante', icon: DollarSign, label: 'Financeiro' },
        { path: '/perfil', icon: UserCircle, label: 'Conta' },
      ];

      let navLinks = [];
      let gridColsClass = "grid-cols-5";

      if (user?.type === 'Artista') {
        navLinks = artistLinks;
      } else if (user?.type === 'Contratante') {
        navLinks = contractorLinks;
      }
      
      if (!user) return null;


      return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 shadow-top-lg z-50">
          <div className={`container mx-auto grid ${gridColsClass} max-w-md`}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={getNavLinkClass(link.path)}
              >
                <link.icon className="h-6 w-6 mb-0.5" />
                <span className="text-xs">{link.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      );
    };

    export default BottomNav;
  