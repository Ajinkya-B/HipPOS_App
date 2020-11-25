import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  View,
  TextInput,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import { Block, Button, Text } from "galio-framework";

import Images from "../constants/Images";

const { width, height } = Dimensions.get("screen");

class Login extends React.Component {
  baseUrl = "https://appstaging.hipposhq.com/api/authenticate";

  constructor(props) {
    super(props);
    this.state = {
      authenticate: false,
      email: "",
      password: "",
      isLoading: false,
      invalidPassword: false,
      data: null
    };
  }

  //Get's the Async Data, if location details are saved it switches to the sales page.//
  componentWillMount = async () => {
    try {
      this.setState({ data: await AsyncStorage.getItem("locations") });
      if (this.state.data !== null) {
        const { navigation } = this.props;
        navigation.navigate("Sales");
      }
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
  };

  handleEmail = text => {
    this.setState({ email: text });
  };

  handlePassword = text => {
    this.setState({ password: text });
  };

  //Calls authenticate API to authenticate the username and password given//
  authenticateUser = ev => {
    this.setState({ isLoading: true });
    return fetch("https://appstaging.hipposhq.com/api/authenticate", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        //Implenenting the values in the variables that has been fetched from the API//
        global.reformattedData = responseJson.map(data => {
          return {
            label: data.location_name,
            value: data.token
          };
        });
      })
      .then(this._storeData)
      .then(this.handleNav)
      .catch(error => {
        console.error(error);
      });
  };

  //Data stored to Async if the API dosen't return an error//
  _storeData = async () => {
    try {
      await AsyncStorage.setItem(
        "locations",
        JSON.stringify(global.reformattedData)
      );
    } catch (error) {
      console.log("Error while storing Async Data!");
    }
  };

  //Called after the location details are stored//
  handleNav = dv => {
    const { navigation } = this.props;
    if (global.reformattedData != "") {
      this.setState({
        authenticate: true,
        isLoading: false,
        invalidPassword: false
      });
      {
        navigation.navigate("Sales");
      }
    } else {
      this.setState({
        authenticate: false,
        isLoading: false,
        invalidPassword: true
      });
    }
  };
  render() {
    return (
      <View>
        <StatusBar hidden />
        <Block style={styles.registerContainer}>
          <ImageBackground
            source={Images.LoginBackground}
            style={{ width: "100%", height: "100%" }}
          >
            <Block>
              <Image style={styles.logo} source={Images.LogoBlack} />
            </Block>
            <Block flex>
              <Block flex center>
                <Block flex={0.17} middle>
                  <Text color="#fff" size={19}>
                    Sign in with your Account
                  </Text>
                </Block>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                    {
                      //Username Input//
                    }
                    <View style={styles.container}>
                      <View style={styles.SectionStyle}>
                        <Image
                          source={Images.UsernameLogo}
                          style={styles.ImageStyle}
                        />

                        <TextInput
                          style={{ flex: 1 }}
                          placeholder="Email"
                          underlineColorAndroid="transparent"
                          onChangeText={this.handleEmail}
                        />
                      </View>
                    </View>
                    <Block style={{ height: 50 }}></Block>
                    {
                      //Password Input//
                    }
                    <View style={styles.container}>
                      <View style={styles.SectionStyle}>
                        <Image
                          source={Images.PasswordLogo}
                          style={styles.ImageStyle}
                        />

                        <TextInput
                          style={{ flex: 1 }}
                          secureTextEntry={true}
                          placeholder="Password"
                          underlineColorAndroid="transparent"
                          onChangeText={this.handlePassword}
                        />
                      </View>
                    </View>
                  </Block>
                  {
                    //'Login' Button//
                  }
                  <Block middle>
                    <Button color="#5E72E4" style={styles.createButton}>
                      <Button
                        bold
                        size={14}
                        color="#5E72E4  "
                        onPress={this.authenticateUser}
                      >
                        {!this.state.isLoading && (
                          <Text style={{ fontSize: 18, color: "#fff" }}>
                            LOGIN
                          </Text>
                        )}
                        {this.state.isLoading && (
                          <Block flexDirection="row">
                            <ActivityIndicator color="#ffffff " />
                            <Text style={{ fontSize: 18, color: "#fff" }}>
                              Please Wait
                            </Text>
                          </Block>
                        )}
                      </Button>
                    </Button>
                  </Block>
                  {
                    //Error Message//
                  }
                  <Block>
                    {this.state.invalidPassword && (
                      <Text
                        style={{
                          fontSize: 18,
                          alignSelf: "center",
                          color: "#ff0000"
                        }}
                      >
                        Invalid Password. Please Try Again
                      </Text>
                    )}
                  </Block>
                </KeyboardAvoidingView>
              </Block>
            </Block>
          </ImageBackground>
        </Block>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width,
    height: height,
    backgroundColor: "#f4f5f7",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 35
  },
  logo: {
    alignSelf: "center",
    marginBottom: 140,
    marginTop: 100,
    width: 120,
    height: 120
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10
  },

  SectionStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 45,
    borderRadius: 10,
    width: width * 0.8,
    margin: 10
  },

  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: "stretch",
    alignItems: "center"
  }
});

export default Login;
