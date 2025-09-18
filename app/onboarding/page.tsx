// File: app/onboarding/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Background from "@/components/onboarding/Background";
import ProgressBar from "@/components/onboarding/ProgressBar";
import AccountStep from "@/components/onboarding/AccountStep";
import PersonaStep from "@/components/onboarding/PersonaStep";
import CategoryStep from "@/components/onboarding/CategoryStep";
import CompletionStep from "@/components/onboarding/CompletionStep";

type OnboardingStep = "account" | "persona" | "categories" | "complete";

interface AccountData {
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("account");
  
  const [accountData, setAccountData] = useState<AccountData>({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<AccountData>>({});

  const DEV_MODE = true;

  useEffect(() => {
    if (!DEV_MODE) {
      const isOnboarded = localStorage.getItem("onboardingComplete");
      if (isOnboarded === "true") {
        router.push("/dashboard");
      }
    }
  }, [router]);

  const validateAccountData = () => {
    const newErrors: Partial<AccountData> = {};
    
    if (!accountData.name.trim()) newErrors.name = "Required";
    if (!accountData.email.trim()) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(accountData.email)) newErrors.email = "Invalid email";
    if (!accountData.phone.trim()) newErrors.phone = "Required";
    if (!accountData.username.trim()) newErrors.username = "Required";
    if (!accountData.password) newErrors.password = "Required";
    else if (accountData.password.length < 8) newErrors.password = "Min 8 characters";
    if (accountData.password !== accountData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAccountData()) {
      setCurrentStep("persona");
    }
  };

return (
  <div className="w-screen h-screen overflow-hidden" style={{ background: '#fdfcfb' }}>
    <Background />
    <ProgressBar currentStep={currentStep} show={currentStep !== "account"} />
    
    <div className="relative w-screen h-screen flex items-center justify-center">
      <AnimatePresence mode="wait">
        {currentStep === "account" && (
          <AccountStep
            accountData={accountData}
            setAccountData={setAccountData}
            onSubmit={handleAccountSubmit}
            errors={errors}
          />
        )}
        
        {currentStep === "persona" && (
          <PersonaStep 
            onPersonaSelect={(personaId) => {
              setSelectedPersona(personaId);
              setCurrentStep("categories");
            }} 
          />
        )}

{currentStep === "categories" && (
  <CategoryStep
    selectedCategories={selectedCategories}
    onCategoriesChange={setSelectedCategories}
    onComplete={() => setCurrentStep("complete")}
  />
)}

{currentStep === "complete" && (
  <CompletionStep
    userName={accountData.name}
    selectedPersona={selectedPersona}
    selectedCategories={selectedCategories}
  />
)}

        {/* Add categories step next */}
        
      </AnimatePresence>
    </div>
  </div>
);
}