import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Linking,
} from 'react-native';
import { parseYoutubeURL } from './ytapi'; // Adjust the path as necessary

const handleSharedURL = async () => {
  const initialURL = await Linking.getInitialURL();
  if (initialURL) {
    const parsedBookmark = await parseYoutubeURL(initialURL);
    setBookmark(parsedBookmark); // Save the bookmark to the state
  }
};


type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? 'white' : 'black',
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? 'light' : 'dark',
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'darker' : 'lighter',
  };

  useEffect(() => {
    handleSharedURL(); // Call the external function here
  
    const subscription = Linking.addEventListener('url', handleSharedURL);
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <View style={{ backgroundColor: isDarkMode ? 'black' : 'white' }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> hello squirrells
          </Section>
          {/* Add your custom sections here */}
          <Section title="Bookmark Details">
            {bookmark ? (
              <Text>
                Title: {bookmark.title}{'\n'}
                URL: {bookmark.url}{'\n'}
                Timestamp: {bookmark.timestamp}{'\n'}
                Thumbnail: {bookmark.thumbnail}{'\n'}
                Note: {bookmark.note}
              </Text>
            ) : (
              <Text>No bookmark</Text>
            )}
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  )};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;