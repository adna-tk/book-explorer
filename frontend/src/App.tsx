import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { MainLayout } from "./MainLayout";
import { AuthLayout } from "./AuthLayout";
import { Loader } from "./components/Loader";

const BookDetails = lazy(() => import("./pages/BookDetails").then(module => ({ default: module.BookDetails })));

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route 
            path="/book/:id" 
            element={
              <Suspense fallback={<Loader />}>
                <BookDetails />
              </Suspense>
            } 
          />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
