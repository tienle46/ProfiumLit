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
                    <Text style = {styles.prop}><B>Title</B>: Image</Text>
                    <Text style = {styles.prop}><B>Description</B>: Description of the image </Text>
                    <Text style = {styles.prop}><B>Author</B>: Anonymous</Text>
                    <Text style = {styles.prop}><B>Year</B>: 0000</Text>
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
        width: '90%',
        marginVertical: 20
    },
    propertyDetail: {
        width: '90%',
        marginBottom: 20
    },
    prop: {
        textAlign: 'justify',
        lineHeight: 30,
    }
})

