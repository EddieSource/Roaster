import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import UserSignUpPage from './UserSignupPage'
import UserSignupPage from './UserSignupPage'

beforeEach(cleanup)

describe("UserSignupPage", () => {
    describe('Layout', () => {
        it('has header of Sign up', () => {
            const { container } = render(<UserSignUpPage />)
            const header = container.querySelector('h1') 
            expect(header).toHaveTextContent('Sign Up')
        })
        it('has input for display name', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />)
            const displayNameInput = queryByPlaceholderText('Your display name')
            expect(displayNameInput).toBeInTheDocument()
        })
        
    })

    describe('Interactions', () => {
        const changeEvent = (content)  => {
            return {
                target: {
                    value: content
                }
            }
        }
        it('sets the displayName value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />)
            const displayNameInput = queryByPlaceholderText('Your display name')
            console.log('success')
            fireEvent.change(displayNameInput, changeEvent('my-display-name')); 
            expect(displayNameInput).toHaveValue('my-display-name')
        })
        it('sets the username value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />)
            const usernameInput = queryByPlaceholderText('Your password')
            console.log('success')
            fireEvent.change(usernameInput, changeEvent('my-username')); 
            expect(usernameInput).toHaveValue('my-username')
        })
        it('sets the password value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />)
            const passwordInput = queryByPlaceholderText('Your display name')
            console.log('success')
            fireEvent.change(passwordInput, changeEvent('my-password')); 
            expect(passwordInput).toHaveValue('my-password')
        })
        it('sets the cpassword value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />)
            const cpasswordInput = queryByPlaceholderText('Repeat Your password')
            console.log('success')
            fireEvent.change(cpasswordInput, changeEvent('my-password')); 
            expect(cpasswordInput).toHaveValue('my-password')
        })
        it('calls postSignup when the fields are valid and the actions are provided in props', () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            }
            const { container, queryByPlaceholderText } = render(
                <UserSignupPage actions = {actions}/>
            )

            const displayNameInput = queryByPlaceholderText('Your display name')
            const usernameInput = queryByPlaceholderText('Your username')
            const passwordInput = queryByPlaceholderText('Your password')
            const passwordRepeat = queryByPlaceholderText('Repeat Your password')

            fireEvent.change(displayNameInput, changeEvent('test-name'))
            fireEvent.change(usernameInput, changeEvent('test-username'))
            fireEvent.change(passwordInput, changeEvent('test-password'))
            fireEvent.change(passwordRepeat, changeEvent('test-password'))

            const button = container.querySelector('button')
            fireEvent.click(button)
            expect(actions.postSignup).toHaveBeenCalledTimes(1)
        })
    })
})