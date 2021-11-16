import React from 'react';
import './App.css';
import {privateRoutes, publicRoutes} from 'routes/index';
import AppRoute from 'routes/appRoutes';
import { Switch, Router, Route } from "react-router-dom";
import { history } from "helpers";
import AuthLayout from 'Layouts/AuthLayout';
import DashboardLayout from 'Layouts/DashboardLayout';
const App = () :JSX.Element => {
  return (
      <>
        <React.Fragment>
				<Router history={history}>
					<Switch>
						{publicRoutes.map((route, idx) => (

                <AppRoute
                  path={route.path}
                  layout={AuthLayout}
                  component={route.component}
                  key={idx}
                  isAuthProtected={false}
                />
            
						))}
            {privateRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={DashboardLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
              />
            ))}
					</Switch>
				</Router>
			</React.Fragment>
      </>
  )
};

export default App;
