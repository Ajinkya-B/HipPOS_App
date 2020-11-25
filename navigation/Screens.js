import React from "react";
import { Easing, Animated, Text, StyleSheet } from "react-native";
import {
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer
} from "react-navigation";

// screens
import Sales from "../screens/Sales";
import Login from "../screens/Login";

// header for screens on the drawer
import Header from "../components/Header";

const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index;
    const width = layout.initWidth;

    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    });
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1]
    });
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0]
    });

    const scaleWithOpacity = { opacity };
    const screenName = "Search";

    if (
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps &&
        screenName === prevTransitionProps.scene.route.routeName)
    ) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] };
  }
});

//Sales page tab//

const SalesStack = createStackNavigator(
  {
    Sales: {
      screen: Sales,
      navigationOptions: ({ navigation }) => ({
        header: <Header navigation={navigation} />
      })
    }
  },
  {
    cardStyle: { backgroundColor: "#FFFFFF" },
    transitionConfig
  }
);

// Navigator for Sales and Login Screen //

const AppStack = createDrawerNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => <Text style={styles.block}></Text>
      })
    },
    Sales: {
      screen: Sales
    }
  },
  {
    initialRouteName: "Login"
  }
);
const styles = StyleSheet.create({
  block: {
    width: 1,
    height: 1
  }
});
const AppContainer = createAppContainer(AppStack);
export default AppContainer;
