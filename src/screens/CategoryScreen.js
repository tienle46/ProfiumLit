import React, {Component} from 'react'
import {View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity} from 'react-native'
import API from '../cores/API'
import CategoryCard from '../components/CategoryCard'

const FLATLIST_COLUMN_NUM = 1
const dimensions = Dimensions.get('window')

export default class CategoryScreen extends Component {
    constructor() {
        super()
        this.state = {
            dataList: [],
            isLoading: true
        }
    }

    _createData = (propName, imageUrls, thumbnail) => {
        return({key: propName, imageUrls: imageUrls, thumbnail: thumbnail})
    }

    _getAllImageByProp = async (prop) => {
        const res = await API.getImageUrls(prop)
        const listUrl = Array.from(res)
        return listUrl
    }

    _getRandomThumbnail = (listUrl) => {
        const randomNumber = Math.floor(Math.random() * listUrl.length)
        return listUrl[randomNumber]
    }

    _getAllProps = async () => {
        const getProps = await API.getTopLevelImageProps()
        const listPropName = Array.from(getProps)
        return listPropName
    }

    _createDataList = async () => {
        const allProps = await this._getAllProps()
        let dataList = []
        for (var i = 0; i< allProps.length; i++) {
            const allUrls = await this._getAllImageByProp(allProps[i])
            const thumbnail = API.getNormalImage(this._getRandomThumbnail(allUrls))
            const data = this._createData(allProps[i], allUrls, thumbnail)
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

    renderItem = ({item}) => {
        return(
            <TouchableOpacity style = {styles.item}>
                <CategoryCard
                    categoryName = {item.key}
                    cardImage = {item.thumbnail}
                />
            </TouchableOpacity>
            
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

