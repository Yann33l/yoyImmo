import { useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useHealthCheck } from '@/hooks/useHealthCheck'
import { useToast } from '@/providers/ToastProvider'
import { setupApiErrorHandling } from '@/services/api-setup'
import { RefreshCw } from 'lucide-react'

function App() {
  const { data, isLoading, isError, refetch } = useHealthCheck()
  const toast = useToast()

  // Setup API error handling with toast notifications
  useEffect(() => {
    setupApiErrorHandling(toast)
  }, [toast])

  const getStatusDisplay = () => {
    if (isLoading) return 'Loading...'
    if (isError) return 'Backend not available'
    return data?.status || 'Connected'
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to YoyImmo property management
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Backend Status</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => refetch()}
                disabled={isLoading}
                className="h-6 w-6"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-24 mt-2" />
                <Skeleton className="h-3 w-32 mt-1" />
              </>
            ) : (
              <>
                <p className={`mt-2 text-2xl font-bold ${isError ? 'text-destructive' : 'text-foreground'}`}>
                  {getStatusDisplay()}
                </p>
                {data?.timestamp && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Last check: {new Date(data.timestamp).toLocaleTimeString()}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Properties</h3>
            <p className="mt-2 text-2xl font-bold">0</p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Tenants</h3>
            <p className="mt-2 text-2xl font-bold">0</p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Pending Payments</h3>
            <p className="mt-2 text-2xl font-bold">0</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button>Add Property</Button>
          <Button variant="outline">Add Tenant</Button>
          <Button variant="secondary">View Reports</Button>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              React Query: <span className="text-foreground font-medium">Active</span>
            </p>
            <p className="text-muted-foreground">
              API Client: <span className="text-foreground font-medium">Configured</span>
            </p>
            <p className="text-muted-foreground">
              DevTools: <span className="text-foreground font-medium">Available (bottom-right corner)</span>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default App
