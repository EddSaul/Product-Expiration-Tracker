import { useNavigate } from "react-router-dom";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md text-center shadow-xl border-slate-200">
        <CardHeader className="pb-2">
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center animate-pulse">
              <FileQuestion className="h-12 w-12 text-slate-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">404</CardTitle>
          <h2 className="text-xl font-semibold text-slate-700 mt-2">Page Not Found</h2>
        </CardHeader>
        
        <CardContent>
          <p className="text-slate-500">
            We couldn't find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center pb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
          
          <Button 
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Home className="h-4 w-4" /> Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}