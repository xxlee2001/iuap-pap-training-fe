/**
 * 前端路由说明：
 * 1、基于浏览器 History 的前端 Hash 路由
 * 2、按业务模块和具体页面功能划分路由
 */
import React, { Component } from "react";
import { Route } from "mirrorx";
import {ConnectedBasic} from "../container";

export default class App extends Component {
    render(){
        return (
            <div className="route-content">
                <Route exact path={'/'} component={ConnectedBasic}/>
            </div>
        )
    }
}

