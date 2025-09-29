import { useState } from "react";
import api from "../../lib/api/ApiClient";
import useAuthStore from "../../lib/Store/authStore";
import { useMutation } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Edit, EditIcon, Loader } from "lucide-react";
import { toast } from "sonner";

export const Profile = () => {
  const { user, setAuth } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // TODO: Mutation: upload profile image
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file selected");
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload success:", data);
      return data;
    },
  });

  // TODO: Mutation: update user info
  // update user info mutation
const updateMutation = useMutation({
  mutationFn: async ({ name, email, profile }) => {
    const { data } = await api.put(`/users/${user._id}`, {
      name,
      email,
      profile,
    });
    console.log("Update success:", data);
    return data;
  },
});


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     setIsSaving(true);
//     let updatedUser = user;

//     // Upload profile
//     if (file) {
//       const uploadRes = await uploadMutation.mutateAsync();
//       updatedUser = uploadRes.user;
//     }

//     // Name/email changed (with or without file)
//     if (name !== user.name || email !== user.email) {
//       updatedUser = await updateMutation.mutateAsync({
//         name,
//         email,
//         profile: updatedUser.profile
//       });
//     }

//     // Save in auth store
//     setAuth(updatedUser, useAuthStore.getState().token);
//     setFile(null);
//     setIsEditing(false);

//     toast.success("Profile updated successfully");
//     console.log("Final updated user:", updatedUser);
//   } catch (err) {
//     console.error("Profile update failed:", err);
//     toast.error("Failed to update profile");
//   } finally {
//     setIsSaving(false);
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();

  // check if anything changed
  const hasFile = !!file;
  const hasNameChanged = name !== user.name;
  const hasEmailChanged = email !== user.email;

  if (!hasFile && !hasNameChanged && !hasEmailChanged) {
    toast.info("No changes to update");
    setIsEditing(false);
    return;
  }

  try {
    setIsSaving(true);
    let updatedUser = user;

    // upload profile if new file selected
    if (hasFile) {
      const uploadRes = await uploadMutation.mutateAsync();
      updatedUser = uploadRes.user;
    }

    // update name/email (always pass latest profile url)
    if (hasNameChanged || hasEmailChanged) {
      const updateRes = await updateMutation.mutateAsync({
        name,
        email,
        profile: updatedUser.profile,
      });
      updatedUser = updateRes.user;
    }

    // update auth store
    setAuth(updatedUser, useAuthStore.getState().token);
    setFile(null);
    setIsEditing(false);

    toast.success("Profile updated successfully");
    console.log("Final updated user:", updatedUser);
  } catch (err) {
    console.error("Profile update failed:", err);
    toast.error("Failed to update profile");
  } finally {
    setIsSaving(false);
  }
};


  const handleDiscard = () => {
    setName(user.name);
    setFile(null);
    setIsEditing(false);
    toast.info("Changes discarded");
  };

  if (!user)
    return (
      <div className="flex h-screen justify-center items-center">
        <Loader size={30} className="animate-spin" />
      </div>
    );

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto p-6 shadow-md rounded">
        <CardHeader className="flex flex-col items-start gap-2">
          <CardTitle className="text-xl font-semibold">Your Profile</CardTitle>
          <p className="text-sm text-gray-500">
            Last edit on {new Date().toLocaleDateString()}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Profile Avatar with Camera Icon */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-35 h-35 border">
                  <AvatarImage
                    src={file ? URL.createObjectURL(file) : user.profile}
                    alt="Profile"
                  />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <label
                      htmlFor="fileInput"
                      className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer">
                      <Camera className="w-8 h-8 text-blue-500" />
                    </label>
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files[0] || null)}
                    />
                  </>
                )}
              </div>

              <div className="w-full flex flex-col gap-3 flex-1">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Username
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email
                  </label>
                  <Input value={email} disabled className="bg-gray-100" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              {!isEditing ? (
                <Button type="button" className="cursor-pointer" onClick={() => setIsEditing(true)}>
                    Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={handleDiscard}>
                    Discard
                  </Button>
                  <Button type="submit" className="cursor-pointer" disabled={isSaving}>
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <Loader className="animate-spin w-4 h-4" />
                        Saving...
                      </span>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
