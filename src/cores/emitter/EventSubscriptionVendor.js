/**
 * @flow
 */
'use strict'

import invariant from '../../helpers/invariant'

import type EventSubscription from './EventSubscription'

/**
 * EvenSubscriptionVendor stores a set of EventSubscriptions that are
 * subscribed to a particular event type
 */

class EventSubscriptionVendor {
    _subscriptionsForType: Object
    _currentSubscription: ?EventSubscription

    constructor() {
        this._subscriptionsForType = {}
        this._currentSubscription = null
    }

    /**
     * Adds a subscription keyed by an event type
     * 
     * @param {string} eventType
     * @param {EventSubscription} subscription
     * @return {EventSubscription}
     */
    addSubscription(eventType: string, subscription: EventSubscription): EventSubscription {
        invariant(subscription.subscriber === this, 'The subscriber of the subscription is incorrectly set.')

        if(!this._subscriptionsForType[eventType]) {
            this._subscriptionsForType[eventType] = []
        }

        const key = this._subscriptionsForType[eventType].length
        this._subscriptionsForType[eventType].push(subscription)

        subscription.eventType = eventType
        subscription.key = key

        return subscription
    }

    /**
     * Removes a bulk set of the subscriptions
     * 
     * @param {?string} eventType - Optional name of the event type whose
     *      registered subscriptions to remove, if null remove all subscriptions
     */
    removeAllSubscriptions(eventType: ?string) {
        if(eventType === undefined) {
            this._subscriptionsForType = {}
        } else {
            delete this._subscriptionsForType[eventType]
        }
    }

    /**
     * Removes a specific subscription. Instead of calling this function, call 
     * `subscription.remove()` directly
     * 
     * @param {Object} subscription 
     * @memberof EventSubscriptionVendor
     */
    removeSubscription(subscription: Object) {
        const eventType = subscription.eventType
        const key = subscription.key

        const subscriptionsForType = this._subscriptionsForType[eventType]
        if(subscriptionsForType)
            delete subscriptionsForType[key]
    }

    /**
     * Returns the array of subscriptions that are currently registered for the given event type
     * 
     * Note: This array can be potentially sparse as subscriptions are deleted from it when they are removed
     * 
     * 
     * @param {string} eventType 
     * @returns null 
     * @memberof EventSubscriptionVendor
     */
    getSubscriptionsForType(eventType: string): ?[EventSubscription] {
        return this._subscriptionsForType[eventType]
    }
}

export default EventSubscriptionVendor