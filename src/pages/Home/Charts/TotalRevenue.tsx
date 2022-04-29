import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React from 'react';
import Chart from 'react-apexcharts';
import { Filter } from 'tabler-icons-react';
import { extractErrorMessage, processAlertError } from 'utils';
class TotalRevenue extends React.Component {
    
    state = {
        searchData:{
          endDate: null,
          startDate: null,
        },
        isLoading: false,
        series: [
          {
          name: 'Church Project',
          data: [31, 40, 28, 51, 42, 109, 10]
        }, 
        {
          name: 'Offering',
          data: [11, 32, 45, 32, 34, 52, 41]
        },
        {
          name: 'Charity',
          data: [1, 22, 50, 3, 12, 200, 150]
        },
      ],
        
        options: {
          chart: {
            height: 350,
          },
          dataLabels: {
            enabled: false
          },
        
        },
      
      
      };
    
    handleDateChange = (e:Date, name: string) => {
      const {searchData} = this.state;
        this.setState({
            searchData: {
                ...searchData,
                [name]: e
            },
        });
    };

    fetchData =  async () => {
      this.setState({
          isLoading:true,
      });
      // @ts-ignore
      this.props.getPaymentMethodStat(this.state.searchData);
      // const apiData : any = 
      // await fetchMore({
      //             variables:{}
      //         });
      //  if(apiData.data){
      //     this.setState({
      //         dataArr: apiData?.data?.getAllTransactions,
      //         isLoading: false,
      //     }); 
      // };

      // if(!apiData.loading){
      //     this.setState({
      //         isLoading: false,
      //     });
      // };

      // if(apiData.error){
      //     this.setState({
      //         alertMessage :processAlertError(extractErrorMessage(apiData?.error)),
      //         isLoading: false,
      //     });
      // }
  };
  

    render() {
      const {searchData, isLoading} = this.state;
      return (
        

          <div id="chart" className='bg-white'>
                <div className='row'>
                  <div className='col-md-2'>
                      <div className='label-container my-2'>
                          <label>Start Date </label>
                      </div>
                      <div className=''>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                              variant="inline"
                              inputVariant="outlined"
                              value={searchData?.startDate}
                              // @ts-ignore
                              onChange={(e)=>this.handleDateChange(e, 'startDate')}
                              size='small'
                              format="MM/dd/yyyy"
                              autoOk
                          />
                          </MuiPickersUtilsProvider>
                      </div>
                  </div>
                  <div className='col-md-2'>
                      <div className='label-container my-2'>
                          <label>End Date </label>
                      </div>
                      <div className=''>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                              variant="inline"
                              inputVariant="outlined"
                              value={searchData?.endDate}
                              // @ts-ignore
                              onChange={(e)=>this.handleDateChange(e, 'endDate')}
                              size='small'
                              format="MM/dd/yyyy"
                              autoOk
                          />
                          </MuiPickersUtilsProvider>
                      </div>
                  </div>
                  <div className='col-md-2'>
                      <br />
                      <button className='mt-3 p-2 px-3 filter-btn' onClick={()=> this.fetchData()}>
                          {!isLoading? (
                              <>
                                  <Filter size={15} strokeWidth={2} color={'white'} />  Filter
                              </>
                          ):(
                              <>...Loading</>
                          )}
                          
                      </button>
                  </div>
                </div>
            <Chart 
                options={this.state.options} 
                series={this.state.series} 
                type="bar" height={400} 
            />
        </div>


      );
    }
  }
export default TotalRevenue;