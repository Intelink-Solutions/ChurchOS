import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, type AuthUser } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getApiErrorMessage, isApiStatus } from "@/lib/api/errorHandling";
import { getCurrentUserProfile, updateUser, resolveCurrentUserIdFromToken } from "@/lib/api/userManagementApi";
import { ApiRequestError } from "@/lib/api/httpClient";
import type { UserProfile } from "@/types/userManagement";
import { Loader2, Mail, Phone, ShieldCheck, UserRound, CalendarClock, Lock, CircleCheck, CircleX } from "lucide-react";
import { toast } from "sonner";

type EditProfileForm = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatarUrl: string;
};

function fallbackProfileFromAuth(user: AuthUser): UserProfile {
  const [firstName = "Member", ...rest] = user.name.split(" ").filter(Boolean);
  const lastName = rest.join(" ");
  const resolvedId = resolveCurrentUserIdFromToken() ?? "";

  return {
    id: resolvedId,
    firstName,
    lastName,
    fullName: user.name,
    email: "-",
    roleCode: user.roleCode,
    status: "ACTIVE",
    emailVerified: false,
    twoFactorEnabled: false,
    createdAt: "",
    updatedAt: "",
  };
}

function isAccessDeniedError(error: unknown) {
  if (isApiStatus(error, 403)) return true;
  if (!(error instanceof ApiRequestError)) return false;

  const message = (error.payload?.message || error.message || "").toLowerCase();
  return message.includes("access denied") || message.includes("forbidden");
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [isLimitedProfile, setIsLimitedProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditProfileForm>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      setIsLoading(true);
      setError("");
      setIsLimitedProfile(false);
      try {
        const response = await getCurrentUserProfile();
        setProfile(response);
      } catch (err) {
        if (isAccessDeniedError(err)) {
          setProfile(fallbackProfileFromAuth(user));
          setIsLimitedProfile(true);
          setError("");
        } else {
          setError(getApiErrorMessage(err, "Unable to load your profile right now."));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  useEffect(() => {
    if (!profile) return;
    setEditForm({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      phoneNumber: profile.phoneNumber ?? "",
      avatarUrl: profile.avatarUrl ?? "",
    });
  }, [profile]);

  const initials = useMemo(() => {
    const source = profile?.fullName || user?.name || "U";
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [profile?.fullName, user?.name]);

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString();
  };

  const handleEditChange = (field: keyof EditProfileForm, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    if (!profile) {
      setIsEditing(false);
      return;
    }

    setEditForm({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      phoneNumber: profile.phoneNumber ?? "",
      avatarUrl: profile.avatarUrl ?? "",
    });
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      toast.error("First name and last name are required.");
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateUser(profile.id, {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        phoneNumber: editForm.phoneNumber.trim() || undefined,
        avatarUrl: editForm.avatarUrl.trim() || undefined,
      });

      setProfile(updated);
      setIsEditing(false);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Unable to update your profile."));
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div className="max-w-md rounded-xl border border-border bg-card p-6">
          <h1 className="text-xl font-semibold">Not logged in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Please <Link to="/login" className="text-primary hover:underline">login</Link> first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <Card className="border-slate-200 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="h-16 w-16 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
                    {initials || "U"}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">{profile?.fullName ?? user.name}</h1>
                  <p className="text-sm text-slate-600">Personal profile and account security</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="bg-slate-800 text-white hover:bg-slate-800">
                      {profile?.roleCode ?? user.roleCode}
                    </Badge>
                    {profile?.status ? <Badge variant="outline">{profile.status}</Badge> : null}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link to="/">Go to Dashboard</Link>
                </Button>
                <Button onClick={logout} variant="outline">Logout</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card className="border-slate-200">
            <CardContent className="flex items-center gap-2 p-6 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading your profile...
            </CardContent>
          </Card>
        ) : null}

        {error ? (
          <Card className="border-red-200 bg-red-50/70">
            <CardContent className="p-6 text-sm text-red-700">{error}</CardContent>
          </Card>
        ) : null}



        {!isLoading && !error && profile ? (
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg">Account Details</CardTitle>
                  {!isEditing && profile.id ? (
                    <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ProfileInput
                        label="First Name"
                        value={editForm.firstName}
                        onChange={(value) => handleEditChange("firstName", value)}
                        required
                      />
                      <ProfileInput
                        label="Last Name"
                        value={editForm.lastName}
                        onChange={(value) => handleEditChange("lastName", value)}
                        required
                      />
                    </div>

                    <ProfileInput
                      label="Phone Number"
                      value={editForm.phoneNumber}
                      onChange={(value) => handleEditChange("phoneNumber", value)}
                      placeholder="+234 800 000 0000"
                    />

                    <ProfileInput
                      label="Avatar URL"
                      value={editForm.avatarUrl}
                      onChange={(value) => handleEditChange("avatarUrl", value)}
                      placeholder="https://..."
                    />

                    <div className="flex gap-2">
                      <Button type="button" onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <DetailRow icon={<UserRound className="h-4 w-4" />} label="Full name" value={profile.fullName} />
                    <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={profile.email} />
                    <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone" value={profile.phoneNumber || "-"} />
                    <DetailRow icon={<ShieldCheck className="h-4 w-4" />} label="Role" value={profile.roleCode} />
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Security & Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <DetailRow
                  icon={profile.emailVerified ? <CircleCheck className="h-4 w-4 text-emerald-600" /> : <CircleX className="h-4 w-4 text-amber-600" />}
                  label="Email verification"
                  value={profile.emailVerified ? "Verified" : "Not verified"}
                />
                <DetailRow
                  icon={profile.twoFactorEnabled ? <Lock className="h-4 w-4 text-emerald-600" /> : <Lock className="h-4 w-4 text-slate-500" />}
                  label="Two-factor authentication"
                  value={profile.twoFactorEnabled ? "Enabled" : "Disabled"}
                />
                <DetailRow icon={<CalendarClock className="h-4 w-4" />} label="Last login" value={formatDate(profile.lastLoginAt)} />
                <DetailRow icon={<CalendarClock className="h-4 w-4" />} label="Created at" value={formatDate(profile.createdAt)} />
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
      <div className="mt-0.5 text-slate-500">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-300"
      />
    </label>
  );
}
