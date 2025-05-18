import { useRepository } from '@/contexts/repository-context';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ProblemStatusUpdater } from './RepositoryRefresh';
import './markdown.css';

// Function to get difficulty color
const getDifficultyColor = (difficulty) => {
  if (!difficulty) return 'bg-gray-500';
  
  const difficultyLower = difficulty.toLowerCase();
  if (difficultyLower === 'easy') return 'bg-green-500';
  if (difficultyLower === 'medium') return 'bg-yellow-500';
  if (difficultyLower === 'hard') return 'bg-red-500';
  return 'bg-gray-500';
};

export function FileViewer() {
  const { fileContent, selectedFile, loading } = useRepository();
  
  if (loading) {
    return <div className="p-4">Loading file content...</div>;
  }
  
  if (!selectedFile || !fileContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h3 className="text-xl font-medium mb-2">No File Selected</h3>
        <p className="text-gray-500">
          Select a file from the repository tree to view its content.
        </p>
      </div>
    );
  }
  
  const { content, metadata } = fileContent;
  const isMarkdown = selectedFile.endsWith('.md');
  
  // Function to render markdown content
  const renderMarkdown = () => {
    if (!content) return null;
    
    return (
      <div className="prose max-w-none dark:prose-invert dark:text-white">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            // Custom components for rendering markdown elements
            table: ({node, ...props}) => (
              <div className="table-container">
                <table {...props} className="markdown-table" />
              </div>
            ),
            code: ({node, inline, className, children, ...props}) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline ? (
                <pre className="code-block">
                  <code className={match ? `language-${match[1]}` : ''} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };
  
  // Function to render file metadata
  const renderMetadata = () => {
    if (!metadata) return null;
    
    return (
      <div className="mb-4">
        {metadata.difficulty && (
          <Badge className={`mr-2 ${getDifficultyColor(metadata.difficulty)}`}>
            {metadata.difficulty}
          </Badge>
        )}
        
        {metadata.totalProblems > 0 && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Problems Solved</span>
              <span className="text-sm text-gray-500">
                {metadata.solvedProblems} / {metadata.totalProblems}
              </span>
            </div>
            <Progress 
              value={metadata.totalProblems > 0 
                ? (metadata.solvedProblems / metadata.totalProblems) * 100 
                : 0} 
              className="h-2" 
            />
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>{metadata?.title || selectedFile.split('/').pop()}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        {renderMetadata()}
        <div className="markdown-content">
          {isMarkdown ? renderMarkdown() : (
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              <code>{content}</code>
            </pre>
          )}
        </div>
        
        {/* Add problem status updater for solution files */}
        {false && isMarkdown && selectedFile.includes('NeetCode Blind 75/') && !selectedFile.endsWith('README.md') && (
          <ProblemStatusUpdater 
            problem={{
              name: metadata?.title || selectedFile.split('/').pop().replace('.md', ''),
              solved: metadata?.isSolved || false,
              difficulty: metadata?.difficulty
            }} 
            topic={selectedFile.split('/').slice(-2)[0]}
          />
        )}
      </CardContent>
    </Card>
  );
}
