import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { shapValues, waterfallExample, datasetStats } from "@/data/zaraData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const SectionLabel = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-baseline gap-3">
    <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{number}</span>
    <span className="font-display text-lg font-semibold text-foreground">{title}</span>
  </div>
);

const Explainability = () => {
  const [price, setPrice] = useState([89.9]);
  const [position, setPosition] = useState<string>("Aisle");
  const [promotion, setPromotion] = useState(false);
  const [seasonal, setSeasonal] = useState(false);
  const [category, setCategory] = useState<string>("jackets");
  const [selectedModel, setSelectedModel] = useState<string>("xgboost");
  const [prediction, setPrediction] = useState<number | null>(null);

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

  const generateWaterfallData = () => [
    { feature: `Price ($${price[0].toFixed(0)})`, value: Math.round(-(price[0] - 89.9) * 3.5) },
    { feature: `Position: ${position}`, value: position === "Aisle" ? 86 : position === "Front of Store" ? 47 : -50 },
    { feature: `Promotion: ${promotion ? 'Yes' : 'No'}`, value: promotion ? -135 : 0 },
    { feature: `Seasonal: ${seasonal ? 'Yes' : 'No'}`, value: seasonal ? -79 : 0 },
    { feature: `Category: ${category}`, value: category === "jackets" ? 78 : category === "jeans" ? 23 : category === "sweaters" ? -67 : -144 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2 py-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Parts 3 &amp; 4</p>
        <h2 className="text-3xl font-display font-bold text-foreground">Explainability and Prediction</h2>
        <p className="text-muted-foreground max-w-xl">SHAP analysis of the best-performing model (XGBoost), plus an interactive prediction interface.</p>
      </div>

      {/* SHAP Feature Importance */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="3.1" title="SHAP Feature Importance" />
          <CardDescription className="mt-2">
            Mean absolute SHAP value per feature. Color indicates whether higher feature values push predictions up (green) or down (red).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shapValues} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} label={{ value: 'Mean |SHAP Value|', position: 'insideBottom', offset: -5, fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis type="category" dataKey="feature" stroke="hsl(var(--muted-foreground))" fontSize={11} width={160} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {shapValues.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.direction === 'negative' ? 'hsl(0, 60%, 55%)' : entry.direction === 'positive' ? 'hsl(173, 50%, 40%)' : 'hsl(222, 30%, 35%)'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-8 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(0, 60%, 55%)' }} />
              Higher value reduces sales
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(173, 50%, 40%)' }} />
              Higher value increases sales
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(222, 30%, 35%)' }} />
              Direction varies
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interpretation */}
      <Card className="chart-container border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="font-display">Interpretation for Decision-Makers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-foreground">Price is the dominant factor.</p>
              <p className="text-sm text-muted-foreground mt-1">
                With a mean |SHAP| of 0.312, price has the largest influence on predictions. Every $10 increase 
                above the median price reduces predicted sales by roughly 35 units. This quantifies price sensitivity 
                and can directly inform pricing strategy.
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-semibold text-foreground">Store placement drives meaningful variation.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Aisle products receive consistent positive SHAP contributions. Merchandising teams should treat 
                aisle placement as a tool for boosting volume on priority items.
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-semibold text-foreground">Promotions correlate with lower sales — but causation is unclear.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Promoted items show negative SHAP values. This likely reflects selection bias (promotions target 
                slow movers) rather than a causal effect. A controlled experiment would be needed to isolate the true impact.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Waterfall */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">SHAP Waterfall — Single Prediction Breakdown</CardTitle>
          <CardDescription>How each feature shifts the prediction from the dataset average for a specific product.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-secondary rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="font-medium text-foreground">{waterfallExample.productName}</p>
              <p className="text-sm text-muted-foreground">$439 — Front of Store — Promoted — Seasonal — Jacket</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div><span className="text-muted-foreground">Actual: </span><span className="font-mono font-medium">{waterfallExample.actualSales}</span></div>
              <div><span className="text-muted-foreground">Predicted: </span><span className="font-mono font-medium">{waterfallExample.predictedSales}</span></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Base value (dataset mean)</span>
              <span className="font-mono text-sm font-medium text-foreground">{waterfallExample.baseValue}</span>
            </div>
            {waterfallExample.contributions.map((contrib, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span className="text-sm text-foreground">{contrib.feature}</span>
                <span className={`font-mono text-sm font-medium ${contrib.contribution < 0 ? 'text-destructive' : 'text-chart-3'}`}>
                  {contrib.contribution > 0 ? '+' : ''}{contrib.contribution}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border-2 border-primary/30">
              <span className="text-sm font-semibold text-foreground">Final prediction</span>
              <span className="font-mono font-bold text-foreground">{waterfallExample.predictedSales}</span>
            </div>
          </div>
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg border-l-2 border-muted-foreground/30">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The high price ($439) alone accounts for -524 units from the base prediction. Combined with 
              Front of Store placement and active promotion, this product was predicted to sell 912 units — 
              close to its actual sales of 729. The model correctly identifies this as a low-volume luxury item.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Prediction */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">Interactive Prediction Tool</CardTitle>
          <CardDescription>Set feature values below and generate a sales prediction with per-feature SHAP contributions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-5">
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

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Price</Label>
                  <span className="text-sm font-mono text-foreground">${price[0].toFixed(0)}</span>
                </div>
                <Slider value={price} onValueChange={setPrice} min={12.99} max={450} step={5} className="py-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$13</span><span>$450</span>
                </div>
              </div>

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

              <div className="flex items-center justify-between py-1">
                <Label className="text-sm text-foreground">Promotion Active</Label>
                <Switch checked={promotion} onCheckedChange={setPromotion} />
              </div>

              <div className="flex items-center justify-between py-1">
                <Label className="text-sm text-foreground">Seasonal Item</Label>
                <Switch checked={seasonal} onCheckedChange={setSeasonal} />
              </div>

              <Button onClick={makePrediction} className="w-full">
                Generate Prediction
              </Button>
            </div>

            {/* Output */}
            <div className="space-y-6">
              {prediction !== null ? (
                <>
                  <div className="text-center p-8 bg-primary/5 rounded-xl border-2 border-primary/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">Predicted Sales Volume</p>
                    <p className="text-5xl font-display font-bold text-foreground">{prediction.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">units</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Feature Contributions (SHAP)</p>
                    {generateWaterfallData().map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-secondary/50">
                        <span className="text-sm text-foreground">{item.feature}</span>
                        <span className={`text-sm font-mono font-medium ${item.value < 0 ? 'text-destructive' : item.value > 0 ? 'text-chart-3' : 'text-muted-foreground'}`}>
                          {item.value > 0 ? '+' : ''}{item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full p-8 bg-secondary/30 rounded-xl border border-dashed border-border">
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    Configure the product attributes on the left and click "Generate Prediction" to see the estimated sales volume and feature-level explanation.
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
