import React, {Component} from 'react'
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native'

export default class ImgCard extends Component {
    render() {
        const styles = StyleSheet.create({
            container: {
                elevation: 2,
                shadowColor: '#333333',
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 7,
            },
            imgView: {
                margin: 5,
                width: this.props.itemWidth,
                height: this.props.itemWidth
            }
        })

        return (
            <View style = {styles.container}>
                <TouchableOpacity onPress = {this.props.onPress}>
                    <Image source = {{uri : this.props.cardImage}} style = {styles.imgView}/>
                </TouchableOpacity>
            </View>
        )
    }
}
