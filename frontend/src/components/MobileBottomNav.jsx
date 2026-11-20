import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Heart, CalendarCheck, User, PlusCircle } from 'lucide-react';
import { getCurrentUser } from '../services/api';

export default function MobileBottomNav() {
  const user = getCurrentUser();

  const items = [
    { name: 'Explore', path: '/', icon: Compass },
    { name: 'Saved', path: '/saved', icon: Heart },
    { name: '+ List PG', path: '/list-pg', icon: PlusCircle, isHighlight: true },
    { name: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { name: user ? 'Profile' : 'Login', path: user ? '/bookings' : '/login', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#071917]/95 backdrop-blur-md border-t border-emerald-950/80 px-2 py-2 flex items-center justify-around font-body">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${
                item.isHighlight
                  ? 'text-emerald-400 font-extrabold'
                  : isActive
                  ? 'text-emerald-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Icon size={18} className={item.isHighlight ? 'text-emerald-400 animate-pulse' : ''} />
            <span className="mt-0.5">{item.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
