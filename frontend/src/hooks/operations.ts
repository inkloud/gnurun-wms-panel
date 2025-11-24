export type Operation = {
    name: string;
    description: string;
    id: string;
};

const operations: Operation[] = [
    {
        name: 'Picker',
        description: 'Select and coordinate resources for upcoming deployments.',
        id: 'picker'
    },
    {
        name: 'Dummy Template',
        description: 'Spin up a sandbox template to prototype new workflows quickly.',
        id: 'dummy-template'
    },
    {
        name: 'Reports',
        description: 'Review usage trends and export insights for stakeholders.',
        id: 'reports'
    }
];

export const useOperations = function (): Operation[] {
    return operations;
};
