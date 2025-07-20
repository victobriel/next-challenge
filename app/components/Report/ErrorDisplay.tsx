interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className='flex flex-col items-center gap-4 px-4 py-6'>
      <div className='text-center'>
        <p className='text-destructive mb-2'>Error loading report data:</p>
        <p className='text-muted-foreground text-sm'>{error}</p>
        <button
          onClick={onRetry}
          className='bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded px-4 py-2 transition-colors'
        >
          Retry
        </button>
      </div>
    </div>
  );
}
