import React, { useState } from 'react';

export default function DatasetTable({ rows, onRowDelete, onRowEdit }) {

    return (
        <table className="table table-striped">
            <thead className="bg-dark text-white">
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Table Name</th>
                    <th scope="col">Column Name</th>
                    <th scope="col">Data Type</th>
                    <th scope="col">Max Length</th>
                    <th scope="col">Allow Null</th>
                    <th scope="col" className='w-fc'>Keep Unique</th>
                    {/* <th scope='col'>Master/Detail</th>
                    <th scope="col">Join Column</th>
                    <th scope="col">Reference Table</th>
                    <th scope="col">Reference Column</th> */}
                    <th scope="col" className="bg-secondary">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    rows.map((r, i) => (
                        <tr key={i}>
                            <th scope="row">{r.id}</th>
                            <td>{r.tableName}</td>
                            <td>{r.columnName}</td>
                            <td>{r.dataType}</td>
                            <td>{r.maxLength || 'Unspecified'}</td>
                            <td>{r.allowNull.toString()}</td>
                            <td>{r.keepUnique.toString()}</td>
                            {/* <td>{r.isMaster? 'Master' : 'Detail'}</td>
                            <td>{r.isJoinColumn.toString()}</td>
                            <td>{r.refTable || 'Not Applicable'}</td>
                            <td>{r.refColumn || 'Not Applicable'}</td> */}
                            <td>
                                <button className="btn btn-sm btn-warning mr-2" onClick={(e) => { onRowEdit(e, i, r.id) }}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={(e) => { onRowDelete(e, i, r.id) }}>Delete</button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}