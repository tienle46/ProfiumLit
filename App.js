//@flow
import React, {Component} from 'react'
import { View, StyleSheet, YellowBox } from 'react-native';
import AppRoute from './src/routes/AppRoute'
import Router from "./src/routes/Router";
import RouteNames from "./src/routes/RouteNames";
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

type NavigationStateType = {
    index: number,
    routes: Array<{routeName: string, key: string, params?: {}}>
};

export default class App extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <AppRoute
                ref={navigatorRef => {
                    Router.setNavigation(navigatorRef);
                }}
                
                onNavigationStateChange={(prevState: NavigationStateType, currentState: NavigationStateType) => {
                    let prevScreen = Router.getRouteName(prevState);
                    let currentScreen = Router.getRouteName(currentState);
                    Router.currentScreen = currentScreen;
                    Router.prevScreen = prevScreen;
                }}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})