import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
//import AsyncStorage from '@react-native-community/async-storage';
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