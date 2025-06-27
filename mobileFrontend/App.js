import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity } from 'react-native';


export default function App() {
  const [location, setLocation] = useState(null);
  const [toilets, setToiletCoordinates] = useState([]);   //setting initial coordinates to null
 const [searchAddress, setSearchAddress] = useState('');  //setting initial address to null
  const mapRef = useRef(null);


  const handleMapPress = (event) => {     //handler function for onPress property
    const { latitude, longitude } = event.nativeEvent.coordinate; //destructuring lat and lon from the event object returned by the onPress property
    console.log('Coordinates:', latitude, longitude);
    setToiletCoordinates((prev)=> [...prev, { latitude, longitude } ]); //setting co-ordinates using setter function
  };

  const handleAddressSearch = async () => {
    if(!searchAddress) return   //if search address is null then return right away
    const geocoded = await Location.geocodeAsync(searchAddress); //use geocodeAsync to search an address

    if (geocoded.length === 0) {  //if address is invalid the returned array will be empty
      alert('Address not found'); //
      return;
    }

    const {latitude, longitude} = geocoded[0]; //destructing latitude and longitude from the returned array
    console.log(latitude, longitude);

    const newCoord = { latitude, longitude }; //storing the new Cor-ordinates
    setToiletCoordinates((prev) => [...prev, newCoord]); //calling the setCordinates function with the new co-ordinates

    mapRef.current?.animateToRegion({  //move the maps to the location of the dropped pin
      ...newCoord,
      latitudeDelta: 0.02,
      longitudeDelta: 0.01,
    });
  }


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
      const res = await fetch(`https://3de8-47-153-48-155.ngrok-free.app/toilets?lat=${lat}&lon=${lon}`);
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

      <View style={styles.searchContainer}>
  
   <TextInput
          style={styles.input}
          placeholder="Enter an address"
          value={searchAddress}
    onChangeText={setSearchAddress}
          onSubmitEditing={handleAddressSearch}  //handler function for onSubmit
          returnKeyType="search"
        />

        <TouchableOpacity style={styles.clearButton} onPress={() => setSearchAddress('')}> 
          <Ionicons name="close-circle" size={20} color="gray" />
        </TouchableOpacity>
        </View>

            {/** Person locations */}
      {location ? (

      <MapView
        ref={mapRef}
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
        
            {/** Toilet locations */}
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
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // for Android shadow
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingRight: 30, // add padding so text doesn't overlap with the X
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
});


