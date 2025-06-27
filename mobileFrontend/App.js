import React, { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';


export default function App() {
  const [location, setLocation] = useState(null);
  const [toilets, setToiletCoordinates] = useState([]);   //setting initial coordinates to null



  const handleMapPress = (event) => {     //handler function for onPress property
    const { latitude, longitude } = event.nativeEvent.coordinate; //destructuring lat and lon from the event object returned by the onPress property
    console.log('Coordinates:', latitude, longitude);
    setToiletCoordinates((prev)=> [...prev, { latitude, longitude } ]); //setting co-ordinates using setter function
  };


  useEffect(()=> {

    // request for location permissions
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is needed to find restrooms nearby.');
        return;
      }

      // fetch availible restrooms on location
let {coords} = await Location.getCurrentPositionAsync({}); // returns a coords object
setLocation(coords);

fetchToilets(coords.latitude, coords.longitude);


    })(); // forgot to invoke the useEffect
  }, []);


  const fetchToilets = async (lat, lon) => {
    try {
      const res = await fetch(`https://5649-47-153-48-155.ngrok-free.app/toilets?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      console.log(data)

      setToiletCoordinates(data);
    } catch (err) {
      console.error('Failed to fetch toilets:', err);
    }
  };




  return (
    <View style={styles.container}>
      <Text>Need to go? You came to the right place.</Text>
      <StatusBar style="auto" />


      {location ? (

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        }}
         showsUserLocation={true}
        onPress={handleMapPress}  //calling handler function on press
      >
        

        {toilets.map((toilet) => (
          <Marker
            key={toilet.id}
            coordinate={{ 
              latitude: toilet.lat || toilet.latitude,
              longitude: toilet.lon || toilet.longitude,
 }} //required prop for Marker to place the pin on the maps
            pinColor={toilet.wheelchair === "yes" ? "green" : "red"}
         > 
               <Callout>
                <Text>Wheelchair accessible: {toilet.wheelchair}</Text>
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : ( <Text>Fetching location...</Text>)}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
});