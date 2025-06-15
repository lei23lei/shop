"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckCircle2, Circle } from "lucide-react";
import { useRegisterMutation } from "@/services/endpoints/account-endpoints";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

type ApiError = {
  data?: {
    error?: string;
  };
};

const formSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: "Password must contain at least one letter and one number.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegForm() {
  const router = useRouter();
  const { login, isLoading: isAuthLoading } = useAuth();
  const [register, { isLoading }] = useRegisterMutation();
  const [countdown, setCountdown] = useState(3);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccess && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isSuccess && countdown === 0) {
      router.push("/");
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSuccess, countdown, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const hasMinLength = password?.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password || "");
  const hasNumber = /\d/.test(password || "");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await register({
        email: values.email,
        password: values.password,
      }).unwrap();

      await login(values.email, values.password);
      setIsSuccess(true);
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.data?.error || "Registration failed. Please try again.";
      form.setError("email", {
        type: "manual",
        message: errorMessage,
      });
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col -mt-10 items-center justify-center min-h-[300px] space-y-4">
        <CheckCircle2 className="h-8 w-8 md:h-10 md:w-10 text-green-500 animate-pulse" />
        <h2 className="text-xl md:text-2xl font-bold text-green-600">
          Registration Successful!
        </h2>
        <p className="text-muted-foreground">
          Redirecting to home page in {countdown} seconds...
        </p>
      </div>
    );
  }

  return (
    <Card className="w-[90%] md:w-full  max-w-md">
      <CardHeader className="space-y-1 px-0">
        <CardTitle className="text-xl md:text-2xl  font-bold text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center px-4">
          Enter your email and password to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm text-muted-foreground">
              Password must:
              <ul className="mt-1 space-y-1">
                <li className="flex items-center gap-2">
                  {hasMinLength ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                  <span
                    className={
                      hasMinLength ? "text-green-500" : "text-gray-400"
                    }
                  >
                    Be at least 8 characters long
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {hasLetter ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                  <span
                    className={hasLetter ? "text-green-500" : "text-gray-400"}
                  >
                    Contain at least one letter
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {hasNumber ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                  <span
                    className={hasNumber ? "text-green-500" : "text-gray-400"}
                  >
                    Contain at least one number
                  </span>
                </li>
              </ul>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isAuthLoading || isLoading}
            >
              {isAuthLoading || isLoading
                ? "Creating account..."
                : "Create account"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
