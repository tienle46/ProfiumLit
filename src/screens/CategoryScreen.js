import React, {Component} from 'react'
import {View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity} from 'react-native'
import API from '../cores/API'
import CategoryCard from '../components/CategoryCard'
import Router from '../routes/Router'
import RouteNames from '../routes/RouteNames'
import Header from '../components/Header'
import ImgCard from '../components/ImgCard'
import SearchModal from '../components/SearchModal'

const FLATLIST_COLUMN_NUM = 3
const dimensions = Dimensions.get('window')

export default class CategoryScreen extends Component {
    static navigationOptions = {
        headerTitle:(
        <Header 
            onPress = {this._onPressAdd}
        />
        ),
        headerTintColor: 'black',
    }

    constructor() {
        super()
        this.state = {
            dataList : [],
            isLoading : true,
            showSearchModal: false
        }
    }

    _onPressAdd = () => {
        this.setState({
            showSearchModal: true
        })
        console.warn('asdas')
    }

    _closeSearchModal = () => {
        this.setState({
            showSearchModal: false
        })
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
            dataList : dataList.slice(0,15),
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

                <SearchModal/>
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
        flex:1,
        flexDirection: 'row',
    },
    list: {
        width: '100%',
    },
    item: {
        marginBottom: dimensions.height * 0.02
    }
})

