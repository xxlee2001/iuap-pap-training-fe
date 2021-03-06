/**
 * 整个应用的入口，包含路由，数据管理加载
 */

import React from "react";
import 'core-js/es6/map';
import 'core-js/es6/set';
import logger from "redux-logger";
import mirror, {render, Router} from "mirrorx";
import Intl from 'components/Intl/index.js';

import Routes from './routes'

import '../../../node_modules/tinper-bee/assets/theme/tinper-bee-indigo.css';
import "src/app.less";


const MiddlewareConfig = [];

if (__MODE__ == "development") MiddlewareConfig.push(logger);

mirror.defaults({
    historyMode: "hash",
    middlewares: MiddlewareConfig
});


render(<Intl><Router>
    <Routes/>
</Router></Intl>, document.querySelector("#app"));
