import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Text, View, ActivityIndicator, StyleSheet, ListRenderItem } from 'react-native';

const PAGE_SIZE = 20;

const fetchItems = async (page: number): Promise<string[]> => {
  // Simulate network request
  return new Promise(resolve => {
    setTimeout(() => {
      const newItems = Array.from(
        { length: PAGE_SIZE },
        (_, i) => `Item ${(page - 1) * PAGE_SIZE + i + 1}`,
      );
      resolve(newItems);
    }, 1000);
  });
};

// Array.from(
//   { length: PAGE_SIZE },
//   (_, i) => `ITEM ${(page-1)* PAGE_SIZE + i + 1}`
// )

export const PracticeScreenOne: React.FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);

    // dummy implementation of api
    const newItems = await fetchItems(page);
    // real life comparision.
    if (newItems.length < PAGE_SIZE) setHasMore(false);

    setItems(prev => [...prev, ...newItems]);
    setPage(prev => prev + 1);
    setIsFetching(false);
  }, [isFetching, page, hasMore]);

  useEffect(() => {
    loadMore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderItem: ListRenderItem<string> = ({ item }) => (
    <View style={styles.item}>
      <Text>{item}</Text>
    </View>
  );

  const renderFooter = () => (isFetching ? <ActivityIndicator style={styles.loader} /> : null);

  return (
    <FlatList
      data={items}
      keyExtractor={(item, index) => item + index}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  loader: {
    paddingVertical: 20,
  },
});
