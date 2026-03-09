import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  datasetStats,
  positionDistribution,
  promotionDistribution,
  categoryDistribution,
  priceVsSalesData,
  salesDistribution,
  correlationMatrix,
} from "@/data/zaraData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

const COLORS = ['hsl(222, 47%, 20%)', 'hsl(36, 80%, 50%)', 'hsl(173, 50%, 40%)', 'hsl(262, 40%, 50%)', 'hsl(12, 60%, 55%)'];

const SectionLabel = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-baseline gap-3">
    <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{number}</span>
    <span className="font-display text-lg font-semibold text-foreground">{title}</span>
  </div>
);

const Insight = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 p-4 bg-secondary/50 rounded-lg border-l-2 border-muted-foreground/30">
    <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
  </div>
);

const DescriptiveAnalytics = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2 py-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Part 1</p>
        <h2 className="text-3xl font-display font-bold text-foreground">Descriptive Analytics</h2>
        <p className="text-muted-foreground max-w-xl">Exploring the dataset to uncover patterns before building predictive models.</p>
      </div>

      {/* Dataset Stats */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="1.1" title="Dataset Summary" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { value: datasetStats.totalRows, label: 'Products' },
              { value: datasetStats.totalFeatures, label: 'Features' },
              { value: `$${datasetStats.priceRange.mean.toFixed(2)}`, label: 'Avg Price' },
              { value: datasetStats.salesVolumeRange.mean, label: 'Avg Sales Vol' },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-secondary rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Numerical Features</p>
              <ul className="text-sm text-foreground space-y-1.5">
                {datasetStats.numericalFeatures.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Categorical Features</p>
              <ul className="text-sm text-foreground space-y-1.5">
                {datasetStats.categoricalFeatures.map(f => (
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

      {/* Target Distribution */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="1.2" title="Target Variable Distribution" />
          <CardDescription className="mt-2">Histogram of Sales Volume across all 252 products</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: 'Sales Volume (units)', position: 'insideBottom', offset: -5, fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: 'Count', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <Insight>
            Sales volume follows a roughly normal distribution centered around 1,500-2,000 units. 
            The mean is {datasetStats.salesVolumeRange.mean} units with a standard deviation of {datasetStats.salesVolumeRange.std}. 
            There are no extreme outliers, suggesting consistent demand patterns across the product catalog.
          </Insight>
        </CardContent>
      </Card>

      {/* Feature Visualizations */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="1.3" title="Feature Distributions and Relationships" />
          <CardDescription className="mt-2">Four visualizations exploring how features relate to sales volume</CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Position Distribution */}
            <div>
              <p className="text-sm font-medium text-foreground mb-4">Average Sales by Store Position</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={positionDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="avgSales" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <Insight>
                Aisle placements average 1,842 units, the highest among all positions. 
                Front of Store follows closely, while End-cap products underperform at 1,621 units on average.
              </Insight>
            </div>

            {/* Category Distribution */}
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
                    {categoryDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <Insight>
                Jackets make up 38.9% of the catalog and have the highest average sales. 
                T-shirts account for 24.6%. The dataset is jacket-heavy, which may affect model generalizability.
              </Insight>
            </div>

            {/* Promotion Impact */}
            <div>
              <p className="text-sm font-medium text-foreground mb-4">Promotion Impact on Average Sales</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={promotionDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[1400, 2000]} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="avgSales" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <Insight>
                Non-promoted products average 1,891 units versus 1,621 for promoted ones. 
                This counterintuitive pattern suggests promotions are applied to slower-moving items, not that they reduce sales.
              </Insight>
            </div>

            {/* Price vs Sales */}
            <div>
              <p className="text-sm font-medium text-foreground mb-4">Price vs. Sales Volume (Scatter)</p>
              <ResponsiveContainer width="100%" height={220}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="price" name="Price ($)" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis dataKey="sales" name="Sales Vol" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Scatter data={priceVsSalesData} fill="hsl(var(--chart-1))" />
                </ScatterChart>
              </ResponsiveContainer>
              <Insight>
                A negative correlation (r = -0.28) indicates that lower-priced products tend to sell more units. 
                Products above $300 rarely exceed 1,900 units, reflecting clear price sensitivity in fast fashion.
              </Insight>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Correlation */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="1.4" title="Correlation Matrix" />
          <CardDescription className="mt-2">Pairwise Pearson correlations between numerical and encoded features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full max-w-2xl mx-auto text-sm">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Feature Pair</th>
                  <th className="p-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Coefficient</th>
                  <th className="p-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Strength</th>
                </tr>
              </thead>
              <tbody>
                {correlationMatrix.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{row.feature1} / {row.feature2}</td>
                    <td className="p-3 text-center">
                      <span className={`font-mono text-sm ${row.correlation < 0 ? 'text-destructive' : 'text-chart-3'}`}>
                        {row.correlation > 0 ? '+' : ''}{row.correlation.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        Math.abs(row.correlation) > 0.25 ? 'bg-primary/10 text-foreground' : 'bg-secondary text-muted-foreground'
                      }`}>
                        {Math.abs(row.correlation) > 0.25 ? 'Moderate' : 'Weak'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Insight>
            The strongest correlation is between seasonal and promotion status (+0.31), meaning promotions are more common 
            during seasonal periods. Price negatively correlates with sales (-0.28), confirming the scatter plot finding. 
            No features show strong multicollinearity, so all are retained for modeling.
          </Insight>
        </CardContent>
      </Card>
    </div>
  );
};

export default DescriptiveAnalytics;
