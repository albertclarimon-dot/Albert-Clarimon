import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, AlertTriangle, User as UserIcon, Wifi, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppContext } from '../../context/AppContext';

export function AppLayout() {
  const { currentUser } = useAppContext();
  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh] bg-[#f0f2f5] text-[#1a1a1b] font-sans w-full max-w-[1024px] mx-auto relative md:shadow-none overflow-hidden">
      {/* Desktop Sidebar (Bento Grid Style) */}
      <nav className="hidden md:flex w-[80px] bg-[#1a1a1b] flex-col items-center py-6 gap-6 shrink-0 z-20">
         <NavIcon path="/" activePath="/" />
         {currentUser?.role === 'ADMIN' && (
           <>
             <NavIcon path="/history" activePath="/history" borderOnly />
             <NavIcon path="/incidents" activePath="/incidents" circle />
             <NavIcon path="/users" activePath="/users" danger />
           </>
         )}
      </nav>

      <div className="md:hidden">
         <TopBar />
      </div>

      <main className="flex-1 overflow-y-auto pb-24 md:pb-8 px-5 pt-4 md:p-8">
        <Outlet />
      </main>

      <div className="md:hidden">
         <BottomNav />
      </div>
    </div>
  );
}

function NavIcon({ path, activePath, borderOnly, circle, danger }: any) {
   const navigate = useNavigate();
   const { pathname } = useLocation();
   const isActive = pathname === activePath || (activePath !== '/' && pathname.startsWith(activePath));
   
   return (
     <div 
       onClick={() => navigate(path)}
       className={cn(
         "w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors",
         isActive ? "bg-[#2563eb]" : "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]"
       )}
     >
       <div className={cn(
         "w-5 h-5 border-2",
         borderOnly && !isActive ? "border-[#94a3b8] bg-transparent" : "border-white bg-white",
         circle ? "rounded-full" : "rounded-[4px]",
         danger ? "bg-[#ef4444] border-none" : ""
       )}></div>
     </div>
   );
}

function TopBar() {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between px-5 py-4 bg-white sticky top-0 z-10 border-b border-[#e2e8f0]">
      <div className="flex items-center gap-2 text-[#294396] font-bold text-lg tracking-tight">
        <div className="w-6 h-6 bg-[#294396] rounded-[4px] flex overflow-hidden shrink-0">
          <div className="w-1/3 h-full"></div>
          <div className="w-1/3 h-full bg-[#38a169] flex flex-col justify-evenly items-center py-[2px]">
             <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
             <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
             <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
          </div>
          <div className="w-1/3 h-full"></div>
        </div>
        PRETEC
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-full border border-[#cbd5e1] overflow-hidden bg-[#f0f2f5] flex items-center justify-center hover:bg-slate-200 transition-colors">
           <UserIcon className="w-5 h-5 text-[#94a3b8]" />
        </button>
      </div>
    </header>
  );
}

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  
  const navItems = [
    { name: 'INICIO', path: '/', icon: Home },
    ...(currentUser?.role === 'ADMIN' ? [
      { name: 'HIST', path: '/history', icon: ClipboardList },
      { name: 'INCID', path: '/incidents', icon: AlertTriangle },
      { name: 'EQUIPO', path: '/users', icon: Users },
    ] : []),
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-white border-t border-[#e2e8f0] flex justify-around items-center px-2 py-2 pb-safe z-10">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center w-full py-2 rounded-xl transition-all",
              isActive ? "text-[#2563eb]" : "text-[#94a3b8] hover:text-[#1a1a1b]"
            )}
          >
            <item.icon className={cn("w-6 h-6 mb-1", isActive ? "stroke-[2.5]" : "stroke-2")} />
            <span className="text-[10px] font-bold tracking-wide">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
