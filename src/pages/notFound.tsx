import {Link} from 'react-router';

import {Page} from '../ui/page';

const NotFound = function () {
    return (
        <Page>
            <div className="text-center py-5">
                <h2 className="h4 mb-3 text-dark">Page not found</h2>
                <p className="text-muted">We couldn't find the page you're looking for.</p>
                <p className="mb-0">
                    <Link className="text-success fw-semibold" to="/">
                        Back to dashboard
                    </Link>
                </p>
            </div>
        </Page>
    );
};

export default NotFound;
