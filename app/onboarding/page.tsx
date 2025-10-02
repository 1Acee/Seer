// app/onboarding/page.tsx
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
  password: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("account");
  
  const [accountData, setAccountData] = useState<AccountData>({
    name: "",
    businessName: "",
    email: "",
    password: ""
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
    
    // Check if it's business account (has businessName) or personal (has name)
    if (!accountData.businessName && !accountData.name.trim()) {
      newErrors.name = "Required";
    }
    if (!accountData.email.trim()) {
      newErrors.email = "Required";
    } else if (!/\S+@\S+\.\S+/.test(accountData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!accountData.password) {
      newErrors.password = "Required";
    } else if (accountData.password.length < 8) {
      newErrors.password = "Min 8 characters";
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

  const handleCategoriesComplete = () => {
    localStorage.setItem('userSelectedCategories', JSON.stringify(selectedCategories));
    setCurrentStep("complete");
  };

  return (
    <div className="w-full min-h-screen overflow-hidden bg-background">
      <Background />
      <ProgressBar currentStep={currentStep} />
      
      <div className="relative w-full min-h-screen">
        <AnimatePresence mode="wait">
          {currentStep === "account" && (
            <AccountStep
              key="account"
              accountData={accountData}
              setAccountData={setAccountData}
              onSubmit={handleAccountSubmit}
              errors={errors}
            />
          )}
          
          {currentStep === "persona" && (
            <PersonaStep 
              key="persona"
              onPersonaSelect={(personaId) => {
                setSelectedPersona(personaId);
                setCurrentStep("categories");
              }} 
            />
          )}

          {currentStep === "categories" && (
            <CategoryStep
              key="categories"
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              onComplete={handleCategoriesComplete}
            />
          )}

          {currentStep === "complete" && (
            <CompletionStep
              key="complete"
              userName={accountData.name || accountData.businessName || ''}
              selectedPersona={selectedPersona}
              selectedCategories={selectedCategories}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}