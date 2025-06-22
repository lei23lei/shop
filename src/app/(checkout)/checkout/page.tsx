"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./_components/progress-bar";
import StepOne from "./_components/step-one";
import StepTwo from "./_components/step-two";
import StepThree from "./_components/step-three";
import { CartSummary } from "./_components/cart-summary";
import { useGetCartQuery } from "@/services/endpoints/account-endpoints";
import { useAuth } from "@/contexts/auth-context";
import { CreateOrderResponse } from "@/services/endpoints/account-endpoints";
import LoadingPage from "@/components/loading/loading-page";
import { CheckoutFormData } from "./_components/schemas";
import { getLocalCart, LocalCartItem } from "@/lib/cart-utils";

// API cart item interface
interface ApiCartItem {
  id: number;
  cart_item_id: number;
  name: string;
  price: string;
  quantity: number;
  image_url: string | null;
  categories: string | null;
  size: string;
  total_available: number;
}

// Unified cart data interface
interface UnifiedCartData {
  cart_id: number | string;
  items: LocalCartItem[] | ApiCartItem[];
  total_items: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);
  const [formData, setFormData] = useState<CheckoutFormData>({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    shipping_email: user?.email ?? "",
    shipping_phone: user?.phone_number ?? "",
    shipping_address: user?.address ?? "",
    city: "",
    zip_code: "",
  });

  // API cart data for logged-in users
  const { data: apiCartData, isLoading: isCartLoading } = useGetCartQuery(
    undefined,
    {
      skip: !user,
    }
  );

  // Local cart data for guest users
  const [localCartData, setLocalCartData] = useState<UnifiedCartData | null>(
    null
  );

  // Determine which cart data to use
  const cartData = user ? apiCartData : localCartData;
  const isCartLoadingForUser = user ? isCartLoading : false;

  useEffect(() => {
    if (!user) {
      const localCart = getLocalCart();
      setLocalCartData(localCart);
    }
  }, [user]);

  // Separate useEffect for redirect logic to avoid infinite loops
  useEffect(() => {
    if (!user && localCartData) {
      if (!localCartData.items || localCartData.items.length === 0) {
        console.log("no local cart data");
        router.push("/");
      }
    } else if (user && apiCartData) {
      if (!apiCartData.items || apiCartData.items.length === 0) {
        console.log("no api cart data");
        router.push("/");
      }
    }
  }, [user, localCartData, apiCartData, router]);

  // Show loading state while checking auth or loading cart
  if (isAuthLoading || isCartLoadingForUser) {
    return <LoadingPage />;
  }

  // If no cart data, don't render anything (will redirect)
  if (!cartData) {
    return null;
  }

  const totalPrice =
    cartData?.items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    ) ?? 0;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            onNext={() => setCurrentStep(2)}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <StepTwo
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            formData={formData}
            cartId={user ? (cartData?.cart_id as number) : 0}
            setOrderData={setOrderData}
            isGuestUser={!user}
            cartData={cartData}
          />
        );
      case 3:
        if (!orderData) return null;
        return <StepThree orderData={orderData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ProgressBar currentStep={currentStep} />
      <div className="flex flex-col-reverse md:flex-row mt-14 items-start justify-center gap-4 md:gap-10">
        <div className="w-full md:w-[600px]">{renderStep()}</div>
        {currentStep !== 3 && (
          <CartSummary cartData={cartData} totalPrice={totalPrice} />
        )}
      </div>
    </div>
  );
}
