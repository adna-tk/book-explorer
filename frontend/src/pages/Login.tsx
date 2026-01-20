import React from "react";
import { Button } from "../components/Button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full px-4 bg-primary h-screen flex items-center justify-center">
            <Button
                variant="primary"
                className="rounded-3xl w-30"
                icon={<LogIn size={16} />}
                onClick={() => navigate("/login")}
            >
                Login
            </Button>
        </div>
    );
};
