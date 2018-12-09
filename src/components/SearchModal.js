import React, {Component} from 'react'
import {View, Text, StyleSheet, Dimensions, Image, TouchableOpacity} from 'react-native'

export default class SearchModal extends Component{
    render(){
        return(
            <View style = {styles.searchBox}>
                <TouchableOpacity style = {styles.closeButton} onPress = {this.props.closeOnPress}>
                    <Text style = {{fontWeight: 'bold', fontSize:20}}>x</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    searchBox: {
        justifyContent: 'center',
        width: Dimensions.get('window').width * 0.95,
        height: Dimensions.get('window').height * 0.6,
        borderWidth: 1,
        backgroundColor: 'white'
    },
    closeButton: {
        position: 'absolute',
        top: '2%',
        right: '5%'
    }
})
