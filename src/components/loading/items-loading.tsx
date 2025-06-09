import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingItems() {
  return (
    <div className="flex border-t min-h-[600px] border-border pt-2">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex flex-col pl-4 w-60 py-2 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-40" />
        ))}
      </div>

      {/* Items grid skeleton */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
