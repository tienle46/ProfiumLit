import React, {Component} from 'react'
import {View, Text, StyleSheet, Dimensions, Image, TouchableOpacity} from 'react-native'
const logo = require('../assets/images/logo.png')
const searchIcon = require('../assets/images/search.png')
// const dimensions = Dimensions.get('window')

export default class Header extends Component{

    render(){
        return(
            <View style = {styles.container}>
                <Image source = {logo} style = {styles.logo} resizeMode = 'contain' />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        height: '100%',
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 45,
        height: 45
    },
})