import {useState} from 'react'
import axios from 'axios'
import jwt from 'jsonwebtoken'
// similar to the link but it clicks it for the user
import { Redirect } from 'react-router-dom'
import Profile from './Profile'

export default function Login(props) {
    // state for the controlled form
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // state for flash messages from the server (backend)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        try{
            e.preventDefault()
            // console.log('do axios call')
            // post to the backend with axios
            // you need to supply the req body has the second argument
            const requestBody= {
                // first email is req.body.email and second email is the email from our state. Same for password
                // also could write it as email, password similar to ejs
                email: email,
                password:password
            }
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/login`, requestBody)

            console.log(response)
            //  use object destructing to pull out the token from the response.data
            const {token} = response.data

            // save the response(jwt token) to localStorage
            // first arg what you want to name it and then what you want to set it as  
            // to check this go to f12 and go to applications tab and click local storage and you should see jwt
            localStorage.setItem('jwtToken', token)

            // decode the jwt token before we put it in state
            // takes in one argument just the token you want to decode. Does not include the secret
            const decoded = jwt.decode(token)

            // set the user in app.js's state
            // setCurrentUser is from the setstate that you passed in  login route from the app.js page
           props.setCurrentUser(decoded)
        } catch(err) {
            if(err.response.status == 400){
                setMessage(err.response.data.msg)
            } else {
                console.log(err)
            }
        }
    }
    // once you setCurrentUser it will hit this and be redirected automatically and won't hit the return below. 
    // remember that we set currentUser as a truthy or falsey value 
    console.log('the current user is:', props.currentUser)
    if(props.currentUser) return <Redirect to='/profile' component={Profile} currentUser={props.currentUser} />


    return(
        <div>
            <h3>Login to your account</h3> 
        
        {/* error message display if credientials are wrong */}
            <p>{message}</p>

            <form onSubmit={handleSubmit}>
                <label htmlFor={'email-input'}>email:</label>

                <input 
                    id='email-input'
                    type='email'
                    placeholder='user@domain.com'
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                />

                <label htmlFor={'password-input'}>password</label>

                <input 
                    id='password-input'
                    type='password'
                    placeholder='password'
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                />

                <input 
                    type='submit'
                    value='login'
                />
            </form>
        </div>
    )
}