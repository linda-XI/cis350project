/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import Modal from 'react-modal';
import 'react-dropdown/style.css';
import tagsList from '../data/tags.json';

import '../assets/App.css';
import '../assets/Registration.css';

const UserDB = require('../modules/UserDB');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#FFD9A0',
  },
};
function Registration() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  // final phone input with area code
  const finalPhone = React.useRef('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('1');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validFirstName, setValidFirstName] = useState(false);
  const [validLastName, setValidLastName] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validReqs, setValidReqs] = useState(false);
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [tags, setTags] = useState([]);
  const options = [
    '1', '44', '1684',
  ];
  const [areaCode, setAreaCode] = useState(options[0].value);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
    navigate('/login');
  };

  const showModal = () => {
    setIsOpen(true);
  };

  function addTags(tag) {
    if (tags.includes(tag)) {
      const newList = tags.filter((item) => item !== tag);
      setTags(newList);
    } else {
      setTags((arr) => [...arr, tag]);
    }
  }
  useEffect(() => {
    const allTags = tagsList.map((tag) => tag.label);
    allTags.forEach((tag) => { document.getElementById(tag).className = 'tag'; });
    tags.forEach((tag) => { document.getElementById(tag).className = 'tag_selected'; });
  }, [tags]);

  // register the user given the information provided
  // if the password and confimPassword are not correct, then throw an exception
  const registerUser = async () => {
    if (password !== confirmPassword) {
      throw new Error('password and confirmPassword need to be the same');
    }
    await UserDB.createUser(
      countryCode,
      phone,
      email,
      password,
      firstName,
      lastName,
      tags,
      (success, id, err) => {
        if (success) {
          showModal();
        } else {
          //
        }
      },
    );
  };

  const firstNameValidation = () => {
    const alpha = /^([a-zA-Z]){2,15}$/;
    if (firstName) {
      if (firstName.match(alpha)) {
        setValidFirstName(true);
      } else {
        setValidFirstName(false);
      }
    }
  };

  const LastNameValidation = () => {
    const alpha = /^([a-zA-Z]){2,15}$/;

    if (lastName) {
      if (lastName.match(alpha)) {
        setValidLastName(true);
      } else {
        setValidLastName(false);
      }
    }
  };

  const phoneValidation = () => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/im;

    if (phone) {
      if (phone.match(phoneRegex)) {
        setValidPhone(true);
        finalPhone.current = areaCode + phone;
      } else {
        setValidPhone(false);
      }
    }
  };

  const emailValidation = () => {
    const emailRegex = /\S+@\S+\.\S+/;

    if (email) {
      if (email.match(emailRegex)) {
        setValidEmail(true);
      } else {
        setValidEmail(false);
      }
    }
  };

  const passwordValidation = () => {
    const pwRule = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;

    if (password) {
      if (password.match(pwRule)) {
        setValidPassword(true);
      } else {
        setValidPassword(false);
      }
    }
  };

  const confirmPasswordValidation = () => {
    if (password && password === confirmPassword) {
      setValidConfirmPassword(true);
    } else {
      setValidConfirmPassword(false);
    }
  };

  const allReqs = () => {
    if (validFirstName && validLastName && validConfirmPassword && validEmail && validPhone
      && tags.length > 0) {
      setValidReqs(true);
    } else {
      setValidReqs(false);
    }
  };

  useEffect(() => {
    firstNameValidation();
    LastNameValidation();
    passwordValidation();
    confirmPasswordValidation();
    phoneValidation();
    emailValidation();
    allReqs();
  });

  return (
    <div className="registration-page">
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          <div className="modalContent">
            <h2>Resgistration Successfully!</h2>
            <button className="modalButton" type="button" onClick={closeModal}>Go to Login</button>
          </div>
        </Modal>
      </div>

      <div className="registration">
        <div className="registration-tags">
          <div className="headers">
            <h1>Unite and Conquer</h1>
            <h3>Choose your interests</h3>
          </div>
          <div className="tags">
            {tagsList.map((tag) => (
              <button
                type="button"
                key={tag.label}
                className="tag"
                onClick={() => addTags(tag.label)}
                id={tag.label}
              >
                {tag.label}

              </button>
            ))}
          </div>
        </div>
        <div className="registration-input">
          <h3>Get Started</h3>
          <div className="input-reqs">
            <div>
              <h2>Password Requires</h2>
              <div className="rule">1. at least 8 characters</div>
              <div className="rule">2. at least one special character (e.g. ! @ # ? ])</div>
              <div className="rule">3. at least one uppercase and one lowercase letter</div>
              <div className="rule">4. at least one number</div>
            </div>
            <div>
              <h2>First/Last Name Requires</h2>
              <div className="rule">1. 2-15 characters</div>
              <div className="rule">2. Alphabetic characters</div>
            </div>
          </div>
          <div className="registration-text-fields">
            <div className="registration-field">
              <div className="label">first name</div>
              <input data-testid="first-name-input" className="first-name-input" onChange={(e) => setFirstName(e.target.value)} />
              {validFirstName ? <i className="fas fa-check" /> : <i className="fas fa-times" />}
            </div>
            <div className="registration-field">
              <div className="label">last name</div>
              <input data-testid="last-name-input" className="last-name-input" onChange={(e) => setLastName(e.target.value)} />
              {validLastName ? <i className="fas fa-check" /> : <i className="fas fa-times" />}
            </div>
            <div className="registration-field">
              <div className="label">phone</div>
              <div className="full-phone-input">

                <Dropdown className="area-code" options={options} value={countryCode} onChange={(value) => setCountryCode(value.value)} placeholder="Select an option" />
                <input data-testid="phone-input" className="phone-input" onChange={(e) => setPhone(e.target.value)} />
              </div>
              {validPhone ? <i className="fas fa-check" /> : <i className="fas fa-times" />}
            </div>
            <div className="registration-field">
              <div className="label">email</div>
              <input data-testid="email-input" className="email-input" onChange={(e) => setEmail(e.target.value)} />
              {validEmail ? <i className="fas fa-check" /> : <i className="fas fa-times" />}
            </div>
            <div className="registration-field">
              <div className="label">password</div>
              <input data-testid="password-input" type="password" className="password-input" onChange={(e) => setPassword(e.target.value)} />
              {validPassword ? <i className="fas fa-check" /> : <i className="fas fa-times" />}
            </div>
            <div className="registration-field">
              <div className="label">confirm password</div>
              <input data-testid="confirm-password-input" type="password" className="confirm-password-input" onChange={(e) => setConfirmPassword(e.target.value)} />
              {validConfirmPassword ? <i className="fas fa-check" /> : <i className="fas fa-times" />}
            </div>
          </div>
          <h3>Tags</h3>
          <div data-testid="tags-list" className="selectedTags">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag.label}
                className="tag-selected"
              >
                {tag}
              </button>
            ))}
          </div>
          <br />
          <div className="reg-bottom">
            <button disabled={!validReqs} className="submit" type="button" onClick={registerUser}>
              Register
            </button>
            <p>
              Already have an account?
              {' '}
              <Link to="/login">Login</Link>
              {' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
