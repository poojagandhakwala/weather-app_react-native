import AsyncStorage from "@react-native-async-storage/async-storage";

//storing data 
export const storeData = async (key,value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log('stored = ',key,value);
  } catch (e) {
    // saving error
    console.log('error in storing data = ',e)
  }
};
//reading data 
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // value previously stored
      console.log('value in getData = ',value);
      return value;
    }
  } catch (e) {
    // error reading value
    console.log('error in reading data = ',e)
  }
};