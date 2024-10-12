// CreateNoteScreen.js

import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateNoteScreen = ({ navigation }) => {
  const [noteText, setNoteText] = useState('');

  const saveNote = async () => {
    if (noteText.trim() === '') {
      return;
    }

    try {
      const notesString = await AsyncStorage.getItem('@notes');
      const notesArray = notesString ? JSON.parse(notesString) : [];
      notesArray.push(noteText);
      await AsyncStorage.setItem('@notes', JSON.stringify(notesArray));
      navigation.navigate('Notes'); // Navigate back to NotesScreen
    } catch (e) {
      console.error('Failed to save note:', e);
    }
  };

  const Container = Platform.OS === 'web' ? View : KeyboardAvoidingView;

  return (
    <Container
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TextInput
        style={styles.textInput}
        placeholder="Write your note here..."
        placeholderTextColor="#aaa"
        value={noteText}
        onChangeText={setNoteText}
        multiline
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveNote}
      >
        <Text style={styles.buttonText}>Save Note</Text>
      </TouchableOpacity>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Changed to black background
    padding: 16,
  },
  textInput: {
    backgroundColor: '#333', // Dark gray background
    padding: 16,
    fontSize: 16,
    borderRadius: 8,
    height: 200,
    textAlignVertical: 'top',
    color: '#fff', // White text
  },
  saveButton: {
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

export default CreateNoteScreen;
