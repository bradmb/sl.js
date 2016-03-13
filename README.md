# sl.js #

*A plugin-free JavaScript support client for Slack*

This script was designed based on a need I had to provide a simple Slack support interface for end users of an application, but also as a challenge to myself to build a full JavaScript plugin without using jQuery (which I have become extremely comfortable using for everything).

----------

## How it works ##

When a user pulls up this support window, it will establish a websocket connection to the Slack API, pulling messages back in real time.

As more than one user could be in the support channel at a time, messages to users of this interface are filtered, requiring you to specify a unique id at the beginning of your message in Slack.

Not only will this allow you and your team to chat between each other about the question without it spamming the user, but it will also ensure that messages directed to that user don't show up in other user windows.

The first message from a user sent from this interface will include a message attachment that instructs how to reply to this user by using their unique id. The unique id will also show next to the user's name in each message they send.

----------

## What it looks like ##
This is the display for the default "float" configuration. If docking to the left/right side of the screen, you will instead get a narrow interface that extends from the top to the bottom of your page.

### The welcome screen (if you don't pass a name in the config) ###
<img src="http://i.imgur.com/SyIIp3o.png" width="500" />

### The chat interface with an ongoing conversation ###
<img src="http://i.imgur.com/IXlHfFL.png" width="500" />

### What it looks like from a Slack channel ###
<img src="http://i.imgur.com/n1NcOYH.png" width="500" />

----------

## Requirements ##
1. The .css and .js files from this script included in your page
2. [A Slack API Token](https://api.slack.com/tokens)
3. [The Slack Channel ID](https://api.slack.com/methods/channels.list/test) for the channel that you want to run this script in

----------

## How to install ##
Download a copy of the [latest release from the releases page](https://github.com/bradmb/sl.js/releases) and reference them in your code.

If you're using Visual Studio, simply grab the file off NuGet to ensure you have access to the latest package at all times:

```PowerShell
PM> Install-Package sl.js -Pre
```

## How to setup ##

Your basic configuration items are simple: Your Slack token, the Slack Channel ID, and the DIV where this will use as the spot where all the elements are rendered:
```javascript
var slConfig = {
    token: 'SLACK-TOKEN',
    channel: 'SLACK-CHANNEL',
    element: 'PAGE-DIV-ID'
};
```


To bind this interface to a button that will display on click, use this:
```javascript
var sl = new SLjs.Button('BUTTON-ID', slConfig);
```

To bring up the interface immediately (no binding to a button), simply call this:
```javascript
var sl = new SLjs.Interface(slConfig);
```

## Extra configuration options ##

The configuration options listed above are the *minimum* options required. You are free to fill in additional parameters, including:

Parameter | Type | Description | Options
--- | --- | --- | ---
visitorName | string | If filled out, the script will skip the question that asks the user for their name. Fill this in if you have some way to automatically identify a user's name | N/A
visitorIcon | string | This defaults to the *:speech_balloon:* emoji in Slack, but feel free to change this to any other emoji (default or custom) from your Slack instance. | N/A
applicationName | string | This will override the default application name (SL.js) with your own. It's recommended you fill this parameter out, as it will show up to the user and in your Slack channel, allowing multiple sites or pages to point at one Slack channel, while easily identifying where the visitor is coming from. | N/A
supportGroupName | string | This shows in the user support interface, and will show what team the user is talking to. When the interface shows messages coming from Slack, it will attempt to show the Slack user's first name only, followed by this support group name. By default, this will show "*Support Team*". | N/A
position | string | Allows for docking the support interface to the left, right, or floating it in the center of the page. By default, this will float in the center of the page.| left, right, float
workDates | object | Allows you to specify the standard work hours that support is generally available. This will not prevent users from submitting messages, but display a notice that support may not be available. By responding to the user in Slack, this notice will be removed so the user can have a normal support conversation. | See Below

## Work Dates: How To Configure ##
Start hour and stop hour must be provided using the UTC time zone. You can leave out a day of the week and it will consider that a non-working day.

**Example parameter configuration for work dates**
```javascript
workDates: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    startHourUtc: 15,
    startMinutes: 0,
    stopHourUtc: 1,
    stopMinutes: 30
}
```
