import {useAuth} from '../hooks';
import {usePicker} from '../hooks/use-picker';
import {Page} from '../ui/page';

const Picker = function () {
    const {data: authData} = useAuth();
    const {data: operatorCandidates, error} = usePicker(authData!.access_token);

    console.log(operatorCandidates);

    return (
        <Page>
            <header className="mb-4">
                <h1 className="h2 mb-1 text-dark">Picker</h1>
                <p className="text-muted mb-0">Select and coordinate resources for upcoming deployments.</p>
            </header>
            <div className="text-muted text-center py-5">Picker workspace coming soon.</div>
        </Page>
    );
};

export default Picker;
