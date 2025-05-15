
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Link } from 'react-router-dom';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Switch } from "@/components/ui/switch.jsx";
    import { Label } from "@/components/ui/label.jsx";
    import { UserCircle2, Zap, Eye } from 'lucide-react';

    const itemVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
    };

    const ArtistSections = ({ isPremium, setIsPremium }) => {
      return (
        <>
          <motion.div variants={itemVariants}>
            <Card className="bg-card/80 backdrop-blur-sm border-brand-artist/30">
              <CardHeader>
                <CardTitle className="text-brand-artist flex items-center"><UserCircle2 className="mr-2" />Meu Perfil Público</CardTitle>
                <CardDescription>Acesse e edite como os contratantes veem seu perfil.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-brand-artist hover:bg-brand-artist/90 text-brand-artist-foreground" asChild>
                  <Link to="/meu-perfil-publico">
                    <Eye className="mr-2 h-4 w-4" /> Visualizar/Editar Perfil Público
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card/80 backdrop-blur-sm border-yellow-500/50">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center"><Zap className="mr-2" />Assinatura Premium</CardTitle>
                <CardDescription>Destaque seu perfil nas buscas e tenha acesso a recursos exclusivos.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Label htmlFor="premium-switch" className="flex flex-col space-y-1">
                  <span className={`text-base font-medium ${isPremium ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                    {isPremium ? 'Premium Ativo' : 'Ativar Premium (R$ 19,90/mês)'}
                  </span>
                  <span className="font-normal leading-snug text-muted-foreground text-xs">
                    {isPremium ? 'Seu perfil está em destaque!' : 'Ganhe mais visibilidade e oportunidades.'}
                  </span>
                </Label>
                <Switch
                  id="premium-switch"
                  checked={isPremium}
                  onCheckedChange={setIsPremium}
                  className="data-[state=checked]:bg-yellow-500"
                />
              </CardContent>
              {!isPremium && (
                <CardContent>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">Quero ser Premium</Button>
                </CardContent>
              )}
            </Card>
          </motion.div>
        </>
      );
    };

    export default ArtistSections;
  