export default function SkeletonCard({ variant = 'article' }) {
  if (variant === 'issue') {
    return (
      <div className="bg-white border border-line rounded-card overflow-hidden animate-pulse">
        <div className="aspect-[3/4] bg-muted" />
        <div className="p-4 space-y-2">
          <div className="h-3 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white border border-line rounded-card p-5 animate-pulse">
      <div className="h-3 bg-muted rounded w-1/4 mb-3" />
      <div className="h-5 bg-muted rounded w-3/4 mb-2" />
      <div className="h-3 bg-muted rounded w-1/2 mb-3" />
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded w-5/6" />
      </div>
    </div>
  );
}
