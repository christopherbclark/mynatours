/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51H0nYBJqiCKHuK6xPSI4jEKSzqDFxMNA12VigfL9qWbOVkON1xld1bnO13QckMgPUnS09Cjy67lBzUjcyTEeGuB100xVVzXqfD'
);

export const createTourPay = async tourId => {
  try {
    // 1) Get the checkout session from API response
    const id = tourId;
    console.log(id);
    const session = await axios(`/api/v1/tours/tour-pay/${tourId}`);
    // console.log(session);
    // 2) Create checkout form + charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    // console.log(err);
    showAlert('error', err);
  }
};

export const createTour = async myForm => {
  try {
    const startLocation = {
      type: 'Point',
      coordinates: [-10.185942, 95.774772],
      address: '47 Bowman Lane, Kings Park, NY 11754',
      description: 'New York'
    };

    const res = await axios({
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${myForm._boundary}`
      },
      url: '/api/v1/tours',
      data: myForm
    });

    if (res.data.status === 'success') {
      showAlert('success', 'NEW TOUR CREATED!');
      const tourId = res.data.data.data.id;
      console.log(res);
      createTourPay(tourId);

      // window.setTimeout(() => {
      //   location.assign('/');
      // }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
