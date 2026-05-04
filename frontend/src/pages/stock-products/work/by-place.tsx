import React, {useState} from 'react';

export const SearchByPlace: React.FC = function () {
    const [location, setLocation] = useState('');

    const handleSearch = () => {
        const url = `/api/warehouse/search-by-shelf?wh_place=${location}`;
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (win) win.opener = null;
    };

    return (
        <div className="my-3 row">
            <label htmlFor="searchByPlace" className="col-12 px-0 form-label">
                Search Products by place:
            </label>
            <div className="col-md-10 col-sm-10 px-0">
                <input
                    id="searchByPlace"
                    className="form-control"
                    placeholder="X.00.00"
                    maxLength={7}
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>
            <div className="col-md-2 col-sm-2 px-0 text-end">
                <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zm-5.242 1.156a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};
