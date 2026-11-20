import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  MessageSquare,
  Phone,
  Stethoscope,
  X,
} from 'lucide-react';
import { AnimalDetection, Language, Veterinarian } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { DetectionAnimalIllustration } from './AnimalIcons';

interface AnimalsDetectionsViewProps {
  detections: AnimalDetection[];
  veterinarians: Veterinarian[];
  language: Language;
  onToggleDetectionStatus: (detectionId: string) => void;
  onOpenShareVetForAnimal: (animalId: string) => void;
}

export const AnimalsDetectionsView: React.FC<AnimalsDetectionsViewProps> = ({
  detections,
  veterinarians,
  language,
  onToggleDetectionStatus,
  onOpenShareVetForAnimal,
}) => {
  const t = TRANSLATIONS[language];
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [contactDetection, setContactDetection] =
    useState<AnimalDetection | null>(null);

  const pendingCount = detections.filter(
    (d) => d.status === 'Pending Review'
  ).length;

  const filteredDetections = detections.filter((det) => {
    const matchesSpecies =
      speciesFilter === 'all' || det.species === speciesFilter;
    const matchesStatus = statusFilter === 'all' || det.status === statusFilter;
    return matchesSpecies && matchesStatus;
  });

  const iconBgClass = (species: AnimalDetection['species']) => {
    if (species === 'Dog') return 'bg-[#FEF3E2]';
    if (species === 'Monkey') return 'bg-[#FEF9E0]';
    return 'bg-[#FDECEF]';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 space-y-5">
      {/* Burnt Orange Header Banner (exact match to Image 5) */}
      <section className="bg-gradient-to-r from-[#B83B1D] via-[#C64820] to-[#D45B26] text-white rounded-2xl px-6 sm:px-8 py-6 shadow-md">
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight">
          {t.animalDetections}
        </h1>
        <p className="text-sm text-orange-100 mt-1 tabular-nums">
          {detections.length} total • {pendingCount} Pending Review
        </p>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border border-gray-200/90 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block ml-1" />
        <select
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          aria-label="Filter by detected animal"
          className="flex-1 px-3.5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C64820]/30 cursor-pointer"
        >
          <option value="all">All Animals</option>
          <option value="Dog">Dog</option>
          <option value="Monkey">Monkey</option>
          <option value="Snake">Snake</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by review status"
          className="flex-1 px-3.5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C64820]/30 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Pending Review">Pending Review</option>
        </select>
      </section>

      {/* Detection Cards List */}
      <section className="space-y-3.5">
        {filteredDetections.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <p className="text-base font-semibold text-gray-800">
              No detections match this filter
            </p>
            <button
              type="button"
              onClick={() => {
                setSpeciesFilter('all');
                setStatusFilter('all');
              }}
              className="mt-3 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium cursor-pointer"
            >
              Show All Detections
            </button>
          </div>
        ) : (
          filteredDetections.map((det) => (
            <div
              key={det.id}
              className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 ${iconBgClass(
                    det.species
                  )}`}
                >
                  <DetectionAnimalIllustration species={det.species} />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      {det.title}
                    </h2>
                    <button
                      type="button"
                      onClick={() => onToggleDetectionStatus(det.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border cursor-pointer transition-colors ${
                        det.status === 'Reviewed'
                          ? 'bg-[#ECFDF3] text-[#15803D] border-[#BBF7D0] hover:bg-[#DCFCE7]'
                          : 'bg-[#FEF9E7] text-[#A16207] border-[#FDE68A] hover:bg-[#FEF3C7]'
                      }`}
                      title="Click to toggle review status"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{det.status}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{det.dateTime}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{det.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (det.relatedCowId) {
                      onOpenShareVetForAnimal(det.relatedCowId);
                    } else {
                      setContactDetection(det);
                    }
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#54A857] hover:bg-[#469649] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <span>{t.contactVet}</span>
                  <Stethoscope className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Quick Vet Contact Modal for general intrusion events */}
      {contactDetection && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Contact Veterinarian"
        >
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Contact Veterinarian
                </h3>
                <p className="text-xs text-gray-500">
                  {contactDetection.title} • {contactDetection.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setContactDetection(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {veterinarians.length === 0 ? (
                <p className="text-sm text-gray-600 text-center py-4">
                  No veterinarian added yet. Open any animal page and tap
                  &ldquo;Share with Veterinarian&rdquo; to add one.
                </p>
              ) : (
                veterinarians.map((vet) => (
                  <div
                    key={vet.id}
                    className="p-3.5 rounded-xl border border-gray-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {vet.name}
                      </p>
                      <p className="text-xs text-gray-500">{vet.clinic}</p>
                      <p className="text-xs font-mono-num text-gray-600 mt-0.5">
                        {vet.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${vet.phone.replace(/\s+/g, '')}`}
                        className="p-2.5 rounded-lg bg-[#54A857] hover:bg-[#469649] text-white"
                        aria-label={`Call ${vet.name}`}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setContactDetection(null)}
                        className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                        aria-label={`Message ${vet.name}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
