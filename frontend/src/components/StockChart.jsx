import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

function StockChart({
  total,
  low,
  out,
  expiring,
  expired
}) {

  const data = [
    {
      name: "Normal",
      value: total - low - out - expired
    },
    {
      name: "Low Stock",
      value: low
    },
    {
      name: "Out Stock",
      value: out
    },
    {
      name: "Expiring",
      value: expiring
    },
    {
      name: "Expired",
      value: expired
    }
  ];

  const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#ef4444",
    "#f97316",
    "#6b7280"
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5">

      {/* HEADER */}
      <div className="mb-5">

        <h2 className="text-lg font-semibold text-gray-800">
          Inventory Overview
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Current medicine stock analytics
        </p>

      </div>

      {/* CHART */}
      <div className="w-full h-[300px] min-h-[300px]">

        <ResponsiveContainer width="95%" height={300}>

          <BarChart
            data={data}
            barSize={45}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tick={{
                fontSize: 12
              }}
            />

            <YAxis
              tick={{
                fontSize: 12
              }}
            />

            <Tooltip />

            <Bar
              dataKey="value"
              radius={[10, 10, 0, 0]}
            >

              {data.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index]}
                />

              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default StockChart;