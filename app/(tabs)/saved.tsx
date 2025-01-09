import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  Link,
  Stack,
  router,
  useFocusEffect,
  useNavigation,
} from "expo-router";
import Loading from "@/components/Loading";
import { NewsItem } from "@/components/NewsList";
import { Colors } from "@/constants/Colors";

type Props = {};

const Page = (props: Props) => {
  const [bookmarkNews, setBookmarkNews] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchBookmarkNews();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      fetchBookmarkNews();
    }, [])
  );

  const fetchBookmarkNews = async () => {
    await AsyncStorage.getItem("bookmark").then(async (token) => {
      const res = JSON.parse(token);
      if (res !== null && res.length > 0) {
        console.log(res);
        let query_string = res.join(",");

        const response = await axios.get(
          `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&id=${query_string}`
        );
        const news = response.data.results;
        setBookmarkNews(news);
        setIsLoading(false);
      } else {
        setBookmarkNews([]);
        setIsLoading(false);
      }
    });
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
        }}
      />
      <View style={styles.container}>
        {isLoading ? (
          <Loading size={"large"} />
        ) : (
          <>
            {bookmarkNews.length === 0 ? (
              <View style={styles.noFavourites}>
                <Text style={styles.noFavouritesText}>
                  No favourites added yet!
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    navigation.navigate("discover");
                  }}
                >
                  <Text style={styles.addButtonText}>Discover More</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={bookmarkNews}
                keyExtractor={(_, index) => `list_items${index}`}
                showsVerticalScrollIndicator={false}
                renderItem={({ index, item }) => (
                  <Link href={`/news/${item.article_id}`} asChild key={index}>
                    <TouchableOpacity>
                      <NewsItem item={item} />
                    </TouchableOpacity>
                  </Link>
                )}
              />
            )}
          </>
        )}
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  noFavourites: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noFavouritesText: {
    fontSize: 18,
    color: Colors.black,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: Colors.tint,
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
