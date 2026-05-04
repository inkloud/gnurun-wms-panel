import React, {useEffect, useState} from 'react';

import {logEvent, setAttentionNote} from '../../../api/stock-products';
import type {StockProduct} from '../../../api/stock-products/types';
import {useAuth} from '../../../hooks/auth';

export const Notes: React.FC<{product: StockProduct}> = function ({product}) {
    const {data: authData} = useAuth();
    const [note, setNote] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setNote(product?.extra_specs?.attention_note?.value ?? '');
    }, [product]);

    const handleSave = async () => {
        const token = authData!.access_token;
        const userId = authData!.auth_user.username;
        const extraSpecs = {...(product.extra_specs ?? {})};

        if (note === '') {
            delete extraSpecs['attention_note'];
        } else {
            extraSpecs['attention_note'] = {value: note, visible: false};
        }

        try {
            await setAttentionNote(product.id, extraSpecs, token);
            logEvent('LOG STOCK PRODUCTS', 'SAVE ATTENTION NOTE', product.id, 0, {attention_note: note, user: userId}, token);
            setSuccess(true);
            setError(false);
        } catch {
            setError(true);
            setSuccess(false);
        }
    };

    return (
        <div className="my-3 row">
            <div className="col-md-8 col-sm-8 px-0">
                <textarea
                    className="form-control"
                    id="attention_note"
                    value={note}
                    onChange={(e) => {
                        setNote(e.target.value);
                        setSuccess(false);
                        setError(false);
                    }}
                />
            </div>
            <div className="col-md-4 col-sm-4 px-0 text-end">
                <button className="btn btn-success text-white" type="button" onClick={handleSave}>
                    <i className="bi bi-floppy"></i> Save note
                </button>
                {success && <div className="text-success small mt-1">Saved!</div>}
                {error && <div className="text-danger small mt-1">Error saving note.</div>}
            </div>
        </div>
    );
};
