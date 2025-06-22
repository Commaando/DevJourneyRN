// import React, { useEffect, useState } from 'react';
// import { View, TextInput } from 'react-native';
// import { styles } from './screen.styles';

// const fetchquery = (q: string): Promise<string> => {
//   return new Promise((resolver, reject) => {
//     setTimeout(() => {
//       resolver(q + 'success');
//     }, 500);
//   });
// };

// export const PracticeScreenTwo: React.FC = () => {
//   const [query, setQuery] = useState('');
//   const [result, setresult] = useState('');
//   const [status, setStatus] = useState('SUCCESS'); // LOADING, ERROR
//   console.log(query);

//   useEffect(() => {
//     async function fetchData(query: string) {
//       const data: string = await fetchquery(query);
//       setresult(data); // set list in gerneral use case.
//     }

//     const id = setTimeout(() => {
//       fetchData(query);
//     }, 500);

//     return () => {
//       clearTimeout(id);
//     };
//   }, [query]);

//   return (
//     <View style={styles.container}>
//       <TextInput
//         value={query}
//         onChangeText={setQuery}
//         style={{ width: 300, height: 50, borderColor: 'red', borderWidth: 1 }}
//       />
//     </View>
//   );
// };
