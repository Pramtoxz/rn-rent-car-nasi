import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { showAlert } from '../utils/alert';

const DevBackend = [
  {
    id: 1,
    name: 'Attaya Botak',
    nim: '2210099',
    roles: ['Backend Developer', 'Deployment', 'API' ,'Auth', 'WhatsApp Gateway'],
    image: require('../assets/images/dev/avatar-5.jpg'),
    instagram: '___sukabapak',
  },
];

const DevFrontend = [
  {
    id: 2,
    name: 'Sri Mulyarni',
    nim: '2210009',
    roles: ['FrontEnd Developer', 'UI/UX Design', 'Prototype', 'Experiece', 'Testing'],
    image: require('../assets/images/dev/avatar-2.jpg'),
    instagram: 'liaayaa_a', 
  },
];

const AboutScreen = ({ navigation }: any) => {

  const handleContact = async (instagram: string) => {
    const instagramUrl = `https://www.instagram.com/${instagram}`;
    
    try {
      await Linking.openURL(instagramUrl);
    } catch (error) {
      showAlert.error('Terjadi kesalahan saat membuka profil');
      console.error('Error opening Instagram:', error);
    }
  };

  const renderRoleBadge = (role: string, index: number) => (
    <View key={index} style={styles.roleBadge}>
      <Text style={styles.roleText}>{role}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tentang Kami</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.introSection}>
          <View style={styles.logoContainer}>
            <Image
            source={require('../assets/images/dev/unjay.png')} style={styles.LogoUnjay}></Image>
          </View>
          <Text style={styles.appTitle}>Tim Development</Text>
          <Text style={styles.appDesc}>
            Aplikasi ini dibangun untuk melengkapi Tugas Akhir Mata Kuliah Mobile 2 dengan Dosen pengampu</Text>
          <Text style={styles.textDosen}>Novinaldi, S.Kom., M.Kom</Text>
        </View>

        <Text style={styles.sectionLabel}>Reinkarnasi Alan Turing</Text>
        
        {DevBackend.map((member) => (
          <View key={member.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image 
                source={member.image} 
                style={styles.avatar} 
                resizeMode="cover"
              />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.nim}>NIM: {member.nim}</Text>
                <View style={styles.rolesContainer}>
                  {member.roles.map((role, index) => renderRoleBadge(role, index))}
                </View>
              </View>
            </View>

            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => handleContact(member.instagram)}
            >
              <View style={styles.contactContent}>
                <Icon name="instagram" size={16} color={colors.primary} style={styles.contactIcon} />
                <Text style={styles.contactText}>Lihat Profil Instagram</Text>
              </View>
              <Icon name="external-link" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ))}
        
        <Text style={styles.sectionLabel}>Reinkarnasi April Greiman</Text>
        
        {DevFrontend.map((member) => (
          <View key={member.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image 
                source={member.image} 
                style={styles.avatar} 
                resizeMode="cover"
              />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.nim}>NIM: {member.nim}</Text>
                <View style={styles.rolesContainer}>
                  {member.roles.map((role, index) => renderRoleBadge(role, index))}
                </View>
              </View>
            </View>

            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => handleContact(member.instagram)}
            >
              <View style={styles.contactContent}>
                <Icon name="instagram" size={16} color={colors.primary} style={styles.contactIcon} />
                <Text style={styles.contactText}>Lihat Profil Instagram</Text>
              </View>
              <Icon name="external-link" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerCopyright}>© 2025 Rent Car Nasi</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.white,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  introSection: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 10,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  appTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.white,
    marginBottom: 8,
  },
  appDesc: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 22,
  },
  textDosen: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionLabel: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    marginLeft: 20,
    marginBottom: 16,
    marginTop: 10,
  },
  card: {
    backgroundColor: colors.cardBackground,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  LogoUnjay:{
    width: 90,
    height: 100,
    borderRadius: 15,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    resizeMode: 'stretch'
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.white,
    marginBottom: 4,
  },
  nim: {
    fontFamily: fonts.book,
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 8,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleText: {
    fontFamily: fonts.book,
    fontSize: 10,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 12,
  },
  contactButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    marginRight: 8,
  },
  contactText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontFamily: fonts.book,
    fontSize: 12,
    color: colors.secondary,
  },
  footerCopyright: {
    fontFamily: fonts.book,
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 4,
  },
});

export default AboutScreen;