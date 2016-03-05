# sl.js
Javascript based support client for Slack that requires no third party plugins

### How to use
    var slConfig = {
        token: 'YOUR SLACK TOKEN HERE',
        channel: 'YOUR CHANNEL ID HERE',
        element: 'YOUR DIV ID HERE'
    };
  
    var sl = new SLjs.Application(slConfig);
