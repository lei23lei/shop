"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { useResetPasswordMutation } from "@/services/endpoints/account-endpoints";
import { toast } from "sonner";

const formSchema = z
  .object({
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

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset password link");
      router.push("/login");
    }
  }, [token, router]);

  const password = form.watch("password");
  const hasMinLength = password?.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password || "");
  const hasNumber = /\d/.test(password || "");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      toast.error("Invalid reset password link");
      return;
    }

    try {
      await resetPassword({
        token,
        new_password: values.password,
      }).unwrap();

      toast.success("Password has been reset successfully");
      router.push("/login");
    } catch (error: any) {
      const errorMessage = error?.data?.error || "Failed to reset password";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="container min-h-[700px] flex items-center justify-center mx-auto p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your new password"
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
                        placeholder="Confirm your new password"
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
              <div className="text-center text-sm">
                <Button
                  variant="link"
                  onClick={() => router.push("/login")}
                  className="text-muted-foreground"
                >
                  Back to Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
