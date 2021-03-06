/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup';
import { createTour } from './createTour';
import { updateSettings } from './updateSettings';
import { sellerOnboard, getDashboardLink, bookTour } from './stripe';

//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const createForm = document.querySelector('.form--create');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const becomeSeller = document.querySelector('.nav__el--seller');
const getDashboard = document.querySelector('.nav__el--dashboard');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

//DELEGATIONS
if (mapBox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  displayMap(locations);
}

if (becomeSeller)
  becomeSeller.addEventListener('click', e => {
    e.preventDefault();
    sellerOnboard();
  });

if (getDashboard) {
  console.log('its here!');
  getDashboard.addEventListener('click', e => {
    e.preventDefault();
    getDashboardLink();
    console.log('it was clicked!');
  });
}

if (loginForm) {
  console.log('this is working');
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log('but button was clicked!');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (createForm) {
  createForm.addEventListener('submit', e => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set('name', document.getElementById('name').value);
    myForm.set('duration', document.getElementById('duration').value);
    myForm.set('maxGroupSize', document.getElementById('maxGroupSize').value);
    myForm.set('difficulty', document.getElementById('difficulty').value);
    myForm.set('price', document.getElementById('price').value);
    //myForm.set('startLocation', document.getElementById('startLocation').value);
    myForm.set('summary', document.getElementById('summary').value);
    myForm.set('description', document.getElementById('description').value);
    myForm.set('imageCover', document.getElementById('imageCover').files[0]);

    // createTourPay(myForm);
    createTour(myForm);
  });
}

if (signupForm) {
  console.log('The form is here!!!');
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
