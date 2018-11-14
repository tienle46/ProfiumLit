// ultility features, helpers ... about router need to placed here
import Tracker from '../cores/Tracker'

class Router extends Tracker{
    getParam(context, paramName: string , defaultValue: ?any = null) {
        const params = context.props.navigation.state.params;
        return params ? (paramName in params) ? params[paramName] : defaultValue : null
    }

    back(context) {
        if(!context) {
            return 
        }
            
        context.goBack(null);
    }
}

export default new Router();