import React, { useState } from "react";
import { Button } from "../components/Button";
import { LogIn } from "lucide-react";
import { Input } from "../components/Input";
import { useAuth } from "../hooks/useAuth";

export const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ username, password });
        } catch (err) { }
    };

    return (
        <div className="w-full bg-primary h-screen flex items-center justify-center gap-x-10">
            <div className="max-w-1/2 w-full">
                <div className="max-w-md gap-5 flex flex-col items-center mx-auto">
                    <div className="flex flex-col items-center mb-10">
                        <p className="text-muted text-sm mb-2 uppercase">Welcome to</p>
                        <p className="text-6xl font-bold mb-0 text-accent">Book Explorer</p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
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

                    <div className="mt-4 text-sm text-muted text-center">
                        <p>Test users:</p>
                        <p>Username: john.doe@mail.com | Password: JohnDoe123</p>
                        <p>Username: jane.doe@mail.com | Password: JaneJane123</p>
                    </div>
                </div>
            </div>
            <div className="hidden h-screen w-1/2 bg-[url('/src/assets/books-bg.jpg')] bg-cover bg-center md:block" />
        </div>
    );
};
