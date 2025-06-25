import React from 'react';
import MapView, {PROVIDER_GOOGLE } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, } from 'react-native';

// import {APIProvider, Map} from '@vis.gl/react-google-maps' // react web library


export default function App() {
  return (
    <View style={styles.container}>
      <Text>LETS GOOOO!!!!</Text>
      <StatusBar style="auto" />
        <MapView
        provider={PROVIDER_GOOGLE} /* This property works on both Android and iOS.
Rebuild the app binary (or re-submit to the Google */
          style={styles.map}
          initialRegion={{
          latitude: -33.860664,
          longitude: 151.208138,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});