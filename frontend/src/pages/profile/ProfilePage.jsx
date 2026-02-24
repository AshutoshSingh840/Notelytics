import React, { useEffect, useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import authService from "../../services/authService.js";
import { useAuth } from "../../context/auth-context.js";
import Spinner from "../../component/common/Spinner.jsx";

const ProfilePage = () => {
  const { updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getUserProfile();
        const data = response?.data || {};

        setProfileForm({
          username: data.username || "",
          email: data.email || "",
        });
      } catch (error) {
        toast.error(error?.details?.error || error?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (key, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePasswordChange = (key, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!profileForm.username.trim() || !profileForm.email.trim()) {
      toast.error("Username and email are required.");
      return;
    }

    try {
      setSavingProfile(true);
      const response = await authService.updateUserProfile({
        username: profileForm.username.trim(),
        email: profileForm.email.trim(),
      });

      const updatedUser = response?.data || {};
      updateUser({
        username: updatedUser.username,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
      });

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmNewPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    try {
      setChangingPassword(true);
      await authService.changeUserPassword({
        currentPassword,
        newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      toast.success("Password changed successfully.");
    } catch (error) {
      toast.error(error?.details?.error || error?.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Profile Settings</h1>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="mb-5 text-xl sm:text-2xl font-semibold text-slate-900">User Information</h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm sm:text-base font-medium text-slate-700">Username</label>
            <div className="flex h-11 sm:h-12 items-center rounded-xl border border-slate-300 bg-white px-4">
              <User className="mr-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => handleProfileChange("username", e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm sm:text-base font-medium text-slate-700">Email Address</label>
            <div className="flex h-11 sm:h-12 items-center rounded-xl border border-slate-300 bg-white px-4">
              <Mail className="mr-3 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex h-11 sm:h-12 items-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 sm:px-6 text-sm sm:text-base font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.3)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="mb-5 text-xl sm:text-2xl font-semibold text-slate-900">Change Password</h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm sm:text-base font-medium text-slate-700">Current Password</label>
            <div className="flex h-11 sm:h-12 items-center rounded-xl border border-slate-300 bg-white px-4">
              <Lock className="mr-3 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm sm:text-base font-medium text-slate-700">New Password</label>
            <div className="flex h-11 sm:h-12 items-center rounded-xl border border-slate-300 bg-white px-4">
              <Lock className="mr-3 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm sm:text-base font-medium text-slate-700">Confirm New Password</label>
            <div className="flex h-11 sm:h-12 items-center rounded-xl border border-slate-300 bg-white px-4">
              <Lock className="mr-3 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={passwordForm.confirmNewPassword}
                onChange={(e) => handlePasswordChange("confirmNewPassword", e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex h-11 sm:h-12 items-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 sm:px-6 text-sm sm:text-base font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.3)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;
