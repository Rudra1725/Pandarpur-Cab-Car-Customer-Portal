# Pandharpur Car Cab — Customer Portal & Booking Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-pandarpur--cab--car.vercel.app-1e3a5f?style=for-the-badge&logo=vercel&logoColor=white)](https://pandarpur-cab-car.vercel.app/)
[![Google Rating](https://img.shields.io/badge/Google%20Rating-4.9%20%E2%98%85%20(72%20Reviews)-c26100?style=for-the-badge&logo=google-maps&logoColor=white)](https://pandarpur-cab-car.vercel.app/#reviews)
[![Service Hours](https://img.shields.io/badge/Service-Open%2024%2F7-22543d?style=for-the-badge)](#)
[![Stack](https://img.shields.io/badge/Built%20With-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-0f1d30?style=for-the-badge)](#)

A production-quality, lightweight, and fully accessible customer portal and online booking website built for **Pandharpur Car Cab**, a licensed car rental and taxi agency based at Vitthal Rukmini Bhakti Nivas, Pandharpur, Maharashtra.

---

## 🌐 Live Website

Access the production deployment here:  
👉 **[https://pandarpur-cab-car.vercel.app/](https://pandarpur-cab-car.vercel.app/)**

---

## 📌 Business Profile & Ground Information

* **Agency Name:** Pandharpur Car Cab
* **Dispatch Desk:** Office S20, Vitthal Rukmini Bhakti Nivas, Pandharpur, Maharashtra 413304, India
* **Operating Schedule:** Open 24 Hours / 7 Days a Week (Round-the-Clock Dispatch)
* **Reputation:** 4.9 / 5.0 Rating based on 72 Verified Google Business Profile Reviews
* **Service Scope:** Local Vitthal Temple Darshan, Railway Station & Hotel Transfers, and Intercity Outstation Routes (Solapur, Pune, Mumbai, Kolhapur, Shirdi)

---

## ✨ Key Features

### 1. Instant Fare Estimator
* Dynamic, real-time fare calculations as customers select service types and vehicle classes.
* Transparent tariff rates covering local 4-hour packages, station drops, and per-kilometer outstation tariffs.

### 2. Client-Side Booking & Digital Voucher Engine
* Zero third-party runtime dependencies.
* Robust validation for Indian 10-digit mobile numbers (`^[6-9]\d{9}$`), passenger capacities, and upcoming travel dates.
* Generates an instant booking confirmation voucher with a unique reference code (`PCC-2026-XXXX`).

### 3. Self-Service Customer Portal
* Customers can look up existing bookings anytime using their 10-digit phone number or Booking Reference ID.
* Live status tracking, chauffeur assignment notices, route confirmation, and modification guidance.

### 4. Verified Customer Testimonials
* Contains verbatim reviews directly from the verified Google Business Profile:
  * *"Excellent driver good service reasonable rate very polite"*
  * *"The work quality and customer service were really good."*
  * *"Well trained drivers for your and family trip in and around pandharpur."*

### 5. Regulatory Compliance & Legal Modals
* Built-in modal dialogs for **Privacy Policy** (aligned with Indian DPDP principles) and **Terms & Conditions** (governed by courts in Pandharpur/Solapur District).

### 6. Accessibility & Clean UX
* WCAG AA compliant contrast ratios.
* Keyboard navigable with visible focus states and skip-to-content links.
* Responsive across mobile (375px+), tablet, and desktop viewports with zero horizontal overflow.
* Respects `prefers-reduced-motion`.

---

## 🚗 Fleet & Rate Card

| Vehicle Category | Models | Capacity | Local Package (4h/40km) | Outstation Rate | Driver Allowance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Compact Hatchback** | Maruti Swift, WagonR | 4 + Driver | ₹1,400 | ₹11 / km | ₹300 / day |
| **Comfort Sedan** | Swift Dzire, Toyota Etios | 4 + Driver | ₹1,800 | ₹13 / km | ₹300 / day |
| **Family SUV** | Maruti Ertiga, Bolero | 6-7 + Driver | ₹2,500 | ₹16 / km | ₹400 / day |
| **Luxury SUV** | Toyota Innova Crysta | 7 + Driver | ₹3,500 | ₹20 / km | ₹500 / day |

> *Note: Tolls, state taxes, and parking fees are charged as per actual receipts. Minimum outstation distance billing is 250 km/day.*

---

## 📂 File Architecture

The entire project is structured into three clean, unbundled, zero-dependency files:

```text
pandharpur-cab-car/
│
├── index.html        # Semantic HTML5 markup, accessible forms, tables, and modal dialogs
├── style.css         # Custom responsive design system, theme variables, and grid layouts
└── script.js         # Navigation toggle, validation rules, fare engine, and storage portal
