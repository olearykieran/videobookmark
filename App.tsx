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
import UserDefaults from 'react-native-userdefaults-ios';
import { GoogleSignin } from 'react-native-google-signin';

// Configure Auth
Auth.configure(awsconfig);

// Configure API
API.configure(awsconfig);
import { graphqlOperation } from 'aws-amplify';
import { listBookmarks } from './src/graphql/queries';
import { createBookmark } from './src/graphql/mutations'; // import the generated mutation
import { CreateBookmarkMutationVariables } from './src/API'; // import the generated type
import { deleteBookmark } from './src/graphql/mutations';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Bookmark = {
  __typename?: "Bookmark",
  id?: string,
  url: string,
  timestamp: number,
  title?: string | null,
  thumbnail?: string | null,
  note?: string | null,
  userID: string,
  createdAt?: string,
  updatedAt?: string,
  _version?: number,
  _deleted?: boolean | null,
  _lastChangedAt?: number,
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

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // Handle successful sign-in here
    } catch (error) {
      // Handle sign-in error here
    }
  };

  const getUserID = async () => {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      return userInfo?.user?.id; // userID
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // Handle successful sign-out here
    } catch (error) {
      // Handle sign-out error here
    }
  };

  const handleSharedURLFromUserDefaults = async () => {
    const suiteName = 'group.com.yourcompany.yourapp';
    const key = 'sharedURL';
  
    UserDefaults.stringForKey(key, suiteName)
      .then(async (sharedURL) => {
        if (sharedURL) {
          // Parse the shared URL
          const parsedBookmark = await parseYoutubeURL(sharedURL);
          const userID = await getUserID(); // Get userID

          if (!userID) {
            console.error('Unable to retrieve user ID');
            return;
          }
          
          const userBookmarks = bookmarks.filter(bookmark => bookmark.userID === userID);

          if (userBookmarks.length + 1 > 10) {
            alert('You have reached the maximum bookmark limit. Please delete some bookmarks to save new ones.');
            return;
          }

          // You may need to adjust the properties according to your actual structure
          const bookmark: Bookmark = {
            url: parsedBookmark.url,
            timestamp: parsedBookmark.timestamp,
            title: parsedBookmark.title || null,
            thumbnail: parsedBookmark.thumbnail || null,
            note: null,
            userID,
          };
  
          // Create the bookmark in Amplify
          const createBookmarkInput: CreateBookmarkMutationVariables = {
            input: bookmark,
          };
  
          try {
            const response = await (API.graphql(graphqlOperation(createBookmark, createBookmarkInput)) as Promise<any>);
            console.log('Bookmark created:', response);
            alert('Bookmark saved successfully!');
            setBookmarkAdded(true); // Triggering re-fetching of bookmarks
          } catch (error) {
            console.error('Error creating bookmark:', error);
            console.error('Detailed errors:', error.errors);
          }
        }
      })
      .catch(error => {
        console.error('Error reading shared URL:', error);
      });
  };
  
  // Call this function when the component mounts
  useEffect(() => {
    handleSharedURLFromUserDefaults();
  }, []);

  const handleSharedURL = async () => {
    const initialURL = await Linking.getInitialURL();
    const userID = await getUserID();
    if (!userID) {
      console.error('Unable to retrieve user ID');
      return;
  }
    if (initialURL) {
      const parsedBookmark = await parseYoutubeURL(initialURL);
  
      // You may need to adjust the properties according to your actual structure
      const bookmark: Bookmark = {
        url: parsedBookmark.url,
        timestamp: parsedBookmark.timestamp,
        title: parsedBookmark.title || null,
        thumbnail: parsedBookmark.thumbnail || null,
        note: null, // You can keep this null or use some default value if needed
        userID
      };
      
      const userBookmarks = bookmarks.filter(bookmark => bookmark.userID === userID);

      // Check if bookmark count is within the limit
      if (userBookmarks.length + 1 > 10) {
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
    const userID = await getUserID(); // Get the user's ID
    if (!userID) {
      console.error('Unable to retrieve user ID');
      return;
    }

    // Fetch bookmarks with a filter based on the user's ID
    const result = await API.graphql(graphqlOperation(listBookmarks, { filter: { userID: { eq: userID } } }));
    console.log('Result of fetchBookmarks:', result);

    if (result && 'data' in result && result.data.listBookmarks) {
      const typedData = result.data as ListBookmarksQuery;

      if (typedData.listBookmarks && typedData.listBookmarks.items) {
        const filteredBookmarks: Bookmark[] = typedData.listBookmarks.items
          .filter((item): item is NonNullable<typeof item> => item !== null && item.userID === userID) // Filter by userID
          .map(item => ({
            url: item.url,
            timestamp: item.timestamp,
            title: item.title || null,
            thumbnail: item.thumbnail || null,
            note: item.note || null,
            userID: item.userID
          }))
          .filter(bookmark => bookmark.url);
      
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
    console.error('Detailed errors:', error.errors);
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