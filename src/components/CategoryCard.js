import React, {Component} from 'react'
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native'

export default class CategoryCard extends Component {
    render() {
        const styles = StyleSheet.create({
            container: {
                justifyContent: 'space-between',
                backgroundColor: 'white',
                borderRadius: 4,
                overflow: 'hidden',
                borderWidth: 0.3,
                borderColor: '#333333',
                borderRadius: 4,
            },
            wrapper: {
                flex: 1,
                shadowColor: '#333333',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 1,
                borderRadius: 4
            },
            image: {
                width: '100%'
            },
            text: {
                height: 36,
                backgroundColor: '#60cbdb',
                color: 'white',
                paddingVertical: 8,
                textAlign: 'center',
                fontSize: 14,
                fontWeight: '500'
            }
        })
        console.log('keke', this.props.cardImage)
        return(
            <View style={styles.wrapper}>
                <View style = {styles.container}>
                    <ResponsiveImage
                        source = {{uri : this.props.cardImage}}
                        style={styles.image}
                    />
                    <Text style={styles.text}>{this.props.categoryName}</Text>
                </View>
            </View>
        )
    }
}

class ResponsiveImage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 0,
            imageRatio: 1
        }
    }
    componentDidMount() {
        const { uri } = this.props.source
        Image.getSize(uri, (width, height) => {
            this.setState({
                imageRatio: height * 1.0 / width
            })
        })
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