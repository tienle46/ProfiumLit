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
            // headerStyle: { backgroundColor: '#d49b47'},
            headerTitle:(
            <Header />
            ),
            headerTintColor: 'black',
            headerRight: (
            <TouchableOpacity
                onPress={navigation.getParam('openSearch')}
                style = {{marginRight: 20}}
            >
                <Image source = {searchIcon} style = {styles.search} resizeMode = 'contain'/>
            </TouchableOpacity>
            ),
        }
    }

    constructor() {
        super()
        this.state = {
            dataList: [],
            isLoading: true,
            showSearchModal: false
        }
    }

    _onPressAdd = () => {
        this.setState({
            showSearchModal: true
        })

    }

    _closeSearchModal = () => {
        this.setState({
            showSearchModal: false
        })
    }

    _createData = (index, label, date, count, urls, thumbnail) => {
        return({index: index, key: label, date: date, count: count, urls:urls, thumbnail: thumbnail})
    }



    _getAllImageByLabel = async (predicate) => {
        const data = await API.getInversePredicatedObjects(predicate)
        return data //data.objectInverse
    }

    _getImageDate = async (predicate) => {
        const data = await API.getPredicatedObjects(predicate)
        return data //data.date
    }

    _getRandomThumbnail = (listUrl) => {
        const randomNumber = Math.floor(Math.random() * listUrl.length)
        return listUrl[randomNumber]
    }

    _getAllProps = async () => {
        const data = await API.fetchAll()
        return data //{data.predicate,data.lable,data.count}
    }

    _createDataList = async () => {
        const allProps = await this._getAllProps()
        let dataList = []
        for (let i = 0; i< allProps.length; i++) {
            const objectInverses = await this._getAllImageByLabel(allProps[i].predicate)
            let allUrls = []
            for(let i = 0; i< objectInverses.length; i++) {
                allUrls.push(objectInverses[i].objectInverse)
            }
            const date = await this._getImageDate(allProps[i].predicate)
            const thumbnail = API.getNormalImage(this._getRandomThumbnail(allUrls))
            const data = this._createData(i, allProps[i].label, date[0].date, allProps[i].count, allUrls, thumbnail)
            dataList.push(data)
        }
        return dataList
    }

    async componentDidMount() {
        this.props.navigation.setParams({ openSearch: this._onPressAdd });
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
                    photoCount = {this.state.dataList[item.index].count-1} //Not counting docx file
                />
            </View>
            
        )
    }

    renderSearchModal = () => {
        if(this.state.showSearchModal && Platform.OS === 'ios') {
            return <BlurView 
            blurType = 'light'
            blurAmount = {5}
            style = {style = styles.blur}>
                <View style = {styles.searchWrapper}>
                    <SearchModal 
                        closeOnPress = {this._closeSearchModal}
                    />
                </View>
            </BlurView>
        }
        else if (this.state.showSearchModal && Platform.OS === 'android') {
            return <View style = {styles.searchWrapperAndroid}>
            <View style = {{marginTop: '-30%'}}>
                <SearchModal 
                    closeOnPress = {this._closeSearchModal}
                />
            </View>
        </View> 
        } else {
            return null
        }
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
                {this.renderSearchModal()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex:1,
        alignItems: 'center',
        backgroundColor: 'white'
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
        height: 30
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

