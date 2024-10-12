// NotesScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotesScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);

  // Load notes when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadNotes();
    });
    return unsubscribe;
  }, [navigation]);

  const loadNotes = async () => {
    try {
      const notesString = await AsyncStorage.getItem('@notes');
      const notesArray = notesString ? JSON.parse(notesString) : [];
      setNotes(notesArray);
    } catch (e) {
      console.error('Failed to load notes:', e);
    }
  };

  const deleteNote = (index) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedNotes = [...notes];
              updatedNotes.splice(index, 1);
              await AsyncStorage.setItem('@notes', JSON.stringify(updatedNotes));
              setNotes(updatedNotes);
            } catch (e) {
              console.error('Failed to delete note:', e);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const editNote = (index) => {
    const noteToEdit = notes[index];
    navigation.navigate('EditNote', { noteText: noteToEdit, noteIndex: index });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() => {
        // Show options to Edit or Delete
        Alert.alert(
          'Note Options',
          'What would you like to do?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Edit',
              onPress: () => editNote(index),
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => deleteNote(index),
            },
          ],
          { cancelable: true }
        );
      }}
    >
      <Text style={styles.noteText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes available.</Text>}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateNote')}
      >
        <Text style={styles.buttonText}>Create New Note</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Changed to black background
    padding: 16,
  },
  noteItem: {
    backgroundColor: '#333', // Dark gray background for notes
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 16,
    color: '#fff', // White text
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa', // Light gray text
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50', // Green button
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 16,
  },
});

export default NotesScreen;
