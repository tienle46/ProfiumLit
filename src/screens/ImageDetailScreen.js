import React, {Component} from 'react'
import {ScrollView, View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Image} from 'react-native'
import API from '../cores/API'
import CategoryCard from '../components/CategoryCard'
import Router from '../routes/Router'
import RouteNames from '../routes/RouteNames'
import Header from '../components/Header'
import ImgCard from '../components/ImgCard'
import {ResponsiveImage} from '../components/CategoryCard'
const searchIcon = require('../assets/images/search.png')
const dimensions = {width: Dimensions.get('window').width, height: Dimensions.get('window').height}
const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

export default class ImageDetailScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerStyle: { backgroundColor: '#faf6e9'},
            headerTitle:(
            <Header />
            ),
            headerTintColor: '#494949',
            headerRight: (
            <TouchableOpacity
                onPress={navigation.state.params.openSearch}
                style = {{marginRight: 20}}
            >
                <Image source = {searchIcon} style = {styles.search} resizeMode = 'contain'/>
            </TouchableOpacity>
            ),
        }
    }

    render() {
        return(
            <ScrollView contentContainerStyle = {styles.container}>
                <ResponsiveImage style = {styles.imgDetail} source = {{uri : Router.getParam(this,'imageUrl').url}}/>

                <View style = {styles.propertyDetail}>
                    <Text style = {styles.detail}><B>Title:</B> null</Text>
                    <Text style = {styles.detail}><B>User:</B> null</Text>
                    <Text style = {styles.detail}><B>Time:</B> null</Text>
                    <Text style = {styles.detail}><B>Description</B> null</Text>
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: dimensions.width,
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ece8d9'
    },
    imgDetail: {
        width: '100%'
    },
    propertyDetail: {
        width: '85%',
        marginTop: 20,
    },
    detail: {
        fontSize: 16,
        color: '#494949',
        marginBottom: 10,
        padding: 0
    },
    search: {
        width: 30, 
        height: 30,
        opacity: 0
    }
})

