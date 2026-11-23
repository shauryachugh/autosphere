import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Coins, 
  Fuel, 
  Zap, 
  Wrench, 
  Shield, 
  Sparkles, 
  Download, 
  PlusCircle, 
  Filter, 
  Search, 
  Trash2, 
  TrendingUp, 
  Calendar,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { formatINR, formatDate, formatKm } from '../utils/formatters';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';

export const CostIntelligence: React.FC = () => {
  const { 
    activeVehicle, 
    activeVehicleExpenses, 
    openLogExpense, 
    deleteExpense, 
    showToast 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeframe, setTimeframe] = useState<'all' | '2026' | 'monthly'>('2026');

  // Filtered expense entries
  const filteredExpenses = activeVehicleExpenses.filter((e) => {
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchVendor = e.vendor.toLowerCase().includes(q);
      const matchNotes = e.notes.toLowerCase().includes(q);
      const matchCat = e.category.toLowerCase().includes(q);
      if (!matchVendor && !matchNotes && !matchCat) return false;
    }
    return true;
  });

  // Calculate totals
  const totalSpend = activeVehicleExpenses.reduce((sum, e) => sum + e.amountINR, 0);
  const fuelSpend = activeVehicleExpenses
    .filter((e) => e.category === 'fuel' || e.category === 'charging')
    .reduce((sum, e) => sum + e.amountINR, 0);
  const serviceSpend = activeVehicleExpenses
    .filter((e) => e.category === 'service')
    .reduce((sum, e) => sum + e.amountINR, 0);
  const tollSpend = activeVehicleExpenses
    .filter((e) => e.category === 'toll')
    .reduce((sum, e) => sum + e.amountINR, 0);

  // Cost per km calculation
  const totalKmDriven = Math.max(1, activeVehicle.odoKm - 10000);
  const costPerKm = (totalSpend / totalKmDriven).toFixed(2);

  // Monthly aggregated data for Recharts Bar Chart
  const monthlyData = [
    { month: 'Jun 2026', fuel: 9200, service: 0, toll: 650, insurance: 0 },
    { month: 'Jul 2026', fuel: 8400, service: 0, toll: 480, insurance: 0 },
    { month: 'Aug 2026', fuel: 9800, service: 14800, toll: 720, insurance: 0 },
    { month: 'Sep 2026', fuel: 8900, service: 0, toll: 510, insurance: 0 },
    { month: 'Oct 2026', fuel: 10400, service: 0, toll: 850, insurance: 0 },
    { month: 'Nov 2026', fuel: 10050, service: 0, toll: 505, insurance: 0 },
  ];

  // Category distribution for Pie Chart
  const categoryData = [
    { name: 'Fuel & Energy', value: fuelSpend, color: '#00D2FF' },
    { name: 'Scheduled Service', value: serviceSpend, color: '#38BDF8' },
    { name: 'Insurance & Taxes', value: 38400, color: '#818CF8' },
    { name: 'FASTag & Tolls', value: tollSpend, color: '#34D399' },
    { name: 'Accessories & Wash', value: 13199, color: '#F472B6' },
  ];

  // CSV Export simulation
  const handleExportCSV = () => {
    const csvHeader = 'Date,Category,Vendor,Notes,PaymentMethod,AmountINR\n';
    const csvRows = activeVehicleExpenses
      .map(
        (e) =>
          `"${e.date}","${e.category}","${e.vendor}","${e.notes}","${e.paymentMethod}",${e.amountINR}`
      )
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AutoSphere_TCO_${activeVehicle.regNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('TCO Ledger exported to CSV file successfully.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ownership Cost Intelligence
            </h1>
            <Badge variant="electric" size="sm">
              TCO Analytics
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Comprehensive lifecycle cost intelligence, fuel tracking and audit ledger for {activeVehicle.make} {activeVehicle.model}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4 text-cyan-400" />}
          >
            Export CSV Report
          </Button>
          <Button
            onClick={openLogExpense}
            variant="primary"
            size="sm"
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Log New Expense
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Recorded Ownership Spend"
          value={formatINR(totalSpend)}
          subtitle={`Across ${activeVehicleExpenses.length} transactions`}
          icon={<Coins className="w-5 h-5" />}
          trend={{ value: '₹6.8 / km', isNeutral: true }}
          accentColor="cyan"
        />

        <StatCard
          title="Net Fuel & Charging Spend"
          value={formatINR(fuelSpend)}
          subtitle={activeVehicle.avgEfficiency}
          icon={<Fuel className="w-5 h-5" />}
          accentColor="cyan"
        />

        <StatCard
          title="Service & Maintenance"
          value={formatINR(serviceSpend)}
          subtitle="OEM Authorized parts"
          icon={<Wrench className="w-5 h-5" />}
          accentColor="indigo"
        />

        <StatCard
          title="FASTag Toll Expenses"
          value={formatINR(tollSpend)}
          subtitle="NHAI & Expressway plazas"
          icon={<Zap className="w-5 h-5" />}
          accentColor="emerald"
        />
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Expense Breakdown Bar Chart (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2 text-sm font-bold text-white">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Monthly Expenditure Dynamics (2026)
                </span>
                <span className="text-xs text-slate-400 font-mono">INR (₹)</span>
              </div>
            }
          >
            <div className="h-64 sm:h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                  />
                  <Bar dataKey="fuel" fill="#00D2FF" name="Fuel / EV" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="service" fill="#818CF8" name="Maintenance" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="toll" fill="#34D399" name="FASTag" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 pt-3 text-xs border-t border-slate-800 text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Fuel & Charging
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Maintenance
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> FASTag Tolls
              </span>
            </div>
          </Card>
        </div>

        {/* Cost Distribution Pie Chart (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            header={
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <Layers className="w-4 h-4 text-cyan-400" />
                TCO Expense Category Share
              </span>
            }
          >
            <div className="h-64 sm:h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Spend']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-mono font-semibold text-white">
                    {formatINR(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Expense Ledger Table */}
      <Card
        header={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <span className="flex items-center gap-2 text-sm font-bold text-white">
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              Detailed Vehicle Expense Ledger ({filteredExpenses.length})
            </span>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search fuel, vendor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-dark-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-dark-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Categories</option>
                <option value="fuel">Fuel</option>
                <option value="charging">EV Charging</option>
                <option value="service">Service</option>
                <option value="toll">FASTag Toll</option>
                <option value="insurance">Insurance</option>
                <option value="wash">Wash & Care</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-850/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Vendor & Details</th>
                <th className="py-3 px-4">Odometer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-dark-850/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {formatDate(exp.date)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        exp.category === 'fuel' || exp.category === 'charging'
                          ? 'electric'
                          : exp.category === 'service'
                          ? 'info'
                          : exp.category === 'toll'
                          ? 'success'
                          : 'neutral'
                      }
                      size="xs"
                    >
                      {exp.category.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-white">{exp.vendor}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs">{exp.notes}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {exp.odoKm ? formatKm(exp.odoKm) : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-dark-800 border border-slate-700/60 text-[10px] font-mono">
                      {exp.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white font-mono text-sm">
                    {formatINR(exp.amountINR)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
