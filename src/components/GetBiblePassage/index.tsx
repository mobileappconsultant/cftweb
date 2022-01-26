import { useQuery } from '@apollo/client';
import { GET_BIBLE_PASSAGE } from 'GraphQl/Queries';
import React, {useReducer, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { extractErrorMessage, processAlertError, splitBiblePassage } from 'utils';

interface propsObject {
    biblePassage : string;
    index: number;
    updatePassageText: Function;
  }
const GetBiblePassage = (props: propsObject):JSX.Element => {
    const initialState = {
        
        alertMessage:{},
        isLoading: true,
    };
   
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {isLoading} = state;
    const {biblePassage, updatePassageText, index} = props;
    const { data, loading, error } = useQuery(GET_BIBLE_PASSAGE,{variables: splitBiblePassage(biblePassage)});
    useEffect(() => {
        if(data){
            updatePassageText({refrence :biblePassage, text: data?.getBibleBookVerse?.text}, index);
            // setState({
            //     dataArr: data?.getAllBranch,
            //     activeDataObj: data?.getAllBranch? data?.getAllBranch[0] : {},
            // });
           
        };

        if(!loading){
            setState({
                isLoading: false,
            });
        };

        if(error){
            
            setState({
                alertMessage :processAlertError(extractErrorMessage(error)),
            })
        }
        
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [data]);

   
    return(
        <>
            <div className='mt-2'>
                {biblePassage}
            </div>
            <div className='text-muted font-italic mt-1'>
                {data?.getBibleBookVerse?.text}
            </div> 
        </>
    );

};
export default GetBiblePassage;