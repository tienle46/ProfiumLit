/**
 * Injector adds sibling elements after app root element.
 * The created component are above the rest of app element
 * 
 * NOTE: This class can be add before the root app element registered by AppRegistry.registryComponent
 * via AppRegistryInjector
 * 
 * Usage:
 * > Create sibling element
 *  const element = new Injector(<React.Element/>, callback?: Function)
 *  -> above line will create a React.Element Component and cover all the root app, and returns a sibling element
 * > Update element
 *  element.update(<New React.Element/>)
 *  -> update `React.Element` component by `New React.Element`
 * > Destroy element
 *  -> simply call: element.destroy() 
 */
import React, { cloneElement } from 'react'
import { StyleSheet } from 'react-native'

import emitter from './AppRegistryInjection'
import Events from '../Events'
    
const styles = StyleSheet.create({
    offStream: {
        position: 'absolute'
    }
})

let uid = 0

export default class Injector {
    _id = null
    
    constructor(element, callback) {
        Object.defineProperty(this, '_id', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: uid++
        })

        this.update(element, callback)
    }

    update(element, callback) {
        emitter.emit(Events.ON_INJECTOR_UPDATES, this._id, this._offStreamElement(element), callback)
    }

    _offStreamElement(element) {
        return cloneElement(element, {
            style: [element.props.style, styles.offStream]
        })
    }

    destroy(callback) {
        emitter.emit(Events.ON_INJECTOR_UPDATES, this._id, null, callback)
    }
}