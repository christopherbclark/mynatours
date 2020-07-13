/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createTour = async myForm => {
  try {
    const startLocation = {
      type: 'Point',
      coordinates: [-80.185942, 25.774772],
      address: '47 Bowman Lane, Kings Park, NY 11754',
      description: 'New York'
    };

    const res = await axios({
      method: 'POST',
      /* headers: {
        'Content-Type': `multipart/form-data; boundary=${myForm._boundary}`
      }, */
      url: 'http://127.0.0.1:8000/api/v1/tours',
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
