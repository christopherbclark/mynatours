/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51H0nYBJqiCKHuK6xPSI4jEKSzqDFxMNA12VigfL9qWbOVkON1xld1bnO13QckMgPUnS09Cjy67lBzUjcyTEeGuB100xVVzXqfD'
);

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
