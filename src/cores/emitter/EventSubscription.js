/**
 * @flow
 */
'use strict'

import type EventSubscriptionVendor from './EventSubscriptionVendor'

/**
 * EventSubscription represents a subscription to a particular event. It can
 * remove its own subscription
 * 
 * @class EventSubscription
 */
export default class EventSubscription {
    eventType: string
    key: number
    subscriber: EventSubscriptionVendor

    /**
     * Creates an instance of EventSubscription.
     * @param {EventSubscriptionVendor} subscriber the subscriber that controls this subscription
     */
    constructor(subscriber: EventSubscriptionVendor) {
        this.subscriber = subscriber
    }

    /**
     * Removes this subscription from the subscriber that controls it
     */
    remove() {
        this.subscriber.removeSubscription(this)
    }
}