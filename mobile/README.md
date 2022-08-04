<div align="center">

## Rocketseat - Semana OmniStack 8.0
# Projeto - Aplicação Tindev Mobile React Native

</div>

<br>

<div align="center">
 
[![Generic badge](https://img.shields.io/badge/Made%20by-Renan%20Borba-purple.svg)](https://shields.io/) [![Build Status](https://img.shields.io/github/stars/RenanBorba/tindev.svg)](https://github.com/RenanBorba/tindev) [![Build Status](https://img.shields.io/github/forks/RenanBorba/tindev.svg)](https://github.com/RenanBorba/tindev) [![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/) [![npm version](https://badge.fury.io/js/react-native.svg)](https://badge.fury.io/js/react-native) [![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

</div>

<br>

<div align="center">
 
![logo](https://user-images.githubusercontent.com/48495838/80020082-d91db480-84ae-11ea-90a9-d55ba77322b2.png)

</div>

<br>

Aplicação Front-end desenvolvida em React Native para o clone do aplicativo Tinder, voltada para busca e matches de devs. Permite, assim, a atualização em tempo real dos matches entre desenvolvedores via WebSocket.

<br><br>

<div align="center">

![02](https://user-images.githubusercontent.com/48495838/74784998-f86a4c80-5287-11ea-9c8c-d3dd11c703e1.JPG)

</div>

<br><br>

## :rocket: Tecnologias
<ul>
  <li>Expo</li>
  <li>Components</li>
  <li>Routes</li>
  <li>react-navigation</li>
  <li>Services API</li>
  <li>Axios</li>
  <li>AsyncStorage</li>
  <li>useState</li>
  <li>useEffect</li>
  <li>socket.io-client WebSocket</li>
  <li>StyleSheet</li>
  <li>SafeAreaView</li>
  <li>KeyboardAvoidingView</li>
  <li>Platform</li>
  <li>TextInput</li>
  <li>TouchableOpacity</li>
</ul>

<br><br>

## :arrow_forward: Start
<ul>
  <li>npm install</li>
  <li>npm run start / npm start</li>
</ul>

<br><br><br>

## :mega: ⬇ Abaixo, as principais estruturas e interfaces:

<br><br><br>

## src/routes.js
```js
import
  {
    createAppContainer,
    createSwitchNavigator
  } from 'react-navigation';

import Login from './pages/Login';
import Main from './pages/Main';

export default createAppContainer(
  createSwitchNavigator({
    Login,
    Main
  })
);
```


<br><br>


## src/services/api.js

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333'
});

export default api;
```


<br><br>


## src/pages/Login.js
```js
import React, { useState, useEffect } from 'react';
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
```


<br><br>


## Interface inicial
![00](https://user-images.githubusercontent.com/48495838/74784347-762d5880-5286-11ea-9f2b-89ac8a443748.JPG)
<br><br>


![01](https://user-images.githubusercontent.com/48495838/74784994-f7391f80-5287-11ea-99f6-dbcfd38fc509.JPG)


<br><br><br><br>


## src/pages/Main.js
```js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import
  {
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    AsyncStorage
  } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';
import styles from "./styles/mainStyles";

// prop navigation
export default function Main({ navigation }) {
  // Obter param. id da navegação
  const id = navigation.getParam('user');

  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      // Obter param. id na rota de Devs da api
      const response = await api.get('/devs', {
        headers: {
          user: id
        }
      })

      setUsers(response.data);
    }

    loadUsers();
  }, [id]);

  useEffect(() => {
    // Conexão Websocket
    const socket = io('http://192.168.0.104:3333', {
      // query param
      query: { user: id }
    });

    // Ouvir message 'match' do websocket da api
    socket.on('match', dev => {
      setMatchDev(dev);
    })
  }, [id]);

  async function handleLike() {
    // ...rest = todo resto de usuários
    const [user, ...rest] = users;

    // Enviar param. id na rota de Likes na api
    await api.post(`/devs/${user._id}/likes`, null, {
      headers: { user: id }
    })

    setUsers(rest);
  }

  async function handleDislike() {
    const [user, ...rest] = users;

    // Enviar param. id na rota de Dislikes na api
    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: { user: id }
    })

    setUsers(rest);
  }

  async function handleLogout() {
    // Limpar storage
    await AsyncStorage.clear();

    // Navegar para 'Login' após logout
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={ styles.container }>
      <TouchableOpacity onPress={ handleLogout }>
        <Image style={ styles.logo } source={ logo } />
      </TouchableOpacity>

      <View style={ styles.cardsContainer }>
        {/*
          Renderizar text, se usuários forem igual a 0
          Senão, renderizar usuário
        */}
        { users.length === 0
          ? <Text style={ styles.empty }>Acabou :( </Text>
          : (
            users.map((user, index) => (
              <View key={ user._id }
                style={[styles.card, { zIndex: users.length - index }]}
              >
                <Image style={ styles.avatar }
                  source={{ uri: user.avatar }}
                />
                <View style={ styles.footer }>
                  <Text style={ styles.name }>
                    {user.name}
                  </Text>
                  <Text style={ styles.bio }
                    numberOfLines={3}
                  >
                    { user.bio }
                  </Text>
                </View>
              </View>
            ))
          )}
      </View>

      {/*
        Após, se usuários forem maior a 0,
        sempre renderizar agrupamento de botões
      */}
      { users.length > 0 && (
        <View style={ styles.buttonsContainer }>
          <TouchableOpacity
            style={ styles.button }
            onPress={ handleDislike }
          >
            <Image source={ dislike } />
          </TouchableOpacity>
          <TouchableOpacity
            style={ styles.button }
            onPress={ handleLike }
          >
            <Image source={ like } />
          </TouchableOpacity>
        </View>
      ) }

      {/* Renderizar quando der match */}
      { matchDev && (
        <View style={ styles.matchContainer }>
          <Image
            style={ styles.matchImage }
            source={ itsamatch }
          />
          <Image
            style={ styles.matchAvatar }
            source={{ uri: matchDev.avatar }}
          />

          <Text style={ styles.matchName }>
            { matchDev.name }
          </Text>
          <Text style={ styles.matchBio }>
            { matchDev.bio }
          </Text>

          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={ styles.closeMatch }>FECHAR</Text>
          </TouchableOpacity>
        </View>
      ) }
    </SafeAreaView>
  );
};
```

<br><br>

## Interface após o login do usuário

![02](https://user-images.githubusercontent.com/48495838/74784998-f86a4c80-5287-11ea-9c8c-d3dd11c703e1.JPG)

<br><br>

### Interface após o match entre os usuários (Após realizar login com outro usuário)

![03](https://user-images.githubusercontent.com/48495838/74784438-a7a62400-5286-11ea-9448-d4f9409e622a.JPG)

<br><br>

![04](https://user-images.githubusercontent.com/48495838/74784461-b12f8c00-5286-11ea-9932-63dd24dd3e38.JPG)
<br><br>


![05](https://user-images.githubusercontent.com/48495838/74784478-bbea2100-5286-11ea-97ab-60646448cc26.JPG)
