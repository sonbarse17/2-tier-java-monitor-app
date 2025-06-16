import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header"; // Import header to match layout

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header /> {/* Render header during loading as well for consistency */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 animate-pulse">
        {/* Key Metric Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 rounded-lg shadow-lg" />
          <Skeleton className="h-32 rounded-lg shadow-lg" />
          <Skeleton className="h-32 rounded-lg shadow-lg" />
        </div>

        {/* Metrics Table and AI Insights Skeleton */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-72 rounded-lg shadow-lg" /> {/* Table placeholder */}
          </div>
          <div>
            <Skeleton className="h-72 rounded-lg shadow-lg" /> {/* AI Insights placeholder */}
          </div>
        </div>
        
        {/* Historical Charts Skeleton */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-1/4 rounded-lg" /> {/* Title placeholder */}
            <Skeleton className="h-10 w-48 rounded-lg" /> {/* Select placeholder */}
          </div>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            <Skeleton className="h-80 rounded-lg shadow-lg" />
            <Skeleton className="h-80 rounded-lg shadow-lg" />
            <Skeleton className="h-80 rounded-lg shadow-lg" />
          </div>
        </div>
      </main>
    </div>
  );
}
