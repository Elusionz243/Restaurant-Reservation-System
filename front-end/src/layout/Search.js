import React, { useState } from 'react';
import { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function Search() {
    const [reservations, setReservations] = useState([]);
    const [reservationErrors, setReservationErrors] = useState(null);
    const [mobile_number, setMobileNumber] = useState('');

    const handleChange = ({ target }) => {
        setMobileNumber(target.value);
    }

    const handleSearch = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        listReservations({ mobile_number }, abortController.signal)
            .then(setReservations)
            .then(() => reservations.length === 0 ?
            setReservationErrors({ message: 'No reservations found.' }) : setReservationErrors(null))
            .catch(setReservationErrors);
    }

    return (
        <div>
            <h2>Search for reservations by mobile number</h2>
            <form onSubmit={handleSearch}>
                <label htmlFor='mobile_number'>
                    <input
                        name='mobile_number'
                        onChange={handleChange}
                        value={mobile_number}
                    />
                </label>
                <button className='btn btn-primary' type='submit'>Find</button>
                {reservations.length > 0 ? reservations.map(({ reservation_id, first_name, last_name, reservation_date, reservation_time, people, status, mobile_number }, index) => {
                    return (
                        <div className='card' key={reservation_id}>
                            <p className='card-title'>
                                {first_name}, {last_name}
                            </p>
                            <div className='card-body'>
                                <p>Reservation #: {reservation_id}</p>
                                <p>Mobile Number: {mobile_number}</p>
                                <p>Reservation Date: {reservation_date}</p>
                                <p>Reservation Time: {reservation_time}</p>
                                <p>People: {people}</p>
                                <p data-reservation-id-status={reservation_id}>Status: {status}</p>
                            </div>
                        </div>
                    );
                })
                : <ErrorAlert error={reservationErrors} />}
            </form>
        </div>
    );
}