import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import firebase, { storage } from "firebase";
import { DrawerItems } from "react-navigation-drawer";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import db from "../config";

export default class CustomSideBarMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      image: "#",
      name: "",
      docId: "",
    };
  }
  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cancelled) {
      this.setState({
        image: uri,
      });
      this.uploadImage(uri, this.state.userId);
    }
  };
  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);
    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };
  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({
          image: url,
        });
      })
      .catch((error) => {
        this.setState({
          image: "#",
        });
      });
  };
  getUserProfile = () => {
    db.collection("users")
      .where("username", "==", this.state.userId)
      .onSnapshot((qry) => {
        qry.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };
  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{ flex: 0.5, alignItems: "center", backgroundColor: "#654" }}
        >
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size="medium"
            onPress={() => {
              this.selectPicture();
            }}
            containerStyle={styles.imageContainer}
            showEditButton
          />
          <Text style={{ fontWeight: "100", fontSize: 20, paddingTop: 10 }}>
            {this.state.name}
          </Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              this.props.navigation.navigate("WelcomeScreen");
              firebase.auth().signOut();
            }}
          >
            <Text style={styles.logOutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  logOutButton: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    padding: 10,
  },
  logOutText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
});
