import { motion } from 'framer-motion';

export function BlockList({
  blockVisualizationData,
  animateBlocks,
  isLoaded,
}: {
  blockVisualizationData: any[];
  animateBlocks: boolean;
  isLoaded: boolean;
}) {
  return (
    <div className="space-y-2">
     
      <div className="grid grid-cols-7 gap-4 px-4 py-2 border-b border-gray-800/80 text-sm font-medium text-gray-400">
        <div>Height</div>
        <div>Time</div>
        <div>Miner</div>
        <div>Transactions</div>
        <div>Size</div>
        <div>Difficulty</div>
        <div></div>
      </div>

      
      {blockVisualizationData.length === 0 && (
        <div className="text-center text-gray-400 py-8">No blocks found.</div>
      )}

      {blockVisualizationData.slice(0, 20).map((block, index) => (
        <div
          key={block.id || index}
          className="relative grid grid-cols-7 gap-4 px-4 py-2 border-b border-gray-800/40 text-sm text-gray-200"
        >
          <div>{block.height}</div>
          <div>
            {block.timestamp && !isNaN(Number(block.timestamp))
              ? new Date(block.timestamp).toLocaleString()
              : 'Unknown'}
          </div>
          <div className="truncate">{block.miner || 'Unknown'}</div>
          <div>{block.transactions}</div>
          <div>{block.size}</div>
          <div className="overflow-x-auto">{block.difficulty.toFixed(4)}</div>
          <div>
            <button className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 rounded text-blue-300 text-sm transition-colors">
              Details
            </button>
          </div>

          
          {index < 3 && animateBlocks && (
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
