
    import React from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog.jsx";
    import { Button } from "@/components/ui/button.jsx";
    import { Download as DownloadIcon, Share2, X as CloseIcon, Image as ImageIcon } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';

    const ShowPromotionArtModal = ({ show, artistName, closeModal }) => {
        const { toast } = useToast();
        const [user] = useLocalStorage('no-palco-user', null);
        const [artistProfile] = useLocalStorage(`no-palco-artist-profile-${user?.id}`, { profileImageUrl: 'https://images.unsplash.com/photo-1600759837110-adb2100cc9b6' });
        
        const [allEstablishments] = useLocalStorage(`no-palco-establishments-${show.contractorId || user?.id}`, {});

        const establishmentLogo = show.establishmentId && allEstablishments[show.establishmentId]?.logoUrl 
            ? allEstablishments[show.establishmentId].logoUrl
            : 'https://images.unsplash.com/photo-1688046671828-c26b7fd54596'; 
        
        const artistImage = user?.type === 'Artista' 
            ? artistProfile.profileImageUrl 
            : show.artistProfileImageUrl || 'https://images.unsplash.com/photo-1600759837110-adb2100cc9b6';


        const handleDownload = () => {
            toast({ title: "Download Simulado", description: "A arte seria baixada aqui." });
        };

        const handleShareSocial = () => {
            navigator.clipboard.writeText(`Show imperdível! ${artistName} no ${show.venue}, ${new Date(show.date).toLocaleDateString('pt-BR', {weekday: 'short', day: '2-digit', month: 'short'})} às ${formatTime(show.time)}. #NoPalco #${artistName.replace(/\s+/g, '')} #${show.venue.replace(/\s+/g, '')}`);
            toast({ title: "Conteúdo Copiado!", description: "Texto para compartilhamento copiado para a área de transferência." });
        };

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = date.toLocaleDateString('pt-BR', { day: '2-digit' });
            const month = date.toLocaleDateString('pt-BR', { month: '2-digit' });
            return `${day}/${month}`;
        };
        
        const formatDayOfWeek = (dateString) => {
            return new Date(dateString).toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.','');
        };

        const formatTime = (timeString) => {
            if (!timeString) return '';
            const [hours, minutes] = timeString.split(':');
            return `${hours}h${minutes !== '00' ? minutes : ''}`;
        };

        return (
            <DialogContent className="bg-card text-card-foreground sm:max-w-md p-0 overflow-hidden">
                <div className="aspect-[9/16] relative w-full bg-gray-700">
                    <img  
                        className="absolute inset-0 w-full h-full object-cover" 
                        alt={`Artista ${artistName} se apresentando`}
                        src={artistImage} 
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white text-black">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="h-16 w-16 flex items-center justify-center bg-slate-100 dark:bg-black rounded-md p-1 overflow-hidden">
                                <img  
                                    className="max-h-full max-w-full object-contain"
                                    alt={`Logo ${show.venue || 'do local'}`}
                                    src={establishmentLogo}
                                 />
                            </div>
                            <div className="flex-1 text-center border-l border-r border-gray-300 px-2 min-w-0">
                                <h2 className="text-xl font-bold truncate uppercase" title={artistName}>
                                    {artistName}
                                </h2>
                            </div>
                            <div className="text-right flex flex-col items-center justify-center min-w-[60px]">
                                <p className="text-2xl font-bold leading-tight">{formatDate(show.date)}</p>
                                <div className="text-xs font-medium text-gray-700 leading-tight text-center">
                                    <span>{formatDayOfWeek(show.date)}</span>
                                    <span className="block">{formatTime(show.time)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="bg-card p-4 flex-col sm:flex-row sm:justify-end gap-2">
                    <Button variant="outline" onClick={closeModal}><CloseIcon size={16} className="mr-2" />Fechar</Button>
                    <Button onClick={handleDownload} className="bg-brand-artist hover:bg-brand-artist/90 text-brand-artist-foreground">
                        <DownloadIcon size={16} className="mr-2" /> Baixar
                    </Button>
                    <Button onClick={handleShareSocial} className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Share2 size={16} className="mr-2" /> Compartilhar
                    </Button>
                </DialogFooter>
            </DialogContent>
        );
    };

    export default ShowPromotionArtModal;
  