import React, { useEffect, useState } from "react";
import { listReservations, listTables, clearTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from '../utils/useQuery';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tableErrors, setTableErrors] = useState(null);

  const query = useQuery();
  if (query.get('date')) date = query.get('date');

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTableErrors);
    return () => abortController.abort();
  }

  const finishReservation = (table_id) => {
    const abortController = new AbortController();

    if(window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      clearTable(table_id, abortController.signal)
      .then(loadDashboard)
      .catch(setTableErrors);
    }

    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <ErrorAlert error={reservationsError || tableErrors} />
        <h4 className="mb-0">Reservations for date: {date}</h4>
        {reservations.map(({ reservation_id, first_name, last_name, reservation_date, reservation_time, people, status }, index) => {
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
                <p data-reservation-id-status={reservation_id}>Status: {status}</p>
              </div>
              <div className='card-footer'>
                {status === 'booked' ? <a className='btn btn-success' href={`/reservations/${reservation_id}/seat`}>Seat</a>
                : null}
                <a className='btn btn-secondary' href={`/reservations/${reservation_id}/edit`}></a>
              </div>
            </div>
          );
        })
        }
        {tables.map(({ table_id, table_name, reservation_id, capacity }) => {
          return (
            <div className='card' key={table_id}>
              <p className='card-title'>
                {table_name}
              </p>
              <div className='card-body'>
                <p>Table #: {table_id}</p>
                <p>Capacity: {capacity}</p>
                <p data-table-id-status={table_id}>{reservation_id !== null ? "occupied" : "free"}</p>
              </div>
              {reservation_id !== null ? <button className='btn btn-success' onClick={() => finishReservation(table_id)} data-table-id-finish={table_id}>Finish</button>
              : null}
            </div>
          );
        })
        }
      </div>
    </main>
  );
}

export default Dashboard;
