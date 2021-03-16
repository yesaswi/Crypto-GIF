import React, { useState } from 'react'
import { View, Image, Button, Text, TextInput } from 'react-native'
import * as ImagePicker from 'react-native-image-picker';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';


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


export default class App extends React.Component {
// const [message, onChangeMessage] = React.useState(null);
// const [secret, onChangeSecret] = React.useState(null);
  state = {
    photo: null,
    message: null,
    secret: null
  }


  handleChoosePhoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response })
      }
    })
  }
  
  handleDecrypt = () => {
    fetch("http://localhost:5000/decryptsuccess", {
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
    await fetch("http://localhost:5000/success", {
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
    await RNFetchBlob.config({
      fileCache: false,
      appendExt: 'png',
    })
      .fetch('GET', "http://localhost:5000/encrypt.png")
      .then(res => {
        CameraRoll.save(res.data, 'photo')
          .then(res => console.log(res))
          .catch(err => console.log(err))
      })
      .catch(error => console.log(error));
  };

  clearInput = () => {
    this.setState({ photo: null, message: null, secret: null});
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