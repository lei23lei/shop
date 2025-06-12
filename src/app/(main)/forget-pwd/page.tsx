"use client";

import React from "react";
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
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/services/endpoints/account-endpoints";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type ApiError = {
  data?: {
    error?: string;
  };
};

export default function ForGetPwdPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [isSuccess, setIsSuccess] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await forgotPassword({
        email: values.email,
      }).unwrap();

      setIsSuccess(true);
      toast.success("Password reset link has been sent to your email");
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.data?.error || "Failed to send reset link";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="container min-h-[700px] flex items-center justify-center mx-auto p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSuccess ? "Check Your Email" : "Reset Password"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSuccess ? (
              <>
                We&apos;ve sent a password reset link to your email address.
                Please check your inbox and follow the instructions to reset
                your password.
              </>
            ) : (
              "Enter your email address and we&apos;ll send you a link to reset your password"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or try
                again.
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsSuccess(false)}
              >
                Try Again
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
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
