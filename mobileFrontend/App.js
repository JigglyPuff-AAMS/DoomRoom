import React, { useState, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function App() {
  const [coordinates, setCoordinates] = useState([]); //setting initial coordinates to null
  const [searchAddress, setSearchAddress] = useState('');  //setting initial address to null
  const mapRef = useRef(null);

  const handleMapPress = (event) => {     //handler function for onPress property
    const { latitude, longitude } = event.nativeEvent.coordinate; //destructuring lat and lon from the event object returned by the onPress property
    console.log('Coordinates:', latitude, longitude);
    setCoordinates((prev)=> [...prev, { latitude, longitude } ]); //setting co-ordinates using setter function
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
    setCoordinates((prev) => [...prev, newCoord]); //calling the setCordinates function with the new co-ordinates

    mapRef.current?.animateToRegion({  //move the maps to the location of the dropped pin
      ...newCoord,
      latitudeDelta: 0.02,
      longitudeDelta: 0.01,
    });
  }

  return (
    <View style={styles.container}>
      <Text>Need to go? You camet to the right place.</Text>
      <StatusBar style="auto" />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -33.860664,
          longitude: 151.208138,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}  //calling handler function on press
      >
        {coordinates.map((latLon, index)  => (
          <Marker
            key={index}
            coordinate={latLon} //required prop for Marker to place the pin on the maps
            pinColor="red"
          /> //render marker if coordinates exist
        ))}
      </MapView>
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
