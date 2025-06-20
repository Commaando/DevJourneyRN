import { StyleSheet } from 'react-native';

import { palette } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.red,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
