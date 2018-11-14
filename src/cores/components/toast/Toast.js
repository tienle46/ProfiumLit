//@flow
import React, {Component} from 'react'
import {View} from 'react-native'
import Injector from '../../injector/Injector'
import ToastContainer, {positions, durations} from './ToastContainer'

class Toast extends Component {
    static displayName = 'Toast'
    static propTypes = ToastContainer.propTypes
    static positions = positions
    static durations = durations

    _toast = null
    
    static show = (message: string, options = {position: positions.BOTTOM, duration: durations.SHORT}): Injector => {
        const toast = new Injector(<ToastContainer
            {...options}
            visible={true}
            onHidden={() => Toast.hide(toast)}
        >
            {message}
        </ToastContainer>)
        return toast
    }

    static hide = (toast: Injector) => {
        if(toast instanceof Injector) {
            toast.destroy()
        } else {
            console.warn(`Toast.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof toast}\` instead.`);
        }
    }

    componentWillMount = () => {
        this._toast = new Injector(<ToastContainer
            {...this.props}
            duration={0}
        />)
    }

    componentWillReceiveProps = (nextProps) => {
        this._toast.update(<ToastContainer
            {...nextProps}
            duration={0}
        />)
    }

    componentWillUnmount = () => {
        this._toast.destroy()
    }

    render() {
        return null
    }
}

export {
    Injector,
    positions,
    durations
}

export default Toast
