import React, {Component} from 'react'
import {ScrollView, View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Image} from 'react-native'
import API from '../cores/API'
import CategoryCard from '../components/CategoryCard'
import Router from '../routes/Router'
import RouteNames from '../routes/RouteNames'
import Header from '../components/Header'
import ImgCard from '../components/ImgCard'
import {ResponsiveImage} from '../components/CategoryCard'
const dimensions = {width: Dimensions.get('window').width, height: Dimensions.get('window').height}
const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

export default class ImageDetailScreen extends Component {
    static navigationOptions = {
        headerTitle:(
        <Header />
        ),
        headerTintColor: 'black',
    }

    render() {
        return(
            <ScrollView contentContainerStyle = {styles.container}>
                <ResponsiveImage style = {styles.imgDetail} source = {{uri : Router.getParam(this,'imageUrl').url}}/>

                <View style = {styles.propertyDetail}>
                    <Text style = {styles.title}><B>title</B> by <B>author</B></Text>
                    <Text style = {styles.time}><B>time</B>: 00/00/0000</Text>
                    <Text style = {styles.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                    
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: dimensions.width,
        flexDirection: 'column',
        alignItems: 'center',
    },
    imgDetail: {
        width: '100%',
        marginBottom: 10
    },
    propertyDetail: {
        width: '80%',
        marginBottom: 10
    },
    title: {
        fontSize: 18,
        marginBottom: 5,
    },
    time: {
        fontSize: 16,
        marginBottom: 10
    }
})

