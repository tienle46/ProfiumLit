import React, {Component} from 'react'
import {View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity} from 'react-native'
import API from '../cores/API'
import CategoryCard from '../components/CategoryCard'
import Router from '../routes/Router'
import RouteNames from '../routes/RouteNames'
import Header from '../components/Header'
import ImgCard from '../components/ImgCard'

const dimensions = Dimensions.get('window')

export default class ImageDetailScreen extends Component {
    static navigationOptions = {
        headerTitle:(
        <Header />
        ),
        headerTintColor: 'black',
    }



    render() {
        return(
            <View></View>
        )
    }
}
const styles = StyleSheet.create({

})

