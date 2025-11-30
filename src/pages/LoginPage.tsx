import { LoginForm } from "@/features/auth/components/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageSearch } from "lucide-react"; 

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
              <PackageSearch className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Inventory System
          </CardTitle>
          <CardDescription>
            Enter your Employee ID to access the tracker.
          </CardDescription>
        </CardHeader>
        
        {/* Login Form Component */}
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      
    </div>
  );
}