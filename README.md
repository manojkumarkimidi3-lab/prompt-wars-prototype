# 🚨 NOVA CART — Business Rescue Platform

> **PromptWars: Business Rescue Challenge**
>
> **PROMPT. DISCOVER. BUILD. PROVE.**

NOVA CART is a quick-commerce and local shopping platform designed to connect customers with **620 local partner stores** across Bengaluru, Pune, and Jaipur.

This prototype focuses on diagnosing operational failures, identifying root causes of order cancellations, and proposing data-driven interventions to improve reliability, customer experience, and business performance.

---

## 📌 The Challenge

NOVA CART appears to be growing, but behind the growth are significant operational problems:

- High order cancellation rates
- Product availability mismatches
- Delivery delays
- Store rejection during peak periods
- Customer dissatisfaction
- Operational inefficiencies
- Erosion of customer loyalty

The challenge is to transform operational data into **clear, actionable business decisions**.

---

## 🎯 Objective

The NOVA CART Rescue Platform helps an Operations Manager:

1. Identify major operational failure points.
2. Understand the root causes behind cancellations.
3. Monitor store and order performance.
4. Prioritize operational interventions.
5. Track business impact.
6. Support faster and more informed decision-making.

---

# 🚀 Key Features

## 1. 📊 Executive Dashboard

Provides a high-level overview of the platform's operational health.

Key indicators include:

- Partner stores monitored
- Monthly orders
- Cancellation rate
- Budget constraints
- Operational alerts
- Business performance indicators

---

## 2. 🔍 Root-Cause Analytics

The platform decomposes cancelled orders into major operational failure categories.

Example failure categories include:

- **Ghost Stock**
  - Product shown as available but unavailable on the shelf.

- **Transit Delay**
  - Orders experiencing excessive delivery times.

- **Store Rejection**
  - Orders rejected by stores during high-demand periods.

The analytics view helps operations teams understand **where failures originate and what intervention can address them**.

---

## 3. 🚨 Rescue Hub

The Rescue Hub provides an operational command center for identifying and responding to critical issues.

It enables teams to:

- Detect operational risks
- Prioritize urgent issues
- Monitor intervention status
- Coordinate corrective actions

---

## 4. 🏪 Store Intelligence

Provides visibility into individual store performance.

Operations teams can analyze:

- Store reliability
- Order acceptance
- Cancellation patterns
- Inventory issues
- Delivery performance
- Operational risk

---

## 5. 📦 Orders Management

The Orders section provides visibility into order-level information.

It supports analysis of:

- Order status
- Risk scores
- Cancellation reasons
- Store information
- Delivery information
- Operational anomalies

---

## 6. 👥 Customer Care

The Customer Care module focuses on customer-impacting operational issues.

It helps teams understand:

- Failed orders
- Customer complaints
- Repeated operational failures
- Customer experience risks

---

## 7. 📈 Analytics

The Analytics section provides empirical distributions and diagnostic analysis.

For example:

### Cancellation Analysis

The prototype analyzes approximately **4,235 cancelled orders per month** and breaks them down into major root causes.

Example:

| Failure Cause | Approx. Monthly Orders | Share |
|---|---:|---:|
| Ghost Stock | ~1,482 | 35% |
| Transit Delay | ~1,143 | 27% |
| Store Rejection | ~762 | 18% |
| Other Causes | Remaining | — |

These figures are used within the prototype to demonstrate how operational data can guide interventions.

---

## 8. 💡 Intervention Mapping

The platform connects problems to potential interventions.

Examples:

| Problem | Proposed Intervention |
|---|---|
| Ghost Stock | SnapSync AI Bill Sync |
| Transit Delay | Route Micro-Bundling |
| Store Rejection | Peak-Rush Store Management |
| Operational Risk | Rescue Engine |
| Customer Impact | Customer Care Actions |

This transforms analytics from a reporting tool into a **decision-support system**.

---

## 9. 🌍 Multi-City Operations

The prototype supports operations across:

- 🇮🇳 Bengaluru
- 🇮🇳 Pune
- 🇮🇳 Jaipur

The interface allows an Operations Manager to switch between operational contexts.

---

# 🧠 Rescue Engine

The central concept of NOVA CART is the **Rescue Engine**.

Instead of simply showing what went wrong, the system aims to answer:

> **What went wrong?**

→ **Why did it happen?**

→ **What should we do?**

→ **What impact can the intervention create?**

This creates a closed-loop operational decision system.

---

# 🏗️ Platform Structure

The prototype contains the following major modules:

```text
NOVA CART
│
├── Brief & Model
│
├── Dashboard
│
├── Orders
│
├── Rescue Hub
│
├── Store Intelligence
│
├── Customer Care
│
├── Analytics
│
└── Impact Proof
