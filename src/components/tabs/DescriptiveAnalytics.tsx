// Descriptive analytics tab — visualizations that explore the dataset before modeling.
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  datasetStats,
  positionDistribution,
  promotionDistribution,
  categoryDistribution,
  priceVsSalesData,
  salesDistribution,
  correlationMatrix,
  correlationGrid,
  seasonalDistribution,
} from "@/data/zaraData";
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

// Reusable label for numbered assignment sections.
const SectionLabel = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-baseline gap-3">
    <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{number}</span>
    <span className="font-display text-lg font-semibold text-foreground">{title}</span>
  </div>
);

// Styled callout block used below each chart for interpretation.
const Insight = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 p-4 bg-secondary/50 rounded-lg border-l-2 border-muted-foreground/30">
    <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
  </div>
);

// Shared tooltip style so all charts look consistent.
const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
};

const DescriptiveAnalytics = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page heading */}
      <div className="space-y-2 py-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Part 1</p>
        <h2 className="text-3xl font-display font-bold text-foreground">Descriptive Analytics</h2>
        <p className="text-muted-foreground max-w-xl">
          Exploring the dataset to uncover patterns before building predictive models.
        </p>
      </div>

      {/* Quick stats and feature type breakdown */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="1.1" title="Dataset Summary" />
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

      {/* Histogram of the target variable (sales volume) */}
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

      {/* Five feature-level charts arranged in a grid */}
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

      {/* Visual correlation heatmap grid */}
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

export default DescriptiveAnalytics;
