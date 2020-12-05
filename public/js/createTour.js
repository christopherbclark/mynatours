/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

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
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
