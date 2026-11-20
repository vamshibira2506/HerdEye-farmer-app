import React from 'react';

export const CowOutlineIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 7c0-2 1.5-3.5 3-3.5-.5 1.5 0 2.5 1 3" />
    <path d="M20 7c0-2-1.5-3.5-3-3.5.5 1.5 0 2.5-1 3" />
    <path d="M6.5 9.5C4.5 9.5 3 8.5 2.5 7c1.8 0 3.2.5 4.2 1.5" />
    <path d="M17.5 9.5c2 0 3.5-1 4-2.5-1.8 0-3.2.5-4.2 1.5" />
    <rect x="6" y="7" width="12" height="10" rx="4" />
    <path d="M7.5 15.5h9a2.5 2.5 0 0 1 0 5h-9a2.5 2.5 0 0 1 0-5z" />
    <circle cx="9.5" cy="11.5" r="0.8" fill="currentColor" />
    <circle cx="14.5" cy="11.5" r="0.8" fill="currentColor" />
    <circle cx="10" cy="18" r="0.6" fill="currentColor" />
    <circle cx="14" cy="18" r="0.6" fill="currentColor" />
  </svg>
);

export const CowAvatarIllustration: React.FC<{ className?: string }> = ({
  className = 'w-12 h-12',
}) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    {/* Body */}
    <rect x="18" y="24" width="32" height="20" rx="8" fill="#E5E7EB" />
    {/* Spots */}
    <ellipse cx="29" cy="31" rx="6" ry="4.5" fill="#374151" />
    <ellipse cx="42" cy="36" rx="4.5" ry="3.5" fill="#374151" />
    {/* Legs */}
    <rect x="21" y="42" width="4" height="12" rx="2" fill="#D1D5DB" />
    <rect x="28" y="42" width="4" height="12" rx="2" fill="#9CA3AF" />
    <rect x="39" y="42" width="4" height="12" rx="2" fill="#D1D5DB" />
    <rect x="45" y="42" width="4" height="12" rx="2" fill="#9CA3AF" />
    {/* Udder */}
    <ellipse cx="41" cy="44" rx="4.5" ry="2.8" fill="#F9A8D4" />
    {/* Head */}
    <rect x="9" y="18" width="15" height="15" rx="5" fill="#F3F4F6" />
    {/* Ears & Horns */}
    <path d="M11 18c-1.5-3 0-5 2-5" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M22 18c1.5-3 0-5-2-5" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="8" cy="22" rx="3" ry="1.8" fill="#4B5563" />
    <ellipse cx="25" cy="22" rx="3" ry="1.8" fill="#4B5563" />
    {/* Muzzle */}
    <rect x="10" y="28" width="13" height="7" rx="3.5" fill="#FBCFE8" />
    <circle cx="13.5" cy="24" r="1.4" fill="#1F2937" />
    <circle cx="19.5" cy="24" r="1.4" fill="#1F2937" />
    <circle cx="14" cy="31.5" r="0.9" fill="#9D174D" />
    <circle cx="19" cy="31.5" r="0.9" fill="#9D174D" />
    {/* Tail */}
    <path d="M50 28c4 1 5 6 4 11" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DetectionAnimalIllustration: React.FC<{
  species: 'Dog' | 'Monkey' | 'Snake';
  size?: 'sm' | 'md';
}> = ({ species, size = 'md' }) => {
  const dims = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';

  if (species === 'Dog') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={dims} aria-hidden="true">
        {/* Dog body */}
        <rect x="14" y="22" width="20" height="11" rx="5" fill="#D49A6A" />
        <rect x="16" y="31" width="3.5" height="9" rx="1.75" fill="#B87A4B" />
        <rect x="29" y="31" width="3.5" height="9" rx="1.75" fill="#B87A4B" />
        {/* Tail */}
        <path d="M14 25c-4-2-5-5-4-8" stroke="#B87A4B" strokeWidth="3" strokeLinecap="round" />
        {/* Head */}
        <circle cx="34" cy="19" r="6.5" fill="#E3AE7F" />
        {/* Ear */}
        <ellipse cx="30" cy="20" rx="2.5" ry="4.5" fill="#9A5F37" />
        {/* Snout */}
        <ellipse cx="39" cy="20.5" rx="3.5" ry="2.6" fill="#F3D0B1" />
        <circle cx="41.5" cy="19.5" r="1.2" fill="#3B2516" />
        <circle cx="35.5" cy="17.5" r="1.1" fill="#3B2516" />
      </svg>
    );
  }

  if (species === 'Monkey') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={dims} aria-hidden="true">
        {/* Tail */}
        <path d="M16 32c-6 1-9-4-6-9" stroke="#6B4C41" strokeWidth="3" strokeLinecap="round" />
        {/* Body */}
        <ellipse cx="25" cy="31" rx="8.5" ry="9" fill="#7D5A4F" />
        <ellipse cx="25" cy="32" rx="5" ry="6" fill="#D9B7A3" />
        {/* Ears */}
        <circle cx="15.5" cy="18" r="3.5" fill="#7D5A4F" />
        <circle cx="34.5" cy="18" r="3.5" fill="#7D5A4F" />
        {/* Head */}
        <circle cx="25" cy="18" r="8" fill="#7D5A4F" />
        <ellipse cx="25" cy="20" rx="5.5" ry="4.5" fill="#E6C5B2" />
        <circle cx="22.5" cy="17" r="1.2" fill="#2A1C17" />
        <circle cx="27.5" cy="17" r="1.2" fill="#2A1C17" />
        <path d="M23 21.5c1.2 1 2.8 1 4 0" stroke="#4E342E" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" className={dims} aria-hidden="true">
      {/* Coiled green snake */}
      <path
        d="M14 34c0-5 5-6 10-6h6c5 0 7-3 7-7s-3-7-8-7h-6c-3 0-5 2-5 4.5"
        stroke="#48A878"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 34c0 3.5 4 5 11 5h9"
        stroke="#368A60"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Head */}
      <circle cx="18" cy="18.5" r="3.8" fill="#48A878" />
      <circle cx="16.8" cy="17.8" r="0.9" fill="#132A1F" />
      {/* Forked tongue */}
      <path d="M14 19.5h-3.5l-1.5-1.3M10.5 19.5l-1.5 1.3" stroke="#E11D48" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};
