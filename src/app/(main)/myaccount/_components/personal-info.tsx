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
import {
  PencilLine,
  ChevronDown,
  CheckCircle2,
  Circle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PersonalInfo() {
  const { data, isLoading, error } = useGetUserDetailQuery();
  const [updateUser] = useUpdateUserMutation();
  const [changePassword] = useChangePasswordMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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
    } catch (error) {
      console.error("Failed to update user:", error);
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
    } catch (error: any) {
      setPasswordError(error.data?.error || "Failed to change password");
    }
  };

  const handleCloseSuccess = () => {
    setIsPasswordChanged(false);
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
        <h3>Personal Information</h3>
        {!isEditing && (
          <Button onClick={handleEdit} variant="default">
            <PencilLine className="w-4 h-4" />
            Edit
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">First Name</label>
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Last Name</label>
                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email Address</label>
                  <Input value={user?.email} disabled className="bg-gray-100" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <Input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Account Type</label>
                  <Input
                    value={user?.is_superuser ? "Administrator" : "Customer"}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Member Since</label>
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
              <label className="text-sm text-gray-500">Address</label>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">First Name</label>
                  <p className="font-medium">
                    {user?.first_name || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Last Name</label>
                  <p className="font-medium">
                    {user?.last_name || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email Address</label>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <p className="font-medium">
                    {user?.phone_number || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Account Type</label>
                  <p className="font-medium">
                    {user?.is_superuser ? "Administrator" : "Customer"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Member Since</label>
                  <p className="font-medium">
                    {new Date(user?.created_at || "").toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Address</label>
              <p className="font-medium">{user?.address || "Not provided"}</p>
            </div>
          </>
        )}
      </div>
      <Accordion type="single" collapsible className="w-[600px]">
        <AccordionItem value="change-password">
          <AccordionTrigger className="hover:no-underline">
            <h4 className="font-semibold">Change Password</h4>
          </AccordionTrigger>
          <AccordionContent>
            {isPasswordChanged ? (
              <div className="flex flex-col items-center justify-center p-8 gap-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-8 h-8" />
                  <h3 className="text-xl font-semibold">
                    Password Changed Successfully
                  </h3>
                </div>
                <p className="text-gray-600">
                  Your password has been updated successfully.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <form
                  onSubmit={handlePasswordSubmit}
                  className="flex flex-col w-[300px] p-2 gap-4"
                >
                  <div>
                    <label className="text-sm text-gray-500">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      required
                      className={passwordError ? "border-red-500" : ""}
                    />
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-1">
                        {passwordError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      New Password
                    </label>
                    <Input
                      type="password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      required
                      className={newPasswordError ? "border-red-500" : ""}
                    />
                    {newPasswordError && (
                      <p className="text-sm text-red-500 mt-1">
                        {newPasswordError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      required
                      className={confirmPasswordError ? "border-red-500" : ""}
                    />
                    {confirmPasswordError && (
                      <p className="text-sm text-red-500 mt-1">
                        {confirmPasswordError}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-fit mt-2">
                    Change Password
                  </Button>
                </form>
                <div className="flex flex-col gap-2">
                  <h4 className="font-medium">Password Requirements:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
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
