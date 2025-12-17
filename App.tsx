import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <Text style={styles.title}>Maison Neue Bold</Text>
          <Text style={styles.subtitle}>Maison Neue Book (Regular)</Text>
          <Text style={styles.default}>Font Bawaan HP (Default)</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101820', 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'MaisonNeue-Bold', 
    fontSize: 28,
    color: '#ECAE36', 
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'MaisonNeue-Book',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  default: {
    fontSize: 14,
    color: '#758389', 
  },
});

export default App;