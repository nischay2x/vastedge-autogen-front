import React, { useState, useEffect } from 'react';
import DesignerTable from '../component/DesignerTable.jsx';
import { 
    getDesignerColumnsByTableName, getCrudColumnsByTableName, 
    getDistinctPages, getTables, postNewCrudColumn, postNewDesignerColumn, editDesignerColumn, deleteDesignerColumn, getJoinableColumnsByTableName 
} from "../api.js";
import { validCrudDataTypes, validInputFieldTypes } from "../config.js";

const defaultDesignerData = {
    label: "", displayMode: "TEXT", isJoinColumn: false,
    displayLength: "", applyFilter: false, refTable: "",
    refColumn: ""
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

export default function DashboardHome() {

    const [pageList, setPageList] = useState([]);
    const [pageName, setPageName] = useState("");

    const [tableList, setTableList] = useState([]);
    const [tableName, setTableName] = useState("");
    const [tableIsMaster, setTableIsMaster] = useState(true);

    const [designerColumns, setDesignerColumns] = useState([]);
    const [designerColumnData, setDesignerColumnData] = useState(defaultDesignerData)
    const [crudColumns, setCrudColumns] = useState([]);
    const [currentDatasetColumn, setCurrentDatasetColumn] = useState({
        columnName: "", dataType: "STRING", tableName: "",
        maxLength: "", allowNull: false, keepUnique: false
    });
    const [columnList, setColumnList] = useState([]);
    const [columnName, setColumnName] = useState("");

    const [tableTypeDisabled, setTableTypeDisabled] = useState(true);
    const [joinableColumns, setJoinableColumns] = useState([]);

    const [editingRow, setEditingRow] = useState(false);
    const [editingRowIndex, setEditingRowIndex] = useState("");
    const [isNewEntry, setIsNewEntry] = useState({ pageName: false, tableName: false, columnName: false });
    const [isLoading, setIsLoading] = useState({ pageName: false, tableName: true, columnName: true });

    const fetchTableList = (argument) => {
        setIsLoading(prev => ({ ...prev, tableName: true }))
        getTables(argument).then(res => {
            setTableList(res.data.data);
            setIsLoading(prev => ({ ...prev, tableName: false }))
        }).catch(errorHandler)
    }

    const applyDesignerColumnResponse = (res) => {
        const columnsData = res.data.data;
        setDesignerColumns(columnsData)
        if (columnsData.length) {
            setTableIsMaster(columnsData[0].isMaster);
            if(columnsData[0].pageName === pageName) setTableTypeDisabled(true);
            else setTableTypeDisabled(false);
        } else {
            setTableTypeDisabled(false)
        }
    }

    useEffect(() => {
        setIsNewEntry(prev => (
            { ...prev, pageName: pageName && !pageList.includes(pageName) }
        ));
        if(designerColumns[0]?.pageName === pageName) setTableTypeDisabled(true);
        else setTableTypeDisabled(false);
    }, [pageName]);

    useEffect(() => {
        if(!tableName) return;
        getDesignerColumnsByTableName(tableName).then(applyDesignerColumnResponse).catch(errorHandler)
        
        setIsLoading(prev => ({ ...prev, columnName: true }));
        getCrudColumnsByTableName(tableName).then(res => {
            const crudCols = res.data.data;
            const colList = crudCols.map(c => c.columnName);
            setColumnList(colList);
            setCrudColumns(crudCols);
            setIsLoading(prev => ({ ...prev, columnName: false }))
        }).catch(err => {
            errorHandler(err)
            setIsLoading(prev => ({ ...prev, columnName: false }))
        })
    }, [tableName])

    useEffect(() => {
        if(!columnName) return;
        // setIsNewEntry(prev => (
        //     { ...prev, [fieldName]: value && !columnList.includes(value) }
        // ));
        const cuCrudData = crudColumns.find(c => c.columnName === columnName);
        setCurrentDatasetColumn(cuCrudData);
    }, [columnName])

    useEffect(() => {
        if(!designerColumnData.isJoinColumn) {
            setDesignerColumnData(prev => ({
                ...prev,
                refColumn: "",
                refTable: ""
            }))
        }
    }, [designerColumnData.isJoinColumn])

    useEffect(() => {
        if(!designerColumnData.refTable) return;
        getJoinableColumnsByTableName(designerColumnData.refTable).then(res => {
            const jonables = res.data.data;
            setJoinableColumns(jonables)
        }).catch(errorHandler)
    }, [designerColumnData.refTable])

    const changeMultiInput = (e) => {
        switch (e.target.name) {
            case 'pageName': setPageName(e.target.value); break;
            case 'tableName': setTableName(e.target.value); break;
            case 'columnName': {
                setColumnName(e.target.value);
                setCurrentDatasetColumn(prev => ({ ...prev, columnName: e.target.value }));
                break;
            }
            default: break;
        }
    }

    // const createCrudColumn = () => {
    //     postNewCrudColumn({ ...currentDatasetColumn, tableName }).then(res => {
    //         const newCrudColumn = res.data.data;
    //         setCrudColumns(prev => [...prev, newCrudColumn]);
    //         setColumnList(prev => [...prev, newCrudColumn.columnName]);
    //         alert("New Crud Column Inserted");
    //     }).catch(errorHandler)
    // }

    const handleDesignerDataForm = (e) => {
        e.preventDefault();
        if(!editingRow) {
            postNewDesignerColumn(designerColumnData, pageName, tableName, columnName, tableIsMaster)
            .then(res => {
                const newDesData = res.data.data;
                setDesignerColumns(prev => [...prev, newDesData]);
                alert("Data Inserted");
            }).catch(errorHandler)
        } else {
            editDesignerColumn(designerColumns[editingRowIndex].id, {
                ...designerColumnData, columnName
            }).then(res => {
                getDesignerColumnsByTableName(tableName).then(applyDesignerColumnResponse).catch(errorHandler);
                alert(res.data.msg)
            }).catch(errorHandler)
        }
    }

    const handleDesignerFormCancel = () => {
        setDesignerColumnData(defaultDesignerData);
        setEditingRow(false);
        setColumnName("");
    }

    useEffect(() => {
        setIsLoading(prev => ({ ...prev, pageName: true }))
        getDistinctPages().then(response => {
            setPageList(response.data.data)
            setIsLoading(prev => ({ ...prev, pageName: false }))
        }).catch(err => {
            errorHandler(err);
            setIsLoading(prev => ({ ...prev, pageName: false }))
        });

        fetchTableList();
    }, []);

    const onRowEdit = (e, i, id) => {
        setEditingRow(true);
        const data = designerColumns[i];
        setEditingRowIndex(i);
        setColumnName(data.columnName);
        setDesignerColumnData(prev => ({
            ...prev,
            label: data.label,
            displayLength: data.displayLength,
            displayMode: data.displayMode,
            isJoinColumn: data.isJoinColumn,
            applyFilter: data.applyFilter,
            refColumn: data.refColumn,
            refTable: data.refTable
        }));
    }

    const onRowDelete = (e, i, id) => {
        deleteDesignerColumn(id).then(res => {
            let temp = designerColumns.filter((_, idx) => idx !== i);
            setDesignerColumns(temp);
        }).catch(errorHandler)
    }

    return (
        <div className="container-fluid py-4">
            <div className="col-12">
                <h3 className="fw-500">Automation System</h3>
            </div>
            <hr />
            <div className="d-flex flex-wrap">
                <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                    <div className={`w-100 multi-input-hold ${isNewEntry.pageName ? 'new' : ''}`}>
                        <label>Page Name</label>
                        <input type="text" name="pageName" list="pageList" placeholder="Choose/Enter Page Name" disabled={isLoading.pageName}
                            className="form-control" value={pageName} onChange={changeMultiInput}
                        />
                        <datalist id="pageList">
                            {pageList.map((p, i) => (<option key={i} value={p} />))}
                        </datalist>
                    </div>
                    <label className='pt-2 pl-1'>This is a New Page</label>
                </div>

                <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                    <div className={`w-100 multi-input-hold ${isNewEntry.tableName ? 'new' : ''}`}>
                        <label>Table Name</label>
                        <select name="tableName" disabled={isLoading.tableName}
                            className='form-control' value={tableName} onChange={changeMultiInput}
                        >
                            <option value="" defaultChecked>Select Table</option>
                            {tableList.map((t, i) => (<option key={i} value={t}>{t}</option>))}
                        </select>
                        {/* <input type="text" name="tableName" list="tableList" placeholder="Choose/Enter Table Name" disabled={isLoading.tableName}
                            className="form-control" onKeyUp={checkNewEntry} value={tableName} onChange={changeMultiInput}
                        />
                        <datalist id="tableList">
                            {tableList.map((t, i) => (<option key={i} value={t} />))}
                        </datalist> */}
                    </div>
                    <label>This is a New Table</label>
                </div>

                <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                    <label>Table Type</label>
                    <div className="d-flex cg-1">
                        <div className="form-check">
                            <input type="radio" name="isMaster" value="1" checked={tableIsMaster} disabled={tableTypeDisabled}
                                className="form-check-input" id="imt" onChange={() => { setTableIsMaster(true)}} />
                            <label htmlFor="imt" className="form-check-label">Master</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" name="isMaster" value="0" checked={!tableIsMaster} disabled={tableTypeDisabled}
                                className="form-check-input" id="imf" onChange={() => { setTableIsMaster(false)}} />
                            <label htmlFor="imf" className="form-check-label">Detail</label>
                        </div>
                    </div>
                </div>
            </div>
            <br />

            <div className="border p-2">
                <h6>Dataset Info</h6>
                <div className="d-flex flex-wrap rg-1">
                    <div className="col-lg-4 col-xl-3 col-md-6">
                        <div className={`w-100 multi-input-hold ${isNewEntry.columnName ? 'new' : ''}`}>
                            <label>Column Name</label>
                            <select name="columnName" value={columnName} className='form-control' onChange={changeMultiInput} disabled={isLoading.columnName}>
                                <option value="" defaultChecked>Select Column</option>
                                {columnList.map((c, i) => (<option key={i} value={c}>{c}</option>))}
                            </select>
                            {/* <input type="text" name="columnName" list="columnList" placeholder="Choose/Enter Column Name" disabled={isLoading.columnName}
                                className="form-control" onKeyUp={checkNewEntry} value={columnName} onChange={changeMultiInput}
                            />
                            <datalist id="columnList" >
                                {columnList.map((c, i) => (<option key={i} value={c} />))}
                            </datalist> */}
                        </div>
                        <label>This is new Column</label>
                    </div>

                    <div className="col-lg-4 col-xl-3 col-md-6">
                        <label>Data Type</label>
                        <select name="dataType" className="form-control" value={currentDatasetColumn.dataType} disabled={!isNewEntry.columnName}
                            onChange={(e) => { setCurrentDatasetColumn(prev => ({ ...prev, dataType: e.target.value })) }}>
                            {
                                validCrudDataTypes.map((d, i) => <option value={d} key={i}>{d}</option>)
                            }
                        </select>
                    </div>

                    <div className="col-lg-4 col-xl-3 col-md-6">
                        <label>Data Length</label>
                        <input type="number" name="dataLength" className="form-control" value={currentDatasetColumn.maxLength} disabled={!isNewEntry.columnName}
                            onChange={(e) => { setCurrentDatasetColumn(prev => ({ ...prev, maxLength: e.target.value })) }}
                            placeholder="Data Length"
                        />
                    </div>

                    <div className="col-lg-4 col-xl-3 col-md-6">
                        <label>Allow Null Values</label>
                        <div className="d-flex cg-1">
                            <div className="form-check">
                                <input type="radio" name="allowNull" id="ant" className="form-check-input" checked={currentDatasetColumn.allowNull}
                                    disabled={!isNewEntry.columnName} onChange={() => { setCurrentDatasetColumn(prev => ({ ...prev, nullConstrain: true })) }} />
                                <label htmlFor="ant" className="form-check-label">Yes</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" name="allowNull" id="anf" className="form-check-input" checked={!currentDatasetColumn.allowNull}
                                    disabled={!isNewEntry.columnName} onChange={() => { setCurrentDatasetColumn(prev => ({ ...prev, nullConstrain: false })) }} />
                                <label htmlFor="anf" className="form-check-label">No</label>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-xl-3 col-md-6">
                        <label>Keep Values Unique</label>
                        <div className="d-flex cg-1">
                            <div className="form-check">
                                <input type="radio" name="keepUnique" id="kut" className="form-check-input" checked={currentDatasetColumn.keepUnique}
                                    disabled={!isNewEntry.columnName} onChange={() => { setCurrentDatasetColumn(prev => ({ ...prev, keepUnique: true })) }} />
                                <label htmlFor="kut" className="form-check-label">Yes</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" name="keepUnique" id="kuf" className="form-check-input" checked={!currentDatasetColumn.keepUnique}
                                    disabled={!isNewEntry.columnName} onChange={() => { setCurrentDatasetColumn(prev => ({ ...prev, keepUnique: false })) }} />
                                <label htmlFor="kuf" className="form-check-label">No</label>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="col-12 d-flex py-2">
                    <button className={`btn btn-primary ml-auto ${isNewEntry.columnName ? '' : 'hide'}`}
                        onClick={createCrudColumn}
                    >Add Column</button>
                </div> */}
            </div>
            <br />

            <div className={`border p-2 ${columnName || editingRow ? '' : 'hide'}`}>
                <h6>{editingRow ? 'Edit' : 'Fill' } Data</h6>
                <div className="d-flex w-100 flex-wrap rg-1">
                    <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                        <label>Label</label>
                        <input type="text" required name="label" className="form-control" value={designerColumnData.label}
                            onChange={(e) => { setDesignerColumnData(prev => ({ ...prev, label: e.target.value })) }}
                            placeholder="Label"
                        />
                    </div>
                    <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                        <label>Display Mode</label>
                        <select name="displayMode" className="form-control" value={designerColumnData.displayMode}
                            onChange={(e) => { setDesignerColumnData(prev => ({ ...prev, displayMode: e.target.value })) }}>
                                <option value="" defaultChecked>Select Mode</option>
                            {
                                validInputFieldTypes.map((t, i) => <option value={t} key={i}>{t}</option>)
                            }
                        </select>
                    </div>
                    <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                        <label>Display Length</label>
                        <input type="number" name="displayLength" className="form-control" value={designerColumnData.displayLength}
                            onChange={(e) => { setDesignerColumnData(prev => ({ ...prev, displayLength: e.target.value })) }}
                            placeholder="Display Length"
                        />
                    </div>
                    <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                        <label>Apply Filter</label>
                        <div className="d-flex cg-1">
                            <div className="form-check">
                                <input type="radio" name="applyFilter" id="aft" className="form-check-input" checked={designerColumnData.applyFilter}
                                    onChange={() => { setDesignerColumnData(prev => ({ ...prev, applyFilter: true })) }} />
                                <label htmlFor="aft" className="form-check-label">True</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" name="applyFilter" id="aff" className="form-check-input" checked={!designerColumnData.applyFilter}
                                    onChange={() => { setDesignerColumnData(prev => ({ ...prev, applyFilter: false })) }} />
                                <label htmlFor="aff" className="form-check-label">False</label>
                            </div>
                        </div>
                    </div>

                    {
                        tableIsMaster ? <></> :
                            <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                                <label>This is a Join Column</label>
                                <div className="d-flex cg-1">
                                    <div className="form-check">
                                        <input type="radio" name="isJoinColumn" id="ijct" className="form-check-input"
                                            checked={designerColumnData.isJoinColumn}
                                            onChange={() => { setDesignerColumnData(prev => ({ ...prev, isJoinColumn: true })) }}
                                        />
                                        <label htmlFor="ijct" className="form-check-label">Yes</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" name="isJoinColumn" id="ijcf" className="form-check-input"
                                            checked={!designerColumnData.isJoinColumn}
                                            onChange={() => { setDesignerColumnData(prev => ({ ...prev, isJoinColumn: false })) }}
                                        />
                                        <label htmlFor="ijcf" className="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                    }

                    {
                        designerColumnData.isJoinColumn ? <>
                            <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                                <label className='form-label'>Reference Table</label>
                                <select name="refTable" className='form-control'
                                    value={designerColumnData.refTable} 
                                    onChange={(e) => { setDesignerColumnData(prev => ({...prev, refTable: e.target.value})) }}
                                >
                                    <option value="" defaultChecked>Select Table</option>
                                    {
                                        tableList.map((t, i) => <option key={i} value={t}>{t}</option>)
                                    }
                                </select>
                            </div>

                            <div className="col-lg-4 col-xl-3 col-md-6 col-12">
                                <label className='form-label'>Reference Column</label>
                                <select name="refColumn" className='form-control'
                                    value={designerColumnData.refColumn} 
                                    onChange={(e) => { setDesignerColumnData(prev => ({...prev, refColumn: e.target.value})) }}
                                >
                                    <option value="" defaultChecked>Select Column</option>
                                    {
                                        joinableColumns.map((t, i) => <option key={i} value={t}>{t}</option>)
                                    }
                                </select>
                            </div>
                        </> : <></>
                    }
                    <div className="col d-flex">
                        <div className='d-flex mt-auto cg-1 rg-1 pb-1'>
                            <button className="btn btn-sm btn-success" onClick={handleDesignerDataForm}>Submit</button>
                            <button className="btn btn-sm btn-info" onClick={handleDesignerFormCancel} >Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            {
                isLoading.columnName ? <div className="d-flex justify-content-center py-2">
                    <div className="loader"></div>
                </div> : <></>
            }
            <div style={{ overflowX: 'scroll' }}>
                {designerColumns.length ? <DesignerTable rows={designerColumns} onRowDelete={onRowDelete} onRowEdit={onRowEdit} /> : <div className='text-danger text-center'>No Data to Show</div>}
            </div>
        </div>
    )
}
