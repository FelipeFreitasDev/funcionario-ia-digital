import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useState } from "react";
import { useWorker } from "@/hooks/useWorker";
import { RecommendationNotificationQueue } from "@/components/RecommendationNotification";
import Home from "./pages/Home";
import CreativeStudioUI from "@/pages/CreativeStudioUI";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import Download from "./pages/Download";
import Success from "./pages/Success";
import PinterestIntegration from "./pages/PinterestIntegration";
import EcommerceHub from "./pages/EcommerceHub";
import CreativeStudio from "./pages/CreativeStudio";
import CreativeStudioTest from "./pages/CreativeStudioTest";
import OnlineStore from "./pages/OnlineStore";

function RouterWithNotifications() {
  const { recommendations, dismissRecommendation } = useWorker();
  const [dismissedRecs, setDismissedRecs] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    dismissRecommendation(id);
    setDismissedRecs([...dismissedRecs, id]);
  };

  const visibleRecs = recommendations.filter((r: any) => !dismissedRecs.includes(r.id));

  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/download" component={Download} />
        <Route path="/success" component={Success} />
        <Route path="/pinterest" component={PinterestIntegration} />
        <Route path="/ecommerce" component={EcommerceHub} />
        <Route path="/creative-studio" component={CreativeStudio} />
        <Route path="/creative-studio-ui" component={CreativeStudioUI} />
        <Route path="/analytics" component={AnalyticsDashboard} />
        <Route path="/creative-studio-test" component={CreativeStudioTest} />
        <Route path="/online-store" component={OnlineStore} />
        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>

      {/* Notification Queue - Não bloqueia o trabalho */}
      <RecommendationNotificationQueue
        recommendations={visibleRecs}
        onDismiss={handleDismiss}
      />
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <RouterWithNotifications />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
