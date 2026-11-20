export type Language = 'en' | 'hi' | 'te';

export type NavTab = 'dashboard' | 'cows' | 'animals' | 'workers' | 'settings';

export type AnimalType = 'Cow' | 'Buffalo';

export type HealthStatus = 'Low Rumination' | 'Rumination OK';

export type VetAvailability = 'Available Now' | 'On Call' | 'Clinic Hours';

export interface RuminationPoint {
  time: string;
  hours: number;
}

export interface EvidenceVideo {
  id: string;
  title: string;
  cameraName: string;
  recordedAt: string;
  durationSec: number;
  summary: string;
  thumbnailUrl: string;
}

export interface TimelineEvent {
  id: string;
  type: 'alert' | 'vet_share' | 'checkup' | 'note';
  title: string;
  detail: string;
  timestamp: string;
  vetName?: string;
}

export interface StructuredVetCase {
  caseId: string;
  animalIdentification: {
    id: string;
    name: string;
    tagId: string;
    animalType: AnimalType;
    breed: string;
    age: string;
    tagColor: string;
  };
  currentHealthStatus: 'At Risk' | 'Healthy';
  detectedAbnormalBehaviour: string;
  aiGeneratedObservation: string;
  relevantHealthMetrics: {
    ruminationStatus: string;
    ruminationHours: number;
    ruminationCycles: number;
    ruminationVsYesterday: string;
    activityStatus: string;
    standingHours: number;
    lyingHours: number;
    walkingHours: number;
    feedingBehaviour: string;
    abnormalDuration: string;
  };
  historicalTrend: string;
  evidenceVideo: EvidenceVideo | null;
  farmLocation: string;
  farmerContactInfo: {
    farmerName: string;
    farmName: string;
    phone: string;
  };
  alertTimestamp: string;
  reportSharedTimestamp: string;
  nonDiagnosticNotice: string;
}

export interface SharedVetReport {
  id: string;
  animalId: string;
  vetId: string;
  vetName: string;
  vetClinic: string;
  vetPhone: string;
  date: string;
  time: string;
  status: 'Shared' | 'Viewed by Vet' | 'Evaluation Pending' | 'Evaluated';
  sharedItems: {
    animalProfile: boolean;
    healthMetrics: boolean;
    healthAlert: boolean;
    healthHistory: boolean;
    evidenceVideo: boolean;
  };
  structuredCase: StructuredVetCase;
}

export interface Animal {
  id: string;
  name: string;
  tagId: string;
  animalType: AnimalType;
  breed: string;
  age: string;
  tagColor: string;
  photoUrl: string;
  status: HealthStatus;
  ruminationHours: number;
  ruminationCycles: number;
  ruminationVsYesterday: number;
  ruminationStatusText: string;
  standingHours: number;
  standingVsYesterday: number;
  lyingHours: number;
  walkingHours: number;
  activityStatusText: string;
  feedingBehaviour: string;
  detectedIssue: string;
  abnormalDuration: string;
  latestAlertTimestamp: string;
  aiObservation: string;
  historicalTrendSummary: string;
  evidenceVideo: EvidenceVideo | null;
  assignedWorkerId: string | null;
  farmerNotes: string;
  ruminationSeries: RuminationPoint[];
  timeline: TimelineEvent[];
  sharedReports: SharedVetReport[];
}

export interface Veterinarian {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  clinic: string;
  availability: VetAvailability;
  phone: string;
  whatsapp: string;
}

export interface AnimalDetection {
  id: string;
  species: 'Dog' | 'Monkey' | 'Snake';
  title: string;
  dateTime: string;
  location: string;
  status: 'Reviewed' | 'Pending Review';
  relatedCowId?: string;
}

export interface Worker {
  id: string;
  name: string;
  role: 'Cleaner' | 'Milker' | 'Feeder' | 'Supervisor';
  phone: string;
  avatarUrl: string;
  hoursToday: number;
  hoursThisWeek: number;
  checkIn: string;
  checkOut?: string;
}

export interface CriticalAlert {
  id: string;
  animalId: string;
  animalName: string;
  severity: 'CRITICAL' | 'WARNING';
  message: string;
  timestamp: string;
  dismissed?: boolean;
}

export interface FarmProfile {
  farmerName: string;
  farmName: string;
  location: string;
  mobileNumber: string;
  vetPhoneNumber: string;
}
