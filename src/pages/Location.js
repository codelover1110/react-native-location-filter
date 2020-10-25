import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, FlatList, Button, Text, StyleSheet, TextInput, TouchableOpacity, Image, Keyboard, Dimensions, Modal,  KeyboardAvoidingView } from "react-native";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { TouchableHighlight } from "react-native-gesture-handler";
import CheckBox from 'react-native-check-box';


const App = ({ navigation, route }) => {

  const [metaDatas, setMetaDatas] = useState([])
  const [tagID, setTagID] = useState('')
  const [tagType, setTagType] = useState('')
  const [searchContent, setSearchContent] = useState('')
  const [tempMetaData, setTempMetaData] = useState()
  const [btnColor, setBtnColor] = useState('white')
  const [mapTypes, setMapTypes] = useState('standard')
  const [nfcTAG, setNfcTAG] = useState('')
  const [energyArt, setEnergyArt] = useState('')
  const [flag, setFlag] = useState(true)

  const [modalVisible, setModalVisible] = useState(false)
  const [isSelected, setSelection] = useState(true);
  const [filterStatus, setFilterStatus] = useState(false)

  const [stateCheckBox, setStateCheckBox] = useState({
    Water: false,
    Electricity: false,
    CO2: false,
    NH3: false,
    "Compressed Air": false,
    Heat: false,
    Glycol: false,
    "Waste Water": false,
    pH: false,
    Acid: false,
  })


  const colorButton = {
    Water: require('../assets/images/metaIcon/blue.png'),
    Electricity: require('../assets/images/metaIcon/green.png'),
    CO2: require('../assets/images/metaIcon/darkgrey.png'),
    NH3: require('../assets/images/metaIcon/black.png'),
    "Compressed Air": require('../assets/images/metaIcon/orange.png'),
    Heat: require('../assets/images/metaIcon/red.png'),
    Glycol: require('../assets/images/metaIcon/white.png'),
    "Waste Water": require('../assets/images/metaIcon/brown.png'),
    pH: require('../assets/images/metaIcon/purple.png'),
    Acid: require('../assets/images/metaIcon/yellow.png'),
  };

  const metaDataType = [
    { item: 'Electricity', text: 'Electricity', value: 'Electricity' },
    { item: 'Water', text: 'Water', value: 'Water' },
    { item: 'CO2', text: 'CO2', value: 'CO2' },
    { item: 'NH3', text: 'NH3', value: 'NH3' },
    { item: 'Compressed Air', text: 'Compressed Air', value: 'Compressed Air' },
    { item: 'Heat', text: 'Heat', value: 'Heat' },
    { item: 'Glycol', text: 'Glycol', value: 'Glycol' },
    { item: 'Waste Water', text: 'Waste Water', value: 'Waste Water' },
    { item: 'pH', text: 'pH', value: 'pH' },
    { item: 'Acid', text: 'Acid', value: 'Acid' },

  ]

 

  useFocusEffect(() => {
    if(flag) {
     getMetaDatas()
     setFlag(false)
    }
     setTagType('')
  });


  getMetaDatas = () => {
    let api_url = 'https://bc0bb45f8eb1.ngrok.io/getMetaDatas/';
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        setTempMetaData(responseJson)
      })
  }



  _handleSearch = () => {
    if (searchContent == '') {
      return
    }
    setMetaDatas(tempMetaData)
    let searchData = (metaDatas => metaDatas.filter(x => (x.tag_id) && (x.tag_id).toLowerCase() == searchContent.toLowerCase() || (x.column_line) && (x.column_line).toLowerCase() == searchContent.toLowerCase()
      || (x.energy_art) && (x.energy_art).toLowerCase() == searchContent.toLowerCase() || (x.latitude) && (x.latitude).toLowerCase() == searchContent.toLowerCase() || (x.longtitude) && (x.longtitude).toLowerCase() == searchContent.toLowerCase()
      || (x.media_type) && (x.media_type).toLowerCase() == searchContent.toLowerCase() || (x.meta_data_picture) && (x.meta_data_picture).toLowerCase() == searchContent.toLowerCase() || (x.meter_level_structure) && (x.meter_level_structure).toLowerCase() == searchContent.toLowerCase()
      || (x.meter_location) && (x.meter_location).toLowerCase() == searchContent.toLowerCase() || (x.meter_point_description) && (x.meter_point_description).toLowerCase() == searchContent.toLowerCase() || (x.nfc_tag) && (x.nfc_tag).toLowerCase() == searchContent.toLowerCase()
      || (x.supply_area_child) && (x.supply_area_child).toLowerCase() == searchContent.toLowerCase() || (x.supply_area_parent) && (x.supply_area_parent).toLowerCase() == searchContent.toLowerCase()))
    setMetaDatas(searchData)
    if ((metaDatas).length > 0) {
      setRegion({
        latitude: parseFloat(metaDatas[0]["latitude"]),
        longitude: parseFloat(metaDatas[0]["longtitude"]),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    }
  }

  const { height, width } = Dimensions.get('window');
  const LATITUDE_DELTA = 0.009
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height)

  const [region, setRegion] = useState({
    // latitude: 55.586940,
    // longitude: 9.726038,
    latitude: 37.33233141,
    longitude: -122.0312186,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  _handleMarker = (metaData) => {
    setTagID(metaData["tag_id"])
    setTagType(metaData["media_type"])
    setNfcTAG(metaData["nfc_tag"])
    setEnergyArt(metaData["energy_art"])

  }

  _handleSearchContent = (searchContent) => {
    setSearchContent(searchContent)
    setMetaDatas(tempMetaData)

    if (searchContent == '') {
      setMetaDatas(tempMetaData)
      return
    }
    _handleRealtimeSearch(searchContent)
  }

  _handleRealtimeSearch = (searchContent) => {
    let tmd = tempMetaData
    let filteredValue = tmd.filter(x => (x.tag_id) && (x.tag_id).includes(searchContent) || (x.column_line) && ((x.column_line).toLowerCase()).includes(searchContent.toLowerCase())
      || (x.energy_art) && ((x.energy_art).toLowerCase()).includes(searchContent.toLowerCase()) || (x.latitude) && ((x.latitude).toLowerCase()).includes(searchContent.toLowerCase()) || (x.longtitude) && ((x.longtitude).toLowerCase()).includes(searchContent.toLowerCase())
      || (x.media_type) && ((x.media_type).toLowerCase()).includes(searchContent.toLowerCase()) || (x.meta_data_picture) && ((x.meta_data_picture).toLowerCase()).includes(searchContent.toLowerCase()) || (x.meter_level_structure) && ((x.meter_level_structure).toLowerCase()).includes(searchContent.toLowerCase())
      || (x.meter_location) && ((x.meter_location).toLowerCase()).includes(searchContent.toLowerCase()) || (x.meter_point_description) && ((x.meter_point_description).toLowerCase()).includes(searchContent.toLowerCase()) || (x.nfc_tag) && ((x.nfc_tag).toLowerCase()).includes(searchContent.toLowerCase())
      || (x.supply_area_child) && ((x.supply_area_child).toLowerCase()).includes(searchContent.toLowerCase()) || (x.supply_area_parent) && ((x.supply_area_parent).toLowerCase()).includes(searchContent.toLowerCase()))
    setMetaDatas(filteredValue)
  }


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image style={styles.logoutButton}
              source={require('../assets/images/logo.png')} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}
              source={require('../assets/images/logo.png')}>Back</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  _goConsumption = () => {
    if (tagID == '') {
      alert("Select Tag!")
      return
    }
    navigation.navigate('Consumption', { nfc_id: nfcTAG, nfc_tag: tagID })
  }
  _goMeataData = () => {
    if (tagID == '') {
      alert("Select Tag!")
      return
    }
    navigation.navigate('Metadata', { nfc_id: tagID })
  }
  _goTags = () => {
    navigation.navigate('Tags')
  }
  _handleMapType = () => {
    if (mapTypes == 'standard') {
      setMapTypes('satellite')
    } else {
      setMapTypes('standard')
    }
  }
  _handleFilter = () => {
    var resultCheckBoxItems = []
    setFilterStatus(false)
    for (const checkBoxItem in stateCheckBox) {
      let tmd = tempMetaData
      let filteredValue = tmd.filter(x => (stateCheckBox[checkBoxItem]) && (x.energy_art).includes(checkBoxItem))
      resultCheckBoxItems = resultCheckBoxItems.concat(filteredValue)
      if (stateCheckBox[checkBoxItem]) {
        setFilterStatus(true)
      }
    }
    setMetaDatas(resultCheckBoxItems)
    setModalVisible(false)
  }

  renderItem = ({ item }) => (
    <View style={styles.itemModal} >
      <View style={styles.marginLeft}>
        <TouchableHighlight onPress={() => setStateCheckBox({ ...stateCheckBox, [item.value]: !stateCheckBox[item.value] })}>
         <View style={styles.itemTitleModal} >
          <CheckBox
              onClick={(event) => {
                setStateCheckBox({ ...stateCheckBox, [item.value]: !stateCheckBox[item.value] })
              }}
              isChecked={stateCheckBox[item.value]}
          />
        </View>
        </TouchableHighlight>
      </View>
      <View style={styles.itemContentModal}>
        <Text style={styles.text}>&middot; {item.value} </Text>
      </View>
    </View>
  )

  mapStyle = [{ "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] }, { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }];

  return (
    <View style={styles.container}>
      <View style={styles.item} >
        <View style={styles.searchContent}>
          <TextInput
            onChangeText={(text) => { _handleSearchContent(text) }}
            editable={true}
            multiline={false}
            maxLength={200}
            placeholder="search..."
            autoCapitalize="none"
          />
        </View>
        <View>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              {filterStatus ? 
                <Image style={styles.selectActiveTag} source={require('../assets/images/inactive.png')} /> :
                <Image style={styles.selectActiveTag} source={require('../assets/images/active.png')} />
              }
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _handleSearch()}>
              <Image style={styles.searchButton}
                source={require('../assets/images/search.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
       <Modal animationType="fade" visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : height} style={styles.container}>
          <View style={styles.modalView}>
           <View style={styles.contentContainer}>
              <FlatList
                data={metaDataType}
                keyExtractor={(item) => item.item}
                renderItem={renderItem}
              />
            </View>
            <View style={styles.modelButtonContainer}>
              <TouchableHighlight 
                style={styles.modalButton} onPress={() => _handleFilter()}>
                <Button style={styles.modalText} title="SAVE" />
              </TouchableHighlight>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <MapView
        style={styles.map}
        initialRegion={region}
        customMapStyle={mapStyle}
        mapType={mapTypes}
        // provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        onRegionChange={region => setRegion({ region })}
        onRegionChangeComplete={region => setRegion({ region })}
        zoomEnabled={true}
      >
        {metaDatas.length > 0 && metaDatas.map((metaData) => {
          if (metaData["latitude"] && metaData["longtitude"]) {
            return <Marker
            draggable
            coordinate={{
              latitude: parseFloat(metaData["latitude"]),
              longitude: parseFloat(metaData["longtitude"]),
            }}
            onDragEnd={(e) => _handleMarker(e, metaData)}
            // title={'TagID: ' + metaData["tag_id"]}
            image={colorButton[(metaData["energy_art"])]}
            onPress={() => _handleMarker(metaData)}
            onCalloutPress={() => _handleMarker(metaData)}
            key={metaData["id"]}
          >
            <MapView.Callout>
              <TouchableHighlight onPress={() => _handleMarker(metaData)}>
                <Text>TagID: {metaData["tag_id"]}</Text>
              </TouchableHighlight>
            </MapView.Callout>
          </Marker>}
          })
        }
          

      </MapView>
      <View style={styles.itemTag} >
        <View style={styles.marginLeft}>
          <View style={styles.itemTagTitle}>
            <Text>TagID       :</Text>
          </View>
        </View>

        <View style={styles.itemContent}>
          <TextInput
            editable={false}
            multiline={false}
            maxLength={200}
            value={tagID}
          />
        </View>
      </View>
      <View style={styles.itemTagType} >
        <View style={styles.marginLeft}>
          <View style={styles.itemTagTitle}>
            <Text>EnergyArt:</Text>
          </View>
        </View>

        <View style={styles.itemContent}>
          <TextInput
            editable={false}
            multiline={false}
            maxLength={200}
            value={energyArt}
          />
        </View>
      </View>
      <View style={styles.buttonGroup} >
        <View style={styles.buttonGroupContainer}>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _goMeataData()}>
              <Image style={styles.buttonService}
                source={require('../assets/images/service.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonGroupContainer}>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _goTags()}>
              <Image style={styles.buttonSerial}
                source={require('../assets/images/list.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonGroupContainer}>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _goConsumption()}>
              <Image style={styles.buttonSerial}
                source={require('../assets/images/consumption.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonGroupContainer}>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _handleMapType()}>
              <Image style={styles.buttonSerial}
                source={require('../assets/images/location.png')} />
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#548235'
  },
  map: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    bottom: '40%',
    borderRadius: 20
  },
  logoutButton: {
    marginRight: 20,
    padding: 5,
    marginBottom: 0,
    width: 40,
    height: 40
  },
  backButton: {
    marginLeft: 20,
    padding: 10,
    marginBottom: 0,
    borderColor: '#ccc',
    borderWidth: 2,
    color: '#ffffff',
    borderRadius: 10,
    justifyContent: "center",
  },
  item: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
    justifyContent: "center",
    top: 10,
    width: '117%'
  },
  itemTag: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
    bottom: '30%',
    justifyContent: "center",
    width: '105%',
    borderRadius: 20
  },
  itemTagType: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
    bottom: '23%',
    justifyContent: "center",
    width: '105%'
  },
  buttonGroup: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
    bottom: '5%',
    justifyContent: "center",
    width: '60%'
  },
  marginLeft: {
    marginLeft: 5,
  },
  text: {
    fontSize: 15,

  },

  itemContent: {
    width: '80%',
    height: 35,
    backgroundColor: '#ffffff',
    justifyContent: "center",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },

  searchContent: {
    width: '70%',
    height: 35,
    backgroundColor: '#ffffff',
    justifyContent: "center",
    paddingLeft: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  searchButton: {
    width: 35,
    height: 35,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  selectActiveTag: {
    width: 35,
    height: 35,
  },
  buttonSerial: {
    width: 65,
    height: 65,
  },
  buttonService: {
    width: 50,
    height: 50,
  },
  itemTagTitle: {
    borderWidth: 1,
    width: 80,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  buttonGroupContainer: {
    marginLeft: 5,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 15,
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    alignItems: "center",
    justifyContent: "center"
  },

  modalButton: {
    width: 130,
    borderWidth: 2,
    marginTop: 20,
    borderRadius: 20,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    margin: 20
  },
   modelButtonContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  contentContainer: {
    height: '75%'
  },
  itemModal: {
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
  },
  itemTitleModal: {
    borderWidth: 2,
    padding: 10,
    width: 150,
    height: 50,
    borderColor: '#ffffff',
    borderRadius: 10,
    backgroundColor: '#5b9bd5',
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitleText: {
    fontSize: 15,
    color: '#ffffff',
  },
  itemContentModal: {
    width: '55%',
    height: 35,
    backgroundColor: '#c4d3db',
    justifyContent: "center",
    paddingLeft: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },

});

export default App;