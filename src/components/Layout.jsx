
    import React from 'react';
    import { Outlet, useLocation } from 'react-router-dom';
    import BottomNav from '@/components/BottomNav.jsx';
    import { motion } from 'framer-motion';
    import { Toaster } from '@/components/ui/toaster.jsx';
    import NotificationBell from '@/components/NotificationBell.jsx';

    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 },
    };

    const pageTransition = {
      type: 'tween',
      ease: 'anticipate',
      duration: 0.4,
    };

    const Layout = () => {
      const location = useLocation();

      return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <NotificationBell />
          <motion.main
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="flex-grow container mx-auto px-4 py-6"
          >
            <Outlet />
          </motion.main>
          <BottomNav />
          <Toaster />
        </div>
      );
    };

    export default Layout;
  