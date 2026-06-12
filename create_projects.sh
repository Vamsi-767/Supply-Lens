#!/bin/bash
# Creates TaskFlow and BizPulse projects in ~/Downloads

set -e

#############################################
# PROJECT 1: TaskFlow - Task Management
#############################################
cd /Users/vamsikrishnabodaballa/Downloads/TaskFlow

# Tailwind config
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
EOF

# CSS
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
body { font-family: Inter, system-ui, sans-serif; }
EOF

# Main App
cat > src/App.jsx << 'EOF'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#f59e0b','#ef4444','#10b981']

const initialTasks = [
  { id: 1, title: 'Design landing page mockups', assignee: 'Sarah Chen', status: 'Done', priority: 'High', date: '2025-12-01' },
  { id: 2, title: 'Implement user authentication', assignee: 'Mike Ross', status: 'In Progress', priority: 'High', date: '2025-12-03' },
  { id: 3, title: 'Set up CI/CD pipeline', assignee: 'Alex Kim', status: 'In Progress', priority: 'Medium', date: '2025-12-04' },
  { id: 4, title: 'Write API documentation', assignee: 'Lisa Park', status: 'To Do', priority: 'Medium', date: '2025-12-05' },
  { id: 5, title: 'Database schema review', assignee: 'James Liu', status: 'Done', priority: 'High', date: '2025-12-02' },
  { id: 6, title: 'Fix checkout page bugs', assignee: 'Sarah Chen', status: 'In Progress', priority: 'High', date: '2025-12-06' },
  { id: 7, title: 'Performance optimization', assignee: 'Mike Ross', status: 'To Do', priority: 'Low', date: '2025-12-08' },
  { id: 8, title: 'Mobile responsive testing', assignee: 'Alex Kim', status: 'To Do', priority: 'Medium', date: '2025-12-07' },
  { id: 9, title: 'Security audit preparation', assignee: 'James Liu', status: 'To Do', priority: 'High', date: '2025-12-09' },
  { id: 10, title: 'Client demo presentation', assignee: 'Lisa Park', status: 'Done', priority: 'High', date: '2025-12-10' },
  { id: 11, title: 'Integrate payment gateway', assignee: 'Mike Ross', status: 'In Progress', priority: 'High', date: '2025-12-11' },
  { id: 12, title: 'Email notification system', assignee: 'Sarah Chen', status: 'To Do', priority: 'Medium', date: '2025-12-12' },
]

const weeklyData = [
  { day: 'Mon', completed: 4, created: 6 },
  { day: 'Tue', completed: 3, created: 4 },
  { day: 'Wed', completed: 7, created: 5 },
  { day: 'Thu', completed: 5, created: 3 },
  { day: 'Fri', completed: 6, created: 8 },
  { day: 'Sat', completed: 2, created: 1 },
  { day: 'Sun', completed: 1, created: 2 },
]

export default function App() {
  const [tasks] = useState(initialTasks)
  
  const todo = tasks.filter(t => t.status === 'To Do')
  const inProgress = tasks.filter(t => t.status === 'In Progress')
  const done = tasks.filter(t => t.status === 'Done')
  
  const pieData = [
    { name: 'To Do', value: todo.length },
    { name: 'In Progress', value: inProgress.length },
    { name: 'Done', value: done.length },
  ]

  const getPriorityColor = (p) => {
    if (p === 'High') return 'bg-red-100 text-red-700 border-red-200'
    if (p === 'Medium') return 'bg-amber-100 text-amber-700 border-amber-200'
    return 'bg-green-100 text-green-700 border-green-200'
  }

  const getStatusColor = (s) => {
    if (s === 'Done') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    if (s === 'In Progress') return 'bg-blue-100 text-blue-700 border-blue-200'
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">TF</div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">TaskFlow</h1>
              <p className="text-xs text-slate-400">Project Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </span>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">A</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <h2 className="text-2xl font-bold">Team Project Dashboard</h2>
          <p className="mt-2 text-indigo-100 max-w-lg text-sm">Track tasks, monitor team progress, and manage project timelines. Built for agile teams that ship fast.</p>
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">📋 Kanban Board</span>
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">👥 Team Tracking</span>
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">📊 Analytics</span>
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">⚡ Real-time</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{tasks.length}</p>
            <p className="mt-1 text-xs text-slate-400">Across all sprints</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">{inProgress.length}</p>
            <p className="mt-1 text-xs text-slate-400">Being worked on</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{done.length}</p>
            <p className="mt-1 text-xs text-slate-400">This sprint</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</p>
            <p className="mt-2 text-3xl font-bold text-purple-600">{Math.round(done.length/tasks.length*100)}%</p>
            <p className="mt-1 text-xs text-slate-400">Sprint progress</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-900">Weekly Activity</h3>
            <p className="text-xs text-slate-400 mt-1">Tasks created vs completed</p>
            <div style={{width:'100%',height:'250px'}} className="mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{fill:'#64748b',fontSize:12}} />
                  <YAxis tick={{fill:'#64748b',fontSize:11}} />
                  <Tooltip contentStyle={{borderRadius:'8px',border:'1px solid #e2e8f0'}} />
                  <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[4,4,0,0]} />
                  <Bar dataKey="created" name="Created" fill="#c7d2fe" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900">Task Distribution</h3>
            <p className="text-xs text-slate-400 mt-1">By status</p>
            <div style={{width:'100%',height:'180px'}} className="mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                    {pieData.map((_,i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1.5">
              {pieData.map((item,i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{background:COLORS[i]}}></span>
                  <span className="text-slate-600">{item.name}</span>
                  <span className="ml-auto font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">All Tasks</h3>
            <p className="text-xs text-slate-400 mt-1">Current sprint backlog</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="text-left px-6 py-3 border-b border-slate-100">Task</th>
                  <th className="text-left px-6 py-3 border-b border-slate-100">Assignee</th>
                  <th className="text-left px-6 py-3 border-b border-slate-100">Priority</th>
                  <th className="text-left px-6 py-3 border-b border-slate-100">Status</th>
                  <th className="text-left px-6 py-3 border-b border-slate-100">Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-800">{task.title}</td>
                    <td className="px-6 py-3.5 text-slate-600">{task.assignee}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full border text-xs font-bold ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full border text-xs font-bold ${getStatusColor(task.status)}`}>{task.status}</span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">{task.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-100">
          TaskFlow — Project Management Platform • © 2025 aiStreams LLC
        </footer>
      </main>
    </div>
  )
}
EOF

# Remove default App.css
rm -f src/App.css

echo "✅ TaskFlow project ready!"

#############################################
# PROJECT 2: BizPulse - Analytics Dashboard
#############################################
cd /Users/vamsikrishnabodaballa/Downloads/BizPulse
echo "y" | npm create vite@latest . -- --template react 2>/dev/null || true

echo "Installing BizPulse deps..."
npm install 2>/dev/null
npm install tailwindcss@3 postcss autoprefixer recharts lucide-react 2>/dev/null
npx tailwindcss init -p 2>/dev/null

cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
EOF

cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
body { font-family: Inter, system-ui, sans-serif; }
EOF

cat > src/App.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const trafficData = [
  { time: '9AM', visitors: 120, conversions: 8 },
  { time: '10AM', visitors: 280, conversions: 22 },
  { time: '11AM', visitors: 420, conversions: 35 },
  { time: '12PM', visitors: 380, conversions: 28 },
  { time: '1PM', visitors: 310, conversions: 24 },
  { time: '2PM', visitors: 450, conversions: 38 },
  { time: '3PM', visitors: 520, conversions: 42 },
  { time: '4PM', visitors: 480, conversions: 36 },
  { time: '5PM', visitors: 350, conversions: 25 },
  { time: '6PM', visitors: 220, conversions: 15 },
]

const revenueData = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 15800 },
  { month: 'Mar', revenue: 14200 },
  { month: 'Apr', revenue: 18600 },
  { month: 'May', revenue: 22100 },
  { month: 'Jun', revenue: 19800 },
  { month: 'Jul', revenue: 24500 },
  { month: 'Aug', revenue: 28200 },
]

const topPages = [
  { page: '/products', views: 12840, bounce: '32%' },
  { page: '/pricing', views: 8420, bounce: '28%' },
  { page: '/about', views: 6230, bounce: '45%' },
  { page: '/blog/react-tips', views: 5810, bounce: '22%' },
  { page: '/contact', views: 4120, bounce: '38%' },
  { page: '/docs/getting-started', views: 3890, bounce: '18%' },
]

export default function App() {
  const [activeVisitors, setActiveVisitors] = useState(47)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVisitors(prev => prev + Math.floor(Math.random()*5) - 2)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">BP</div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">BizPulse</h1>
              <p className="text-xs text-slate-400">Business Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {activeVisitors} online
            </span>
            <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-bold text-cyan-600">A</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/3 translate-x-1/4"></div>
          <h2 className="text-2xl font-bold">Business Intelligence Dashboard</h2>
          <p className="mt-2 text-blue-100 max-w-lg text-sm">Monitor your business metrics in real-time. Track visitors, revenue, conversions, and user engagement from one unified view.</p>
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">📈 Traffic Analytics</span>
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">💰 Revenue Tracking</span>
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">🎯 Conversion Rates</span>
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">🌍 Geo Insights</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Visitors</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">24,831</p>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">+18% from last month</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Revenue</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">$28,200</p>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">+24% from last month</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conversion Rate</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">3.8%</p>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">+0.4% from last month</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Session</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">4m 32s</p>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">+12% engagement</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900">Today's Traffic</h3>
            <p className="text-xs text-slate-400 mt-1">Visitors by hour</p>
            <div style={{width:'100%',height:'250px'}} className="mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{fill:'#64748b',fontSize:11}} />
                  <YAxis tick={{fill:'#64748b',fontSize:11}} />
                  <Tooltip contentStyle={{borderRadius:'8px',border:'1px solid #e2e8f0'}} />
                  <Area type="monotone" dataKey="visitors" stroke="#0891b2" fill="#cffafe" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900">Monthly Revenue</h3>
            <p className="text-xs text-slate-400 mt-1">Revenue trend (USD)</p>
            <div style={{width:'100%',height:'250px'}} className="mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{fill:'#64748b',fontSize:11}} />
                  <YAxis tick={{fill:'#64748b',fontSize:11}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{borderRadius:'8px',border:'1px solid #e2e8f0'}} formatter={v=>`$${v.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Top Pages</h3>
            <p className="text-xs text-slate-400 mt-1">Most visited pages this month</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="text-left px-6 py-3 border-b border-slate-100">Page</th>
                  <th className="text-left px-6 py-3 border-b border-slate-100">Views</th>
                  <th className="text-left px-6 py-3 border-b border-slate-100">Bounce Rate</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map(page => (
                  <tr key={page.page} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-indigo-600 font-medium">{page.page}</td>
                    <td className="px-6 py-3.5 font-bold text-slate-800">{page.views.toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-slate-500">{page.bounce}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-100">
          BizPulse — Business Analytics Platform • © 2025 aiStreams LLC
        </footer>
      </main>
    </div>
  )
}
EOF

rm -f src/App.css

echo "✅ BizPulse project ready!"
echo ""
echo "Both projects created! To test locally:"
echo "  cd ~/Downloads/TaskFlow && npm run dev"
echo "  cd ~/Downloads/BizPulse && npm run dev"
