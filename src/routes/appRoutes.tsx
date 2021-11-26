import React, { FC } from "react";
import { Route, Redirect } from "react-router-dom";

interface Props {
    component: any,
    layout?: any,
    isAuthProtected: boolean,
    path: string,
	exact?: boolean,
    // any props that come into the component
}
const AppRoute: FC<Props> = ({component: Component, layout: Layout, isAuthProtected, ...rest }) => (
		<Route
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
			{...rest}
			exact={true}
		/>
	);

export default AppRoute;