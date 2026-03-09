import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExecutiveSummary from "@/components/tabs/ExecutiveSummary";
import DescriptiveAnalytics from "@/components/tabs/DescriptiveAnalytics";
import ModelPerformance from "@/components/tabs/ModelPerformance";
import Explainability from "@/components/tabs/Explainability";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
                MSIS 522: Analytics and Machine Learning
              </p>
              <h1 className="text-xl font-display font-bold text-foreground">
                Zara Sales Prediction Dashboard
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
              <span>Prof. Leonard Boussioux</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Foster School of Business, UW</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
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

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between text-xs text-muted-foreground">
          <p>University of Washington — Foster School of Business</p>
          <p>Dataset: 252 Zara products, Feb 2024 | random_state=42</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
