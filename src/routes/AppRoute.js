import React, {Component} from 'react'
import {  
    StyleSheet,
    Platform
} from 'react-native';

import {SwitchNavigator} from "react-navigation"

import RouteNames from './RouteNames'
import MainScreen from '../screens/MainScreen'


const styles = StyleSheet.create({
    
})

const AppRoute = SwitchNavigator(
    {
        [RouteNames.Main] : MainScreen
    },
    {
        initialRouteName: RouteNames.Main
    }
)

export default AppRoute