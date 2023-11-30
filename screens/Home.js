import { View, Text, TouchableOpacity } from "react-native";
import background from "./images/home-bg.jpg";
import { Image } from "react-native";
import { Button } from "react-native";
import cloud from "./images/partlycloudy.png";
import { useNavigation } from "@react-navigation/native";

// import { Button } from "@rneui/themed";

export default function Home() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 relative">
      <Image
        source={background}
        blurRadius={70}
        className="absolute h-full w-full "
      />
      <View className="items-center flex flex-1 justify-center top-20">
        <Image source={cloud} className="w-52 h-52 -top-28" />
        <View className="my-3 bottom-4 justify-center items-center ">
          <Text className="text-5xl font-semibold text-white tracking-widest">
            Weather
          </Text>
          <Text className="text-5xl font-light text-white tracking-widest">
            Forecasts
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Weather")}
          className="bg-blue-900 rounded-3xl p-3 px-5 top-8"
        >
          <Text className="text-lg text-white font-semibold ">Get Started</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

// Home.navigationOptions={tabBarVisi}
