import React, {Component} from 'react'
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native'
const logo = require('../assets/images/logo.png')

export default class Header extends Component{
    

    render(){
        return(
            <View style = {{flexDirection :'row', heigth: '100%'}}>
                <Image
                    source = {logo}
                    style = {styles.logo}
                    resizeMode = 'contain'
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    logo: {
        width: 53,
        position: 'absolute',
            transform: [
                { translateX: -53/2 },
            ],
            top: '-820%',
            left: '50%',
    }
})