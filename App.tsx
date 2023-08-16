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
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { parseYoutubeURL } from './ytapi'; // Adjust the path as necessary
import { ListBookmarksQuery } from './src/API';
import { Auth, API } from 'aws-amplify';
import awsconfig from './src/aws-exports';

// Configure Auth
Auth.configure(awsconfig);

// Configure API
API.configure(awsconfig);
import { graphqlOperation } from 'aws-amplify';
import { listBookmarks } from './src/graphql/queries';
import { createBookmark } from './src/graphql/mutations'; // import the generated mutation
import { CreateBookmarkMutationVariables } from './src/API'; // import the generated type
import { Bookmark } from './src/API';
import { deleteBookmark } from './src/graphql/mutations';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            color: isDarkMode ? '#FFFFFF' : '#333333',
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [bookmarkAdded, setBookmarkAdded] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [totalBookmarkCount, setTotalBookmarkCount] = useState(0);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
  };

  const handleSharedURL = async () => {
    const initialURL = await Linking.getInitialURL();
    if (initialURL) {
      const parsedBookmark = await parseYoutubeURL(initialURL);
  
      // You may need to adjust the properties according to your actual structure
      const bookmark: Bookmark = {
        url: parsedBookmark.url,
        timestamp: parsedBookmark.timestamp,
        title: parsedBookmark.title || null,
        thumbnail: parsedBookmark.thumbnail || null,
        note: null, // You can keep this null or use some default value if needed
      };
      
      // Check if bookmark count is within the limit
      if (bookmarks.length + 1 > 10) {
        alert('You have reached the maximum bookmark limit. Please delete some bookmarks to save new ones.');
        return;
      }

      // Create the bookmark in Amplify
      const createBookmarkInput: CreateBookmarkMutationVariables = {
        input: bookmark,
      };
  
      try {
        const response = await (API.graphql(graphqlOperation(createBookmark, createBookmarkInput)) as Promise<any>);
        console.log('Bookmark created:', response);
        console.log('Bookmark saved successfully!');
        alert('Bookmark saved successfully!');
        console.log('bookmark:', bookmark);
        setBookmarkAdded(true);
      } catch (error) {
        console.error('Error creating bookmark:', error);
        console.error('Detailed errors:', error.errors);
      }
    }
  };



  const updateBookmarkCount = () => {
    const totalBookmarkCount = bookmarks.length;
    // Update the UI to display the total count
    // For example, you can use a Text component to display the count
    setTotalBookmarkCount(totalBookmarkCount);
  };
  

  const deleteBookmarkById = async (bookmarkId: string) => {
    try {
      const deleteBookmarkInput = {
        input: {
          id: bookmarkId,
          _deleted: true, // You can remove this line if your backend handles this logic
        },
      };
  
      await API.graphql(graphqlOperation(deleteBookmark, deleteBookmarkInput));
  
      // Remove the bookmark from the local state
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
  
      // Decrement the total bookmark count
      setTotalBookmarkCount(totalBookmarkCount - 1);
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

// Fetch bookmarks
const fetchBookmarks = async () => {
  try {
    const result = await API.graphql(graphqlOperation(listBookmarks));
    console.log('Result of fetchBookmarks:', result); // Log the result

    if (result && 'data' in result && result.data.listBookmarks) {
      const typedData = result.data as ListBookmarksQuery;

      // Check if listBookmarks and its items property are defined
      if (typedData.listBookmarks && typedData.listBookmarks.items) {
        const filteredBookmarks: Bookmark[] = typedData.listBookmarks.items
          .filter((item): item is NonNullable<typeof item> => item !== null) // Filter out null items
          .map(item => ({
            url: item.url,
            timestamp: item.timestamp,
            title: item.title || null,
            thumbnail: item.thumbnail || null,
            note: item.note || null,
          }))
          .filter(bookmark => bookmark.url); // Filtering to make sure bookmark has URL
      
        // Check if there are any bookmarks
        if (filteredBookmarks.length > 0) {
          setBookmarks(filteredBookmarks);
          updateBookmarkCount();
        } else {
          console.log('No bookmarks found');
        }
      }
      
      
      
      
    }
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    console.error('Detailed errors:', error.errors); // Log the errors array
  }
};

useEffect(() => {
  if (bookmarkAdded) {
    fetchBookmarks();
    setBookmarkAdded(false); // Reset the flag
  }
}, [bookmarkAdded]);

useEffect(() => {
  fetchBookmarks(); // Fetch bookmarks on initial load
}, []);

  const openURL = (url: string) => {
    Linking.openURL(url);
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
          <Section title="Bookmarks">
          {bookmarks.map((bookmark, index) => (
            <View key={index} style={styles.bookmarkContainer}>
              {bookmark.thumbnail && (
                <Image
                  style={styles.thumbnail}
                  source={{ uri: bookmark.thumbnail as string }} // Thumbnail URL
                />
              )}
              <Text>
                Title: {bookmark.title}{'\n'}
                URL: {bookmark.url}{'\n'}
                Timestamp: {bookmark.timestamp}{'\n'}
              </Text>
              <TouchableOpacity onPress={() => openURL(bookmark.url)}>
                <Text style={styles.linkText}>Open</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => bookmark && bookmark.id ? deleteBookmarkById(bookmark.id) : null}>
                <Text style={styles.linkText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
          </Section>
          <Section title="Total Bookmarks">
            <Text>Total Bookmarks: {totalBookmarkCount}</Text>
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
  bookmarkContainer: {
    padding: 10,
    margin: 5,
    backgroundColor: 'white', // or any color you prefer
    borderRadius: 5,
    // ... any other styling you want for the container
  },
  linkText: {
    color: 'blue', // You can choose a color that fits your design
    textDecorationLine: 'underline',
  },
  thumbnail: {
    width: 50,
    height: 50,
  }
});

export default App;