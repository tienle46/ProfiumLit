import React, {Component} from 'react'
import {View, Text, StyleSheet, Dimensions, Image, TouchableHighlight} from 'react-native'
import Modal from 'react-native-modalbox'
import Button from 'react-native-button'

export default class SearchModal extends Component{
    render(){
        return(
            <Modal 
                style = {styles.searchBox} 
                position = 'center' 
                backdrop = {true} onClosed = {() => {
                    alert('Modal closed');
                }}>
                <Text>Search box</Text>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    searchBox: {
        justifyContent: 'center',
        width: '80%',
        height: '60%',
    }
})
