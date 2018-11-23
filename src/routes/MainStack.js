import React, {Component} from 'react'
import {createStackNavigator} from "react-navigation"

import RouteNames from './RouteNames'
import MainScreen from '../screens/MainScreen'
import CategoryScreen from '../screens/CategoryScreen'

const MainStack = createStackNavigator(
    {
        [RouteNames.Main]: {
            screen: MainScreen,
        },
        [RouteNames.Category]: {
            screen: CategoryScreen
        }
    },
    {
        initialRouteName: RouteNames.Main
    }
);

export default MainStack;