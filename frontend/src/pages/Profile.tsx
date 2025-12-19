import { useForm } from "react-hook-form";
import AppLayout from "../components/AppLayout";
import { useProfile, useUpdateProfile } from "../hooks/useProfile";

type FormData = {
  name: string;
};

export default function Profile() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const { register, handleSubmit, reset } = useForm<FormData>({
    values: {
      name: profile?.name || "",
    },
  });

  /* ---------- Loading Skeleton ---------- */
  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto bg-white border rounded-lg shadow-sm p-6 space-y-4">
          <div className="h-5 bg-gray-300 rounded w-1/2 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </AppLayout>
    );
  }

  const onSubmit = (data: FormData) => {
    updateProfile.mutate(data.name, {
      onSuccess: () => {
        reset({ name: data.name });
      },
    });
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto">
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6">
            My Profile
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                value={profile?.email}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                {...register("name")}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="bg-blue-600 text-white px-5 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
