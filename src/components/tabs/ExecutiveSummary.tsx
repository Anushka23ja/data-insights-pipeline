// Executive summary tab — combines overview with full Part 1 descriptive analytics.
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  datasetStats, modelComparison, positionDistribution, promotionDistribution,
  categoryDistribution, priceVsSalesData, salesDistribution, correlationGrid,
  seasonalDistribution,
} from "@/data/zaraData";
import { TrendingUp, Database, Target, BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, Cell, PieChart, Pie,
} from "recharts";

// Color palette for pie chart slices.
const COLORS = [
  "hsl(222, 47%, 20%)",
  "hsl(36, 80%, 50%)",
  "hsl(173, 50%, 40%)",
  "hsl(262, 40%, 50%)",
  "hsl(12, 60%, 55%)",
];

// Reusable label for numbered rubric sections.
const SectionLabel = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-baseline gap-3">
    <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{number}</span>
    <span className="font-display text-lg font-semibold text-foreground">{title}</span>
  </div>
);

// Styled callout for chart interpretations.
const Insight = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 p-4 bg-secondary/50 rounded-lg border-l-2 border-muted-foreground/30">
    <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
  </div>
);

// Shared tooltip style for all Recharts components.
const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
};

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

      {/* Divider between executive overview and descriptive analytics */}
      <Separator className="my-4" />

      <div className="space-y-2 py-2">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Part 1</p>
        <h2 className="text-3xl font-display font-bold text-foreground">Descriptive Analytics</h2>
        <p className="text-muted-foreground max-w-xl">
          Exploring the dataset to uncover patterns before building predictive models.
        </p>
      </div>

      {/* 1.1 — Quick stats and feature type breakdown */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="1.1" title="Dataset Introduction" />
        </CardHeader>
        <CardContent>
          {/* Four top-line numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { value: datasetStats.totalRows, label: "Products" },
              { value: datasetStats.totalFeatures, label: "Features" },
              { value: `$${datasetStats.priceRange.mean.toFixed(2)}`, label: "Avg Price" },
              { value: datasetStats.salesVolumeRange.mean, label: "Avg Sales Vol" },
            ].map((s, i) => (
              <div key={i} className="p-4 bg-secondary rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Lists of numerical vs categorical features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Numerical Features
              </p>
              <ul className="text-sm text-foreground space-y-1.5">
                {datasetStats.numericalFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Categorical Features
              </p>
              <ul className="text-sm text-foreground space-y-1.5">
                {datasetStats.categoricalFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1.2 — Histogram of the target variable (sales volume) */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="1.2" title="Target Variable Distribution" />
          <CardDescription className="mt-2">
            Histogram of Sales Volume across all 252 products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <Insight>
            Sales volume follows a roughly normal distribution centered around 1,500-2,000 units.
            The mean is {datasetStats.salesVolumeRange.mean} units with a standard deviation of{" "}
            {datasetStats.salesVolumeRange.std}. There are no extreme outliers, suggesting consistent
            demand patterns across the product catalog.
          </Insight>
        </CardContent>
      </Card>

      {/* 1.3 — Five feature-level charts arranged in a grid */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="1.3" title="Feature Distributions and Relationships" />
          <CardDescription className="mt-2">
            Five visualizations exploring how features relate to sales volume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Average sales broken down by in-store position */}
            <div>
              <p className="text-sm font-medium text-foreground mb-4">Average Sales by Store Position</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={positionDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="avgSales" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <Insight>
                Aisle placements average 1,842 units, the highest among all positions.
                End-cap products underperform at 1,621 units on average.
              </Insight>
            </div>

            {/* Pie chart showing how many products fall into each category */}
            <div>
              <p className="text-sm font-medium text-foreground mb-4">Product Count by Category</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    fontSize={11}
                  >
                    {categoryDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <Insight>
                Jackets make up 38.9% of the catalog and have the highest average sales.
                The dataset is jacket-heavy, which may affect model generalizability.
              </Insight>
            </div>

            {/* Comparing average sales for promoted vs non-promoted items */}
            <div>
              <p className="text-sm font-medium text-foreground mb-4">Promotion Impact on Average Sales</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={promotionDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[1400, 2000]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="avgSales" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <Insight>
                Non-promoted products average 1,891 units versus 1,621 for promoted ones.
                This suggests promotions target slower-moving items rather than reducing sales.
              </Insight>
            </div>

            {/* Scatter plot showing the relationship between price and units sold */}
            <div>
              <p className="text-sm font-medium text-foreground mb-4">Price vs. Sales Volume (Scatter)</p>
              <ResponsiveContainer width="100%" height={220}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="price" name="Price ($)" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis dataKey="sales" name="Sales Vol" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={tooltipStyle} />
                  <Scatter data={priceVsSalesData} fill="hsl(var(--chart-1))" />
                </ScatterChart>
              </ResponsiveContainer>
              <Insight>
                A negative correlation (r = -0.28) indicates lower-priced products sell more.
                Products above $300 rarely exceed 1,900 units, reflecting price sensitivity.
              </Insight>
            </div>

            {/* Average sales for seasonal vs non-seasonal products */}
            <div className="lg:col-span-2">
              <p className="text-sm font-medium text-foreground mb-4">Seasonal vs. Non-Seasonal Average Sales</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={seasonalDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[1500, 1900]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="avgSales" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <Insight>
                Non-seasonal products average 1,823 units versus 1,698 for seasonal items.
                Seasonal items account for 54.8% of the catalog but sell slightly fewer units on average.
              </Insight>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1.4 — Visual correlation heatmap grid */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="1.4" title="Correlation Heatmap" />
          <CardDescription className="mt-2">
            Pairwise Pearson correlations between numerical and encoded features
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Color-coded grid heatmap */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-[500px]">
              {/* Column headers */}
              <div className="flex">
                <div className="w-32 shrink-0" />
                {correlationGrid.features.map((f) => (
                  <div key={f} className="w-20 text-center text-[10px] font-mono text-muted-foreground px-1 pb-2 truncate">
                    {f}
                  </div>
                ))}
              </div>
              {/* Rows with color-coded cells */}
              {correlationGrid.features.map((rowFeature, ri) => (
                <div key={rowFeature} className="flex">
                  <div className="w-32 shrink-0 text-[10px] font-mono text-muted-foreground flex items-center pr-2 truncate">
                    {rowFeature}
                  </div>
                  {correlationGrid.matrix[ri].map((val, ci) => {
                    const absVal = Math.abs(val);
                    const isPositive = val >= 0;
                    const isDiagonal = ri === ci;
                    const bgColor = isDiagonal
                      ? "hsl(var(--primary) / 0.15)"
                      : isPositive
                      ? `hsl(173, 50%, 40%, ${absVal * 0.8})`
                      : `hsl(0, 60%, 55%, ${absVal * 0.8})`;
                    return (
                      <div
                        key={ci}
                        className="w-20 h-14 flex items-center justify-center border border-border/30 text-xs font-mono font-medium"
                        style={{ backgroundColor: bgColor }}
                        title={`${correlationGrid.features[ri]} vs ${correlationGrid.features[ci]}: ${val.toFixed(2)}`}
                      >
                        <span className={isDiagonal ? "text-foreground" : absVal > 0.2 ? "text-foreground" : "text-muted-foreground"}>
                          {val.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Color scale legend */}
          <div className="flex justify-center items-center gap-4 mt-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-3 rounded" style={{ backgroundColor: "hsl(0, 60%, 55%, 0.6)" }} />
              Negative
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-3 rounded bg-border" />
              Near zero
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-3 rounded" style={{ backgroundColor: "hsl(173, 50%, 40%, 0.6)" }} />
              Positive
            </div>
          </div>

          <Insight>
            The strongest correlation is between seasonal and promotion status (+0.31), meaning promotions
            are more common during seasonal periods. Price negatively correlates with sales (-0.28).
            No features show strong multicollinearity, so all are retained for modeling.
          </Insight>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummary;
