import React, {Component} from 'react'
import {View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Image,Platform} from 'react-native'
import API from '../cores/API'
import CategoryCard from '../components/CategoryCard'
import Router from '../routes/Router'
import RouteNames from '../routes/RouteNames'
import Header from '../components/Header'
import { BlurView, VibrancyView } from 'react-native-blur'
import SearchModal from '../components/SearchModal'
const searchIcon = require('../assets/images/search.png')

const FLATLIST_COLUMN_NUM = 1
const dimensions = Dimensions.get('window')

export default class MainScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerStyle: { backgroundColor: '#faf6e9'},
            headerTitle:(
            <Header/>
            ),
            headerTintColor: '#494949',
            
        }
    }

    constructor() {
        super()
        this.state = {
            dataList: [],
            isLoading: true,
        }
    }

    _createData = (index, tag, count, urls, thumbnail) => {
        return({index: index, key: tag, count: count, urls:urls, thumbnail: thumbnail})
    }

    _getAllImageByTag = async (tag) => {
        const data = await API.getUrlsByTag(tag)
        return data //data.url
    }

    _getRandomThumbnail = (listUrl) => {
        const randomNumber = Math.floor(Math.random() * listUrl.length)
        return listUrl[randomNumber]
    }

    _getAllTags = async () => {
        const data = await API.getAllTags()
        return data //{data.tag}
    }

    _createDataList = async () => {
        const allTags = await this._getAllTags()
        let dataList = []
        for (let i = 0; i< allTags.length; i++) {
            const urls = await this._getAllImageByTag(allTags[i].tag)
            let allUrls = []
            for(let i = 0; i< urls.length; i++) {
                allUrls.push(urls[i].url)
            }
            const thumbnail = API.getNormalImage(this._getRandomThumbnail(allUrls))
            const data = this._createData(i, allTags[i].tag, allUrls.length, allUrls, thumbnail)
            dataList.push(data)
        }
        return dataList
    }

    async componentDidMount() {
        const dataList = await this._createDataList()
        this.setState({
            dataList: dataList,
            isLoading: false
        })
    }

    onItemClicked = (key) => {
        let data = {}
        for (let i = 0; i < this.state.dataList.length; i ++) {
            if (this.state.dataList[i].key === key) {
                data = this.state.dataList[i]
            }
        }
        Router.navigate(RouteNames.Category, {data: data})
    }

    renderItem = ({item}) => {
        return(
            <View style = {styles.item}> 
                <CategoryCard
                    onPress = {() => this.onItemClicked(item.key)}
                    categoryName = {item.key}
                    cardImage = {item.thumbnail}
                    showDescription = {true}
                    photoCount = {this.state.dataList[item.index].count}
                />
            </View>
            
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
        alignItems: 'center',
        backgroundColor: '#ece8d9'
    },
    list: {
        width: '100%',
        paddingHorizontal: 20
    },
    item: {
        marginVertical: dimensions.height * 0.02
    },
    search: {
        width: 30,
        height: 30,
        opacity: 0
    },
    blur: {
        position: 'absolute',
        top: '0%',
        left: '0%',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchWrapper: {
        position: 'absolute',
        top: '10%',
        backgroundColor: 'black'
    },
    searchWrapperAndroid: {
        position: 'absolute',
        top: '0%',
        left: '0%',
        backgroundColor: 'transparent',
        width: dimensions.width,
        height: dimensions.height,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

