import { useEffect, useState } from "react";
import "../Weather/weather.css";

export default function Weather() {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [weatherType, setWeatherType] = useState("clear");

  const getCloseForecast = (list) => {
  if (!Array.isArray(list) || list.length === 0) return null;
  const now = new Date();
  return list.reduce((closest, current) => {
    const currentDiff = Math.abs(new Date(current.dt_txt) - now);
    const closestDiff = Math.abs(new Date(closest.dt_txt) - now);
    return currentDiff < closestDiff ? current : closest;
  });
};

const fetchWeather = async (cityName) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=25a2691ae01c019520da19454b94f722&units=metric`
    );
    const json = await response.json();

    if (json.cod === "200" && Array.isArray(json.list)) {
      const closest = getCloseForecast(json.list);
      if (closest) {
        json.closest = closest;
        setWeatherType(closest.weather?.[0]?.main || "Clear");
      } else {
        json.closest = null;
        setWeatherType("Clear");
      }

      setData(json);
      setError("");
      window.history.replaceState(null, "", `?city=${cityName}`);
    } else {
      setData(null);
      setError("Bu davlat topilmadi.");
      setInputValue("");
    }
  } catch {
    setData(null);
  }
};

  const getDay = (list) => {
    const today = new Date().toISOString().split("T")[0];
    return list.filter((item) => {
      const itemDate = item.dt_txt.split(" ")[0];
      const hour = new Date(item.dt_txt).getHours();
      return itemDate === today && hour >= 10 && hour <= 23;
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityFromUrl = params.get("city");
    if (cityFromUrl) {
      setInputValue(cityFromUrl);
      fetchWeather(cityFromUrl);
    } else {
      fetchWeather("Tashkent");
    }
  }, []);

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      fetchWeather(inputValue);
    } else {
      setError("Iltimos, davlat nomini kiriting.");
    }
  };

  const getWeatherTextColor = (type) => {
    switch (type) {
      case "Clear":
      case "Clouds":
      case "Rain":
      case "Snow":
        return "text-white";
      default:
        return "text-gray-400";
    }
  };

  const getWeatherClass = (type) => {
    switch (type) {
      case "Clear":
        return "bg-sunny";
      case "Clouds":
        return "bg-cloudy";
      case "Rain":
        return "bg-rainy";
      case "Snow":
        return "bg-snowy";
      default:
        return "bg-default";
    }
  };

  return (
    <div className={`bg-center bg-no-repeat bg-cover overflow-hidden w-full h-[100vh] ${getWeatherClass(weatherType)}`}>
      <div className="hello flex flex-col xl:flex-row justify-between items-center gap-10">


        <div className="h-auto xl:h-[765px] mb-0 xl:mb-[-150px]">
          <div className="xl:mb-0 turn:mb-[40px] xl:ml-[40px] w-[400px] md:w-[350px] turn:w-[200px] h-auto xl:h-[765px] flex xl:flex-col md:flex-col-reverse mt-0 xl:mt-0 md:mt-0 items-center xl:gap-0 turn:gap-[230px] ml-0 md:ml-0 turn:ml-0">
            <p className="text-white w-[70%] xl:flex turn:hidden text-start xl:text-[25px] sm:text-[30px] mt-[40px]">The.weather</p>
            <div className="w-full mt-[40px] flex gap-[20px] md:w-full turn:w-[300px] items-center justify-center xl:justify-center">
              {data?.closest && (
                <article>
                  <p className="font-[600] text-[60px] xl:text-[60px] md:text-center sm:text-[80px] text-white">
                    {Math.round(data.closest.main.temp)}<sup>c</sup>
                  </p>
                </article>
              )}
              {data?.city && (
                <article>
                  <p className="text-[45px] text-white font-[600]">{data.city.name}</p>
                  <p className="text-white">Sunday</p>
                </article>
              )}
              {error && (
                <p className="text-white text-center mt-2 text-[35px] font-semibold">{error}</p>
              )}
            </div>
          </div>

          <div className="xl:w-[360px] h-[100px] ml-[80px] xl:ml-[80px] backdrop-blur-lg flex turn:ml-[0] rounded-[10px] xl:mt-[-240px] md:mt-[50px] mt-[-240px] turn:mt-0">
            {data &&
              getDay(data.list).map((item, id) => {
                return (
                  <article key={id} className="pl-[20px] flex flex-col items-center pr-[25px] pt-[15px]">
                    <p className="mb-[10px] font-[600] text-[20px] text-white">
                      {item.dt_txt.split(" ")[1].slice(0, 5)}
                    </p>
                    <p className="mb-[10px] font-[600] text-[20px] text-white">
                      {Math.round(item.main.temp)}<sup>c</sup>
                    </p>
                  </article>
                );
              })}
          </div>
        </div>





        <div className="w-[550px] xl:h-[100vh] sm:h-[650px] lg:h-[700px] mt-0 xl:mt-0 turn:mt-[50px] md:h-[650px] turn:h-[400px] xl:w-[550px] lg:w-[800px] sm:w-[600px] turn:w-[350px] flex flex-col items-center backdrop-blur-md ">
          <div className="w-[450px] h-[200px] lg:mt-[0px] sm:flex turn:flex-col sm:items-start turn:items-center sm:mt-[-50px] flex xl:mb-0 sm:mb-[50px]">
            <article className="w-full h-auto flex sm:justify-start turn:justify-center">
              <input
                className="w-[70%] h-[40px] text-white bg-black border-[0.3px] border-gray-400 rounded-[5px] pl-[20px] outline-none mt-[100px]"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                type="text"
                placeholder="Another Location"
              />
            </article>
            <button
              onClick={handleSearch}
              className="w-[100px] h-[40px] sm:mt-[20px] turn:mt-[10px] sm:mb-[30px] turn:mb-[40px] bg-gray-500 mt-[100px]"
            >
              Search
            </button>
          </div>

          <div className="w-[450px] h-[300px] xl:block sm:flex xl:gap-[0px] xl:text-start turn:text-center turn:gap-[45px]">
            {["Birmingham", "Manchester", "New York", "California"].map((city) => (
              <article
                key={city}
                onClick={() => { setInputValue(city); fetchWeather(city) }}
                className="w-full mb-[30px] h-auto cursor-pointer hover:text-white transition-all"
              >
                <p className={`${getWeatherTextColor(weatherType)}`}>{city}</p>
              </article>
            ))}
          </div>
          <article className="w-full ">
            <p className="w-full h-[0.3px] sm:flex turn:hidden xl:mb-[40px] turn:mb-[90px] bg-gray-400"></p>
          </article>

          <div className="w-[450px] sm:block turn:hidden h-[300px]">
            <article className="w-[450px] xl:text-start turn:text-center">
              <h1 className="text-[18px] text-white font-[400] mb-[40px]">Weather Details</h1>
            </article>
            {data?.list?.[0] && (
              <section>
                {/* Cloudy */}
                <article className="w-full flex lg:justify-between turn:justify-around justify-between mb-[30px] h-auto">
                  <p className={`${getWeatherTextColor(weatherType)}`}>Cloudy</p>
                  <p className="text-white">{data.closest.clouds.all}%</p>
                </article>

                {/* Humidity */}
                <article className="w-full flex lg:justify-between turn:justify-around justify-between mb-[30px] h-auto">
                  <p className={`${getWeatherTextColor(weatherType)}`}>Humidity</p>
                  <p className="text-white">{data.closest.main.humidity}%</p>
                </article>

                {/* Wind */}
                <article className="w-full flex lg:justify-between turn:justify-around justify-between mb-[30px] h-auto">
                  <p className={`${getWeatherTextColor(weatherType)}`}>Wind</p>
                  <p className="text-white">{data.closest.wind.speed} km/h</p>
                </article>

                {/* Description */}
                <article className="w-full flex lg:justify-between turn:justify-around justify-between mb-[30px] h-auto">
                  <p className={`${getWeatherTextColor(weatherType)}`}>Description</p>
                  <p className="text-white">{data?.closest.weather?.[0]?.description ?? "--"}</p>
                </article>
              </section>
            )}

            <p className="sm:flex turn:hidden w-full h-[0.3px] bg-gray-400"></p>
          </div>
        </div>
      </div>
    </div>
  );
}



