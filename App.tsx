import React, { useEffect } from 'react';
import AppNavigator from './src/navigations/AppNavigators';
import MobileAds from 'react-native-google-mobile-ads';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 1000);
  })

  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => {

      })
  }, [])
  
  return <AppNavigator />
}

export default App
