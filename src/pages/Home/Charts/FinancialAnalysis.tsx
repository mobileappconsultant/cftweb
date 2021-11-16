import React from 'react';
import Chart from 'react-apexcharts';

class FinancialAnalysis extends React.Component {
    
    state = {
          
        series: [42, 47, 52, 58, 65],
        options: {
          chart: {
            width: 380,
            // type: 'polarArea'
          },
          labels: ['Rose A', 'Rose B', 'Rose C', 'Rose D', 'Rose E'],
          fill: {
            opacity: 1
          },
          stroke: {
            width: 1,
            colors: undefined
          },
          yaxis: {
            show: false
          },
        //   legend: {
        //     position: 'bottom'
        //   },
          plotOptions: {
            polarArea: {
              rings: {
                strokeWidth: 0
              },
              spokes: {
                strokeWidth: 0
              },
            }
          },
          theme: {
            monochrome: {
              enabled: true,
              //shadeTo: 'light',
              shadeIntensity: 0.6
            }
          }
        },
      
      
      };
    
  

    render() {
      return (
        

  <div id="chart">
    <Chart 
        options={this.state.options} 
        series={this.state.series} 
        type="polarArea" height={350} 
    />
    </div>


      );
    }
  }
export default FinancialAnalysis;