import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../assets/style';
import Constants from 'expo-constants';
import { useRef } from 'react'; 

const apiUrl = Constants.expoConfig?.extra?.API_URL || 'http://localhost:8000';

export default function EditProfile() {
  const navigation = useNavigation();
  const outletRef = useRef(0);
  const [form, setForm] = useState({
    outlet: '',
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    status: 1,
    job: '',
    job_address: '',
    hp: '',
    emergency_phone: '',
    identity_no: '',
    password: '',
    reff_id: '',
    birth_date: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const stored = await SecureStore.getItemAsync('userData');
      if (stored) {
        const userData = JSON.parse(stored);
        try {
          const response = await fetch(`${apiUrl}/getprofile`, {
            headers: {
              'Authorization': `Bearer ${userData.token}`,
              'Content-Type': 'application/json',
            },
          });
          const json = await response.json();
          if (json.error === 0 && json.member) {
            
            const member = json.member;
            outletRef.current = member.outlet;
            setForm((prevForm) => ({
              ...prevForm,
              outlet: member.outlet_name?.toString() || '',
              first_name: member.first_name || '',
              last_name: member.last_name || '',
              email: member.email || '',
              address: member.address || '',
              status: member.status,
              job: member.job || '',
              job_address: member.job_address || '',
              hp: member.hp || '',
              emergency_phone: member.emergency_phone || '',
              identity_no: member.identity_no || '',
              birth_date: member.birth_date?.split('T')[0] || '',
            }));
          }
        } catch (err) {
          console.error('Failed to fetch profile:', err);
        }
      }
    };
    loadData();
  }, []);

  const handleChange = (key, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    
    try {
      const stored = await SecureStore.getItemAsync('userData');
      if (!stored) return;
      const userData = JSON.parse(stored);
  
      // Buat payload yang sudah diubah (tidak kirim reff_id dan status, dan outlet diisi ulang)
      const payload = {
        ...form,
        outlet: parseInt(outletRef.current, 10), // ambil outlet dari userData
      };
      delete payload.reff_id;
      delete payload.status;
  
      const response = await fetch(`${apiUrl}/updateprofildata`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log('Submitting form:', payload);
      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (result.error === 0) {
          alert(result.message || 'Profil berhasil diperbarui');
        } else {
          alert(`Gagal update: ${result.message || 'Terjadi kesalahan'}`);
        }
      } catch (e) {
        console.error('Gagal parsing respons JSON:', text);
        alert('Terjadi kesalahan pada respons server.');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      alert('Gagal mengirim data ke server.');
    }
  };
  

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      handleChange('birth_date', isoDate);
    }
  };

  return (
    <LinearGradient colors={['#9E0000', '#ffffff']} style={styles.containerform}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <TextInput
              placeholder="Nama Depan"
              value={form.first_name}
              onChangeText={(val) => handleChange('first_name', val)}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Nama Belakang"
              value={form.last_name}
              onChangeText={(val) => handleChange('last_name', val)}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Email"
              value={form.email}
              onChangeText={(val) => handleChange('email', val)}
              style={styles.input}
              placeholderTextColor="#888"
              editable={false}
            />
            <TextInput
              placeholder="No HP"
              value={form.hp}
              onChangeText={(val) => handleChange('hp', val)}
              style={styles.input}
              placeholderTextColor="#888"
              keyboardType="numeric"
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text style={{ color: form.birth_date ? '#000' : '#888' }}>
                {form.birth_date || 'Tanggal Lahir'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={form.birth_date ? new Date(form.birth_date) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}

            <TextInput
              placeholder="Alamat"
              value={form.address}
              onChangeText={(val) => handleChange('address', val)}
              style={styles.input}
              placeholderTextColor="#888"
            />

            <View style={styles.input}>
            <Text style={{ color: form.outlet ? '#000' : '#888' }}>
                {form.outlet || 'Outlet'}
            </Text>
            </View>

            <View style={[styles.input, { padding: 0 }]}>
              <Picker
                selectedValue={form.job}
                onValueChange={(itemValue) => handleChange('job', itemValue)}
                style={{ height: 50 }}
              >
                <Picker.Item label="Pilih Pekerjaan" value="" />
                <Picker.Item label="Wiraswasta" value="Wiraswasta" />
                <Picker.Item label="Dokter" value="Dokter" />
                <Picker.Item label="Bidan" value="Bidan" />
                <Picker.Item label="Perawat" value="Perawat" />
                <Picker.Item label="Pegawai Negeri Sipil" value="Pegawai Negeri Sipil" />
                <Picker.Item label="Lainnya" value="Lainnya" />
              </Picker>
            </View>

            <TextInput
              placeholder="Alamat Kantor"
              value={form.job_address}
              onChangeText={(val) => handleChange('job_address', val)}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="No Telepon Darurat"
              value={form.emergency_phone}
              onChangeText={(val) => handleChange('emergency_phone', val)}
              style={styles.input}
              placeholderTextColor="#888"
              keyboardType="numeric"
            />
            <TextInput
              placeholder="No Identitas"
              value={form.identity_no}
              onChangeText={(val) => handleChange('identity_no', val)}
              style={styles.input}
              placeholderTextColor="#888"
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Kata Sandi"
              secureTextEntry
              value={form.password}
              onChangeText={(val) => handleChange('password', val)}
              style={styles.input}
              placeholderTextColor="#888"
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
