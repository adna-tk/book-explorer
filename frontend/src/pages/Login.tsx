import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/Button";
import { LogIn, Home } from "lucide-react";
import { Input } from "../components/Input";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuth();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
        } catch (err) {
            // Error is handled by useAuth hook
        }
    };

    return (
        <div className="w-full bg-primary min-h-screen flex items-center justify-center gap-x-10 px-4">
            <div className="max-w-1/2 w-full">
                <div className="max-w-md gap-5 flex flex-col items-center mx-auto">
                    <Button
                        variant="secondary"
                        icon={<Home size={16} />}
                        onClick={() => navigate("/")}
                        className="self-center mb-4"
                    >
                        Back to Books
                    </Button>
                    
                    <div className="flex flex-col items-center mb-6 sm:mb-10">
                        <p className="text-muted text-xs sm:text-sm mb-2 uppercase">Welcome to</p>
                        <p className="text-4xl sm:text-5xl md:text-6xl font-bold mb-0 text-accent">Book Explorer</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Username"
                            {...register("username")}
                            disabled={isLoading}
                            error={errors.username?.message}
                        />
                        <Input
                            label="Password"
                            type="password"
                            {...register("password")}
                            disabled={isLoading}
                            error={errors.password?.message}
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            icon={<LogIn size={16} />}
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>

                    <div className="mt-4 text-xs sm:text-sm text-muted text-center">
                        <p>Test users:</p>
                        <p className="wrap-break-word">john.doe@mail.com / JohnDoe123</p>
                        <p className="wrap-break-word">jane.doe@mail.com / JaneJane123</p>
                    </div>
                </div>
            </div>
            <div className="hidden h-screen w-1/2 bg-[url('/src/assets/books-bg.jpg')] bg-cover bg-center md:block" />
        </div>
    );
};
