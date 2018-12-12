import React, {Component} from 'react'
import {View, Text, StyleSheet, Dimensions, Image, TouchableOpacity} from 'react-native'

export default class CategoryCard extends Component {
    render() {
        const styles = StyleSheet.create({
            container: {
                justifyContent: 'space-between',
                backgroundColor: '#fffdf6',
                overflow: 'hidden',
                paddingTop: 10, paddingHorizontal: 10,
                elevation: 5,
            },
            wrapper: {
                flex: 1,
                shadowColor: '#333333',
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 7,

            },
            image: {
                width: '100%',
                height: 150
            },
            detail: {
                flex: 1,
                flexDirection: 'row'
            },
            text: {
                width: '50%',
                height: 36,
                color: '#494949',
                paddingVertical: 8,
                textAlign: 'left',
                fontSize: 14,
                fontWeight: '500',
                padding: 0,
                margin: 0,
                
            },
            number: {
                alignItems: 'flex-end',
                justifyContent: 'center',
                width: '50%',
                padding: 0,
                margin: 0,
            }
        })
        return(
            <View style={styles.wrapper}>
                <View style = {styles.container}>
                    <TouchableOpacity onPress = {this.props.onPress}>
                        <ResponsiveImage
                            source = {{uri : this.props.cardImage}}
                            style={styles.image}
                        />
                    </TouchableOpacity>

                    <View style = {styles.detail}>
                        {this.props.showDescription ? <Text style={styles.text}>#{this.props.categoryName}</Text> : null}
                        <View style = {styles.number}>
                            <Text style = {{fontSize: 14, color: '#494949'}}>{this.props.photoCount} photos</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

export class ResponsiveImage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 0,
            imageRatio: 1
        }
    }
    componentDidMount() {
        this.isMounted = true
        const { uri } = this.props.source
        Image.getSize(uri, (width, height) => {
            if(this.isMounted) {
                this.setState({
                imageRatio: height * 1.0 / width
            })
            }
        })
    }

    componentWillUnmount() {
        this.isMounted = false
    }

    onLayout = (e) => {
        const {width, height} = e.nativeEvent.layout
        this.setState({width})
    }
    render() {
        const {style, ...rest} = this.props
        const imageStyle = {
            height: this.state.width * this.state.imageRatio
        }
        return (
            <Image
                onLayout={this.onLayout}
                {...rest}
                style={{...imageStyle, ...style}}
            />
        )
    }
}
