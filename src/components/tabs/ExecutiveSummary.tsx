// Executive summary tab — high-level overview for non-technical stakeholders.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { datasetStats, modelComparison } from "@/data/zaraData";
import { TrendingUp, Database, Target, BarChart3 } from "lucide-react";

const ExecutiveSummary = () => {
  // Find the model with the highest R² score.
  const bestModel = modelComparison.reduce((best, current) =>
    current.r2 > best.r2 ? current : best
  );

  // Metric cards shown at the top of the summary.
  const metrics = [
    { icon: Database, label: "Products in Dataset", value: datasetStats.totalRows.toString(), sub: "scraped Feb 2024" },
    { icon: BarChart3, label: "Predictor Features", value: datasetStats.totalFeatures.toString(), sub: "4 categorical, 2 numerical" },
    { icon: Target, label: "Top Model (R²)", value: bestModel.r2.toFixed(3), sub: bestModel.model },
    { icon: TrendingUp, label: "Mean Sales Volume", value: datasetStats.salesVolumeRange.mean.toLocaleString(), sub: "units per product" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page heading */}
      <div className="space-y-3 py-6">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Overview</p>
        <h1 className="text-4xl font-display font-bold text-foreground leading-tight">
          Predicting Sales Volume<br />for Zara Menswear Products
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          An end-to-end data science workflow covering exploratory analysis, predictive modeling,
          and model explainability on a dataset of 252 products.
        </p>
      </div>

      {/* Key metric cards in a row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <Card key={i} className="metric-card">
            <CardContent className="pt-6">
              <m.icon className="h-5 w-5 text-muted-foreground mb-3" />
              <p className="stat-value">{m.value}</p>
              <p className="text-sm font-medium text-foreground mt-1">{m.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Description of the dataset and prediction task */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">About the Dataset</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">
            This analysis uses a dataset of <strong>252 Zara men's clothing products</strong> scraped in February 2024.
            Each record captures retail-level attributes: where the product is placed in the store, whether it is on promotion,
            whether it is a seasonal item, its price, and its category (jackets, t-shirts, jeans, sweaters, or shoes).
            Prices range from $12.99 to $439.00.
          </p>
          <p className="text-foreground leading-relaxed">
            The <strong>target variable is Sales Volume</strong>, a continuous measure of units sold per product.
            This makes the task a regression problem. Accurate sales forecasts enable better inventory management,
            demand planning, and pricing strategy.
          </p>
        </CardContent>
      </Card>

      {/* Business justification for the analysis */}
      <Card className="chart-container border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="font-display">Business Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">
            In fast-fashion retail, forecast accuracy directly impacts profitability. Overestimating demand creates
            costly markdowns and inventory write-offs. Underestimating demand leads to stockouts and lost revenue.
            For a global retailer like Zara, even a <strong>1% improvement in forecast accuracy</strong> can translate
            to millions of dollars in savings.
          </p>
          <p className="text-foreground leading-relaxed">
            Beyond prediction, this analysis uses SHAP (SHapley Additive exPlanations) to identify <strong>which factors
            most influence sales</strong>. Understanding the role of price sensitivity, store placement, and promotions
            helps merchandising teams make evidence-based decisions.
          </p>
        </CardContent>
      </Card>

      {/* Summary of methods and three key takeaways */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">Methodology and Key Findings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">
            The analysis follows a systematic workflow: exploratory data analysis to understand feature distributions
            and relationships, followed by training five models (Linear Regression, Decision Tree, Random Forest,
            XGBoost, and a Neural Network). Each model was tuned with 5-fold cross-validation and GridSearchCV.
            A 70/30 train-test split was used throughout, with random_state=42.
          </p>

          <Separator className="my-6" />

          {/* Three headline findings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-secondary rounded-lg">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Best Model</p>
              <p className="font-semibold text-foreground">XGBoost</p>
              <p className="text-sm text-muted-foreground mt-1">
                Achieved R² = 0.474 and MAE of 456 units, outperforming all other models by a significant margin.
              </p>
            </div>
            <div className="p-5 bg-secondary rounded-lg">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Strongest Driver</p>
              <p className="font-semibold text-foreground">Product Price</p>
              <p className="text-sm text-muted-foreground mt-1">
                Price has the highest SHAP importance. Lower-priced items consistently sell more units.
              </p>
            </div>
            <div className="p-5 bg-secondary rounded-lg">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Notable Finding</p>
              <p className="font-semibold text-foreground">Promotion Paradox</p>
              <p className="text-sm text-muted-foreground mt-1">
                Promoted products show slightly lower sales, likely because promotions target slow-moving inventory.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummary;
