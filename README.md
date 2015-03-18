# figureGraph
Figure based graph directive for AngularJs

Demo using HTML and Javascript: http://jsfiddle.net/sdayxoyq/

# Directive Usage
```
<figure-graph value="80" id="myCanvas" opts="{{options}}"></figure-graph>  
```
### Attributes
value - Integer value in percentage

options - provide this to override default option. Default options are as follows:
```
   {
      blockDiv: [25,25,25,25],
      colorDiv: ['#9DDE68', '#A6C7E8', '#E7D57F', '#F2A9A0'],
      bg: 'transparent',
      stroke: '#d0d0d0',
      textColor: '#FF0000',
      textFont: '18px Roboto'
    }
```
