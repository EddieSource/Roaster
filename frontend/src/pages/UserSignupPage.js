import React, { useState } from 'react'

const UserSignupPage = ({
    actions = {
        postSignup: () => new Promise((resolve, reject) => {
            resolve({})
        })}
    }) => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [cpassword, setCpassword] = useState('')
    const [pendingApiCall, setPendingApiCall] = useState(false)


    const onClickSignup = () => {
        const user = {
            // field is align with java
            username: username, 
            displayName: name, 
            password: password
        }
        setPendingApiCall(true)
        actions.postSignup(user).then((res) => {
            setPendingApiCall(false)
        })
        .catch(err => {
            setPendingApiCall(false)
        })
    }

    return(
        <div>
            <h1>Sign Up</h1>
            <div>
                <input placeholder="Your display name"
                value = {name}
                onChange = {(input) => {
                    setName(input.target.value)
                }}/>
            </div>
            <div>
                <input placeholder="Your username" 
                value = {username} 
                onChange = {(input)=> {
                    setUsername(input.target.value)
                }}/>
            </div>
            <div>
                <input placeholder="Your password" type="password" 
                value = {password}
                onChange = {(input)=> {
                    setPassword(input.target.value)
                }}/>
            </div>
            <div>
                <input placeholder="Repeat Your password" type="password"
                value = {cpassword}
                onChange = {(input)=> {
                    setCpassword(input.target.value)
                }}/>
            </div>
            <div>
                <button onClick = {() => onClickSignup()} disabled={pendingApiCall}>Sign Up</button>
            </div>
        </div>
    )
}
    

export default UserSignupPage