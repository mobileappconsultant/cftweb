import React from 'react';
import Chart from 'react-apexcharts';

class TotalRevenue extends React.Component {
    
    state = {
        searchData:{
          endDate: null,
          startDate: null,
        },
        isLoading: false,
        series: [{
          data: [{
            x: 'Donations',
            y: 10
          }, {
            x: 'Offerings',
            y: 18
          }, {
            x: 'Welfare',
            y: 13
          }]
        }],
        
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
      return (
        

          <div id="chart" className='bg-white'>
                
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