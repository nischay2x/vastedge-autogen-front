const pageList = (initial = [], action) => {
    switch(action.type) {
        case 'PAGE_LIST': return action.payload;
        default: return [];
    }
}

export default pageList;