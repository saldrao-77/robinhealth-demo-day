import { Skeleton } from "@/components/ui/skeleton"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-6" />

          {/* Search and filters skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>

          {/* Savings comparison skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-6 w-64" />
              </div>

              <div className="flex items-center mt-4 md:mt-0 space-x-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-8 w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Listing skeleton */}
            <div className="md:col-span-1 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
              ))}
            </div>

            {/* Map skeleton */}
            <div className="md:col-span-2">
              <Skeleton className="h-[800px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
