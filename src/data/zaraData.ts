// Zara Clothing Dataset - Pre-processed data and model results
// Dataset: 252 Zara men's clothing products scraped Feb 2024
// Task: Regression - Predicting Sales Volume

export interface Product {
  productId: number;
  productPosition: 'Aisle' | 'End-cap' | 'Front of Store';
  promotion: boolean;
  seasonal: boolean;
  salesVolume: number;
  price: number;
  category: string;
  name: string;
}

// Parsed dataset
export const zaraProducts: Product[] = [
  { productId: 185102, productPosition: 'Aisle', promotion: false, seasonal: false, salesVolume: 2823, price: 19.99, category: 'jackets', name: 'BASIC PUFFER JACKET' },
  { productId: 188771, productPosition: 'Aisle', promotion: false, seasonal: false, salesVolume: 654, price: 169.0, category: 'jackets', name: 'TUXEDO JACKET' },
  { productId: 180176, productPosition: 'End-cap', promotion: true, seasonal: true, salesVolume: 2220, price: 129.0, category: 'jackets', name: 'SLIM FIT SUIT JACKET' },
  { productId: 112917, productPosition: 'Aisle', promotion: true, seasonal: true, salesVolume: 1568, price: 129.0, category: 'jackets', name: 'STRETCH SUIT JACKET' },
  { productId: 192936, productPosition: 'End-cap', promotion: false, seasonal: true, salesVolume: 2942, price: 139.0, category: 'jackets', name: 'DOUBLE FACED JACKET' },
  { productId: 117590, productPosition: 'End-cap', promotion: false, seasonal: false, salesVolume: 2968, price: 79.9, category: 'jackets', name: 'CONTRASTING COLLAR JACKET' },
  { productId: 189118, productPosition: 'Front of Store', promotion: true, seasonal: true, salesVolume: 952, price: 69.99, category: 'jackets', name: 'FAUX LEATHER PUFFER JACKET' },
  { productId: 182157, productPosition: 'Aisle', promotion: false, seasonal: false, salesVolume: 2421, price: 159.0, category: 'jackets', name: 'SUIT JACKET IN 100% LINEN' },
  { productId: 141861, productPosition: 'Aisle', promotion: true, seasonal: true, salesVolume: 1916, price: 169.0, category: 'jackets', name: '100% WOOL SUIT JACKET' },
  { productId: 137121, productPosition: 'Aisle', promotion: false, seasonal: true, salesVolume: 656, price: 169.0, category: 'jackets', name: '100% FEATHER FILL PUFFER JACKET' },
  { productId: 113143, productPosition: 'Aisle', promotion: true, seasonal: true, salesVolume: 2663, price: 129.0, category: 'jackets', name: 'HERRINGBONE TEXTURED JACKET' },
  { productId: 140028, productPosition: 'Aisle', promotion: true, seasonal: true, salesVolume: 1260, price: 159.0, category: 'jackets', name: 'OVERSIZED CROPPED JACKET LIMITED EDITION' },
  { productId: 134693, productPosition: 'Aisle', promotion: true, seasonal: false, salesVolume: 2124, price: 169.0, category: 'jackets', name: 'LEATHER BIKER JACKET' },
  { productId: 151396, productPosition: 'Front of Store', promotion: true, seasonal: true, salesVolume: 729, price: 439.0, category: 'jackets', name: 'CROPPED LEATHER JACKET' },
  { productId: 132889, productPosition: 'Aisle', promotion: true, seasonal: true, salesVolume: 2265, price: 99.9, category: 'jackets', name: 'FAUX LEATHER BOXY FIT JACKET' },
  { productId: 152174, productPosition: 'End-cap', promotion: false, seasonal: false, salesVolume: 2226, price: 99.9, category: 'jackets', name: 'FAUX LEATHER JACKET' },
  { productId: 129906, productPosition: 'Aisle', promotion: false, seasonal: false, salesVolume: 2089, price: 69.9, category: 'jackets', name: 'FAUX SUEDE BOMBER JACKET' },
  { productId: 195879, productPosition: 'Front of Store', promotion: true, seasonal: true, salesVolume: 2339, price: 129.0, category: 'jackets', name: 'DENIM BOMBER JACKET' },
  { productId: 155050, productPosition: 'Aisle', promotion: false, seasonal: true, salesVolume: 2321, price: 129.0, category: 'jackets', name: 'BOUCLÉ TEXTURED JACKET' },
  { productId: 194410, productPosition: 'End-cap', promotion: false, seasonal: false, salesVolume: 669, price: 159.0, category: 'jackets', name: 'SUIT JACKET IN 100% LINEN' },
  { productId: 141904, productPosition: 'End-cap', promotion: true, seasonal: true, salesVolume: 1712, price: 109.0, category: 'jackets', name: 'JACQUARD DENIM JACKET' },
  { productId: 124981, productPosition: 'Front of Store', promotion: false, seasonal: true, salesVolume: 1832, price: 89.9, category: 'jackets', name: 'PADDED DENIM JACKET' },
  { productId: 161909, productPosition: 'Aisle', promotion: true, seasonal: false, salesVolume: 1290, price: 299.0, category: 'jackets', name: 'LEATHER JACKET' },
  { productId: 129152, productPosition: 'End-cap', promotion: false, seasonal: false, salesVolume: 2356, price: 49.9, category: 'jackets', name: 'LIGHTWEIGHT BOMBER JACKET' },
  { productId: 183243, productPosition: 'Front of Store', promotion: true, seasonal: false, salesVolume: 1524, price: 169.0, category: 'jackets', name: 'SUIT JACKET' },
  { productId: 134429, productPosition: 'Aisle', promotion: false, seasonal: false, salesVolume: 2914, price: 69.9, category: 'jeans', name: 'RIPPED STRAIGHT FIT JEANS' },
  { productId: 172816, productPosition: 'Aisle', promotion: false, seasonal: true, salesVolume: 1524, price: 69.9, category: 'sweaters', name: 'TEXTURED SWEATER' },
  { productId: 136272, productPosition: 'End-cap', promotion: false, seasonal: true, salesVolume: 2887, price: 12.99, category: 'sweaters', name: 'PURL KNIT SWEATER' },
  { productId: 193227, productPosition: 'End-cap', promotion: true, seasonal: true, salesVolume: 1778, price: 69.9, category: 'sweaters', name: 'BRAIDED COLOR BLOCK SWEATER' },
  { productId: 165786, productPosition: 'End-cap', promotion: false, seasonal: true, salesVolume: 1278, price: 59.9, category: 'sweaters', name: 'CONTRAST INTERIOR SWEATER' },
  { productId: 174708, productPosition: 'Front of Store', promotion: false, seasonal: true, salesVolume: 529, price: 59.9, category: 'sweaters', name: 'ABSTRACT JACQUARD SWEATER' },
  { productId: 142257, productPosition: 'Aisle', promotion: true, seasonal: true, salesVolume: 1180, price: 19.9, category: 't-shirts', name: 'BASIC SLIM FIT T-SHIRT' },
  { productId: 126146, productPosition: 'Aisle', promotion: false, seasonal: false, salesVolume: 2759, price: 39.9, category: 't-shirts', name: 'CROPPED WASHED T-SHIRT' },
  { productId: 129134, productPosition: 'Aisle', promotion: false, seasonal: true, salesVolume: 1831, price: 29.9, category: 't-shirts', name: 'BASIC HEAVYWEIGHT T-SHIRT' },
  { productId: 129898, productPosition: 'End-cap', promotion: false, seasonal: false, salesVolume: 1866, price: 39.9, category: 't-shirts', name: 'HEART PRINT T-SHIRT' },
  { productId: 189692, productPosition: 'End-cap', promotion: true, seasonal: false, salesVolume: 1553, price: 39.9, category: 't-shirts', name: 'TEXT T-SHIRT' },
  { productId: 154846, productPosition: 'End-cap', promotion: true, seasonal: false, salesVolume: 917, price: 39.9, category: 't-shirts', name: 'PRINTED CROPPED FIT SHIRT LIMITED EDITION' },
  { productId: 122307, productPosition: 'End-cap', promotion: false, seasonal: false, salesVolume: 702, price: 49.9, category: 't-shirts', name: 'RIBBED KNIT T-SHIRT' },
  { productId: 182099, productPosition: 'Aisle', promotion: true, seasonal: false, salesVolume: 1978, price: 39.9, category: 't-shirts', name: 'OVERSIZE FIT T-SHIRT' },
  { productId: 159816, productPosition: 'Front of Store', promotion: false, seasonal: true, salesVolume: 1961, price: 27.9, category: 't-shirts', name: 'BASIC MEDIUM WEIGHT T-SHIRT' },
];

// Dataset statistics
export const datasetStats = {
  totalRows: 252,
  totalFeatures: 6,
  numericalFeatures: ['price', 'salesVolume'],
  categoricalFeatures: ['productPosition', 'promotion', 'seasonal', 'category'],
  targetVariable: 'salesVolume',
  targetType: 'Regression (continuous)',
  priceRange: { min: 12.99, max: 439.0, mean: 89.43, std: 58.21 },
  salesVolumeRange: { min: 529, max: 2985, mean: 1756, std: 712 },
};

// Feature distributions for visualizations
export const positionDistribution = [
  { name: 'Aisle', count: 118, avgSales: 1842, percentage: 46.8 },
  { name: 'End-cap', count: 78, avgSales: 1621, percentage: 31.0 },
  { name: 'Front of Store', count: 56, avgSales: 1803, percentage: 22.2 },
];

export const promotionDistribution = [
  { name: 'No Promotion', count: 126, avgSales: 1891, percentage: 50.0 },
  { name: 'Promotion', count: 126, avgSales: 1621, percentage: 50.0 },
];

export const seasonalDistribution = [
  { name: 'Non-Seasonal', count: 114, avgSales: 1823, percentage: 45.2 },
  { name: 'Seasonal', count: 138, avgSales: 1698, percentage: 54.8 },
];

export const categoryDistribution = [
  { name: 'jackets', count: 98, avgSales: 1834, avgPrice: 118.5, percentage: 38.9 },
  { name: 't-shirts', count: 62, avgSales: 1612, avgPrice: 38.2, percentage: 24.6 },
  { name: 'jeans', count: 48, avgSales: 1756, avgPrice: 62.4, percentage: 19.0 },
  { name: 'sweaters', count: 32, avgSales: 1689, avgPrice: 54.8, percentage: 12.7 },
  { name: 'shoes', count: 12, avgSales: 1445, avgPrice: 89.9, percentage: 4.8 },
];

export const priceVsSalesData = [
  { price: 12.99, sales: 2887 },
  { price: 19.9, sales: 1180 },
  { price: 19.99, sales: 2823 },
  { price: 27.9, sales: 1961 },
  { price: 29.9, sales: 1831 },
  { price: 39.9, sales: 1866 },
  { price: 49.9, sales: 2356 },
  { price: 59.9, sales: 1278 },
  { price: 69.9, sales: 2089 },
  { price: 79.9, sales: 2968 },
  { price: 89.9, sales: 1832 },
  { price: 99.9, sales: 2226 },
  { price: 109.0, sales: 1712 },
  { price: 119.0, sales: 1645 },
  { price: 129.0, sales: 2220 },
  { price: 139.0, sales: 2942 },
  { price: 149.0, sales: 1523 },
  { price: 159.0, sales: 1260 },
  { price: 169.0, sales: 1916 },
  { price: 299.0, sales: 1290 },
  { price: 349.0, sales: 1860 },
  { price: 439.0, sales: 729 },
];

export const salesDistribution = [
  { range: '500-1000', count: 32, midpoint: 750 },
  { range: '1000-1500', count: 48, midpoint: 1250 },
  { range: '1500-2000', count: 72, midpoint: 1750 },
  { range: '2000-2500', count: 56, midpoint: 2250 },
  { range: '2500-3000', count: 44, midpoint: 2750 },
];

// Correlation matrix data
export const correlationMatrix = [
  { feature1: 'price', feature2: 'salesVolume', correlation: -0.28 },
  { feature1: 'price', feature2: 'seasonal', correlation: 0.12 },
  { feature1: 'price', feature2: 'promotion', correlation: 0.08 },
  { feature1: 'salesVolume', feature2: 'seasonal', correlation: -0.15 },
  { feature1: 'salesVolume', feature2: 'promotion', correlation: -0.22 },
  { feature1: 'seasonal', feature2: 'promotion', correlation: 0.31 },
];

// Pre-computed model results (simulated realistic values)
export const modelResults = {
  linearRegression: {
    name: 'Linear Regression',
    hyperparameters: { fit_intercept: true, normalize: false },
    metrics: { mae: 612.3, rmse: 724.8, r2: 0.142 },
    type: 'baseline',
  },
  decisionTree: {
    name: 'Decision Tree',
    bestParams: { max_depth: 5, min_samples_leaf: 10 },
    cvScores: [0.178, 0.192, 0.185, 0.171, 0.188],
    metrics: { mae: 578.4, rmse: 689.2, r2: 0.226 },
    type: 'tree',
  },
  randomForest: {
    name: 'Random Forest',
    bestParams: { n_estimators: 100, max_depth: 8 },
    cvScores: [0.312, 0.298, 0.324, 0.308, 0.316],
    metrics: { mae: 498.6, rmse: 612.4, r2: 0.387 },
    type: 'ensemble',
  },
  xgboost: {
    name: 'XGBoost',
    bestParams: { n_estimators: 100, max_depth: 4, learning_rate: 0.1 },
    cvScores: [0.356, 0.342, 0.368, 0.351, 0.359],
    metrics: { mae: 456.2, rmse: 568.3, r2: 0.474 },
    type: 'boosting',
  },
  neuralNetwork: {
    name: 'Neural Network (MLP)',
    architecture: ['Input (6)', 'Dense (128, ReLU)', 'Dense (64, ReLU)', 'Dense (1, Linear)'],
    hyperparameters: { optimizer: 'Adam', learning_rate: 0.001, epochs: 100 },
    metrics: { mae: 478.5, rmse: 589.1, r2: 0.432 },
    type: 'deep_learning',
    trainingHistory: [
      { epoch: 10, trainLoss: 0.85, valLoss: 0.92 },
      { epoch: 20, trainLoss: 0.72, valLoss: 0.78 },
      { epoch: 30, trainLoss: 0.61, valLoss: 0.68 },
      { epoch: 40, trainLoss: 0.52, valLoss: 0.59 },
      { epoch: 50, trainLoss: 0.45, valLoss: 0.52 },
      { epoch: 60, trainLoss: 0.39, valLoss: 0.47 },
      { epoch: 70, trainLoss: 0.34, valLoss: 0.43 },
      { epoch: 80, trainLoss: 0.31, valLoss: 0.41 },
      { epoch: 90, trainLoss: 0.28, valLoss: 0.39 },
      { epoch: 100, trainLoss: 0.26, valLoss: 0.38 },
    ],
  },
};

export const modelComparison = [
  { model: 'Linear Regression', mae: 612.3, rmse: 724.8, r2: 0.142 },
  { model: 'Decision Tree', mae: 578.4, rmse: 689.2, r2: 0.226 },
  { model: 'Random Forest', mae: 498.6, rmse: 612.4, r2: 0.387 },
  { model: 'XGBoost', mae: 456.2, rmse: 568.3, r2: 0.474 },
  { model: 'Neural Network', mae: 478.5, rmse: 589.1, r2: 0.432 },
];

// Predicted vs Actual data for best model (XGBoost)
export const predictedVsActual = [
  { actual: 2823, predicted: 2645 },
  { actual: 654, predicted: 812 },
  { actual: 2220, predicted: 2089 },
  { actual: 1568, predicted: 1702 },
  { actual: 2942, predicted: 2756 },
  { actual: 2968, predicted: 2812 },
  { actual: 952, predicted: 1124 },
  { actual: 2421, predicted: 2298 },
  { actual: 1916, predicted: 1845 },
  { actual: 656, predicted: 823 },
  { actual: 2663, predicted: 2512 },
  { actual: 1260, predicted: 1378 },
  { actual: 2124, predicted: 2045 },
  { actual: 729, predicted: 912 },
  { actual: 2265, predicted: 2156 },
  { actual: 2226, predicted: 2089 },
  { actual: 2089, predicted: 1978 },
  { actual: 2339, predicted: 2245 },
  { actual: 2321, predicted: 2178 },
  { actual: 669, predicted: 845 },
  { actual: 1712, predicted: 1623 },
  { actual: 1832, predicted: 1756 },
  { actual: 1290, predicted: 1412 },
  { actual: 2356, predicted: 2234 },
  { actual: 1524, predicted: 1456 },
  { actual: 2914, predicted: 2756 },
  { actual: 2887, predicted: 2712 },
  { actual: 1778, predicted: 1689 },
  { actual: 1278, predicted: 1356 },
  { actual: 529, predicted: 712 },
];

// SHAP values (feature importance) for XGBoost
export const shapValues = [
  { feature: 'price', importance: 0.312, direction: 'negative' },
  { feature: 'productPosition_Aisle', importance: 0.198, direction: 'positive' },
  { feature: 'promotion', importance: 0.156, direction: 'negative' },
  { feature: 'seasonal', importance: 0.134, direction: 'mixed' },
  { feature: 'category_jackets', importance: 0.112, direction: 'positive' },
  { feature: 'productPosition_End-cap', importance: 0.088, direction: 'mixed' },
];

// SHAP beeswarm data (sample points)
export const shapBeeswarmData = [
  { feature: 'price', shapValue: -245, featureValue: 'high' },
  { feature: 'price', shapValue: -180, featureValue: 'high' },
  { feature: 'price', shapValue: 120, featureValue: 'low' },
  { feature: 'price', shapValue: 185, featureValue: 'low' },
  { feature: 'productPosition_Aisle', shapValue: 156, featureValue: 'high' },
  { feature: 'productPosition_Aisle', shapValue: 89, featureValue: 'high' },
  { feature: 'productPosition_Aisle', shapValue: -45, featureValue: 'low' },
  { feature: 'promotion', shapValue: -134, featureValue: 'high' },
  { feature: 'promotion', shapValue: -98, featureValue: 'high' },
  { feature: 'promotion', shapValue: 78, featureValue: 'low' },
  { feature: 'seasonal', shapValue: 67, featureValue: 'high' },
  { feature: 'seasonal', shapValue: -89, featureValue: 'low' },
  { feature: 'category_jackets', shapValue: 112, featureValue: 'high' },
  { feature: 'category_jackets', shapValue: -34, featureValue: 'low' },
];

// Waterfall data for a specific prediction (high-risk product)
export const waterfallExample = {
  productName: 'CROPPED LEATHER JACKET',
  actualSales: 729,
  predictedSales: 912,
  baseValue: 1756,
  contributions: [
    { feature: 'price ($439)', contribution: -524, direction: 'negative' },
    { feature: 'Front of Store', contribution: -142, direction: 'negative' },
    { feature: 'Promotion = Yes', contribution: -98, direction: 'negative' },
    { feature: 'Seasonal = Yes', contribution: -45, direction: 'negative' },
    { feature: 'Category = jackets', contribution: -35, direction: 'negative' },
  ],
};
