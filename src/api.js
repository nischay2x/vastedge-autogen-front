import axios from "axios";
import { baseUrl } from "./config.js";

export const getDistinctPages = () => axios.get(baseUrl + "/designer/pages");

export const getTables = (pageName) => {
    return pageName ? axios.get(baseUrl + '/designer/tables/' + pageName) 
    : axios.get(baseUrl + '/dataset/tables');
} 

export const getDesignerColumns = (pageName) => {
    if(pageName) return axios.get(baseUrl + "/designer/columns?pageName=" + pageName);
    else return axios.get(baseUrl + "/designer/columns");
} 

export const getDesignerColumnsByTableName = (tableName, pageName) => {
    return pageName ? axios.get(baseUrl + '/designer/columns/' + tableName + '?pageName=' + pageName) 
    : axios.get(baseUrl + '/designer/columns/' + tableName);
} 

export const getDatasetTables = () => axios.get(baseUrl + '/dataset/tables');
export const getCrudColumnsByTableName = (tableName) => axios.get(baseUrl + '/dataset/columns/' + tableName);

export const getJoinableColumnsByTableName = (tableName) => axios.get(baseUrl + '/dataset/joinable/columns/' + tableName);

export const postNewCrudColumn = (data) => {
    let formatted = formatCrudData(data)
    console.log(formatted);
    return axios.post(baseUrl + '/crud/column', formatted);
}

export const postNewDataset = (data) => {
    let formatted = formatPostDataset(data)
    console.log(formatted);
    return axios.post(baseUrl + '/dataset/column', formatted);
}

export const editDataset = (id, data) => {
    const temp = formatEditDataset(data); 
    return axios.patch(baseUrl + '/dataset/column/' + id, temp);
} 

export const deleteDataset = (id) => {
    if(confirm("Confirm Delete Dataset with Id "+id)) return axios.delete(baseUrl + '/dataset/column/' + id);
    else return;
}


export const postNewDesignerColumn = (desData, pageName, tableName, columnName, isMaster) => {
    if(!desData.displayLength) delete desData.displayLength;
    desData.isJoinColumn = desData.isJoinColumn ? 1 : 0;
    desData.applyFilter = desData.applyFilter ? 1 : 0;
    let postData = {...desData, pageName, tableName, columnName, isMaster: isMaster? 1 : 0};
    return axios.post(baseUrl + '/designer/column', postData);
}

export const editDesignerColumn = (id, data) => {
    data.applyFilter = data.applyFilter ? 1 : 0;
    data.isJoinColumn = data.isJoinColumn ? 1 : 0;
    return axios.patch(baseUrl + '/designer/column/' + id, data);
} 
export const deleteDesignerColumn = (id) => {
    if(confirm("Delete "+id)) return axios.delete(baseUrl + '/designer/column/' + id);
    else return; 
}

export const editCrudColumn = (id, data) => axios.patch(baseUrl + '/crud/column/' + id, data);
export const deleteCrudColumn = (id) => {
    if(confirm("Delete "+id)) return axios.delete(baseUrl + '/crud/column/' + id);
    else return;
}

// utility

function formatPostDataset (data) {
    let temp = data;
    Object.keys(data).forEach(k => {
        if(!data[k]) delete temp[k];
    });
    temp.allowNull = temp.allowNull ? 1 : 0;
    temp.keepUnique = temp.keepUnique ? 1 : 0;
    return temp;
}

function formatEditDataset(data) {
    delete data.id;
    let temp = data;
    Object.keys(data).forEach(k => {
        if(!data[k]) delete temp[k];
    });
    temp.allowNull = temp.allowNull ? 1 : 0;
    temp.keepUnique = temp.keepUnique ? 1 : 0;
    return temp;
}

function removeEmptyFields (data) {
    let temp = data;
    Object.keys(data).forEach(k => {
        if(!data[k]) delete temp[k];
    })
    return temp;
}

function formatCrudData(data) {
    let type = data.dataType;
    if(Object.keys(passableDataType).includes(type)){
        type = passableDataType[type];
    }
    let nConstrain = data.nullConstrain ? 1 : 0;
    delete data.id;
    return {...data, dataType: type, nullConstrain: nConstrain}
}

const passableDataType = {
    VARCHAR: "STRING",
    TEXT: "STRING",
    INT: "NUMBER",
    FLOAT: "DECIMAL",
    REAL: "DECIMAL",
    "VARBINARY(MAX)": "FILE"
}