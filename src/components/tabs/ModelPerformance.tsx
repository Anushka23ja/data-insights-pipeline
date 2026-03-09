import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "recharts";
import { CheckCircle2, Award } from "lucide-react";

const ModelPerformance = () => {
  const bestModel = modelComparison.reduce((best, current) => 
    current.r2 > best.r2 ? current : best
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2 py-4">
        <h2 className="text-3xl font-display font-bold text-foreground">Model Performance</h2>
        <p className="text-muted-foreground">Comparing 5 models with cross-validation and hyperparameter tuning</p>
      </div>

      {/* Model Comparison Summary */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Model Comparison Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-left text-muted-foreground">Model</th>
                  <th className="p-3 text-center text-muted-foreground">MAE ↓</th>
                  <th className="p-3 text-center text-muted-foreground">RMSE ↓</th>
                  <th className="p-3 text-center text-muted-foreground">R² ↑</th>
                  <th className="p-3 text-center text-muted-foreground">Rank</th>
                </tr>
              </thead>
              <tbody>
                {modelComparison.map((model, idx) => {
                  const rank = modelComparison.slice().sort((a, b) => b.r2 - a.r2).findIndex(m => m.model === model.model) + 1;
                  const isBest = model.model === bestModel.model;
                  return (
                    <tr key={idx} className={`border-b border-border/50 ${isBest ? 'bg-accent/5' : ''}`}>
                      <td className="p-3 font-medium text-foreground flex items-center gap-2">
                        {model.model}
                        {isBest && <Badge variant="default" className="bg-accent text-accent-foreground">Best</Badge>}
                      </td>
                      <td className="p-3 text-center font-mono">{model.mae.toFixed(1)}</td>
                      <td className="p-3 text-center font-mono">{model.rmse.toFixed(1)}</td>
                      <td className="p-3 text-center font-mono font-bold">{model.r2.toFixed(3)}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rank === 1 ? 'bg-accent text-accent-foreground' : 
                          rank <= 3 ? 'bg-chart-3/20 text-chart-3' : 'bg-secondary text-muted-foreground'
                        }`}>
                          #{rank}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* R² Comparison Chart */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">R² Score Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 0.5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis type="category" dataKey="model" stroke="hsl(var(--muted-foreground))" fontSize={12} width={130} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="r2" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]}>
                {modelComparison.map((entry, index) => (
                  <rect key={index} fill={entry.model === bestModel.model ? 'hsl(var(--accent))' : 'hsl(var(--chart-1))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Model Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linear Regression */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              2.2 Linear Regression (Baseline)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-secondary rounded-lg">
                <p className="text-lg font-bold text-foreground">{modelResults.linearRegression.metrics.mae}</p>
                <p className="text-xs text-muted-foreground">MAE</p>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <p className="text-lg font-bold text-foreground">{modelResults.linearRegression.metrics.rmse}</p>
                <p className="text-xs text-muted-foreground">RMSE</p>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <p className="text-lg font-bold text-foreground">{modelResults.linearRegression.metrics.r2}</p>
                <p className="text-xs text-muted-foreground">R²</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Linear regression serves as our baseline. With R² = 0.142, it explains only 14% of sales variance, 
              indicating non-linear relationships in the data.
            </p>
          </CardContent>
        </Card>

        {/* Decision Tree */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="font-display text-lg">2.3 Decision Tree (with CV)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">max_depth: {modelResults.decisionTree.bestParams.max_depth}</Badge>
              <Badge variant="outline">min_samples_leaf: {modelResults.decisionTree.bestParams.min_samples_leaf}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-secondary rounded-lg">
                <p className="text-lg font-bold text-foreground">{modelResults.decisionTree.metrics.mae}</p>
                <p className="text-xs text-muted-foreground">MAE</p>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <p className="text-lg font-bold text-foreground">{modelResults.decisionTree.metrics.rmse}</p>
                <p className="text-xs text-muted-foreground">RMSE</p>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <p className="text-lg font-bold text-foreground">{modelResults.decisionTree.metrics.r2}</p>
                <p className="text-xs text-muted-foreground">R²</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              5-fold CV GridSearch found optimal depth of 5. Modest improvement over baseline with R² = 0.226.
            </p>
          </CardContent>
        </Card>

        {/* Random Forest */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="font-display text-lg">2.4 Random Forest (with CV)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">n_estimators: {modelResults.randomForest.bestParams.n_estimators}</Badge>
              <Badge variant="outline">max_depth: {modelResults.randomForest.bestParams.max_depth}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-secondary rounded-lg">
                <p className="text-lg font-bold text-foreground">{modelResults.randomForest.metrics.mae}</p>
                <p className="text-xs text-muted-foreground">MAE</p>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <p className="text-lg font-bold text-foreground">{modelResults.randomForest.metrics.rmse}</p>
                <p className="text-xs text-muted-foreground">RMSE</p>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <p className="text-lg font-bold text-foreground">{modelResults.randomForest.metrics.r2}</p>
                <p className="text-xs text-muted-foreground">R²</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Ensemble approach significantly improves performance. R² = 0.387 represents 172% improvement over baseline.
            </p>
          </CardContent>
        </Card>

        {/* XGBoost */}
        <Card className="chart-container border-2 border-accent/30">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              2.5 XGBoost (Best Model)
              <CheckCircle2 className="h-5 w-5 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="default" className="bg-accent text-accent-foreground">n_estimators: {modelResults.xgboost.bestParams.n_estimators}</Badge>
              <Badge variant="default" className="bg-accent text-accent-foreground">max_depth: {modelResults.xgboost.bestParams.max_depth}</Badge>
              <Badge variant="default" className="bg-accent text-accent-foreground">learning_rate: {modelResults.xgboost.bestParams.learning_rate}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-accent/10 rounded-lg">
                <p className="text-lg font-bold text-foreground">{modelResults.xgboost.metrics.mae}</p>
                <p className="text-xs text-muted-foreground">MAE</p>
              </div>
              <div className="text-center p-3 bg-accent/10 rounded-lg">
                <p className="text-lg font-bold text-foreground">{modelResults.xgboost.metrics.rmse}</p>
                <p className="text-xs text-muted-foreground">RMSE</p>
              </div>
              <div className="text-center p-3 bg-accent/10 rounded-lg">
                <p className="text-lg font-bold text-accent">{modelResults.xgboost.metrics.r2}</p>
                <p className="text-xs text-muted-foreground">R²</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              XGBoost achieves best performance with R² = 0.474. Gradient boosting captures complex feature interactions effectively.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Neural Network Training */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">2.6 Neural Network Training History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {modelResults.neuralNetwork.architecture.map((layer, idx) => (
              <Badge key={idx} variant="secondary">{layer}</Badge>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={modelResults.neuralNetwork.trainingHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="epoch" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="trainLoss" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Training Loss" dot={false} />
              <Line type="monotone" dataKey="valLoss" stroke="hsl(var(--accent))" strokeWidth={2} name="Validation Loss" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <p className="insight-text mt-4">
            The MLP shows smooth convergence with minimal overfitting (training and validation loss converge). 
            Final R² = 0.432 places it second after XGBoost, demonstrating neural networks can be competitive on tabular data.
          </p>
        </CardContent>
      </Card>

      {/* Predicted vs Actual */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="font-display">Predicted vs Actual (XGBoost)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="actual" name="Actual Sales" stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 3500]} />
              <YAxis dataKey="predicted" name="Predicted Sales" stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 3500]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} 
              />
              <ReferenceLine x={0} y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" segment={[{ x: 0, y: 0 }, { x: 3500, y: 3500 }]} />
              <Scatter data={predictedVsActual} fill="hsl(var(--accent))" />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="insight-text mt-4">
            Points cluster closely around the diagonal line (perfect prediction), indicating good model fit. 
            Slight underprediction at very high sales values suggests potential for improvement with more data.
          </p>
        </CardContent>
      </Card>

      {/* Model Analysis */}
      <Card className="chart-container border-l-4 border-l-accent">
        <CardHeader>
          <CardTitle className="font-display">2.7 Analysis & Trade-offs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">
            <strong>XGBoost emerged as the best performer</strong> with R² = 0.474, explaining nearly half of the variance in sales volume. 
            This represents a <strong>234% improvement</strong> over the linear regression baseline, validating the use of 
            ensemble gradient boosting for this retail forecasting task.
          </p>
          <p className="text-foreground leading-relaxed">
            <strong>Key trade-offs to consider:</strong> While XGBoost offers the best accuracy, Decision Trees provide superior 
            interpretability — important for explaining decisions to business stakeholders. The Neural Network achieved competitive 
            results (R² = 0.432) but requires more computational resources and hyperparameter tuning. For production deployment, 
            XGBoost offers the best balance of accuracy, training speed, and model size.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelPerformance;
