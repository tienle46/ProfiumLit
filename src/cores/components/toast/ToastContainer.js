//@flow
import React, { Component } from 'react'
import { 
    ViewPropTypes, 
    StyleSheet, 
    View, 
    Text, 
    Animated, 
    Dimensions, 
    TouchableWithoutFeedback,
    Easing,
    Keyboard
} from 'react-native'

const TOAST_MAX_WIDTH = .8
const TOAST_ANIMATION_DURATION = 200
const DIMENSION = Dimensions.get('window')

let KEYBOARD_HEIGHT = 0

Keyboard.addListener('keyboardDidChangeFrame', ({ endCoordinates }) => {
    KEYBOARD_HEIGHT = DIMENSION.height - endCoordinates.screenY
})

const WINDOW_WIDTH = DIMENSION.width

export const positions = {
    TOP: 20,
    BOTTOM: -20,
    CENTER: 0
}

export const durations = {
    SHORT: 2000,
    LONG: 3000,
    FOREVER: 999999
}


let styles = StyleSheet.create({
    defaultStyle: {
        position: 'absolute',
        width: WINDOW_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerStyle: {
        padding: 10,
        backgroundColor: '#000',
        opacity: .8,
        borderRadius: 5,
        marginHorizontal: WINDOW_WIDTH * ((1 - TOAST_MAX_WIDTH) / 2)
    },
    shadowStyle: {
        shadowColor: '#000',
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowOpacity: .8,
        shadowRadius: 6,
        elevation: 10
    },
    textStyle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center'
    }
})

type ToastContainerPropsType = {
    ...ViewPropTypes,
    containerStyle: StyleSheet.Styles,
    duration: number,
    visible: boolean,
    position: number,
    animation: boolean,
    shadow: boolean,
    backgroundColor: string,
    opacity: number,
    shadowColor: string,
    textStyle: StyleSheet.Styles,
    delay: number,
    hideOnPress: boolean,
    onHide: Function,
    onHidden: Function,
    onShow: Function,
    onShown: Function
};

class ToastContainer extends Component<ToastContainerPropsType> {
    static displayName = `ToastContainer`
    
    static defaultProps = {
        visible: false,
        duration: durations.SHORT,
        animation: true,
        shadow: false,
        position: positions.BOTTOM,
        opacity: .8,
        delay: 0,
        hideOnPress: true
    }

    _showTimeout: number | null = null
    _hideTimeout: number | null = null
    _animating: boolean = false
    _root: Object | null = null

    constructor() {
        super(...arguments)

        this.state = {
            visible: this.props.visible,
            opacity: new Animated.Value(0)
        }
    }

    componentDidMount = () => {
        if(this.state.visible)
            this._showTimeout = setTimeout(() => this._show(), this.props.delay)
    }

    componentWilReceiveProps = (nextProps) => {
        if(nextProps.visible !== this.props.visible) {
            if(nextProps.visible) {
                clearTimeout(this._showTimeout)
                clearTimeout(this._hideTimeout)

                this._showTimeout = setTimeout(() => this._show(), this.props.delay)
            } else {
                this._hide()
            }

            this.setState({
                visible: nextProps.visible
            })
        }
    }

    componentWillUnmount = () => {
        this._hide()
    }

    _show = () => {
        clearTimeout(this._showTimeout)
        if(this._animating) 
            return

        clearTimeout(this._hideTimeout)

        this._animating = true
        this._root.setNativeProps({
            pointerEvents: 'auto'
        })

        this.props.onShow && this.props.onShow()

        Animated.timing(this.state.opacity, {
            toValue: this.props.opacity,
            duration: this.props.animation ? TOAST_ANIMATION_DURATION: 0,
            easing: Easing.out(Easing.ease)
        }).start(({finished}) => {
            if(!finished)
                return

            this._animating = !finished
            this.props.onShown && this.props.onShown()

            if(this.props.duration > 0)
                this._hideTimeout = setTimeout(() => this._hide(), this.props.duration)
        })
    }

    _hide = () => {
        clearTimeout(this._showTimeout)
        clearTimeout(this._hideTimeout)

        if(this._animating)
            return

        this._root.setNativeProps({
            pointerEvents: 'none'
        })

        this.props.onHide && this.props.onHide()

        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: this.props.animation ? TOAST_ANIMATION_DURATION : 0,
            easing: Easing.in(Easing.ease)
        }).start(({finished}) => {
            if(finished) {
                this._animating = false
                this.props.onHidden && this.props.onHidden()
            }
        })
    }

    render() {
        let offset = this.props.position

        let position = offset ? {
            [offset < 0 ? 'bottom' : 'top'] : offset < 0 ? (KEYBOARD_HEIGHT - offset) : offset
        } : {
            top: 0,
            bottom: KEYBOARD_HEIGHT
        }

        return (this.state.visible || this._animating) ? (<View
            style={[styles.defaultStyle, position]}
            pointerEvents="box-none"
        >
            <TouchableWithoutFeedback onPress={this.props.hideOnPress ? this._hide : null}>
                <Animated.View
                    style={[
                        styles.containerStyle, 
                        this.props.containerStyle, 
                        this.props.backgroundColor && {backgroundColor: this.props.backgroundColor},
                        {opacity: this.state.opacity},
                        this.props.shadow && styles.shadowStyle,
                        this.props.shadowColor && {shadowColor: this.props.shadowColor} 
                    ]}

                    pointerEvents="none"
                    ref={ele => this._root = ele}
                >
                    <Text style={[
                        styles.textStyle,
                        this.props.textStyle,
                        this.props.textColor && {color: this.props.textColor}
                    ]}>
                        {this.props.children}
                    </Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>) : null
    }
}

export default ToastContainer