import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  datasetStats,
  positionDistribution,
  promotionDistribution,
  seasonalDistribution,
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

const COLORS = ['hsl(222, 47%, 11%)', 'hsl(36, 100%, 50%)', 'hsl(173, 58%, 39%)', 'hsl(262, 52%, 47%)', 'hsl(12, 76%, 61%)'];

const DescriptiveAnalytics = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2 py-4">
        <h2 className="text-3xl font-display font-bold text-foreground">Descriptive Analytics</h2>
        <p className="text-muted-foreground">Understanding the data before modeling</p>
      </div>

      {/* Dataset Stats */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">1.1 Dataset Introduction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-secondary rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{datasetStats.totalRows}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{datasetStats.totalFeatures}</p>
              <p className="text-sm text-muted-foreground">Features</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">${datasetStats.priceRange.mean.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Avg Price</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{datasetStats.salesVolumeRange.mean}</p>
              <p className="text-sm text-muted-foreground">Avg Sales Vol</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Numerical Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {datasetStats.numericalFeatures.map(f => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Categorical Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {datasetStats.categoricalFeatures.map(f => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Distribution */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">1.2 Target Distribution (Sales Volume)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="insight-text mt-4">
            The sales volume distribution is approximately normal with a slight right skew. 
            Most products fall in the 1,500-2,000 unit range, with mean sales of {datasetStats.salesVolumeRange.mean} units. 
            The distribution shows no extreme outliers, indicating relatively consistent demand across products.
          </p>
        </CardContent>
      </Card>

      {/* Feature Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Distribution */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="font-display text-lg">Sales by Product Position</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={positionDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="avgSales" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="insight-text mt-4">
              Products positioned in Aisle locations show the highest average sales (1,842 units), 
              followed closely by Front of Store. End-cap positions show slightly lower performance, 
              potentially due to category mix differences.
            </p>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="font-display text-lg">Sales by Product Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {categoryDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <p className="insight-text mt-4">
              Jackets dominate the product mix (38.9%), followed by t-shirts (24.6%). 
              Jackets also show the highest average sales, suggesting strong demand in this category.
            </p>
          </CardContent>
        </Card>

        {/* Promotion Impact */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="font-display text-lg">Promotion Impact on Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={promotionDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="avgSales" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="insight-text mt-4">
              Surprisingly, non-promoted products show slightly higher average sales (1,891 vs 1,621 units). 
              This counterintuitive finding may indicate promotions are applied to slower-moving inventory, 
              or potential promotional fatigue among customers.
            </p>
          </CardContent>
        </Card>

        {/* Price vs Sales */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="font-display text-lg">Price vs Sales Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="price" name="Price ($)" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="sales" name="Sales" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} 
                />
                <Scatter data={priceVsSalesData} fill="hsl(var(--chart-4))" />
              </ScatterChart>
            </ResponsiveContainer>
            <p className="insight-text mt-4">
              A negative correlation (r = -0.28) exists between price and sales volume. 
              Lower-priced items ($12.99-$79.99) consistently achieve higher sales, 
              while premium items ($300+) show reduced volume, reflecting price sensitivity in fast-fashion.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Correlation Heatmap */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">1.4 Correlation Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full max-w-2xl mx-auto text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-left text-muted-foreground">Feature Pair</th>
                  <th className="p-3 text-center text-muted-foreground">Correlation</th>
                  <th className="p-3 text-center text-muted-foreground">Strength</th>
                </tr>
              </thead>
              <tbody>
                {correlationMatrix.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="p-3 font-medium text-foreground">{row.feature1} ↔ {row.feature2}</td>
                    <td className="p-3 text-center">
                      <span className={`font-mono ${row.correlation < 0 ? 'text-destructive' : 'text-chart-3'}`}>
                        {row.correlation > 0 ? '+' : ''}{row.correlation.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        Math.abs(row.correlation) > 0.25 ? 'bg-accent/20 text-accent-foreground' : 'bg-secondary text-muted-foreground'
                      }`}>
                        {Math.abs(row.correlation) > 0.25 ? 'Moderate' : 'Weak'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="insight-text mt-6">
            The correlation matrix reveals moderate relationships: price negatively correlates with sales (-0.28), 
            confirming price sensitivity. Seasonal and promotion features show positive correlation (0.31), 
            indicating promotions are more common during seasonal periods. These relationships justify including 
            all features in our predictive models.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DescriptiveAnalytics;
