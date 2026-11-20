import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  FileText,
  History,
  Save,
  Share2,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  User,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Animal, Language, SharedVetReport, Worker } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CowAvatarIllustration } from './AnimalIcons';
import { StructuredCaseModal } from './StructuredCaseModal';

interface CowDetailViewProps {
  animal: Animal;
  workers: Worker[];
  language: Language;
  onBack: () => void;
  onAssignWorker: (animalId: string, workerId: string | null) => void;
  onUpdateNotes: (animalId: string, notes: string) => void;
  onOpenShareVet: (animalId: string) => void;
}

export const CowDetailView: React.FC<CowDetailViewProps> = ({
  animal,
  workers,
  language,
  onBack,
  onAssignWorker,
  onUpdateNotes,
  onOpenShareVet,
}) => {
  const t = TRANSLATIONS[language];
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [draftNotes, setDraftNotes] = useState(animal.farmerNotes);
  const [inspectingReport, setInspectingReport] =
    useState<SharedVetReport | null>(null);

  const isLow = animal.status === 'Low Rumination';

  const maxRuminationTick = Math.max(
    3.8,
    Math.ceil(animal.ruminationHours * 10) / 10
  );
  const ruminationTicks = [
    0,
    Number((maxRuminationTick * 0.25).toFixed(2)),
    Number((maxRuminationTick * 0.5).toFixed(2)),
    Number((maxRuminationTick * 0.75).toFixed(2)),
    Number(maxRuminationTick.toFixed(2)),
  ];

  const activityData = [
    { name: 'Standing', hours: animal.standingHours, color: '#4F80E8' },
    { name: 'Lying', hours: animal.lyingHours, color: '#8B5CF6' },
    { name: 'Walking', hours: animal.walkingHours, color: '#56B47B' },
  ];

  const handleSaveNotes = () => {
    onUpdateNotes(animal.id, draftNotes.trim());
    setIsEditingNotes(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 space-y-5">
      {/* Subtle Back Navigation */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {t.navCows}</span>
        </button>
      </div>

      {/* Top Dark Animal Header Banner (matches Image 4 + clearly visible Share with Veterinarian CTA) */}
      <section className="bg-gradient-to-r from-[#0B1120] via-[#131D31] to-[#1D283A] text-white rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Avatar + Name + Breed/Age + Tag */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#343E4F] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
              <CowAvatarIllustration className="w-16 h-16" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {animal.name}
              </h1>
              <p className="text-sm text-slate-300">
                {animal.breed} • {animal.age}
                {animal.animalType === 'Buffalo' ? ' • Buffalo' : ''}
              </p>
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-white/10 border border-white/20 text-xs font-semibold font-mono-num text-slate-100">
                  Tag {animal.tagId}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">
                  Tag Color: {animal.tagColor}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Status Badge + Primary Action Button "Share with Veterinarian" */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3">
            {isLow ? (
              <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-[#9A5314] text-[#FEF3C7] border border-[#D97706]/50 text-xs font-bold self-start sm:self-auto md:self-end">
                <AlertTriangle className="w-3.5 h-3.5" />
                Low Rumination
              </span>
            ) : (
              <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-[#14532D] text-[#DCFCE7] border border-[#22C55E]/40 text-xs font-bold self-start sm:self-auto md:self-end">
                <Check className="w-3.5 h-3.5" />
                Rumination OK
              </span>
            )}

            <button
              type="button"
              onClick={() => onOpenShareVet(animal.id)}
              className="min-h-[48px] inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-b from-[#CFA044] to-[#B6882E] hover:from-[#D8AA4E] hover:to-[#A67A25] text-white text-sm sm:text-[15px] font-bold shadow-md transition-all active:scale-[0.99] cursor-pointer whitespace-nowrap"
            >
              <Stethoscope className="w-5 h-5 shrink-0" />
              <span>{t.shareWithVet}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 1: Rumination Summary - Today (exact replica of Image 4) */}
      <section className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#B8862D]" />
          <h2 className="text-lg font-bold text-gray-900">
            Rumination Summary - Today
          </h2>
        </div>

        {/* 3 Pastel Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#EEF3FF] rounded-xl px-5 py-4">
            <p className="text-xs font-semibold text-[#2E54B6]">
              Total Rumination
            </p>
            <p className="text-3xl font-bold text-[#1B3A8A] mt-1.5 tabular-nums">
              {animal.ruminationHours.toFixed(1)}h
            </p>
          </div>

          <div className="bg-[#F5EEFF] rounded-xl px-5 py-4">
            <p className="text-xs font-semibold text-[#6D28D9]">
              Rumination Cycles
            </p>
            <p className="text-3xl font-bold text-[#4C1D95] mt-1.5 tabular-nums">
              {animal.ruminationCycles}
            </p>
          </div>

          <div className="bg-[#FEF9E7] rounded-xl px-5 py-4">
            <p className="text-xs font-semibold text-[#9A6F1C]">vs Yesterday</p>
            <p
              className={`text-2xl sm:text-3xl font-bold mt-1.5 flex items-center gap-1.5 tabular-nums ${
                animal.ruminationVsYesterday < 0
                  ? 'text-[#C53030]'
                  : 'text-[#15803D]'
              }`}
            >
              {animal.ruminationVsYesterday < 0 ? (
                <TrendingDown className="w-6 h-6 shrink-0" />
              ) : (
                <TrendingUp className="w-6 h-6 shrink-0" />
              )}
              <span>
                {animal.ruminationVsYesterday > 0 ? '+' : ''}
                {animal.ruminationVsYesterday.toFixed(1)}h
              </span>
            </p>
          </div>
        </div>

        {/* Smooth Line Chart: Rumination Over Last 24 Hours */}
        <div className="space-y-2 pt-1">
          <p className="text-xs sm:text-sm font-semibold text-gray-700">
            Rumination Over Last 24 Hours
          </p>
          <div className="h-60 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={animal.ruminationSeries}
                margin={{ top: 10, right: 16, left: -14, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  vertical={true}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#9CA3AF' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                />
                <YAxis
                  domain={[0, maxRuminationTick]}
                  ticks={ruminationTicks}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#9CA3AF' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [
                    `${Number(value ?? 0).toFixed(2)}h`,
                    'Rumination',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#B87A2B"
                  strokeWidth={2.5}
                  dot={{
                    r: 3.5,
                    fill: '#FFFFFF',
                    stroke: '#B87A2B',
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 5.5,
                    fill: '#B87A2B',
                    stroke: '#FFFFFF',
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Section 2: Activity Summary - Today (exact replica of Image 4) */}
      <section className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#16A34A]" />
          <h2 className="text-lg font-bold text-gray-900">
            Activity Summary - Today
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Left stacked metric cards */}
          <div className="space-y-3.5">
            <div className="bg-[#EEF3FF] rounded-xl px-5 py-4">
              <p className="text-xs font-semibold text-[#2E54B6]">
                Standing Time
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1B3A8A] mt-1 tabular-nums">
                {animal.standingHours.toFixed(1)}h
              </p>
              <p className="text-xs font-medium text-[#16A34A] mt-1 flex items-center gap-1 tabular-nums">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>
                  {animal.standingVsYesterday >= 0 ? '+' : ''}
                  {animal.standingVsYesterday.toFixed(1)}h vs yesterday
                </span>
              </p>
            </div>

            <div className="bg-[#F5EEFF] rounded-xl px-5 py-4">
              <p className="text-xs font-semibold text-[#6D28D9]">Lying Time</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#4C1D95] mt-1 tabular-nums">
                {animal.lyingHours.toFixed(1)}h
              </p>
            </div>
          </div>

          {/* Right Bar Chart */}
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityData}
                margin={{ top: 10, right: 12, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#9CA3AF' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8]}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#9CA3AF' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [
                    `${Number(value ?? 0).toFixed(1)}h`,
                    'Duration',
                  ]}
                />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]} maxBarSize={96}>
                  {activityData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Section 3: Assigned Worker (exact replica of Image 4) */}
      <section className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-[#4F46E5]" />
          <h2 className="text-lg font-bold text-gray-900">Assigned Worker</h2>
        </div>

        <select
          value={animal.assignedWorkerId ?? ''}
          onChange={(e) =>
            onAssignWorker(animal.id, e.target.value ? e.target.value : null)
          }
          aria-label="Select assigned worker"
          className="w-full px-4 py-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4963B]/40 focus:border-[#C4963B] cursor-pointer"
        >
          <option value="">Select a worker</option>
          {workers.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name} ({w.role})
            </option>
          ))}
        </select>
      </section>

      {/* Section 4: Farmer Notes (exact replica of Image 4) */}
      <section className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-gray-900">Farmer Notes</h2>
          {!isEditingNotes ? (
            <button
              type="button"
              onClick={() => {
                setDraftNotes(animal.farmerNotes);
                setIsEditingNotes(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingNotes(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#54A857] hover:bg-[#469649] text-white text-xs font-semibold cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>

        {isEditingNotes ? (
          <textarea
            rows={3}
            value={draftNotes}
            onChange={(e) => setDraftNotes(e.target.value)}
            className="w-full p-3 text-sm text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4963B]/40"
            placeholder="Write observations or notes for this animal..."
          />
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed">
            {animal.farmerNotes || 'No farmer notes added yet.'}
          </p>
        )}
      </section>

      {/* Section 5: Health History & Shared Reports (seamlessly integrated in HerdEye style) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activity / Health Timeline */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#B8862D]" />
              <h2 className="text-lg font-bold text-gray-900">
                Health History & Timeline
              </h2>
            </div>
            <span className="text-xs font-medium text-gray-500">
              {animal.name} only
            </span>
          </div>

          <div className="space-y-3">
            {animal.timeline.map((event) => {
              const iconBox =
                event.type === 'vet_share'
                  ? 'bg-[#ECFDF3] text-[#15803D]'
                  : event.type === 'alert'
                  ? 'bg-[#FEF2F2] text-[#DC2626]'
                  : 'bg-[#EFF4FF] text-[#2563EB]';

              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAFBFC] border border-gray-100"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${iconBox}`}
                  >
                    {event.type === 'vet_share' ? (
                      <Stethoscope className="w-4 h-4" />
                    ) : event.type === 'alert' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      {event.detail}
                    </p>
                    <p className="text-[11px] font-medium text-gray-400 mt-1.5 tabular-nums">
                      {event.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shared Reports Section inside Health History */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#16A34A]" />
              <h2 className="text-lg font-bold text-gray-900">
                Shared Reports
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onOpenShareVet(animal.id)}
              className="text-xs font-semibold text-[#9A6F1C] hover:text-[#785513] cursor-pointer"
            >
              + Share New Report
            </button>
          </div>

          {animal.sharedReports.length === 0 ? (
            <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center bg-[#FAFBFC]">
              <div className="w-10 h-10 rounded-xl bg-[#FAF3E6] text-[#B8862D] flex items-center justify-center mx-auto mb-2.5">
                <Stethoscope className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-800">
                No reports shared for {animal.name} yet
              </p>
              <p className="text-xs text-gray-500 mt-1">
                When you share health details with a veterinarian, the sent
                report record will appear here.
              </p>
              <button
                type="button"
                onClick={() => onOpenShareVet(animal.id)}
                className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black hover:bg-gray-900 text-white text-xs font-semibold cursor-pointer"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Share with Veterinarian</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {animal.sharedReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl bg-[#FAFBFC] border border-gray-200/80 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {rep.vetName}
                      </p>
                      <p className="text-xs text-gray-500">{rep.vetClinic}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                        rep.status === 'Evaluated'
                          ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
                          : 'bg-[#ECFDF3] text-[#15803D] border-[#BBF7D0]'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {rep.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200/70">
                    <span className="text-xs text-gray-500 tabular-nums">
                      {rep.date} • {rep.time}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInspectingReport(rep)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#9A6F1C] hover:text-black cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Sent Case</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Inspect Sent Structured Veterinarian Case Modal */}
      {inspectingReport && (
        <StructuredCaseModal
          report={inspectingReport}
          onClose={() => setInspectingReport(null)}
        />
      )}
    </div>
  );
};
