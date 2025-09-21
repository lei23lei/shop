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
import { ApiError } from "@/lib/type";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function ForGetPwdPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [formError, setFormError] = React.useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setFormError(""); // Clear any previous errors
      await forgotPassword({
        email: values.email,
      }).unwrap();

      setIsSuccess(true);
      toast.success("Password reset link has been sent to your email");
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.data?.error ||
        apiError?.data?.message ||
        apiError?.data?.detail ||
        apiError?.data?.non_field_errors?.[0] ||
        "Failed to send reset link";
      setFormError(errorMessage);
    }
  }

  return (
    <div className="container min-h-[700px] flex items-center justify-center mx-auto p-4">
      <Card className="w-full liquid-glass-heavy max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSuccess ? "Check Your Email" : "Reset Password"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSuccess ? (
              <>
                We&apos;ve sent a password reset link to your email address.
                Please check your inbox and follow the instructions to reset
                your password. It may take up to 5 minutes for the email to
                arrive.
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
                variant="glass"
                className="w-full"
                onClick={() => setIsSuccess(false)}
              >
                <p className="text-foreground">Try Again</p>
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
                {formError && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                    {formError}
                  </div>
                )}
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
                <Button
                  type="submit"
                  variant="glass"
                  className="w-full"
                  disabled={isLoading}
                >
                  <p className="text-foreground">
                    {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                  </p>
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
