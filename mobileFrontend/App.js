import React, { useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [coordinates, setCoordinates] = useState(null);   //setting initial coordinates to null

  const handleMapPress = (event: MapPressEvent) => {     //handler function for onPress property
    const { latitude, longitude } = event.nativeEvent.coordinate; //destructuring lat and lon from the event object returned by the onPress property
    console.log('Coordinates:', latitude, longitude);
    setCoordinates({ latitude, longitude }); //setting co-ordinates using setter function
  };

  return (
    <View style={styles.container}>
      <Text>LETS GOOOO!!!!</Text>
      <StatusBar style="auto" />

      <MapView
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
        {coordinates && (    //render marker if coordinates exists
          <Marker
            coordinate={coordinates} //required prop for Marker to place the pin on the maps
            pinColor="red"
          />
        )}
      </MapView>
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
