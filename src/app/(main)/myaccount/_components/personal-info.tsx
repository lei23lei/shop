import React, { useState } from "react";
import {
  useGetUserDetailQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
} from "@/services/endpoints/account-endpoints";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PencilLine, CheckCircle2, Circle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/type";

export default function PersonalInfo() {
  const { data, isLoading, error } = useGetUserDetailQuery();
  const [updateUser] = useUpdateUserMutation();
  const [changePassword, { isLoading: isPasswordLoading }] =
    useChangePasswordMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  // Password validation states
  const hasMinLength = passwordData.new_password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(passwordData.new_password);
  const hasNumber = /\d/.test(passwordData.new_password);

  const handleEdit = () => {
    if (data?.user) {
      setFormData({
        first_name: data.user.first_name || "",
        last_name: data.user.last_name || "",
        phone_number: data.user.phone_number || "",
        address: data.user.address || "",
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData).unwrap();
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.data?.error ||
        apiError?.data?.message ||
        apiError?.data?.detail ||
        apiError?.data?.non_field_errors?.[0] ||
        "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user types
    if (passwordError) {
      setPasswordError("");
    }
    if (confirmPasswordError) {
      setConfirmPasswordError("");
    }
    if (newPasswordError) {
      setNewPasswordError("");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmPasswordError("");
    setNewPasswordError("");

    // Validate passwords match
    if (passwordData.new_password !== passwordData.confirm_password) {
      setConfirmPasswordError("New passwords do not match");
      return;
    }

    // Validate password requirements
    if (!hasMinLength || !hasLetter || !hasNumber) {
      setNewPasswordError("Password does not meet requirements");
      return;
    }

    try {
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      }).unwrap();

      // Clear form and show success message
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setIsPasswordChanged(true);
      toast.success("Password changed successfully");
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.data?.error ||
        apiError?.data?.message ||
        apiError?.data?.detail ||
        apiError?.data?.non_field_errors?.[0] ||
        "Failed to change password";
      setPasswordError(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[280px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading personal information. Please try again later.
      </div>
    );
  }

  const user = data?.user;

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg md:text-xl font-semibold">
          Personal Information
        </h3>
        {!isEditing && (
          <Button
            onClick={handleEdit}
            variant="default"
            size="sm"
            className="md:size-default"
          >
            <PencilLine className="w-4 h-4" />
            <span className="hidden md:inline ml-2">Edit</span>
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm ">First Name</Label>
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label className="text-sm ">Last Name</Label>
                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <Label className="text-sm ">Email Address</Label>
                  <Input value={user?.email} disabled className="bg-gray-100" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm ">Phone Number</Label>
                  <Input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label className="text-sm ">Account Type</Label>
                  <Input
                    value={user?.is_superuser ? "Administrator" : "Customer"}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label className="text-sm ">Member Since</Label>
                  <Input
                    value={new Date(
                      user?.created_at || ""
                    ).toLocaleDateString()}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm ">Address</Label>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="min-h-[100px]"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm ">First Name</Label>
                  <p className="font-medium text-sm md:text-base">
                    {user?.first_name || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm ">Last Name</Label>
                  <p className="font-medium text-sm md:text-base">
                    {user?.last_name || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm ">Email Address</Label>
                  <p className="font-medium text-sm md:text-base">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm ">Phone Number</Label>
                  <p className="font-medium text-sm md:text-base">
                    {user?.phone_number || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm ">Account Type</Label>
                  <p className="font-medium text-sm md:text-base">
                    {user?.is_superuser ? "Administrator" : "Customer"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm ">Member Since</Label>
                  <p className="font-medium text-sm md:text-base">
                    {new Date(user?.created_at || "").toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm ">Address</Label>
              <p className="font-medium text-sm md:text-base">
                {user?.address || "Not provided"}
              </p>
            </div>
          </>
        )}
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full max-w-[600px] mt-4 md:mt-6"
      >
        <AccordionItem value="change-password">
          <AccordionTrigger className="hover:no-underline">
            <h4 className="font-semibold text-sm md:text-base">
              Change Password
            </h4>
          </AccordionTrigger>
          <AccordionContent>
            {isPasswordChanged ? (
              <div className="flex flex-col items-center justify-center p-4  md:p-8 gap-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />
                  <h3 className="text-lg md:text-xl font-semibold">
                    Password Changed Successfully
                  </h3>
                </div>
                <p className="text-sm md:text-base text-header-font text-center">
                  Your password has been updated successfully.
                </p>
              </div>
            ) : (
              <div className="flex flex-row items-start md:items-center justify-between gap-4 md:gap-8">
                <form
                  onSubmit={handlePasswordSubmit}
                  className="flex flex-col w-full md:w-[300px] p-2 gap-4"
                >
                  <div>
                    <Label className="text-sm ">Current Password</Label>
                    <Input
                      type="password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      required
                      className={`${passwordError ? "border-red-500" : ""}`}
                    />
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-1">
                        {passwordError}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm ">New Password</Label>
                    <Input
                      type="password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      required
                      className={`${newPasswordError ? "border-red-500" : ""}`}
                    />
                    {newPasswordError && (
                      <p className="text-sm text-red-500 mt-1">
                        {newPasswordError}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm ">Confirm New Password</Label>
                    <Input
                      type="password"
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      required
                      className={`${
                        confirmPasswordError ? "border-red-500" : ""
                      }`}
                    />
                    {confirmPasswordError && (
                      <p className="text-sm text-red-500 mt-1">
                        {confirmPasswordError}
                      </p>
                    )}
                  </div>
                  <div className=" flex flex-col md:hidden gap-2 w-full md:w-auto">
                    <h4 className="font-medium text-sm md:text-base">
                      Password Requirements:
                    </h4>
                    <ul className="space-y-2 text-sm text-header-font">
                      <li className="flex items-center gap-2">
                        {hasMinLength ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                        At least 8 characters
                      </li>
                      <li className="flex items-center gap-2">
                        {hasLetter ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                        Contains letters
                      </li>
                      <li className="flex items-center gap-2 text-header-font">
                        {hasNumber ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                        Contains numbers
                      </li>
                    </ul>
                  </div>
                  <Button
                    type="submit"
                    className="w-full md:w-fit mt-2"
                    disabled={isPasswordLoading}
                  >
                    {isPasswordLoading ? "Changing..." : "Change Password"}
                  </Button>
                </form>
                <div className=" hidden md:flex flex-col gap-2 w-full md:w-auto">
                  <h4 className="font-medium text-sm md:text-base">
                    Password Requirements:
                  </h4>
                  <ul className="space-y-2 text-sm text-header-font">
                    <li className="flex items-center gap-2">
                      {hasMinLength ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      {hasLetter ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                      Contains letters
                    </li>
                    <li className="flex items-center gap-2">
                      {hasNumber ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                      Contains numbers
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
