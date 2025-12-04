import { useLocation } from "wouter";
import AuthCard from "@/components/AuthCard";

export default function AuthPage() {
  const [, navigate] = useLocation();

  const handleSuccess = () => {
    const returnTo = sessionStorage.getItem("auth_return_to") || "/start";
    sessionStorage.removeItem("auth_return_to");
    navigate(returnTo);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: "linear-gradient(to bottom, #0a0014, #110022, #1a0033)",
      }}
    >
      <AuthCard onSuccess={handleSuccess} />
    </div>
  );
}
