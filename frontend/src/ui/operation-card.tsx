import {Link} from 'react-router';

import type {Operation} from '../hooks/operations/types';

export const OperationCard: React.FC<{operation: Operation}> = function ({operation}) {
    return (
        <div className="col-12 col-md-6 col-xl-4">
            <div className="card card-operation h-100">
                <div className="card-body d-flex flex-column">
                    <h2 className="h5 mb-2 text-dark">{operation.name}</h2>
                    <p className="text-muted flex-grow-1">{operation.description}</p>
                    <Link className="btn btn-success mt-3 align-self-start" to={`/${operation.id}`}>
                        Open {operation.name}
                    </Link>
                </div>
            </div>
        </div>
    );
};
