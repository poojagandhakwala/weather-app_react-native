import {
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import background from "./images/bg1-cropped.jpg";
import wind_img from "./images/icons/wind.png";
import drop from "./images/icons/drop.png";
import thermo from "./images/icons/thermo.png";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { CalendarDaysIcon, XMarkIcon } from "react-native-heroicons/solid";
import { theme } from "./theme";
import { useState, useEffect, useCallback } from "react";
import { ScrollView } from "react-native";
import {
  fiveDaysForecast,
  getWeather,
  showWeather,
} from "react-native-weather-api";
import * as Progress from "react-native-progress";
import { debounce } from "lodash";
import axios from "axios";
import { FlatList } from "react-native";
import { weatherImages } from "./weatherImages";
import { getData, storeData } from "./storage";

export default function Weather() {
  const navigation = useNavigation();

  const [showSearch, toggleSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("California");
  const [countryName, setCountryName] = useState("United States");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [suggestions, setSuggestions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  let cityyData = getData("city");
  // const fetchCountry = async (value) => {
  //   const opencageAPI = "a02f2f474816467d9e2ccd878d7eeb6d";
  //   // console.log("in fetchCountry city = ", value);
  //   try {
  //     if (value) {
  //       setCity(value);
  //       axios
  //         .get(
  //           `https://api.opencagedata.com/geocode/v1/json?q=${value}&key=${opencageAPI}`
  //         )
  //         .then((response) => {
  //           const countryy = response.data.results[0].components.country;
  //           console.log(countryy);
  //           if (countryy) {
  //             setCountryName(countryy);
  //             fetchWeather(value, countryy);
  //           } else {
  //             setError(true);
  //           }
  //         })
  //         .catch((error) => setError(true), console.log("No city found"));
  //     }
  //   } catch (err) {
  //     // console.log(err);
  //   }
  // };

  const searchLocation = async (cityy) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${cityy}&accept-language=en`
      );
      const data = await response.json();

      // const isEnglish = (suggestion) => {
      //   // Example: Check if the display name contains English characters
      //   // Modify this function based on the available properties in the Nominatim response
      //   const englishRegex = /^[a-zA-Z\s,.'-]+$/;
      //   return englishRegex.test(suggestion.display_name);
      // };
      // const englishSuggestions = data.filter((suggestion) =>
      //   isEnglish(suggestion)
      // );

      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleSelectLocation = (selectedLocation) => {
    // Do something with the selected location, such as updating the TextInput value
    console.log("Selected Location:", selectedLocation);
    setCity(selectedLocation);
    setSearch(selectedLocation);
    console.log("fetching country for: ", selectedLocation);
    // fetchCountry(selectedLocation);
    const cityArr = selectedLocation.split(",");
    console.log(cityArr[cityArr.length - 1]);
    setCity(cityArr[0]);
    setCountryName(cityArr[cityArr.length - 1]);
    storeData("city", cityArr[0]);
    storeData("country", cityArr[cityArr.length - 1]);
    // storeData(cityArr[0],cityArr[cityArr.length - 1]);
    // fetchWeather(city, countryName);
  };

  const fetchWeather = async (city, countryy) => {
    let data = null;

    // let myCity = await getData(city);
    // if (myCity) setCity(myCity);
    setLoading(true);
    if (!error) {
      getWeather({
        key: "1ce333bacf89b067d8a2e519fdcb1c18",
        city,
        country: countryy,
        unit: "metric",
      })
        .then(() => {
          data = new showWeather();
          if (data) {
            setWeatherData(data);
            forecastData(city);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const forecastData = async (cityName) => {
    let latitude = 0,
      longitude = 0;
    await axios
      .get(
        `https://nominatim.openstreetmap.org/search?city=${cityName}&format=json`
      )
      .then((response) => {
        let data = null;
        data = response.data[0];
        if (data) {
          latitude = data.lat;
          longitude = data.lon;
          // console.log("lat = ", latitude + " lon = ", longitude);
          if (latitude !== 0 && longitude !== 0) {
            // let temp;
            // let description;
            // Define an array of day names
            const dayNames = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];

            fiveDaysForecast({
              key: "1ce333bacf89b067d8a2e519fdcb1c18",
              lat: latitude,
              lon: longitude,
              unit: "metric",
            }).then((data) => {
              // temp = data.list[0].main.temp;
              // description = data.list[0].weather[0].description;

              // Extract unique dates
              const uniqueDates = [
                ...new Set(data.list.map((day) => day.dt_txt.split(" ")[0])),
              ];
              // console.log("Unique dates:", uniqueDates);

              const dailyData = uniqueDates.slice(1, 7).map((days) => {
                const dayData = data.list.find(
                  (day) => day.dt_txt.split(" ")[0] === days
                );
                const date = new Date(dayData.dt_txt.split(" ")[0]);
                let dayOfWeek = date.getDay();
                dayData.dayName = dayNames[dayOfWeek];
                return dayData;
              });
              setDailyForecast(dailyData);
              setLoading(false);
            });
          }
        }
      });
    setSearch("");
    setSuggestions("");
  };

  // const handleSearch = async (value) => {
  //   setCity(value);
  //   fetchCountry(value);
  // };

  const handleSearchDebounce = useCallback(
    debounce((text) => searchLocation(text), 500),
    []
    // debounce(searchLocation, 1200), []
  );
  useEffect(async () => {
    // let data1 = await getData("city");
    // let data2 = await getData("country");
    cityyData &&
     console.log("stored city in useEffect = ", cityyData);
    // setSuggestions(data);
    // if (data1 && data2) fetchWeather(data1, data2);
    // else
    fetchWeather(city, countryName);
  }, [city, countryName]);
  // }, []);

  return (
    <View className="flex-1 relative ">
      <StatusBar style="light" />
      <Image
        source={background}
        blurRadius={70}
        className="absolute h-full w-full"
      />

      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={150} color="skyblue" />
        </View>
      ) : (
        <SafeAreaView className="mt-6 flex-1">
          {/* search bar */}
          <View
            style={{ height: "7%" }}
            // className="mx-4 relative z-50 "
          >
            <View
              className="mt-4 flex-row justify-end items-center rounded-full "
              style={{
                backgroundColor: showSearch
                  ? theme.bgWhite(0.2)
                  : "transparent",
              }}
            >
              {showSearch ? (
                <TextInput
                  placeholder="Search city"
                  placeholderTextColor="lightgray"
                  value={search}
                  // handleDebounce,
                  onChangeText={(text) => {
                    setSearch(text), handleSearchDebounce(text);
                    // searchLocation(text);
                  }}
                  // onChange={(value) => handleSearch(value)}
                  className="pl-6 h-10 pb-1 flex-1 text-base text-white "
                />
              ) : null}
              {showSearch && (
                <TouchableOpacity
                  className="rounded-full flex-row"
                  style={{
                    backgroundColor: showSearch
                      ? "transparent"
                      : theme.bgWhite(0.3),
                  }}
                  onPress={() => {
                    setSearch(""), setSuggestions("");
                  }}
                >
                  {search !== "" && <XMarkIcon size="25" color="white" />}
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className="rounded-full p-3 m-1 flex-row"
                style={{
                  backgroundColor: showSearch
                    ? "transparent"
                    : theme.bgWhite(0.3),
                }}
                onPress={() => {
                  toggleSearch(!showSearch);
                }}
              >
                <MagnifyingGlassIcon size="25" color="white" />
              </TouchableOpacity>
            </View>

            {showSearch && suggestions.length > 0 ? (
              <View
                className=" bg-gray-300 h-48
           top-2 bottom-0 rounded-3xl"
              >
                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item.place_id}
                  style={{ flex: 1 }}
                  className="flex flex-1 rounded-3xl"
                  renderItem={({ item, index }) => (
                    <View
                      className={`my-1 mx-2 ${
                        index + 1 !== suggestions.length
                          ? " border-b-2 border-b-gray-400 "
                          : ""
                      } `}
                    >
                      <TouchableOpacity
                        className={`flex-row 
                    items-center p-3 mb-1 
                `}
                        onPress={() => {
                          handleSelectLocation(item.display_name),
                            toggleSearch(!showSearch);
                        }}
                      >
                        <Text>{item.display_name} </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            ) : null}
          </View>

          {/* forecast */}
          {!showSearch && (
            <>
              <View className="mx-4 flex justify-around flex-1 mb-2">
                {/* location name */}
                {!error ? (
                  <Text className="text-2xl text-center font-extrabold text-white">
                    {city},
                    <Text className="text-xl text-gray-100 font-normal">
                      {countryName}
                    </Text>
                  </Text>
                ) : (
                  <Text className="text-2xl text-center font-extrabold text-white">
                    No city found
                  </Text>
                )}
                <View className="flex-row justify-center text-center ">
                  {/* <Image source={partlycloudy} className="w-52 h-52" /> */}
                  {weatherData ? (
                    <Image
                      source={
                        weatherImages[weatherData.description] ||
                        weatherImages["other"]
                      }
                      className="w-52 h-52 align-center"
                    />
                  ) : null}
                </View>
                {/* degree */}
                {weatherData ? (
                  <View className="space-y-2">
                    <Text className="text-6xl text-center text-white font-bold ml-5">
                      {parseInt(weatherData.temp)}&#176;
                    </Text>

                    <Text className="text-white text-xl text-center tracking-widest capitalize">
                      {weatherData.description}
                    </Text>
                  </View>
                ) : (
                  <View className="space-y-2">
                    <Text className="text-6xl text-center text-white font-bold ml-5">
                      23&#176;
                    </Text>
                    <Text className="text-white text-xl text-center tracking-widest capitalize">
                      Partly Cloudy
                    </Text>
                  </View>
                )}

                {/* other info */}
                {weatherData ? (
                  <View className="mx-4 justify-between flex-row">
                    <View className="flex-row space-x-2 items-center">
                      <Image source={wind_img} className="w-6 h-6" />
                      <Text className="text-white text-base font-semibold">
                        {(weatherData.wind * 1.609344).toFixed(2)}km
                      </Text>
                    </View>
                    <View className="flex-row space-x-2 items-center">
                      <Image source={drop} className="w-6 h-6" />
                      <Text className="text-white text-base font-semibold">
                        {weatherData.humidity}
                      </Text>
                    </View>
                    <View className="flex-row space-x-2 items-center">
                      <Image source={thermo} className="w-6 h-6 -mr-2" />
                      <Text className="text-white text-base font-semibold">
                        {" "}
                        {weatherData.temp_max}{" "}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="mx-4 justify-between flex-row">
                    <View className="flex-row space-x-2 items-center">
                      <Image source={wind_img} className="w-6 h-6" />
                      <Text className="text-white text-base font-semibold">
                        22km
                      </Text>
                    </View>
                    <View className="flex-row space-x-2 items-center">
                      <Image source={drop} className="w-6 h-6" />
                      <Text className="text-white text-base font-semibold">
                        23%
                      </Text>
                    </View>
                    <View className="flex-row space-x-2 items-center">
                      <Image source={thermo} className="w-6 h-6" />
                      <Text className="text-white text-base font-semibold">
                        22.06
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              {/* daily forecast */}
              {dailyForecast.length > 0 && (
                <View className="text-white mb-2 space-y-3">
                  <View className="flex-row items-center mx-5 space-x-2">
                    <CalendarDaysIcon size="25" color="white" />
                    <Text className="text-white text-base">Daily Forecast</Text>
                  </View>
                  <ScrollView
                    horizontal
                    contentContainerStyle={{
                      paddingVertical: 15,
                      marginLeft: 10,
                    }}
                    showsHorizontalScrollIndicator={false}
                    // className="bg-white"
                  >
                    {dailyForecast.map((item, index) => (
                      <View
                        key={index}
                        className="ml2 flex justify-center items-center w-24 rounded-3xl py-2 space-y-3 mr-4"
                        style={{ backgroundColor: theme.bgWhite(0.15) }}
                      >
                        <Image
                          source={
                            weatherImages[item.weather[0].description] ||
                            weatherImages["other"]
                          }
                          className="h-10 w-10"
                        />
                        <Text className="text-white text-base ">
                          {item.dayName}
                        </Text>
                        {/* <Text className="text-white text-base ">
                        {item.weather[0].description}
                      </Text> */}
                        <Text className="text-white text-xl font-semibold">
                          {item.main.temp}&#176;
                        </Text>
                      </View>
                    ))}
                    {/* <View
                  className="ml-2 flex justify-center items-center w-20 rounded-3xl py-2 space-y-2 mr-4"
                  style={{ backgroundColor: theme.bgWhite(0.3) }}
                >
                  <Image source={rain} className="h-10 w-10" />
                  <Text className="text-white text-base ">Monday</Text>
                  <Text className="text-white text-xl font-semibold">
                    13&#176;
                  </Text>
                </View>
                */}
                  </ScrollView>
                </View>
              )}
            </>
          )}
        </SafeAreaView>
      )}
    </View>
  );
}
{
  /* <View style={styles.home}>
<Text style={styles.text}>What's the Weather Now?</Text>
<Button
  title="Discover"
  color="warning"
  size="lg"
  onPress={handleNavigation}
  titleStyle={{ fontSize: 20, fontWeight: "bold" }}
  containerStyle={{ width: 200, alignItems: "left" }}
/>
<Button color="secondary">Secondaryyyy</Button> 
</View> */
}
