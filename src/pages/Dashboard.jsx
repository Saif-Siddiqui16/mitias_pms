import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  Clock,
  Smartphone,
  Mail,
  Database,
  CheckCircle2,
  RefreshCw,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Wrench,
  Sparkles,
  ChevronRight,
  UserCheck,
  CheckSquare,
  Building2,
  Calendar,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp, ROLES } from '../context/AppContext';
import { SuperAdminControlCenter } from './super-admin/SuperAdminControlCenter';
import { dashboardService } from '../services/dashboardService';
import { API_BASE_URL } from '../config';

const Dashboard = () => {
  const { role, user } = useApp();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [briefingData, setBriefingData] = useState(null);
  const [stats, setStats] = useState(null);

  const loadData = async () => {
    try {
      const bData = await dashboardService.getDashboardData();
      setBriefingData(bData);
    } catch (err) {
      console.warn('Dashboard briefing load fallback:', err);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/stats/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('autopilot_token')}`
        }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch backend stats:', err);
    }
  };

  useEffect(() => {
    if (role !== ROLES.SUPER_ADMIN) {
      loadData();
    }
  }, [role]);

  if (role === ROLES.SUPER_ADMIN) {
    return <SuperAdminControlCenter defaultTab="overview" />;
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData().then(() => {
      setIsRefreshing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  };

  const toggleAction = async (actionId) => {
    const updated = await dashboardService.togglePriorityAction(actionId);
    setBriefingData(updated);
  };

  const managerName = user?.name || briefingData?.managerName || "John";
  const hotelName = user?.property || briefingData?.hotelName || "Mercier Hotel";

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700 relative pb-16 text-left selection:bg-purple-950 selection:text-amber-100 font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 30, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-white font-mono">Overview Data Refreshed</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Header: HOTELOGX CONNECT Header & Briefing */}
      <div className="bg-white p-6 rounded-3xl border border-[#E7E4DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-purple-50 border border-purple-200 text-[#6D4AFF] text-[10px] font-bold uppercase tracking-wider font-mono">
              HOTELOGX CONNECT
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">• {hotelName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-2">
            Good Morning, {managerName} 👋
          </h1>
          <p className="text-slate-500 font-medium text-xs sm:text-sm">
            Here is today's AI briefing for {hotelName}.
          </p>
        </div>

        <div>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAF9F6] border border-[#E7E4DD] hover:border-slate-300 text-[#111827] rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#6D4AFF]' : 'text-[#6D4AFF]'} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Briefing'}
          </button>
        </div>
      </div>

      {/* 4 Briefing Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Arrivals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Arrivals</span>
            <span className="text-xl">🏨</span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{briefingData?.arrivals || 24}</span>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Scheduled for check-in today</p>
          </div>
        </div>

        {/* Departures */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Departures</span>
            <span className="text-xl">🚪</span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{briefingData?.departures || 18}</span>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Scheduled for checkout today</p>
          </div>
        </div>

        {/* Guest Requests */}
        <div 
          onClick={() => navigate('/app/conversations')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-[#6D4AFF]">Guest Requests</span>
            <span className="text-xl">💬</span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#6D4AFF] font-mono">{briefingData?.guestRequests || 9}</span>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Active incoming guest messages</p>
          </div>
        </div>

        {/* Escalations */}
        <div 
          onClick={() => navigate('/app/takeover-queue')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-rose-600">Escalations</span>
            <span className="text-xl">⚠</span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-rose-600 font-mono">{briefingData?.escalations || 2}</span>
            <p className="text-[10px] text-rose-600 font-bold mt-0.5">Require human staff attention</p>
          </div>
        </div>

      </div>

      {/* AI Summary Box */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0B1020] text-white p-6 rounded-3xl shadow-md border border-indigo-900/40 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
          <div className="w-8 h-8 rounded-xl bg-[#6D4AFF] flex items-center justify-center text-white shadow-md">
            <Bot size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">🤖 AI Summary</h2>
            <p className="text-[10px] text-indigo-200 font-medium">Automated daily operational highlights</p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {briefingData?.aiSummary.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-xs font-medium text-slate-200">
              <span className="text-amber-400 font-bold text-sm">•</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Revenue Opportunities & Department Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Opportunities */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp size={18} className="text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">📈 Revenue Opportunities</h2>
            </div>

            <div className="divide-y divide-slate-100 mt-3">
              {briefingData?.revenueOpportunities.map((opp) => (
                <div key={opp.id} className="py-3 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-slate-800">{opp.title}</span>
                  </div>
                  <span className="font-extrabold text-slate-900 font-mono text-sm bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    {opp.currency}{opp.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => navigate('/app/conversations')}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-[#6D4AFF] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            View Upsell Recommendations
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Department Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">🧹 Department Status</h2>
            </div>

            <div className="space-y-2.5 mt-3">
              {briefingData?.departmentStatus.map((dept) => (
                <div 
                  key={dept.id}
                  onClick={() => navigate(dept.link)}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#6D4AFF] transition-colors">{dept.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${
                      dept.status === 'ok' ? 'text-emerald-600' :
                      dept.status === 'warning' ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {dept.text}
                    </span>
                    {dept.status === 'ok' && <CheckCircle2 size={16} className="text-emerald-500" />}
                    {dept.status === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
                    {dept.status === 'urgent' && <Wrench size={16} className="text-rose-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-medium text-center">
            Click any department to open its live operational dashboard.
          </p>
        </div>

      </div>

      {/* Today's Priority Actions Widget */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CheckSquare size={18} className="text-[#6D4AFF]" />
            <h2 className="text-base font-bold text-slate-900">Today's Priority Actions</h2>
          </div>
          <span className="text-xs text-slate-400 font-bold font-mono">Action Items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {briefingData?.priorityActions.map((action) => (
            <div 
              key={action.id}
              onClick={() => navigate(action.target)}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                action.status === 'completed' 
                  ? 'bg-slate-50 border-slate-200 opacity-60' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleAction(action.id); }}
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                    action.status === 'completed'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-[#6D4AFF]'
                  }`}
                >
                  {action.status === 'completed' && <CheckCircle2 size={12} />}
                </button>
                <span className={`text-xs font-semibold ${action.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900 group-hover:text-[#6D4AFF]'}`}>
                  {action.title}
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
