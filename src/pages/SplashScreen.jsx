
    import React, { useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import Logo from '@/components/Logo.jsx';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';

    const SplashScreen = () => {
      const navigate = useNavigate();
      const [user] = useLocalStorage('no-palco-user', null);

      useEffect(() => {
        const timer = setTimeout(() => {
          if (user) {
            navigate('/home');
          } else {
            navigate('/login');
          }
        }, 2000); 
        return () => clearTimeout(timer);
      }, [navigate, user]);

      return (
        <motion.div
          className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-slate-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 120 }}
          >
            <Logo width={250} />
          </motion.div>
          <motion.p 
            className="mt-6 text-lg text-muted-foreground font-serif"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Conectando artistas e palcos.
          </motion.p>
        </motion.div>
      );
    };

    export default SplashScreen;
  