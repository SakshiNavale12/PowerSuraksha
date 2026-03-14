# K-Means Clustering - Judging Round Preparation

## ML Algorithm Used: K-Means++ Clustering (Unsupervised)

> K-Means does NOT have accuracy, confusion matrix, or error margin.
> Those metrics only apply to supervised learning (labeled ground truth data).

---

## Core Parameters

| Parameter | Value | What it means |
|---|---|---|
| **K (clusters)** | 2–5 (auto via elbow method) | Number of device groups |
| **Max Iterations** | 300 (sklearn default) | How many times centroids recalculate |
| **Init Method** | K-Means++ | Smarter centroid initialization, reduces bad clustering |
| **Tolerance** | 0.0001 | Stops when centroids barely move |
| **N-Init** | 10 | Runs algorithm 10 times, picks best result |

---

## Quality Metrics (What We Use Instead of Accuracy)

### Silhouette Score (primary metric)
- Ranges from -1 to +1
- **0.71 – 1.0** = Strong clustering
- **0.51 – 0.70** = Reasonable
- **0.26 – 0.50** = Weak
- **Below 0.1** = Fallback to rule-based scheduling triggers

### WCSS via Elbow Method
- Used internally to find optimal number of clusters (K)
- Tests K = 1 to 5, picks the elbow point
- Ensures we don't over-cluster or under-cluster

---

## Anomaly Detection — Z-Score Thresholds

| Z-Score | Coverage | Alert Level |
|---|---|---|
| Z > 2.5 | 98.8% of normal distribution | MEDIUM alert (flags top 1.2%) |
| Z > 3.0 | 99.7% of normal distribution | HIGH alert (flags top 0.3%) |

---

## Key Numbers to Memorize

- K-Means++ vs random init → reduces iterations needed by ~2x
- K-Means++ reduces chance of poor local minima by ~60%
- Each device sends readings every **2 seconds**
- Over 10 minutes = **300 data points per device**
- With 500 devices = **150,000 data points per clustering cycle**
- Time complexity: **O(n × k × i)** → runs in under **200ms** per cycle

---

## Expected Judge Questions & Answers

**Q: Why K-Means and not Isolation Forest or DBSCAN?**
> K-Means is interpretable — each device gets a clear cluster label.
> DBSCAN needs density tuning which is hard in real-time streaming.
> Isolation Forest is better for anomaly detection but we combine Z-Score for that purpose.

**Q: How many clusters did you choose?**
> We don't hardcode it — the elbow method automatically picks optimal K by finding where
> WCSS reduction flattens. In testing, K=3 was most common: high-load, medium-load,
> and idle device groups.

**Q: What's your training data size?**
> Each device sends readings every 2 seconds. Over 10 minutes that's 300 data points
> per device. With 500 devices that's 150,000 data points per clustering cycle.

**Q: What's the time complexity?**
> O(n × k × i) — n=data points, k=clusters, i=iterations.
> For our scale it runs in under 200ms per cycle.

**Q: Does your model have accuracy or confusion matrix?**
> Since we use unsupervised clustering, traditional accuracy metrics don't apply —
> there's no labeled dataset to compare against. We validate clustering quality using
> the Silhouette Score in real time. If the score drops below 0.1, the system
> automatically falls back to rule-based scheduling, ensuring reliability even when
> clustering underperforms. For anomaly detection, Z-Score thresholding has a
> statistically known false positive rate of under 1.5%.

---

## What Cluster Labels Mean in Our System

| Cluster | Label | Action |
|---|---|---|
| High-Load | Devices drawing peak current/temp | Scheduled to off-peak hours |
| Medium-Load | Normal operating range | Standard scheduling |
| Idle/Low | Underutilized devices | Prioritized for peak hours |
| Anomaly | Z-Score > 2.5 | Removed from rotation, flagged for maintenance |
