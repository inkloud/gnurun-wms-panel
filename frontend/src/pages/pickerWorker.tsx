import {Header} from '../ui/header';
import {Page} from '../ui/page';

const PickerWorker = function () {
    return (
        <Page>
            <div className="pb-5 mb-5">
                <Header title="Picker Workbench" subtitle="This screen will guide operators through picking tasks." />
            </div>
        </Page>
    );
};

export default PickerWorker;
