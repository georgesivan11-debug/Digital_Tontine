"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DashboardChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} dy={10} interval={0} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            itemStyle={{ color: '#0a1128', fontWeight: 'bold' }}
          />
          <Area type="monotone" dataKey="total" stroke="#facc15" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
