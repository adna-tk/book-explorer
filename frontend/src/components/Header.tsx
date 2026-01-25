import React, { useEffect, useState } from "react";
import { Sun, Moon, LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { useAuth } from "../hooks/useAuth";
import { useCurrentUser } from "../hooks/useCurrentUser";

export const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(
    () => localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { data: user } = useCurrentUser();

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <header className="border-b border-secondary/30 p-4">
      <div className="mx-auto max-w-7xl w-full flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary cursor-pointer" onClick={() => navigate('/')}>
          Book Explorer
        </h1>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="secondary"
            className="rounded-full p-2"
            icon={darkMode ? <Sun size={20} /> : <Moon size={20} />}
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Toggle theme"
          />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-secondary text-sm sm:text-base hidden sm:inline">
                Hello, <span className="font-semibold">{user.first_name || user.username}</span>
              </span>
              <Button
                variant="secondary"
                className="rounded-3xl text-sm sm:text-base"
                icon={<LogOut size={16} />}
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              className="rounded-3xl text-sm sm:text-base"
              icon={<LogIn size={16} />}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
