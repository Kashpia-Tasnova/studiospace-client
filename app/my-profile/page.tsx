
"use client";

import { useEffect, useState, type FormEvent } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function MyProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  const [hasCredentialAccount, setHasCredentialAccount] = useState(false);
  const [checkingAccounts, setCheckingAccounts] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setImage(user.image || "");
    }
  }, [user]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

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
      const result = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

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
        <Loader2 className="h-8 w-8 animate-spin text-[#604438]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5f1] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-[#e8ded5] bg-white shadow-sm">

          {/* Page Header */}
          <div className="bg-[#604438] px-6 py-8 text-white sm:px-10">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
              <UserRound size={28} />
            </div>

            <h1 className="text-2xl font-semibold sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-[#eee2d9]">
              Manage your personal information and account security.
            </p>
          </div>

          <div className="p-6 sm:p-10">

            {/* Profile Information Form */}
            <form
              id="profile-form"
              onSubmit={handleUpdateProfile}
              className="space-y-6"
            >
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-3 border-b border-[#eee7e1] pb-7">
                {image ? (
                  <img
                    src={image}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-[#eee7e1] object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#604438] text-3xl font-semibold text-white">
                    {name.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <p className="text-sm text-[#76665d]">
                  Your profile picture
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#49372e]"
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99877b]"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-[#e4d9d0] bg-[#fdfcfb] py-3 pl-12 pr-4 text-sm text-[#49372e] outline-none transition focus:border-[#604438] focus:ring-2 focus:ring-[#604438]/10"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#49372e]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99877b]"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-[#e4d9d0] bg-[#f2efec] py-3 pl-12 pr-4 text-sm text-[#84776e] outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-[#99877b]">
                  Your email address cannot be changed here.
                </p>
              </div>

              {/* Profile Photo URL */}
              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-semibold text-[#49372e]"
                >
                  Profile Photo URL
                </label>

                <div className="relative">
                  <Camera
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99877b]"
                  />

                  <input
                    id="image"
                    type="url"
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-lg border border-[#e4d9d0] bg-[#fdfcfb] py-3 pl-12 pr-4 text-sm text-[#49372e] outline-none transition focus:border-[#604438] focus:ring-2 focus:ring-[#604438]/10"
                  />
                </div>

                <p className="mt-2 text-xs text-[#99877b]">
                  Paste an image URL to update your profile picture.
                </p>
              </div>
            </form>

            {/* Change Password Section - Outside Profile Form */}
            {checkingAccounts ? (
              <div className="mt-6 flex items-center justify-center border-t border-[#eee7e1] pt-6">
                <Loader2 className="h-5 w-5 animate-spin text-[#604438]" />
                <span className="ml-2 text-sm text-[#76665d]">
                  Checking account settings...
                </span>
              </div>
            ) : hasCredentialAccount ? (
              <section className="mt-6 border-t border-[#eee7e1] pt-6">

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordFields((previous) => !previous)
                  }
                  className="flex w-full items-center justify-between gap-4 rounded-lg border border-[#e4d9d0] bg-[#fdfcfb] p-4 text-left transition hover:border-[#604438]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3ece6] text-[#604438]">
                      <LockKeyhole size={21} />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold text-[#49372e]">
                        Change Password
                      </h2>

                      <p className="mt-1 text-xs text-[#84776e]">
                        Update your account password.
                      </p>
                    </div>
                  </div>

                  {showPasswordFields ? (
                    <ChevronUp
                      size={21}
                      className="shrink-0 text-[#604438]"
                    />
                  ) : (
                    <ChevronDown
                      size={21}
                      className="shrink-0 text-[#604438]"
                    />
                  )}
                </button>

                {/* Password Form */}
                {showPasswordFields && (
                  <form
                    onSubmit={handleChangePassword}
                    className="mt-5 space-y-5 rounded-lg border border-[#eee7e1] bg-[#fdfcfb] p-5 sm:p-6"
                  >
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="mb-2 block text-sm font-semibold text-[#49372e]"
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
                        className="w-full rounded-lg border border-[#e4d9d0] bg-white px-4 py-3 text-sm text-[#49372e] outline-none transition focus:border-[#604438] focus:ring-2 focus:ring-[#604438]/10"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="mb-2 block text-sm font-semibold text-[#49372e]"
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
                        className="w-full rounded-lg border border-[#e4d9d0] bg-white px-4 py-3 text-sm text-[#49372e] outline-none transition focus:border-[#604438] focus:ring-2 focus:ring-[#604438]/10"
                        required
                      />

                      <p className="mt-2 text-xs text-[#99877b]">
                        At least 6 characters, including uppercase and lowercase letters.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-semibold text-[#49372e]"
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
                        className="w-full rounded-lg border border-[#e4d9d0] bg-white px-4 py-3 text-sm text-[#49372e] outline-none transition focus:border-[#604438] focus:ring-2 focus:ring-[#604438]/10"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#604438] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#493329] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isChangingPassword ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <LockKeyhole size={18} />
                            Update Password
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelPasswordChange}
                        disabled={isChangingPassword}
                        className="flex items-center justify-center gap-2 rounded-lg border border-[#e4d9d0] px-5 py-3 text-sm font-semibold text-[#604438] transition hover:bg-[#f3ece6] disabled:opacity-60"
                      >
                        <X size={17} />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </section>
            ) : null}

            {/* Save Profile Button - Connected to Profile Form */}
            <button
              type="submit"
              form="profile-form"
              disabled={isSaving}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#604438] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#493329] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={18} />
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
