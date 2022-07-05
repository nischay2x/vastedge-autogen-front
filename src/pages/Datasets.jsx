import React, { useEffect, useState } from 'react'
import { deleteDataset, editDataset, getCrudColumnsByTableName, getDatasetTables, postNewDataset } from '../api';
import DatasetTable from '../component/DatasetTable';
import { validDatasetTypes } from '../config';

const defaultEditData = {
    tableName: "", columnName: "", dataType: "VARCHAR", maxLength: "", allowNull: true,
    keepUnique: false, 
    // isMaster: true, isJoinColumn: false, refTable: "", refColumn: ""
}

function errorHandler ({response}) {
    console.log(response);
    if(response.data.type){
        alert(`${response.data?.type} : ${response.data?.error}`);
    }
    else {
        alert("An Error Occured")
    }
}

export default function Datasets() {

    const [tableList, setTableList] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [currentTable, setCurrentTable] = useState("");
    const [newTableData, setNewTableData] = useState(defaultEditData);
    const [tableListLoading, setTableListLoading] = useState(true);
    const [datasetChanging, setDatasetChanging] = useState(false);

    const [creatingNewTable, setCreatingNewTable] = useState(false);
    const [creatingNewColumn, setCreatingNewColumn] = useState(false);
    const [editingRow, setEditingRow] = useState(false);

    const [editingIndex, setEditingIndex] = useState(null);

    const onNewTableInput = (e) => {
        setNewTableData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    useEffect(() => {
        getDatasetTables().then(res => {
            setTableList(res.data.data)
            setTableListLoading(false);
        }).catch(errorHandler)
    }, [])

    useEffect(() => {
        if (!currentTable) return;
        setDatasetChanging(true)
        if(creatingNewColumn) setNewTableData(prev => ({...prev, tableName: currentTable}));
        getCrudColumnsByTableName(currentTable).then(res => {
            setDatasets(res.data.data);
            setDatasetChanging(false);
        }).catch(errorHandler)
    }, [currentTable]);

    const onRowEdit = (e, i, id) => {
        setEditingRow(true);
        setEditingIndex(i);
        setNewTableData({
            tableName: datasets[i].tableName, columnName: datasets[i].columnName, dataType: datasets[i].dataType, 
            maxLength: datasets[i].maxLength, allowNull: datasets[i].allowNull, keepUnique: datasets[i].keepUnique
        });
    }

    const onRowDelete = (e, i, id) => {
        console.log("index ",i);
        deleteDataset(id).then(res => { 
            alert("Data Deleted");
            let tempDatasets = datasets.filter((_, idx) => idx !== i);
            setDatasets(tempDatasets);
        }).catch(errorHandler)
    }

    const onFillUpSubmit = (e) => {
        e.preventDefault();
        if(creatingNewTable) {
            postNewDataset(newTableData).then(res => {
                const data = res.data.data;
                setTableList(prev => [...prev, data.tableName]);
                setCurrentTable(data.tableName)
                alert("New Table Created");
                setCreatingNewTable(false);
            }).catch(errorHandler)
        }
        else if(creatingNewColumn) {
            postNewDataset(newTableData).then(res => {
                const data = res.data.data;
                setDatasets(prev => [...prev, data]);
                alert("New Column Inserted");
                setCreatingNewColumn(false);
            }).catch(errorHandler)
        }
        else if(editingRow) {
            editDataset(datasets[editingIndex].id, newTableData).then(res => {
                const data = res.data.data;
                let tempDatasets = datasets;
                tempDatasets[editingIndex] = data;
                setDatasets(tempDatasets);
                alert("Data Updated");
                setEditingRow(false);
            }).catch(errorHandler)
        }
    }

    const onFillUpCancel = () => {
        setEditingRow(false); setCreatingNewColumn(false); 
        setCreatingNewTable(false);
        setNewTableData(defaultEditData);
    }

    return (
        <div className="container-fluid py-3">
            <div>
                <h3>Datasets</h3>
            </div>
            <hr />

            <div className='d-flex justify-content-between pb-2'>
                <h6>Datasets</h6>
                <button className="btn btn-sm btn-primary"
                    onClick={() => { 
                        setCreatingNewTable(true); 
                        setCreatingNewColumn(false); 
                        setEditingRow(false);
                        setNewTableData(prev => ({ ...prev, tableName: "" })) 
                    }}
                >Create New Table</button>
            </div>
            <div className='d-flex cg-1'>
                {
                    tableListLoading ? <div className="loader-sm"></div> : <></>
                }
                {
                    tableList.length  ?
                        tableList.map((t, i) => <button key={i} className={`btn btn-sm btn-${t === currentTable ? 'dark' : 'success'}`} onClick={() => { setCurrentTable(t) }} >{t}</button>) :
                        <div className="text-danger">No Tables</div>
                }
            </div>
            <br />

            {
                (creatingNewTable || creatingNewColumn || editingRow) ?
                    <div className='border p-2'>
                        <h6>{editingRow? 'Edit' : 'Fill'} Details</h6>
                        <div className="d-flex flex-wrap rg-1 py-2">

                            {
                                editingRow ? <></> :
                                    <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                                        <label className='form-label'>Table Name</label>
                                        {
                                            creatingNewTable ? (
                                                <input className='form-control' type="text" name="tableName"
                                                    value={newTableData.tableName} onChange={onNewTableInput} placeholder="No whitespaces"
                                                />
                                            ) : (
                                                <select className='form-control' name='tableName' value={newTableData.tableName}
                                                    onChange={onNewTableInput}
                                                >
                                                    {tableList.map((t, i) => <option key={i} value={t}>{t}</option>)}
                                                </select>
                                            )
                                        }
                                    </div>
                            }


                            <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                                <label className='form-label'>Column Name</label>
                                <input className='form-control' type="text" name="columnName"
                                    value={newTableData.columnName} onChange={onNewTableInput} placeholder="No whitespaces"
                                />
                            </div>

                            <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                                <label className="form-label">Data Type</label>
                                <select name="dataType" className='form-control' value={newTableData.dataType} onChange={onNewTableInput}>
                                    {
                                        validDatasetTypes.map((t, i) => <option key={i} value={t}>{t}</option>)
                                    }
                                </select>
                            </div>

                            <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                                <label className="form-label">Max Length</label>
                                <input className='form-control' type="text" name="maxLength"
                                    value={newTableData.maxLength} onChange={onNewTableInput} placeholder="Number"
                                />
                            </div>

                            <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                                <label>Allow Null Values</label>
                                <div className="d-flex cg-1">
                                    <div className="form-check">
                                        <input type="radio" name="allowNull" id="ant" className="form-check-input" checked={newTableData.allowNull}
                                            onChange={() => { setNewTableData(prev => ({ ...prev, allowNull: true })) }} />
                                        <label htmlFor="ant" className="form-check-label">Yes</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" name="allowNull" id="anf" className="form-check-input" checked={!newTableData.allowNull}
                                            onChange={() => { setNewTableData(prev => ({ ...prev, allowNull: false })) }} />
                                        <label htmlFor="anf" className="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                                <label>Keep Values Unique</label>
                                <div className="d-flex cg-1">
                                    <div className="form-check">
                                        <input type="radio" name="keepUnique" id="kut" className="form-check-input" checked={newTableData.keepUnique}
                                            onChange={() => { setNewTableData(prev => ({ ...prev, keepUnique: true })) }} />
                                        <label htmlFor="kut" className="form-check-label">Yes</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" name="keepUnique" id="kuf" className="form-check-input" checked={!newTableData.keepUnique}
                                            onChange={() => { setNewTableData(prev => ({ ...prev, keepUnique: false })) }} />
                                        <label htmlFor="kuf" className="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>

                            <div className="col py-2">
                                <button className="btn m-1 btn-sm btn-warning" onClick={onFillUpSubmit} >Submit</button>
                                <button className="btn m-1 btn-sm btn-info" onClick={onFillUpCancel} >Cancel</button>
                            </div>

                            {/* <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                        <label>This is a Join Column</label>
                        <div className="d-flex cg-1">
                            <div className="form-check">
                                <input type="radio" name="isJoinColumn" id="ijct" className="form-check-input" checked={newTableData.isJoinColumn}
                                    onChange={() => { setNewTableData(prev => ({ ...prev, isJoinColumn: true })) }} />
                                <label htmlFor="ijct" className="form-check-label">Yes</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" name="isJoinColumn" id="ijcf" className="form-check-input" checked={!newTableData.isJoinColumn}
                                    onChange={() => { setNewTableData(prev => ({ ...prev, isJoinColumn: false })) }} />
                                <label htmlFor="ijcf" className="form-check-label">No</label>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                        <label className='form-label'>Reference Table</label>
                        <select name="refTable" className='form-control' value={newTableData.refTable} onChange={onNewTableInput}>
                            {
                                validDatasetTypes.map((t, i) => <option key={i} value={t}>{t}</option>)
                            }
                        </select>
                    </div>

                    <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                        <label className='form-label'>Reference Column</label>
                        <select name="refColumn" className='form-control' value={newTableData.refColumn} onChange={onNewTableInput}>
                            {
                                validDatasetTypes.map((t, i) => <option key={i} value={t}>{t}</option>)
                            }
                        </select>
                    </div> */}
                        </div>
                    </div> : <></>

            }

            <br />
            {
                datasets.length ? (
                    <>
                    <div className='d-flex align-items-center justify-content-between'>
                        <span>Data of Table <strong>{currentTable}</strong></span>
                        <button className="btn btn-success" 
                            onClick={() => { 
                                setCreatingNewColumn(true); 
                                setNewTableData(prev => ({...defaultEditData, tableName: currentTable}));
                                setCreatingNewTable(false);
                                setEditingRow(false);
                            }}
                        >Add A Column</button>
                    </div>
                    <hr />
                    <div className='d-flex pb-4 justify-content-center'>
                        {
                            datasetChanging ? <div className="py-3 loader"></div> : <></> 
                        }
                    </div>
                    <div style={{ overflowX: 'scroll' }}>
                        <DatasetTable rows={datasets} onRowDelete={onRowDelete} onRowEdit={onRowEdit} />
                    </div>
                    </>
                ) : <></>
            }
        </div>
    )
}
