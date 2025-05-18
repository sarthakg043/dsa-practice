import { useState } from 'react';
import { Button } from './ui/button';
import { RefreshCwIcon } from 'lucide-react';
import { useRepository } from '@/lib/repository-context';

export function RefreshButton({showText = true}) {
  const { refreshData, loading } = useRepository();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500); // Add a small delay for better UX
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleRefresh}
      disabled={isRefreshing || loading}
    >
      <RefreshCwIcon size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {showText ? (isRefreshing ? 'Refreshing...' : 'Refresh Data') : null}
    </Button>
  );
}
