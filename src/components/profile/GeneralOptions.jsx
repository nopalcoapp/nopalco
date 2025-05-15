
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Link } from 'react-router-dom';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Edit3, CalendarCheck, Star, FileText, Settings } from 'lucide-react';

    const itemVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
    };

    const GeneralOptions = ({ userType, brandTextColor, brandColor }) => {
      return (
        <motion.div variants={itemVariants}>
          <Card className="bg-card/80 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className={`${brandTextColor}`}>Minhas Opções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <Button variant="ghost" className={`w-full justify-start text-left text-foreground hover:bg-muted/50 hover:text-${brandColor}`}>
                <Edit3 className={`mr-2 h-4 w-4 text-${brandColor}`} /> Editar Informações Pessoais
              </Button>
              {userType === 'Artista' && (
                <>
                  <Button variant="ghost" className={`w-full justify-start text-foreground hover:bg-muted/50 hover:text-${brandColor}`} asChild>
                    <Link to="/agenda">
                      <CalendarCheck className={`mr-2 h-4 w-4 text-${brandColor}`} /> Meus Shows Agendados
                    </Link>
                  </Button>
                  <Button variant="ghost" className={`w-full justify-start text-foreground hover:bg-muted/50 hover:text-${brandColor}`}>
                    <Star className={`mr-2 h-4 w-4 text-${brandColor}`} /> Minhas Avaliações
                  </Button>
                </>
              )}
              {userType === 'Contratante' && (
                <Button variant="ghost" className={`w-full justify-start text-foreground hover:bg-muted/50 hover:text-${brandColor}`} asChild>
                  <Link to="/agenda">
                    <CalendarCheck className={`mr-2 h-4 w-4 text-${brandColor}`} /> Meus Shows Contratados
                  </Link>
                </Button>
              )}
              <Button variant="ghost" className={`w-full justify-start text-foreground hover:bg-muted/50 hover:text-${brandColor}`} asChild>
                <Link to="/termos-e-contratos">
                  <FileText className={`mr-2 h-4 w-4 text-${brandColor}`} /> Termos e Contratos
                </Link>
              </Button>
              <Button variant="ghost" className={`w-full justify-start text-foreground hover:bg-muted/50 hover:text-${brandColor}`}>
                <Settings className={`mr-2 h-4 w-4 text-${brandColor}`} /> Configurações da Conta
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default GeneralOptions;
  