import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import MemberShipUpgradeForm from './UpgradeMembershipScreen';
import styles from '../assets/style';

const Tab = createBottomTabNavigator();

// Dummy screen for tabs other than the dashboard
function UpgradeMembershipScreen() {
  return <MemberShipUpgradeForm />;
}

function TutorialScreen() {
  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Tutorial</Text>
    </View>
  );
}

function LogoutScreen({ navigation }) {
  useEffect(() => {
    const logout = async () => {
      await SecureStore.deleteItemAsync('userData'); // pakai deleteItemAsync (lebih dianjurkan)
      navigation.replace('Login');
    };
    logout();
  }, [navigation]);

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Logging out...</Text>
    </View>
  );
}

// Main Dashboard Home Screen
function DashboardHomeScreen({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [userData, setUserData] = useState(null);

  // Function to handle barcode scan
  const handleScan = () => {
    // Logic for barcode scanning goes here
    // For demonstration, we'll just set scanned to true
    setScanned(true);
  };

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await SecureStore.getItemAsync('userData');
        //console.log(userData);
        if (userData) {
          setUserData(JSON.parse(userData)); // Set the user data if available
        }
      } catch (error) {
        console.error('Error loading user data', error);
      }
    };
    loadUserData();
  }, []);

  if (!userData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#9E0000', '#FF3C00', '#ffffff']} // Deep red ke orange terang
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.background}
    >
      <ScrollView style={styles.container}>
        
        {/* Top Navigation */}
        <LinearGradient
          colors={['#B00000', '#FF3C00']} // Topbar merah gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topBar}
        >
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <View  style={styles.profileContainer}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                style={styles.profileImage}
              />
              <Text style={styles.memberName}>Selamat Datang, {userData.name}</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="bell" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Main Menu */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuCard}>
            <Icon name="flag-checkered" size={40} color="#e74c3c" />
            <Text style={styles.menuText}>Misi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuCard}>
            <Icon name="shopping-cart" size={40} color="#e74c3c" />
            <Text style={styles.menuText}>Shopping</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuCard}>
            <Icon name="gift" size={40} color="#e74c3c" />
            <Text style={styles.menuText}>Point</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuCard}>
            <Icon name="users" size={40} color="#e74c3c" />
            <Text style={styles.menuText}>Member</Text>
          </TouchableOpacity>
        </View>

        {/* Special Card */}
        <View style={styles.specialCard}>
          <Text style={styles.specialCardTitle}>Spesial untuk kamu</Text>
          <Text style={styles.specialCardText}>Dapatkan penawaran spesial hari ini hanya untuk kamu!</Text>
          <TouchableOpacity style={styles.adSpace}>
            <Text style={styles.adText}>Coaching Program</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

// Scan Barcode Screen
function ScanBarcodeScreen({ navigation }) {
  const [scanned, setScanned] = useState(false);

  const handleScan = () => {
    // Logic to scan the barcode would go here
    // Simulating scan success for now
    setScanned(true);
  };

  return (
    <View style={styles.scanContainer}>
      <TouchableOpacity onPress={handleScan} style={styles.scanButton}>
        <Icon name="barcode" size={50} color="#fff" />
        <Text style={styles.scanButtonText}>Scan Barcode</Text>
      </TouchableOpacity>
      {scanned && <Text style={styles.scannedText}>Barcode Scanned!</Text>}
    </View>
  );
}

export default function DashboardScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#555',
        tabBarStyle: { backgroundColor: '#fff', paddingBottom: 5, height: 60 },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="DashboardHome"
        component={DashboardHomeScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Upgrade"
        component={UpgradeMembershipScreen}
        options={{
          tabBarLabel: 'Upgrade',
          tabBarIcon: ({ color }) => <Icon name="arrow-up" size={24} color={color} />,
        }}
      />
      {/* Central "More" Menu */}
      <Tab.Screen
        name="More"
        component={ScanBarcodeScreen} // Bisa menggunakan ScanBarcodeScreen atau layar lain
        options={{
          tabBarLabel: 'More', // Bisa mengubah label jika perlu
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('../assets/menu-dots.png')} // Sesuaikan dengan path gambar yang telah diunduh
              style={{ width: 30, height: 30 }}
            />
          ),
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: '25%',
            right: '25%',
            borderRadius: 50,
            height: 70,  // Membuatnya lebih besar dari tab lainnya
            backgroundColor: '#e74c3c',
            padding: 0,  // Memastikan ikon pas di dalam lingkaran
          },
          tabBarLabelStyle: { display: 'none' }, // Menyembunyikan label untuk tombol tengah
        }}
      />
      <Tab.Screen
        name="Tutorial"
        component={TutorialScreen}
        options={{
          tabBarLabel: 'Tutorial',
          tabBarIcon: ({ color }) => <Icon name="book" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarLabel: 'Logout',
          tabBarIcon: ({ color }) => <Icon name="sign-out" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
