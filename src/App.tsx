import { useState } from 'react';
import {
  Animal,
  AnimalDetection,
  CriticalAlert,
  FarmProfile,
  Language,
  NavTab,
  SharedVetReport,
  Veterinarian,
  Worker,
} from './types';
import {
  INITIAL_ANIMALS,
  INITIAL_CRITICAL_ALERTS,
  INITIAL_DETECTIONS,
  INITIAL_FARM_PROFILE,
  INITIAL_VETERINARIANS,
  INITIAL_WORKERS,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CowsView } from './components/CowsView';
import { CowDetailView } from './components/CowDetailView';
import { AnimalsDetectionsView } from './components/AnimalsDetectionsView';
import { WorkersView } from './components/WorkersView';
import { SettingsView } from './components/SettingsView';
import { ShareVetModal } from './components/ShareVetModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  const [animals, setAnimals] = useState<Animal[]>(INITIAL_ANIMALS);
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>(
    INITIAL_VETERINARIANS
  );
  const [detections, setDetections] =
    useState<AnimalDetection[]>(INITIAL_DETECTIONS);
  const [criticalAlerts, setCriticalAlerts] = useState<CriticalAlert[]>(
    INITIAL_CRITICAL_ALERTS
  );
  const [farmProfile, setFarmProfile] =
    useState<FarmProfile>(INITIAL_FARM_PROFILE);

  // Share with Veterinarian modal state (strictly scoped to one selected animal ID)
  const [sharingAnimalId, setSharingAnimalId] = useState<string | null>(null);

  const selectedAnimal =
    animals.find((a) => a.id === selectedAnimalId) ?? null;
  const sharingAnimal = animals.find((a) => a.id === sharingAnimalId) ?? null;

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setSelectedAnimalId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnimal = (animalId: string) => {
    setActiveTab('cows');
    setSelectedAnimalId(animalId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDismissAlert = (alertId: string) => {
    setCriticalAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a))
    );
  };

  const handleAddAnimal = (animal: Animal) => {
    setAnimals((prev) => [animal, ...prev]);
  };

  const handleAssignWorker = (animalId: string, workerId: string | null) => {
    setAnimals((prev) =>
      prev.map((a) =>
        a.id === animalId ? { ...a, assignedWorkerId: workerId } : a
      )
    );
  };

  const handleUpdateNotes = (animalId: string, notes: string) => {
    const nowTime = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    setAnimals((prev) =>
      prev.map((a) =>
        a.id === animalId
          ? {
              ...a,
              farmerNotes: notes,
              timeline: [
                {
                  id: `tl-note-${Date.now()}`,
                  type: 'note',
                  title: 'Farmer note updated',
                  detail: notes || 'Note cleared',
                  timestamp: `Today, ${nowTime}`,
                },
                ...a.timeline,
              ],
            }
          : a
      )
    );
  };

  const handleAddVeterinarian = (vet: Veterinarian) => {
    setVeterinarians((prev) => [vet, ...prev]);
  };

  const handleRemoveVeterinarian = (vetId: string) => {
    setVeterinarians((prev) => prev.filter((v) => v.id !== vetId));
  };

  const handleShareSuccess = (animalId: string, report: SharedVetReport) => {
    setAnimals((prev) =>
      prev.map((a) => {
        if (a.id !== animalId) return a;
        return {
          ...a,
          timeline: [
            {
              id: `tl-share-${Date.now()}`,
              type: 'vet_share',
              title: `Health report shared with ${report.vetName}`,
              detail: `Structured case ${report.structuredCase.caseId} sent to ${report.vetClinic} (${
                report.sharedItems.evidenceVideo
                  ? 'includes evidence video'
                  : 'profile, metrics & history'
              }).`,
              timestamp: `${report.date} • ${report.time}`,
              vetName: report.vetName,
            },
            ...a.timeline,
          ],
          sharedReports: [report, ...a.sharedReports],
        };
      })
    );
  };

  const handleToggleDetectionStatus = (detectionId: string) => {
    setDetections((prev) =>
      prev.map((d) =>
        d.id === detectionId
          ? {
              ...d,
              status: d.status === 'Reviewed' ? 'Pending Review' : 'Reviewed',
            }
          : d
      )
    );
  };

  const handleAddWorker = (worker: Worker) => {
    setWorkers((prev) => [worker, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#111827] flex flex-col">
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        language={language}
        onSelectLanguage={setLanguage}
      />

      <main className="flex-1 pb-12">
        {activeTab === 'dashboard' && (
          <DashboardView
            animals={animals}
            criticalAlerts={criticalAlerts}
            detections={detections}
            farmProfile={farmProfile}
            language={language}
            onDismissAlert={handleDismissAlert}
            onNavigateTab={handleSelectTab}
            onSelectAnimal={handleSelectAnimal}
            onOpenShareVetForAnimal={(animalId) => setSharingAnimalId(animalId)}
          />
        )}

        {activeTab === 'cows' && !selectedAnimal && (
          <CowsView
            animals={animals}
            language={language}
            onSelectAnimal={handleSelectAnimal}
            onAddAnimal={handleAddAnimal}
          />
        )}

        {activeTab === 'cows' && selectedAnimal && (
          <CowDetailView
            animal={selectedAnimal}
            workers={workers}
            language={language}
            onBack={() => setSelectedAnimalId(null)}
            onAssignWorker={handleAssignWorker}
            onUpdateNotes={handleUpdateNotes}
            onOpenShareVet={(animalId) => setSharingAnimalId(animalId)}
          />
        )}

        {activeTab === 'animals' && (
          <AnimalsDetectionsView
            detections={detections}
            veterinarians={veterinarians}
            language={language}
            onToggleDetectionStatus={handleToggleDetectionStatus}
            onOpenShareVetForAnimal={(animalId) => setSharingAnimalId(animalId)}
          />
        )}

        {activeTab === 'workers' && (
          <WorkersView
            workers={workers}
            animals={animals}
            language={language}
            onAddWorker={handleAddWorker}
            onSelectAnimal={handleSelectAnimal}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            farmProfile={farmProfile}
            animals={animals}
            workers={workers}
            language={language}
            onSelectLanguage={setLanguage}
            onSaveFarmProfile={setFarmProfile}
            onSelectAnimal={handleSelectAnimal}
          />
        )}
      </main>

      {/* Share with Veterinarian Bottom Sheet / Modal (strictly for the single selected animal) */}
      {sharingAnimal && (
        <ShareVetModal
          animal={sharingAnimal}
          farmProfile={farmProfile}
          veterinarians={veterinarians}
          onClose={() => setSharingAnimalId(null)}
          onAddVeterinarian={handleAddVeterinarian}
          onRemoveVeterinarian={handleRemoveVeterinarian}
          onShareSuccess={handleShareSuccess}
        />
      )}
    </div>
  );
}
