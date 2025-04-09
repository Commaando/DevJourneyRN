import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';

import { fetchDummyData } from '../../services/api';

import { styles } from './home-screen.styles';

const useFetchData = () => {
  const initialCallRef = useRef(false);
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDummyData();
      initialCallRef.current = true;
      console.log(response);
      setData(response.message as string);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    handleApiCall();
  };

  useEffect(() => {
    handleApiCall();
  }, []);

  return { data, loading, error, retry };
};

export const HomeScreen: React.FC = () => {
  const { data, error, loading, retry } = useFetchData();
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size='large' color='#0000ff' />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {data && <Text style={styles.dataText}>{data}</Text>}
      <Button title='Retry' onPress={retry} />
    </View>
  );
};
