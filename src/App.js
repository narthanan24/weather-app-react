import React, { useState, useEffect } from 'react';
import Titles from './components/Titles';
import Form from './components/Form';
import Weather from './components/Weather';

const API_KEY = '986f23ae0447c649c36930c44d073083';

const App = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    error: undefined,
  });

  const [locationData, setLocationData] = useState({
    lat: undefined,
    lng: undefined,
  });

  useEffect(() => {
    console.log('Component Did Mount');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setLocationData({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        try {
          const api_call = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${locationData.lat}&lon=${locationData.lng}&appid=${API_KEY}&units=metric`
          );
          const data = await api_call.json();

          setWeatherData({
            temperature: data.main.temp,
            city: data.name,
            country: data.sys.country,
            humidity: data.main.humidity,
            description: data.weather[0].description,
            error: '',
          });
        } catch (error) {
          setWeatherData((prevState) => ({
            ...prevState,
            error: 'Please enter correct values',
          }));
        }
      });
    }
  }, [locationData.lat, locationData.lng]);

  const getWeather = async (city, country) => {
    console.log('Get Weather Function');

    try {
      const api_call = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`
      );
      const data = await api_call.json();

      setWeatherData({
        temperature: data.main.temp,
        city: data.name,
        country: data.sys.country,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        error: '',
      });
    } catch (error) {
      setWeatherData({
        temperature: undefined,
        city: undefined,
        country: undefined,
        humidity: undefined,
        description: undefined,
        error: 'Please enter correct values',
      });
    }
  };

  return (
    <div className='wrapper'>
      <div className='main'>
        <div className='container'>
          <div className='row'>
            <div className='col-xs-12 col-sm-5 title-container'>
              <Titles />
            </div>
            <div className='col-xs-12 col-sm-7 form-container'>
              <Form
                getWeather={getWeather}
                city={weatherData.city}
                country={weatherData.country}
              />
              <Weather
                temperature={weatherData.temperature}
                city={weatherData.city}
                country={weatherData.country}
                humidity={weatherData.humidity}
                description={weatherData.description}
                error={weatherData.error}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
