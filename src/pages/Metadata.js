import React, { Component, useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Button,
  FlatList,
  Modal,
  TouchableHighlight,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import AsyncStorage from "@react-native-community/async-storage";
import Geolocation from '@react-native-community/geolocation';
import SelectInput from 'react-native-select-input-ios';
import {
 heightPercentageToDP as hp,
 widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

export default function Metadata({ route, navigation }) {


  const [metaData, setMetaData] = useState()
  const [modalVisible, setModalVisible] = useState(false)
  const [inputText, setInputText] = useState('')
  const [editedItem, setEditedItem] = useState(0)
  const [itemTitle, setItemTitle] = useState()
  const [rowID, setRowID] = useState()
  const [nfcTagID, setNfcTagID] = useState()
  const [nfcTAG, setNfcTAG] = useState()

  const [currentLatitude, setCurrentLatitude] = useState('')
  const [currentLogitude, setCurrentLongitude] = useState('')
  const { nfc_id } = route.params;


  useEffect(() => {
    setNfcTagID(nfc_id)
    getMetaData(nfc_id)
    getCurrentLocation()
    // getChangsLocation()
  }, [nfc_id]);

   const options = [
    { value: "Electricity", label: "Electricity" },
    { value: "Water", label: "Water" },
    { value: "CO2", label: "CO2" },
    { value: "NH3", label: "NH3" },
    { value: "Compressed Air", label: "Compressed Air" },
    { value: "Heat", label: "Heat" },
    { value: "Glycol", label: "Glycol" },
    { value: "Waste Water", label: "Waste Water" },
    { value: "pH", label: "pH" },
    { value: "Acid", label: "Acid" }
  ]

  getMetaData = (tag_id) => {
    let api_url = 'https://inventoryapi.scnordic.com/editMetaData/' + tag_id;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        setRowID(responseJson.id)
        let metaData = [
          { item: 'tag_id', text: 'TagID', value: responseJson.tag_id },
          { item: 'nfc_tag', text: 'NFCTag', value: responseJson.nfc_tag },
          { item: 'media_type', text: 'MediaType', value: responseJson.media_type },
          { item: 'energy_media_type', text: 'EnergyMediaType', value: responseJson.energy_media_type },
          { item: 'meter_point_description', text: 'MeterPointDescription', value: responseJson.meter_point_description },
          { item: 'energy_unit', text: 'EnergyUnit', value: responseJson.energy_unit },
          { item: 'group', text: 'Group', value: responseJson.group },
          { item: 'column_line', text: 'CommonLine(Production)', value: responseJson.column_line },
          { item: 'meter_location', text: 'MeterLocation', value: responseJson.meter_location },
          { item: 'energy_art', text: 'EnergyArt', value: responseJson.energy_art },
          { item: 'supply_area_child', text: 'SupplyArea(Child)', value: responseJson.supply_area_child },
          { item: 'meter_level_structure', text: 'MeterLevelStructure', value: responseJson.meter_level_structure },
          { item: 'supply_area_parent', text: 'SupplyAreaParent', value: responseJson.supply_area_parent },
          { item: 'longtitude', text: 'Longtitude', value: responseJson.longtitude },
          { item: 'latitude', text: 'Latitude', value: responseJson.latitude },
          { item: 'serialNumber', text: 'SerialNumber', value: responseJson.serialNumber },
          { item: 'fabricate', text: 'Fabricate', value: responseJson.fabricate },
          { item: 'model', text: 'Model', value: responseJson.model },
          { item: 'impUnit', text: 'ImpUnit', value: responseJson.impUnit },
          { item: 'screenCharacters', text: 'ScreenCharacters', value: responseJson.screenCharacters },
          { item: 'fabricationDate', text: 'FabricationDate', value: responseJson.fabricationDate },
        ]
        setMetaData(metaData)
        setNfcTAG(responseJson.tag_id)
      })
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

  _handleLogout = () => {
    AsyncStorage.removeItem('check_status')
    navigation.navigate('BACK')
  }

  _handleEditItem = (editedItem) => {
    let newData = metaData.map(item => {
      if (item.item == editedItem) {
        item.value = inputText
        return item
      }
      return item
    })
    setMetaData(newData)
    let alertData = editedItem
    Alert.alert(
      'Are you sure to update?',
      alertData,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => _upDateMetadata(newData) },
      ],
      { cancelable: false },
    );
  }

  getChangsLocation = () => {

    Geolocation.watchPosition(
      //Will give you the current location
      (position) => {
        let longitude = JSON.stringify(position.coords.longitude);
        let latitude = JSON.stringify(position.coords.latitude);
        setCurrentLatitude(latitude)
        setCurrentLongitude(longitude)
      },
      (error) => alert(error.message),
      {
       enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
      }
    )
  }

  getCurrentLocation = () => {

    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        let longitude = JSON.stringify(position.coords.longitude);
        let latitude = JSON.stringify(position.coords.latitude);
        setCurrentLatitude(latitude)
        setCurrentLongitude(longitude)
        AsyncStorage.setItem('currentLongitude', longitude);
        AsyncStorage.setItem('currentLatitude', latitude);

      },
      (error) => alert(error.message),
      {
       enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
      }
    )
  }

  _getLocation = () => {
    let alertData = "Get Current Location"
    Alert.alert(
      'Are you sure?',
      alertData,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => _upDateLocation() },
      ],
      { cancelable: false },
    );
  }

  _upDateMetadata = (newData) => {
    let formData = new FormData();
    formData.append("id", rowID)
    formData.append("tagID", newData[0].value)
    formData.append("nfcTag", newData[1].value)
    formData.append("mediaType", newData[2].value)
    formData.append("energyMediaType", newData[3].value)
    formData.append("meterPointDescription", newData[4].value)
    formData.append("energyUnit", newData[5].value)
    formData.append("group", newData[6].value)
    formData.append("columnLine", newData[7].value)
    formData.append("meterLocation", newData[8].value)
    formData.append("energyArt", newData[9].value)
    formData.append("supplyAreaChild", newData[10].value)
    formData.append("meterLevelStructure", newData[11].value)
    formData.append("supplyAreaParent", newData[12].value)
    formData.append("longtitude", newData[13].value)
    formData.append("latitude", newData[14].value)
    formData.append("serialNumber", newData[15].value)
    formData.append("fabricate", newData[16].value)
    formData.append("model", newData[17].value)
    formData.append("impUnit", newData[18].value)
    formData.append("screenCharacters", newData[19].value)
    formData.append("fabricationDate", newData[20].value)


    fetch('https://inventoryapi.scnordic.com/updateMetaDataMobile/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })
      .then((response) => response.json())
      .then(response => {
        if (response.success == "true") {
          setModalVisible(false)
        } else {
          alert("update error")
        }
      }).catch(err => {
        console.log(err)
      })
  }

  _upDateLocation = () => {
    let formData = new FormData();
    formData.append("id", rowID)
    formData.append("tagID", metaData[0].value)
    formData.append("nfcTag", metaData[1].value)
    formData.append("mediaType", metaData[2].value)
    formData.append("energyMediaType", metaData[3].value)
    formData.append("meterPointDescription", metaData[4].value)
    formData.append("energyUnit", metaData[5].value)
    formData.append("group", metaData[6].value)
    formData.append("columnLine", metaData[7].value)
    formData.append("meterLocation", metaData[8].value)
    formData.append("energyArt", metaData[9].value)
    formData.append("supplyAreaChild", metaData[10].value)
    formData.append("meterLevelStructure", metaData[11].value)
    formData.append("supplyAreaParent", metaData[12].value)
    formData.append("longtitude", currentLogitude)
    formData.append("latitude", currentLatitude)
    formData.append("serialNumber", metaData[15].value)
    formData.append("fabricate", metaData[16].value)
    formData.append("model", metaData[17].value)
    formData.append("impUnit", metaData[18].value)
    formData.append("screenCharacters", metaData[19].value)
    formData.append("fabricationDate", metaData[20].value)


    fetch('https://inventoryapi.scnordic.com/updateMetaDataMobile/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })
      .then((response) => response.json())
      .then(response => {
        if (response.success == "true") {
          metaData[12].value = currentLatitude
          metaData[13].value = currentLongitude
        } else {
          alert("update error")
        }
      }).catch(err => {
        console.log(err)
      })
  }

  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => { setModalVisible(true); setInputText(item.value), setEditedItem(item.item), setItemTitle(item.text) }}
      underlayColor={'#f1f1f1'}>
      <View style={styles.item} >
        <View style={styles.marginLeft}>
          <View style={styles.itemTitle}>
            <Text style={styles.itemTitleText}>{item.text}</Text>
          </View>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.text}>&middot; {item.value} </Text>
        </View>
      </View>
    </TouchableHighlight>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}> TagID:  </Text>
          <Text style={styles.headerTextXY}>{nfcTAG}</Text>
        </View>
        <Image style={{ width: 40, height: 40, marginLeft: wp('5%'), marginBottom: wp('7%') }}
          source={require('../assets/images/metabrand.png')} />
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          data={metaData}
          keyExtractor={(item) => item.item}
          renderItem={renderItem}
        />
      </View>
      <Modal animationType="fade" visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : height} style={styles.container}>
          <View style={styles.modalView}>
            <View style={styles.logoContainer}>
              <Image style={{ width: 170, height: 170 }}
                source={require('../assets/images/logo.png')} />
            </View>
            <Text style={styles.modalText}></Text>
            <View style={styles.item} >
              <View style={styles.marginLeft}>
                <View style={styles.itemTitle}>
                  <Text style={styles.itemTitleText}>{itemTitle}</Text>
                </View>
              </View>{
                itemTitle == "EnergyArt" ? 
                 <View style={styles.itemContent}>
                  <SelectInput
                    value={inputText}
                    options={options}
                    onSubmitEditing={(value) => setInputText(value)}
                    style={styles.selectInput}
                  />
                </View> :
                <View style={styles.itemContent}>
                  <TextInput
                    onChangeText={(text) => { setInputText(text); }}
                    defaultValue={inputText}
                    editable={true}
                    multiline={false}
                    maxLength={200}
                  />
                </View>
              }
           
            </View>
            <View style={styles.modelButtonContainer}>
              <TouchableHighlight 
                style={styles.modalButton}>
                <Button style={styles.modalText} title="SAVE" onPress={() => { _handleEditItem(editedItem); }} />
              </TouchableHighlight>
              <TouchableHighlight 
                style={styles.modalButton}>
                <Button style={styles.modalText} title="CANCEL" onPress={() => { setModalVisible(false) }} />
              </TouchableHighlight>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View style={styles.bottomContaner}>
        {/* <TouchableOpacity onPress={() => navigation.navigate('Nfctag')}>
          <Image style={{ width: 40, height: 40, marginLeft: '25%' }}
            source={require('../assets/images/next.png')} />
        </TouchableOpacity> */}
        <View style={styles.bottomRightContainer}>
          <TouchableOpacity onPress={() => _getLocation()}>
            <Image style={styles.getLocation}
              source={require('../assets/images/getLocation.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Consumption', { nfc_id: nfcTAG, nfc_tag: nfcTagID })}>
            <Image style={styles.getLocation}
              source={require('../assets/images/plus.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Location', { currentLatitude: currentLatitude })}>
            <Image style={styles.getLocation}
              source={require('../assets/images/location.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

}


const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#548235',
    borderRadius: 15,
    flexDirection: "row"

  },
  headerTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
    marginLeft: "20%"

  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerTextXY: {
    fontSize: 38,
    color: '#000000',
  },
  container: {
    backgroundColor: '#548235',
    padding: 5,
    height: '100%'
  },
  contentContainer: {
    height: '75%'
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: 5,
  },
  menu: {
    width: 20,
    height: 2,
    backgroundColor: '#111',
    margin: 2,
    borderRadius: 3,
  },
  text: {
    fontSize: 15,

  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemContent: {
    width: '55%',
    height: 35,
    backgroundColor: '#c4d3db',
    justifyContent: "center",
    paddingLeft: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  itemTitleText: {
    fontSize: 15,
    color: '#ffffff',
  },

  textInput: {
    width: '90%',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 30,
    borderColor: 'gray',
    borderBottomWidth: 2,
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    backgroundColor: '#548235',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableHighlight: {
    backgroundColor: 'white',
    marginVertical: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
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
  itemTitle: {
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
  logoContainer: {
    marginBottom: '10%',
    justifyContent: 'flex-end',
    alignItems: "center",
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
  },
  bottomContaner: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: 5

  },
  getLocation: {
    width: 40,
    height: 40,
    marginLeft: '10%',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
    backgroundColor: '#ffffff'
  },
  bottomRightContainer: {
    flexDirection: "row"
  },
  selectInput: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
})

