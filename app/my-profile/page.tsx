
"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Mail,
  Camera,
  Save,
  Loader2,
  LockKeyhole,
  ChevronDown,
  ChevronUp,
  X,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export default function MyProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  const [hasCredentialAccount, setHasCredentialAccount] = useState(false);
  const [checkingAccounts, setCheckingAccounts] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load the current user's profile information.
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setImage(user.image || "");
    }
  }, [user]);

  // Redirect unauthenticated users to Login.
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  // Check whether the user has an email/password account.
  useEffect(() => {
    let isMounted = true;

    async function checkAccounts() {
      if (!user) return;

      setCheckingAccounts(true);

      try {
        const result = await authClient.listAccounts();

        if (result.error) {
          toast.error("Could not check your login methods.");
          return;
        }

        const hasCredential = result.data?.some(
          (account) => account.providerId === "credential"
        );

        if (isMounted) {
          setHasCredentialAccount(Boolean(hasCredential));
        }
      } catch {
        if (isMounted) {
          toast.error("Could not check your login methods.");
        }
      } finally {
        if (isMounted) {
          setCheckingAccounts(false);
        }
      }
    }

    checkAccounts();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Create and clean up the local image preview.
  useEffect(() => {
    if (!selectedImage) {
      setPreviewImage("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewImage(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  // Validate and select a profile photo from the device.
  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be 10 MB or less.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    toast.success("Image selected. Click Save Changes to upload it.");
    
    // Allow selecting the same file again later.
    event.target.value = "";
  };

  // Remove the newly selected image and restore the saved profile photo.
  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
  };

  // Upload the selected image to ImgBB.
  const uploadProfileImage = async (): Promise<string | null> => {
    if (!selectedImage) return image || null;

    if (!API_URL) {
      toast.error("API URL is not configured.");
      return null;
    }

    const formData = new FormData();
    formData.append("images", selectedImage);

    const response = await fetch(`${API_URL}/api/upload/images`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to upload profile photo.");
    }

    const uploadedImageUrl = result.data?.[0];

    if (!uploadedImageUrl) {
      throw new Error("The uploaded image URL was not returned.");
    }

    return uploadedImageUrl;
  };

  // Update the user's StudioSpace profile.
  const handleUpdateProfile = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    setIsSaving(true);

    try {
      let updatedImage = image || null;

      if (selectedImage) {
        toast.info("Uploading your profile photo...");
        updatedImage = await uploadProfileImage();
      }

      const result = await authClient.updateUser({
        name: name.trim(),
        image: updatedImage,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to update profile.");
        return;
      }

      setImage(updatedImage || "");
      setSelectedImage(null);

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Change the user's email/password account password.
  const handleChangePassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      toast.error("New password must contain an uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      toast.error("New password must contain a lowercase letter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("Your new password must be different.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        toast.error(
          result.error.message || "Failed to change your password."
        );
        return;
      }

      toast.success("Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordFields(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (isPending || !session) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f5f1]">
        <Loader2 className="h-7 w-7 animate-spin text-[#604438]" />
      </main>
    );
  }

  const displayedImage = previewImage || image;

  return (
    <main className="min-h-screen bg-[#f8f5f1] px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-xl border border-[#e8ded5] bg-white shadow-sm">

          {/* Page Header */}
          <div className="bg-[#604438] px-5 py-5 text-white sm:px-7">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <UserRound size={21} />
            </div>

            <h1 className="text-xl font-semibold">My Profile</h1>

            <p className="mt-1.5 text-xs leading-5 text-[#eee2d9] sm:text-sm">
              Manage your personal information and account security.
            </p>
          </div>

          <div className="p-5 sm:p-7">

            {/* Profile Information Form */}
            <form
              id="profile-form"
              onSubmit={handleUpdateProfile}
              className="space-y-4"
            >
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center gap-3 border-b border-[#eee7e1] pb-5">
                <div className="relative">
                  {displayedImage ? (
                    <img
                      src={displayedImage}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="h-20 w-20 rounded-full border-[3px] border-[#eee7e1] object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#604438] text-2xl font-semibold text-white">
                      {name.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#604438] text-white shadow-sm transition hover:bg-[#493329]"
                    title="Upload profile photo"
                  >
                    <Camera size={15} />
                  </label>

                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold text-[#49372e]">
                    Profile Picture
                  </p>

                  <p className="mt-1 text-xs text-[#84776e]">
                    Upload a photo from your device.
                  </p>

                  <p className="mt-1 text-xs text-[#99877b]">
                    Maximum file size: 10 MB
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <label
                    htmlFor="profileImage"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#e4d9d0] bg-[#fdfcfb] px-3.5 py-2 text-xs font-semibold text-[#604438] transition hover:bg-[#f3ece6]"
                  >
                    <Upload size={14} />
                    Choose Photo
                  </label>

                  {selectedImage && (
                    <button
                      type="button"
                      onClick={handleRemoveSelectedImage}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#e4d9d0] px-3 py-2 text-xs font-semibold text-[#84776e] transition hover:bg-[#f3ece6]"
                    >
                      <X size={14} />
                      Remove Selection
                    </button>
                  )}
                </div>

                {selectedImage && (
                  <p className="max-w-full break-all text-center text-xs text-[#604438]">
                    Selected: {selectedImage.name}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-semibold text-[#49372e]"
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99877b]"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-md border border-[#e4d9d0] bg-[#fdfcfb] py-2.5 pl-10 pr-3.5 text-sm text-[#49372e] outline-none transition focus:border-[#604438] focus:ring-2 focus:ring-[#604438]/10"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-[#49372e]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99877b]"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    className="w-full cursor-not-allowed rounded-md border border-[#e4d9d0] bg-[#f2efec] py-2.5 pl-10 pr-3.5 text-sm text-[#84776e] outline-none"
                  />
                </div>

                <p className="mt-1.5 text-xs text-[#99877b]">
                  Your email address cannot be changed here.
                </p>
              </div>
            </form>

            {/* Change Password Section */}
            {checkingAccounts ? (
              <div className="mt-4 flex items-center justify-center border-t border-[#eee7e1] pt-4">
                <Loader2 className="h-4 w-4 animate-spin text-[#604438]" />
                <span className="ml-2 text-xs text-[#76665d]">
                  Checking account settings...
                </span>
              </div>
            ) : hasCredentialAccount ? (
              <section className="mt-4 border-t border-[#eee7e1] pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordFields((previous) => !previous)
                  }
                  className="flex w-full items-center justify-between gap-3 rounded-md border border-[#e4d9d0] bg-[#fdfcfb] p-3 text-left transition hover:border-[#604438]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3ece6] text-[#604438]">
                      <LockKeyhole size={18} />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-[#49372e]">
                        Change Password
                      </h2>

                      <p className="mt-0.5 text-xs text-[#84776e]">
                        Update your account password.
                      </p>
                    </div>
                  </div>

                  {showPasswordFields ? (
                    <ChevronUp
                      size={18}
                      className="shrink-0 text-[#604438]"
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      className="shrink-0 text-[#604438]"
                    />
                  )}
                </button>

                {/* Password Form */}
                {showPasswordFields && (
                  <form
                    onSubmit={handleChangePassword}
                    className="mt-3 space-y-3 rounded-md border border-[#eee7e1] bg-[#fdfcfb] p-3.5 sm:p-4"
                  >
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="mb-1.5 block text-sm font-semibold text-[#49372e]"
                      >
                        Current Password
                      </label>

                      <input
                        id="currentPassword"
                        type="password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(event.target.value)
                        }
                        placeholder="Enter your current password"
                        className="w-full rounded-md border border-[#e4d9d0] bg-white px-3.5 py-2.5 text-sm text-[#49372e] outline-none transition focus:border-[#604438] focus:ring-2 focus:ring-[#604438]/10"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="mb-1.5 block text-sm font-semibold text-[#49372e]"
                      >
                        New Password
                      </label>

                      <input
                        id="newPassword"
                        type="password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(event) =>
                          setNewPassword(event.target.value)
                        }
                        placeholder="Enter your new password"
                        className="w-full rounded-md border border-[#e4d9d0] bg-white px-3.5 py-2.5 text-sm text-[#49372e] outline-none transition focus:border-[#604438] focus:ring-2 focus:ring-[#604438]/10"
                        required
                      />

                      <p className="mt-1.5 text-xs leading-5 text-[#99877b]">
                        At least 6 characters, including uppercase and
                        lowercase letters.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-1.5 block text-sm font-semibold text-[#49372e]"
                      >
                        Confirm New Password
                      </label>

                      <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Confirm your new password"
                        className="w-full rounded-md border border-[#e4d9d0] bg-white px-3.5 py-2.5 text-sm text-[#49372e] outline-none transition focus:border-[#604438] focus:ring-2 focus:ring-[#604438]/10"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#604438] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#493329] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isChangingPassword ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <LockKeyhole size={16} />
                            Update Password
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelPasswordChange}
                        disabled={isChangingPassword}
                        className="flex items-center justify-center gap-2 rounded-md border border-[#e4d9d0] px-4 py-2.5 text-sm font-semibold text-[#604438] transition hover:bg-[#f3ece6] disabled:opacity-60"
                      >
                        <X size={15} />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </section>
            ) : null}

            {/* Save Profile Button */}
            <button
              type="submit"
              form="profile-form"
              disabled={isSaving}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#604438] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#493329] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
