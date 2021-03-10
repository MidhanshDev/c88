import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./AppTabNavigator";
import CustomSideBarMenu from "./CustomSideBarMenu";
import SettingScreen from "../screens/SettingScreen";
import MyDonationsScreen from "../screens/MyDonationScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MyReceievdBooksScreen from "../screens/MyReceivedBooksScreen";
export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: AppTabNavigator },
    MyDonations: { screen: MyDonationsScreen },
    Notifications: { screen: NotificationScreen },
    MyReceievdBooks: { screen: MyReceievdBooksScreen },
    Settings: { screen: SettingScreen },
  },
  { contentComponent: CustomSideBarMenu },
  { initialRouteName: "Home" }
);
