import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { modelResults, modelComparison, predictedVsActual } from "@/data/zaraData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ReferenceLine,
  Legend,
} from "recharts";

const SectionLabel = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-baseline gap-3">
    <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{number}</span>
    <span className="font-display text-lg font-semibold text-foreground">{title}</span>
  </div>
);

const MetricBox = ({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) => (
  <div className={`text-center p-3 rounded-lg ${highlight ? 'bg-primary/5 border border-primary/20' : 'bg-secondary'}`}>
    <p className={`text-lg font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const ModelPerformance = () => {
  const bestModel = modelComparison.reduce((best, current) => 
    current.r2 > best.r2 ? current : best
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2 py-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Part 2</p>
        <h2 className="text-3xl font-display font-bold text-foreground">Predictive Analytics</h2>
        <p className="text-muted-foreground max-w-xl">Five models compared using 5-fold cross-validation and a 70/30 train-test split.</p>
      </div>

      {/* Model Comparison Table */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="2.7" title="Model Comparison — All Results" />
          <CardDescription className="mt-2">Lower MAE/RMSE is better. Higher R² is better. Best model highlighted.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Model</th>
                  <th className="p-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">MAE</th>
                  <th className="p-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">RMSE</th>
                  <th className="p-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">R²</th>
                  <th className="p-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Rank</th>
                </tr>
              </thead>
              <tbody>
                {modelComparison
                  .slice()
                  .sort((a, b) => b.r2 - a.r2)
                  .map((model, idx) => {
                    const isBest = model.model === bestModel.model;
                    return (
                      <tr key={idx} className={`border-b border-border/50 ${isBest ? 'bg-primary/5' : 'hover:bg-secondary/30'} transition-colors`}>
                        <td className="p-3 font-medium text-foreground">
                          {model.model}
                          {isBest && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Best</span>}
                        </td>
                        <td className="p-3 text-center font-mono text-sm">{model.mae.toFixed(1)}</td>
                        <td className="p-3 text-center font-mono text-sm">{model.rmse.toFixed(1)}</td>
                        <td className="p-3 text-center font-mono text-sm font-bold">{model.r2.toFixed(3)}</td>
                        <td className="p-3 text-center font-mono text-sm">#{idx + 1}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* R² Bar Chart */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">R² Score by Model</CardTitle>
          <CardDescription>Higher bars indicate better fit. The baseline (Linear Regression) is shown for reference.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={modelComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="model" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 0.55]} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="r2" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="R² Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Model Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linear Regression */}
        <Card className="chart-container">
          <CardHeader>
            <SectionLabel number="2.2" title="Linear Regression (Baseline)" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <MetricBox label="MAE" value={modelResults.linearRegression.metrics.mae} />
              <MetricBox label="RMSE" value={modelResults.linearRegression.metrics.rmse} />
              <MetricBox label="R²" value={modelResults.linearRegression.metrics.r2} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The baseline model explains only 14.2% of variance in sales. This confirms 
              that the relationship between features and sales volume is not purely linear, 
              motivating the use of tree-based and neural approaches.
            </p>
          </CardContent>
        </Card>

        {/* Decision Tree */}
        <Card className="chart-container">
          <CardHeader>
            <SectionLabel number="2.3" title="Decision Tree (GridSearchCV)" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="font-mono text-xs">max_depth = {modelResults.decisionTree.bestParams.max_depth}</Badge>
              <Badge variant="outline" className="font-mono text-xs">min_samples_leaf = {modelResults.decisionTree.bestParams.min_samples_leaf}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <MetricBox label="MAE" value={modelResults.decisionTree.metrics.mae} />
              <MetricBox label="RMSE" value={modelResults.decisionTree.metrics.rmse} />
              <MetricBox label="R²" value={modelResults.decisionTree.metrics.r2} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A modest improvement over the baseline. The optimal depth of 5 limits complexity 
              while capturing key split points around price and product position.
            </p>
          </CardContent>
        </Card>

        {/* Random Forest */}
        <Card className="chart-container">
          <CardHeader>
            <SectionLabel number="2.4" title="Random Forest (GridSearchCV)" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="font-mono text-xs">n_estimators = {modelResults.randomForest.bestParams.n_estimators}</Badge>
              <Badge variant="outline" className="font-mono text-xs">max_depth = {modelResults.randomForest.bestParams.max_depth}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <MetricBox label="MAE" value={modelResults.randomForest.metrics.mae} />
              <MetricBox label="RMSE" value={modelResults.randomForest.metrics.rmse} />
              <MetricBox label="R²" value={modelResults.randomForest.metrics.r2} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The ensemble of 100 trees significantly reduces variance. R² = 0.387 represents 
              a 172% improvement over the linear baseline.
            </p>
          </CardContent>
        </Card>

        {/* XGBoost */}
        <Card className="chart-container border-2 border-primary/20">
          <CardHeader>
            <SectionLabel number="2.5" title="XGBoost — Best Performer" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="default" className="font-mono text-xs">n_estimators = {modelResults.xgboost.bestParams.n_estimators}</Badge>
              <Badge variant="default" className="font-mono text-xs">max_depth = {modelResults.xgboost.bestParams.max_depth}</Badge>
              <Badge variant="default" className="font-mono text-xs">learning_rate = {modelResults.xgboost.bestParams.learning_rate}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <MetricBox label="MAE" value={modelResults.xgboost.metrics.mae} highlight />
              <MetricBox label="RMSE" value={modelResults.xgboost.metrics.rmse} highlight />
              <MetricBox label="R²" value={modelResults.xgboost.metrics.r2} highlight />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gradient boosting captures complex feature interactions and achieves the best 
              overall performance. R² = 0.474 explains nearly half of sales variance.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Neural Network */}
      <Card className="chart-container">
        <CardHeader>
          <SectionLabel number="2.6" title="Neural Network (MLP) — Training History" />
          <CardDescription className="mt-2">
            Architecture: {modelResults.neuralNetwork.architecture.join(' → ')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={modelResults.neuralNetwork.trainingHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="epoch" stroke="hsl(var(--muted-foreground))" fontSize={11} label={{ value: 'Epoch', position: 'insideBottom', offset: -5, fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} label={{ value: 'Loss', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="trainLoss" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Training Loss" dot={false} />
              <Line type="monotone" dataKey="valLoss" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Validation Loss" strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <MetricBox label="MAE" value={modelResults.neuralNetwork.metrics.mae} />
            <MetricBox label="RMSE" value={modelResults.neuralNetwork.metrics.rmse} />
            <MetricBox label="R²" value={modelResults.neuralNetwork.metrics.r2} />
          </div>
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg border-l-2 border-muted-foreground/30">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Training and validation loss converge smoothly with minimal gap, indicating low overfitting. 
              The MLP ranks second overall (R² = 0.432), competitive with XGBoost but at higher computational cost.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Predicted vs Actual */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">Predicted vs. Actual Sales — XGBoost (Test Set)</CardTitle>
          <CardDescription>Points on the diagonal line represent perfect predictions. Spread indicates error magnitude.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="actual" name="Actual" stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 3500]} label={{ value: 'Actual Sales (units)', position: 'insideBottom', offset: -5, fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis dataKey="predicted" name="Predicted" stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 3500]} label={{ value: 'Predicted Sales (units)', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Scatter data={predictedVsActual} fill="hsl(var(--chart-1))" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Analysis */}
      <Card className="chart-container border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="font-display">Analysis and Trade-offs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">
            <strong>XGBoost is the top performer</strong> with R² = 0.474, explaining nearly half of sales variance. 
            This is a 234% improvement over the linear regression baseline and confirms that gradient boosting 
            effectively captures the non-linear relationships in this retail dataset.
          </p>
          <p className="text-foreground leading-relaxed">
            <strong>Trade-offs worth noting:</strong> Decision Trees are the most interpretable but least accurate. 
            The Neural Network matches Random Forest in performance but requires more tuning and compute. 
            For production use, XGBoost offers the best balance of accuracy, speed, and deployability.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelPerformance;
