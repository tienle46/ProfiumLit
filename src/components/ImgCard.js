import React, {Component} from 'react'
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native'

export default class ImgCard extends Component {
    render() {
        return (
            <View style = {styles.container}>
                <View></View>
                <View></View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: '90%',
        //height: '50%',
        borderWidth: 1,
        flexDirection: 'row'
    }
})