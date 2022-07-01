import { useEffect, useState } from "react";
import { 
  getDesignerColumnsByTableName, getCrudColumnsByTableName, 
  getDistinctPages, getTables, postNewCrudColumn, postNewDesignerColumn, editDesignerColumn, deleteDesignerColumn 
} from "./api";
import DesignerTable from "./component/DesignerTable.jsx";
import Sidebar from "./component/Sidebar";
import { validCrudDataTypes, validInputFieldTypes } from "./config.js";
// import { useSelector } from "react-redux";
import "./styles.css";
// import { getPageList } from "./actions/pages";
// import { useDispatch } from "react-redux";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import DashboardHome from "./pages/DashboardHome.jsx"
import Datasets from "./pages/Datasets";
import Pages from "./pages/Pages";

export default function App () {
  return(
    <main className="d-flex w-100" style={{ height: '100vh' }}>
      <BrowserRouter>
        <div className="col-md-3 col-lg-3 col-xl-2 px-0">
          <Sidebar />
        </div>
        <div className="col-md-9 col-lg-9 col-xl-10 px-0" style={{ maxHeight: '100vh', overflowY: 'scroll' }} >
          <Routes>
            <Route exact path="/" element={<DashboardHome />} />
            <Route exact path="/datasets" element={<Datasets/>} />
            <Route exact path="/pages" element={<Pages/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </main>
  )
}

// export default function App() {
//   const [pageList, setPageList] = useState([]);
//   // const pageList = useSelector(state => state.pageList);
//   const [pageName, setPageName] = useState("");

//   const [tableList, setTableList] = useState([]);
//   const [tableName, setTableName] = useState("");
//   const [tableIsMaster, setTableIsMaster] = useState(true);
//   const [joinColumn, setJoinColumn] = useState("");

//   const [designerColumns, setDesignerColumns] = useState([]);
//   const [designerColumnData, setDesignerColumnData] = useState({
//     label: "", displayMode: "TEXT", 
//     displayLength: "", applyFilter: 0, 
//   })
//   const [crudColumns, setCrudColumns] = useState([]);
//   const [currentCrudColumn, setCurrentCrudColumn] = useState({
//     columnName: "", dataType: "STRING", tableName: "",
//     maxLength: "", nullConstrain: false
//   });
//   const [columnList, setColumnList] = useState([]);
//   const [columnName, setColumnName] = useState("");

//   const [isNewEntry, setIsNewEntry] = useState({ pageName: false, tableName: false, columnName: false });
//   const [isLoading, setIsLoading] = useState({ pageName: false, tableName: true, columnName: true });

//   const fetchTableList = (argument) => {
//     setIsLoading(prev => ({ ...prev, tableName: true }))
//     getTables(argument).then(res => {
//       setTableList(res.data.data);
//       setIsLoading(prev => ({ ...prev, tableName: false }))
//     }).catch(err => {
//       console.log(err);
//       alert("Error while fetching Table List")
//       setIsLoading(prev => ({ ...prev, tableName: false }));
//     })
//   }

//   const applyDesignerColumnResponse = (res) => {
//     const columnsData = res.data.data;
//     setDesignerColumns(columnsData)
//     if(columnsData.length){
//       setTableIsMaster(columnsData[0].isMaster)
//       setJoinColumn(columnsData[0].joinColumn || '')
//     }
//   }

//   const columnErrorHandler = (err) => {
//     console.log(err);
//     alert("Error in fetching Column Details");
//   }

//   const checkNewEntry = (e) => {
//     const value = e.target.value;
//     const fieldName = e.target.name;
//     switch(fieldName){
//       case 'pageName': {
//         setIsNewEntry(prev => (
//           { ...prev, [fieldName]: value && !pageList.includes(value) }
//         ));
//         const argument = pageList.includes(value) ? pageName : '';
//         fetchTableList(argument);
//         if(tableName && value.length > 3){
//           if(!pageList.includes(value)) {
//             getDesignerColumnsByTableName(tableName).then(applyDesignerColumnResponse).catch(columnErrorHandler)
//           } else {
//             getDesignerColumnsByTableName(tableName, pageName).then(applyDesignerColumnResponse).catch(columnErrorHandler)
//           }
//         }
//         break;
//       }

//       case 'tableName': {
//         setIsNewEntry(prev => (
//           { ...prev, [fieldName]: value && !tableList.includes(value) }
//         ));
//         if(tableList.includes(value)){
//           if(isNewEntry.pageName) {
//             getDesignerColumnsByTableName(tableName).then(applyDesignerColumnResponse).catch(columnErrorHandler)
//           } else {
//             getDesignerColumnsByTableName(tableName, pageName).then(applyDesignerColumnResponse).catch(columnErrorHandler)
//           }
//           setIsLoading(prev => ({...prev, columnName: true}))
//           getCrudColumnsByTableName(value).then(res => {
//             const crudCols = res.data.data;
//             const colList = crudCols.map(c => c.columnName);
//             setColumnList(colList);
//             setCrudColumns(crudCols);
//             setIsLoading(prev => ({...prev, columnName: false}))
//           }).catch(err => {
//             console.log(err); alert("Alert in fetching Crud Column Details");
//             setIsLoading(prev => ({...prev, columnName: false}))
//           })
//         } else {
//           setDesignerColumns([]);
//           setColumnList([]);
//         }
//         break;
//       }

//       case 'columnName': {
//         setIsNewEntry(prev => (
//           { ...prev, [fieldName]: value && !columnList.includes(value) }
//         )); 
//         if(columnList.includes(value)){
//           const cuCrudData = crudColumns.find(c => c.columnName === value);
//           console.log(cuCrudData);
//           setCurrentCrudColumn(cuCrudData);
//         }
//         break;
//       }

//       default: break;
//     }
//   }

//   const changeMultiInput = (e) => {
//     switch(e.target.name){
//       case 'pageName': setPageName(e.target.value); break;
//       case 'tableName': setTableName(e.target.value); break;
//       case 'columnName': { 
//         setColumnName(e.target.value); 
//         setCurrentCrudColumn(prev => ({...prev, columnName: e.target.value })); 
//         break; 
//       }
//       default: break;
//     }
//   }

//   const createCrudColumn = () => {
//     postNewCrudColumn({...currentCrudColumn, tableName}).then(res => {
//       const newCrudColumn = res.data.data;
//       setCrudColumns(prev => [...prev, newCrudColumn]);
//       setColumnList(prev => [...prev, newCrudColumn.columnName]);
//       alert("New Crud Column Inserted");
//     }).catch(err => {
//       console.log(err);
//       alert("Error in Posting Crud Data");
//     })
//   }

//   const createDesignerColumn = (e) => {
//     e.preventDefault();
//     postNewDesignerColumn(designerColumnData, pageName, tableName, columnName, tableIsMaster, joinColumn)
//     .then(res => {
//       const newDesData = res.data.data;
//       setDesignerColumns(prev => [...prev, newDesData]);
//       alert("Data Inserted");
//     }).catch(err => {
//       console.log(err);
//       alert("Error in Posting Designer Data");
//     })
//   }

//   useEffect(() => {
//     setIsLoading(prev => ({...prev, pageName: true}))
//     getDistinctPages().then(response => {
//       setPageList(response.data.data)
//       setIsLoading(prev => ({...prev, pageName: false}))
//     }).catch(err => {
//       console.log(err);
//       alert("Error while fetching Pages List");
//       setIsLoading(prev => ({...prev, pageName: false}))
//     })
//   }, []);

//   return (
//     <div className="container-fluid py-4">
//       <div className="col-12">
//         <h2 className="fw-500">Automation System</h2>
//       </div>
//       <div className="d-flex flex-wrap">
//         <div className="col-lg-4 col-xl-3 col-md-6 py-2">
//           <div className={`w-100 multi-input-hold ${isNewEntry.pageName ? 'new': ''}`}>
//             <label>Page Name</label>
//             <input type="text" name="pageName" list="pageList" placeholder="Choose/Enter Page Name" disabled={isLoading.pageName}
//               className="form-control" onKeyUp={checkNewEntry} value={pageName} onChange={changeMultiInput}
//               />
//             <datalist id="pageList">
//               { pageList.map((p, i) => (<option key={i} value={p} />)) }
//             </datalist>
//           </div>
//           <label>This is a New Page</label>
//         </div>

//         <div className="col-lg-4 col-xl-3 col-md-6 py-2">
//           <div className={`w-100 multi-input-hold ${isNewEntry.tableName ? 'new': ''}`}>
//             <label>Table Name</label>
//             <input type="text" name="tableName" list="tableList" placeholder="Choose/Enter Table Name" disabled={isLoading.tableName}
//               className="form-control" onKeyUp={checkNewEntry} value={tableName} onChange={changeMultiInput}
//               />
//             <datalist id="tableList">
//               { tableList.map((t, i) => (<option key={i} value={t} />)) }
//             </datalist>
//           </div>
//           <label>This is a New Table</label>
//         </div>

//         <div className="col-lg-4 col-xl-3 col-md-6 py-2">
//           <label>Table Type</label>
//           <div className="d-flex cg-1">
//             <div className="form-check">
//               <input type="radio" name="isMaster" value="1" checked={tableIsMaster} disabled={!isNewEntry.tableName && designerColumns.length}
//                 className="form-check-input" id="imt" onChange={() => {setTableIsMaster(true); setJoinColumn('');}} />
//               <label htmlFor="imt" className="form-check-label">Master</label>
//             </div>
//             <div className="form-check">
//               <input type="radio" name="isMaster" value="0" checked={!tableIsMaster} disabled={!isNewEntry.tableName && designerColumns.length}
//                 className="form-check-input" id="imf" onChange={() => {setTableIsMaster(false)}}/>
//               <label htmlFor="imf" className="form-check-label">Detail</label>
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-4 col-xl-3 col-md-6 py-2">
//           <div className={`w-100 multi-input-hold ${tableIsMaster ? 'hide': ''}`}>
//             <label>Join Column</label>
//             <input type="text" name="joinColumn" list="columnList" placeholder="Choose/Enter Join Column" disabled={!isNewEntry.tableName && designerColumns.length}
//               className="form-control" value={joinColumn} onChange={(e) => { setJoinColumn(e.target.value) }}
//               />
//             <datalist id="columnList">
//               { columnList.map((c, i) => (<option key={i} value={c} />)) }
//             </datalist>
//           </div>
//           <label>This is a New Table</label>
//         </div>

//       </div>
//       <br />
      
//       <div className="border p-2">
//         <div className="d-flex flex-wrap w-100">
//           <div className="col-lg-4 col-xl-3 col-md-6 py-2">
//             <div className={`w-100 multi-input-hold ${isNewEntry.columnName ? 'new' : ''}`}>
//               <label>Column Name</label>
//               <input type="text" name="columnName" list="columnList" placeholder="Choose/Enter Column Name" disabled={isLoading.columnName}
//                 className="form-control" onKeyUp={checkNewEntry} value={columnName} onChange={changeMultiInput}
//               />
//               <datalist id="columnList" >
//                 {columnList.map((c, i) => (<option key={i} value={c} />))}
//               </datalist>
//             </div>
//             <label>This is new Column</label>
//           </div>

//           <div className="col-lg-4 col-xl-3 col-md-6 py-2">
//             <label>Data Type</label>
//             <select name="dataType" className="form-control" value={currentCrudColumn.dataType} disabled={!isNewEntry.columnName}
//               onChange={(e) => { setCurrentCrudColumn(prev => ({ ...prev, dataType: e.target.value })) }}>
//               {
//                 validCrudDataTypes.map((d, i) => <option value={d} key={i}>{d}</option>)
//               }
//             </select>
//           </div>

//           <div className="col-lg-4 col-xl-3 col-md-6 py-2">
//             <label>Data Length</label>
//             <input type="number" name="dataLength" className="form-control" value={currentCrudColumn.maxLength} disabled={!isNewEntry.columnName}
//               onChange={(e) => { setCurrentCrudColumn(prev => ({ ...prev, maxLength: e.target.value })) }}
//               placeholder="Data Length"
//             />
//           </div>

//           <div className="col-lg-4 col-xl-3 col-md-6 py-2">
//             <label>Null Constrain</label>
//             <div className="d-flex cg-1">
//               <div className="form-check">
//                 <input type="radio" name="nullConstrain" id="nct" className="form-check-input" checked={currentCrudColumn.nullConstrain === true}
//                   disabled={!isNewEntry.columnName} onChange={() => { setCurrentCrudColumn(prev => ({ ...prev, nullConstrain: true })) }} />
//                 <label htmlFor="nct" className="form-check-label">True</label>
//               </div>
//               <div className="form-check">
//                 <input type="radio" name="nullConstrain" id="ncf" className="form-check-input" checked={currentCrudColumn.nullConstrain === false}
//                   disabled={!isNewEntry.columnName} onChange={() => { setCurrentCrudColumn(prev => ({ ...prev, nullConstrain: false })) }} />
//                 <label htmlFor="ncf" className="form-check-label">False</label>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-12 d-flex py-2">
//           <button className={`btn btn-primary ml-auto ${isNewEntry.columnName ? '' : 'hide'}`}
//             onClick={createCrudColumn}
//           >Add Coulumn</button>
//         </div>
//       </div>
//       <br />

//       <div className={`border p-2 ${columnName ? '': 'hide'}`}>
//         <form className="d-flex w-100 flex-wrap" onSubmit={createDesignerColumn}>
//           <div className="col-lg-4 col-xl-3 col-md-6 py-2">
//             <label>Label</label>
//             <input type="text" required name="label" className="form-control" value={designerColumnData.label}
//               onChange={(e) => { setDesignerColumnData(prev => ({ ...prev, label: e.target.value })) }}
//               placeholder="Label"
//             />
//           </div>
//           <div className="col-lg-4 col-xl-3 col-md-6 py-2">
//             <label>Display Mode</label>
//             <select name="displayMode" className="form-control" value={designerColumnData.dataType}
//               onChange={(e) => { setDesignerColumnData(prev => ({ ...prev, displayMode: e.target.value })) }}>
//               {
//                 validInputFieldTypes.map((t, i) => <option value={t} key={i}>{t}</option>)
//               }
//             </select>
//           </div>
//           <div className="col-lg-4 col-xl-3 col-md-6 py-2">
//             <label>Display Length</label>
//             <input type="number" name="displayLength" className="form-control" value={designerColumnData.displayLength}
//               onChange={(e) => { setDesignerColumnData(prev => ({ ...prev, displayLength: e.target.value })) }}
//               placeholder="Display Length"
//             />
//           </div>
//           <div className="col-lg-4 col-xl-3 col-md-6 py-2">
//             <label>Apply Filter</label>
//             <div className="d-flex cg-1">
//               <div className="form-check">
//                 <input type="radio" name="applyFilter" id="aft" className="form-check-input" checked={designerColumnData.applyFilter === 1}
//                   onChange={() => { setDesignerColumnData(prev => ({ ...prev, applyFilter: 1 })) }} />
//                 <label htmlFor="aft" className="form-check-label">True</label>
//               </div>
//               <div className="form-check">
//                 <input type="radio" name="applyFilter" id="aff" className="form-check-input" checked={designerColumnData.applyFilter === 0}
//                   onChange={() => { setDesignerColumnData(prev => ({ ...prev, applyFilter: 0 })) }} />
//                 <label htmlFor="aff" className="form-check-label">False</label>
//               </div>
//             </div>
//           </div>
//           <div className="col-12 d-flex">
//             <button className="btn btn-success ml-auto" type="submit">Submit</button>
//           </div>
//         </form>
//       </div>
//       <br />

//       <div style={{ overflowX : 'scroll' }}>
//         { designerColumns.length ? <DesignerTable rows={designerColumns}/> : <></> }
//       </div>
//     </div>
//   );
// }


