import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const Signin = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const PostData = () => {
    if (
      !/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
        email
      )
    ) {
      M.toast({
        html: 'Invalid email',
        classes: '#e53935 red darken-1',
      });
      return;
    }
    fetch('/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({
            html: data.error,
            classes: '#e53935 red darken-1',
          });
        } else {
          localStorage.setItem('jwt', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          M.toast({
            html: 'SignedIn Successfully',
            classes: '#1de9b6 teal accent-3',
          });
          history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className='mycard'>
      <div className='card auth-card input-field'>
        <h2> SearchingYard </h2>;{' '}
        <input
          type='text'
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />{' '}
        <input
          type='text'
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className='btn waves-effect waves-light #64b5f6 blue lighten-2'
          onClick={() => PostData()}
        >
          Signin
        </button>{' '}
        <h5>
          <Link to='/signup'> Don't have an account?</Link>
        </h5>{' '}
      </div>{' '}
    </div>
  );
};

export default Signin;
