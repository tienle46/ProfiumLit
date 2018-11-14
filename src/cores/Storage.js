//@flow
/**
 * Add ability to save not only string but also other primitive data type to AsyncStorage
 * Usage:
 * 
 * + Create new object store under the key 'test'
 *  Storage.save('test', {testKey: 'Hello'}).then(res => console.log(res)) => // return: {testKey: 'Hello'}
 * 
 * + Update the object stored under the key 'test' -> Add a new property of 'testKey' to this object. 
 *  Storage.update('test', { testKey: 'Test Value' })
 * 
 * + Then get
 *  Storage.get('test').then(res => console.log(res)) => // return: {testKey: 'Test Value'}
 * 
 */

import merge from 'lodash.merge'
import {AsyncStorage} from 'react-native'

class SimpleStorage {
    /**
	 * Get one or more value for a key or array of keys from AsyncStorage
	 * @param {String|Array} key A key or array of keys
	 * @return {Promise}
	 */
    get(key: string | string[]): Promise<any> {
        if(!Array.isArray(key)) {
            return AsyncStorage.getItem(key).then((value: any): any => JSON.parse(value))
        } else {
            return AsyncStorage.multiGet(key).then((values: string[][]): any[] => values.map((value: string[]): any => JSON.parse(value[1])))
        }
    }

    /**
     * 
     * @param  {String|Array} key The key or an array of key/value pairs like [['key1', 'value1'], ['key2', object | array]]
	 * @param  {Any} value The value to save
     * @return {Promise}
     */
    save(key: string | mixed[], value?: any): Promise<any> {
        if(!Array.isArray(key)) {
            return AsyncStorage.setItem(key, JSON.stringify(value))
        } else {
            var pairs = key.map((pair: any[]): any[] => [pair[0], JSON.stringify(pair[1])])
            return AsyncStorage.multiSet(pairs)
        }
    }

    /**
	 * Updates the value in the store for a given key in AsyncStorage. 
     * If the value is a string it will be replaced. 
     * If the value is an object it will be deep merged.
     * 
	 * @param  {String} key The key
	 * @param  {String | Object} value The value to update with
	 * @return {Promise}
	 */
    update(key: string, value: any): Promise<any> {
        this.get(key).then(item => {
            value = typeof value === 'string' ? value : merge({}, item, value)
            return this.save(key, value)
        })
    }

    /**
	 * Delete the value for a given key in AsyncStorage.
	 * @param  {String|Array} key The key or an array of keys to be deleted
	 * @return {Promise}
	 */
	delete(key: string | string[]): Promise<any> {
        if(Array.isArray(key)) {
            return AsyncStorage.multiRemove(key)
        } else {
            return AsyncStorage.removeItem(key)
        }
    }

    /**
     * 
     * Get all keys in AsyncStorage.
     * @return {Promise} Promise resolves all the saved key in AsynStorage
     */
    keys(): Promise<string[]> {
        return AsyncStorage.getAllKeys()
    }

    /**
     * Push a value onto an array stored in AsyncStorage by key or create a new array in AsyncStorage for a key if it's not yet defined.
     * 
     * @param {String} key 
     * @param {Any} value 
     * @memberof SimpleStorage
     */
    push(key: string, value: any): Promise<any> {
        return this.get(key).then(currentValue => {
            if(currentValue === null)
                // create with a new [value]
                return this.save(key, [value])
            
            if(Array.isArray(currentValue))
                return this.save(key, [...currentValue, value])
            
            throw new Error(`Existing value for key "${key}" must be of type null or Array, received ${typeof currentValue}.`)
        })
    }
}

const storage = new SimpleStorage()

export default storage