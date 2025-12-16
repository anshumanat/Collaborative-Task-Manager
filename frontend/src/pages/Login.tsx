import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";


const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();
  const navigate = useNavigate();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {/* Email */}
        <div className="mb-4">
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full border p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Backend error */}
        {loginMutation.isError && (
          <p className="text-red-500 text-sm mb-3">
            {(loginMutation.error as Error).message}
          </p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loginMutation.isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

