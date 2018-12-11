import React, {Component} from 'react'
import {View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, Slider, Picker, Item, Button } from 'react-native'


export default class SearchModal extends Component{
    constructor(props) {
        super(props)
        this.state = {year: 2000, selected: 'Helsinki'}
    }

    getVal(val){
        console.warn(val);
    }   

    render(){
        return(
            <View style = {styles.searchBox}>
                <TouchableOpacity style = {styles.closeButton} onPress = {this.props.closeOnPress}>
                    <Text style = {{fontWeight: 'bold', fontSize:20}}>x</Text>
                </TouchableOpacity>

                <View style = {{width: '80%', marginTop: '10%'}}>
                    <Text>Keyword</Text>
                    <View style = {{alignItems: 'center'}}>
                        <TextInput
                            style={{width: '90%', height: 30, borderColor: 'gray', borderBottomWidth: 1, padding: 0}}
                            onChangeText={(text) => this.setState({text})}
                            value={this.props.text}
                        />
                    </View>         
                </View>

                <View style = {{width: '80%', marginTop: '8%'}}>
                    <Text>Time</Text>
                    <Slider
                        style = {{marginTop: 20}}
                        step={1}
                        minimumValue={2000}
                        maximumValue={2018}
                        value={this.props.year}
                        onValueChange={val => this.setState({ year: val })}
                        onSlidingComplete={ val => this.getVal(val)}
                    />
                    <Text style = {{textAlign: 'center', marginBottom: 0}}>{this.state.year}</Text>
                </View>
                
                {/* <View style = {{width: '80%', marginTop: '5%'}}>
                    <Text>Location</Text>
                    <Picker 
                            // mode = {"dialog"} 
                            selectedValue = {this.props.selected} 
                            onValueChange = {(value) => this.setState({selected:value})}>
                        <Item value = {'Helsinki'} label = {'Helsinki'} />
                        <Item value = {'Espoo'} label = {'Espoo'} />
                        <Item value = {'Vantaa'} label = {'Vantaa'} />
                    </Picker>
                </View> */}

                <View style = {{width: '40%', marginTop: '8%'}}>
                    <Button
                        onPress={this.props.onPress}
                        title="Filter"
                        color="#841584"
                    />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    searchBox: {
        alignItems: 'center',
        width: Dimensions.get('window').width * 0.95,
        height: Dimensions.get('window').height * 0.5,
        backgroundColor: 'white',
        shadowColor: '#333333',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
    },
    closeButton: {
        position: 'absolute',
        top: '2%',
        right: '5%'
    }
})
