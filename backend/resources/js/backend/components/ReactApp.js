import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import Routing from "./Routing";


import {Layout} from 'antd';

const {Content} = Layout;


import './App.css';

export default function ReactApp() {

    return (
        <BrowserRouter>
            <Layout>
                <Content>
                    <Routing/>
                </Content>
            </Layout>
        </BrowserRouter>
    );
}

// DOM element
if (document.getElementById('root')) {
    ReactDOM.render(<ReactApp/>, document.getElementById('root'));
}
