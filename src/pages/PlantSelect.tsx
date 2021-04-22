import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { EnvironmentButton } from '../components/EnvironmentButton';

import api from '../services/api';
import { Header } from '../components/Header';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { PlantCardPrimary } from '../components/PlantCardPrimary';

interface Environment {
  key: string;
  title: string;
}

interface Plant {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: Array<string>;
  frequency: {
    times: number;
    repeat_every: string;
  }
}


export function PlantSelect() {
  const [environments,setEnvironments] = useState<Environment[]>();
  const [plants,setPlants] = useState<Plant[]>();
  
  useEffect(() => {
     api.get('/plants_environments?_sort=title&_order=asc')
     .then(response => {
        setEnvironments([
          { key: 'all', title: 'Todos' },
          ...response.data
        ])
     })
  },[]);

  useEffect(() => {
    api.get('/plants?_sort=name&_order=asc').then(response => {
      setPlants(response.data)
    })
 },[]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header title="Olá" titleBold="Leonardo" />
        <Text style={styles.title}>
          Em qual hambiente
        </Text>
        <Text style={styles.subtitle}>
          você quer colocar sua planta?
        </Text>
      </View>

      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
          data={environments}
          renderItem={({item }) => (
            <EnvironmentButton title={item.title} />
          )}
        >
        </FlatList>
      </View>
        
      <View style={styles.plants}>
        <FlatList
          numColumns={2}
          showsVerticalScrollIndicator={false}
          data={plants}
          renderItem={({ item }) => (
            <PlantCardPrimary data={item} />
          )}
        >      
        </FlatList>
      </View>



    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 32,
  },

  title: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.heading,
    lineHeight: 23,
    marginTop: 15,
  },

  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    color: colors.heading,
    lineHeight: 20,
  },

  environmentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    paddingHorizontal: 32,
    marginVertical: 32,
  },

  plants: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 8,
    justifyContent: 'center',
  },
})