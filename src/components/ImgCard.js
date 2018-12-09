import React, {Component} from 'react'
import {View, Text, StyleSheet, Dimensions, Image, TouchableOpacity} from 'react-native'
const dimensions = {width: Dimensions.get('window').width, height: Dimensions.get('window').height}

export default class ImgCard extends Component {
    render() {
        return (
            <TouchableOpacity style = {styles.container} onPress = {this.props.onPress}>
                    <Image source = {{uri : this.props.cardImage}} style = {styles.imgView}/>

                    <View style = {styles.cardView}>
                        <View style={styles.imgTitle}> 
                            <Text style = {styles.title}>{this.props.title}</Text>
                        </View>
                        <View style={styles.imgDescription}>
                            <Text>{this.props.description}</Text>
                        </View>
                    </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: dimensions.width,
        height: dimensions.height*0.25,
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10
    },
    imgView: {
        width: '40%',
        height: '100%'
    },
    cardView: {
        width: '60%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DCDCDC',
    },
    imgTitle: {
        width: "85%",
        height: '30%',
    },
    imgDescription: {
        width: "85%",
        height: '70%',
    },
})