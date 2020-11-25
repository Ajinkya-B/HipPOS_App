import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Images from "../constants/Images";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("screen");

//Haeder for the Sales Page//
const Header = props => {
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <Text style={styles.title}>{props.title}</Text>

        {/*Logout Button*/}
        <TouchableOpacity onPress={props.onPress}>
          <Image source={Images.LogoutIcon} style={styles.ImageIconStyle} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#5E72E4",
    height: 75,
    justifyContent: "center"
  },
  container: {
    flexDirection: "row"
  },
  title: {
    color: "#F3F3F3",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 10,
    marginLeft: 15
  },
  ImageIconStyle: {
    marginTop: 13,
    marginLeft: width - 215,
    alignItems: "flex-end"
  }
});

export default Header;
