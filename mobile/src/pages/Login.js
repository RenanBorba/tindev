import React, { useState, useEffect } from 'react';
//import AsyncStorage from '@react-native-community/async-storage'
import
  {
    KeyboardAvoidingView,
    Platform,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    AsyncStorage
  } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import styles from "./styles/loginStyles";

export default function Login({ navigation }) {
  const [user, setUser] = useState('');

  useEffect(() => {
    // Obter user do storage
    AsyncStorage.getItem('user').then(user => {
      // Se usuário estiver ainda no storage
      if (user) {
        // Navegar para Main
        navigation.navigate('Main', { user })
      }
    })
  }, []);

  async function handleLogin() {
    // Enviar param. username na rota de Devs da api
    const response = await api.post('/devs', { username: user });

    const { _id } = response.data;

    await AsyncStorage.setItem('user', _id);

    // Após login, navegar para Main
    navigation.navigate('Main', { user: _id });
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={ Platform.OS === 'ios' }
      style={ styles.container }
    >
      <Image source={ logo } />

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Digite seu usuário no Github"
        placeholderTextColor="#999"
        style={ styles.input }
        value={ user }
        onChangeText={ setUser }
      />

      <TouchableOpacity onPress={ handleLogin }
        style={ styles.button }>
        <Text style={ styles.buttonText }>Enviar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};