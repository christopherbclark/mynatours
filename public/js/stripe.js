/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51H0nYBJqiCKHuK6xPSI4jEKSzqDFxMNA12VigfL9qWbOVkON1xld1bnO13QckMgPUnS09Cjy67lBzUjcyTEeGuB100xVVzXqfD'
);

const getLink = async accountId => {
  try {
    const accountLink = await axios(`/api/v1/tours/seller-signup/${accountId}`);
    const URL = accountLink.data.accountLinks.url;
    location.replace(URL);
    // 1) Get the checkout session from API response
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

const updateUserAccount = async accountId => {
  try {
    const updateUserAccountId = await axios(
      `/api/v1/users/seller-signup/${accountId}`
    );
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

export const sellerOnboard = async () => {
  try {
    const signUp = await axios(`/api/v1/tours/seller-signup`);
    const accountId = signUp.data.account.id;
    console.log(accountId);
    getLink(accountId);
    updateUserAccount(accountId);
  } catch (err) {
    console.log(err);
  }
};

export const getDashboardLink = async () => {
  try {
    const linkInfo = await axios(`/api/v1/tours/get-dashboard`);
    location.replace(linkInfo.data.link.url);
  } catch (err) {
    console.log(err);
  }
};

export const bookTour = async tourId => {
  try {
    // 1) Get the checkout session from API response
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);
    // 2) Create checkout form + charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
