import { Dimensions, StyleSheet } from 'react-native';

export const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

export const GAP = 4;
export const TILE_WIDTH = WINDOW_WIDTH / 4 - GAP;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'grey',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  dataText: {
    fontSize: 16,
    marginBottom: 16,
  },
});
