import { StyleSheet, Text, View, ViewToken, useWindowDimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { NewsDataType } from "@/types";
import SliderItem from "./SliderItem";
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useDerivedValue, useSharedValue, scrollTo } from "react-native-reanimated";
import Pagination from "./Pagination";

type Props = {
  newsList: Array<NewsDataType>;
};

const BreakingNews = ({ newsList }: Props) => {
  const [data, setData] = useState(newsList);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const ref = useAnimatedRef<Animated.FlatList<any>>();
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const interval = useRef<NodeJS.Timeout>();
  const offset = useSharedValue(0);
  const {width} = useWindowDimensions();

  const scrollJandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      offset.value = event.contentOffset.x;
    }
  });

  useEffect(() => {
    if (isAutoPlay === true) {
      interval.current = setInterval(() => {
        offset.value = offset.value + width;
      }, 3000);
    } else {
      clearInterval(interval.current)
    }
    return () => {
      clearInterval(interval.current);
    };
  },[isAutoPlay, offset, width]);

  useDerivedValue(() => {
    scrollTo(ref, offset.value, 0, true);
  })

  const onViewCallBackPartially = React.useCallback(({ viewableItems }: any) => {
    // console.log('onViewCallBackPartially', viewableItems);
    if (
      viewableItems[0].index !== undefined && viewableItems[0].index !== null
    ) {
      setPaginationIndex(viewableItems[0].index % newsList.length);
      // console.log(viewableItems[0].index % newsList.length);
    }
  }, []);
  
  const onViewCallBack = React.useCallback(({ viewableItems }: any) => {
    // console.log('onViewCallBack', viewableItems);
  }, []);
  const viewabilityConfigCallbackPairs = React.useRef([{
    viewabilityConfig: {
      minimumViewTime: 500,
      itemVisiblePercentThreshold: 100,
    },
    onViewableItemsChanged: onViewCallBack
  },
  {
    viewabilityConfig: {
      minimumViewTime: 150,
      itemVisiblePercentThreshold: 10
    },
    onViewableItemsChanged: onViewCallBackPartially
  }
]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breaking News</Text>
      <View style={styles.slideWrapper}>
        <Animated.FlatList
          ref={ref}
          data={data}
          keyExtractor={(_, index) => `list_items${index}`}
          renderItem={({ item, index }) => (
            <SliderItem slideItem={item} index={index} scrollX={scrollX} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={scrollJandler}
          scrollEventThrottle={16}
          onEndReachedThreshold={0.5}
          onEndReached={() => setData([...data, ...newsList])}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          onScrollBeginDrag={() => {
            setIsAutoPlay(false);
          }}
          onScrollEndDrag={() => {
            setIsAutoPlay(true);
          }}
        />
        <Pagination items={newsList} scrollX={scrollX} paginationIndex={paginationIndex}/>
      </View>
    </View>
  );
};

export default BreakingNews;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
    marginLeft: 20,
  },
  slideWrapper: {
    // width: '100%',
    // flex: 1,
    justifyContent: "center",
  },
});
