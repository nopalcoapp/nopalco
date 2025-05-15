
    import React, { useState, useEffect } from 'react';
    import { useNavigate, useLocation } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import Logo from '@/components/Logo.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import { motion } from 'framer-motion';

    const LoginScreen = () => {
      const navigate = useNavigate();
      const location = useLocation();
      const { toast } = useToast();
      const [user, setUser] = useLocalStorage('no-palco-user', null);

      const queryParams = new URLSearchParams(location.search);
      const initialAction = queryParams.get('action') === 'register' ? 'register' : 'login';
      const [actionType, setActionType] = useState(initialAction); 
      
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [name, setName] = useState(''); 
      const [userType, setUserType] = useState('Artista'); 

      useEffect(() => {
        if (user) {
          navigate('/home');
        }
      }, [user, navigate]);


      const handleSubmit = (e) => {
        e.preventDefault();
        if (actionType === 'login') {
          if (email === 'artista@email.com' && password === 'password') {
            setUser({ id: 'artist1', name: 'Artista Teste', email, type: 'Artista', imageQuery: 'musician with guitar on stage' });
            toast({ title: 'Login bem-sucedido!', description: 'Bem-vindo de volta, Artista Teste.' });
            navigate('/home');
          } else if (email === 'contratante@email.com' && password === 'password') {
            setUser({ id: 'contractor1', name: 'Contratante NoPalco', email, type: 'Contratante', imageQuery: 'modern restaurant manager portrait' });
            toast({ title: 'Login bem-sucedido!', description: 'Bem-vindo, Contratante NoPalco.' });
            navigate('/home');
          } else {
            toast({ variant: 'destructive', title: 'Erro no Login', description: 'Email ou senha inválidos.' });
          }
        } else { 
          if (!name || !email || !password) {
            toast({ variant: 'destructive', title: 'Erro no Cadastro', description: 'Por favor, preencha todos os campos.' });
            return;
          }
          const newUserId = userType === 'Artista' ? `artist-${Date.now()}` : `contractor-${Date.now()}`;
          setUser({ 
            id: newUserId, 
            name, 
            email, 
            type: userType, 
            imageQuery: userType === 'Artista' ? 'new musician profile photo' : 'new contractor profile photo' 
          });
          toast({ title: 'Cadastro realizado!', description: `Bem-vindo, ${name}! Sua conta de ${userType} foi criada.` });
          navigate('/home');
        }
      };

      return (
        <motion.div 
          className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-background to-slate-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Logo className="mb-8" width={200} />
          <Card className="w-full max-w-md shadow-2xl bg-card/90 backdrop-blur-sm border-brand-yellow/30">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-brand-yellow">
                {actionType === 'login' ? 'Acessar Conta' : 'Criar Conta'}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {actionType === 'login' ? 'Entre com suas credenciais.' : 'Preencha os dados para se cadastrar.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {actionType === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-brand-pink">Nome Completo</Label>
                    <Input id="name" type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required className="bg-slate-800/50 border-slate-700 focus:border-brand-yellow"/>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-brand-pink">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-slate-800/50 border-slate-700 focus:border-brand-yellow"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-brand-pink">Senha</Label>
                  <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-slate-800/50 border-slate-700 focus:border-brand-yellow"/>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-brand-pink">Tipo de Usuário</Label>
                  <Tabs value={userType} onValueChange={setUserType} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                      <TabsTrigger value="Artista" className="data-[state=active]:bg-brand-yellow data-[state=active]:text-primary-foreground">Artista</TabsTrigger>
                      <TabsTrigger value="Contratante" className="data-[state=active]:bg-brand-pink data-[state=active]:text-primary-foreground">Contratante</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Button type="submit" className="w-full bg-brand-yellow hover:bg-brand-yellow/90 text-primary-foreground text-lg py-3">
                  {actionType === 'login' ? 'Entrar' : 'Cadastrar'}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <Button variant="link" onClick={() => setActionType(actionType === 'login' ? 'register' : 'login')} className="text-brand-pink hover:text-brand-pink/80">
                  {actionType === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default LoginScreen;
  