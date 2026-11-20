import React from 'react';
import {
  AlertTriangle,
  Home,
  Settings,
  Users,
} from 'lucide-react';
import { Language, NavTab } from '../types';
import { HERDEYE_LOGO_URL } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';
import { CowOutlineIcon } from './AnimalIcons';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  language,
  onSelectLanguage,
}) => {
  const t = TRANSLATIONS[language];

  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'dashboard',
      label: t.navDashboard,
      icon: <Home className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'cows',
      label: t.navCows,
      icon: <CowOutlineIcon className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'animals',
      label: t.navAnimals,
      icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'workers',
      label: t.navWorkers,
      icon: <Users className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'settings',
      label: t.navSettings,
      icon: <Settings className="w-4 h-4 shrink-0" />,
    },
  ];

  const languages: { id: Language; code: string; region: string }[] = [
    { id: 'en', region: 'GB', code: 'EN' },
    { id: 'hi', region: 'IN', code: 'HI' },
    { id: 'te', region: 'IN', code: 'TE' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black text-white border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: HerdEye Logo */}
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4963B] rounded-md"
          aria-label="HerdEye Home"
        >
          <div className="w-11 h-10 sm:w-12 sm:h-11 bg-white rounded-md p-0.5 flex items-center justify-center overflow-hidden shadow-sm">
            <img
              src={HERDEYE_LOGO_URL}
              alt="HerdEye — Where every animal has its own health story"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </button>

        {/* Center: Navigation Links (Desktop / Tablet) */}
        <nav
          className="hidden md:flex items-center gap-1.5 lg:gap-2"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-b from-[#CFA044] to-[#B6882E] text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Language Switcher */}
        <div className="flex items-center bg-[#1A1F29] border border-white/10 rounded-lg p-1 gap-0.5 shrink-0">
          {languages.map((lang) => {
            const isActive = language === lang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => onSelectLanguage(lang.id)}
                className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#C4963B] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="text-[10px] opacity-80 mr-0.5">
                  {lang.region}
                </span>
                {lang.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <nav
        className="md:hidden flex items-center justify-between px-2 py-1.5 bg-[#0D1017] border-t border-white/10 overflow-x-auto gap-1"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-lg text-[11px] font-medium whitespace-nowrap min-w-[60px] transition-colors ${
                isActive
                  ? 'bg-[#C4963B] text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
