'use client';

interface OrganicSpinnerProps {
  message?: string;
}

export default function OrganicSpinner({ message = 'Preparando tudo para você...' }: OrganicSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className="organic-o organic-o-large"
        style={{ animation: 'spin 2s linear infinite' }}
        aria-hidden="true"
      >
        O
      </div>
      <p className="text-helora-tan font-sans text-sm">{message}</p>
    </div>
  );
}