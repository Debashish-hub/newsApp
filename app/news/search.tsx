import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import { NewsDataType } from "@/types";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Loading from "@/components/Loading";
import { NewsItem } from "@/components/NewsList";

type Props = {};

const Page = (props: Props) => {
  const { query, category, country } = useLocalSearchParams<{
    query: string;
    category: string;
    country: string;
  }>();
  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getNews();
  }, []);
  const getNews = async () => {
    console.log("query", query);
    console.log("category", category);
    console.log("country", country);
    try {
      let categoryString = category ? `&category=${category}` : "";
      let countryString = country ? `&country=${country}` : "";
      let queryString = query ? `&q=${query}` : "";
      const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&language=en&image=1&removeduplicate=1&size=10${categoryString}${countryString}${queryString}`;
      console.log(URL);
      const response = await axios.get(URL);
      if (response && response.data) {
        // console.log(response.data)
        setNews(response.data.results);
        setIsLoading(false);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
      console.log(error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
          title: "Search",
        }}
      />
      <View style={styles.container}>
        {isLoading ? (
          <Loading size={"large"} />
        ) : (
          <FlatList
            data={news}
            keyExtractor={(_, index) => `list_items${index}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
                <Link href={`/news/${item.article_id}`} asChild key={index}>
                <TouchableOpacity>
                  <NewsItem item={item} />
                </TouchableOpacity>
              </Link>
            )}
          />
        )}
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 20,
    },
});
