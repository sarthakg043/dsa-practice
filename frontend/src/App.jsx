import { useEffect, useState } from 'react';
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
import { Button } from './components/ui/button';
import { Menu } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('explorer');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }
  , []);
  
  // Check if the user is on a mobile device
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android|iphone|ipad|ipod|iemobile|blackberry|windows phone/i.test(userAgent)) {
      setIsMobile(true);
    }
  }, []);

  return (
    <ThemeProvider>
      <RepositoryProvider>
        <div className="h-screen bg-slate-50 dark:bg-gray-900 flex flex-col">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 px-2 md:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center justify-between md:gap-4 w-full">
                {/* Left Sidebar in Mobile View */}
                {isMobile ?
                  <>
                    <Sheet>
                    <SheetTrigger>
                      <Button variant="outline" className="md:hidden">
                        <Menu size={16} />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side='left' className={"p-2"} >
                      <SheetHeader>
                        <SheetTitle>File Explorer</SheetTitle>
                        <SheetDescription>
                          Explore the files in your DSA repository.
                        </SheetDescription>
                        </SheetHeader>
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

                    </SheetContent>
                  </Sheet>
                  </> : null
                }
                <h1 className="text-base md:text-2xl  font-bold text-slate-900 dark:text-white md:ml-10 ">DSA Repository Tracker</h1>
                <div className='flex flex-wrap items-center justify-end gap-4'>
                  <div className="">
                    <ThemeToggle />
                  </div>
                  <div className="">
                    <RepositoryRefresh 
                      title={isMobile?"":"Refresh"} 
                      showLastUpdated={!isMobile}
                    />
                  </div>
                </div>
                
              </div>
            </div>
          </header>
        
        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden h-[100%-65px]">
          {/* Left Sidebar in Desktop View */}
          {!isMobile ?
            <>
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
            </> : null
          }
          {/* Main Content Area */}
          <div className="flex-1 overflow-auto md:p-6 dark:bg-gray-900">
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