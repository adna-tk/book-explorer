import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";

export const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-primary">
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
};
