

<img width="1691" height="750" alt="image" src="https://github.com/user-attachments/assets/120878d6-5eab-45aa-9a18-42bad4f7f580" />

````markdown
# 🌤️ Weather Now

**Weather Now** is a simple and elegant React web app that allows users to check real-time weather details for any city using the [Open-Meteo API](https://open-meteo.com/).  
It is built with **React**, **Tailwind CSS**, and **GSAP** for smooth animations and a modern glassmorphism UI.

---

## 🚀 Live Demo
👉 [Deployed on CodeSandbox / StackBlitz / Vercel](#) *(Add your deployment link here)*

---

## 🧠 Project Overview
**Goal:** Build a responsive, animated weather app that displays:
- Temperature (°C)
- Humidity (%)
- Wind Speed (km/h)
- Weather Condition (Clear, Rainy, Cloudy, etc.)

**User Flow:**
1. User enters a city name.
2. App fetches latitude and longitude using Open-Meteo’s **Geocoding API**.
3. Then retrieves live weather data via **Forecast API**.
4. Displays weather details with smooth GSAP animations.

---

## 🧰 Tech Stack
| Technology | Purpose |
|-------------|----------|
| **React (Vite)** | Frontend framework |
| **Tailwind CSS** | Styling & responsive design |
| **GSAP** | Animations |
| **Open-Meteo API** | Weather data source |

---

## ⚙️ Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/weather-now.git
   cd weather-now
````

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the App**

   ```bash
   npm run dev
   ```

   Visit **[http://localhost:5173/](http://localhost:5173/)** in your browser.

4. **Deploy**

   * You can deploy easily on [CodeSandbox](https://codesandbox.io/), [StackBlitz](https://stackblitz.com/), or [Vercel](https://vercel.com/).

---

## 🌐 API Reference

### 🔹 Geocoding API

Fetches coordinates for a city:

```
https://geocoding-api.open-meteo.com/v1/search?name={cityName}
```

### 🔹 Forecast API

Fetches current weather data:

```
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m
```

No API key required ✅

---

## 🎨 UI Features

* **Full-screen centered layout**
* **Glassmorphism weather card**
* **Dynamic gradient animated background**
* **Smooth GSAP transitions**
* **Fully responsive (desktop + mobile)**

---

## 📸 Preview

*(Add screenshot or GIF here)*

---

## 💡 Future Enhancements

* Add weather forecast for the next 3 days
* Include sunrise/sunset times
* Dark/light theme toggle

---

## 🧩 Acknowledgment

* [Open-Meteo](https://open-meteo.com/) for free weather API
* [GSAP](https://greensock.com/gsap/) for animations
* [Tailwind CSS](https://tailwindcss.com/) for beautiful styling
* Created as part of **Aganitha Full Stack Developer Take-Home Challenge (2024-25)**

---

## 🧠 LLM Usage

This project was designed and coded with assistance from **ChatGPT (OpenAI GPT-5)** to speed up development and code optimization.

---

## 👨‍💻 Author

**Vikas Singh**
📧 vikas.kumar.singh.job123@gmail.com
🌐 https://vikas-developer-portfolio.vercel.app/

---

