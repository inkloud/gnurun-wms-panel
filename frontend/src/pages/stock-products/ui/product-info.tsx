import React, {useEffect, useState} from 'react';

import {getStockRT, logEvent} from '../../../api/stock-products';
import type {StockProduct} from '../../../api/stock-products/types';
import {useAuth} from '../../../hooks/auth';

export const ProductInfo: React.FC<{product: StockProduct}> = function ({product}) {
    const {data: authData} = useAuth();
    const [stockRT, setStockRT] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const token = authData!.access_token;
            const userId = authData!.auth_user.username;
            const res = await getStockRT(product.product_stock_id, token);
            if (res) {
                setStockRT(res.stock);
                logEvent('LOG STOCK PRODUCTS', 'RESULT STOCK IN REAL TIME', product.product_stock_id, 0, {json_log: res, user: userId}, token);
            }
        };
        if (product) fetch();
    }, [product.product_stock_id, authData]);

    const title = product.title?.it ?? '';
    const photo = Array.isArray(product.photos) ? product.photos[0] : '';

    return (
        <>
            <div className="my-3 row">
                <div className="col-3 text-center px-0">
                    <img
                        src={photo}
                        alt={title}
                        className="img-thumbnail"
                        style={{cursor: 'pointer'}}
                        onClick={() => setShowModal(true)}
                    />
                </div>
                <div className="col-9">
                    <h6>
                        <a
                            href={`/p/wh-${product.product_stock_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {title}
                        </a>
                        {stockRT !== null && <span className="ms-1 text-muted">({stockRT})</span>}
                    </h6>
                </div>
            </div>

            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
                    onClick={() => setShowModal(false)}
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                            </div>
                            <div className="modal-body">
                                <img src={photo} alt={title} style={{width: '100%'}} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
