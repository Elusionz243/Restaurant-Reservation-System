import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
        {reservations.map(({reservation_id, first_name, last_name, reservation_date, reservation_time, people, status}, index) => {
          return (
            <div className='card' key={reservation_id}>
              <p className='card-title'>
                {first_name}, {last_name}
              </p>
              <div className='card-body'>
                <p>Reservation #: {reservation_id}</p>
                <p>Reservation Date: {reservation_date}</p>
                <p>Reservation Time: {reservation_time}</p>
                <p>People: {people}</p>
                <p>Status: {status}</p>
              </div>
            </div>
          );
        })
        }
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
