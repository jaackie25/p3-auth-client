import './App.css';
import Login from './components/Login'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import Register from './components/Register'
import Welcome from './components/Welcome'


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import {
  useState,
  useEffect
} from 'react'

import jwt from 'jsonwebtoken'

function App() {
  // state that holds the user data if the user is logged in -- place at the highest level bc many components need it 
  const [currentUser, setCurrentUser] = useState(null)
  
  // if the user navigates away from site automatically log them in (if the jwt is valid)
  useEffect(() =>{
    // get the token from local storage
    const token = localStorage.getItem('jwtToken')
    // if -- check for token 
    if(token){
      setCurrentUser(jwt.decode(token))
    } else {
      // else set user in state to be null 
      setCurrentUser(null)
    }
  },[])
  // function to log the user out 
  const handleLogout = () => {
    // delete the jwt thats in local storage
    if(localStorage.getItem('jwtToken')){
      localStorage.removeItem('jwtToken')
       // set the user in state to be null 
       setCurrentUser(null)
    }
  }
  
  return (
    <Router>
      <header>
        <Navbar  currentUser={currentUser} handleLogout={handleLogout}/>
      </header>

      <div className="App">
        <Switch>
            <Route 
              exact path="/"
              component={Welcome}
            />

            <Route 
              path="/register"
              render={props => <Register {...props} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
            />

             <Route 
              path="/login"
              render={props => <Login {...props} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
            />

            {/* evnetually we will do a conditional render here if the person is not logged-- by using terinary statement */}
             <Route 
              path="/profile"
              render={props => currentUser ? <Profile {...props} currentUser={currentUser} handleLogout={handleLogout} /> : <Redirect to='/login' />}
            />
        </Switch>

      </div>

    </Router>
  
  );
}

export default App;
