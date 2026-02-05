"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createShop, completeOnboarding } from "@/lib/actions/shops";
import {
  Loader2,
  Store,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Phone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingWizardProps {
  hasShop: boolean;
  userEmail: string;
  userName: string;
}

const SHOP_CATEGORIES = [
  { value: "clothing", label: "Clothing & Apparel" },
  { value: "fashion", label: "Fashion Boutique" },
  { value: "accessories", label: "Accessories" },
  { value: "footwear", label: "Footwear" },
  { value: "sportswear", label: "Sportswear" },
  { value: "formal", label: "Formal Wear" },
  { value: "casual", label: "Casual Wear" },
  { value: "other", label: "Other" },
];

const STEPS = [
  { id: "welcome", title: "Welcome", icon: Sparkles },
  { id: "shop-info", title: "Shop Details", icon: Store },
  { id: "location", title: "Location", icon: MapPin },
  { id: "complete", title: "Complete", icon: Check },
];

export function OnboardingWizard({
  hasShop,
  userEmail,
  userName,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(hasShop ? 3 : 0);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [shopData, setShopData] = useState({
    name: "",
    description: "",
    category: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
    email: userEmail,
  });

  const updateShopData = (field: string, value: string) => {
    setShopData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateShop = async () => {
    setIsLoading(true);

    const formData = new FormData();
    Object.entries(shopData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await createShop(formData);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
      return false;
    }

    toast.success("Shop created successfully!");
    setIsLoading(false);
    return true;
  };

  const handleComplete = async () => {
    setIsLoading(true);
    const result = await completeOnboarding();

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      // Create shop when moving from location to complete
      const success = await handleCreateShop();
      if (!success) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return shopData.name.length >= 2 && shopData.category !== "";
      case 2:
        return true; // Location is optional
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress Bar */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                        isActive &&
                          "border-primary bg-primary text-primary-foreground",
                        isCompleted &&
                          "border-primary bg-primary text-primary-foreground",
                        !isActive &&
                          !isCompleted &&
                          "border-muted-foreground/30 text-muted-foreground/50"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "mt-2 text-xs font-medium hidden sm:block",
                        isActive && "text-primary",
                        isCompleted && "text-primary",
                        !isActive && !isCompleted && "text-muted-foreground/50"
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "mx-2 sm:mx-4 h-[2px] w-8 sm:w-16 transition-colors",
                        index < currentStep ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  Welcome, {userName || "there"}!
                </CardTitle>
                <CardDescription className="text-base">
                  Let&apos;s get your virtual try-on shop set up. This will only
                  take a minute.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                  <h4 className="font-medium">What you&apos;ll get:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Product catalog management
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Customer-facing kiosk for try-ons
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      AI-powered virtual try-on technology
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Inventory tracking & analytics
                    </li>
                  </ul>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 1: Shop Info */}
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Shop Details
                </CardTitle>
                <CardDescription>
                  Tell us about your shop so customers can find you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Shop Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Shop"
                    value={shopData.name}
                    onChange={(e) => updateShopData("name", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={shopData.category}
                    onValueChange={(value) => updateShopData("category", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SHOP_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell customers what makes your shop special..."
                    value={shopData.description}
                    onChange={(e) =>
                      updateShopData("description", e.target.value)
                    }
                    disabled={isLoading}
                    rows={3}
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location & Contact
                </CardTitle>
                <CardDescription>
                  Optional: Add your shop location and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={shopData.address}
                    onChange={(e) => updateShopData("address", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={shopData.city}
                      onChange={(e) => updateShopData("city", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={shopData.state}
                      onChange={(e) => updateShopData("state", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    placeholder="10001"
                    value={shopData.postal_code}
                    onChange={(e) =>
                      updateShopData("postal_code", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={shopData.phone}
                      onChange={(e) => updateShopData("phone", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="shop@example.com"
                      value={shopData.email}
                      onChange={(e) => updateShopData("email", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Complete */}
          {currentStep === 3 && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">You&apos;re all set!</CardTitle>
                <CardDescription className="text-base">
                  Your shop is ready. Here&apos;s what to do next:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                  <h4 className="font-medium">Next steps:</h4>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Add your first product to the catalog</li>
                    <li>Upload product images for virtual try-on</li>
                    <li>Set up your kiosk display</li>
                    <li>Invite your first customer!</li>
                  </ol>
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="px-6 pb-6">
            <div className="flex justify-between gap-4">
              {currentStep > 0 && currentStep < 3 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              {currentStep < 3 && (
                <Button
                  className={cn(currentStep === 0 && "w-full")}
                  onClick={handleNext}
                  disabled={!canProceed() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {currentStep === 2 ? "Creating shop..." : "Loading..."}
                    </>
                  ) : (
                    <>
                      {currentStep === 0 ? "Get Started" : "Continue"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
              {currentStep === 3 && (
                <Button
                  className="w-full"
                  onClick={handleComplete}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finishing up...
                    </>
                  ) : (
                    <>
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
