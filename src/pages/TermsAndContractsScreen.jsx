
    import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { FileText, Download, Printer } from 'lucide-react';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';

    const mockContracts = [
      { id: 'contract1', title: 'Contrato Padrão de Apresentação Musical', date: '2025-01-15', type: 'template', contentKey: 'standardShowAgreement' },
      { id: 'contract2', title: 'Termos de Uso da Plataforma No Palco', date: '2025-01-01', type: 'platform_terms', contentKey: 'platformTermsOfService' },
      { id: 'contract3', title: 'Acordo Show - Restaurante Harmonia (Banda Som Celestial)', date: '2025-05-10', type: 'specific_show', contentKey: 'showAgreementHarmoniaCelestial' },
    ];

    const contractContents = {
        standardShowAgreement: `
    CONTRATO DE APRESENTAÇÃO MUSICAL (MODELO)
    
    PARTES:
    CONTRATANTE: [Nome do Contratante], CPF/CNPJ: [Número]
    ARTISTA: [Nome do Artista/Banda], CPF/CNPJ: [Número]
    
    OBJETO: Apresentação musical do ARTISTA no evento/local [Nome do Evento/Local], em [Endereço Completo].
    
    DATA E HORÁRIO: [Data do Show], das [Horário Início] às [Horário Fim], com intervalo de [Duração do Intervalo] minutos.
    
    VALOR E PAGAMENTO: O valor total da apresentação é de R$ [Valor Total] ([Valor por Extenso]), a ser pago da seguinte forma: [Forma de Pagamento].
    
    EQUIPAMENTOS: [Detalhar responsabilidades sobre equipamentos de som, luz, palco, etc.]
    
    CANCELAMENTO: [Definir política de cancelamento e multas aplicáveis.]
    
    Este é um modelo simulado.
        `,
        platformTermsOfService: `
    TERMOS DE USO - NO PALCO
    
    Bem-vindo ao No Palco!
    
    1. SERVIÇOS: A plataforma No Palco conecta Artistas e Contratantes para shows de música ao vivo.
    2. RESPONSABILIDADES: Artistas e Contratantes são responsáveis pelos acordos firmados. A No Palco atua como intermediária.
    3. PAGAMENTOS: A plataforma pode registrar informações de pagamento, mas não processa transações financeiras diretamente (nesta fase de protótipo).
    4. CONDUTA: Usuários devem manter conduta respeitosa e profissional.
    
    Estes termos são simulados.
        `,
        showAgreementHarmoniaCelestial: `
    ACORDO ESPECÍFICO - SHOW RESTAURANTE HARMONIA & BANDA SOM CELESTIAL
    
    Evento: Jantar Especial MPB
    Local: Restaurante Harmonia
    Data: 15 de Maio de 2025, 20:00 - 22:00
    Artista: Banda Som Celestial
    Valor: R$ 350,00
    
    Observações: Equipamento de som básico fornecido pelo contratante. Artista leva instrumentos.
    
    Este é um acordo simulado.
        `
    };


    const TermsAndContractsScreen = () => {
      const [user] = useLocalStorage('no-palco-user', null);
      const [selectedContract, setSelectedContract] = useState(null);

      const brandColor = user?.type === 'Artista' ? 'text-brand-artist' : 'text-brand-contractor';

      if (!user) return <p className="text-center text-muted-foreground p-10">Faça login para ver seus termos e contratos.</p>;

      if (selectedContract) {
        return (
          <motion.div
            className="space-y-6 pb-20"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <header className="py-4">
              <Button variant="outline" onClick={() => setSelectedContract(null)} className="mb-4">
                &larr; Voltar para Lista
              </Button>
              <h1 className={`text-2xl font-bold ${brandColor}`}>{selectedContract.title}</h1>
              <p className="text-sm text-muted-foreground">Data: {new Date(selectedContract.date).toLocaleDateString('pt-BR')}</p>
            </header>
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                  {contractContents[selectedContract.contentKey] || "Conteúdo não disponível."}
                </pre>
              </CardContent>
              <CardContent className="flex gap-2 pt-4 border-t border-border/50">
                <Button variant="outline" className={`border-${brandColor} text-${brandColor} hover:bg-${brandColor}/10`}>
                    <Download size={16} className="mr-2"/> Baixar PDF (Simulado)
                </Button>
                 <Button variant="outline" className={`border-${brandColor} text-${brandColor} hover:bg-${brandColor}/10`}>
                    <Printer size={16} className="mr-2"/> Imprimir (Simulado)
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      }

      return (
        <motion.div
          className="space-y-6 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="py-4">
            <h1 className={`text-3xl font-bold ${brandColor} flex items-center`}><FileText className="mr-2"/>Termos e Contratos</h1>
            <p className="text-muted-foreground">Acesse modelos de contrato e termos da plataforma.</p>
          </header>

          {mockContracts.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">Nenhum termo ou contrato disponível.</p>
          ) : (
            <div className="space-y-3">
              {mockContracts.map((contract, index) => (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card 
                    onClick={() => setSelectedContract(contract)}
                    className="cursor-pointer transition-all hover:shadow-md hover:border-brand-yellow/50 bg-card/80 backdrop-blur-sm"
                  >
                    <CardContent className="p-4">
                      <CardTitle className={`text-base ${brandColor}`}>{contract.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Tipo: {contract.type === 'template' ? 'Modelo de Contrato' : contract.type === 'platform_terms' ? 'Termos da Plataforma' : 'Acordo de Show'}
                        {' - '}
                        Data: {new Date(contract.date).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      );
    };

    export default TermsAndContractsScreen;
  