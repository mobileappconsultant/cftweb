import React, {useReducer, useEffect } from 'react';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes } from 'constants/index';

const ViewBranch = (props:any): JSX.Element => {
    const initialState = {
        isLoading: true,
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        data:[],
        activeBranch: props?.branch,
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

    const fetchData = async () => {
        setState({
            isLoading: true,
        });

        try {
            const response = await ApiRequestClient.get(`${apiRoutes.GET_SINGLE_BRANCH}?id=${props?.branch?._id}`);
    
            setState({
                data: response?.data?.data,
                isLoading: false,
            });
        } catch (error) {
            setState({
                isLoading: false,
            });
        }

    };
   
    useEffect(() => {
        fetchData();

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);

    return(
        <>
        </>
    )
};
export default ViewBranch;