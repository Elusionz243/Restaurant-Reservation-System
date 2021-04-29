import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function CreateReservation() {

  const initialReservationData = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 1,
  };

  const [reservationData, setReservationData] = useState({ ...initialReservationData });
  const [reservationErrors, setReservationErrors] = useState(null);

  const history = useHistory();

  const handleChange = ({ target }) => {
    const value = target.type === 'number' ? Number(target.value) : target.value;
    setReservationData({ ...reservationData, [target.name]: value });
  }

  const handleSubmit = (event) => {
      event.preventDefault();

      const abortController = new AbortController();

      createReservations(reservationData, abortController.signal)
      .then(() => {
        history.push(`/dashboard?date=${reservationData.reservation_date}`); 
        setReservationData({ ...initialReservationData });
      })
      .catch(setReservationErrors);
  }

  const handleCancel = (event) => {
    event.preventDefault();
    setReservationData({ ...initialReservationData });
    history.goBack();
  }

  return (
    <div>
      <h2>Create Reservation</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='first_name'>
          First Name:
          <input
            id='first_name'
            name='first_name'
            type='text'
            onChange={handleChange}
            value={reservationData.first_name}
          />
        </label>
        <label htmlFor='last_name'>
          Last Name:
          <input
            id='last_name'
            name='last_name'
            type='text'
            onChange={handleChange}
            value={reservationData.last_name}
          />
        </label>
        <label htmlFor='mobile_number'>
          Mobile Number:
          <input
            id='mobile_number'
            name='mobile_number'
            onChange={handleChange}
            value={reservationData.mobile_number}
          />
        </label>
        <label htmlFor='reservation_date'>
          Reservation Date:
          <input
            id='reservation_date'
            name='reservation_date'
            type='date'
            placeholder='YYYY-MM-DD'
            pattern='\d{4}-\d{2}-\d{2}'
            onChange={handleChange}
            value={reservationData.reservation_date}
          />
        </label>
        <label htmlFor='reservation_time'>
          Reservation Time:
          <input
            id='reservation_time'
            name='reservation_time'
            type='time'
            placeholder='HH:MM'
            pattern='\d{2}:\d{2}'
            onChange={handleChange}
            value={reservationData.reservation_time}
          />
        </label>
        <label htmlFor='people'>
          People:
          <input
            id='people'
            name='people'
            type='number'
            placeholder='1 or greater'
            onChange={handleChange}
            value={reservationData.people}
          />
        </label>
        <button type='submit' className='btn btn-primary'>Submit</button>
        <button className='btn btn-secondary' onClick={handleCancel}>Cancel</button>
      </form>
      <ErrorAlert error={reservationErrors} />
    </div>
  );
}
