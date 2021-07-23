import React, { useState } from 'react'
import Input from '../components/Input'

const UserSignupPage = ({
    actions = {
        postSignup: () => new Promise((resolve, reject) => {
            resolve({})
        })}
    }) => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [pendingApiCall, setPendingApiCall] = useState(false)
    const [errors, setErrors] = useState({})

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
        .catch(apiError => {
            let err = {...errors}
            if(apiError.response.data && apiError.response.data.validationErrors){
                err = {...apiError.response.data.validationErrors}
            }
            setPendingApiCall(false)
            setErrors(err)
        })
    }

    return(
        <div className="container">
            <h1 className="text-center">Sign Up</h1>
            <div className="col-12 mb-3">
                <Input 
                    label = "Display Name"
                    placeholder="Your display name"
                    value = {name}
                    onChange = {(input) => {setName(input.target.value)}}
                    hasError={errors.displayName && true}
                    error={errors.displayName}
                />
            </div>
            <div className="col-12 mb-3">
                <label>Username</label>
                <Input 
                    label = "Username"
                    placeholder="Your username" 
                    value = {username} 
                    onChange = {(input)=> {setUsername(input.target.value)}}
                />
            </div>
            <div>
                {errors.username}
            </div>
            <div className="col-12 mb-3">
                <label>Password</label>
                <Input 
                    label="Password"
                    placeholder="Your password" 
                    type="password" 
                    value = {password}
                    onChange = {(input)=> {setPassword(input.target.value)}}
                    hasError = {errors.password && true}
                    error = {errors.password}
                />
            </div>
            <div>
                {errors.password}
            </div>
            <div className="col-12 mb-3">
                <label>Password Repeat</label>
                <Input 
                    label="Password Repeat"
                    placeholder="Repeat Your password" 
                    type="password"
                    value = {passwordRepeat}
                    onChange = {(input)=> {setPasswordRepeat(input.target.value)}}
                    hasError={errors.passwordRepeat && true}
                    error = {errors.passwordRepeat}
                />
            </div>
            <div className = "text-center">
                <button 
                    className="btn btn-primary" 
                    onClick = {() => onClickSignup()} 
                    disabled={pendingApiCall}
                >
                    {pendingApiCall && (<div className="spinner-border text-light spinner-border-sm mr-sm-1">
                        <span className="sr-only">Loading</span>
                    </div>)}
                    Sign Up
                </button>
            </div>
        </div>
    )
}
    

export default UserSignupPage