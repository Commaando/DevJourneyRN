import React, { useState, useRef, useContext, createContext, ReactNode, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Animated } from 'react-native';

type Toast = {
  id: number;
  message: string;
};

type ToastContextType = {
  addToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

type ToastProviderProps = {
  children: ReactNode;
};

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idCounter = useRef(0);

  const addToast = (message: string) => {
    const id = idCounter.current++;
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => removeToast(id), 10000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <View style={styles.toastContainer}>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            message={toast.message}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

type ToastItemProps = {
  message: string;
  onDismiss: () => void;
};

const ToastItem: React.FC<ToastItemProps> = ({ message, onDismiss }) => {
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 10000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.toast}>
      <Text style={styles.toastText}>{message}</Text>
      <Animated.View style={[styles.bottomBorder, { width: widthInterpolated }]} />
      <TouchableOpacity onPress={onDismiss}>
        <Text style={styles.dismissText}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
};

const App: React.FC = () => {
  const { addToast } = useToast();

  return (
    <View style={styles.screen}>
      <Button title='Show Toast' onPress={() => addToast(`Toast #${Date.now()}`)} />
    </View>
  );
};

export const PracticeScreenFive: React.FC = () => (
  <ToastProvider>
    <App />
  </ToastProvider>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  toast: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    width: '90%',
    alignItems: 'center',
  },
  toastText: {
    color: '#fff',
    marginBottom: 4,
  },
  bottomBorder: {
    height: 2,
    backgroundColor: '#00ffff',
    marginBottom: 6,
  },
  dismissText: {
    color: '#bbb',
    fontSize: 12,
  },
});
