//@flow
import React, {Component, Children} from 'react'
import {StyleSheet, View, AppRegistry} from 'react-native'
import EventEmitter from '../emitter/EventEmitter'
import Events from '../Events'

class StaticContainer extends Component {
    props: {
        shouldUpdate: boolean
    }

    shouldComponentUpdate(nextProps: Object) {
        return nextProps.shouldUpdate
    }

    render() {
        const {children} = this.props
        return (children === null || children == false) ? null : Children.only(children)
    }
}

// app injection
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    }
})

let emitter = AppRegistry.injectorEmitter

if(!emitter || !(emitter instanceof EventEmitter)) {
    emitter = new EventEmitter()

    // inject modals into app entry component
    const registerComponent = AppRegistry.registerComponent

    AppRegistry.registerComponent = function(appKey: string, getAppComponent: Function) {
        const siblings = new Map()
        const updates = new Set()

        return registerComponent(appKey, () => {
            const AppComponent = getAppComponent()
            
            return class extends Component {
                static displayName = `Root(${appKey})`

                componentWillMount() {
                    emitter.addListener(Events.ON_INJECTOR_UPDATES, this._update, this)
                }

                componentWillUnmount() {
                    siblings.clear()
                    updates.clear()
                }

                _update(id, element, callback) {
                    // console.log('_update', id, element, callback)
                    if(siblings.has(id) && !element) {
                        siblings.delete(id)
                    } else {
                        siblings.set(id, element)
                    }

                    updates.add(id)
                    this.forceUpdate(callback)
                }

                render() {
                    const elements = []
                    siblings.forEach((element, id) => {
                        elements.push(
                            <StaticContainer
                                key={`root-injector-${id}`}
                                shouldUpdate={updates.has(id)}
                            >
                                {element}
                            </StaticContainer>
                        )
                    })

                    updates.clear()

                    return (
                        <View style={styles.container}>
                            <StaticContainer shouldUpdate={false}>
                                <AppComponent {...this.props} />
                            </StaticContainer>
                            {elements}
                        </View>
                    )
                }
            }
        })
    }

    AppRegistry.injectorEmitter = emitter
}

export default emitter