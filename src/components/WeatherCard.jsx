import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const FORECAST_API = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_API = "https://geocoding-api.open-meteo.com/v1/search";

// ✅ Helper: fetch coordinates
const getCoordinates = async (city) => {
    const res = await fetch(`${GEOCODE_API}?name=${encodeURIComponent(city)}&count=1`);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    if (!data.results || !data.results[0]) throw new Error("City not found");
    const { latitude, longitude, name, country } = data.results[0];
    return { latitude, longitude, name, country };
};

const WeatherCard = ({ weatherData, city }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        if (weatherData) {
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 50, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
            );
        }
    }, [weatherData]);

    if (!weatherData) return null;

    const { temperature, windspeed, humidity, weathercode, time } = weatherData;
    const conditions = {
        0: "☀️ Clear sky",
        1: "🌤️ Mainly clear",
        2: "⛅ Partly cloudy",
        3: "☁️ Overcast",
        45: "🌫️ Fog",
        51: "🌦️ Light drizzle",
        61: "🌧️ Rain",
        71: "❄️ Snow",
        95: "⛈️ Thunderstorm",
    };

    return (
        <div
            ref={cardRef}
            className="backdrop-blur-xl bg-white/20 border border-white/40 rounded-3xl shadow-2xl p-8 w-full max-w-md text-center text-white mt-8"
        >
            <h2 className="text-3xl font-semibold mb-3 capitalize tracking-wide text-yellow-300 drop-shadow-md">
                {city}
            </h2>
            <p className="text-7xl font-extrabold text-white mb-2 drop-shadow-xl">
                {Math.round(temperature)}°C
            </p>
            <p className="text-xl text-gray-200 font-medium mb-2">
                {conditions[weathercode] || "Unknown"}
            </p>
            <p className="text-sm text-gray-300 mb-6">
                As of: {new Date(time).toLocaleString()}
            </p>

            <div className="flex justify-around text-lg font-medium">
                <div className="flex flex-col items-center">
                    <span className="text-2xl">💨</span>
                    <p>{Math.round(windspeed)} km/h</p>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl">💧</span>
                    <p>{Math.round(humidity)}%</p>
                </div>
            </div>

            <p className="text-sm text-gray-300 mt-6">
                Built with ❤️ using React, Tailwind & GSAP
            </p>
        </div>
    );
};

const App = () => {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const bgRef = useRef(null);

    useEffect(() => {
        // background animation
        gsap.to(bgRef.current, {
            backgroundPosition: "200% center",
            duration: 10,
            repeat: -1,
            yoyo: true,
            ease: "linear",
        });
    }, []);

    const getWeather = async () => {
        try {
            setError("");
            setWeather(null);
            if (!city.trim()) {
                setError("Please enter a city name");
                return;
            }
            setLoading(true);

            const { latitude, longitude, name, country } = await getCoordinates(city.trim());

            const params = new URLSearchParams({
                latitude: String(latitude),
                longitude: String(longitude),
                current_weather: "true",
                hourly: "relativehumidity_2m",
                timezone: "auto",
            });

            const res = await fetch(`${FORECAST_API}?${params.toString()}`);
            if (!res.ok) throw new Error("Weather request failed");
            const data = await res.json();

            const current = data.current_weather;
            let humidity = null;
            if (data.hourly && data.hourly.time && data.hourly.relativehumidity_2m) {
                const idx = data.hourly.time.indexOf(current.time);
                if (idx !== -1) humidity = data.hourly.relativehumidity_2m[idx];
            }

            setWeather({
                temperature: current.temperature,
                windspeed: current.windspeed,
                weathercode: current.weathercode,
                time: current.time,
                humidity: humidity ?? "N/A",
            });

            setCity(`${name}${country ? ", " + country : ""}`);
        } catch (err) {
            console.error(err);
            setError(err.message || "Unable to fetch weather data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            ref={bgRef}
            className="fixed inset-0 flex flex-col items-center justify-center text-white overflow-hidden p-6"
            style={{
                background: "linear-gradient(120deg, #1e3a8a, #2563eb, #38bdf8, #1e3a8a)",
                backgroundSize: "400% 400%",
            }}
        >
            <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">🌤️ Weather Now</h1>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Enter city (e.g. London)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="px-4 py-2 rounded-lg w-64 bg-white text-gray-800 shadow-md placeholder-gray-400 
             focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                />

                <button
                    onClick={getWeather}
                    disabled={loading}
                    className="px-5 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition disabled:opacity-60"
                >
                    {loading ? "Loading..." : "Get Weather"}
                </button>
            </div>

            {error && <p className="text-red-300 mb-3">{error}</p>}

            <WeatherCard weatherData={weather} city={city} />
        </div>
    );
};

export default App;
