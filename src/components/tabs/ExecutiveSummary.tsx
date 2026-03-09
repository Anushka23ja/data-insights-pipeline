import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { datasetStats, modelComparison } from "@/data/zaraData";
import { TrendingUp, Database, Target, BarChart3 } from "lucide-react";

const ExecutiveSummary = () => {
  const bestModel = modelComparison.reduce((best, current) => 
    current.r2 > best.r2 ? current : best
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-display font-bold text-foreground">
          Zara Sales Volume Prediction
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A Complete Data Science Workflow: From Exploratory Analysis to Predictive Modeling
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="metric-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-accent/10">
                <Database className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="stat-label">Dataset Size</p>
                <p className="stat-value">{datasetStats.totalRows}</p>
                <p className="text-xs text-muted-foreground">products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-accent/10">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="stat-label">Features</p>
                <p className="stat-value">{datasetStats.totalFeatures}</p>
                <p className="text-xs text-muted-foreground">predictors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-accent/10">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="stat-label">Best Model</p>
                <p className="stat-value text-2xl">{bestModel.model.split(' ')[0]}</p>
                <p className="text-xs text-muted-foreground">R² = {bestModel.r2.toFixed(3)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-chart-3/10">
                <TrendingUp className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                <p className="stat-label">Avg Sales</p>
                <p className="stat-value">{datasetStats.salesVolumeRange.mean.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">units/product</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dataset Description */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">Dataset Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">
            This analysis utilizes a comprehensive dataset of <strong>252 Zara men's clothing products</strong> scraped in February 2024. 
            The dataset captures key retail attributes including product positioning, promotional status, seasonality, pricing, 
            and historical sales volume. Products span five categories: jackets, t-shirts, jeans, sweaters, and shoes, 
            with prices ranging from $12.99 to $439.00.
          </p>
          <p className="text-foreground leading-relaxed">
            The <strong>prediction target is Sales Volume</strong> — a continuous variable representing the number of units sold per product. 
            This regression task is crucial for inventory management, demand forecasting, and strategic pricing decisions.
            Understanding which factors drive sales enables data-driven merchandising and store layout optimization.
          </p>
        </CardContent>
      </Card>

      {/* Why This Matters */}
      <Card className="chart-container border-l-4 border-l-accent">
        <CardHeader>
          <CardTitle className="font-display">Why This Matters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">
            In fast-fashion retail, accurate sales forecasting directly impacts profitability. Overestimating demand leads to 
            costly markdowns and inventory write-offs, while underestimating results in stockouts and lost revenue. 
            For a global retailer like Zara, even a <strong>1% improvement in forecast accuracy</strong> can translate to 
            millions of dollars in savings.
          </p>
          <p className="text-foreground leading-relaxed">
            This analysis goes beyond simple prediction — by leveraging SHAP explainability, we identify <strong>which factors 
            most influence sales</strong>: price sensitivity, store placement effectiveness, and promotional impact. 
            These insights empower merchandising teams to make evidence-based decisions about product positioning, 
            pricing strategies, and promotional calendars.
          </p>
        </CardContent>
      </Card>

      {/* Approach & Key Findings */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">Approach & Key Findings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">
            Our analysis follows a systematic data science workflow: exploratory data analysis to understand feature distributions 
            and relationships, followed by training and tuning five different models — from simple linear regression to 
            gradient-boosted trees and neural networks. Each model underwent rigorous 5-fold cross-validation with 
            hyperparameter optimization using GridSearchCV.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-secondary rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">🏆 Best Performer</h4>
              <p className="text-sm text-muted-foreground">
                XGBoost achieved the highest R² of 0.474 with MAE of 456 units, outperforming all other models.
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">💡 Key Driver</h4>
              <p className="text-sm text-muted-foreground">
                Price is the strongest predictor with negative correlation — lower-priced items sell more units.
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">🎯 Surprising Insight</h4>
              <p className="text-sm text-muted-foreground">
                Promotions show slight negative impact on sales volume, suggesting potential customer fatigue.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummary;
