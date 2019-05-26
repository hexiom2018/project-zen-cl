import React from 'react';
import { MainNavigation } from './src/app/navigations';
import { AppRegistry, AsyncStorage, AppState } from "react-native";
import { name as appName } from "./app.json";
import firebase from "firebase";


export default class App extends React.Component {
  constructor() {
    super()

    this.state = {
      appState: AppState.currentState
    }
  }

  componentWillMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  async updateState(online) {
    let uid = await AsyncStorage.getItem("auth");

    if (uid) {
      if (online) {
        firebase.database().ref('/neighborhood/' + uid).update({ online: true })
      } else {
        firebase.database().ref('/neighborhood/' + uid).update({ online: false })
      }
    }

  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {

      console.log('App has come to the foreground!')
      this.updateState(true)

    } else {

      console.log('App has gone to the background!')
      this.updateState(false)

    }
    this.setState({ appState: nextAppState });
  }

  render() {
    return (
      <MainNavigation />
    );
  }
}

AppRegistry.registerComponent(appName, () => App);