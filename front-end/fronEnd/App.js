/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter
} from 'react-native';
var PushNotification = require('react-native-push-notification');
var BackgroundTask = require('react-native-background-task');
import QueueFactory from 'react-native-queue';

PushNotification.configure({
  onRegister: (token) => {
    console.log("Registered with token " + token);
  },

  onNotification: (notification) => {
    console.log("Notification received " + notification);

    notification.finish();
  }
});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

BackgroundTask.define(async () => {
  fetch("http://192.168.1.37:3001/test", {
      method: "GET"
    }).then((response) => response.json())
      .then((responseData) => {
        console.warn("Envía notificación");
        PushNotification.localNotification({
          title: responseData.notification.title,
          message: responseData.notification.description,
          actions: responseData.notification.actions
        });
        BackgroundTask.finish();
      }).catch((err) => {
        console.err(err);
        BackgroundTask.finish();
      });
  BackgroundTask.schedule();
})

export default class App extends Component<Props> {
  configureNotifications = () => {
    PushNotification.configure({
      onRegister: (token) => {
        console.log("Registered with token " + token);
      },

      onNotification: (notification) => {
        console.log("Notification received " + notification);

        notification.finish();
      }
    })
  }

  configureNotificationHandler = () => {
    PushNotification.registerNotificationActions(['I\'m making a note here', 'Huge success!']);
    DeviceEventEmitter.addListener("notificationActionReceived", (action) => {
      console.log("Received action " + action);
      const info = JSON.parse(action.dataJSON);
      if (info.action == 'Huge success!') {
        alert("It appears so");
      }
    })

  }

  sendTestingNotification = () => {
    PushNotification.localNotification({
      id: 0,
      title: "GLaDoS says...",
      message: "This is a triumph",
      playSound: true,
      soundName: "default",
      repeatType: 'minute',
      actions: '["I\'m making a note here", "Huge success!" ]',
    });
  }

  constructor() {
    super();
    this.configureNotificationHandler();
  }

  render() {
    return (
      <Text>Prueba de notificaciones</Text>
    );
  }

  componentDidMount() {
    BackgroundTask.schedule({
      period: 400
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
