import { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';
import { BlockList } from './BlockList';
import { BlockStats } from './BlockStats';

export default function EnhancedBlocksTab({
  timeRange,
}: {
  timeRange: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animateBlocks, setAnimateBlocks] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  type Block = {
    id: string | number;
    height: string | number;
    timestamp: number;
    miner: string;
    transactions: number;
    size: number;
    difficulty: string | number;
  };

  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:65434');

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Received message:', message); 

        
        if (message.latest_block) {
          const lb = message.latest_block;
          const parsedBlock = {
            id: lb.hash || lb.height,
            height: lb.height || 'N/A',
            timestamp: lb.timestamp === 'N/A' ? Date.now() : new Date(lb.timestamp).getTime(),
            miner: lb.miner || 'Unknown',
            transactions: lb.transactions || 0,
            size: lb.size || 0,
            difficulty: lb.difficulty || 'N/A',
          };
          setBlocks([parsedBlock]);
          setIsLoaded(true);
          console.log('Set blocks (latest_block):', [parsedBlock]); 
        } else if (message?.data && Array.isArray(message.data.blocks)) {
         
          const parsedBlocks = message.data.blocks.slice(0, 10).map((block: any) => ({
            id: block.hash || block.height,
            height: block.height || 'N/A',
            timestamp: block.time ? block.time * 1000 : Date.now(),
            miner: block.foundBy?.description || 'Unknown',
            transactions: block.txIndexes?.length || 0,
            size: block.size || 0,
            difficulty: block.difficulty || 'N/A',
          }));
          setBlocks(parsedBlocks);
          setIsLoaded(true);
          console.log('Set blocks (blocks array):', parsedBlocks); 
        } else if (typeof message.data === "string") {
          console.info("ℹInfo message from server:", message.data);
        } else {
          console.warn("No blocks found in data or unexpected format:", message);
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
        setIsLoaded(true); 
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsLoaded(true);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  // LOG BLOCKS STATE ON EVERY RENDER
  console.log('blocks state:', blocks);

  return (
    <div className="space-y-6 animate-fade-in-up px-4 sm:px-6 md:px-8 lg:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400 flex items-center gap-2 drop-shadow-md">
            <Layers className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-500 animate-pulse" />
            Block Explorer
          </h2>
          <p className="text-gray-400 mt-1 text-sm md:text-base lg:text-lg max-w-md">
            Explore the latest blocks in the network with detailed insights.
          </p>
        </div>
      </div>

      {/* Views */}
      <div className="relative border border-blue-500/20 rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-black via-slate-900 to-black shadow-lg shadow-blue-500/10 backdrop-blur-md overflow-hidden transition-all duration-300 min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
        {viewMode === 'list' && (
          <BlockList
            blockVisualizationData={blocks}
            animateBlocks={animateBlocks}
            isLoaded={isLoaded}
          />
        )}
      </div>

      {/* Stats section */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900/70 to-black border border-gray-800/40 p-4 sm:p-6 shadow-inner shadow-black/20">
        <BlockStats />
      </div>
    </div>
  );
}
