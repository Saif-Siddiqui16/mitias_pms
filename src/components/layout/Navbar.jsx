import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Bell, ChevronDown, LogOut, Settings as SettingsIcon, User, Hotel, 
  LayoutDashboard, MessageSquare, CheckSquare, TrendingUp, Cpu, Library, 
  Activity, Users, Sparkles, Wrench, Server, Menu, ArrowLeft, MoreHorizontal,
  Building2, CreditCard, UserCheck
} from 'lucide-react';
import { useApp, ROLES } from '../../context/AppContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import { cn } from '../../utils/cn';

export const Navbar = () => {
  const { role, user, notifications, markNotificationRead, setIsAuthenticated, toggleSidebar, activeWorkspace, exitWorkspace, hotelSubscription, rolePermissions } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchInputRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const moreMenuRef = useRef(null);

  useClickOutside(notificationRef, () => setShowNotifications(false));
  useClickOutside(profileRef, () => setShowProfile(false));
  useClickOutside(moreMenuRef, () => setShowMoreMenu(false));

  const rawQuery = searchQuery.toLowerCase().trim();

  const searchResults = rawQuery.length > 1 ? [
    { id: 'C1', name: 'Sarah Jenkins', subtext: 'WhatsApp • Active', type: 'Conversation', icon: MessageSquare, path: '/app/conversations' },
    { id: 'W1', name: 'Late Checkout', subtext: 'Automation Workflow', type: 'Cpu', path: '/app/automation-engine' },
    { id: 'K1', name: 'AI Late Checkout Rule', subtext: 'AI Communication Rule', type: 'Automation Rule', icon: SettingsIcon, path: '/app/knowledge-base' },
  ].filter(r => r.name.toLowerCase().includes(rawQuery)).slice(0, 6) : [];

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectResult(searchResults[selectedIndex]);
    } else if (e.key === 'Escape') {
      setSearchQuery('');
      searchInputRef.current?.blur();
    }
  };

  const handleSelectResult = (result) => {
    navigate(result.path);
    setSearchQuery('');
    setSelectedIndex(-1);
    searchInputRef.current?.blur();
  };

  const getRoleLabel = (currentRole) => {
    if (currentRole === ROLES.SUPER_ADMIN) return 'Super Admin';
    if (currentRole === ROLES.PLATFORM_OPERATOR) return 'Operator';
    if (currentRole === ROLES.MANAGER) return 'Manager';
    return currentRole ? currentRole.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'User';
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const userName = (user?.name && user.name !== 'John Doe') ? user.name : (role === ROLES.SUPER_ADMIN ? 'System Admin' : 'Satyam Goswami');
  const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const hotelName = activeWorkspace?.name || hotelSubscription?.hotelName || 'Mercier Hotel';

  // Clean top navbar navigation for Manager / Front Office as requested by client
  const managerNav = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/app', exact: true },
    { name: 'Conversations', icon: MessageSquare, path: '/app/conversations' },
    { name: 'Tasks', icon: UserCheck, path: '/app/takeover-queue' },
    { name: 'Upsells', icon: TrendingUp, path: '/app/transactions' },
    { name: 'Housekeeping', icon: Sparkles, path: '/app/housekeeping' },
    { name: 'Maintenance', icon: Wrench, path: '/app/maintenance' },
    { name: 'Users', icon: Users, path: '/app/users' },
    { name: 'Settings', icon: SettingsIcon, path: '/app/settings' },
  ];

  const superAdminNav = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/app', exact: true },
    { name: 'Setup Requests', icon: Users, path: '/app/onboarding' },
    { name: 'Hotel Accounts', icon: Building2, path: '/app/workspaces' },
    { name: 'Billing Management', icon: CreditCard, path: '/app/billing-management' },
    { name: 'System Settings', icon: SettingsIcon, path: '/app/platform-settings' },
  ];

  const filteredNavigation = role === ROLES.SUPER_ADMIN ? superAdminNav : managerNav;

  // Render ALL filtered navigation items directly in the top navigation bar
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 bg-[#0F172A] text-white border-b border-slate-800 shadow-md">
        {/* Tier 1: Brand & User Header */}
        <div className="h-14 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800/80 bg-[#090D16]">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60"
              title="Toggle Menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#6D4AFF] rounded-lg flex items-center justify-center text-white shadow-sm font-bold">
                <Hotel size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-wider font-mono text-white">HOTELOGX CONNECT</span>
                <span className="text-[9px] font-semibold text-purple-400 font-mono tracking-widest uppercase">Front Office</span>
              </div>
            </div>
          </div>

          {/* Hotel Name Center Display */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200 font-mono">{hotelName}</span>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative hidden sm:block w-40 lg:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1 bg-slate-800/80 border border-slate-700 focus:border-[#6D4AFF] rounded-lg text-xs font-medium text-slate-200 outline-none transition-all placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full right-0 w-72 mt-2 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-2">
                    {searchResults.map((res, i) => {
                      const Icon = res.icon;
                      return (
                        <div 
                          key={res.id} 
                          className={cn(
                            "p-2.5 rounded-lg cursor-pointer flex items-center justify-between text-left transition-colors",
                            selectedIndex === i ? "bg-purple-50 text-[#6D4AFF]" : "hover:bg-slate-50"
                          )}
                          onClick={() => handleSelectResult(res)}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon size={16} className="text-slate-500" />
                            <div>
                              <div className="text-xs font-bold text-slate-800">{res.name}</div>
                              <div className="text-[10px] text-slate-400">{res.subtext}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <span className="font-bold text-xs">Notifications</span>
                    <button className="text-[10px] text-[#6D4AFF] font-bold hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} onClick={() => markNotificationRead(n.id)} className="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer text-left">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-md bg-[#6D4AFF] flex items-center justify-center text-white text-xs font-bold font-mono">
                  {userInitials}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight">{userName}</span>
                  <span className="text-[9px] text-purple-300 font-mono uppercase font-semibold">[{getRoleLabel(role)}]</span>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 text-left">
                    <p className="text-xs font-bold text-slate-800">{userName}</p>
                    <p className="text-[10px] text-purple-600 font-mono font-bold uppercase mt-0.5">{getRoleLabel(role)}</p>
                  </div>
                  <div className="p-1">
                    <button 
                      onClick={() => { 
                        const settingsPath = role === ROLES.SUPER_ADMIN ? '/app/platform-settings' : '/app/settings';
                        navigate(settingsPath); 
                        setShowProfile(false); 
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg text-left font-medium"
                    >
                      <SettingsIcon size={14} /> Settings
                    </button>
                    
                    <div className="h-[1px] bg-slate-100 my-1" />
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1 block">Department Views</span>
                    
                    <button 
                      onClick={() => { navigate('/app/housekeeping'); setShowProfile(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-purple-50 hover:text-[#6D4AFF] rounded-lg text-left font-medium"
                    >
                      🧹 Housekeeping
                    </button>
                    <button 
                      onClick={() => { navigate('/app/maintenance'); setShowProfile(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-purple-50 hover:text-[#6D4AFF] rounded-lg text-left font-medium"
                    >
                      🔧 Maintenance
                    </button>
                    <button 
                      onClick={() => { navigate('/app/users'); setShowProfile(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-purple-50 hover:text-[#6D4AFF] rounded-lg text-left font-medium"
                    >
                      👥 Staff & Users
                    </button>

                    <div className="h-[1px] bg-slate-100 my-1" />
                    <button 
                      onClick={() => setIsAuthenticated(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg text-left font-bold"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tier 2: Complete Navigation Bar with ALL menu items visible inline */}
        <div className="h-11 px-4 sm:px-8 bg-[#0F172A] flex items-center border-b border-slate-800 overflow-x-auto space-x-1 sm:space-x-2 scrollbar-thin">
          {filteredNavigation.map(item => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all font-mono whitespace-nowrap shrink-0",
                  isActive 
                    ? "bg-[#6D4AFF] text-white shadow-sm" 
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                )}
              >
                <Icon size={14} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </header>

      {/* Workspace Impersonation Banner */}
      {activeWorkspace && (
        <div className="fixed top-[100px] right-0 left-0 h-10 bg-gradient-to-r from-[#6D4AFF] to-purple-800 text-white px-6 flex items-center justify-between shadow-sm z-20">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold">Viewing Workspace: {activeWorkspace.name}</span>
          </div>
          <button 
            onClick={() => { exitWorkspace(); navigate('/app/workspaces'); }}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono"
          >
            <ArrowLeft size={12} /> Back to Admin
          </button>
        </div>
      )}
    </>
  );
};



