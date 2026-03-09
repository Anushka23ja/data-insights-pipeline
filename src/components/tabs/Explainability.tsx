import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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
  ReferenceLine,
} from "recharts";
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";

const Explainability = () => {
  const [price, setPrice] = useState([89.9]);
  const [position, setPosition] = useState<string>("Aisle");
  const [promotion, setPromotion] = useState(false);
  const [seasonal, setSeasonal] = useState(false);
  const [category, setCategory] = useState<string>("jackets");
  const [selectedModel, setSelectedModel] = useState<string>("xgboost");
  const [prediction, setPrediction] = useState<number | null>(null);

  // Simulated prediction function
  const makePrediction = () => {
    // Base prediction
    let pred = datasetStats.salesVolumeRange.mean;
    
    // Price impact (negative correlation)
    pred -= (price[0] - 89.9) * 3.5;
    
    // Position impact
    if (position === "Aisle") pred += 86;
    else if (position === "Front of Store") pred += 47;
    else pred -= 50;
    
    // Promotion impact
    if (promotion) pred -= 135;
    
    // Seasonal impact
    if (seasonal) pred -= 79;
    
    // Category impact
    if (category === "jackets") pred += 78;
    else if (category === "jeans") pred += 23;
    else if (category === "sweaters") pred -= 67;
    else if (category === "t-shirts") pred -= 144;
    
    // Model-specific adjustment
    if (selectedModel === "linear") pred *= 0.85;
    else if (selectedModel === "rf") pred *= 0.95;
    
    // Add some randomness
    pred += Math.random() * 100 - 50;
    
    // Clamp to realistic range
    pred = Math.max(500, Math.min(3000, Math.round(pred)));
    
    setPrediction(pred);
  };

  // Generate waterfall data for current prediction
  const generateWaterfallData = () => {
    const base = datasetStats.salesVolumeRange.mean;
    const contributions = [
      { feature: `Price ($${price[0].toFixed(2)})`, value: -(price[0] - 89.9) * 3.5, color: price[0] > 89.9 ? 'destructive' : 'positive' },
      { feature: `Position: ${position}`, value: position === "Aisle" ? 86 : position === "Front of Store" ? 47 : -50, color: position === "End-cap" ? 'destructive' : 'positive' },
      { feature: `Promotion: ${promotion ? 'Yes' : 'No'}`, value: promotion ? -135 : 0, color: promotion ? 'destructive' : 'neutral' },
      { feature: `Seasonal: ${seasonal ? 'Yes' : 'No'}`, value: seasonal ? -79 : 0, color: seasonal ? 'destructive' : 'neutral' },
      { feature: `Category: ${category}`, value: category === "jackets" ? 78 : category === "jeans" ? 23 : category === "sweaters" ? -67 : -144, color: category === "jackets" || category === "jeans" ? 'positive' : 'destructive' },
    ];
    return contributions;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2 py-4">
        <h2 className="text-3xl font-display font-bold text-foreground">Explainability & Interactive Prediction</h2>
        <p className="text-muted-foreground">SHAP analysis and real-time predictions</p>
      </div>

      {/* SHAP Feature Importance */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">SHAP Feature Importance (XGBoost)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shapValues} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis type="category" dataKey="feature" stroke="hsl(var(--muted-foreground))" fontSize={12} width={160} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {shapValues.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.direction === 'negative' ? 'hsl(var(--destructive))' : entry.direction === 'positive' ? 'hsl(var(--chart-3))' : 'hsl(var(--chart-1))'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-sm text-muted-foreground">Negative Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-3" />
              <span className="text-sm text-muted-foreground">Positive Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-1" />
              <span className="text-sm text-muted-foreground">Mixed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SHAP Interpretation */}
      <Card className="chart-container border-l-4 border-l-chart-3">
        <CardHeader>
          <CardTitle className="font-display">SHAP Interpretation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">
            <strong>Price is the most influential feature</strong> with mean |SHAP| of 0.312. Higher prices consistently 
            drive predictions lower — every $10 increase above the median price reduces predicted sales by approximately 35 units.
          </p>
          <p className="text-foreground leading-relaxed">
            <strong>Store positioning matters significantly.</strong> Products in Aisle locations receive positive SHAP contributions, 
            while End-cap positions show mixed effects. This suggests merchandising teams should prioritize aisle placement for 
            high-volume goals.
          </p>
          <p className="text-foreground leading-relaxed">
            <strong>Counterintuitively, promotions show negative SHAP values.</strong> This likely reflects that promotions are 
            applied to slower-moving inventory, rather than causing lower sales. Decision-makers should interpret this as a 
            correlation artifact rather than causal relationship.
          </p>
        </CardContent>
      </Card>

      {/* Waterfall Example */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            SHAP Waterfall: Low-Sales Product Example
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-secondary rounded-lg">
            <p className="font-medium text-foreground">{waterfallExample.productName}</p>
            <p className="text-sm text-muted-foreground">
              Actual: {waterfallExample.actualSales} units | Predicted: {waterfallExample.predictedSales} units
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-foreground">Base Value (Mean)</span>
              <span className="font-mono text-foreground">{waterfallExample.baseValue}</span>
            </div>
            {waterfallExample.contributions.map((contrib, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span className="text-sm text-foreground">{contrib.feature}</span>
                <span className={`font-mono ${contrib.direction === 'negative' ? 'text-destructive' : 'text-chart-3'}`}>
                  {contrib.contribution > 0 ? '+' : ''}{contrib.contribution}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border-2 border-accent">
              <span className="text-sm font-bold text-foreground">Final Prediction</span>
              <span className="font-mono font-bold text-accent">{waterfallExample.predictedSales}</span>
            </div>
          </div>
          <p className="insight-text mt-4">
            This premium leather jacket ($439) shows how price dominates the prediction — contributing -524 units alone. 
            Front of Store placement and promotional status compound the negative impact. This explains why luxury items 
            have lower unit sales despite high revenue potential.
          </p>
        </CardContent>
      </Card>

      {/* Interactive Prediction */}
      <Card className="chart-container border-2 border-accent/30">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Interactive Prediction Tool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Controls */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="model-select">Select Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xgboost">XGBoost (Best)</SelectItem>
                    <SelectItem value="rf">Random Forest</SelectItem>
                    <SelectItem value="nn">Neural Network</SelectItem>
                    <SelectItem value="linear">Linear Regression</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price: ${price[0].toFixed(2)}</Label>
                <Slider
                  value={price}
                  onValueChange={setPrice}
                  min={12.99}
                  max={450}
                  step={5}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position-select">Product Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aisle">Aisle</SelectItem>
                    <SelectItem value="End-cap">End-cap</SelectItem>
                    <SelectItem value="Front of Store">Front of Store</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-select">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jackets">Jackets</SelectItem>
                    <SelectItem value="t-shirts">T-Shirts</SelectItem>
                    <SelectItem value="jeans">Jeans</SelectItem>
                    <SelectItem value="sweaters">Sweaters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="promotion-switch">Promotion Active</Label>
                <Switch
                  id="promotion-switch"
                  checked={promotion}
                  onCheckedChange={setPromotion}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="seasonal-switch">Seasonal Item</Label>
                <Switch
                  id="seasonal-switch"
                  checked={seasonal}
                  onCheckedChange={setSeasonal}
                />
              </div>

              <Button onClick={makePrediction} className="w-full bg-primary hover:bg-primary/90">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Prediction
              </Button>
            </div>

            {/* Prediction Result */}
            <div className="space-y-6">
              {prediction !== null ? (
                <>
                  <div className="text-center p-8 bg-accent/10 rounded-xl border-2 border-accent">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Predicted Sales Volume</p>
                    <p className="text-5xl font-display font-bold text-accent">{prediction.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-2">units</p>
                  </div>

                  {/* Feature Contributions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground mb-3">SHAP Contributions</p>
                    {generateWaterfallData().map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-secondary/50">
                        <span className="text-sm text-foreground">{item.feature}</span>
                        <span className={`text-sm font-mono ${item.value < 0 ? 'text-destructive' : item.value > 0 ? 'text-chart-3' : 'text-muted-foreground'}`}>
                          {item.value > 0 ? '+' : ''}{Math.round(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center p-8 bg-secondary rounded-xl">
                  <ArrowRight className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Adjust the parameters and click "Generate Prediction" to see the model output and SHAP contributions.
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
