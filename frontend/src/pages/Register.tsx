import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../hooks/useRegister";
import { useNavigate } from "react-router-dom";


const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegister();
  const navigate = useNavigate();


  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        {/* Name */}
        <div className="mb-4">
          <input
            {...register("name")}
            placeholder="Name"
            className="w-full border p-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

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

          {registerMutation.isError && (
            <p className="text-red-500 text-sm mb-3">
              {(registerMutation.error as Error).message}
             </p>
          )}
  

          <button
            type="submit"
            disabled={registerMutation.isLoading}
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
          >
            {registerMutation.isLoading ? "Registering..." : "Register"}
          </button>
          
      </form>
    </div>
  );
}
