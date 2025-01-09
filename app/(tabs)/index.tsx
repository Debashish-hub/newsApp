import { StyleSheet, Text, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import axios from 'axios'
import { NewsDataType } from '@/types'
import BreakingNews from '@/components/BreakingNews'
import Categories from '@/components/Categories'
import NewsList from '@/components/NewsList'
import Loading from '@/components/Loading'

type Props = {}

const Page = (props: Props) => {
  const {top: safeTop} = useSafeAreaInsets();
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>([]);
  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBreakingNews()
    getNews()
  }, []);

  const getBreakingNews = async () => {
    try {
      const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&language=en&image=1&removeduplicate=1&size=5`
      const response = await axios.get(URL)
      if (response && response.data) {
        // console.log(response.data)
        setBreakingNews(response.data.results)
        setIsLoading(false)
      }
    } catch (error: any) {
      Alert.alert('Error', error.message)
      console.log(error)
    }
  }
  const getNews = async (category: String = '') => {
    try {
      let categoryString = category ? `&category=${category}` : ''
      const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&language=en&image=1&removeduplicate=1&size=10${categoryString}`
      const response = await axios.get(URL)
      if (response && response.data) {
        // console.log(response.data)
        setNews(response.data.results)
        setIsLoading(false)
      }
    } catch (error: any) {
      Alert.alert('Error', error.message)
      console.log(error)
    }
  }
  const categoryChanged = (category: string) => {
    console.log(category)
    setNews([])
    getNews(category)
  }
  return (
    <ScrollView style={[styles.container, {paddingTop: safeTop}]}>
      <Header />
      <SearchBar withHorizontalPadding={true}/>
      {isLoading ? (
        <Loading size={'large'} />
      ) : (
      <BreakingNews newsList={breakingNews}/>
      )}
      <Categories onCategoryChanged={categoryChanged}/>
      <NewsList newsList={news}/>
    </ScrollView>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1 ,
  },
})