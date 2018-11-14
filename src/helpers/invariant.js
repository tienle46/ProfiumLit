/**
 * @flow
 * 
 * use invariant() to assert state which your program assumes to be true.
 * 
 * Provide sprintf-style format (% only) and arguments to provide information about what broke and what
 * you were expecting
 */
'use strict'

var isDevelopement = true // development environment

var invariant = (condition: any, format?: string, ...args: Array<any>): void => {
    if(isDevelopement) {
        if(format === undefined) {
            throw new Error('invariant requires an error message argument')
        }
    }

    if(!condition) {
        let error

        if(format === undefined) {
            error = new Error('Minified exception occurred;')
        } else {
            let argIndex = 0
            error = new Error(
                format.replace(/%s/g, () => args[argIndex++])
            )

            error.name = 'Invariant Violantion'
        }

        throw error
    }
}

export default invariant