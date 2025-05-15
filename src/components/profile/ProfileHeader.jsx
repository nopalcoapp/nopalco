
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Upload, Zap, ShieldCheck } from 'lucide-react';
    import Logo from '@/components/Logo.jsx';

    const itemVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
    };

    const ProfileHeader = ({ user, artistProfile, brandColor, brandBorderColor, brandTextColor, isPremium, contractorPlan, onImageUpload }) => {
      return (
        <motion.header variants={itemVariants} className="flex flex-col items-center space-y-4 pt-8 relative">
          <div className="absolute top-4 left-4 opacity-70">
            <Logo width={80} />
          </div>
          <Avatar className={`w-32 h-32 border-4 ${brandBorderColor} relative group`}>
            <AvatarImage src={artistProfile.profileImageUrl} alt={user.name || 'Avatar do usuário'} className="object-cover w-full h-full rounded-full" />
            <AvatarFallback className={`text-4xl bg-${brandColor.replace('text-','bg-')} text-primary-foreground`}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
            {user.type === 'Artista' && (
              <label htmlFor="artist-profile-pic-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                <Upload className="h-8 w-8 text-white" />
                <input id="artist-profile-pic-upload" type="file" accept="image/*" className="sr-only" onChange={(e) => onImageUpload(e, 'artistProfile')} />
              </label>
            )}
          </Avatar>
          <div className="text-center">
            <h1 className={`text-3xl font-bold ${brandTextColor}`}>{user.name}</h1>
            {user.type === 'Artista' && isPremium && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-black mt-1">
                <Zap className="w-3 h-3 mr-1 text-yellow-700" /> Premium
              </span>
            )}
            {user.type === 'Contratante' && contractorPlan === 'pro' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-contractor text-brand-contractor-foreground mt-1">
                <ShieldCheck className="w-3 h-3 mr-1" /> Plano Pro
              </span>
            )}
          </div>
          <p className="text-muted-foreground">{user.email}</p>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.type === 'Artista' ? 'bg-brand-artist text-brand-artist-foreground' : 'bg-brand-contractor text-brand-contractor-foreground'}`}>
            {user.type || 'Usuário'}
          </span>
        </motion.header>
      );
    };

    export default ProfileHeader;
  