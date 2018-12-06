import React, {Component} from 'react'
import {View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity} from 'react-native'
import API from '../cores/API'
import CategoryCard from '../components/CategoryCard'
import Router from '../routes/Router'
import RouteNames from '../routes/RouteNames'
import Header from '../components/Header'
import ImgCard from '../components/ImgCard'

const FLATLIST_COLUMN_NUM = 1
const dimensions = Dimensions.get('window')

export default class CategoryScreen extends Component {
    static navigationOptions = {
        headerTitle:(
        <Header />
        ),
        headerTintColor: 'black',
    }

    constructor() {
        super()
        this.state = {
            dataList : [],
            isLoading : true
        }
    }

    _createDataList(imageUrls) {
        let dataList = []
        for (let i = 0; i<imageUrls.length; i++) {
            let data = {key: `${i+1}`, url: API.getNormalImage(imageUrls[i])}
            dataList.push(data)
        }
        return dataList
    } 

    componentDidMount() {
        const imageUrls = Router.getParam(this,'imageUrls')
        const dataList = this._createDataList(imageUrls)

        this.setState({
            dataList : dataList.slice(0,6),
            isLoading : false
        })
    }

    onItemClicked = (key) => {
        
    }

    renderItem = ({item}) => {
        return(
            // <TouchableOpacity style = {styles.item}>
            //     <CategoryCard
            //         cardImage = {item.url}
            //         showDescription = {false}
            //     />
            // </TouchableOpacity>
            <ImgCard />
        )
    }

    render() {
        if(this.state.isLoading) {
            return (
                <View style = {{justifyContent: 'center', flex:1}}>
                    <ActivityIndicator/>
                </View>
            )
        }
        return(
            <View style = {styles.container}>
                <FlatList
                    style = {styles.list}
                    data = {this.state.dataList}
                    renderItem = {this.renderItem}
                    numColumns = {FLATLIST_COLUMN_NUM}
                    extraData = {this.state.isLoading}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex:1,
        alignItems: 'center'
    },
    list: {
        width: '100%',
        paddingHorizontal: 48
    },
    item: {
        marginVertical: dimensions.height * 0.02
    }
})

