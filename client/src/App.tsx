import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
const Admin = lazy(() => import("@/pages/Admin"));
const Services = lazy(() => import("@/pages/Services"));

function RouteLoading() {
  return <div className="route-loading" role="status" aria-live="polite"><span className="route-loading-spinner" />Loading…</div>;
}

function BrandModeSync() {
  useEffect(() => {
    const mode = localStorage.getItem("take-more-mode") || "blue";
    document.documentElement.dataset.brandMode = mode;
  }, []);
  return null;
}

function Router() {
  return <Suspense fallback={<RouteLoading />}><Switch><Route path="/" component={Home} /><Route path="/admin" component={Admin} />
      <Route path="/services" component={Services} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch></Suspense>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><BrandModeSync /><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
