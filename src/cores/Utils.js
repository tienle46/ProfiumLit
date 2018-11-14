//@flow
import numeral from 'numeral'
import moment from 'moment'

export function getVariable(obj: {}, key: string, defaultValue: any): any {
    if (obj && obj.variables && obj.variables.hasOwnProperty(key)) {
        let value = obj.variables[key].value;

        if (value != null && value != undefined) {
            return value;
        }
    }

    return defaultValue;
}

export function convertIntoKorM(value: number): string {
    return value >= 1000000 ? Math.floor(value/1000000)+'M' : this.numberFormat(value)
}

export function numberFormat(value: number = 0, format?: string = '0,0'): string {
    return numeral(value).format(format);
}

export function upperCaseFirstLetter(text: string): string {
    return text.trim().toLowerCase().split(" ").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
}

export function timeFormat(time: string | Object, defaultFormat?: string = 'DD-MM-YYYY HH:mm:ss', expectedFormat?: string = 'DD-MM-YYYY HH:mm'): string {
    return moment(time, defaultFormat).format(expectedFormat);
}

export function isNull(val: any): boolean {
    return isCorrectType("Null", val) || isCorrectType("Undefined", val)
}

export function isEmpty(str: string): boolean {
    return !str || (Utils.isString(str) && str.trim().length == 0);
}

export function isEmptyArray(arr: Array<any>): boolean {
    return !arr || arr.length == 0;
}

export function isArray(value: any) {
    return isCorrectType("Array", value);
}

export function isNumber(value: any): boolean {
    return isCorrectType("Number", value) && !isNaN(value);
}

export function isFunction(value: any): boolean {
    return isCorrectType('Function'. value);
}

export function isBoolean(value: any): boolean {
    return isCorrectType('Boolean', value);
}

export function isString(value: any): boolean {
    return isCorrectType('String', value);
}

export function isObject(value: any): boolean {
    return isCorrectType('Object', value);
}

export function getValue(mapObj, key, defaultValue) {
    if (mapObj && mapObj.hasOwnProperty(key)) {
        return mapObj[key];
    }
    return defaultValue;
}

export function isCorrectType(expected: string, actual: any): boolean {
    return Object.prototype.toString.call(actual).slice(8, -1) === expected;
}

export function getAllKeys(...args): Array {
    return args.map(arg => this.isObject(arg) ? Object.keys(arg) : []).reduce((keys, keyArr) => { return [...keys, ...keyArr] }, []);
}

export function generateCaptcha(): string {
    return Math.random().toString(36).slice(2, 6);
}

export default {
    getVariable,
    convertIntoKorM,
    numberFormat,
    upperCaseFirstLetter,
    timeFormat,
    isNull,
    isEmpty,
    isEmptyArray,
    isArray,
    isNumber,
    isFunction,
    isBoolean,
    isString,
    isObject,
    getValue,
    isCorrectType,
    getAllKeys,
    generateCaptcha,
}