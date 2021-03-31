

import '../../styles/componentStyles/login.scss'

import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

import { loginPopUp } from '../../helpers/popUps.js' //* handles the pop-up


const Login = () => {
  const history = useHistory()
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  })

  const [ wasLoginSuccess, setWasLoginSuccess ] = useState(null)
  console.log('🐝 ~ file: Login.js ~ line 15 ~ wasLoginSuccess', wasLoginSuccess)

  const handleChange = (event) => {
    //?get the value of what's being typed in the form and updating state
    const newFormData = { ...formData, [event.target.name]: event.target.value }
    console.log('🐝 ~ file: Login.js ~ line 14 ~ event', event)
    setFormData(newFormData)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // if()
    try {
      const response = await axios.post('api/login', formData)
      console.log('🐝 ~ file: Login.js ~ line 26 ~ response', response.data.message)
      setWasLoginSuccess(true)
      loginPopUp(true)
      window.localStorage.setItem('token',response.data.token)
      console.log('🐝 ~ file: Login.js ~ line 26 ~ response', response)
      history.push('/doodle-new') 
    } catch (err) {
      console.log('🐝 ~ file: Login.js ~ line 33 ~ err', err.response)
      setWasLoginSuccess(false)
      loginPopUp(false)
    }
  }

  return (
    <div className="main">
      {/* <section className="section"> */}
      {/* <div className="container"> */}
      {/* <div className="columns"> */}

      <form onSubmit={handleSubmit}className="box column is-half is-offset-one-quarter">
        <legend className='has-text-centered'> <h1>Login </h1></legend>
        <div className="field">
          <label className="label">Username or Email</label>
          <div className="control">
            <input
              className="input"
              placeholder="Username or email"
              name="usernameOrEmail"
              onChange={handleChange}
              value={formData.usernameOrEmail}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              className="input"
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              //value={formData.password}
            />
          </div>
        </div>
        <div className="field">
          <button className="button is-block is-info is-large is-fullwidth">Login</button><br />
        </div>
      </form>
      {/* </div> */}
      {/* </div> */}
      {/* </section> */}
    </div>
  )
}
export default Login
