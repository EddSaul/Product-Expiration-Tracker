import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/config/supabaseClient";
import { Loader2, LogIn, AlertCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Domain constant for synthetic email
const DOMAIN_SUFFIX = "@tienda-interna.local";

// 1. Validation Schema
const formSchema = z.object({
  employeeId: z.string().min(1, {
    message: "Enter your Employee ID.",
  }),
  password: z.string().min(1, {
    message: "Enter your password.",
  }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { logAction } = useStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    setLoginError(null);

    // 2. Synthetic Email Creation 
    // The user enters "EMP-001", we send "EMP-001@tienda-interna.local"
    const syntheticEmail = `${values.employeeId.trim()}${DOMAIN_SUFFIX}`;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: syntheticEmail,
        password: values.password,
      });

      if (error) throw error;

      // 3. Success: Redirect to Dashboard
      await logAction('LOGIN', 'Successful login from Web');
      console.log("Login successful, welcome:", data.user?.user_metadata.full_name);
      navigate("/dashboard"); 

    } catch (error: any) {
      // Friendly error message on failure
      console.error("Login error:", error.message);
      setLoginError("Employee ID or password is incorrect.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Visual Error Alert */}
        {loginError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}

        {/* Employee ID Field */}
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee ID</FormLabel>
              <FormControl>
                <Input 
                  placeholder="E.g., 1500000000" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
              </div>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="******" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" /> Log In
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}