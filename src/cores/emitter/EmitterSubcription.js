/**
 * @flow
 */

'use strict'

import EventSubscription from './EventSubscription'

import type EventEmitter from './EventEmitter'
import type EventSubscriptionVendor from './EventSubscriptionVendor'

class EmitterSubscription extends EventSubscription {
    emitter: EventEmitter
    listener: Function
    context: ?Object

    constructor(emitter: EventEmitter, subscriber: EventSubscriptionVendor, listener: Function, context: ?Object) {
        super(subscriber)
        this.emitter = emitter
        this.listener = listener
        this.context = context
    }

    /**
     * Removes this subscription from the emitter that registered it
     * Note: We're overrideing the `remove()` method of EventSubscription here
     * but deliberately not calling `super.remove()` as the responsibility
     * for removing the subscription lies with the EventEmitter
     */
    remove() {
        this.emitter.removeSubscription(this)
    }
}

export default EmitterSubscription