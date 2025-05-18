import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { RepositoryProvider } from './lib/repository-context';
import { FileTree } from './components/FileTree';
import { FileViewer } from './components/FileViewer';
import { 
  StatisticsSummary, 
  TopicBarChart 
} from './components/Statistics';
import { FilterablePieChart } from './components/FilterablePieChart';
import { RepositoryRefresh } from './components/RepositoryRefresh';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('explorer');

  return (
    <RepositoryProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">DSA Repository Tracker</h1>
            <div className="flex items-center gap-4">
              <RepositoryRefresh />
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - File Explorer */}
          <div className="w-64 border-r border-slate-200 bg-white overflow-auto">
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
          <div className="flex-1 overflow-auto p-6">
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
        <footer className="bg-white border-t border-slate-200 py-4 px-6">
          <div className="text-center text-sm text-slate-500">
            DSA Repository Tracker - Your progress at a glance
          </div>
        </footer>
      </div>
    </RepositoryProvider>
  );
}

export default App;