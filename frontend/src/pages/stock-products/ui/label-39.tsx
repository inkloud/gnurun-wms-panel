import React, {useState} from 'react';

export const Label39: React.FC = function () {
    const [label39, setLabel39] = useState('');

    const handlePrint = () => {
        const url = `#/stock-products/label?code39=${label39}`;
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (win) win.opener = null;
    };

    return (
        <>
            <hr className="my-4" />
            <div className="my-3 row">
                <div className="col-md-8 col-sm-8 px-0">
                    <input
                        className="form-control"
                        type="text"
                        id="label39"
                        value={label39}
                        onChange={(e) => setLabel39(e.target.value)}
                    />
                </div>
                <div className="col-md-4 col-sm-4 px-0 text-end">
                    <button className="btn btn-warning text-white" type="button" onClick={handlePrint}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                            <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z"/>
                        </svg>
                        Print code39
                    </button>
                </div>
            </div>
        </>
    );
};
