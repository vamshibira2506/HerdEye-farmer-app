import React from 'react';
import {
  CheckCircle2,
  Clock,
  FileText,
  Info,
  MapPin,
  Phone,
  Stethoscope,
  Video,
  X,
} from 'lucide-react';
import { SharedVetReport } from '../types';
import { EvidenceVideoPlayer } from './EvidenceVideoPlayer';

interface StructuredCaseModalProps {
  report: SharedVetReport;
  onClose: () => void;
}

export const StructuredCaseModal: React.FC<StructuredCaseModalProps> = ({
  report,
  onClose,
}) => {
  const c = report.structuredCase;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Structured Veterinarian Case Report"
    >
      <div className="bg-white w-full sm:max-w-2xl max-h-[92vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#B8862D]" />
              <h2 className="text-lg font-bold text-gray-900">
                Veterinarian Health Case
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 font-mono-num">
              {c.caseId} • Shared with {report.vetName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto herdeye-scroll px-5 sm:px-6 py-5 space-y-4 text-sm">
          {/* Recipient Banner */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF3E6] text-[#B8862D] flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{report.vetName}</p>
                <p className="text-xs text-gray-500">{report.vetClinic}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#ECFDF3] text-[#15803D] border border-[#BBF7D0] text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {report.status}
            </span>
          </div>

          {/* 11 Structured Case Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-gray-200">
              <p className="text-[11px] font-semibold text-gray-500 uppercase">
                1. Animal Identification
              </p>
              <p className="font-bold text-gray-900 mt-1">
                {c.animalIdentification.name} ({c.animalIdentification.tagId})
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                {c.animalIdentification.animalType} •{' '}
                {c.animalIdentification.breed} • {c.animalIdentification.age} •
                Tag: {c.animalIdentification.tagColor}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-200">
              <p className="text-[11px] font-semibold text-gray-500 uppercase">
                2. Current Health Status
              </p>
              <p
                className={`font-bold mt-1 ${
                  c.currentHealthStatus === 'At Risk'
                    ? 'text-[#B45309]'
                    : 'text-[#15803D]'
                }`}
              >
                {c.currentHealthStatus}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Abnormal Duration: {c.relevantHealthMetrics.abnormalDuration}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-200 space-y-2">
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase">
                3. Detected Abnormal Behaviour
              </p>
              <p className="font-semibold text-gray-900 mt-0.5">
                {c.detectedAbnormalBehaviour}
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-500 uppercase">
                4. AI-Generated Observation
              </p>
              <p className="text-xs sm:text-sm text-gray-700 mt-0.5 leading-relaxed">
                {c.aiGeneratedObservation}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-200 space-y-2">
            <p className="text-[11px] font-semibold text-gray-500 uppercase">
              5. Relevant Health Metrics
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-[#EFF4FF] p-2.5 rounded-lg">
                <span className="text-gray-500 block">Rumination</span>
                <strong className="text-gray-900 tabular-nums">
                  {c.relevantHealthMetrics.ruminationHours}h (
                  {c.relevantHealthMetrics.ruminationVsYesterday})
                </strong>
              </div>
              <div className="bg-[#F5EEFF] p-2.5 rounded-lg">
                <span className="text-gray-500 block">Cycles / Standing</span>
                <strong className="text-gray-900 tabular-nums">
                  {c.relevantHealthMetrics.ruminationCycles} cycles •{' '}
                  {c.relevantHealthMetrics.standingHours}h
                </strong>
              </div>
              <div className="bg-[#FEF9E7] p-2.5 rounded-lg">
                <span className="text-gray-500 block">Feeding</span>
                <strong className="text-gray-900">
                  {c.relevantHealthMetrics.feedingBehaviour}
                </strong>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Rumination Detail: {c.relevantHealthMetrics.ruminationStatus} •
              Activity: {c.relevantHealthMetrics.activityStatus}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-200">
            <p className="text-[11px] font-semibold text-gray-500 uppercase">
              6. Historical Trend
            </p>
            <p className="text-xs sm:text-sm text-gray-700 mt-1">
              {c.historicalTrend}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-200 space-y-2">
            <p className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[#B8862D]" />
              7. Evidence Video
            </p>
            {c.evidenceVideo ? (
              <EvidenceVideoPlayer video={c.evidenceVideo} compact />
            ) : (
              <p className="text-xs text-gray-500">
                No abnormal behaviour evidence video was attached to this report.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-gray-200">
              <p className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                8. Farm Location
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-900 mt-1">
                {c.farmLocation}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-gray-200">
              <p className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                9. Farmer Contact Information
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-900 mt-1">
                {c.farmerContactInfo.farmerName} ({c.farmerContactInfo.farmName})
              </p>
              <p className="text-xs text-gray-600 font-mono-num">
                {c.farmerContactInfo.phone}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-gray-200">
              <p className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                10. Timestamp of Alert
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-900 mt-1 tabular-nums">
                {c.alertTimestamp}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-gray-200">
              <p className="text-[11px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                11. Timestamp of Report Sharing
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-900 mt-1 tabular-nums">
                {c.reportSharedTimestamp}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#FFFDF2] border border-[#F0E3B1] text-xs text-gray-700 flex items-start gap-2">
            <Info className="w-4 h-4 text-[#B8862D] shrink-0 mt-0.5" />
            <p>{c.nonDiagnosticNotice}</p>
          </div>
        </div>

        <div className="px-5 sm:px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black hover:bg-gray-900 text-white text-sm font-semibold cursor-pointer"
          >
            Close Case Report
          </button>
        </div>
      </div>
    </div>
  );
};
