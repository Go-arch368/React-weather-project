import React, { useEffect } from "react";
import './App.css';
import clearsky from "./clearsky.png";
import cloud from "./cloud.png";
import drizzle from "./drizzle.png";
import humidityIcon from "./humidity.png";
import rain from "./Rain.png";
import searchIcon from "./search.png";
import snowIcon from "./snoo.jpg";
import windIcon from "./wind.png";

const Setweatherapp = ({ icon, temp, city, country, lat, lon, humidity, wind }) => {
  return (
    <>
      <div className="wetherimage">
        <img src={icon} className="snowimg" alt="climate" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="city">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="lon">longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind} Km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function App() {
  const Api = "";
  const [text, setText] = React.useState("chennai");
  const [icon, setIcon] = React.useState(snowIcon);
  const [temp, setTemp] = React.useState("0");
  const [city, setCity] = React.useState("Chennai");
  const [country, setCountry] = React.useState("India");
  const [lat, setLat] = React.useState("0");
  const [lon, setLon] = React.useState("0");
  const [humidity, setHumidity] = React.useState("0");
  const [wind, setWind] = React.useState("0");
  const [cityNotFound, setCityNotFound] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const weatherIconMap = {
    "01d": clearsky,
    "01n": clearsky,
    "02d": cloud,
    "02n": cloud,
    "03d": drizzle,
    "03n": drizzle,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);
    setError(null); 
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${Api}`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === 404) {
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp - 273.15)); 
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearsky);
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError("An error occurred while fetching weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (event) => {
    setText(event.target.value);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="container">
      <div className="input">
        <input
          type="text"
          className="city"
          placeholder="Enter your city"
          autoComplete="off"
          value={text}
          onChange={handleCity}
          onKeyDown={onKeyDown}
        />
        <div className="search-icon" onClick={search}>
          <img src={searchIcon} alt="search" style={{ width: '20px', height: '20px' }} />
        </div>
      </div>
      {!loading && !cityNotFound && (
        <Setweatherapp
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          lon={lon}
          humidity={humidity}
          wind={wind}
        />
      )}
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {cityNotFound && <div className="city-not-found">City not found</div>}
    </div>
  );
}
