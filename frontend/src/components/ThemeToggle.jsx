import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleTheme} 
      className="rounded-full"
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
