# InsightIQ-Smart-Business-Analytics-Emotion-Intelligence-Platform

deployed here : [RENDER](/)

## Overview
This project is a comprehensive business analytics dashboard with an integrated emotion intelligence module. It combines traditional business data analysis with real-time emotion detection and sentiment analysis.

---

## 🧮 Algorithms Used in the Project

### 1. **Text Sentiment Analysis Algorithms**

#### a. **TF-IDF Vectorization** (Term Frequency-Inverse Document Frequency)
- **Location**: `app.py` lines 39, 111, 409
- **Purpose**: Converts text reviews into numerical features
- **Configuration**: 
  - Max features: 2000
  - N-gram range: (1, 2) - captures both single words and word pairs
- **How it works**: 
  - Weights words by their importance (frequent in document, rare across corpus)
  - Creates a sparse matrix representation of text data

#### b. **LinearSVC (Linear Support Vector Classifier)**
- **Location**: `app.py` line 40, 113
- **Purpose**: Classifies sentiment as Positive, Negative, or Neutral
- **Configuration**:
  - Random state: 42 (for reproducibility)
  - Dual: True (optimized for sparse data)
  - Max iterations: 2000
- **Why LinearSVC**: 
  - Fast and efficient for large text datasets
  - Works well with sparse TF-IDF features
  - Good performance on high-dimensional data

#### c. **Hugging Face Transformers Pipeline**
- **Location**: `app.py` line 42, 535
- **Purpose**: Pre-trained sentiment analysis model (likely DistilBERT or similar)
- **Used for**: Real-time sentiment analysis in emotion-intel module
- **Advantage**: State-of-the-art accuracy without training

### 2. **Time Series Forecasting Algorithms**

#### a. **Linear Regression**
- **Location**: `app.py` lines 219, 239, 284
- **Purpose**: Predicts future values based on historical trends
- **Used for**:
  - Profit forecasting
  - Sales volume forecasting
  - Sentiment trend forecasting
- **Method**: Fits a linear trend line through historical data points
- **Limitation**: Assumes linear relationship (may not capture seasonality)

#### b. **Random Forest Regressor**
- **Location**: `app.py` lines 285, 288
- **Purpose**: Advanced sales forecasting with feature engineering
- **Configuration**:
  - N estimators: 100 trees
  - Max depth: 10
  - Random state: 42
- **Features Created**:
  - Time index
  - Month (1-12)
  - Year
  - Month sine/cosine (captures seasonality)
- **Advantage**: 
  - Captures non-linear patterns
  - Handles seasonality better than linear regression
  - Provides feature importance

### 3. **Computer Vision - Emotion Detection**

#### a. **FER (Facial Expression Recognition) Library**
- **Location**: `app.py` line 41, 506, 579
- **Purpose**: Detects emotions from facial expressions in images
- **Emotions Detected**: happy, sad, angry, fear, surprise, disgust, neutral
- **How it works**:
  - Uses deep learning models (likely CNN-based)
  - Analyzes facial landmarks and expressions
  - Returns confidence scores for each emotion

#### b. **OpenCV (cv2)**
- **Purpose**: Image processing and decoding
- **Used for**: Converting base64 images to numpy arrays for emotion detection

### 4. **Data Processing & Analysis**

#### a. **Pandas Operations**
- Time series resampling (monthly aggregation)
- GroupBy operations for aggregations
- Data cleaning and preprocessing

#### b. **Statistical Analysis**
- Mean Absolute Error (MAE) calculation
- R² Score calculation
- Confusion matrix generation
- Cross-tabulation for heatmaps

---

## 🏗️ How the Whole Site Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (HTML/JS)                        │
│  - index.html: Main analytics dashboard                      │
│  - emotion_intel.html: Emotion intelligence module           │
│  - camera.js: Basic camera emotion detection                 │
│  - emotion-intel.js: Advanced emotion + sentiment analysis   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/JSON
┌─────────────────────────────────────────────────────────────┐
│              Backend (Flask - app.py)                        │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Route: / (index)                                    │   │
│  │  - Renders main dashboard                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Route: /analyze (POST)                             │   │
│  │  - Accepts CSV file upload                          │   │
│  │  - Processes business data                          │   │
│  │  - Generates charts and predictions                 │   │
│  │  - Returns JSON with analysis results               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Route: /emotion-intel                               │   │
│  │  - Renders emotion intelligence interface            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Route: /emotion/log_frame (POST)                   │   │
│  │  - Receives camera frames                           │   │
│  │  - Detects emotions using FER                       │   │
│  │  - Logs to session and CSV                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Route: /emotion/analyze (POST)                      │   │
│  │  - Analyzes text sentiment                          │   │
│  │  - Compares with camera emotions                    │   │
│  │  - Generates behavioral insights                    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Data Storage                              │
│  - emotion_log.csv: Persistent emotion logs                 │
│  - session_emotion_logs: In-memory session data             │
│  - training_data.csv: Sentiment model training data        │
└─────────────────────────────────────────────────────────────┘
```

### Workflow: Main Dashboard (/)

1. **User Uploads CSV** → File contains business data (reviews, sales, profits, etc.)
2. **Data Processing**:
   - Text cleaning (remove stopwords, lowercase, remove special chars)
   - TF-IDF vectorization of reviews
   - Sentiment prediction using trained LinearSVC model
3. **Analysis Generation**:
   - Sentiment distribution (pie chart)
   - Profit/sales trends over time
   - Regional and category analysis
   - Rating vs sentiment heatmap
4. **Forecasting**:
   - Linear regression for profit/sales forecasts
   - Random Forest for advanced sales forecasting
   - Sentiment trend forecasting
5. **Recommendations**:
   - Identifies high-potential categories
   - Suggests optimization opportunities
   - Highlights products to promote/investigate
6. **Response**: JSON with base64-encoded charts and statistics

### Workflow: Emotion Intelligence Module (/emotion-intel)

1. **Camera Initialization**:
   - Requests webcam access
   - Captures frames every 1 second
   - Sends frames to `/emotion/log_frame`

2. **Real-time Emotion Detection**:
   - Each frame is base64 encoded
   - Sent to backend for FER analysis
   - Emotions logged with timestamps and confidence scores
   - Timeline displayed in UI

3. **Text Review Analysis**:
   - User can type or use speech-to-text
   - Text sent to `/emotion/analyze`
   - Hugging Face model analyzes sentiment
   - Latest camera emotion retrieved from timeline

4. **Behavioral Insight Generation**:
   - Compares textual sentiment with camera emotion
   - Detects discrepancies (e.g., positive words but angry face)
   - Generates actionable insights

5. **Data Logging**:
   - All emotions logged to `emotion_log.csv`
   - Session-based tracking for multi-user support

---

## 🎯 Benefits of /emotion-intel Features

### 1. **Multi-Modal Emotion Analysis**
- **Benefit**: Captures both verbal and non-verbal cues
- **Use Case**: Detects when customers say one thing but show different emotions
- **Example**: Customer says "I'm fine" but camera shows sadness → indicates hidden dissatisfaction

### 2. **Real-Time Emotion Tracking**
- **Benefit**: Continuous monitoring during interactions
- **Use Case**: Customer service representatives can see emotional reactions in real-time
- **Example**: Track if customer becomes frustrated during a call

### 3. **Behavioral Insight Generation**
- **Benefit**: Identifies discrepancies between words and expressions
- **Use Case**: 
  - Detects sarcasm (positive words, negative expression)
  - Identifies genuine satisfaction (aligned signals)
  - Flags potential issues (negative words + negative expression)

### 4. **Speech-to-Text Integration**
- **Benefit**: Hands-free review capture
- **Use Case**: Customers can speak reviews naturally
- **Example**: Voice feedback during video calls or in-store interactions

### 5. **Session-Based Tracking**
- **Benefit**: Maintains context across interactions
- **Use Case**: Track emotional journey of a customer throughout their experience
- **Example**: See how emotions change from initial contact to resolution

### 6. **Historical Emotion Distribution**
- **Benefit**: Understand overall emotional patterns
- **Use Case**: Identify if certain interactions consistently lead to negative emotions
- **Example**: 70% of interactions show frustration → indicates systemic issue

### 7. **Confidence Scoring**
- **Benefit**: Reliability indicator for emotion detection
- **Use Case**: Filter out low-confidence detections
- **Example**: Only act on emotions with >80% confidence

### 8. **Persistent Logging**
- **Benefit**: Long-term emotional data for analysis
- **Use Case**: Identify trends over time, train better models
- **Example**: CSV logs can be analyzed to improve customer experience

---

## 📊 Dashboard Benefits & Features

### Overview
The main dashboard (`/`) provides a comprehensive business intelligence platform that transforms raw CSV data into actionable insights through automated analysis, visualization, and predictive modeling.

### 🎯 Key Benefits of Using the Dashboard

#### 1. **Comprehensive Business Intelligence**
- **Benefit**: Single platform for all business analytics needs
- **Use Case**: Eliminates need for multiple tools and manual data analysis
- **Value**: Saves time and reduces errors from manual processing
- **ROI**: Reduces analysis time from hours to minutes

#### 2. **Automated Sentiment Analysis**
- **Benefit**: AI-powered sentiment classification of customer reviews
- **Use Case**: Understand customer satisfaction at scale
- **Value**: 
  - Identifies positive, negative, and neutral sentiments automatically
  - Processes thousands of reviews in seconds
  - No manual reading required
- **Business Impact**: Quick identification of customer pain points

#### 3. **Data-Driven Decision Making**
- **Benefit**: Evidence-based insights replace gut feelings
- **Use Case**: Strategic planning and resource allocation
- **Value**: 
  - Identifies top-performing categories and regions
  - Highlights underperforming areas
  - Provides quantitative metrics for decision-making
- **Business Impact**: Improved profitability through targeted actions

#### 4. **Predictive Analytics**
- **Benefit**: Forecast future trends before they happen
- **Use Case**: Inventory planning, budget allocation, marketing strategy
- **Value**:
  - Predicts next month's profit, sales, and sentiment trends
  - Identifies top-selling products in advance
  - Enables proactive business planning
- **Business Impact**: Reduced risk and better resource optimization

#### 5. **Visual Data Representation**
- **Benefit**: Complex data made understandable through charts
- **Use Case**: Presentations, reports, stakeholder communication
- **Value**:
  - Professional visualizations (pie charts, line graphs, heatmaps)
  - Easy to interpret trends and patterns
  - Export-ready charts for reports
- **Business Impact**: Better communication and faster decision-making

#### 6. **Strategic Recommendations**
- **Benefit**: AI-generated actionable advice
- **Use Case**: Strategic planning and optimization
- **Value**:
  - Identifies high-potential categories to focus on
  - Suggests optimization opportunities
  - Highlights products to promote or investigate
- **Business Impact**: Direct guidance on where to invest resources

#### 7. **Multi-Algorithm Forecasting**
- **Benefit**: Comparison of different forecasting methods
- **Use Case**: More accurate predictions through model comparison
- **Value**:
  - Linear Regression for baseline forecasts
  - Random Forest for advanced pattern recognition
  - Model performance metrics (R², MAE) for validation
- **Business Impact**: Higher confidence in predictions

#### 8. **Trend Identification**
- **Benefit**: Automatic extraction of key themes from negative reviews
- **Use Case**: Product improvement and quality control
- **Value**:
  - Identifies common complaints and issues
  - Highlights recurring problems
  - Enables targeted improvements
- **Business Impact**: Faster problem resolution and product enhancement

#### 9. **Regional & Category Analysis**
- **Benefit**: Geographic and product category insights
- **Use Case**: Market expansion and product strategy
- **Value**:
  - Identifies top-performing regions
  - Highlights profitable categories
  - Enables targeted marketing campaigns
- **Business Impact**: Optimized resource allocation by geography/category

#### 10. **Rating vs Sentiment Correlation**
- **Benefit**: Validates customer ratings with AI sentiment analysis
- **Use Case**: Quality assurance and review authenticity
- **Value**:
  - Detects discrepancies between star ratings and review text
  - Identifies potential fake reviews
  - Validates customer feedback authenticity
- **Business Impact**: More reliable customer feedback data

---

### 📈 Dashboard Features Breakdown

#### **Section 1: Strategic Recommendations**
**Features:**
- **High Potential Categories**: Identifies categories with high profit margins but low sales volume
- **Optimization Opportunities**: Highlights "cash cow" categories needing cost reduction
- **Product Promotion**: Recommends top-performing products to promote
- **Investigation Alerts**: Flags products with low ratings and profits

**Benefits:**
- Immediate actionable insights
- Prioritized recommendations
- Data-backed suggestions

#### **Section 2: Historical Analysis**

##### **2.1 Sentiment Analysis**
- **Pie Chart**: Visual distribution of positive, negative, and neutral sentiments
- **Statistics**: Count and percentage breakdown
- **Use Case**: Quick overview of customer satisfaction

##### **2.2 Key Trends from Negative Reviews**
- **Feature**: TF-IDF-based keyword extraction from negative reviews
- **Output**: Top 10 most common terms/phrases in negative feedback
- **Use Case**: Identify common complaints and issues
- **Benefit**: Targeted problem-solving

##### **2.3 Key Performance Indicators (KPIs)**
- **Top Category (Profit)**: Highest profit-generating product category
- **Top Region (Sales)**: Best-performing geographic region
- **Average Rating**: Overall customer satisfaction score
- **Use Case**: Quick performance overview

##### **2.4 Profit Over Time**
- **Chart Type**: Line graph showing monthly profit trends
- **Features**: 
  - Historical profit tracking
  - Trend identification
  - Monthly aggregation
- **Use Case**: Financial performance monitoring

##### **2.5 Rating vs. Predicted Sentiment Heatmap**
- **Chart Type**: Heatmap showing correlation between star ratings and AI sentiment
- **Features**:
  - Cross-tabulation analysis
  - Visual correlation matrix
  - Identifies rating-sentiment mismatches
- **Use Case**: Review authenticity validation

##### **2.6 Sales by Region**
- **Chart Type**: Bar chart
- **Features**: 
  - Regional sales comparison
  - Geographic performance analysis
- **Use Case**: Market expansion planning

##### **2.7 Profit by Category**
- **Chart Type**: Bar chart
- **Features**:
  - Category-wise profit comparison
  - Product category performance ranking
- **Use Case**: Product portfolio optimization

#### **Section 3: Future Predictions**

##### **3.1 Overall Profit Forecast**
- **Algorithm**: Linear Regression
- **Output**: 6-month profit forecast with historical trend
- **Metrics**: Next month's predicted profit
- **Use Case**: Budget planning and financial forecasting

##### **3.2 Overall Sales Forecast**
- **Algorithm**: Linear Regression
- **Output**: 6-month sales volume forecast
- **Metrics**: Next month's predicted units sold
- **Use Case**: Inventory planning and production scheduling

##### **3.3 Sales Forecast: Random Forest vs Linear Regression**
- **Algorithms**: Both Linear Regression and Random Forest
- **Features**:
  - Side-by-side model comparison
  - Performance metrics (R² score, MAE)
  - Next month predictions from both models
- **Benefits**:
  - Model validation through comparison
  - More accurate predictions
  - Understanding of model confidence
- **Use Case**: Advanced forecasting with model selection

**Why Compare Linear Regression vs Random Forest?**

The comparison between Linear Regression and Random Forest serves several critical purposes:

1. **Model Validation & Reliability**
   - **Purpose**: Two independent models provide validation
   - **Benefit**: If both models agree, predictions are more reliable
   - **Use Case**: When predictions differ significantly, it signals uncertainty or data complexity
   - **Example**: If Linear Regression predicts 1000 units and Random Forest predicts 1200 units, the range (1000-1200) represents prediction uncertainty

2. **Capturing Different Patterns**
   - **Linear Regression**: Assumes linear trends (straight-line growth/decline)
     - **Strengths**: Simple, interpretable, fast, works well for steady trends
     - **Limitations**: Cannot capture seasonality, cyclical patterns, or non-linear relationships
   - **Random Forest**: Captures complex, non-linear patterns
     - **Strengths**: Handles seasonality (via sin/cos features), captures interactions, adapts to data complexity
     - **Limitations**: More complex, less interpretable, can overfit with small datasets

3. **Feature Engineering Differences**
   - **Linear Regression Features**: 
     - Time index (simple sequential trend)
   - **Random Forest Features**:
     - Time index
     - Month (1-12) - captures monthly patterns
     - Year - captures year-over-year trends
     - Month sine/cosine - captures seasonal cycles (e.g., holiday seasons, summer sales)
   - **Why This Matters**: Random Forest can identify that December sales are typically higher due to holidays, while Linear Regression only sees a general trend

4. **Performance Metrics Comparison**
   - **R² Score (Coefficient of Determination)**: 
     - Measures how well the model fits the data (0-1 scale, higher is better)
     - Shows which model explains more variance in historical data
   - **MAE (Mean Absolute Error)**:
     - Average prediction error in actual units
     - Shows which model has smaller prediction errors
   - **Business Value**: Users can see which model performs better on their specific data

5. **Business Decision Making**
   - **Scenario 1: Models Agree** → High confidence in predictions
   - **Scenario 2: Models Disagree** → Indicates:
     - Data has complex patterns (Random Forest may be better)
     - Insufficient data (both models uncertain)
     - Need for more features or data collection
   - **Practical Use**: Business can choose the model with better metrics or use the average/range

6. **Handling Different Data Characteristics**
   - **Linear Data** (steady growth): Linear Regression performs well, simpler to use
   - **Seasonal Data** (holiday spikes, summer sales): Random Forest captures these patterns better
   - **Complex Patterns** (multiple factors, interactions): Random Forest excels
   - **Small Datasets**: Linear Regression less likely to overfit

7. **Educational & Transparency Value**
   - Shows users that forecasting isn't a "black box"
   - Demonstrates that different models can give different results
   - Encourages critical thinking about predictions
   - Builds trust through transparency

8. **Risk Assessment**
   - **Wide Gap Between Predictions**: High uncertainty, conservative planning recommended
   - **Close Predictions**: Higher confidence, can plan more aggressively
   - **Example**: If LR predicts $10K and RF predicts $12K profit, plan for $10K (conservative) but be ready for $12K (optimistic scenario)

**Real-World Example:**
- **Linear Regression** might predict steady 5% monthly growth
- **Random Forest** might identify that December (month 12) typically has 30% higher sales due to holidays
- **Comparison Result**: Random Forest shows seasonal spike that Linear Regression misses
- **Business Action**: Plan inventory and marketing for December surge

##### **3.4 Top Category Sales Forecast**
- **Algorithm**: Linear Regression
- **Output**: Forecast for the best-performing category
- **Metrics**: Next month's predicted sales for top category
- **Use Case**: Category-specific planning

##### **3.5 Sentiment Trend Forecast**
- **Algorithm**: Linear Regression on sentiment percentages
- **Output**: 6-month forecast of positive sentiment percentage
- **Metrics**: Predicted positive sentiment percentage next month
- **Use Case**: Customer satisfaction trend prediction

##### **3.6 Top Product Prediction**
- **Method**: Analysis of recent 3-month sales data
- **Output**: Predicted top-selling product for next month
- **Use Case**: Marketing focus and inventory prioritization

---

### 💼 Business Use Cases

#### **1. E-commerce Businesses**
- **Use Case**: Analyze customer reviews and sales data
- **Benefits**: 
  - Identify popular products
  - Understand customer satisfaction
  - Forecast demand
  - Optimize inventory

#### **2. Retail Chains**
- **Use Case**: Multi-region performance analysis
- **Benefits**:
  - Compare regional performance
  - Identify best-performing locations
  - Optimize product mix by region
  - Plan regional marketing campaigns

#### **3. Product Managers**
- **Use Case**: Product performance and customer feedback analysis
- **Benefits**:
  - Identify products needing improvement
  - Understand customer pain points
  - Prioritize product development
  - Track sentiment trends

#### **4. Marketing Teams**
- **Use Case**: Campaign effectiveness and customer sentiment
- **Benefits**:
  - Measure sentiment impact
  - Identify trending topics
  - Forecast customer satisfaction
  - Optimize marketing spend

#### **5. Financial Analysts**
- **Use Case**: Profit forecasting and trend analysis
- **Benefits**:
  - Accurate profit predictions
  - Sales volume forecasting
  - Risk assessment
  - Budget planning

#### **6. Customer Success Teams**
- **Use Case**: Customer satisfaction monitoring
- **Benefits**:
  - Early warning system for dissatisfaction
  - Trend identification
  - Proactive customer support
  - Service quality improvement

---

### 🚀 Competitive Advantages

1. **All-in-One Solution**: Combines sentiment analysis, forecasting, and visualization in one platform
2. **AI-Powered**: Uses machine learning for accurate predictions and classifications
3. **Fast Processing**: Analyzes large datasets in seconds
4. **Easy to Use**: Simple CSV upload, no technical expertise required
5. **Actionable Insights**: Provides specific recommendations, not just data
6. **Multi-Model Forecasting**: Compares different algorithms for better accuracy
7. **Real-Time Analysis**: Instant results after data upload
8. **Professional Visualizations**: Publication-ready charts and graphs
9. **Scalable**: Handles datasets of various sizes
10. **Cost-Effective**: Open-source tools, no licensing fees

---

## 🔄 Camera Emotion vs Textual Emotion Comparison

### How Comparison Works

The comparison happens in the `build_behavioral_insight()` function (lines 83-92 in `app.py`):

```python
def build_behavioral_insight(sentiment_label: str, latest_emotion: str):
    # Compares textual sentiment with latest camera-detected emotion
    # Generates insights based on alignment or misalignment
```

### Comparison Logic

#### 1. **Misalignment Detection**

**Case 1: Angry Face + Positive Text**
```python
if latest_emotion == "angry" and sentiment_label == "positive":
    return "Mixed signals detected: positive words but anger on camera. Investigate further."
```
- **Interpretation**: Customer is saying positive things but appears angry
- **Possible Reasons**: 
  - Sarcasm
  - Forced politeness
  - Hidden frustration
- **Action**: Requires deeper investigation

**Case 2: Happy Face + Negative Text**
```python
if latest_emotion == "happy" and sentiment_label == "negative":
    return "Customer sounds negative but looks happy—check if sarcasm or playful tone."
```
- **Interpretation**: Negative words but positive expression
- **Possible Reasons**:
  - Sarcasm or irony
  - Playful criticism
  - Customer is joking
- **Action**: Context-dependent response

#### 2. **Alignment Detection**

**Case 3: Negative Expression + Negative Text**
```python
if latest_emotion in {"sad", "fear", "disgust"} and sentiment_label == "negative":
    return "Customer is visibly upset and negative. Prioritize empathy in follow-up."
```
- **Interpretation**: Consistent negative signals
- **Action**: Immediate empathetic response required
- **Priority**: High - genuine dissatisfaction

**Case 4: Default Alignment**
```python
return f"User appears {latest_emotion} while expressing {sentiment_label} sentiment."
```
- **Interpretation**: General alignment or neutral state
- **Action**: Standard response protocol

### Benefits of This Comparison

1. **Fraud Detection**: 
   - Detects fake positive reviews (positive text, negative expression)
   - Identifies genuine vs. forced feedback

2. **Emotional Intelligence**:
   - Understands true customer feelings beyond words
   - Enables empathetic responses

3. **Quality Assurance**:
   - Validates customer feedback authenticity
   - Identifies areas needing attention

4. **Personalization**:
   - Adapts response based on emotional state
   - Provides appropriate level of support

5. **Conflict Resolution**:
   - Early detection of escalating emotions
   - Proactive intervention

### Technical Implementation

1. **Camera Emotion**:
   - Source: FER library (facial expression recognition)
   - Frequency: Every 1 second
   - Latest emotion: Retrieved from session timeline
   - Confidence: Included in analysis

2. **Textual Emotion**:
   - Source: Hugging Face transformers pipeline
   - Input: Review text (up to 512 characters)
   - Output: Sentiment label (POSITIVE/NEGATIVE/NEUTRAL) + confidence score

3. **Comparison**:
   - Synchronous: Uses latest camera emotion at time of text analysis
   - Asynchronous: Can compare historical emotion patterns with text

---

## 📊 Summary

### Algorithms Summary
- **Text Analysis**: TF-IDF + LinearSVC, Hugging Face Transformers
- **Forecasting**: Linear Regression, Random Forest Regressor
- **Emotion Detection**: FER (Facial Expression Recognition)
- **Data Processing**: Pandas, NumPy, scikit-learn

### Site Architecture
- **Frontend**: HTML/CSS/JavaScript with Tailwind CSS
- **Backend**: Flask (Python)
- **Data Flow**: CSV upload → Processing → Analysis → Visualization
- **Real-time**: WebSocket-like polling for emotion detection

### Key Innovation
The `/emotion-intel` module uniquely combines:
- **Visual emotion detection** (camera)
- **Textual sentiment analysis** (reviews)
- **Behavioral insight generation** (comparison logic)
- **Real-time tracking** (session-based logging)

This creates a comprehensive customer emotion intelligence system that goes beyond traditional sentiment analysis by incorporating non-verbal cues.

