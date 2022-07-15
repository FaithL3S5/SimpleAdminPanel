import React from 'react';

const Tables = React.lazy(() => import('./views/base/tables/Tables'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/service/tables', name: 'Tables', component: Tables },
];

export default routes;
