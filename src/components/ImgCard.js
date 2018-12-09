import React, {Component} from 'react'
import {View, Text, StyleSheet, Dimensions, Image, TouchableOpacity} from 'react-native'
import {ResponsiveImage} from '../components/CategoryCard'
const dimensions = {width: Dimensions.get('window').width, height: Dimensions.get('window').height}

export default class ImgCard extends Component {
    render() {
        const styles = StyleSheet.create({
            imgView: {
                margin: 5,
                width: this.props.itemWidth,
                height: this.props.itemWidth
            }
        })

        return (
            <TouchableOpacity style = {styles.container} onPress = {this.props.onPress}>
                    <ResponsiveImage source = {{uri : this.props.cardImage}} style = {styles.imgView}/>
            </TouchableOpacity>
        )
    }
}
