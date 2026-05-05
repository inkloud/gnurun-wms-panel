import type {Operation} from '../hooks/operations/types';

const operations: Operation[] = [
    {
        name: 'Picker',
        description: 'Select and coordinate resources for upcoming deployments.',
        id: 'picker'
    },
    {
        name: 'Stock Products',
        description: 'Search, locate, and manage warehouse product stock.',
        id: 'stock-products'
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

export const getOperations = async function (): Promise<Operation[]> {
    return operations;
};
