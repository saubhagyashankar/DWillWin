// MainScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AppState,
  Modal,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainScreen = ({ navigation }) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [daysUntilNextFibo, setDaysUntilNextFibo] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const [isFiboModalVisible, setIsFiboModalVisible] = useState(false);

  // Function to check if a number is a Fibonacci number
  const isFibonacci = (num) => {
    const isPerfectSquare = (x) => {
      var a = 0;
      var b = 1;
      while (b < x) {
        var temp = b;
        b += a;
        a = temp;
      }
      return b == x || x == 0;
    };
    return isPerfectSquare(num);
  };

  // Function to get the next Fibonacci number greater than current number
  const getNextFibonacci = (num) => {
    let a = 0;
    let b = 1;
    while (b <= num) {
      const temp = b;
      b = a + b;
      a = temp;
    }
    return b;
  };

  // Function to update the number based on how many days have passed
  const updateNumber = async () => {
    try {
      const lastDate = await AsyncStorage.getItem('@lastDate');
      const storedNumber = await AsyncStorage.getItem('@currentNumber');

      const today = new Date(); // Get current date
      const todayDateString = today.toDateString(); // For updating lastDate

      // Ensure storedNumber is parsed properly or fallback to 0
      let number = storedNumber ? parseInt(storedNumber, 10) : 0;

      // If this is the first time running the app, just save today's date
      if (!lastDate) {
        await AsyncStorage.setItem('@lastDate', todayDateString);
        await AsyncStorage.setItem('@currentNumber', number.toString());
        setCurrentNumber(number);
        return;
      }

      // Calculate the number of days between lastDate and today
      const lastDateObject = new Date(lastDate);
      const differenceInTime = today.getTime() - lastDateObject.getTime();
      const daysPassed = Math.floor(differenceInTime / (1000 * 3600 * 24));

      if (daysPassed > 0) {
        // Increment the number by the number of days passed
        number += daysPassed;
        await AsyncStorage.setItem('@currentNumber', number.toString());
        await AsyncStorage.setItem('@lastDate', todayDateString); // Update last date to today
        console.log(`Updated number to ${number}, ${daysPassed} days passed`);
      }

      // Update state with the new/current number
      setCurrentNumber(number);
    } catch (e) {
      console.error('Error updating number:', e);
    }
  };

  // Function to handle Fibonacci number prompt
  const handleFibonacciPrompt = () => {
    setIsFiboModalVisible(true);
  };

  // Effect to check for Fibonacci number
  useEffect(() => {
    if (currentNumber > 0 && isFibonacci(currentNumber)) {
      handleFibonacciPrompt();
    }
    // Calculate days until next Fibonacci number
    const nextFibo = getNextFibonacci(currentNumber);
    const daysUntilNext = nextFibo - currentNumber;
    setDaysUntilNextFibo(daysUntilNext);
  }, [currentNumber]);

  // Effect to handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          // App has come to the foreground
          updateNumber();
        }
        setAppState(nextAppState);
      }
    );

    // Initial update when app starts
    updateNumber();

    return () => {
      subscription.remove();
    };
  }, []);

  // Handler for 'Stop' action
  const handleStop = async () => {
    await AsyncStorage.setItem('@currentNumber', '0');
    setCurrentNumber(0);
    setIsFiboModalVisible(false);
  };

  // Handler for 'Continue' action
  const handleContinue = () => {
    setIsFiboModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.numberText}>{currentNumber}</Text>
      <Text style={styles.infoText}>
        Saubhagya!!! Please give your everything for the next: {daysUntilNextFibo} day/s
        <br/>
        <center>Just do it man!</center>
      </Text>

      {/* Button to navigate to Notes */}
      <TouchableOpacity
        style={styles.notesButton}
        onPress={() => navigation.navigate('Notes')}
      >
        <Text style={styles.buttonText}>Wisdom</Text>
      </TouchableOpacity>

      {/* Modal for Fibonacci Prompt */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isFiboModalVisible}
        onRequestClose={() => {
          setIsFiboModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Fibonacci Number Reached!</Text>
            <Text style={styles.modalMessage}>
              You've reached a Fibonacci number: {currentNumber}. Do you want to
              continue or stop?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleStop}
              >
                <Text style={styles.buttonText}>Stop</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleContinue}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  numberText: {
    fontSize: 62,
    fontWeight: 'bold',
    color: '#fff', // White text
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#fff', // White text
  },
  // Button to navigate to Notes
  notesButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Black text
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 18,
    color: '#000', // Black text
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MainScreen;
