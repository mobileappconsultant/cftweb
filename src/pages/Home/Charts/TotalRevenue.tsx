import moment from 'moment';
import React from 'react';
import Chart from 'react-apexcharts';

class TotalRevenue extends React.Component {
    
    state = {
        searchData:{
          endDate: null,
          startDate: null,
        },
        isLoading: false,
        
        options: {
          chart: {
            height: 350,
          },
          dataLabels: {
            enabled: false
          },
        
        },
      
      
      };

  

    render() {
      const series = [{
        data: [{
          x: 'Donations',
          // @ts-ignore
          y: this.props.data.totalDonations
        }, {
          x: 'Offerings',
          // @ts-ignore
          y: this.props.data.totalOfferings
        }, {
          x: 'Welfare',
          // @ts-ignore
          y: this.props.data.totalWelfare
        }]
      }];
      return (
        

          <div id="chart" className='bg-white'>
            {/* @ts-ignore */}
            {this.props?.date?.startDate && (
              <>
                {/* @ts-ignore */}
                <h6 className='mt-3'>Amount generated from {moment(this.props?.date?.startDate).format("YYYY-MM-DD")} {this.props?.date?.endDate && (<> to {moment(this.props?.date?.endDate).format("YYYY-MM-DD")} </> )} </h6>
              </>
            )}
              
            <Chart 
                options={this.state.options} 
                series={series} 
                type="bar" height={400} 
            />
        </div>


      );
    }
  }
export default TotalRevenue;