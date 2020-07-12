/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createTour = async (
  name,
  duration,
  maxGroupSize,
  difficulty,
  price,
  startLocation,
  summary,
  description,
  imageCover
) => {
  try {
    const startLocation = {
      type: 'Point',
      coordinates: [-80.185942, 25.774772],
      address: '47 Bowman Lane, Kings Park, NY 11754',
      description: 'New Yorkkkkkkkk'
    };

    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/tours',
      data: {
        name,
        duration,
        maxGroupSize,
        difficulty,
        price,
        startLocation,
        summary,
        description,
        imageCover
      }
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
