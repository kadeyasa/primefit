import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import styles from '../assets/style';
import * as SecureStore from 'expo-secure-store';

const apiUrl = Constants.expoConfig?.extra?.API_URL || 'http://localhost:8000';

export default function MemberShipUpgradeForm() {
  const navigation = useNavigation();
  const [membershipType, setMembershipType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [membershipOptions, setMembershipOptions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [paymentOptions, setPaymentOptions] = useState([]);


  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = JSON.parse(await SecureStore.getItemAsync('userData'));
        //console.log(userData);
        if (userData) {
          setUserData(userData); // Set the user data if available
        }
      } catch (error) {
        console.error('Error loading user data', error);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (!userData) return;
  
    // Ambil data metode pembayaran dari API
    fetch(`${apiUrl}/getassetaccounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData.token}`,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setPaymentOptions(data?.results || []);
      })
      .catch((err) => {
        console.error('Gagal memuat metode pembayaran:', err);
        Alert.alert('Error', 'Gagal mengambil metode pembayaran');
      });
  }, [userData]);


  useEffect(() => {
    if (!userData) return;
  
    fetch(`${apiUrl}/getmembership`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData.token}`,
      },
      body: JSON.stringify({
        outlet: userData.outlet,
        limit: 100,
        start: 0,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        
        setMembershipOptions(data?.results || []);
      })
      .catch((err) => {
        console.error('Gagal memuat membership:', err);
        Alert.alert('Error', 'Gagal mengambil data membership');
      });
  }, [userData]);
  

  const handleUpgrade = () => {
    if (!membershipType || !paymentMethod) {
      Alert.alert('Peringatan', 'Silakan pilih jenis membership dan metode pembayaran.');
      return;
    }

    Alert.alert('Sukses', `Upgrade ke ${membershipType} menggunakan ${paymentMethod}`);
  };

  return (
    <LinearGradient
      colors={['#9E0000', '#ffffff']}
      style={styles.containerform}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Upgrade Membership</Text>
      </View>

      <Text style={styles.label}>Jenis Membership</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={membershipType}
          onValueChange={(itemValue) => setMembershipType(itemValue)}
        >
          <Picker.Item label="Pilih Membership" value="" />
          {membershipOptions.map((option, index) => (
            <Picker.Item key={index} label={option.name+' ( '+option.price+' )'} value={option.name} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Metode Pembayaran</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={paymentMethod}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        >
          <Picker.Item label="Pilih Metode" value="" />
          {paymentOptions.map((option, index) => (
            <Picker.Item
              key={index}
              label={option.AccountName}
              value={option.AccountName}
            />
          ))}
        </Picker>
      </View>


      <TouchableOpacity style={styles.button} onPress={handleUpgrade}>
        <Text style={styles.buttonText}>Proses Upgrade</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
