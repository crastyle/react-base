'use strict'
import React from 'react'
import reactDOM from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import Index from './Index/template'
import News from './News/template'
//@import


reactDOM.render((
    <Router history={hashHistory}>
        <Route path='/' component={Index} />
        <Route path='/News' component={News} />
    //@register
    </Router>
), document.getElementById('root'))