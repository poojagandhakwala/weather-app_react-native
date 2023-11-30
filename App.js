import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Text, View } from "react-native";
import Home from "./screens/Home.js";
import Weather from "./screens/Main.js";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import background from "./screens/images/bg1-cropped.jpg";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

export default function App() {
  const Stack = createStackNavigator();

  const Tab = createBottomTabNavigator();

  const MainTabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { display: "none", height: 0, overflow: "hidden" }, // Hide the entire tab bar
          // Or use the following line to hide only the bottom border line
          tabBarStyle: { borderTopWidth: 0 },
          // You can also use additional styling options as needed
          tabBarItemStyle: { backgroundColor: "skyblue" },
          tabBarInactiveBackgroundColor: "transparent",
        }}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen
          name="Weather"
          component={Weather}
          options={{ tabBarStyle: { display: "none" }, tabBarVisible: false }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <View className="flex-1 relative">
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={Home}
          />
          <Stack.Screen
            name="Weather"
            component={Weather}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          /> */}
        </Stack.Navigator>
      </View>
      <StatusBar style="light-content" />
    </NavigationContainer>
  );
}

{
  /* {locations.length > 0 && showSearch && (
            <View className="bg-gray-300 w-full absolute top-16 rounded-3xl mt-3">
              {locations.map((item, index) => {
                let showBorder = index + 1 !== locations.length;
                let borderClass = showBorder
                  ? "border-b-2 border-b-gray-400"
                  : "";
                return (
                  <TouchableOpacity
                    key={index}
                    className={
                      " flex-row items-center p-3 px-4 border-0 mb-1 " +
                      borderClass
                    }
                    onPress={() => handleLocation(item)}
                  >
                    <MapPinIcon size="20" color="gray" />
                    <Text className="text-black text-lg ml-2">
                      London, United Kingdom
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )} */
}
