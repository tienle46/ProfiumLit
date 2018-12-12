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
import Toast from '../components/Toast'

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
            showSearchModal: false,
            noDataShowing: false
        }
    }

    onReceiveDataFromSearchModal = async (year) => {
        const tag = Router.getParam(this, 'data').key
        const res = await API.getUrlsByYearAndTag(year, tag)
        if(!res) {
            Toast.show('No data matched your search')
        } else {
            const dataList = this._createSearchResultList(res)
            this.setState({dataList: dataList})
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

    _createSearchResultList(data) {
        let dataList = []
        for(let i = 0; i< data.length; i++) {
            let image = API.getNormalImage(data[i].url)
            let item ={key: `${i}`,url: image}
            dataList.push(item)
        }
        return dataList
    } 

    _createDataList(data) {
        let dataList = []
        for(let i = 0; i< data.urls.length; i++) {
            let image = API.getNormalImage(data.urls[i])
            let item ={key: `${i}`,url: image, originalUrl: data.urls[i]}
            dataList.push(item)
        }
        return dataList
    } 

    loadAllData = () => {
        const data = Router.getParam(this,'data')
        const dataList = this._createDataList(data)
        this.setState({
            dataList : dataList,
            isLoading : false
        })
    }

    componentDidMount() {
        this.props.navigation.setParams({ openSearch: this._onPressAdd });
        this.loadAllData()
    }

    onItemClicked = (key) => {
        Router.navigate(RouteNames.Detail, {imageUrl: this.state.dataList[key]})
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

    resetPage = () => {
        this.loadAllData()
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
                    callResetFromScreen = {this.resetPage}
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
        if(this.state.noDataShowing) {
            return(
                <View style = {{flex:1, alignItems: 'center',backgroundColor: '#ece8d9'}}>
                    <Text>No data matched your search</Text>
                </View>
            )
        } else {
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
}
const styles = StyleSheet.create({
    container: {
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

