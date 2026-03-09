// Main dashboard page with tabbed navigation for the Zara sales analysis.
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExecutiveSummary from "@/components/tabs/ExecutiveSummary";
import DescriptiveAnalytics from "@/components/tabs/DescriptiveAnalytics";
import ModelPerformance from "@/components/tabs/ModelPerformance";
import Explainability from "@/components/tabs/Explainability";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation bar with project title */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
                Retail Analytics
              </p>
              <h1 className="text-xl font-display font-bold text-foreground">
                Zara Menswear Sales Prediction
              </h1>
            </div>
            <p className="hidden md:block text-xs text-muted-foreground">
              252 products | Feb 2024
            </p>
          </div>
        </div>
      </header>

      {/* Tab layout for each section of the analysis */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="executive" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 h-auto p-1.5 bg-card border border-border rounded-xl">
            <TabsTrigger
              value="executive"
              className="py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
            >
              Executive Summary
            </TabsTrigger>
            <TabsTrigger
              value="descriptive"
              className="py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
            >
              Descriptive Analytics
            </TabsTrigger>
            <TabsTrigger
              value="models"
              className="py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
            >
              Model Performance
            </TabsTrigger>
            <TabsTrigger
              value="explainability"
              className="py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
            >
              Explainability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="executive"><ExecutiveSummary /></TabsContent>
          <TabsContent value="descriptive"><DescriptiveAnalytics /></TabsContent>
          <TabsContent value="models"><ModelPerformance /></TabsContent>
          <TabsContent value="explainability"><Explainability /></TabsContent>
        </Tabs>
      </main>

      {/* Minimal footer with dataset reference */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between text-xs text-muted-foreground">
          <p>Zara Menswear Sales Analysis</p>
          <p>Dataset: 252 products, Feb 2024 | random_state=42</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
