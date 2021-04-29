import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createTables } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function CreateTables() {
    const initialTableData = {
        table_name: '',
        capacity: 0,
    };

    const [tableData, setTableData] = useState({ ...initialTableData });
    const [tableErrors, setTableErrors] = useState(null);

    const history = useHistory();

    const handleChange = ({ target }) => {
        const value = target.type === 'number' ? Number(target.value) : target.value;
        setTableData({ ...tableData, [target.name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const abortController = new AbortController();
        createTables(tableData, abortController.signal)
            .then((response) => {
                history.push("/dashboard");
                setTableData({ ...initialTableData });
            })
            .catch(setTableErrors);
    }

    const handleCancel = (event) => {
        event.preventDefault();
        history.goBack();
    }

    return (
        <div>
            <h2>CREATE TABLE</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor='table_name'>
                    <input
                        name='table_name'
                        id='table_name'
                        type='text'
                        onChange={handleChange}
                        value={tableData.table_name}
                        required
                    />
                </label>
                <label htmlFor='capacity'>
                    <input
                        name='capacity'
                        id='capacity'
                        type='number'
                        onChange={handleChange}
                        value={tableData.capacity}
                        required
                    />
                </label>
                <button onClick={handleCancel} className='btn btn-secondary'>Cancel</button>
                <button type='submit' className='btn btn-primary'>Submit</button>
            </form>
            <ErrorAlert error={tableErrors} />
        </div>
    );
}