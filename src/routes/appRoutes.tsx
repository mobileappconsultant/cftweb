import React, { FC } from "react";
import { Route, Redirect } from "react-router-dom";

interface Props {
    component: any,
    layout?: any,
    isAuthProtected: boolean,
    path: string,
    // any props that come into the component
}
const AppRoute: FC<Props> = ({component: Component, layout: Layout, isAuthProtected, ...rest }) => (
		<Route
            exact={true}
			{...rest}
			render={props  => {
				if(Layout){
					
					return (
					<Layout>
						<Component {...props} />
					</Layout>
				);
				}else{

					return (
						<>
							<Component {...props} />
						</>
					)
				}

				
			}}
		/>
	);

export default AppRoute;