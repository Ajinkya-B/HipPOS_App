import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  View,
  Text,
  AsyncStorage,
  ImageBackground,
  RefreshControl
} from "react-native";

import Images from "../constants/Images";

import { Dropdown } from "react-native-material-dropdown";

import { Block } from "galio-framework";

import Header from "../components/Header";

import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");

class Sales extends React.Component {
  //API url for fetching data//
  baseURL = "https://apps.hipposhq.com/api/enterprise/total_sales";

  constructor(props) {
    super();
    this.state = {
      isLoading: false,
      loaded: false,
      subtotal: [],
      tax_total: [],
      total: [],
      total_orders: [],
      tokenKey: null,
      locationsDetails: null,
      locationsOverLimit: false,
      displayLocations: null,
      refreshing: false,
      test: null
    };
  }

  //API fetches the location sales//
  fetchData = value => {
    if (this.state.locationsOverLimit == true) {
      this.setState({ tokenKey: value, isLoading: true });
      console.log("YES");
    }
    this.setState({ loaded: false, refreshing: true });
    var current_date = new Date().getDate();
    var current_month = new Date().getMonth() + 1;
    var current_year = new Date().getFullYear();

    for (let i = 0; i < this.state.displayLocations; i++) {
      console.log("Update: " + i);
      if (this.state.locationsOverLimit == false) {
        this.setState({ test: i });
        this.state.tokenKey = this.state.locationsDetails[i].value;
      }
      fetch(this.baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          token: this.state.tokenKey,
          start_date_time:
            current_month +
            "/" +
            current_date +
            "/" +
            current_year +
            " 00:00:00",
          end_date_time:
            current_month +
            "/" +
            current_date +
            "/" +
            current_year +
            " 23:59:59"
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          //Implenenting the values in the variables that has been fetched from the API//
          (this.state.subtotal[i] = responseJson.location_totals[0].subtotal),
            (this.state.tax_total[i] =
              responseJson.location_totals[0].tax_total),
            (this.state.total[i] = responseJson.location_totals[0].total),
            (this.state.total_orders[i] =
              responseJson.location_totals[0].total_orders);
        })
        .then(this.displayData)
        .catch(error => {
          console.error(error);
        });
    }
  };

  displayData = dv => {
    this.setState({ loaded: true, isLoading: false, refreshing: false });
  };

  //Gets thge location keys from Async and calls fetchData()//
  componentWillMount = async () => {
    //Gets the value from Async
    try {
      this.setState({ isLoading: true });
      //varibles for fetch API
      var current_date = new Date().getDate();
      var current_month = new Date().getMonth() + 1;
      var current_year = new Date().getFullYear();
      global.locationsDetails = JSON.parse(
        await AsyncStorage.getItem("locations")
      );
      if (global.locationsDetails !== null) {
        // data is fetched successfully
        this.setState({
          locationsDetails: global.locationsDetails
        });
        global.totalLocations = this.state.locationsDetails.length;

        if (global.totalLocations < 4) {
          this.setState({
            displayLocations: 3
          });
          this.fetchData();
        } else {
          this.setState({ locationsOverLimit: true, displayLocations: 1 });
        }
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

  //Deletes the Async data//
  deleteData = async () => {
    try {
      AsyncStorage.removeItem("locations");
      console.log("Data deleted");
      const { navigation } = this.props;
      navigation.navigate("Login");
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
  };
  render() {
    const { navigation } = this.props;
    const multipleLocationSales = [];
    if (this.state.locationsOverLimit == false && this.state.loaded == true) {
      for (var i = 0; i < global.totalLocations; i++) {
        multipleLocationSales.push(
          <View
            key={"locationNameContainer" + i}
            style={{
              marginVertical: 10,
              backgroundColor: "#fff",
              borderRadius: 15,
              width: width * 0.8,
              alignSelf: "center"
            }}
          >
            <Text
              key={"locationName" + i}
              style={{ fontSize: 18, alignSelf: "center" }}
            >
              {this.state.locationsDetails[i].label}
            </Text>
            <View
              key={"subtotalContainer" + i}
              style={styles.container}
              flexDirection="row"
            >
              <Text key={"subtotal" + i} style={styles.title}>
                Subtotal:{" "}
              </Text>
              <Text key={"subtotalValue" + i} style={styles.Body}>
                ${this.state.subtotal[i]}
              </Text>
            </View>
            <View
              key={"taxTotalContainer" + i}
              style={styles.container}
              flexDirection="row"
            >
              <Text key={"taxTotal" + i} style={styles.title}>
                Tax Total:{" "}
              </Text>
              <Text key={"taxTotalValue" + i} style={styles.Body}>
                ${this.state.tax_total[i]}
              </Text>
            </View>
            <View
              key={"totalContainer" + i}
              style={styles.container}
              flexDirection="row"
            >
              <Text key={"total" + i} style={styles.title}>
                Total:{" "}
              </Text>
              <Text key={"totalValue" + i} style={styles.Body}>
                ${this.state.total[i]}
              </Text>
            </View>
            <View
              key={"totalOrdersContainer" + i}
              style={styles.container}
              flexDirection="row"
            >
              <Text key={"totalOrders" + i} style={styles.title}>
                Total Orders:{" "}
              </Text>
              <Text key={"totalOrdersValue" + i} style={styles.Body}>
                {this.state.total_orders[i]}
              </Text>
            </View>
          </View>
        );
      }
    }

    const singleLocationSales = [];
    if (this.state.locationsOverLimit == true && this.state.loaded == true) {
      singleLocationSales.push(
        <View
          key="container"
          style={{
            marginVertical: 10,
            backgroundColor: "#fff",
            borderRadius: 15,
            width: width * 0.8,
            alignSelf: "center"
          }}
        >
          <View
            key="subtotalContainer"
            style={styles.container}
            flexDirection="row"
          >
            <Text key="subtotal" style={styles.title}>
              Subtotal:{" "}
            </Text>
            <Text key="subtotalValue" style={styles.Body}>
              ${this.state.subtotal[0]}
            </Text>
          </View>
          <View
            key="taxTotalContainer"
            style={styles.container}
            flexDirection="row"
          >
            <Text key="taxTotal" style={styles.title}>
              Tax Total:{" "}
            </Text>
            <Text key="taxTotalValue" style={styles.Body}>
              ${this.state.tax_total[0]}
            </Text>
          </View>
          <View
            key="totalContainer"
            style={styles.container}
            flexDirection="row"
          >
            <Text key="total" style={styles.title}>
              Total:{" "}
            </Text>
            <Text key="totalValue" style={styles.Body}>
              ${this.state.total[0]}
            </Text>
          </View>
          <View
            key="totalOrdersContainer"
            style={styles.container}
            flexDirection="row"
          >
            <Text key="totalOrders" style={styles.title}>
              Total Orders:{" "}
            </Text>
            <Text key="totalOrdersTotal" style={styles.Body}>
              {this.state.total_orders[0]}
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View>
        <ImageBackground
          source={Images.LoginBackground}
          style={{ width: "100%", height: "100%" }}
        >
          <Header title="- Today's Sales" onPress={this.deleteData} />

          {this.state.locationsOverLimit && (
            <Block
              style={{
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Block
                style={{
                  width: "90%",
                  marginRight: 5
                }}
              >
                <Dropdown
                  style={{ color: "white" }}
                  baseColor="rgba(255,255,255, 1)"
                  label="Select a Business Location"
                  data={this.state.locationsDetails}
                  onChangeText={this.fetchData}
                />
              </Block>
            </Block>
          )}
          {this.state.isLoading && (
            <Block style={{ alignItems: "center" }}>
              <Text>LOADING</Text>
              <ActivityIndicator />
            </Block>
          )}
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.fetchData}
              />
            }
          >
            {/*dafault value: 4, test filter value: 3*/}
            {global.totalLocations < 4 && multipleLocationSales}

            {/*dafault value: 3, test filter value: 2*/}
            {global.totalLocations > 3 && singleLocationSales}
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Header: {
    fontSize: 30,
    fontWeight: "600"
  },
  Body: {
    fontSize: 18
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center"
  },
  container: {
    height: 20,
    alignItems: "center",
    padding: 5,
    margin: 7
  },
  block: {
    flexDirection: "row"
  },
  input: {
    marginTop: 8,
    marginLeft: 5,
    height: 40,
    borderColor: "#3D4849",
    borderWidth: 1
  },
  footer: {
    justifyContent: "flex-end",
    marginBottom: 20
  }
});

export default Sales;
