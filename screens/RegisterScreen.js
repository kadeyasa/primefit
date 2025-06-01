import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import Constants from 'expo-constants';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import ikon

const apiUrl = Constants.expoConfig?.extra?.API_URL || 'http://localhost:8000'; // Ambil dari env

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reffCode, setReffCode] = useState('');

  useEffect(() => {
    fetchOutlets();
  }, []);

  const fetchOutlets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/outletlistfo`);
      const json = await response.json();
      const outletData = json.results || [];
      setOutlets(outletData);
    } catch (err) {
      //console.error('Error fetching outlets:', err);
      setError('Gagal memuat outlet. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      outlet: parseInt(selectedOutlet, 10),
      phone_number: phoneNumber,
      reff_code: reffCode,
    };

    //console.log('Register Payload:', payload);

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/registermember`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sukses', 'Registrasi berhasil!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        //console.log('Register Error:', data);
        setError(data.message || 'Registrasi gagal. Coba lagi.');
      }
    } catch (err) {
      //console.error('Error during registration:', err);
      setError('Terjadi kesalahan saat registrasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b' }}
      style={styles.background}
      blurRadius={4}
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Daftar PrimeFit</Text>

          {/* Menampilkan error jika ada */}
          {error && (
            <View style={styles.errorBox}>
              <Icon name="exclamation-triangle" size={20} color="#721c24" style={styles.errorIcon} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TextInput
            placeholder="Nama Depan"
            placeholderTextColor="#555"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <TextInput
            placeholder="Nama Belakang"
            placeholderTextColor="#555"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          <TextInput
            placeholder="Konfirmasi Password"
            placeholderTextColor="#555"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry
          />
          <TextInput
            placeholder="Nomor HP"
            placeholderTextColor="#555"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
          />

          <TextInput
            placeholder="Kode Referensi"
            placeholderTextColor="#555"
            value={reffCode}
            onChangeText={setReffCode}
            style={styles.input}
          />


          {loading ? (
            <ActivityIndicator size="large" color="#ff0000" />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedOutlet}
                onValueChange={setSelectedOutlet}
              >
                <Picker.Item label="Pilih Outlet" value="" />
                {outlets.map((outlet) => (
                  <Picker.Item key={outlet.id} label={outlet.outlet_name} value={outlet.id} />
                ))}
              </Picker>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Daftar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Sudah punya akun? Masuk</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255,0,0,0.5)',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#ff0000',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#333',
  },
  // Error message style
  errorBox: {
    backgroundColor: '#f8d7da',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  errorIcon: {
    marginRight: 10,
  },
  errorText: {
    color: '#721c24',
    fontWeight: 'bold',
  },
});
