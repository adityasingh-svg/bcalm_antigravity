import { useState, useRef, useEffect } from "react";
import { GraduationCap, Loader2 } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } from "@/lib/supabase";

type AuthCardMode = "default" | "forgot-password";

interface AuthCardProps {
  onSuccess?: () => void;
  className?: string;
}

export default function AuthCard({ onSuccess, className = "" }: AuthCardProps) {
  const [mode, setMode] = useState<AuthCardMode>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showNewUserHint, setShowNewUserHint] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setError(null);
    setShowNewUserHint(false);
    setResetSent(false);
  }, [mode]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Could not sign in with Google");
      setIsLoading(false);
    }
  };

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmail(email, password);
      onSuccess?.();
    } catch (signInError: any) {
      if (signInError.message?.includes("Invalid login credentials")) {
        try {
          const result = await signUpWithEmail(email, password);
          if (result.user && !result.session) {
            setError("Check your email to confirm your account");
          } else {
            onSuccess?.();
          }
        } catch (signUpError: any) {
          setError(signUpError.message || "Could not create account");
        }
      } else {
        setError(signInError.message || "Sign in failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || "Could not send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewHereClick = () => {
    setShowNewUserHint(true);
    emailInputRef.current?.focus();
  };

  const handleForgotPasswordClick = () => {
    setMode("forgot-password");
  };

  const handleBackToSignIn = () => {
    setMode("default");
    setResetSent(false);
  };

  return (
    <div 
      className={`w-full max-w-[420px] rounded-xl p-8 animate-in fade-in duration-200 ${className}`}
      style={{
        backgroundColor: "rgba(20, 12, 40, 0.96)",
        border: "1px solid rgba(255, 255, 255, 0.10)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      }}
      data-testid="auth-card"
    >
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-4"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)",
          }}
        >
          <GraduationCap className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Welcome to BCALM</h1>
        <p className="text-white/60 text-sm">Sign in to continue</p>
      </div>

      {mode === "default" ? (
        <>
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 mb-5 font-medium"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)",
            }}
            data-testid="button-google-signin"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <SiGoogle className="h-4 w-4 mr-2" />
            )}
            Continue with Google
          </Button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 text-white/40" style={{ backgroundColor: "rgba(20, 12, 40, 0.96)" }}>
                or
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailContinue} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-email" className="text-white/80 text-sm">
                Email
              </Label>
              <Input
                ref={emailInputRef}
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-[#1a0033] border-white/20 text-white placeholder:text-white/30 focus:border-primary"
                style={{ borderColor: "rgba(255, 255, 255, 0.15)" }}
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="auth-password" className="text-white/80 text-sm">
                Password
              </Label>
              <Input
                id="auth-password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-[#1a0033] border-white/20 text-white placeholder:text-white/30 focus:border-primary"
                style={{ borderColor: "rgba(255, 255, 255, 0.15)" }}
                data-testid="input-password"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm" data-testid="text-error">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-11 font-medium"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)",
              }}
              data-testid="button-continue"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Continue
            </Button>

            {showNewUserHint && (
              <p className="text-white/50 text-sm text-center" data-testid="text-new-user-hint">
                We'll create your account if you're new.
              </p>
            )}
          </form>

          <div className="flex items-center justify-between mt-5 text-sm">
            <button
              type="button"
              onClick={handleNewHereClick}
              className="text-white/50 hover:text-white/80 transition-colors"
              data-testid="button-new-here"
            >
              New here? Create account
            </button>
            <button
              type="button"
              onClick={handleForgotPasswordClick}
              className="text-white/50 hover:text-white/80 transition-colors"
              data-testid="button-forgot-password"
            >
              Forgot password?
            </button>
          </div>
        </>
      ) : (
        <>
          {resetSent ? (
            <div className="text-center py-4">
              <p className="text-white text-lg mb-4" data-testid="text-reset-sent">
                Reset link sent
              </p>
              <button
                type="button"
                onClick={handleBackToSignIn}
                className="text-primary hover:text-primary/80 transition-colors text-sm"
                data-testid="button-back-to-signin"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-white/80 text-sm">
                  Email
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-11 bg-[#1a0033] border-white/20 text-white placeholder:text-white/30 focus:border-primary"
                  style={{ borderColor: "rgba(255, 255, 255, 0.15)" }}
                  data-testid="input-reset-email"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm" data-testid="text-error">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full h-11 font-medium"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)",
                }}
                data-testid="button-send-reset"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Send reset link
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleBackToSignIn}
                  className="text-white/50 hover:text-white/80 transition-colors text-sm"
                  data-testid="button-back-to-signin"
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}
        </>
      )}

      <p className="text-center text-xs text-white/30 mt-6">
        By continuing you agree to Terms & Privacy
      </p>
    </div>
  );
}
