import React, {Component} from 'react'
import {createStackNavigator} from "react-navigation"

import RouteNames from './RouteNames'
import MainScreen from '../screens/MainScreen'
import CategoryScreen from '../screens/CategoryScreen'
import ImageDetailScreen from '../screens/ImageDetailScreen';

const MainStack = createStackNavigator(
    {
        [RouteNames.Main]: {
            screen: MainScreen,
        },
        [RouteNames.Category]: {
            screen: CategoryScreen
        },
        [RouteNames.Detail]: {
            screen: ImageDetailScreen
        }
    },
    {
        initialRouteName: RouteNames.Main
    }
);

export default MainStack;