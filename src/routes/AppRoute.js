import React, {Component} from 'react'
import {  
    StyleSheet,
    Platform
} from 'react-native';

import {createSwitchNavigator} from "react-navigation"

import RouteNames from './RouteNames'
import MainStack from './MainStack'
import MainScreen from '../screens/MainScreen'


const styles = StyleSheet.create({
    
})

const AppRoute = createSwitchNavigator(
    {
        [RouteNames.MainStack] : MainStack
    },
    {
        initialRouteName: RouteNames.MainStack
    }
)

export default AppRoute