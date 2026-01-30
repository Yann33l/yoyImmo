import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Building2,
  Users,
  CreditCard,
  FileText
} from "lucide-react"

interface SidebarProps {
  className?: string
  id?: string
  onNavigate?: () => void
}

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Building2, label: "Properties", href: "/properties" },
  { icon: Users, label: "Tenants", href: "/tenants" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: FileText, label: "Documents", href: "/documents" },
]

export function Sidebar({ className, id, onNavigate }: SidebarProps) {
  // TODO: Replace <a href> with React Router <Link> when router is installed
  // Current implementation uses anchor tags which cause full page reloads
  return (
    <aside id={id} className={cn("w-64 border-r bg-card", className)} role="navigation" aria-label="Main navigation">
      <div className="flex h-full flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-foreground">YoyImmo</h1>
          <p className="text-sm text-muted-foreground">Property Management</p>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Primary">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <a
                href={item.href}
                aria-label={`Navigate to ${item.label}`}
                onClick={onNavigate}
              >
                <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                {item.label}
              </a>
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            YoyImmo v1.0
          </p>
        </div>
      </div>
    </aside>
  )
}
