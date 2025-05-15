
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
    import { Building, ShieldCheck, Edit3, PlusCircle, FileImage as ImageIcon } from 'lucide-react';

    const itemVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
    };

    const ContractorSections = ({ establishmentsData, contractorPlan, setContractorPlan, onEditEstablishment, onAddNewEstablishment }) => {
      return (
        <>
          <motion.div variants={itemVariants}>
            <Card className="bg-card/80 backdrop-blur-sm border-brand-contractor/50">
              <CardHeader>
                <CardTitle className="text-brand-contractor flex items-center"><Building className="mr-2" />Meus Estabelecimentos</CardTitle>
                <CardDescription>Gerencie as informações dos seus locais.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(establishmentsData).map(([id, est]) => (
                  <div key={id} className="p-3 rounded-md border border-border flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-md border">
                        <AvatarImage src={est.logoUrl} alt={`Logo ${est.name}`} className="object-contain" />
                        <AvatarFallback className="rounded-md bg-muted">{est.name ? est.name.charAt(0) : 'E'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{est.name}</h4>
                        <p className="text-xs text-muted-foreground">{est.address}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onEditEstablishment(id)}>
                      <Edit3 size={14} className="mr-1.5" /> Editar
                    </Button>
                  </div>
                ))}
                <Button className="w-full mt-2" variant="outline" onClick={onAddNewEstablishment}>
                  <PlusCircle size={16} className="mr-2" /> Adicionar Novo Estabelecimento
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card/80 backdrop-blur-sm border-brand-contractor/50">
              <CardHeader>
                <CardTitle className="text-brand-contractor flex items-center"><ShieldCheck className="mr-2" />Planos para Contratantes</CardTitle>
                <CardDescription>Aprimore sua experiência e encontre os melhores talentos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className={`p-3 rounded-md border ${contractorPlan === 'basic' ? 'border-brand-contractor' : 'border-slate-700'}`}>
                  <h3 className="font-semibold">Plano Básico (Atual)</h3>
                  <p className="text-xs text-muted-foreground">Funcionalidades essenciais para contratar artistas.</p>
                </div>
                <div className={`p-3 rounded-md border ${contractorPlan === 'pro' ? 'border-brand-contractor' : 'border-slate-700'}`}>
                  <h3 className="font-semibold">Plano Pro (R$ 29,90/mês)</h3>
                  <p className="text-xs text-muted-foreground">Destaque nas buscas, relatórios avançados, suporte prioritário.</p>
                  {contractorPlan === 'basic' && <Button size="sm" className="mt-2 w-full bg-brand-contractor hover:bg-brand-contractor/90 text-brand-contractor-foreground" onClick={() => setContractorPlan('pro')}>Fazer Upgrade para Pro</Button>}
                  {contractorPlan === 'pro' && <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => setContractorPlan('basic')}>Cancelar Plano Pro</Button>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      );
    };

    export default ContractorSections;
  