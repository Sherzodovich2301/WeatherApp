import { useEffect, useState } from "react";
import "../Weather/weather.css";

export default function Weather() {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState(null);
  const [error, SetError] = useState("");
  const [weatherType, setWeatherType] = useState("clear");

  const getCloseForecast = (list) => {
    const now = new Date();
    return list.reduce((closest, current) => {
      const currentLog = Math.abs(new Date(current.dt_txt) - now);
      const closestLog = Math.abs(new Date(closest.dt_txt) - now);
      return currentLog < closestLog ? current : closest;
    });
  };


  const fetchWeather = async (cityName) => {
    try {
      const result = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=25a2691ae01c019520da19454b94f722&units=metric`
      );
      const json = await result.json();
      if (json.cod === "200") {
        const closest = getCloseForecast(json.list)
        setWeatherType(closest.weather[0].main);
        json.closest = closest;
        setData(json);
        SetError("");
        //windowni yangilamaymiz
        window.history.replaceState(null, "", `?city=${cityName}`)
      } else {
        setData(null);
        SetError("Bu davlat mavjud emas");
        setInputValue("");
      }
    } catch (error) {
      console.log("Xatolik:", error);
    }
  };






  const getDay = (list) => {
    const today = new Date().toISOString().split("T")[0]

    return list.filter((item) => {
      const TodayTime = item.dt_txt.split(" ")[0]
      const hour = new Date(item.dt_txt).getHours()
      return TodayTime === today && hour >= 10 && hour <= 23;
    })
  }





  // useEffect yangilandi 
  //********************//
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cityFromUrl = params.get("city")
    if(cityFromUrl){
      setInputValue(cityFromUrl)
      fetchWeather(cityFromUrl)
    }else{
      fetchWeather("Tashkent")
    }
  }, []);
  //*******************//

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      fetchWeather(inputValue);
    }
  };

  const getWeatherTextColor = (type) => {
    switch (type) {
      case "Snow":
      case "Clear":
      case "Clouds":
      case "Rain":
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
      case "Snow":
        return "bg-snowy";
      case "Rain":
        return "bg-rainy";
      default:
        return "bg-default";
    }
  };

  return (
    <div className={`bg-center bg-no-repeat bg-cover overflow-hidden w-full h-[100vh] ${getWeatherClass(weatherType)}`}>
      <div className="hello flex flex-col xl:flex-row justify-between items-center gap-10">
        <div className="xl:mb-0 turn:mb-[40px] xl:ml-[40px] md:w-[350px] turn:w-[200px] w-[600px] h-[765px] flex flex-row xl:flex-col xl:mt-[0px] turn:mt-[-600px] items-end xl:gap-0 turn:gap-[230px] turn:ml-[0px] sm:ml-[-350px]">
          <p className="text-white w-[70%] md:flex turn:hidden text-start xl:text-[25px] sm:text-[30px] mt-[40px]">The.weather</p>
          <div className="w-full mt-[40px] flex gap-[20px] md:w-full sm:w-[300px] turn:w-[200px] items-center justify-center xl:justify-end">
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
          <div className="xl:w-[360px] h-[100px] backdrop-blur-lg flex xl:ml-[-800px]  ml-[-800px] turn:ml-[0] rounded-[10px] xl:mt-[500px] mt-[500px] turn:mt-0">
            {data &&
              getDay(data.list).map((item, id) => {
                return (
                <article key={id} className="pl-[20px] flex flex-col items-center pr-[25px] pt-[15px] ">
                  <p className="mb-[10px] font-[600] text-[20px] text-white">
                    {item.dt_txt.split(" ")[1].slice(0, 5)}
                  </p>
                  <p className="mb-[10px] font-[600] text-[20px] text-white">
                    {Math.round(item.main.temp)}<sup>c</sup>
                  </p>
                </article>)
              })
            }
          </div>




        <div className="w-[550px] xl:h-[100vh] sm:h-[650px] lg:h-[700px] md:h-[650px] turn:h-[400px] xl:w-[550px] lg:w-[800px] sm:w-[600px] turn:w-[350px] flex flex-col items-center border-[0.2px] border-gray-600 backdrop-blur-md ">
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
                onClick={() => {setInputValue(city); fetchWeather(city)}}
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
            {data?.list?.slice(0, 1).map((item, id) => (
              <article key={id} className="w-full flex lg:justify-between turn:justify-around justify-between mb-[30px] h-auto">
                <p className={`${getWeatherTextColor(weatherType)}`}>Cloudy</p>
                <p className="text-white">{item.clouds.all}%</p>
              </article>
            ))}
            {data?.list?.slice(0, 1).map((item, id) => (
              <article key={id} className="w-full flex lg:justify-between turn:justify-around justify-between mb-[30px] h-auto">
                <p className={`${getWeatherTextColor(weatherType)}`}>Humidity</p>
                <p className="text-white">{item.main.humidity}%</p>
              </article>
            ))}
            {data?.list?.slice(0, 1).map((item, id) => (
              <article key={id} className="w-full flex lg:justify-between turn:justify-around justify-between mb-[30px] h-auto">
                <p className={`${getWeatherTextColor(weatherType)}`}>Wind</p>
                <p className="text-white">{item.wind.speed} km/h</p>
              </article>
            ))}
            {data?.list?.slice(0, 1).map((item, id) => (
              <article key={id} className="w-full flex lg:justify-between turn:justify-around justify-between mb-[30px] h-auto">
                <p className={`${getWeatherTextColor(weatherType)}`}>Description</p>
                <p className="text-white">{item?.weather?.[0]?.description ?? "--"}</p>
              </article>
            ))}
            <p className="sm:flex turn:hidden w-full h-[0.3px] bg-gray-400"></p>
          </div>
        </div>
      </div>
    </div>
  );
}



