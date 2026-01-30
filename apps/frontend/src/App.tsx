import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useHealthCheck } from '@/hooks/useHealthCheck'
import { useToast } from '@/providers/ToastProvider'
import { setupApiErrorHandling } from '@/services/api-setup'
import { RestorePage } from '@/pages/RestorePage'
import { RefreshCw, TrendingUp, Building2, Users, Clock } from 'lucide-react'

function App() {
  const { data, isLoading, isError, refetch } = useHealthCheck()
  const toast = useToast()
  const [showRestore, setShowRestore] = useState(false)

  // Check if restore prompt should be shown
  useEffect(() => {
    const skipRestore = localStorage.getItem('skip-restore')
    if (!skipRestore) {
      setShowRestore(true)
    }
  }, [])

  // Setup API error handling with toast notifications
  useEffect(() => {
    setupApiErrorHandling(toast)
  }, [toast])

  // Show restore page if it's the first run
  if (showRestore) {
    return <RestorePage />
  }

  const getStatusDisplay = () => {
    if (isLoading) return 'Checking...'
    if (isError) return 'Offline'
    return data?.status || 'Online'
  }

  const getStatusColor = () => {
    if (isLoading) return 'text-muted-foreground'
    if (isError) return 'text-destructive'
    return 'text-[var(--color-sage-dark)]'
  }

  return (
    <MainLayout>
      <div className="space-y-8 relative z-10">
        {/* Hero Header - Architectural precision */}
        <div className="animate-fade-in-up">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Portfolio Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Gestion patrimoniale immobilière
              </p>
            </div>
            <div className="blueprint-corner px-6 py-4 bg-card border rounded-lg shadow-arch">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isError ? 'bg-destructive animate-pulse-subtle' : 'bg-[var(--color-sage)]'}`} />
                <div>
                  <p className="measure-label">Système</p>
                  <p className={`metric-value text-lg ${getStatusColor()}`}>
                    {getStatusDisplay()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="h-8 w-8"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section divider */}
        <div className="section-divider" />

        {/* Stats Grid - Architectural cards with staggered animation */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Property Count Card */}
          <div className="stat-card bg-card border rounded-lg p-6 shadow-arch animate-fade-in-up delay-100">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-[var(--color-sage-light)] rounded-md">
                <Building2 className="h-5 w-5 text-[var(--color-sage-dark)]" />
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="measure-label">Biens immobiliers</p>
            <p className="metric-value text-3xl mt-1">0</p>
            <p className="text-sm text-muted-foreground mt-2">
              Aucune propriété enregistrée
            </p>
          </div>

          {/* Tenants Card */}
          <div className="stat-card bg-card border rounded-lg p-6 shadow-arch animate-fade-in-up delay-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-[var(--color-blueprint-light)] rounded-md">
                <Users className="h-5 w-5 text-[var(--color-blueprint)]" />
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="measure-label">Locataires actifs</p>
            <p className="metric-value text-3xl mt-1">0</p>
            <p className="text-sm text-muted-foreground mt-2">
              Aucun locataire enregistré
            </p>
          </div>

          {/* Pending Payments Card */}
          <div className="stat-card bg-card border rounded-lg p-6 shadow-arch animate-fade-in-up delay-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-[var(--color-terra-light)] rounded-md">
                <Clock className="h-5 w-5 text-[var(--color-terra-dark)]" />
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="measure-label">Paiements en attente</p>
            <p className="metric-value text-3xl mt-1">0</p>
            <p className="text-sm text-muted-foreground mt-2">
              Tous les loyers à jour
            </p>
          </div>

          {/* Backend Status Card */}
          <div className="stat-card bg-gradient-to-br from-card to-[var(--color-sage-light)] border rounded-lg p-6 shadow-arch animate-fade-in-up delay-400">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-28 mt-2" />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${
                    isError
                      ? 'bg-destructive/10 border-destructive/20 text-destructive'
                      : 'bg-[var(--color-sage-light)] border-[var(--color-sage)] text-[var(--color-sage-dark)]'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isError ? 'bg-destructive' : 'bg-[var(--color-sage)]'}`} />
                    <span className="text-xs font-medium">{getStatusDisplay().toUpperCase()}</span>
                  </div>
                </div>
                <p className="measure-label">Backend API</p>
                <p className="metric-value text-2xl mt-1">
                  {isError ? 'Déconnecté' : 'Connecté'}
                </p>
                {data?.timestamp && (
                  <p className="text-xs text-muted-foreground mt-2 text-technical">
                    {new Date(data.timestamp).toLocaleString('fr-FR')}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Action Bar - Blueprint style */}
        <div className="flex flex-wrap gap-3 animate-fade-in-up delay-400">
          <Button size="lg" className="shadow-arch">
            <Building2 className="mr-2 h-4 w-4" />
            Nouveau bien
          </Button>
          <Button variant="secondary" size="lg" className="shadow-arch">
            <Users className="mr-2 h-4 w-4" />
            Nouveau locataire
          </Button>
          <Button variant="outline" size="lg" className="shadow-arch">
            Rapports fiscaux
          </Button>
        </div>

        {/* System Status Section - Technical precision */}
        <div className="bg-card border rounded-lg p-6 shadow-arch-lg animate-fade-in-up delay-400">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-[var(--color-terra)]" />
            <h2 className="text-xl font-semibold">État du système</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="measure-label mb-2">React Query</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-sage)]" />
                <span className="text-technical">Actif</span>
              </div>
            </div>

            <div>
              <p className="measure-label mb-2">API Client</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-sage)]" />
                <span className="text-technical">Configuré</span>
              </div>
            </div>

            <div>
              <p className="measure-label mb-2">DevTools</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-sage)]" />
                <span className="text-technical">Disponible (coin inférieur droit)</span>
              </div>
            </div>
          </div>

          {/* Technical annotation */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-muted-foreground text-technical">
              Architecture: React 18 + Vite + NestJS + Prisma ORM + SQLite
            </p>
          </div>
        </div>

        {/* Getting Started Guide - Clean architecture */}
        <div className="bg-gradient-to-br from-[var(--color-sage-light)] to-transparent border border-[var(--color-sage)] rounded-lg p-6 animate-fade-in-up delay-400">
          <h3 className="text-lg font-semibold mb-4">Premiers pas</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--color-terra)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">Créez votre premier bien immobilier</p>
                <p className="text-sm text-muted-foreground">
                  Enregistrez les informations de base: adresse, surface, type de location
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--color-terra)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">Ajoutez vos locataires</p>
                <p className="text-sm text-muted-foreground">
                  Gérez les contacts et historiques de location
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--color-terra)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">Suivez vos loyers</p>
                <p className="text-sm text-muted-foreground">
                  Validation rapide des paiements en un clic
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default App
