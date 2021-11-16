import React from 'react';
import Chart from 'react-apexcharts';
class TotalRevenue extends React.Component {
    
    state = {
      
        series: [{
          name: 'series1',
          data: [31, 40, 28, 51, 42, 109, 100]
        }, {
          name: 'series2',
          data: [11, 32, 45, 32, 34, 52, 41]
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
        

  <div id="chart">
    <Chart 
        options={this.state.options} 
        series={this.state.series} 
        type="area" height={350} 
    />
    </div>


      );
    }
  }
export default TotalRevenue;