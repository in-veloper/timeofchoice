import React, { useEffect } from 'react';
import AppNavigator from './src/navigations/AppNavigators';
import MobileAds from 'react-native-google-mobile-ads';

const App = () => {
  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => {

      })
  }, [])
  
  return <AppNavigator />
}

export default App
