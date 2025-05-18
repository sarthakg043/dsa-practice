import { useState, useEffect } from 'react';
import { useRepository } from '@/contexts/repository-context';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { updateProblemStatus } from '@/services/statistics-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export function RepositoryRefresh() {
  const { refreshData, loading } = useRepository();
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setLastRefreshed(new Date());
    setRefreshing(false);
  };
  
  useEffect(() => {
    // Set initial refresh time
    setLastRefreshed(new Date());
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => {
      handleRefresh();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={handleRefresh}
        disabled={refreshing || loading}
      >
        <RefreshCwIcon size={16} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
      {lastRefreshed && (
        <span className="text-xs text-gray-500">
          Last updated: {lastRefreshed.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

// This component will appear below file content when viewing a problem file
export function ProblemStatusUpdater({ problem, topic }) {
  const { refreshData } = useRepository();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!problem || !topic) return null;

  const handleMarkSolved = async () => {
    setIsUpdating(true);
    updateProblemStatus(topic, problem.name, true);
    await refreshData();
    setIsUpdating(false);
  };

  const handleMarkUnsolved = async () => {
    setIsUpdating(true);
    updateProblemStatus(topic, problem.name, false);
    await refreshData();
    setIsUpdating(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Problem Status</CardTitle>
        <CardDescription>
          Update your progress on this problem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {problem.solved ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
            )}
            <span>
              {problem.solved ? "You've solved this problem!" : "You haven't solved this problem yet"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {!problem.solved && (
          <Button 
            onClick={handleMarkSolved} 
            disabled={isUpdating}
            size="sm"
            variant="default"
          >
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Mark as Solved
          </Button>
        )}
        {problem.solved && (
          <Button 
            onClick={handleMarkUnsolved} 
            disabled={isUpdating}
            size="sm"
            variant="outline"
          >
            <XCircleIcon className="h-4 w-4 mr-1" />
            Mark as Unsolved
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
