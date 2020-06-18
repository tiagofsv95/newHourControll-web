import React from 'react';
import { Switch, Route } from 'react-router-dom';

import DailyProgress from '../pages/DailyProgress';
// import page404 from '../pages/page404';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={DailyProgress} />

      {/* <Route path="*" exact component={page404} /> */}
    </Switch>
  );
};

export default Routes;
