import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Clock,
  Filter,
  Plus,
  Search,
  TrendingUp,
  X,
} from 'lucide-react';
import { Animal, AnimalType, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface CowsViewProps {
  animals: Animal[];
  language: Language;
  onSelectAnimal: (animalId: string) => void;
  onAddAnimal: (animal: Animal) => void;
}

export const CowsView: React.FC<CowsViewProps> = ({
  animals,
  language,
  onSelectAnimal,
  onAddAnimal,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'Low Rumination' | 'Rumination OK'
  >('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add animal form state
  const [newName, setNewName] = useState('');
  const [newTagId, setNewTagId] = useState('');
  const [newAnimalType, setNewAnimalType] = useState<AnimalType>('Cow');
  const [newBreed, setNewBreed] = useState('HF');
  const [newAge, setNewAge] = useState('4 years old');
  const [newTagColor, setNewTagColor] = useState('Red');

  const needAttentionCount = animals.filter(
    (a) => a.status === 'Low Rumination'
  ).length;

  const filteredAnimals = animals.filter((animal) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      animal.name.toLowerCase().includes(q) ||
      animal.tagId.toLowerCase().includes(q) ||
      animal.breed.toLowerCase().includes(q);
    const matchesFilter =
      statusFilter === 'all' || animal.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTagId.trim()) return;

    const formattedTag = newTagId.trim().startsWith('#')
      ? newTagId.trim()
      : `#${newTagId.trim()}`;

    const created: Animal = {
      id: `animal-${Date.now()}`,
      name: newName.trim(),
      tagId: formattedTag,
      animalType: newAnimalType,
      breed: newBreed.trim() || 'HF',
      age: newAge.trim() || '4 years old',
      tagColor: newTagColor,
      photoUrl: '/src/assets/images/cow_ganga_jersey_1795152475301.jpg',
      status: 'Rumination OK',
      ruminationHours: 6.7,
      ruminationCycles: 14,
      ruminationVsYesterday: 0.2,
      ruminationStatusText: 'Within normal range (6.7h)',
      standingHours: 5.3,
      standingVsYesterday: 0.0,
      lyingHours: 8.5,
      walkingHours: 3.2,
      activityStatusText: 'Normal movement & resting balance',
      feedingBehaviour: 'Normal',
      detectedIssue: 'No abnormal behaviour detected',
      abnormalDuration: 'None',
      latestAlertTimestamp: 'No recent alerts',
      aiObservation:
        'AI observation: Newly enrolled animal baseline is healthy and within normal rumination thresholds.',
      historicalTrendSummary: 'Initial baseline monitoring started today.',
      evidenceVideo: null,
      assignedWorkerId: null,
      farmerNotes: 'Newly added to HerdEye farm monitoring.',
      ruminationSeries: [
        { time: '00:00', hours: 0.9 },
        { time: '04:00', hours: 1.9 },
        { time: '08:00', hours: 3.1 },
        { time: '12:00', hours: 4.1 },
        { time: '16:00', hours: 5.1 },
        { time: '20:00', hours: 6.0 },
        { time: '23:59', hours: 6.7 },
      ],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          type: 'checkup',
          title: `${newAnimalType} enrolled in HerdEye monitoring`,
          detail: `Tag ${formattedTag} (${newTagColor}) activated with normal baseline.`,
          timestamp: 'Just now',
        },
      ],
      sharedReports: [],
    };

    onAddAnimal(created);
    setNewName('');
    setNewTagId('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 space-y-5">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight">
            {t.navCows}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5 tabular-nums">
            {animals.length} total • {needAttentionCount} Need attention
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black hover:bg-gray-900 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addNewCow}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or tag ID.."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4963B]/40 focus:border-[#C4963B]"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as 'all' | 'Low Rumination' | 'Rumination OK'
              )
            }
            aria-label="Filter cows by rumination status"
            className="w-full sm:w-44 px-3.5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4963B]/40 focus:border-[#C4963B] cursor-pointer"
          >
            <option value="all">All Cows</option>
            <option value="Low Rumination">Low Rumination</option>
            <option value="Rumination OK">Rumination OK</option>
          </select>
        </div>
      </div>

      {/* Cow Grid */}
      {filteredAnimals.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-base font-semibold text-gray-800">
            No animals match your search
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Try clearing the search query or switching the status filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAnimals.map((animal) => {
            const isLow = animal.status === 'Low Rumination';
            return (
              <button
                key={animal.id}
                type="button"
                onClick={() => onSelectAnimal(animal.id)}
                className={`group text-left bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer border-2 ${
                  isLow
                    ? 'border-[#D4A438]'
                    : 'border-transparent ring-1 ring-gray-200/90 hover:ring-gray-300'
                }`}
              >
                {/* Photo Container */}
                <div className="relative h-48 sm:h-52 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={animal.photoUrl}
                    alt={`${animal.name} (${animal.breed})`}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />

                  {/* Status Badge Overlay Top-Right */}
                  <div className="absolute top-3 right-3">
                    {isLow ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FDF3E3]/95 text-[#A16207] border border-[#E9C98E] text-xs font-semibold shadow-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#C27803]" />
                        Low Rumination
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ECFDF3]/95 text-[#15803D] border border-[#BBF7D0] text-xs font-semibold shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                        Rumination OK
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        {animal.name}
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {animal.breed}
                        {animal.animalType === 'Buffalo' ? ' • Buffalo' : ''}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[11px] font-semibold text-gray-700 font-mono-num">
                      {animal.tagId}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-gray-100 text-xs sm:text-[13px]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        Rumination
                      </span>
                      <span className="font-bold text-gray-900 tabular-nums">
                        {animal.ruminationHours.toFixed(1)}h
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                        Standing
                      </span>
                      <span className="font-bold text-gray-900 tabular-nums">
                        {animal.standingHours.toFixed(1)}h
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Add New Cow / Buffalo Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Add New Animal"
        >
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add New Animal</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnimal} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Animal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Cow #08"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4963B]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tag ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTagId}
                    onChange={(e) => setNewTagId(e.target.value)}
                    placeholder="e.g. #HF008"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4963B]/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Animal Type
                  </label>
                  <select
                    value={newAnimalType}
                    onChange={(e) =>
                      setNewAnimalType(e.target.value as AnimalType)
                    }
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="Cow">Cow</option>
                    <option value="Buffalo">Buffalo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tag Color
                  </label>
                  <select
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="Red">Red</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Green">Green</option>
                    <option value="Blue">Blue</option>
                    <option value="Orange">Orange</option>
                    <option value="White">White</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={newBreed}
                    onChange={(e) => setNewBreed(e.target.value)}
                    placeholder="HF / Jersey / Murrah"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    placeholder="4 years old"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-black hover:bg-gray-900 text-white text-sm font-semibold cursor-pointer"
                >
                  Save Animal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
