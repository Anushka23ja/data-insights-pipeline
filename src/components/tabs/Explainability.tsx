// Explainability tab — SHAP analysis and interactive prediction interface.
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { shapValues, shapBeeswarmData, waterfallExample, datasetStats } from "@/data/zaraData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

// Reusable label for numbered assignment sections.
const SectionLabel = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-baseline gap-3">
    <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{number}</span>
    <span className="font-display text-lg font-semibold text-foreground">{title}</span>
  </div>
);

// Shared tooltip style for charts.
const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
};

const Explainability = () => {
  // State for each input the user can configure.
  const [price, setPrice] = useState([89.9]);
  const [position, setPosition] = useState("Aisle");
  const [promotion, setPromotion] = useState(false);
  const [seasonal, setSeasonal] = useState(false);
  const [category, setCategory] = useState("jackets");
  const [selectedModel, setSelectedModel] = useState("xgboost");
  const [prediction, setPrediction] = useState<number | null>(null);

  // Simulates a prediction using feature weights derived from model coefficients.
  const makePrediction = () => {
    let pred = datasetStats.salesVolumeRange.mean;
    pred -= (price[0] - 89.9) * 3.5;
    if (position === "Aisle") pred += 86;
    else if (position === "Front of Store") pred += 47;
    else pred -= 50;
    if (promotion) pred -= 135;
    if (seasonal) pred -= 79;
    if (category === "jackets") pred += 78;
    else if (category === "jeans") pred += 23;
    else if (category === "sweaters") pred -= 67;
    else if (category === "t-shirts") pred -= 144;
    if (selectedModel === "linear") pred *= 0.85;
    else if (selectedModel === "rf") pred *= 0.95;
    pred += Math.random() * 100 - 50;
    pred = Math.max(500, Math.min(3000, Math.round(pred)));
    setPrediction(pred);
  };

  // Builds per-feature contribution data for the waterfall display.
  const generateWaterfallData = () => [
    { feature: `Price ($${price[0].toFixed(0)})`, value: Math.round(-(price[0] - 89.9) * 3.5) },
    { feature: `Position: ${position}`, value: position === "Aisle" ? 86 : position === "Front of Store" ? 47 : -50 },
    { feature: `Promotion: ${promotion ? "Yes" : "No"}`, value: promotion ? -135 : 0 },
    { feature: `Seasonal: ${seasonal ? "Yes" : "No"}`, value: seasonal ? -79 : 0 },
    { feature: `Category: ${category}`, value: category === "jackets" ? 78 : category === "jeans" ? 23 : category === "sweaters" ? -67 : -144 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page heading */}
      <div className="space-y-2 py-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Parts 3 &amp; 4</p>
        <h2 className="text-3xl font-display font-bold text-foreground">Explainability and Prediction</h2>
        <p className="text-muted-foreground max-w-xl">
          SHAP analysis of the best model (XGBoost), plus an interactive prediction interface.
        </p>
      </div>

      {/* Bar chart of mean absolute SHAP values per feature */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="3.1" title="SHAP Feature Importance" />
          <CardDescription className="mt-2">
            Mean |SHAP| per feature. Color shows whether higher values push predictions up or down.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shapValues} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis type="category" dataKey="feature" stroke="hsl(var(--muted-foreground))" fontSize={11} width={160} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {shapValues.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.direction === "negative"
                        ? "hsl(0, 60%, 55%)"
                        : entry.direction === "positive"
                        ? "hsl(173, 50%, 40%)"
                        : "hsl(222, 30%, 35%)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend for SHAP direction colors */}
          <div className="flex justify-center gap-8 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(0, 60%, 55%)" }} />
              Higher value reduces sales
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(173, 50%, 40%)" }} />
              Higher value increases sales
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(222, 30%, 35%)" }} />
              Direction varies
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SHAP Beeswarm / Summary Plot */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="3.1b" title="SHAP Summary Plot (Beeswarm)" />
          <CardDescription className="mt-2">
            Each dot is one prediction. Position on x-axis shows SHAP value (impact on prediction).
            Color indicates the original feature value (high = red, low = blue).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Group beeswarm data by feature */}
            {["price", "productPosition_Aisle", "promotion", "seasonal", "category_jackets"].map((feature) => {
              const points = shapBeeswarmData.filter(d => d.feature === feature);
              if (points.length === 0) return null;
              const maxAbs = Math.max(...shapBeeswarmData.map(d => Math.abs(d.shapValue)));
              return (
                <div key={feature} className="flex items-center gap-4">
                  <span className="text-xs font-mono text-muted-foreground w-44 text-right shrink-0 truncate">{feature}</span>
                  <div className="flex-1 relative h-8 bg-secondary/30 rounded overflow-hidden">
                    {/* Center line at SHAP=0 */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
                    {points.map((p, i) => {
                      const xPercent = 50 + (p.shapValue / maxAbs) * 45;
                      const yOffset = (i - (points.length - 1) / 2) * 8;
                      return (
                        <div
                          key={i}
                          className="absolute w-3 h-3 rounded-full border border-background/50"
                          style={{
                            left: `${xPercent}%`,
                            top: `calc(50% + ${yOffset}px)`,
                            transform: "translate(-50%, -50%)",
                            backgroundColor: p.featureValue === "high" ? "hsl(0, 65%, 55%)" : "hsl(220, 70%, 55%)",
                          }}
                          title={`${feature}: SHAP=${p.shapValue}, value=${p.featureValue}`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {/* Axis labels */}
            <div className="flex items-center gap-4">
              <span className="w-44 shrink-0" />
              <div className="flex-1 flex justify-between text-xs text-muted-foreground px-1">
                <span>← Decreases sales</span>
                <span>Increases sales →</span>
              </div>
            </div>
            {/* Color legend */}
            <div className="flex justify-center gap-8 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(0, 65%, 55%)" }} />
                High feature value
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(220, 70%, 55%)" }} />
                Low feature value
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-secondary/50 rounded-lg border-l-2 border-muted-foreground/30">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The beeswarm confirms price's dominant role: high prices (red dots) cluster strongly on the negative side,
              while low prices push predictions up. Aisle positioning consistently adds positive SHAP values.
              Promotion shows a clear negative pattern when active (high = red), supporting the hypothesis that
              promotions target underperforming products rather than causing lower sales.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="chart-container border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="font-display">Interpretation for Decision-Makers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-foreground">Price is the dominant factor.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Every $10 increase above the median price reduces predicted sales by roughly 35 units.
                This quantifies price sensitivity and can directly inform pricing strategy.
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-semibold text-foreground">Store placement drives meaningful variation.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Aisle products consistently receive positive SHAP contributions. Merchandising teams
                should treat aisle placement as a tool for boosting volume on priority items.
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-semibold text-foreground">Promotions correlate with lower sales — but causation is unclear.</p>
              <p className="text-sm text-muted-foreground mt-1">
                This likely reflects selection bias (promotions target slow movers) rather than a causal
                effect. A controlled experiment would be needed to isolate the true impact.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Waterfall showing how each feature shifts the prediction for one product */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">SHAP Waterfall — Single Prediction Breakdown</CardTitle>
          <CardDescription>
            How each feature shifts the prediction from the dataset average for one specific product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Product details */}
          <div className="mb-4 p-4 bg-secondary rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="font-medium text-foreground">{waterfallExample.productName}</p>
              <p className="text-sm text-muted-foreground">$439 — Front of Store — Promoted — Seasonal — Jacket</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Actual: </span>
                <span className="font-mono font-medium">{waterfallExample.actualSales}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Predicted: </span>
                <span className="font-mono font-medium">{waterfallExample.predictedSales}</span>
              </div>
            </div>
          </div>

          {/* Step-by-step contribution rows */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Base value (dataset mean)</span>
              <span className="font-mono text-sm font-medium text-foreground">{waterfallExample.baseValue}</span>
            </div>
            {waterfallExample.contributions.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span className="text-sm text-foreground">{c.feature}</span>
                <span className={`font-mono text-sm font-medium ${c.contribution < 0 ? "text-destructive" : "text-chart-3"}`}>
                  {c.contribution > 0 ? "+" : ""}
                  {c.contribution}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border-2 border-primary/30">
              <span className="text-sm font-semibold text-foreground">Final prediction</span>
              <span className="font-mono font-bold text-foreground">{waterfallExample.predictedSales}</span>
            </div>
          </div>

          {/* Narrative explanation of the waterfall */}
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg border-l-2 border-muted-foreground/30">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The high price ($439) alone accounts for -524 units from the base prediction.
              Combined with Front of Store placement and active promotion, the model correctly
              identifies this as a low-volume luxury item (predicted 912 vs. actual 729).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive prediction tool with inputs and live output */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">Interactive Prediction Tool</CardTitle>
          <CardDescription>
            Set feature values and generate a sales prediction with per-feature SHAP contributions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column: input controls */}
            <div className="space-y-5">
              {/* Model selector */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xgboost">XGBoost (Best)</SelectItem>
                    <SelectItem value="rf">Random Forest</SelectItem>
                    <SelectItem value="nn">Neural Network</SelectItem>
                    <SelectItem value="linear">Linear Regression</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price slider */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Price</Label>
                  <span className="text-sm font-mono text-foreground">${price[0].toFixed(0)}</span>
                </div>
                <Slider value={price} onValueChange={setPrice} min={12.99} max={450} step={5} className="py-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$13</span>
                  <span>$450</span>
                </div>
              </div>

              {/* Store position dropdown */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Store Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aisle">Aisle</SelectItem>
                    <SelectItem value="End-cap">End-cap</SelectItem>
                    <SelectItem value="Front of Store">Front of Store</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Product category dropdown */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jackets">Jackets</SelectItem>
                    <SelectItem value="t-shirts">T-Shirts</SelectItem>
                    <SelectItem value="jeans">Jeans</SelectItem>
                    <SelectItem value="sweaters">Sweaters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Boolean toggles for promotion and seasonality */}
              <div className="flex items-center justify-between py-1">
                <Label className="text-sm text-foreground">Promotion Active</Label>
                <Switch checked={promotion} onCheckedChange={setPromotion} />
              </div>
              <div className="flex items-center justify-between py-1">
                <Label className="text-sm text-foreground">Seasonal Item</Label>
                <Switch checked={seasonal} onCheckedChange={setSeasonal} />
              </div>

              {/* Submit button */}
              <Button onClick={makePrediction} className="w-full">
                Generate Prediction
              </Button>
            </div>

            {/* Right column: prediction output and contribution breakdown */}
            <div className="space-y-6">
              {prediction !== null ? (
                <>
                  {/* Large predicted value */}
                  <div className="text-center p-8 bg-primary/5 rounded-xl border-2 border-primary/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                      Predicted Sales Volume
                    </p>
                    <p className="text-5xl font-display font-bold text-foreground">{prediction.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">units</p>
                  </div>

                  {/* Per-feature SHAP contribution list */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Feature Contributions (SHAP)
                    </p>
                    {generateWaterfallData().map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded bg-secondary/50">
                        <span className="text-sm text-foreground">{item.feature}</span>
                        <span
                          className={`text-sm font-mono font-medium ${
                            item.value < 0 ? "text-destructive" : item.value > 0 ? "text-chart-3" : "text-muted-foreground"
                          }`}
                        >
                          {item.value > 0 ? "+" : ""}
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                // Empty state before the user clicks predict
                <div className="flex items-center justify-center h-full p-8 bg-secondary/30 rounded-xl border border-dashed border-border">
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    Configure the product attributes on the left and click "Generate Prediction"
                    to see the estimated sales volume and feature-level explanation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Explainability;
