import React, { useState } from 'react'
import { View, Image, Button, Text, TextInput, PermissionsAndroid } from 'react-native'
// import * as ImagePicker from 'react-native-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';

const createFormData = (photo, body) => {
  const data = new FormData();

  data.append("file", {
    name: photo.fileName,
    type: photo.type,
    uri:
      Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};


const CheckFilePermissions = async (platform) => {
  if(platform === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      if (granted['android.permission.READ_EXTERNAL_STORAGE'] && granted['android.permission.WRITE_EXTERNAL_STORAGE']) {
        // user granted permissions
        return true;
      } else {
        // user didn't grant permission... handle with toastr, popup, something...
        return false;
      }
    } catch (err) {
      // unexpected error
      return false;
    }
  } else {
    // platform is iOS
    return true;
  }
};


export default class App extends React.Component {
// const [message, onChangeMessage] = React.useState(null);
// const [secret, onChangeSecret] = React.useState(null);
  state = {
    photo: null,
    message: null,
    secret: null,
    currentDate: null
  }

  handleChoosePhoto = () => {
    const options = {
      includeBase64: true,
      saveToPhotos: true
    }
    launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response })
      }
    })
  }
  
  handleDecrypt  = async () => {
    console.log("Uploading to server.....");
    await fetch("http://192.168.0.123:5000/decryptsuccess", {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: createFormData(this.state.photo, { secret: this.state.secret})
    })
      .then(response => response.json())
      .then(response => {
        console.log ("upload succes", response);
        alert(response);
        // this.setState({ photo: null });
      })
      .catch(error => {
        console.log("upload error", error);
        alert("Upload failed!");
      });
  };

  handleEncrypt = async () => {
    console.log("Uploading to server.....");
    await fetch("http://192.168.0.123:5000/success", {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data',
      },

      body: createFormData(this.state.photo, { secret: this.state.secret, message: this.state.message })
    })
      .then(response => response.json())
      .then(response => {
        console.log("Upload succes.");
        alert("Upload success!");
        // this.setState({ photo: null });
      })
      .catch(error => {
        console.log("upload error", error);
        alert("Upload failed!");
      });

    console.log("Downloading...");

    // if (Platform.OS === 'android') {
    //   const granted = await this.getPermissionAndroid();
    //   if (!granted) {
    //     return;
    //   }
    // }
    if(await CheckFilePermissions(Platform.OS)) {
      console.log("permission granted", Platform.OS);
      var date = moment().utcOffset('+05:30');
      console.log(date);
      console.log(typeof(date));
      this.setState({ currentDate: date });
      console.log("Time", this.state.currentDate);
    await RNFetchBlob.config({
      fileCache: false,
      appendExt: 'png',
      // path: Platform.OS === 'ios' ? this.state.photo.uri.replace('file://', '') : this.state.photo.uri,
      path: Platform.OS === "android" ?  RNFetchBlob.fs.dirs.PictureDir + "/" + this.state.currentDate +".png" : photo.uri.replace("file://", "")
      // addAndroidDownloads: {
      //   title: "encrypted.png", 
      //   description: `Download Encrypted`,
      //   useDownloadManager: false, 
      //   notification: false,
      // }
    })
      .fetch('GET', "http://192.168.0.123:5000/encrypt.png")
      .then(res => {
        // console.log(res.data);
        if((Platform.OS === "android")){
          // RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DownloadDir + "/encrypted.png", res.data, 'base64')
          CameraRoll.save(res.data, {type: 'photo'})
          .then(res => console.log(res))
          .catch(err => console.log(err))
        }
        // console.log("LOLOLO",RNFetchBlob.wrap(decodeURIComponent(res.data)))
        else{
          CameraRoll.save(res.data)
          .then(res => console.log(res))
          .catch(err => console.log(err))
        }
      })
      .catch(error => console.log(error));
  }
};

  clearInput = () => {
    this.setState({ photo: null, message: null, secret: null, currentDate: null});
  }

  render() {
    const { photo } = this.state
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {photo && (
          <React.Fragment>
            <Image
              source={{ uri: photo.uri }}
              style={{ width: 300, height: 300 }}
            />
            <TextInput
          style={{height: 40}}
        placeholder="Enter Message"
        onChangeText={(message) => this.setState({ message })}
        value={this.state.message}
      />
      {/* <Text>{this.state.message}</Text> */}
      <TextInput
        style={{height: 40}}
        placeholder="Enter Secret"
        onChangeText={(secret) => this.setState({ secret })}
        value={this.state.secret}
        // defaultValue={text}
      />
      {/* <Text>{this.state.secret}</Text> */}
            {/* <Button title="Encrypt Image" onPress={this.handleUploadPhoto} /> */}
            <Button title="Encrypt Image" onPress={this.handleEncrypt} />
            <Button title="Decrypt Image" onPress={this.handleDecrypt} />
            <Button title="Clear" onPress={this.clearInput} />
          </React.Fragment>
        )}
        <Button title="Choose Photo" onPress={this.handleChoosePhoto} />
      </View>
    )
  }
}