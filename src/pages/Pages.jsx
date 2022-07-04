import React, { useEffect, useState } from 'react';
import { getDesignerColumns, getDesignerColumnsByTableName, getDistinctPages, getTables } from '../api';
import DesignerTable from '../component/DesignerTable';

function errorHandler({ response }) {
  console.log(response);
  if (response.data.type) {
    alert(`${response.data?.type} : ${response.data?.error}`);
  }
  else {
    alert("An Error Occured")
  }
}

export default function Pages() {

  const [pages, setPages] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("");

  const [tables, setTables] = useState([]);
  const [currentTable, setCurrentTable] = useState("");

  const [tableLoading, setTableLoading] = useState(false);
  const [designerColumns, setDesignerColumns] = useState([]);

  useEffect(() => {
    if (!currentPage) return;
    getDesignerColumns(currentPage).then(res => {
      let data = res.data.data;
      setDesignerColumns(data);
      let tableNames = [];
      data.forEach(d => {
        if(!tableNames.includes(d.tableName)) tableNames.push(d.tableName)
      })
      setTables(tableNames);
    }).catch(errorHandler);
  }, [currentPage])

  useEffect(() => {
    if(!currentTable) return;
    setTableLoading(true)
    getDesignerColumnsByTableName(currentTable, currentPage).then(res => {
      setDesignerColumns(res.data.data);
      setTableLoading(false);
    }).catch(errorHandler);
  }, [currentTable])

  useEffect(() => {
    getDistinctPages().then(res => {
      setPages(res.data.data);
      setPagesLoading(false);
    }).catch(errorHandler);
  }, []);

  const showAllInPage = () => {
    
  }

  const onRowDelete = () => {}
  const onRowEdit = () => {}

  return (
    <div className="container-fluid py-3">
      <div>
        <h3>Designer Pages</h3>
      </div>
      <hr />

      <div className='d-flex justify-content-between pb-2'>
        <h6>Pages List</h6>
        {/* <button className="btn btn-sm btn-primary"
          onClick={() => {
            // setCreatingNewTable(true);
            // setCreatingNewColumn(false);
            // setEditingRow(false);
            // setNewTableData(prev => ({ ...prev, tableName: "" }))
          }}
        >Create New Table</button> */}
      </div>

      <div className='d-flex cg-1'>
        {
          pagesLoading ? <div className="loader-sm"></div> : <></>
        }
        {
          pages.length ?
            pages.map((t, i) => <button key={i} className={`btn btn-sm btn-${t === currentPage ? 'dark' : 'success'}`} onClick={() => { setCurrentPage(t) }} >{t}</button>) :
            <div className="text-danger">No Pages</div>
        }
      </div>
      <br />
      {
        currentPage ?
          <>
            <div className='pb-2'>
              <span>Tables in <strong>{currentPage}</strong> </span>
            </div>
            <div className='d-flex cg-1'>
              {
                tables.length ?
                  tables.map((t, i) => <button key={i} className={`btn btn-sm btn-${t === currentTable ? 'dark' : 'success'}`} onClick={() => { setCurrentTable(t) }} >{t}</button>) :
                  <div className="text-danger">No Tables in this Page</div>
              }
            </div>
          </> : <></>

      }

      <div>
        <br />
            {
                tableLoading ? <div className="d-flex justify-content-center py-2">
                    <div className="loader"></div>
                </div> : <></>
            }
            <div style={{ overflowX: 'scroll' }}>
                {designerColumns.length ? <DesignerTable hideActions={true}
                  rows={designerColumns} onRowDelete={onRowDelete} onRowEdit={onRowEdit} 
                /> : 
                <div className='text-danger text-center'>No Data to Show</div>}
            </div>
      </div>

    </div>
  )
}
