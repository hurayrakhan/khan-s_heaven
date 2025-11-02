"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Github } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) toast.error(res.error);
      else {
        toast.success("Logged in — redirecting...");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: string) {
    setLoading(true);
    try {
      // Use redirect: false to handle errors client-side if needed
      await signIn(provider, { redirect: true, callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(error);
      toast.error("Social sign-in failed.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E3A34]/5">
      <ToastContainer position="top-right" />
      <div className="w-full max-w-md mx-4">
        <div className="bg-white p-8 rounded-2xl shadow-md">
          {/* Logo and branding */}
          <div className="mb-6 text-center">
            <div onClick={() => router.push('/')} className="flex justify-center mb-4">
              <Image src="/logo.png" alt="Task-Era Logo" width={64} height={64} className="rounded-full" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1E3A34]">Welcome to Task-Era</h2>
            <p className="text-sm text-muted-foreground mt-2">Sign in to continue to your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="sr-only">Email</label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              aria-label="Email"
            />

            <label className="sr-only">Password</label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              aria-label="Password"
            />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input id="remember" type="checkbox" className="h-4 w-4" />
                <label htmlFor="remember" className="text-sm">Remember me</label>
              </div>
              <button 
                type="button" 
                className="text-[#1E3A34] hover:underline" 
                onClick={() => router.push('/forgot-password')}
              >
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#1E3A34] hover:bg-[#1E3A34]/90" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <span className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-muted-foreground">Or continue with</span>
            <span className="flex-1 h-px bg-slate-100" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleSocialSignIn('google')}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.8 10.2h-9.6v3.6h5.5c-.2 1.4-1.2 3-3.5 3.9-2.1.9-4.1.5-5.6.1-2.4-.7-4.3-2.8-5.4-5.4C1.1 12.6 1 9.9 2.3 7.6 3.6 5.3 6 3.6 8.6 3c1.7-.4 3.9-.4 5.6.1 1.5.4 2.8 1.2 3.9 2.2l-2.2 2.2c-.8-.8-1.8-1.3-3-1.5-1.1-.2-2.6-.1-3.4.4-.9.6-1.3 1.4-1.6 2.3-.3.9-.4 2.3.1 3.3.6 1.5 1.8 2.9 3.4 3.6 1.7.8 3.6.6 4.6.4 1.6-.4 2.7-1.5 3.2-2.5.3-.6.5-1.2.6-1.9h-6.1v-3.6h9.6v.1z" fill="#4285F4" />
              </svg>
              <span className="truncate">Google</span>
            </button>

            <button
              onClick={() => handleSocialSignIn('github')}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">New to Task-Era?</span>{' '}
            <button 
              className="text-[#1E3A34] font-medium hover:underline"
              onClick={() => router.push('/register')}
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
