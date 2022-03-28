import React from 'react'
import {Link} from 'react-router-dom'

export default function Auth() {
    return (
        <div>
            {/* params传参 */}
            <Link to={`/system/test/${1}/${'params传值'}`}>params传参</Link> 
            <br/>
            {/* search传参 */}
            <Link replace={true} to={`/system/test/?id=${2}&title=${'search传值'}`}>search传参</Link>
            <br/>
            {/* state传参 */}
            <Link to={`/system/test`} state={{id:3,title:'state传值'}}>state传参</Link>
        </div>
    )
}
