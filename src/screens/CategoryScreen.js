import React, {Component} from 'react'
import {View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Image,Platform} from 'react-native'
import API from '../cores/API'
import CategoryCard from '../components/CategoryCard'
import Router from '../routes/Router'
import RouteNames from '../routes/RouteNames'
import Header from '../components/Header'
import ImgCard from '../components/ImgCard'
import SearchModal from '../components/SearchModal'
const searchIcon = require('../assets/images/search.png')
import { BlurView, VibrancyView } from 'react-native-blur';

const FLATLIST_COLUMN_NUM = 3
const dimensions = Dimensions.get('window')

export default class CategoryScreen extends Component {
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

    constructor() {
        super()
        this.state = {
            dataList : [],
            isLoading : true,
            showSearchModal: false
        }
    }

    onReceiveDataFromSearchModal = (year) => {
        console.warn(year)
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

    _createDataList(data) {
        let dataList = []
        for(let i = 0; i< data.urls.length; i++) {
            let image = API.getNormalImage(data.urls[i])
            let item ={key: `${i}`,url: image}
            dataList.push(item)
        }
        return dataList
    } 

    componentDidMount() {
        this.props.navigation.setParams({ openSearch: this._onPressAdd });
        const data = Router.getParam(this,'data')
        const dataList = this._createDataList(data)

        this.setState({
            dataList : dataList,
            isLoading : false
        })
    }

    onItemClicked = (key) => {
        Router.navigate(RouteNames.Detail, {imageUrl: this.state.dataList[key-1]})
    }

    renderItem = ({item}) => {
        return(
            // <TouchableOpacity style = {styles.item}>
            //     <CategoryCard
            //         cardImage = {item.url}
            //         showDescription = {false}
            //     />
            // </TouchableOpacity>
            <ImgCard
                cardImage = {item.url}
                title = 'Title'
                description = 'Description'
                onPress = {() => this.onItemClicked(item.key)}
                itemWidth = {(dimensions.width-30)/3}
            />
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
                        callbackFromScreen = {this.onReceiveDataFromSearchModal}
                    />
                </View>
            </BlurView>
        }
        else if (this.state.showSearchModal && Platform.OS === 'android') {
            return <View style = {styles.searchWrapperAndroid}>
            <View style = {{marginTop: '-30%'}}>
                <SearchModal 
                    closeOnPress = {this._closeSearchModal}
                    callbackFromScreen = {this.onReceiveDataFromSearchModal}
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
                    numColumns = {FLATLIST_COLUMN_NUM}
                    renderItem = {this.renderItem}
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
        paddingTop: 5,
        flex:1,
        flexDirection: 'row',
        backgroundColor: '#ece8d9'
    },
    list: {
        width: '100%',
    },
    item: {
        marginBottom: dimensions.height * 0.02
    },
    search: {
        width: 30,
        height: 30,
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

