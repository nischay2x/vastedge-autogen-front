import { getDistinctPages } from "../api"
export const getPageList = () => async(dispatch) => {
    try {
        const { data } = await getDistinctPages();
        dispatch({type: 'PAGE_LIST', payload: data.data});
    } catch (error) {
        console.log(error);
        alert("Error in fetching Page List");
    }
}