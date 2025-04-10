interface StatComparisonProps {
  label: string;
  player1Stat: number;
  player2Stat: number;
}

export default function StatComparison({
  label,
  player1Stat,
  player2Stat,
}: StatComparisonProps) {
  const getStatComparison = (stat1: number, stat2: number) => {
    if (stat1 > stat2) return "text-green-600";
    if (stat1 < stat2) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="grid grid-cols-3 items-center py-4 border-b border-gray-100">
      <div
        className={`text-right ${getStatComparison(
          player1Stat,
          player2Stat
        )} font-bold`}
      >
        {player1Stat}
      </div>
      <div className="text-center text-sm text-gray-500 font-medium px-4">
        {label}
      </div>
      <div
        className={`text-left ${getStatComparison(
          player2Stat,
          player1Stat
        )} font-bold`}
      >
        {player2Stat}
      </div>
    </div>
  );
}
