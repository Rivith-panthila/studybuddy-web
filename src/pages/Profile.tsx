
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  FileText,
  Image,
  Save,
  Loader2,
  Camera,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getUserProfile, updateProfile } from "../service/auth";

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  profileImage: string;
}

function Profile() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    bio: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load existing profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setError("Please login to view your profile.");
          return;
        }

        const response = await getUserProfile(token);
        const user = response.user ?? response;

        setProfile({
          name: user.name ?? "",
          email: user.email ?? "",
          bio: user.bio ?? "",
          profileImage: user.profileImage ?? "",
        });
      } catch {
        setError("Unable to load profile. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Handle text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle image selection from desktop
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      e.target.value = "";
      return;
    }

    // Maximum image size: 1 MB
    if (file.size > 1024 * 1024) {
      setError("Image must be smaller than 1 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("Unable to read the selected image.");
        return;
      }

      setProfile((prev) => ({
        ...prev,
        profileImage: reader.result as string,
      }));
    };

    reader.onerror = () => {
      setError("Failed to read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  // Save profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await updateProfile({
        name: profile.name,
        bio: profile.bio,
        profileImage: profile.profileImage,
      });

      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7F0] flex items-center justify-center text-[#374638]">
        <Loader2 className="animate-spin mr-2 text-[#718B68]" />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F0] text-[#374638] p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm text-[#718B68] font-semibold mb-2">
            ACCOUNT SETTINGS
          </p>

          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

          <p className="text-[#879183] mt-2">
            Manage your personal information.
          </p>
        </div>

        <div className="bg-white border border-[#E5EBDD] rounded-2xl p-6 md:p-8 shadow-sm">

          {/* Profile image and user details */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
            <div className="relative w-24 h-24 rounded-full bg-[#DCE8D5] flex items-center justify-center overflow-hidden shrink-0 border-4 border-[#F0F4EB]">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-[#718B68]" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#374638]">
                {profile.name || "Your Name"}
              </h2>

              <p className="text-[#879183] text-sm mt-1">
                {profile.email}
              </p>

              <p className="text-xs text-[#A0AA9A] mt-2">
                StudyBuddy Member
              </p>
            </div>
          </div>

          {/* Success message */}
          {message && (
            <div className="flex items-center gap-2 bg-[#EAF2E5] border border-[#DCE8D5] text-[#526D4D] p-3 rounded-xl mb-5">
              <CheckCircle2 size={18} />
              <p>{message}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 bg-[#F9EEEA] border border-[#F0D9D2] text-[#B56D62] p-3 rounded-xl mb-5">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full name */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-2 font-semibold text-[#526052]">
                <User size={16} className="text-[#718B68]" />
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                className="w-full bg-[#FAFBF8] border border-[#E5EBDD] rounded-xl px-4 py-3 outline-none text-[#374638] placeholder:text-[#A5ADA1] focus:border-[#718B68] focus:ring-2 focus:ring-[#DCE8D5] transition"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-2 font-semibold text-[#526052]">
                <Mail size={16} className="text-[#718B68]" />
                Email Address
              </label>

              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full bg-[#F0F2ED] border border-[#E5EBDD] rounded-xl px-4 py-3 text-[#879183] cursor-not-allowed"
              />

              <p className="text-xs text-[#879183] mt-2">
                Email address cannot be changed here.
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-2 font-semibold text-[#526052]">
                <FileText size={16} className="text-[#718B68]" />
                Bio
              </label>

              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                maxLength={300}
                className="w-full bg-[#FAFBF8] border border-[#E5EBDD] rounded-xl px-4 py-3 outline-none text-[#374638] placeholder:text-[#A5ADA1] focus:border-[#718B68] focus:ring-2 focus:ring-[#DCE8D5] resize-none transition"
                placeholder="Write something about yourself..."
              />

              <p className="text-xs text-[#879183] text-right mt-1">
                {profile.bio.length}/300 characters
              </p>
            </div>

            {/* Profile photo upload */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-2 font-semibold text-[#526052]">
                <Image size={16} className="text-[#718B68]" />
                Profile Photo
              </label>

              <div className="border border-[#E5EBDD] bg-[#FAFBF8] rounded-xl p-4">
                <label className="flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer">
                  <span className="w-11 h-11 rounded-xl bg-[#EAF2E5] flex items-center justify-center shrink-0">
                    <Camera className="text-[#718B68]" />
                  </span>

                  <span className="flex-1">
                    <span className="block font-semibold text-sm text-[#374638]">
                      Choose a profile photo
                    </span>
                    <span className="block text-xs text-[#879183] mt-1">
                      Select an image from your computer.
                    </span>
                  </span>

                  <span className="bg-[#DCE8D5] text-[#526D4D] px-4 py-2 rounded-lg text-sm font-semibold">
                    Browse
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="text-xs text-[#879183] mt-2">
                Supported image files. Maximum size: 1 MB.
              </p>

              {profile.profileImage && (
                <button
                  type="button"
                  onClick={() => {
                    setProfile((prev) => ({
                      ...prev,
                      profileImage: "",
                    }));
                    setMessage("");
                    setError("");
                  }}
                  className="text-sm text-[#B56D62] hover:text-[#984F45] mt-3 font-medium transition"
                >
                  Remove profile photo
                </button>
              )}
            </div>

            {/* Save button */}
            <div className="pt-3 border-t border-[#E5EBDD]">
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#718B68] hover:bg-[#5F7957] text-white disabled:opacity-50 px-7 py-3 rounded-xl font-semibold transition shadow-sm"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
