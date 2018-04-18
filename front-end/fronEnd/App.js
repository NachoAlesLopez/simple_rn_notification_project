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

// Definimos la tarea a ejecutar
BackgroundTask.define(async () => {
  // En este caso, se trata de intentar obtener las notificaciones del servidor
  fetch("http://192.168.1.37:3001/test", {
      method: "GET"
    }).then((response) => response.json())
	.then((responseData) => {
	// Aqui se realizaría el tratamiento de notificaciones
        console.warn("Envía notificación");
        PushNotification.localNotification({
          title: responseData.notification.title,
          message: responseData.notification.description, // Este atributo es necesario para que se muestre la notificación, no obviarlo!
          actions: responseData.notification.actions // Con este atributo, podemos definir diferentes opciones que se mostrarán
        });
	// Avisamos de la finalización de la tarea
        BackgroundTask.finish();
      }).catch((err) => {
        console.err(err);
	// En el caso de que no se pueda obtener la notificación, volvemos a avisar  
        BackgroundTask.finish();
      });
    // Finalmente, para asegurar la tarea repetida, volvemos a solicitar una tarea en 2º plano
    BackgroundTask.schedule({
      period: 40 // Un periodo de 40 equivale a menos de 15 minutos, pero esto no es considerado por el SO salvo en casos especificos (aseguramos de intentar pedirlo antes de 15 minutos
    );
})

export default class App extends Component<Props> {
  // Definimos la configuración del sistema de notificaciones
  configureNotifications = () => {
    PushNotification.configure({
      onRegister: (token) => {
        console.log("Registered with token " + token); // El token (creo) que reconoce al equipo, pero no nos haría falta en este caso
      },

      onNotification: (notification) => {
        // Cuando haya una notificación. ¿Debemos realizar algo? Aqui se pondrá 
        console.log("Notification received " + notification);

	// Confirmamos la realización de la notificación
        notification.finish();
      }
    })
  }

  // Con esto podremos configurar el handler de las acciones definidas, debería estar fuera de la actividad!
  configureNotificationHandler = () => {
    PushNotification.registerNotificationActions(['I\'m making a note here', 'Huge success!']);
    DeviceEventEmitter.addListener("notificationActionReceived", (action) => {
      console.log("Received action " + action);
			const info = JSON.parse(action.dataJSON);
			// Con este `if`, detectaremos si la acción es de un tipo u otro
      if (info.action == 'Huge success!') {
        alert("It appears so");
      }
    })

  }

	// Ejemplo de creación de notificación
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
		// Indicamos el handler, de nuevo esto se definiría afuera del componente
    this.configureNotificationHandler();
  }

  render() {
    return (
      <Text>Prueba de notificaciones</Text>
    );
  }

	// Este es importante, para asegurar que la tarea en 2º plano se ejecuta, debemos llamar aqui a `.schedule()`
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
