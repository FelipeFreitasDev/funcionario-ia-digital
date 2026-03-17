import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useState } from "react";
import { useWorker } from "@/hooks/useWorker";
import { RecommendationNotificationQueue } from "@/components/RecommendationNotification";
import Home from "./pages/Home";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import Download from "./pages/Download";
import Success from "./pages/Success";
import PinterestIntegration from "./pages/PinterestIntegration";
import EcommerceHub from "./pages/EcommerceHub";
import CreativeStudioTest from "@/pages/CreativeStudioTest";
import CreativeStudioUI from "@/pages/CreativeStudioUI";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import OnlineStore from "./pages/OnlineStore";
import WorkerControl from "./pages/WorkerControl";
import Onboarding from "./pages/Onboarding";
import MultiTenantDashboard from "./pages/MultiTenantDashboard";
import Settings from "./pages/Settings";
import PlanConfiguration from "./pages/PlanConfiguration";
import IntegrationSetup from "./pages/IntegrationSetup";
import VerifyEmail from "./pages/VerifyEmail";
import DeploymentGuide from "./pages/DeploymentGuide";

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
        <Route path="/analytics" component={AnalyticsDashboard} />
        <Route path="/creative-studio-test" component={CreativeStudioTest} />
        <Route path="/creative-studio-ui" component={CreativeStudioUI} />
        <Route path="/checkout-success" component={CheckoutSuccess} />
        <Route path="/online-store" component={OnlineStore} />
            <Route path="/settings" component={Settings} />
        <Route path="/worker-control" component={WorkerControl} />
        <Route path="/multi-tenant-dashboard" component={MultiTenantDashboard} />
        <Route path="/plan-configuration" component={PlanConfiguration} />
        <Route path="/integration-setup" component={IntegrationSetup} />
        <Route path="/verify-email" component={VerifyEmail} />
        <Route path="/deployment-guide" component={DeploymentGuide} />
        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>

      {/* Recommendation Notifications */}
      <RecommendationNotificationQueue
        recommendations={visibleRecs}
        onDismiss={handleDismiss}
      />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <RouterWithNotifications />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
