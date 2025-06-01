import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';

const apiUrl = Constants.expoConfig?.extra?.API_URL || 'http://localhost:8000'; // Ambil dari env

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [outlet, setOutlet] = useState('');
  const [outlets, setOutlets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/outletlistfo`);
        const json = await response.json();
        const outletData = json.results || [];
        setOutlets(outletData);
      } catch (err) {
        setError('Gagal memuat outlet. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchOutlets();
  }, []);

  const sanitizeInput = (input) => {
    return input.replace(/[^\w\s@.]/gi, '');
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async () => {
    const sanitizedEmail = sanitizeInput(email.trim());
    const sanitizedPassword = sanitizeInput(password);

    if (!sanitizedEmail || !sanitizedPassword || !outlet) {
      setError('Email, password, dan outlet harus diisi.');
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      setError('Format email tidak valid.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${apiUrl}/loginmember`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          password: sanitizedPassword,
          outlet: parseInt(outlet),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        await SecureStore.setItemAsync('userToken', result.token);
        await SecureStore.setItemAsync('userData', JSON.stringify(result));
        
        Alert.alert('Login Berhasil', `Selamat datang, ${result.name || 'Member'}`, [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
              });
            },
          },
        ]);
      } else {
        setError(result.message || 'Login gagal.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
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
      <View style={styles.overlay}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>PrimeFit Login</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Icon name="exclamation-circle" size={20} color="#721c24" style={styles.errorIcon} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TextInput
            placeholder="Email"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={outlet}
              onValueChange={(itemValue) => setOutlet(itemValue)}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Pilih Outlet" value="" />
              {outlets.length > 0 ? (
                outlets.map((outletItem, index) => (
                  <Picker.Item key={index} label={outletItem.outlet_name} value={outletItem.id} />
                ))
              ) : (
                <Picker.Item label="Tidak ada outlet" value="" />
              )}
            </Picker>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Belum punya akun? Daftar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    color: '#000',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ff0000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#333',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    borderColor: '#f5c6cb',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    marginRight: 10,
  },
  errorText: {
    color: '#721c24',
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
  },
});
