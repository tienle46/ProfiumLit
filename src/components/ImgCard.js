import React, {Component} from 'react'
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native'
const dimensions = {width: Dimensions.get('window').width, height: Dimensions.get('window').height}

export default class ImgCard extends Component {
    render() {
        return (
            <View style = {styles.container}>
                <View style = {{flexDirection:'row',padding:10}}>
                    <Image source = {{uri : this.props.cardImage}} style = {styles.imgView}/>

                    <View style = {styles.cardView}>
                        
                    </View>
                </View> 
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: dimensions.width,
        height: dimensions.height*0.25,
        flex: 1,
        flexDirection: 'row',
    },
    imgView: {
        width: '40%',
        height: '100%'
    },
    cardView: {
        width: '60%',
        height: '100%',
        backgroundColor: 'tomato'
    }
})