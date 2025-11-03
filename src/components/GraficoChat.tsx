import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface GraficoData {
  tipo: string;
  titulo: string;
  labels: string[];
  valores: number[];
  cores: string[];
}

interface GraficoChatProps {
  data: GraficoData | null;
}

export default function GraficoChat({ data }: GraficoChatProps) {
  if (!data) return null;
  
  const { tipo, titulo, labels, valores, cores } = data;
  
  const chartData = labels.map((label, index) => ({
    name: label,
    value: valores[index]
  }));
  
  return (
    <div className="my-4 p-6 bg-gray-800/50 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4 text-cyan-400">{titulo}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {tipo === 'pie' ? (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={cores[index]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #06b6d4',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
          </PieChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #06b6d4',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={cores[index]} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
