import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Notification {
  id: string;
  sender: string;
  message: string;
}
function SMSNotifications(): JSX.Element {
  const [smsNotifications, setSMSNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function fetchSMSNotifications(): Promise<void> {
      // Substituir "API_KEY" pelo seu próprio chave de API fornecida pelo provedor de SMS
      const apiKey: string = "API_KEY";
      // Substituir "PHONE_NUMBER" pelo número de telefone associado à sua conta no provedor de SMS
      const phoneNumber: string = "PHONE_NUMBER";
      const response = await fetch(
        `https://api.smsprovider.com/notifications?api_key=${apiKey}&phone_number=${phoneNumber}`
      );
      const data = await response.json();
      setSMSNotifications(data.notifications);
    }

    fetchSMSNotifications();
  }, []);

  return (
    <View style={styles.container}>
      {smsNotifications.map((notification) => (
        <View key={notification.id} style={styles.notification}>
          <Text style={styles.sender}>{notification.sender}</Text>
          <Text style={styles.message}>{notification.message}</Text>
        </View>
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  notification: {
    backgroundColor: '#fafafa',
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
  },
  sender: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    marginTop: 10,
  },
});

export default SMSNotifications;
