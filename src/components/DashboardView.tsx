import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  Settings,
  Stethoscope,
  TrendingUp,
  Users,
  Volume2,
  X,
} from 'lucide-react';
import {
  Animal,
  AnimalDetection,
  CriticalAlert,
  FarmProfile,
  Language,
  NavTab,
} from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CowOutlineIcon, DetectionAnimalIllustration } from './AnimalIcons';

interface DashboardViewProps {
  animals: Animal[];
  criticalAlerts: CriticalAlert[];
  detections: AnimalDetection[];
  farmProfile: FarmProfile;
  language: Language;
  onDismissAlert: (alertId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectAnimal: (animalId: string) => void;
  onOpenShareVetForAnimal: (animalId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  animals,
  criticalAlerts,
  detections,
  farmProfile,
  language,
  onDismissAlert,
  onNavigateTab,
  onSelectAnimal,
  onOpenShareVetForAnimal,
}) => {
  const t = TRANSLATIONS[language];
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const totalCows = animals.length;
  const healthyCows = animals.filter((a) => a.status === 'Rumination OK').length;
  const lowRuminationCows = animals.filter(
    (a) => a.status === 'Low Rumination'
  ).length;

  const avgRumination =
    totalCows > 0
      ? (
          animals.reduce((sum, a) => sum + a.ruminationHours, 0) / totalCows
        ).toFixed(1)
      : '0.0';
  const avgStanding =
    totalCows > 0
      ? (
          animals.reduce((sum, a) => sum + a.standingHours, 0) / totalCows
        ).toFixed(1)
      : '0.0';

  const activeAlerts = criticalAlerts.filter((a) => !a.dismissed);

  const handleSpeakAlert = (alert: CriticalAlert) => {
    setSpeakingId(alert.id);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Critical alert for ${alert.animalName}. ${alert.message}. Please inspect the animal and consider sharing the health report with your veterinarian.`
      );
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setSpeakingId(null), 1500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 space-y-5">
      {/* Welcome Dark Banner */}
      <section className="bg-gradient-to-r from-[#0B1120] via-[#131D31] to-[#1D283A] text-white rounded-2xl px-6 sm:px-8 py-6 shadow-md">
        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight">
          {t.welcome}, {farmProfile.farmerName}
        </h1>
        <p className="text-sm text-slate-300 mt-1">{farmProfile.farmName}</p>
      </section>

      {/* Critical Alert Banners */}
      {activeAlerts.length > 0 && (
        <section className="space-y-3" aria-label="Critical health alerts">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-[#FEF5F5] border border-red-300 border-t-4 border-t-red-600 rounded-xl p-4 sm:px-5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    <span className="inline-flex items-center gap-1 bg-[#DC2626] text-white text-[11px] font-bold tracking-wide px-2.5 py-0.5 rounded-md">
                      CRITICAL
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectAnimal(alert.animalId)}
                      className="text-xs font-semibold text-red-800 hover:underline cursor-pointer"
                    >
                      {alert.animalName} →
                    </button>
                  </div>

                  <p className="text-sm sm:text-[15px] font-semibold text-gray-900">
                    {alert.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleSpeakAlert(alert)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                        speakingId === alert.id
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-red-700 border-red-300 hover:bg-red-50'
                      }`}
                    >
                      <Volume2 className="w-4 h-4 shrink-0" />
                      <span>
                        {speakingId === alert.id ? 'Speaking...' : t.speakAlert}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenShareVetForAnimal(alert.animalId)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#54A857] hover:bg-[#469649] text-white shadow-xs transition-colors cursor-pointer"
                    >
                      <span>{t.contactVet}</span>
                      <Stethoscope className="w-4 h-4 shrink-0" />
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-500">
                    For automated phone calls, Twilio integration required
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onDismissAlert(alert.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-red-100/60 transition-colors cursor-pointer"
                  aria-label="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 3 KPI Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Cows */}
        <button
          type="button"
          onClick={() => onNavigateTab('cows')}
          className="text-left bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-colors cursor-pointer flex items-start justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-wider text-gray-500">
              {t.totalCows}
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2 tabular-nums">
              {totalCows}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF3E6] text-[#B8862D] flex items-center justify-center shrink-0">
            <CowOutlineIcon className="w-5 h-5" />
          </div>
        </button>

        {/* Ruminating Well */}
        <button
          type="button"
          onClick={() => onNavigateTab('cows')}
          className="text-left bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-colors cursor-pointer flex items-start justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-wider text-gray-500">
              {t.ruminatingWell}
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2 tabular-nums">
              {healthyCows}
            </p>
            <p className="text-xs text-gray-500 mt-1">{t.healthyCows}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </button>

        {/* Low Rumination */}
        <button
          type="button"
          onClick={() => onNavigateTab('cows')}
          className="text-left bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:border-amber-300 transition-colors cursor-pointer flex items-start justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-wider text-gray-500">
              {t.lowRumination}
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2 tabular-nums">
              {lowRuminationCows}
            </p>
            <p className="text-xs text-gray-500 mt-1">{t.needAttention}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FEF2EC] text-[#C2410C] flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        </button>
      </section>

      {/* Today's Average Metrics + Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Average Metrics */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            {t.todaysAvgMetrics}
          </h2>
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EFF4FF] text-[#3B82F6] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {t.ruminationTime}
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900 tabular-nums">
                {avgRumination}h
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F5EEFF] text-[#8B5CF6] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {t.standingTime}
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900 tabular-nums">
                {avgStanding}h
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#FFFDF2] border border-[#F0E3B1] rounded-2xl p-5 shadow-xs">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            {t.quickActions}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('cows')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-black hover:bg-gray-900 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <CowOutlineIcon className="w-4 h-4" />
              <span>{t.viewCows}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('animals')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-sm font-semibold transition-colors cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 text-gray-600" />
              <span>{t.navAnimals}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('workers')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-gray-600" />
              <span>{t.navWorkers}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-gray-600" />
              <span>{t.navSettings}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bottom 2-Column Grid: Recent Alerts + Animal Detections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Alerts */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">
              {t.recentAlerts}
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('cows')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black cursor-pointer"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onSelectAnimal('cow-lakshmi')}
              className="w-full text-left flex items-start gap-3 p-3 rounded-xl bg-[#FAFBFC] hover:bg-gray-50 border border-gray-100 transition-colors cursor-pointer relative overflow-hidden"
            >
              <span className="w-1 self-stretch rounded-full bg-amber-400 shrink-0" />
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  Regular check-up due this week
                </p>
                <p className="text-xs text-gray-500 mt-0.5 tabular-nums">
                  Nov 20, 10:41 PM
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectAnimal('cow-7')}
              className="w-full text-left flex items-start gap-3 p-3 rounded-xl bg-[#FAFBFC] hover:bg-red-50/40 border border-gray-100 transition-colors cursor-pointer relative overflow-hidden"
            >
              <span className="w-1 self-stretch rounded-full bg-red-500 shrink-0" />
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  Low rumination for last 2 hours
                </p>
                <p className="text-xs text-gray-500 mt-0.5 tabular-nums">
                  Nov 20, 10:41 PM • Cow 7
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectAnimal('cow-3')}
              className="w-full text-left flex items-start gap-3 p-3 rounded-xl bg-[#FAFBFC] hover:bg-red-50/40 border border-gray-100 transition-colors cursor-pointer relative overflow-hidden"
            >
              <span className="w-1 self-stretch rounded-full bg-red-500 shrink-0" />
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  Low rumination for last 2 hours
                </p>
                <p className="text-xs text-gray-500 mt-0.5 tabular-nums">
                  Nov 20, 10:41 PM • Cow 3
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Animal Detections */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">
              {t.animalDetections}
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('animals')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black cursor-pointer"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {detections.slice(0, 3).map((det) => (
              <button
                key={det.id}
                type="button"
                onClick={() => onNavigateTab('animals')}
                className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-[#FAFBFC] hover:bg-gray-50 border border-gray-100 transition-colors cursor-pointer"
              >
                <span className="w-1 self-stretch rounded-full bg-red-500 shrink-0" />
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <DetectionAnimalIllustration
                    species={det.species}
                    size="sm"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {det.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{det.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
