import React, { useState } from 'react';
import {
  CheckCircle2,
  Globe,
  Phone,
  Save,
  Settings as SettingsIcon,
  Users,
} from 'lucide-react';
import { Animal, FarmProfile, Language, Worker } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CowOutlineIcon } from './AnimalIcons';

interface SettingsViewProps {
  farmProfile: FarmProfile;
  animals: Animal[];
  workers: Worker[];
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  onSaveFarmProfile: (profile: FarmProfile) => void;
  onSelectAnimal: (animalId: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  farmProfile,
  animals,
  workers,
  language,
  onSelectLanguage,
  onSaveFarmProfile,
  onSelectAnimal,
}) => {
  const t = TRANSLATIONS[language];
  const [activeSubTab, setActiveSubTab] = useState<
    'profile' | 'cows' | 'workers'
  >('profile');

  const [farmName, setFarmName] = useState(
    farmProfile.farmName === 'Your Farm' ? '' : farmProfile.farmName
  );
  const [location, setLocation] = useState(farmProfile.location);
  const [mobileNumber, setMobileNumber] = useState(farmProfile.mobileNumber);
  const [vetPhoneNumber, setVetPhoneNumber] = useState(
    farmProfile.vetPhoneNumber
  );
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveFarmProfile({
      ...farmProfile,
      farmName: farmName.trim() || 'Your Farm',
      location: location.trim() || 'Hanamkonda, Warangal, Telangana',
      mobileNumber: mobileNumber.trim() || '+91 98480 51234',
      vetPhoneNumber: vetPhoneNumber.trim(),
    });
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 3000);
  };

  const languageButtons: { id: Language; region: string; label: string }[] = [
    { id: 'en', region: 'GB', label: 'English' },
    { id: 'hi', region: 'IN', label: 'हिंदी' },
    { id: 'te', region: 'IN', label: 'తెలుగు' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 space-y-5">
      {/* Dark Settings Header Banner (exact match to Image 7) */}
      <section className="bg-gradient-to-r from-[#0F172A] via-[#0B1120] to-[#020617] text-white rounded-2xl px-6 sm:px-8 py-6 shadow-md flex items-center gap-3">
        <SettingsIcon className="w-7 h-7 text-slate-200 shrink-0" />
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight">
          {t.settings}
        </h1>
      </section>

      {/* Gold-Bordered Select Language Bar */}
      <section className="bg-white border border-[#E5C97B] rounded-2xl px-5 py-4 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mr-1">
          <Globe className="w-4 h-4 text-[#B8862D]" />
          <span>{t.selectLanguage}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {languageButtons.map((btn) => {
            const isActive = language === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => onSelectLanguage(btn.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-b from-[#CFA044] to-[#B6882E] text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-[11px] opacity-80 mr-1">
                  {btn.region}
                </span>
                {btn.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3-Tab Segmented Bar: Farm Profile | Cows | Workers */}
      <div className="bg-[#F1F3F6] p-1 rounded-xl grid grid-cols-3 gap-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'profile'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span>{t.farmProfile}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('cows')}
          className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'cows'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CowOutlineIcon className="w-4 h-4" />
          <span>{t.navCows}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('workers')}
          className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'workers'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.navWorkers}</span>
        </button>
      </div>

      {/* Sub-tab 1: Farm Profile Form (exact match to Image 7) */}
      {activeSubTab === 'profile' && (
        <section className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 mb-5">
            {t.farmProfile}
          </h2>

          <form onSubmit={handleSave} className="max-w-xl space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5">
                Farm Name
              </label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="Farm Name"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4963B]/40 focus:border-[#C4963B]"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5">
                Village / Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Village / Location"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4963B]/40 focus:border-[#C4963B]"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4963B]/40 focus:border-[#C4963B]"
              />
            </div>

            <div className="pt-3 border-t border-gray-100">
              <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-800 mb-1.5">
                <Phone className="w-4 h-4 text-[#16A34A]" />
                <span>Vet Phone Number</span>
              </label>
              <input
                type="tel"
                value={vetPhoneNumber}
                onChange={(e) => setVetPhoneNumber(e.target.value)}
                placeholder="Enter vet WhatsApp number"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#54A857]/40 focus:border-[#54A857]"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Used for WhatsApp Vet Connect. Include country code (e.g.
                +91...)
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#54A857] hover:bg-[#469649] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t.saveProfile}</span>
              </button>

              {savedNotice && (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#15803D]">
                  <CheckCircle2 className="w-4 h-4" />
                  Profile saved successfully
                </span>
              )}
            </div>
          </form>
        </section>
      )}

      {/* Sub-tab 2: Cows Directory in Settings */}
      {activeSubTab === 'cows' && (
        <section className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-gray-900">
            Registered Animals ({animals.length})
          </h2>
          <div className="divide-y divide-gray-100">
            {animals.map((animal) => (
              <div
                key={animal.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={animal.photoUrl}
                    alt={animal.name}
                    className="w-11 h-11 rounded-xl object-cover border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {animal.name}{' '}
                      <span className="text-xs font-mono-num text-gray-500">
                        {animal.tagId}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {animal.animalType} • {animal.breed} • Tag:{' '}
                      {animal.tagColor}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectAnimal(animal.id)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-800 cursor-pointer"
                >
                  Open Details
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sub-tab 3: Workers Directory in Settings */}
      {activeSubTab === 'workers' && (
        <section className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-gray-900">
            Active Farm Workers ({workers.length})
          </h2>
          <div className="divide-y divide-gray-100">
            {workers.map((w) => (
              <div
                key={w.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={w.avatarUrl}
                    alt={w.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{w.name}</p>
                    <p className="text-xs text-gray-500">
                      {w.role} • {w.phone}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-600 tabular-nums">
                  {w.hoursThisWeek.toFixed(1)}h / week
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
