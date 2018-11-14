/**
 * @flow
 */

import EmitterSubscription from './EmitterSubscription'
import EventSubscriptionVendor from './EventSubscriptionVendor'

import invariant from '../../helpers/invariant'

export default class EventEmitter {

    _subscriber: EventSubscriptionVendor
    _currentSubscription: ?EmitterSubscription

    /**
     * Creates an instance of EventEmitter.
     * @param {EventSubscriptionVendor} subscriber - Optional subscriber instance to use. If omitted, a new subscriber 
     * will be created for the emitter
     */
    constructor(subscriber: ?EventSubscriptionVendor) {
        this._subscriber = subscriber || new EventSubscriptionVendor()
    }

    /**
     * Adds a listener to be invoked when events of the specified type are emitted.
     * An optional calling context may be provided. The data arguments emitted
     * will be passed to the listener function.
     * 
     * @param {string} eventType - Name of the event to listen to
     * @param {Function} listener - Function to invoke when specified event is emitted
     * @param {*} context - Optional context object to use when invoking the
     * @returns {EmitterSubscription} 
     */
    addListener(eventType: string, listener: Function, context: ?Object): EmitterSubscription {
        return (this._subscriber.addSubscription(
            eventType,
            new EmitterSubscription(this, this._subscriber, listener, context)
        ): any)
    }

    /**
     * Similar to addListener, except that the listener is removed after it is
     * invoked once.
     * 
     * @param {string} eventType - Name of the event to listen to
     * @param {function} listener - Function to invoke only once when the
     *   specified event is emitted
     * @param {*} context - Optional context object to use when invoking the
     * @memberof EventEmitter
     */
    once(eventType: string, listener: Function, context: ?Object): EmitterSubscription {
        return this.addListener(eventType, (...args) => {
            this.removeCurrentListener()
            listener.apply(context, args)
        })
    }

    /**
     * Removes all of the registered listeners, including those registered as
     * listener maps.
     *
     * @param {?string} eventType - Optional name of the event whose registered
     *   listeners to remove
     */
    removeAllListeners(eventType: ?string) {
        this._subscriber.removeAllSubscriptions(eventType)
    }

    removeCurrentListener() {
        invariant(
            !!this._currentSubscription,
            'Not in an emitting cycle; there is no current subscription'
        )

        this.removeSubscription(this._currentSubscription)
    }

    /**
     * Removes a specific subscription. Called by the `remove()` method of the 
     * subscription itself to ensure any necessary cleanup is perfomed
     * 
     * @param {EmitterSubscription} subscription 
     */
    removeSubscription(subscription: EmitterSubscription) {
        invariant(
            subscription.emitter === this,
            'Subscription does not belong to this emitter'
        )
        this._subscriber.removeSubscription(subscription)
    }

    
    /**
     * Returns an array of listeners that are currently registered for the given
     * event.
     *
     * @param {string} eventType - Name of the event to query
     * @returns {array}
     */
    listeners(eventType: string): [EmitterSubscription] {
        const subscriptions: ?[EmitterSubscription] = (this._subscriber.getSubscriptionsForType(eventType): any)
        return subscriptions ?
            subscriptions.filter(() => true).map(subscription => subscription.listener): []
    }

    /**
     * Emits an event of the given type with the given data. All handlers of that
     * particular type will be notified
     * 
     * @param {string} eventType - Name of the event to emit
     * @param {...*} . - arguments to be passed to each registered listener
     * 
     * @example
     *  emitter.addListener('someEvent', function(message) => {
     *      console.log(message)
     *  })
     * 
     *  emitter.emit('someEvent', 'abc') // > logs 'abc'
     * @memberof EventEmitter
     */
    emit(eventType: string, ...data: any) {
        const subscriptions: ?[EmitterSubscription] = (this._subscriber.getSubscriptionsForType(eventType): any)
        if(subscriptions) {
            for(let i = 0; i < subscriptions.length; i++) {
                const subscription = subscriptions[i]

                // the subscription may have been removed during this event loop
                if(subscription) {
                    this._currentSubscription = subscription

                    subscription.listener.apply(
                        subscription.context,
                        [...data]
                    )
                }
            }

            this._currentSubscription = null;
        }
    }

    /**
     * Removes the given listener for event of specific type
     * 
     * @param {string} eventType - Name of the event to emit
     * @param {function} listener - Function to invoke when the specified event is emitted
     * 
     * @example
     *  emitter.removeListener('someEvent', (message) => console.log(message)) // removes the listener if already registered
     */
    removeListener(eventType: string, listener) {
        const subscriptions: ?[EmitterSubscription] = (this._subscriber.getSubscriptionsForType(eventType): any)

        if(subscriptions) {
            for(let i = 0; i < subscriptions.length; i++) {
                const subscription = subscriptions[i]

                // The subscription may have been removed during this event loop
                // its listener matches the listener in the method parameters
                if(subscription && subscription.listener === listener) {
                    subscription.remove()
                }
            }
        }
    }

    // Aliases
    on(eventType: string, listener: Function, context: ?Object) {
        // console.warn('on<<', eventType)
        this.addListener(eventType, listener, context)
    }
    
    off(eventType: string): boolean {
        this.removeListener(eventType)
    }
}