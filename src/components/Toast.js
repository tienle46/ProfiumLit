/**
 * Usage:
 * Provided two different ways to manage a Toast
 * 
 * > Calling via API:
 *  + Toast.show(msg: string, options: object)
 *  + Toast.hide(toast: Injector)
 * 
 * Ex:
 *  import Toast, {positions, durations} from './components/Toast'
 * 
 *  const toast = Toast.show('Test message')
 *  
 *  // by defeault, the toast will be hidden after `duration` options,
 *  // we also manully hide this toast by using
 *  setTimeout(() => {
 *      Toast.hide(toast)
 *  }, 1000)
 * 
 * > Using as a Component
 * 
 * class ReactComponent extends Component {
 *  render() {
 *      return (
 *          <Toast>Test message</Toast>
 *      )
 *  }
 * }
 */

 /**
  * Toast's options: Toast contains every props of `View` Component, in addition:
    type ToastContainerPropsType = {
        ...ViewPropTypes,
        containerStyle: StyleSheet.Styles,
        duration: number,
        visible: boolean,
        position: number,
        animation: boolean,
        shadow: boolean,
        backgroundColor: string,
        opacity: number,
        shadowColor: string,
        textStyle: StyleSheet.Styles,
        delay: number,
        hideOnPress: boolean,
        onHide: Function,
        onHidden: Function,
        onShow: Function,
        onShown: Function
    }

    default: {
        visible: false,
        duration: durations.SHORT, // <- config variable, accessible by `import {durations}`
        animation: true,
        shadow: false,
        position: positions.BOTTOM, // <= same
        opacity: .8,
        delay: 0,
        hideOnPress: true
    }
  */
import Toast, {Injector, durations, positions} from '../cores/components/toast/Toast'

export {Injector, durations, positions}

export default Toast