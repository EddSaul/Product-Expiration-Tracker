import { LoginForm } from "@/features/auth/components/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageSearch } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Ambient gradient glows (futuristic) */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-chart-2/15 blur-[120px]" />

      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Theme toggle */}
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <Card className="relative z-10 w-full max-w-md border-border/70 shadow-2xl shadow-black/5 animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-sm">
        <CardHeader className="space-y-1 pt-8 pb-2 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
              <PackageSearch className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Expiration Tracker</CardTitle>
          <CardDescription>Ingresa tu ID de empleado para acceder al sistema.</CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <LoginForm />
        </CardContent>
      </Card>

      <p className="absolute bottom-4 z-10 text-xs text-muted-foreground">
        Product Expiration Tracker
      </p>
    </div>
  );
}
