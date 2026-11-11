
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  FileText,
  Image,
  Save,
  Loader2,
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
      <div className="min-h-screen bg-[#080d1b] flex items-center justify-center text-white">
        <Loader2 className="animate-spin mr-2" />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d1b] text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm text-indigo-400 mb-2">
            ACCOUNT SETTINGS
          </p>

          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Manage your personal information.
          </p>
        </div>

        <div className="bg-[#111a2e] border border-gray-800 rounded-2xl p-6 md:p-8">

          {/* Profile image and user details */}
          <div className="flex items-center gap-4 mb-8">

            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={36} />
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {profile.name || "Your Name"}
              </h2>

              <p className="text-gray-400 text-sm">
                {profile.email}
              </p>
            </div>
          </div>

          {/* Success message */}
          {message && (
            <p className="bg-green-500/10 text-green-400 p-3 rounded-lg mb-5">
              {message}
            </p>
          )}

          {/* Error message */}
          {error && (
            <p className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-5">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full name */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-2 text-gray-300">
                <User size={16} />
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                className="w-full bg-[#080d1b] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-2 text-gray-300">
                <Mail size={16} />
                Email Address
              </label>

              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
              />

              <p className="text-xs text-gray-500 mt-2">
                Email address cannot be changed here.
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-2 text-gray-300">
                <FileText size={16} />
                Bio
              </label>

              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                maxLength={300}
                className="w-full bg-[#080d1b] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 resize-none"
                placeholder="Write something about yourself..."
              />
            </div>

            {/* Profile photo upload */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-2 text-gray-300">
                <Image size={16} />
                Profile Photo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-[#080d1b] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white file:cursor-pointer"
              />

              <p className="text-xs text-gray-500 mt-2">
                Choose a photo from your computer. Maximum size: 1 MB.
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
                  className="text-sm text-red-400 hover:text-red-300 mt-3"
                >
                  Remove profile photo
                </button>
              )}
            </div>

            {/* Save button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-6 py-3 rounded-xl font-medium transition"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
