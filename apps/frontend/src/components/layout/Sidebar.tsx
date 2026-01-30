import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Users,
  CreditCard,
  FileText,
  LayoutDashboard
} from "lucide-react"
import { ExportButton } from "@/components/backup/ExportButton"

interface SidebarProps {
  className?: string
  id?: string
  onNavigate?: () => void
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", color: "sage" },
  { icon: Building2, label: "Propriétés", href: "/properties", color: "terra" },
  { icon: Users, label: "Locataires", href: "/tenants", color: "blueprint" },
  { icon: CreditCard, label: "Paiements", href: "/payments", color: "sage" },
  { icon: FileText, label: "Documents", href: "/documents", color: "terra" },
]

export function Sidebar({ className, id, onNavigate }: SidebarProps) {
  // TODO: Replace <a href> with React Router <Link> when router is installed
  // Current implementation uses anchor tags which cause full page reloads

  return (
    <aside
      id={id}
      className={cn(
        "w-64 bg-card border-r relative overflow-hidden",
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Subtle grid background - architectural detail */}
      <div className="absolute inset-0 opacity-20 grid-overlay pointer-events-none" />

      <div className="flex h-full flex-col relative z-10">
        {/* Logo / Brand Section - Blueprint style */}
        <div className="p-6 border-b bg-gradient-to-br from-card to-[var(--color-sage-light)]">
          <div className="blueprint-corner pb-4">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              YoyImmo
            </h1>
            <p className="text-sm text-muted-foreground mt-1 text-technical">
              Property Management
            </p>
          </div>

          {/* Architectural line accent */}
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-terra)] to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-terra)]" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1" aria-label="Primary">
          {navItems.map((item, index) => (
            <div
              key={item.href}
              className="animate-slide-in-right"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start group relative overflow-hidden",
                  "hover:bg-[var(--color-sage-light)] transition-all duration-300"
                )}
                asChild
              >
                <a
                  href={item.href}
                  aria-label={`Navigate to ${item.label}`}
                  onClick={onNavigate}
                  className="flex items-center"
                >
                  {/* Accent line on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-terra)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

                  {/* Icon with colored background */}
                  <div className={cn(
                    "mr-3 p-1.5 rounded transition-colors duration-300",
                    item.color === "sage" && "group-hover:bg-[var(--color-sage-light)]",
                    item.color === "terra" && "group-hover:bg-[var(--color-terra-light)]",
                    item.color === "blueprint" && "group-hover:bg-[var(--color-blueprint-light)]"
                  )}>
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  </div>

                  <span className="font-medium">{item.label}</span>
                </a>
              </Button>
            </div>
          ))}
        </nav>

        {/* Footer Section - Technical details */}
        <div className="p-4 border-t space-y-4 bg-gradient-to-t from-[var(--color-sage-light)] to-transparent">
          {/* Export Backup Button */}
          <ExportButton />

          {/* System Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-sage)] animate-pulse-subtle" />
              <span className="text-xs text-muted-foreground text-technical">
                Système opérationnel
              </span>
            </div>

            {/* Version with architectural detail */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <div className="h-px w-4 bg-[var(--color-border)]" />
              <span className="text-xs text-muted-foreground text-technical">
                v1.0.0-beta
              </span>
            </div>
          </div>

          {/* Decorative corner marker */}
          <div className="flex justify-center pt-2">
            <div className="w-8 h-8 border-2 border-[var(--color-blueprint)] opacity-20 transform rotate-45" />
          </div>
        </div>
      </div>
    </aside>
  )
}
