import React from 'react';

import {AuthContext} from './authContext';

export const useAuth = function () {
    const context = React.useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
