import React, { useState } from 'react';
import { Briefcase, Clock, Phone, Plus, X } from 'lucide-react';
import { Animal, Language, Worker } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CowOutlineIcon } from './AnimalIcons';

interface WorkersViewProps {
  workers: Worker[];
  animals: Animal[];
  language: Language;
  onAddWorker: (worker: Worker) => void;
  onSelectAnimal: (animalId: string) => void;
}

export const WorkersView: React.FC<WorkersViewProps> = ({
  workers,
  animals,
  language,
  onAddWorker,
  onSelectAnimal,
}) => {
  const t = TRANSLATIONS[language];
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState<Worker['role']>('Feeder');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState('06:30 AM');

  const roleBadgeClass = (workerRole: Worker['role']) => {
    switch (workerRole) {
      case 'Cleaner':
        return 'bg-[#ECFDF3] text-[#15803D] border-[#BBF7D0]';
      case 'Milker':
        return 'bg-[#FEF3E2] text-[#B45309] border-[#F5CBA7]';
      case 'Feeder':
        return 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]';
      case 'Supervisor':
        return 'bg-[#F5EEFF] text-[#6D28D9] border-[#DDD6FE]';
    }
  };

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newWorker: Worker = {
      id: `worker-${Date.now()}`,
      name: name.trim(),
      role,
      phone: phone.trim(),
      avatarUrl: '/src/assets/images/worker_ramesh_kumar_1795152479142.jpg',
      hoursToday: 4.0,
      hoursThisWeek: 24.0,
      checkIn: checkIn.trim() || '06:30 AM',
    };

    onAddWorker(newWorker);
    setName('');
    setPhone('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 space-y-5">
      {/* Header Row: Purple Gradient Banner + Black Add New Worker Button (exact match to Image 6) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 bg-gradient-to-r from-[#5850EC] via-[#6D47EC] to-[#8C3AE8] text-white rounded-2xl px-6 sm:px-8 py-6 shadow-md">
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight">
            {t.workersManagement}
          </h1>
          <p className="text-sm text-purple-100 mt-1 tabular-nums">
            {workers.length} active workers
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-black hover:bg-gray-900 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addNewWorker}</span>
        </button>
      </div>

      {/* 2-Column Workers Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {workers.map((worker) => {
          const assignedAnimals = animals.filter(
            (a) => a.assignedWorkerId === worker.id
          );

          return (
            <div
              key={worker.id}
              className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={worker.avatarUrl}
                  alt={worker.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#E0E7FF] shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {worker.name}
                    </h2>
                    <span
                      className={`mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${roleBadgeClass(
                        worker.role
                      )}`}
                    >
                      <Briefcase className="w-3 h-3" />
                      {worker.role}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 font-mono-num">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{worker.phone}</span>
                  </p>
                </div>
              </div>

              {/* Inner Shaded Shift Box */}
              <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Today</p>
                    <p className="text-sm sm:text-base font-bold text-gray-900 mt-0.5 flex items-center gap-1.5 tabular-nums">
                      <Clock className="w-4 h-4 text-[#4F46E5]" />
                      {worker.hoursToday.toFixed(1)}h
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">This Week</p>
                    <p className="text-sm sm:text-base font-bold text-gray-900 mt-0.5 flex items-center gap-1.5 tabular-nums">
                      <Clock className="w-4 h-4 text-[#9333EA]" />
                      {worker.hoursThisWeek.toFixed(1)}h
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-gray-200/70 text-xs text-gray-500 tabular-nums">
                  Check-in: {worker.checkIn}
                  {worker.checkOut ? ` • Check-out: ${worker.checkOut}` : ''}
                </div>
              </div>

              {/* Assigned Cows Footer */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-1.5">
                  <CowOutlineIcon className="w-4 h-4 text-[#B8862D]" />
                  <strong className="tabular-nums">
                    {assignedAnimals.length}
                  </strong>{' '}
                  {assignedAnimals.length === 1
                    ? 'cow assigned'
                    : 'cows assigned'}
                </p>

                {assignedAnimals.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {assignedAnimals.map((cow) => (
                      <button
                        key={cow.id}
                        type="button"
                        onClick={() => onSelectAnimal(cow.id)}
                        className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 border border-gray-200 text-xs font-semibold text-gray-800 transition-colors cursor-pointer"
                      >
                        {cow.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Add New Worker Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Add New Worker"
        >
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Add New Worker
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorker} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mahesh Goud"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6D47EC]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Worker['role'])}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl"
                  >
                    <option value="Cleaner">Cleaner</option>
                    <option value="Milker">Milker</option>
                    <option value="Feeder">Feeder</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Check-in Time
                  </label>
                  <input
                    type="text"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    placeholder="06:30 AM"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43219"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl"
                />
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
                  Add Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
