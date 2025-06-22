import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet, ListRenderItem } from 'react-native';
import Animated, { FadeIn, FadeOut, SequencedTransition } from 'react-native-reanimated';

const DATA = [
  { id: '1', title: 'Apple' },
  { id: '2', title: 'Banana' },
  { id: '3', title: 'Cherry' },
];

export const PracticeScreenThree: React.FC = () => {
  const [items, setItems] = useState(DATA);

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const renderItem: ListRenderItem<(typeof DATA)[0]> = ({ item }) => (
    <Animated.View
      // layout={Layout.springify()} // 👈 layout animation
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.item}
    >
      <Text style={styles.text}>{item.title}</Text>
      <Pressable onPress={() => removeItem(item.id)}>
        <Text style={styles.remove}>Remove</Text>
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={{ bottom: 0, position: 'absolute' }}>
      <Animated.FlatList
        inverted
        data={[...items].reverse()}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
        renderItem={renderItem}
        itemLayoutAnimation={SequencedTransition}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  item: {
    backgroundColor: '#eee',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: { fontSize: 18 },
  remove: { color: 'red', fontWeight: 'bold' },
});
