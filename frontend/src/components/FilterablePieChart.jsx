import { useState, useMemo, useEffect } from 'react';
import { useRepository } from '@/contexts/repository-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { RefreshButton } from './RefreshButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Colors for difficulty levels
const DIFFICULTY_COLORS = {
  Easy: '#4ade80',   // Green
  Medium: '#facc15', // Yellow
  Hard: '#f87171',   // Red
  Unknown: '#94a3b8', // Gray
};

// Other colors for chart elements
const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6',
  '#f97316', '#06b6d4', '#84cc16', '#a855f7',
  '#eab308', '#0ea5e9', '#22c55e', '#d946ef',
  '#64748b'
];

export function FilterablePieChart() {
  const { statistics, loading, fetchRepoStatistics } = useRepository();
  const [statusFilter, setStatusFilter] = useState('total'); // 'total', 'solved', 'unsolved'
  const [topicFilter, setTopicFilter] = useState('all'); // 'all' or specific topic name
  
  // Effect to refresh data when component mounts
  useEffect(() => {
    // Only attempt to fetch if we don't already have statistics
    if (!statistics) {
      fetchRepoStatistics();
    }
  }, [statistics, fetchRepoStatistics]);
  
  // Extract available topics from statistics
  const topics = useMemo(() => {
    if (!statistics?.topicStats) return [];
    return statistics.topicStats.map(topic => topic.name);
  }, [statistics?.topicStats]);
  
  // Get filtered data for the chart
  const chartData = useMemo(() => {
    // If we don't have statistics or problem details, return empty array
    if (!statistics) return [];
    
    // If we don't have problem details, return basic difficulty stats
    if (!statistics.problemDetails) {
      // This handles the case when we only have basic stats
      return Object.entries(statistics.difficultyStats || {})
        .map(([name, value]) => ({
          name,
          value: value || 0,
        }))
        .filter(item => item.value > 0);
    }
    
    // Get problems based on topic filter
    let filteredProblems = [];
    if (topicFilter === 'all') {
      // Collect all problems from all topics
      Object.values(statistics.problemDetails).forEach(problems => {
        filteredProblems = [...filteredProblems, ...problems];
      });
    } else if (statistics.problemDetails[topicFilter]) {
      // Get problems for specific topic
      filteredProblems = statistics.problemDetails[topicFilter];
    }
    
    // Apply status filter
    if (statusFilter === 'solved') {
      filteredProblems = filteredProblems.filter(problem => problem.solved);
    } else if (statusFilter === 'unsolved') {
      filteredProblems = filteredProblems.filter(problem => !problem.solved);
    }
    
    // Count by difficulty
    const difficultyCounts = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
      Unknown: 0,
    };
    
    filteredProblems.forEach(problem => {
      const difficulty = problem.difficulty || 'Unknown';
      difficultyCounts[difficulty] = (difficultyCounts[difficulty] || 0) + 1;
    });
    
    // Convert to chart data format
    return Object.entries(difficultyCounts)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [statistics, statusFilter, topicFilter]);
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <CardTitle>Problems by Difficulty</CardTitle>
          <RefreshButton showText={false} />
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[250px]">
          <p className="text-gray-500">Loading statistics...</p>
        </CardContent>
      </Card>
    );
  }
  
  // No data check
  if (!statistics || chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <CardTitle>Problems by Difficulty</CardTitle>
          <RefreshButton showText={false} />
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <StatusFilter value={statusFilter} onChange={setStatusFilter} />
            <TopicFilter 
              value={topicFilter} 
              onChange={setTopicFilter} 
              topics={topics} 
            />
          </div>
          <div className="flex justify-center items-center h-[200px]">
            <p className="text-gray-500">No matching problems found</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle>Problems by Difficulty</CardTitle>
        <RefreshButton showText={false} />
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
          <TopicFilter 
            value={topicFilter} 
            onChange={setTopicFilter} 
            topics={topics} 
          />
        </div>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
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

// Status filter dropdown component
function StatusFilter({ value, onChange }) {
  return (
    <div className="w-1/2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="total">All Problems</SelectItem>
          <SelectItem value="solved">Solved Only</SelectItem>
          <SelectItem value="unsolved">Unsolved Only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// Topic filter dropdown component
function TopicFilter({ value, onChange, topics }) {
  if (!topics || topics.length === 0) return null;
  
  return (
    <div className="w-1/2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by topic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Topics</SelectItem>
          {topics.map(topic => (
            <SelectItem key={topic} value={topic}>
              {topic}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
