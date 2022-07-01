import { useState } from "react";
export default function DesignerTable({ rows, onRowEdit, onRowDelete, hideActions }) {


    return (
        <table className="table table-striped">
            <thead className="bg-dark text-white">
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Page Name</th>
                    <th scope="col">Table Name</th>
                    <th scope="col">Column Name</th>
                    <th scope="col">Label</th>
                    <th scope="col">Apply Filter</th>
                    <th scope="col">Display Mode</th>
                    <th scope="col">Display Length</th>
                    <th scope="col">Table Type</th>
                    <th scope="col">Join Column</th>
                    <th scope="col">Reference Table</th>
                    <th scope="col">Reference Column</th>
                    {
                        hideActions ? <></> : <th scope="col" className="bg-secondary">Action</th>
                    }
                </tr>
            </thead>
            <tbody>
                {
                    rows.map((r, i) => (
                        <tr key={i}>
                            <th scope="row">{r.id}</th>
                            <td>{r.pageName}</td>
                            <td>{r.tableName}</td>
                            <td>{r.columnName}</td>
                            <td>{r.label}</td>
                            <td>{r.applyFilter.toString()}</td>
                            <td>{r.displayMode}</td>
                            <td>{r.displayLength}</td>
                            <td>{r.isMaster ? 'Master' : 'Detail'}</td>
                            <td>{r.isJoinColumn.toString()}</td>
                            <td>{r.refTable || 'Not Applicable'}</td>
                            <td>{r.refColumn || 'Not Applicable'}</td>
                            {
                                hideActions ? <></> :
                                    <td>
                                        <button className="btn btn-sm btn-warning mr-2" onClick={(e) => { onRowEdit(e, i, r.id) }}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={(e) => { onRowDelete(e, i, r.id) }}>Delete</button>
                                    </td>
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
