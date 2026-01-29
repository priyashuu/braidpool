import Prices from './Prices';

const BitcoinStats = () => {
  return (
    <div>
      <div ref={rewardsChartRef} className="w-full h-[90%]">
            <ResponsiveContainer width="100%" height="100%">
      <Prices />
            </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BitcoinStats;
