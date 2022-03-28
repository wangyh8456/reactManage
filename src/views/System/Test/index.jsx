import React from 'react'
import { useParams, useLocation } from "react-router-dom";
import qs from 'querystring'

export default React.memo(function Test() {
    const params=useParams()['*'].split('/');
    const location=useLocation();
    const {id,title}=qs.parse(decodeURI(location.search.slice(1)));
    const state=location.state;
    return (
        <div>
            {params.length>1?<h3>接收到的params为：{'id:'+params[0]+'   title:'+params[1]}</h3>:''}
            {id?<h3>接收到的search为：{'id:'+id+'   title:'+title}</h3>:''}
            {state?<h3>接收到的state为： {'id:'+state.id+'   title:'+state.title}</h3>:''}
        </div>
    )
})
