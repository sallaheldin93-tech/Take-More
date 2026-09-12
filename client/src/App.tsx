import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Services from "./pages/Services";

function BrandModeSync() {
  useEffect(() => {
    const mode = localStorage.getItem("take-more-mode") || "blue";
    document.documentElement.dataset.brandMode = mode;
  }, []);
  return null;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/admin" component={Admin} />
      <Route path="/services" component={Services} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><BrandModeSync /><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
