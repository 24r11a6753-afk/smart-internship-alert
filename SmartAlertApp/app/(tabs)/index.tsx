import React from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: 'http://172.20.10.4:5175' }}// ⚠️ CHANGE THIS
        startInLoadingState={true}
        
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
            <Text>Loading...</Text>
          </View>
        )}

        onError={() => {
          console.log("WebView Error");
        }}

        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log("HTTP error: ", nativeEvent.statusCode);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});