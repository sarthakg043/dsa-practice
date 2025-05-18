import { useRepository } from '@/contexts/repository-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { RefreshButton } from './RefreshButton';
import { FilterablePieChart } from './FilterablePieChart';

// Colors for pie chart
const DIFFICULTY_COLORS = {
  Easy: '#4ade80',   // Green
  Medium: '#facc15', // Yellow
  Hard: '#f87171',   // Red
  Unknown: '#94a3b8', // Gray
};

// Colors for bar chart
const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6',
  '#f97316', '#06b6d4', '#84cc16', '#a855f7',
  '#eab308', '#0ea5e9', '#22c55e', '#d946ef',
  '#64748b'
];

export function StatisticsSummary() {
  const { statistics, loading } = useRepository();
  
  if (loading || !statistics) {
    return <div className="p-4">Loading statistics...</div>;
  }
  
  const { totalProblems, solvedProblems } = statistics;
  const progressPercentage = totalProblems > 0 
    ? Math.round((solvedProblems / totalProblems) * 100) 
    : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle>Progress Summary</CardTitle>
        <RefreshButton showText={false} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Problems Solved</span>
              <span className="text-sm text-gray-500">{solvedProblems} / {totalProblems}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalProblems}</div>
              <div className="text-xs text-gray-500">Total Problems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{solvedProblems}</div>
              <div className="text-xs text-gray-500">Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{progressPercentage}%</div>
              <div className="text-xs text-gray-500">Completion</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DifficultyPieChart() {
  const { statistics, loading } = useRepository();
  
  if (loading || !statistics) {
    return <div className="p-4">Loading statistics...</div>;
  }
  
  const { difficultyStats } = statistics;
  
  // Convert difficulty stats object to array for recharts
  const data = Object.entries(difficultyStats).map(([name, value]) => ({
    name,
    value: value || 0,
  })).filter(item => item.value > 0);
  
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Problems by Difficulty</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[200px]">
          <p className="text-gray-500">No difficulty data available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Problems by Difficulty</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DIFFICULTY_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} problems`, name]}
                labelFormatter={() => ''}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TopicBarChart() {
  const { statistics, loading } = useRepository();
  
  if (loading || !statistics) {
    return <div className="p-4">Loading statistics...</div>;
  }
  
  const { topicStats } = statistics;
  
  if (!topicStats || topicStats.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Problems by Topic</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[250px]">
          <p className="text-gray-500">No topic data available</p>
        </CardContent>
      </Card>
    );
  }
  
  // Sort topics by problem count
  const sortedTopics = [...topicStats].sort((a, b) => b.total - a.total);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Problems by Topic</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedTopics}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [value, name === 'total' ? 'Total Problems' : 'Solved Problems']}
                contentStyle={{
                  backgroundColor: '#1f2937', // e.g., dark gray
                  borderRadius: '6px',
                  border: 'none',
                  color: '#f9fafb', // light text for dark background
                }}
              />
              <Legend />
              <Bar dataKey="total" name="Total Problems" fill="#94a3b8" barSize={20} />
              <Bar dataKey="solved" name="Solved Problems" fill="#3b82f6" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
