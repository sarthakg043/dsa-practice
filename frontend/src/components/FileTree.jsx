import { useState } from 'react';
import { FolderIcon, FileIcon, ChevronRightIcon, ChevronDownIcon } from 'lucide-react';
import { useRepository } from '@/contexts/repository-context';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export function FileTreeNode({ node, depth = 0 }) {
  const { selectFile, selectedFile } = useRepository();
  const [isOpen, setIsOpen] = useState(true);
  
  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  
  const handleClick = () => {
    if (node.type === 'file') {
      selectFile(node.path);
    } else {
      setIsOpen(!isOpen);
    }
  };
  
  const isSelected = selectedFile === node.path;
  const paddingLeft = `${depth * 16}px`;
  
  if (node.type === 'directory') {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger 
          className="flex items-center py-1 px-2 w-full hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-left text-gray-800 dark:text-gray-200"
          style={{ paddingLeft }}
        >
          <span className="mr-1">
            {isOpen ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
          </span>
          <FolderIcon size={16} className="mr-2 text-blue-500 dark:text-blue-400" />
          <span className="truncate">{node.name}</span>
          {node.children?.length > 0 && (
            <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs">({node.children.length})</span>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          {node.children?.map((child, index) => (
            <FileTreeNode key={index} node={child} depth={depth + 1} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }
  
  return (
    <div
      className={cn(
        "flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-gray-800 dark:text-gray-200",
        isSelected && "bg-blue-100 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900"
      )}
      style={{ paddingLeft }}
      onClick={handleClick}
    >
      <FileIcon size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
      <span className="truncate">{node.name}</span>
    </div>
  );
}

export function FileTree() {
  const { repoTree, loading, error } = useRepository();
  
  if (loading && !repoTree) {
    return <div className="p-4 text-gray-700 dark:text-gray-300">Loading repository...</div>;
  }
  
  
  if (error) {
    // Extract the main error message, removing any technical details
    let errorMessage = error;
    let errorTitle = 'Error loading repository';
    let errorDetails = null;
    
    // Handle specific error cases
    if (error.includes("Expected ',' or ']' after array element in JSON at position 599")) {
      errorTitle = 'Repository Data Format Issue';
      errorMessage = 'There appears to be a format issue with the repository data. We\'re working on a fix.';
      errorDetails = 'The server returned malformed JSON data. This is typically a server-side issue that our team will resolve.';
    } else if (error.includes('JSON') || error.includes('Syntax') || error.includes("Expected '") || error.includes("']'")) {
      errorTitle = 'Invalid Repository Data';
      errorMessage = 'The server returned invalid data that could not be processed. This may be a temporary issue.';
      errorDetails = 'JSON parsing error in the response. You can try reloading the page or clearing your browser cache.';
    } else if (error.includes('Expected JSON response but got')) {
      errorMessage = 'Server returned an invalid format. This might be a temporary issue.';
    }
    
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
        <h3 className="font-bold mb-2 text-red-600 dark:text-red-400">{errorTitle}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{errorMessage}</p>
        
        {errorDetails && (
          <details className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            <summary>Technical details</summary>
            <p className="mt-1">{errorDetails}</p>
            <p className="mt-1 font-mono text-xs overflow-auto">{error}</p>
          </details>
        )}
        
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
          <button
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            onClick={() => {
              window.localStorage.clear();
              window.location.reload();
            }}
          >
            Clear Cache & Reload
          </button>
        </div>
      </div>
    );
  }
  
  if (!repoTree) {
    return <div className="p-4 text-gray-700 dark:text-gray-300">No repository data available</div>;
  }
  
  return (
    <div className="p-2 overflow-auto">
      <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Repository Files</h3>
      <div className="space-y-1">
        <FileTreeNode node={repoTree} />
      </div>
    </div>
  );
}
