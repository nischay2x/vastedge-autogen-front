import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom"

export default function Sidebar() {

    const [currentPath, setCurrentPath] = useState("/");
    const location = useLocation();
    useEffect(() => {
        setCurrentPath(location.pathname);
    }, [location])

    return (
        <div className="d-flex flex-column w-100 sidebar-hold">
            <Link to="/" className={`navs ${currentPath === "/" ? 'active' : "" }`}>Home</Link>
            <Link to="/pages" className={`navs ${currentPath === "/pages" ? 'active' : "" }`}>Pages</Link>
            <Link to="/datasets" className={`navs ${currentPath === "/datasets" ? 'active' : "" }`}>Datasets</Link>
        </div>
    )
}
