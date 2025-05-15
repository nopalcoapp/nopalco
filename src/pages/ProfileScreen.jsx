
    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import { motion } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { LogOut } from 'lucide-react';

    import ProfileHeader from '@/components/profile/ProfileHeader.jsx';
    import ArtistSections from '@/components/profile/ArtistSections.jsx';
    import ContractorSections from '@/components/profile/ContractorSections.jsx';
    import GeneralOptions from '@/components/profile/GeneralOptions.jsx';
    import AppearanceSettings from '@/components/profile/AppearanceSettings.jsx';
    import EditEstablishmentModal from '@/components/profile/EditEstablishmentModal.jsx';

    const ProfileScreen = () => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const [user, setUser] = useLocalStorage('no-palco-user', null);
      const [isPremium, setIsPremium] = useLocalStorage(`no-palco-premium-${user?.id}`, false);
      const [contractorPlan, setContractorPlan] = useLocalStorage(`no-palco-contractor-plan-${user?.id}`, 'basic');
      const [theme, setTheme] = useLocalStorage('no-palco-theme', 'dark');
      
      const [artistProfile, setArtistProfile] = useLocalStorage(`no-palco-artist-profile-${user?.id}`, {
        profileImageUrl: user?.profileImageUrl || 'https://images.unsplash.com/photo-1599856413870-40540dd55110',
        bio: user?.bio || 'Artista apaixonado pela música.',
      });

      const [establishmentsData, setEstablishmentsData] = useLocalStorage(`no-palco-establishments-${user?.id}`, 
        user?.establishments || {
            'establishment1': { name: 'Restaurante Harmonia', logoUrl: 'https://images.unsplash.com/photo-1688046671828-c26b7fd54596', address: 'Rua das Palmeiras, 123' },
            'establishment2': { name: 'Bar Eclipse', logoUrl: 'https://images.unsplash.com/photo-1617576632001-de009c6a1237', address: 'Av. Principal, 456' },
        }
      );
      const [isEditingEstablishment, setIsEditingEstablishment] = useState(false);
      const [currentEstablishment, setCurrentEstablishment] = useState(null);


      useEffect(() => {
        if (theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
        }
      }, [theme]);

      const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      };

      const handleLogout = () => {
        setUser(null);
        setIsPremium(false); 
        setContractorPlan('basic');
        navigate('/login');
      };

      const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'artistProfile') {
                    setArtistProfile(prev => ({ ...prev, profileImageUrl: reader.result }));
                    toast({ title: "Foto de Perfil Atualizada (Simulado)", description: "Sua nova foto de perfil foi carregada." });
                } else if (type === 'establishmentLogo' && currentEstablishment?.id) {
                    setCurrentEstablishment(prev => ({...prev, logoUrl: reader.result}));
                }
            };
            reader.readAsDataURL(file);
        }
      };
      
      const handleEditEstablishmentClick = (estId) => {
        setCurrentEstablishment({id: estId, ...establishmentsData[estId]});
        setIsEditingEstablishment(true);
      };
      
      const handleAddNewEstablishmentClick = () => {
        setCurrentEstablishment({id: `est-${Date.now()}`, name: '', logoUrl: '', address: ''});
        setIsEditingEstablishment(true);
      };

      const handleSaveEstablishment = () => {
        if (!currentEstablishment || !currentEstablishment.id) return;
        setEstablishmentsData(prev => ({...prev, [currentEstablishment.id]: {...currentEstablishment}}));
        toast({ title: "Estabelecimento Atualizado!", description: `${currentEstablishment.name} foi atualizado com sucesso.` });
        setIsEditingEstablishment(false);
        setCurrentEstablishment(null);
      };


      const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1, duration: 0.4, ease: "easeOut" } },
      };
      const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
      };

      if (!user) return null; 
      
      const brandColor = user.type === 'Artista' ? 'text-brand-artist' : 'text-brand-contractor';
      const brandBorderColor = user.type === 'Artista' ? 'border-brand-artist' : 'border-brand-contractor';
      const brandTextColor = user.type === 'Artista' ? 'text-brand-artist' : 'text-brand-contractor';

      return (
        <motion.div 
          className="space-y-8 pb-20 max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <ProfileHeader 
            user={user} 
            artistProfile={artistProfile} 
            brandColor={brandColor} 
            brandBorderColor={brandBorderColor}
            brandTextColor={brandTextColor}
            isPremium={isPremium}
            contractorPlan={contractorPlan}
            onImageUpload={handleImageUpload}
          />

          {user.type === 'Artista' && (
            <ArtistSections isPremium={isPremium} setIsPremium={setIsPremium} />
          )}
          
          {user.type === 'Contratante' && (
            <ContractorSections 
              establishmentsData={establishmentsData}
              contractorPlan={contractorPlan}
              setContractorPlan={setContractorPlan}
              onEditEstablishment={handleEditEstablishmentClick}
              onAddNewEstablishment={handleAddNewEstablishmentClick}
            />
          )}

          <GeneralOptions userType={user.type} brandTextColor={brandTextColor} brandColor={brandColor} />
          <AppearanceSettings theme={theme} toggleTheme={toggleTheme} brandTextColor={brandTextColor} />
          
          <motion.div variants={itemVariants}>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </motion.div>

          {currentEstablishment && (
            <EditEstablishmentModal
                isOpen={isEditingEstablishment}
                setIsOpen={setIsEditingEstablishment}
                currentEstablishment={currentEstablishment}
                setCurrentEstablishment={setCurrentEstablishment}
                onSave={handleSaveEstablishment}
                onImageUpload={handleImageUpload}
            />
          )}
        </motion.div>
      );
    };

    export default ProfileScreen;
  