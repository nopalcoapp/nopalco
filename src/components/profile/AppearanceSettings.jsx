
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Switch } from "@/components/ui/switch.jsx";
    import { Label } from "@/components/ui/label.jsx";
    import { Sun, Moon } from 'lucide-react';

    const itemVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
    };

    const AppearanceSettings = ({ theme, toggleTheme, brandTextColor }) => {
      return (
        <motion.div variants={itemVariants}>
          <Card className="bg-card/80 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className={`${brandTextColor}`}>Aparência</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <Label htmlFor="theme-switch" className="flex items-center">
                {theme === 'dark' ? <Moon className="mr-2 h-5 w-5" /> : <Sun className="mr-2 h-5 w-5" />}
                Modo {theme === 'dark' ? 'Escuro' : 'Claro'}
              </Label>
              <Switch
                id="theme-switch"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary"
              />
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default AppearanceSettings;
  