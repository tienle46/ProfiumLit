//@flow
/**
 * Tracker.js
 * It works with Navigator, as a service, to track screen, current route and dispatch actions from this service 
 */
import type { NavigationParams, NavigationRoute } from 'react-navigation';
import {NavigationActions, StackActions } from 'react-navigation'

type NavigationStateType = {
    index: number,
    routes: Array<{routeName: string, key: string, params?: NavigationParams}>
};

export default class Tracker {
    currentScreen: string = ""
    prevScreen: string = ""

    _navigation

    setNavigation(navigation: {}): void {
        this._navigation = navigation
    }

    reset(routeName: string, params?: NavigationParams) {
        if(!this._navigation) {
            return
        }
        this._navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        type: 'Navigation/NAVIGATE',
                        routeName,
                        params,
                    }),
                ],
            }),
        );
    }

    navigate(routeName: string, params?: NavigationParams) {
        if(!this._navigation) {
            return
        }
        this._navigation.dispatch(
            NavigationActions.navigate({
                type: 'Navigation/NAVIGATE',
                routeName,
                params
            })
        )
    }

    navigateDeep(actions: { routeName: string, params?: NavigationParams }[]) {
        if(!this._navigation) {
            return
        }
        this._navigation.dispatch(
            actions.reduceRight(
                (prevAction, action): any => NavigationActions.navigate({
                    type: 'Navigation/NAVIGATE',
                    routeName: action.routeName,
                    params: action.params,
                    action: prevAction,
                }),
                undefined
            )
        );
    }

    getRouteName(navigationState: NavigationStateType): string | null {
        if(!navigationState)
            return null
        
        const route = navigationState.routes[navigationState.index]

        if(route.routes)
            return this.getRouteName(route)
        
        return route.routeName
    }

    getCurrentRoute(): NavigationRoute | null {
        if (!this._navigation || !this._navigation.state.nav) {
          return null;
        }
      
        return this._navigation.state.nav.routes[_container.state.nav.index] || null;
    }
}