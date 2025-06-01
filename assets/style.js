import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  containerform: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    color: '#fff',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: 40,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  memberName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 24,
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  menuCard: {
    width: 120,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  menuText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  specialCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 30,
    marginLeft: 25,
    marginRight: 25,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  specialCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  specialCardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  adSpace: {
    padding: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    marginTop: 10,
  },
  adText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  scanContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  scanButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 10,
  },
  scannedText: {
    marginTop: 15,
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  tabBar: {
    backgroundColor: '#9E0000',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginTop:15,
  },
  
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  
  tabIndicator: {
    backgroundColor: '#fff',
    height: 3,
    borderRadius: 2
  },  
});

export default styles;
