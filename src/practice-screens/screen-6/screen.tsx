import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { styles, GAP, TILE_WIDTH, WINDOW_WIDTH } from './screen.styles';

const createShuffledTiles = () => {
  const base = [...Array(8).keys()].map(i => i + 1); // [1..8]
  const duplicated = [...base, ...base];
  return duplicated.sort(() => Math.random() - 0.5).map((val, idx) => ({ id: idx, value: val }));
};

const tiles = createShuffledTiles();

export const PracticeScreenSix: React.FC = () => {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const handlePress = (tileId: number) => {
    if (revealed.includes(tileId) || matched.includes(tileId) || revealed.length === 2) return;

    const newRevealed = [...revealed, tileId];
    setRevealed(newRevealed);

    if (newRevealed.length === 2) {
      const [first, second] = newRevealed.map(id => tiles[id]);
      if (first.value === second.value) {
        setMatched(prev => [...prev, first.id, second.id]);
        setRevealed([]);
      } else {
        setTimeout(() => setRevealed([]), 1000); // Hide after 1s
      }
    }
  };

  const isRevealed = (id: number) => revealed.includes(id) || matched.includes(id);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: WINDOW_WIDTH,
          height: WINDOW_WIDTH,
          backgroundColor: 'yellow',
          rowGap: GAP,
          columnGap: GAP,
        }}
      >
        {tiles.map(tile => (
          <TouchableOpacity
            key={tile.id}
            style={{
              width: TILE_WIDTH,
              height: TILE_WIDTH,
              backgroundColor: '#BBB',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => handlePress(tile.id)}
          >
            <Text style={{ fontSize: 24 }}>{isRevealed(tile.id) ? tile.value : '?'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
