import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { readReservation, updateReservation } from '../utils/api';

import ErrorAlert from '../layout/ErrorAlert';

export default function EditReservation() {

    const [reservation, setReservation] = useState({});
    const [reservationErrors, setReservationErrors] = useState(null);

    const reservation_id = useParams();

    const history = useHistory();

    const findReservation =  () => {
        const abortController = new AbortController();

        readReservation(reservation_id, abortController.signal)
        .then(setReservation)
        .catch(setReservationErrors);

        return () => abortController.abort();
    }

    useEffect(findReservation, [reservation_id]);

    const handleChange = ({ target }) => {
        const value = target.type === 'number' ? Number(target.value) : target.value;
        setReservation({ ...reservation, [target.name]: value });
    }

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();

            const abortController = new AbortController();

            await updateReservation(reservation, abortController.signal);

            history.push(`/dashboard?date=${reservation.reservation_date}`);
            return () => abortController.abort();
        } catch (error) {
            setReservationErrors(error);
        }
    }


    return (
        <div>
            <ErrorAlert error={reservationErrors} />
            <form onSubmit={handleSubmit}>
                <label htmlFor='first_name'>
                    First Name:
                    <input
                        name='first_name'
                        type='text'
                        onChange={handleChange}
                        value={reservation.first_name}
                    />
                </label>
                <label htmlFor='last_name'>
                    Last Name:
                    <input
                        name='last_name'
                        type='text'
                        onChange={handleChange}
                        value={reservation.last_name}
                    />
                </label>
                <label htmlFor='mobile_number'>
                    Mobile Number:
                    <input
                        name='mobile_number'
                        type='tel'
                        onChange={handleChange}
                        value={reservation.mobile_number}
                    />
                </label>
                <label htmlFor='reservation_date'>
                    Reservation Date:
                    <input
                        name='reservation_date'
                        type='date'
                        onChange={handleChange}
                        value={reservation.reservation_date}
                    />
                </label>
                <label htmlFor='reservation_time'>
                    Reservation Time:
                    <input
                        name='reservation_time'
                        type='time'
                        onChange={handleChange}
                        value={reservation.reservation_time}
                    />
                </label>
                <label htmlFor='people'>
                    People:
                    <input
                        name='people'
                        type='number'
                        onChange={handleChange}
                        value={reservation.people}
                    />
                </label>
                <button type='submit' className='btn btn-primary'>Submit</button>
                <button className='btn btn-secondary' onClick={() => history.goBack()}>Cancel</button>
            </form>
        </div>
    );
}