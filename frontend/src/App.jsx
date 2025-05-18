import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { RepositoryProvider } from './contexts/repository-context';
import { ThemeProvider } from './contexts/theme-context';
import { FileTree } from './components/FileTree';
import { FileViewer } from './components/FileViewer';
import { 
  StatisticsSummary, 
  TopicBarChart 
} from './components/Statistics';
import { FilterablePieChart } from './components/FilterablePieChart';
import { RepositoryRefresh } from './components/RepositoryRefresh';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('explorer');

  return (
    <ThemeProvider>
      <RepositoryProvider>
        <div className="h-screen bg-slate-50 dark:bg-gray-900 flex flex-col">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">DSA Repository Tracker</h1>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <RepositoryRefresh />
              </div>
            </div>
          </header>
        
        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden h-[100%-65px]">
          {/* Left Sidebar - File Explorer */}
          <div className="w-64 rounded-t-md border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="explorer">Files</TabsTrigger>
                <TabsTrigger value="statistics">Stats</TabsTrigger>
              </TabsList>
              <TabsContent value="explorer" className="mt-0">
                <FileTree />
              </TabsContent>
              <TabsContent value="statistics" className="mt-0">
                <div className="p-4 space-y-4">
                  <StatisticsSummary />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-auto p-6 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
              {activeTab === 'statistics' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FilterablePieChart />
                  <TopicBarChart />
                </div>
              ) : (
                <FileViewer />
              )}
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-slate-200 dark:border-gray-700 py-4 px-6">
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            DSA Repository Tracker - Your progress at a glance
          </div>
        </footer>
      </div>
    </RepositoryProvider>
    </ThemeProvider>
  );
}

export default App;