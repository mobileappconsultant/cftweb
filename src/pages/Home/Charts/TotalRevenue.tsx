import React from 'react';
import Chart from 'react-apexcharts';
class TotalRevenue extends React.Component {
    
    state = {
      
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
    

  

    render() {
      return (
        

  <div id="chart" className='bg-white'>
    <Chart 
        options={this.state.options} 
        series={this.state.series} 
        type="area" height={400} 
    />
    </div>


      );
    }
  }
export default TotalRevenue;