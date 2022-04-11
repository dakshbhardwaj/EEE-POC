import axios from 'axios';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, StatusBar, View} from 'react-native';
import SearchBarWithAutocomplete from './SearchBar';

const App = () => {
  const [search, setSearch] = useState({term: '', fetchPredictions: false});
  const {container, body} = styles;
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(true);

  const GOOGLE_PACES_API_BASE_URL =
    'https://maps.googleapis.com/maps/api/place';
  const GOOGLE_API_KEY = 'AIzaSyAA-noHKpgAcE8m5APIGqNVS28q3OLtxOM';

  const onChangeText = async () => {
    if (search.term.trim() === '') {
      return;
    }
    if (!search.fetchPredictions) {
      return;
    }
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${GOOGLE_API_KEY}&input=${search.term}`;
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl,
      });
      if (result) {
        const {data} = result;
        console.log('coming here', result);
        setPredictions(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onPredictionTapped = async (placeId, description) => {
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/details/json?key=${GOOGLE_API_KEY}&place_id=${placeId}`;
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl,
      });
      if (result) {
        const {
          data: {
            result: {
              geometry: {location},
            },
          },
        } = result;
        const {lat, lng} = location;
        setShowPredictions(false);
        setSearch({term: description});
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={container}>
        <View style={body}>
          <SearchBarWithAutocomplete
            value={search.term}
            onChangeText={text => {
              setSearch({term: text, fetchPredictions: true});
              onChangeText();
            }}
            showPredictions={showPredictions}
            predictions={predictions}
            onPredictionTapped={onPredictionTapped}
          />
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 20,
  },
});
export default App;
