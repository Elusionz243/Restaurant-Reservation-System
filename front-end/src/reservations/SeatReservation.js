import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { listTables, seatReservation } from '../utils/api';

export default function SeatReservation() {
    const [tables, setTables] = useState([]);
    const [tableErrors, setTableErrors] = useState(null);

    const history = useHistory();
    const reservation_id = useParams();
    let table_id;

    useEffect(() => {
        const abortController = new AbortController();
        listTables(abortController.signal)
            .then(setTables)
            .catch(setTableErrors);
        return () => abortController.abort();
    }, []);

    const handleSelection = (event) => {
        table_id = event.target.value;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const abortController = new AbortController();
        
        seatReservation(reservation_id, table_id, abortController.signal)
            .then(() => history.push('/dashboard'))
            .catch(setTableErrors);
    }

    const handleCancel = (event) => {
        event.preventDefault();
        history.back();
    }

    return (
        <div>
            <h2>Seat Reservation</h2>
            <ErrorAlert error={tableErrors} />
            <form onSubmit={handleSubmit}>
                <select name='table_id' onChange={handleSelection}>
                    {
                        tables.map(({ table_id, table_name, capacity }, index) => {
                            console.log(table_id);
                            return <option key={index} value={table_id}>{table_name} - {capacity}</option>
                        })
                    }
                </select>
                <button className='btn btn-secondary' onClick={handleCancel}>Cancel</button>
                <button className='btn btn-primary' type='submit'>Submit</button>
            </form>
        </div>
    )
}