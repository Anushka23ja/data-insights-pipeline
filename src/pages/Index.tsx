import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExecutiveSummary from "@/components/tabs/ExecutiveSummary";
import DescriptiveAnalytics from "@/components/tabs/DescriptiveAnalytics";
import ModelPerformance from "@/components/tabs/ModelPerformance";
import Explainability from "@/components/tabs/Explainability";
import { BarChart3, FileText, TrendingUp, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                MSIS 522 Analytics Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Zara Sales Volume Prediction — Complete ML Workflow
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-secondary rounded-full">Prof. Léonard Boussioux</span>
              <span className="px-3 py-1 bg-secondary rounded-full">Foster School of Business</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="executive" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 h-auto p-2 bg-card border border-border rounded-xl">
            <TabsTrigger 
              value="executive" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Executive Summary</span>
              <span className="sm:hidden">Summary</span>
            </TabsTrigger>
            <TabsTrigger 
              value="descriptive"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Descriptive Analytics</span>
              <span className="sm:hidden">Descriptive</span>
            </TabsTrigger>
            <TabsTrigger 
              value="models"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Model Performance</span>
              <span className="sm:hidden">Models</span>
            </TabsTrigger>
            <TabsTrigger 
              value="explainability"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Explainability</span>
              <span className="sm:hidden">SHAP</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="executive" className="mt-0">
            <ExecutiveSummary />
          </TabsContent>

          <TabsContent value="descriptive" className="mt-0">
            <DescriptiveAnalytics />
          </TabsContent>

          <TabsContent value="models" className="mt-0">
            <ModelPerformance />
          </TabsContent>

          <TabsContent value="explainability" className="mt-0">
            <Explainability />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>MSIS 522: Analytics and Machine Learning | University of Washington</p>
          <p className="mt-1">Dataset: Zara Men's Clothing (252 products) | random_state=42</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
