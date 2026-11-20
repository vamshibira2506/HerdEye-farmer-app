import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Info,
  Loader2,
  Lock,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserPlus,
  Video,
  X,
} from 'lucide-react';
import {
  Animal,
  FarmProfile,
  SharedVetReport,
  StructuredVetCase,
  VetAvailability,
  Veterinarian,
} from '../types';
import { EvidenceVideoPlayer } from './EvidenceVideoPlayer';

interface ShareVetModalProps {
  animal: Animal;
  farmProfile: FarmProfile;
  veterinarians: Veterinarian[];
  onClose: () => void;
  onAddVeterinarian: (vet: Veterinarian) => void;
  onRemoveVeterinarian: (vetId: string) => void;
  onShareSuccess: (animalId: string, report: SharedVetReport) => void;
}

type ModalStep = 'compose' | 'loading' | 'error' | 'success';

export const ShareVetModal: React.FC<ShareVetModalProps> = ({
  animal,
  farmProfile,
  veterinarians,
  onClose,
  onAddVeterinarian,
  onRemoveVeterinarian,
  onShareSuccess,
}) => {
  const [selectedVetId, setSelectedVetId] = useState<string | null>(
    veterinarians[0]?.id ?? null
  );
  const [step, setStep] = useState<ModalStep>('compose');
  const [loadingStage, setLoadingStage] = useState(
    'Preparing structured animal health case...'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showStructuredPreview, setShowStructuredPreview] = useState(false);
  const [showAddVetForm, setShowAddVetForm] = useState(false);
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [sharedReport, setSharedReport] = useState<SharedVetReport | null>(
    null
  );
  const [contactActionToast, setContactActionToast] = useState<string | null>(
    null
  );

  // Add Veterinarian form fields
  const [vetName, setVetName] = useState('');
  const [vetQualification, setVetQualification] = useState('BVSc & AH');
  const [vetSpecialization, setVetSpecialization] = useState(
    'Bovine & Dairy Medicine'
  );
  const [vetClinic, setVetClinic] = useState('');
  const [vetPhone, setVetPhone] = useState('');
  const [vetAvailability, setVetAvailability] =
    useState<VetAvailability>('Available Now');
  const [addVetError, setAddVetError] = useState<string | null>(null);

  const selectedVet =
    veterinarians.find((v) => v.id === selectedVetId) ?? null;

  const currentHealthStatus: 'At Risk' | 'Healthy' =
    animal.status === 'Low Rumination' ? 'At Risk' : 'Healthy';

  const buildStructuredCase = (now: Date): StructuredVetCase => {
    const formattedTimestamp = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const formattedVsYesterday =
      animal.ruminationVsYesterday >= 0
        ? `+${animal.ruminationVsYesterday.toFixed(1)}h`
        : `${animal.ruminationVsYesterday.toFixed(1)}h`;

    return {
      caseId: `HE-CASE-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${animal.tagId.replace('#', '')}`,
      animalIdentification: {
        id: animal.id,
        name: animal.name,
        tagId: animal.tagId,
        animalType: animal.animalType,
        breed: animal.breed,
        age: animal.age,
        tagColor: animal.tagColor,
      },
      currentHealthStatus,
      detectedAbnormalBehaviour: animal.detectedIssue,
      aiGeneratedObservation: animal.aiObservation,
      relevantHealthMetrics: {
        ruminationStatus: animal.ruminationStatusText,
        ruminationHours: animal.ruminationHours,
        ruminationCycles: animal.ruminationCycles,
        ruminationVsYesterday: formattedVsYesterday,
        activityStatus: animal.activityStatusText,
        standingHours: animal.standingHours,
        lyingHours: animal.lyingHours,
        walkingHours: animal.walkingHours,
        feedingBehaviour: animal.feedingBehaviour,
        abnormalDuration: animal.abnormalDuration,
      },
      historicalTrend: animal.historicalTrendSummary,
      evidenceVideo: animal.evidenceVideo,
      farmLocation: farmProfile.location || 'Farm location not set',
      farmerContactInfo: {
        farmerName: farmProfile.farmerName,
        farmName: farmProfile.farmName,
        phone: farmProfile.mobileNumber || 'Not provided',
      },
      alertTimestamp: animal.latestAlertTimestamp,
      reportSharedTimestamp: formattedTimestamp,
      nonDiagnosticNotice:
        'HerdEye reports AI-detected behavioural patterns and observations only. It does not diagnose disease. Clinical evaluation and diagnosis are performed solely by the veterinarian.',
    };
  };

  const handleCreateVet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vetName.trim() || !vetClinic.trim() || !vetPhone.trim()) {
      setAddVetError('Please enter veterinarian name, clinic, and phone number.');
      return;
    }

    const formattedName = vetName.trim().startsWith('Dr.')
      ? vetName.trim()
      : `Dr. ${vetName.trim()}`;

    const newVet: Veterinarian = {
      id: `vet-${Date.now()}`,
      name: formattedName,
      qualification: vetQualification.trim() || 'BVSc & AH',
      specialization: vetSpecialization.trim() || 'Livestock Medicine',
      clinic: vetClinic.trim(),
      availability: vetAvailability,
      phone: vetPhone.trim(),
      whatsapp: vetPhone.replace(/[^\d+]/g, ''),
    };

    onAddVeterinarian(newVet);
    setSelectedVetId(newVet.id);
    setVetName('');
    setVetClinic('');
    setVetPhone('');
    setAddVetError(null);
    setShowAddVetForm(false);
  };

  const handleShareReport = () => {
    if (!selectedVet) {
      setErrorMessage('Please select a veterinarian before sharing.');
      return;
    }

    setErrorMessage(null);
    setStep('loading');
    setLoadingStage(`Packaging structured health case for ${animal.name}...`);

    window.setTimeout(() => {
      setLoadingStage(
        animal.evidenceVideo
          ? `Attaching evidence video & sending to ${selectedVet.name}...`
          : `Sending structured health report to ${selectedVet.name}...`
      );
    }, 550);

    window.setTimeout(() => {
      if (!selectedVet.phone || selectedVet.phone.trim().length < 6) {
        setErrorMessage(
          `Could not deliver report to ${selectedVet.name} because their contact number is incomplete.`
        );
        setStep('error');
        return;
      }

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const structuredCase = buildStructuredCase(now);
      const report: SharedVetReport = {
        id: `rep-${Date.now()}`,
        animalId: animal.id,
        vetId: selectedVet.id,
        vetName: selectedVet.name,
        vetClinic: selectedVet.clinic,
        vetPhone: selectedVet.phone,
        date: dateStr,
        time: timeStr,
        status: 'Shared',
        sharedItems: {
          animalProfile: true,
          healthMetrics: true,
          healthAlert: true,
          healthHistory: true,
          evidenceVideo: Boolean(animal.evidenceVideo),
        },
        structuredCase,
      };

      setSharedReport(report);
      onShareSuccess(animal.id, report);
      setStep('success');
    }, 1250);
  };

  const handleRemoveVet = (vetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveVeterinarian(vetId);
    if (selectedVetId === vetId) {
      const remaining = veterinarians.filter((v) => v.id !== vetId);
      setSelectedVetId(remaining[0]?.id ?? null);
    }
  };

  const availabilityBadgeStyle = (status: VetAvailability) => {
    if (status === 'Available Now') {
      return 'bg-[#ECFDF3] text-[#15803D] border-[#BBF7D0]';
    }
    if (status === 'On Call') {
      return 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]';
    }
    return 'bg-[#FEF9E7] text-[#A16207] border-[#FDE68A]';
  };

  const previewCase = buildStructuredCase(new Date());

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-vet-modal-title"
    >
      <div className="bg-white w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Sheet Drag Handle on Mobile */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 bg-white">
          <div className="w-12 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-3 bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FAF3E6] text-[#B8862D] flex items-center justify-center shrink-0">
                <Stethoscope className="w-4 h-4" />
              </div>
              <h2
                id="share-vet-modal-title"
                className="text-lg sm:text-xl font-bold text-gray-900"
              >
                Share Animal Health Details
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Only <strong>{animal.name}</strong> ({animal.tagId}) will be
                shared. Other animals remain private.
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto herdeye-scroll px-5 sm:px-6 py-5 space-y-5">
          {/* STEP 1: COMPOSE & SELECT VET */}
          {step === 'compose' && (
            <>
              {/* Concise Animal Health Preview Card */}
              <section className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200/80">
                  <div className="flex items-center gap-3">
                    <img
                      src={animal.photoUrl}
                      alt={animal.name}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-gray-900">
                          {animal.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-xs font-semibold font-mono-num text-gray-700">
                          {animal.tagId}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {animal.animalType} • {animal.breed} • {animal.age} •
                        Tag Color:{' '}
                        <strong className="text-gray-800">
                          {animal.tagColor}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                      currentHealthStatus === 'At Risk'
                        ? 'bg-[#FEF3E2] text-[#B45309] border-[#F5CBA7]'
                        : 'bg-[#ECFDF3] text-[#15803D] border-[#BBF7D0]'
                    }`}
                  >
                    {currentHealthStatus === 'At Risk' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    Status: {currentHealthStatus}
                  </span>
                </div>

                {/* Concise Key-Value Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                  <div className="flex justify-between sm:block gap-2">
                    <span className="text-xs font-medium text-gray-500 block">
                      Detected Health Issue (AI Observation)
                    </span>
                    <span className="font-semibold text-gray-900">
                      {animal.detectedIssue}
                    </span>
                  </div>

                  <div className="flex justify-between sm:block gap-2">
                    <span className="text-xs font-medium text-gray-500 block">
                      Duration of Abnormal Behaviour
                    </span>
                    <span className="font-semibold text-gray-900">
                      {animal.abnormalDuration}
                    </span>
                  </div>

                  <div className="flex justify-between sm:block gap-2">
                    <span className="text-xs font-medium text-gray-500 block">
                      Rumination Status
                    </span>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {animal.ruminationStatusText}
                    </span>
                  </div>

                  <div className="flex justify-between sm:block gap-2">
                    <span className="text-xs font-medium text-gray-500 block">
                      Activity / Movement Status
                    </span>
                    <span className="font-semibold text-gray-900">
                      {animal.activityStatusText}
                    </span>
                  </div>

                  <div className="flex justify-between sm:block gap-2">
                    <span className="text-xs font-medium text-gray-500 block">
                      Feeding Behaviour
                    </span>
                    <span className="font-semibold text-gray-900">
                      {animal.feedingBehaviour}
                    </span>
                  </div>

                  <div className="flex justify-between sm:block gap-2">
                    <span className="text-xs font-medium text-gray-500 block">
                      Latest Health Alert
                    </span>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {animal.latestAlertTimestamp}
                    </span>
                  </div>
                </div>

                {/* Relevant Health History */}
                <div className="pt-2.5 border-t border-gray-200/80">
                  <span className="text-xs font-medium text-gray-500 block mb-1">
                    Relevant Health History
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {animal.historicalTrendSummary}
                  </p>
                </div>

                {/* Evidence Video Preview (if available) */}
                <div className="pt-2.5 border-t border-gray-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#B8862D]" />
                      Abnormal Behaviour Evidence Video
                    </span>
                    {animal.evidenceVideo ? (
                      <span className="text-[11px] font-semibold text-emerald-700">
                        Attached • {animal.evidenceVideo.durationSec}s clip
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500">
                        Not required (no abnormal clip recorded)
                      </span>
                    )}
                  </div>

                  {animal.evidenceVideo && (
                    <EvidenceVideoPlayer video={animal.evidenceVideo} compact />
                  )}
                </div>

                {/* Expandable Full 11-Item Structured Vet Case Preview */}
                <div className="pt-2 border-t border-gray-200/80">
                  <button
                    type="button"
                    onClick={() => setShowStructuredPreview((v) => !v)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-black py-1 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      View complete structured veterinarian case (11 sections)
                    </span>
                    {showStructuredPreview ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {showStructuredPreview && (
                    <div className="mt-3 p-3.5 rounded-xl bg-white border border-gray-200 text-xs space-y-2 text-gray-700">
                      <p>
                        <strong>1. Animal Identification:</strong>{' '}
                        {previewCase.animalIdentification.name} (
                        {previewCase.animalIdentification.tagId}) •{' '}
                        {previewCase.animalIdentification.animalType} (
                        {previewCase.animalIdentification.breed},{' '}
                        {previewCase.animalIdentification.age}) • Tag Color:{' '}
                        {previewCase.animalIdentification.tagColor}
                      </p>
                      <p>
                        <strong>2. Current Health Status:</strong>{' '}
                        {previewCase.currentHealthStatus}
                      </p>
                      <p>
                        <strong>3. Detected Abnormal Behaviour:</strong>{' '}
                        {previewCase.detectedAbnormalBehaviour} (Duration:{' '}
                        {previewCase.relevantHealthMetrics.abnormalDuration})
                      </p>
                      <p>
                        <strong>4. AI-Generated Observation:</strong>{' '}
                        {previewCase.aiGeneratedObservation}
                      </p>
                      <p>
                        <strong>5. Relevant Health Metrics:</strong> Rumination{' '}
                        {previewCase.relevantHealthMetrics.ruminationHours}h (
                        {previewCase.relevantHealthMetrics.ruminationCycles}{' '}
                        cycles,{' '}
                        {previewCase.relevantHealthMetrics.ruminationVsYesterday}{' '}
                        vs yesterday) • Standing{' '}
                        {previewCase.relevantHealthMetrics.standingHours}h •
                        Lying {previewCase.relevantHealthMetrics.lyingHours}h •
                        Feeding:{' '}
                        {previewCase.relevantHealthMetrics.feedingBehaviour}
                      </p>
                      <p>
                        <strong>6. Historical Trend:</strong>{' '}
                        {previewCase.historicalTrend}
                      </p>
                      <p>
                        <strong>7. Evidence Video:</strong>{' '}
                        {previewCase.evidenceVideo
                          ? `${previewCase.evidenceVideo.title} (${previewCase.evidenceVideo.cameraName})`
                          : 'No abnormal evidence clip available'}
                      </p>
                      <p>
                        <strong>8. Farm Location:</strong>{' '}
                        {previewCase.farmLocation}
                      </p>
                      <p>
                        <strong>9. Farmer Contact Information:</strong>{' '}
                        {previewCase.farmerContactInfo.farmerName} (
                        {previewCase.farmerContactInfo.farmName}) •{' '}
                        {previewCase.farmerContactInfo.phone}
                      </p>
                      <p>
                        <strong>10. Timestamp of Alert:</strong>{' '}
                        {previewCase.alertTimestamp}
                      </p>
                      <p>
                        <strong>11. Timestamp of Report Sharing:</strong>{' '}
                        {previewCase.reportSharedTimestamp}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Non-Diagnostic AI Observation Disclaimer */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FFFDF2] border border-[#F0E3B1] text-xs text-gray-700">
                <Info className="w-4 h-4 text-[#B8862D] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>AI Observation Only:</strong> HerdEye detects
                  abnormal behavioural patterns to assist early care and does{' '}
                  <strong>not</strong> diagnose disease. The veterinarian will
                  clinically evaluate and diagnose {animal.name}.
                </p>
              </div>

              {/* Select Veterinarian Section */}
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Select Veterinarian
                    </h3>
                    <p className="text-xs text-gray-500">
                      Choose who should receive this structured animal case
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAddVetForm((v) => !v);
                      setAddVetError(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#9A6F1C] bg-[#FAF3E6] hover:bg-[#F4E6C8] border border-[#E5C97B] transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Veterinarian</span>
                  </button>
                </div>

                {/* Inline Add Veterinarian Form */}
                {showAddVetForm && (
                  <form
                    onSubmit={handleCreateVet}
                    className="p-4 rounded-2xl bg-[#FAFBFC] border border-gray-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        <UserPlus className="w-4 h-4 text-[#B8862D]" />
                        Add New Veterinarian
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowAddVetForm(false)}
                        className="text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    {addVetError && (
                      <p className="text-xs text-red-600 font-medium">
                        {addVetError}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Veterinarian Name *
                        </label>
                        <input
                          type="text"
                          value={vetName}
                          onChange={(e) => setVetName(e.target.value)}
                          placeholder="e.g. Dr. Suresh Reddy"
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4963B]/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Qualification / Specialization
                        </label>
                        <input
                          type="text"
                          value={vetQualification}
                          onChange={(e) => setVetQualification(e.target.value)}
                          placeholder="e.g. BVSc & AH • Bovine Care"
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4963B]/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Clinic / Hospital *
                        </label>
                        <input
                          type="text"
                          value={vetClinic}
                          onChange={(e) => setVetClinic(e.target.value)}
                          placeholder="e.g. District Veterinary Hospital"
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4963B]/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Phone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          value={vetPhone}
                          onChange={(e) => setVetPhone(e.target.value)}
                          placeholder="+91 98XXX XXXXX"
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4963B]/40"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600">
                          Status:
                        </span>
                        <select
                          value={vetAvailability}
                          onChange={(e) =>
                            setVetAvailability(e.target.value as VetAvailability)
                          }
                          className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg"
                        >
                          <option value="Available Now">Available Now</option>
                          <option value="On Call">On Call</option>
                          <option value="Clinic Hours">Clinic Hours</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-black hover:bg-gray-900 text-white text-xs sm:text-sm font-semibold cursor-pointer"
                      >
                        Save & Select Veterinarian
                      </button>
                    </div>
                  </form>
                )}

                {/* Empty State when no veterinarians exist */}
                {veterinarians.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/70">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF3E6] text-[#B8862D] flex items-center justify-center mx-auto mb-3">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900">
                      No veterinarian added yet
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                      Add your local veterinarian or clinic so you can send
                      structured animal health reports in one tap.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAddVetForm(true)}
                      className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black hover:bg-gray-900 text-white text-sm font-semibold cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Veterinarian</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {veterinarians.map((vet) => {
                      const isSelected = selectedVetId === vet.id;
                      return (
                        <div
                          key={vet.id}
                          onClick={() => setSelectedVetId(vet.id)}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedVetId(vet.id);
                            }
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#C4963B] bg-[#FFFDF7] shadow-xs'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <div
                                className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? 'border-[#C4963B] bg-[#C4963B]'
                                    : 'border-gray-300 bg-white'
                                }`}
                              >
                                {isSelected && (
                                  <Check className="w-3 h-3 text-white stroke-[3]" />
                                )}
                              </div>

                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm sm:text-base font-bold text-gray-900">
                                    {vet.name}
                                  </p>
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${availabilityBadgeStyle(
                                      vet.availability
                                    )}`}
                                  >
                                    {vet.availability}
                                  </span>
                                </div>
                                <p className="text-xs font-medium text-gray-700">
                                  {vet.qualification} • {vet.specialization}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                  <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                  <span className="truncate">{vet.clinic}</span>
                                </p>
                                <p className="text-xs text-gray-600 flex items-center gap-1.5 font-mono-num">
                                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>{vet.phone}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <a
                                href={`tel:${vet.phone.replace(/\s+/g, '')}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title={`Call ${vet.name}`}
                                aria-label={`Call ${vet.name}`}
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                              <button
                                type="button"
                                onClick={(e) => handleRemoveVet(vet.id, e)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title={`Remove ${vet.name}`}
                                aria-label={`Remove ${vet.name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </section>
            </>
          )}

          {/* STEP 2: LOADING STATE */}
          {step === 'loading' && (
            <div className="py-12 px-4 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-[#FAF3E6] text-[#B8862D] flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-gray-900">
                  Sharing Structured Health Case
                </h3>
                <p className="text-sm text-gray-600">{loadingStage}</p>
              </div>
              <div className="max-w-xs mx-auto bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-[#C4963B] w-2/3 animate-pulse rounded-full" />
              </div>
              <p className="text-xs text-gray-500">
                Encrypting report for {animal.name} ({animal.tagId}) only...
              </p>
            </div>
          )}

          {/* STEP 3: ERROR STATE */}
          {step === 'error' && (
            <div className="py-10 px-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-gray-900">
                  Could Not Send Health Report
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  {errorMessage ||
                    'A connection error occurred while sending the animal health case. Please try again.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('compose')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Edit Selection
                </button>
                <button
                  type="button"
                  onClick={handleShareReport}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-black hover:bg-gray-900 text-white text-sm font-semibold cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 'success' && selectedVet && sharedReport && (
            <div className="py-4 space-y-5">
              <div className="text-center space-y-2.5">
                <div className="w-16 h-16 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center mx-auto ring-8 ring-[#ECFDF3]/60">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Health details shared with {selectedVet.name}
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  A structured health case for{' '}
                  <strong>
                    {animal.name} ({animal.tagId})
                  </strong>{' '}
                  has been sent to {selectedVet.clinic}. {selectedVet.name} will
                  review the observations and evaluate the animal.
                </p>
              </div>

              {/* Checklist of What Was Shared */}
              <div className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <span>Shared Case Contents</span>
                  <span className="font-mono-num text-gray-600">
                    {sharedReport.structuredCase.caseId}
                  </span>
                </div>

                <ul className="space-y-2.5 text-sm font-medium text-gray-800">
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>
                      Animal profile ({animal.name}, {animal.tagId},{' '}
                      {animal.tagColor} tag)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>
                      Health metrics (Rumination {animal.ruminationHours}h,
                      Activity & Feeding)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>
                      Health alert ({animal.latestAlertTimestamp}) & AI
                      observation
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>Health history & 7-day trend</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        sharedReport.sharedItems.evidenceVideo
                          ? 'bg-[#ECFDF3] text-[#16A34A]'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>
                      Evidence video{' '}
                      {sharedReport.sharedItems.evidenceVideo
                        ? `(${animal.evidenceVideo?.durationSec}s barn camera clip attached)`
                        : '(No abnormal video recorded)'}
                    </span>
                  </li>
                </ul>

                <div className="pt-2.5 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Shared {sharedReport.date} at {sharedReport.time}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Timeline Updated
                  </span>
                </div>
              </div>

              {/* Contact Veterinarian Expandable Panel */}
              {showContactPanel && (
                <div className="p-4 rounded-2xl bg-[#ECFDF3] border border-[#BBF7D0] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Direct Contact — {selectedVet.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedVet.clinic} • {selectedVet.phone}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <a
                      href={`tel:${selectedVet.phone.replace(/\s+/g, '')}`}
                      onClick={() =>
                        setContactActionToast(
                          `Initiating phone call to ${selectedVet.name} (${selectedVet.phone})`
                        )
                      }
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call {selectedVet.phone}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        setContactActionToast(
                          `WhatsApp follow-up message prepared for ${selectedVet.name} with Case ID ${sharedReport.structuredCase.caseId}`
                        )
                      }
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 text-emerald-800 border border-emerald-300 text-sm font-semibold transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send WhatsApp Message</span>
                    </button>
                  </div>
                  {contactActionToast && (
                    <p className="text-xs font-medium text-emerald-900 bg-white/80 rounded-lg px-3 py-2 border border-emerald-200">
                      {contactActionToast}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sticky Footer CTAs */}
        <div className="px-5 sm:px-6 py-4 border-t border-gray-200 bg-white shrink-0">
          {step === 'compose' && (
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="sm:w-36 min-h-[48px] py-3 px-4 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedVet}
                onClick={handleShareReport}
                className={`flex-1 min-h-[48px] py-3 px-5 rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-all ${
                  selectedVet
                    ? 'bg-gradient-to-b from-[#CFA044] to-[#B6882E] hover:from-[#C4963B] hover:to-[#A67A25] text-white shadow-sm cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Share Health Report</span>
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="sm:w-36 min-h-[48px] py-3 px-4 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => setShowContactPanel((v) => !v)}
                className="flex-1 min-h-[48px] py-3 px-5 rounded-xl bg-[#54A857] hover:bg-[#469649] text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Veterinarian</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
