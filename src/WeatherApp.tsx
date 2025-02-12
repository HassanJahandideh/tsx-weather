import { useState, useEffect } from "react";

function WeatherApp() {
   //image based on the time of the day
   interface Image {
      url: string;
      hour: number;
   }
   const [backgroundImage, setBackgroundImage] = useState<string>('');

   //For api data
   interface WeatherData {
      
      temp: number;
      high: number;
      low: number;
      wind: number;
      uv: number;
      sunset: string;
      lastUpdated: string;
   }
   const [weather, setWeather] = useState<WeatherData | null>(null);

   useEffect(() => {
      // image based on the time of the day
      const images: Image[] = [
      { url: '/sunrise.jpg', hour: 6 },
      { url: '/noon.jpg', hour: 12 },
      { url: '/sunset.jpg', hour: 18 },
      { url: '/night.jpg', hour: 0 },
      ];
      const currentHour: number = new Date().getHours();

      const image = images.find(img => img.hour <= currentHour) || images[0];

      if (image) {
         setBackgroundImage(image.url);
      }
      // end of image based on the time of the day

      // fetch weather data
      const fetchWeather = async () => {
         
         try {
            const API_KEY = 'ff817925d27dc12d7820b41a04b725c2';
            const lat = 29.3759;
            const lon = 47.9774;

            // main weather information
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            const weatherData = await weatherResponse.json();

            //uv index
            const uvResponse = await fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
            );
            const uvData = await uvResponse.json();

            //times
            const sunsetTime = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', {
               hour: '2-digit',
               minute: '2-digit',
               hour12: false,
            });
            //last update
            const lastUpdated = new Date().toLocaleTimeString('en-US', {
               hour: '2-digit',
               minute: '2-digit',
               hour12: false,
            });

            setWeather({
               temp: Math.round(weatherData.main.temp),
               high: Math.round(weatherData.main.temp_max),
               low:  Math.round(weatherData.main.temp_min),
               wind: weatherData.wind.speed,
               uv: uvData.value,
               sunset: sunsetTime,
               lastUpdated,
            });
         } catch (error) {
            console.error('Error fetching weather data:', error);
         }
      };

      fetchWeather();
      const interval = setInterval(fetchWeather, 60000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="container">
         <div className="background-img" style={{ backgroundImage: `url(${backgroundImage})`}}>
            <div className="weather-container">
               <p className="city">Kuwait</p>
               <p className="date">{weather?.lastUpdated}</p>
               <h1 className="temp">{weather?.temp} <span className="cels">&#176;C</span></h1>
               {/* information about high and low temperature */}
               <div className="high-low-container">
                  <div className="high">⬆{weather?.high}&#176;C</div>
                  <div className="low">⬇{weather?.low}&#176;C</div>
               </div>
               {/* information about wind&uv&sunset */}
               <div className="wind-uv-sunset-container">
                  <div className="wind">🌬️ {weather?.wind}</div>
                  <div className="uv">🌞 {weather?.uv}</div>
                  <div className="sunset">🌇 {weather?.sunset}</div>
               </div>
               </div>
            </div>
      </div>
   );
}


export default WeatherApp;