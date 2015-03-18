'use strict';

/**
 * Directive to generate human figure Graph.
 * Usage:
 *   <figure-graph value="80" id="myCanvas"></figure-graph>
 *
 * value - need to be in follownig format:
 * 45 (Percentage value)
 *
 * opts - provide this to override default option. Default options are as follows:
 * {
 *   red: '#F2A9A0',
 *   green: '#9DDE68',
 *   blue: '#A6C7E8',
 *   yellow: '#E7D57F'
 * }
 *
 * @author dhara.s
 */
angular.module('shared').directive('figureGraph', ['$window', function($window) {
    
    var context ;
    
    var height = 200,
        width = height * 0.5,
        smRadius = height * 0.075,
        faceRadius = 2 * smRadius,
        totalHeight = height + (2 * faceRadius),
        buffer = 10, 
        startPoint = 0;

    var pixValuesDiv = [], pixValue, valuesDiv=[];

    var opts = {
      blockDiv: [25,25,25,25],
      colorDiv: ['#9DDE68', '#A6C7E8', '#E7D57F', '#F2A9A0'],
      bg: 'transparent',
      stroke: '#d0d0d0',
      textColor: '#FF0000',
      textFont: '18px Roboto'
    };
    
    /**
     * Draw the figure on Canvas
     * @param context: Context of the canvas 
     * @param value: Value in percentage which needs to be displayed
     */
    function draw(context, value) {
      
        pixValue = (value * height)/100;
        for (var i = 0; i <= opts.blockDiv.length - 1; i++) {
          var blockVal = (opts.blockDiv[i] * height)/100;
          pixValuesDiv.push((blockVal ) );
        };
     
        valuesDiv = cummulativeArray(pixValuesDiv);

        context.beginPath();
        context.arc((width / 2), faceRadius, faceRadius, 0, Math.PI * 2, true);
        context.font = opts.textFont;
        context.fillStyle = opts.textColor;
        context.fillText(value + "%", width / 2 - (smRadius), faceRadius);

        context.moveTo(startPoint, (totalHeight - height + buffer));
        context.lineTo(startPoint, totalHeight - smRadius);

        context.arc(smRadius, totalHeight - smRadius, smRadius, Math.PI, 0, true); //Left leg Arc


        context.lineTo((2 * smRadius), totalHeight - 2 * faceRadius);
        context.lineTo((width - 2 * smRadius), totalHeight - 2 * faceRadius);
        context.lineTo((width - 2 * smRadius), totalHeight - smRadius);


        context.arc(width - smRadius, totalHeight - smRadius, smRadius, Math.PI, 0, true); //Right leg arc
        context.lineTo(width, totalHeight - height + buffer);
        context.lineTo(startPoint, totalHeight - height + buffer);

        context.strokeStyle = opts.stroke;
        context.stroke();

        context.save();
        context.clip();

        fillValue(context);
    }

    /**
     * Fills the value in the figure canvas
     * @param  {[element-context]} context Context of canvas
     * @return -
     */
    function fillValue(context) {
        for (var i = 0; i < valuesDiv.length; i++) {
            if (i === 0) {
                if (pixValue > 0) {
                    context.fillStyle = opts.colorDiv[i];
                    if (pixValue >= valuesDiv[0]) {
                        context.fillRect(startPoint + 1, totalHeight - 1, width - 2, -(pixValuesDiv[0]));
                    } else {
                        context.fillRect(startPoint + 1, totalHeight - 1, width - 2, -(pixValue));
                    }
                } else {
                    //No Data for value 0
                }
            } else {
                if (pixValue > valuesDiv[i - 1]) {
                    context.fillStyle = opts.colorDiv[i];
                    if (pixValue >= valuesDiv[i]) {
                        context.fillRect(startPoint + 1, totalHeight - valuesDiv[i - 1], width - 2, -(pixValuesDiv[i]));
                    } else {
                        context.fillRect(startPoint + 1, totalHeight - valuesDiv[i - 1], width - 2, (valuesDiv[i - 1] - pixValue));
                    }
                }
            }
        }

        context.restore();
        context.closePath();
    }

    /**
     * Function to do the cummulative sum of Array values
     * @param  {array} input Array values for which cummulative sum is required
     * @return {array}       Array of values with cummulative sum
     */
    function cummulativeArray(input) {
        return input.reduce(function(r, a) {
            if (r.length > 0)
                a += r[r.length - 1];
            r.push(a);
            return r;
        }, []);
    }

    return {
        restrict: 'AE',
        replace: true,
        scope: {
            value: '=value'
        },
        template: '<canvas id height></canvas>',
        link: function(scope, element, attrs) {
            var canvas = element
                .attr('width', width)
                .attr('height', totalHeight);
            var context = element[0].getContext('2d');
            
            if (attrs.opts) {
                angular.extend(opts, angular.fromJson(attrs.opts));
            }
            scope.$watch('value', function() {
                draw(context, scope.value);
            });
            draw(context, scope.value);
        }
    };
}]);
