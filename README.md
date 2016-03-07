# sl.js #

*A plugin-free JavaScript support client for Slack*

This script was designed based on a need I had to provide a simple Slack support interface for end users of an application, but also as a challenge to myself to build a full JavaScript plugin without using JQuery (which I have become extremely comfortable using for everything).


----------

## How to setup ##
Download a copy of the [latest release from the releases page](https://github.com/bradmb/sl.js/releases) and reference them in your code.

You'll also need to grab your Slack token (or generate a new one) and locate the channel id for the Slack channel you want this script to run in.

Running the script will fully display the interface, but a button binding will be coming soon. Until then, you will need to setup your own binding on a button to initialize the code.

To bring up the interface, simply call this:

    var slConfig = {
        token: 'SLACK-TOKEN',
        channel: 'SLACK-CHANNEL',
        element: 'PAGE-DIV-ID'
    };

    var sl = new SLjs.Application(slConfig);

The configuration options listed above are the *minimum* options required. You are free to fill in additional parameters, including:

**visitorName** [*string*]: If filled out, the script will skip the question that asks the user for their name. Fill this in if you have some way to automatically identify a user's name
 
**visitorIcon** [*string*]: This defaults to the *:speech_balloon:* emoji in Slack, but feel free to change this to any other emoji (default or custom) from your Slack instance.

**applicationName** [*string*]: This will override the default application name (SL.js) with your own. It's recommended you fill this parameter out, as it will show up to the user and in your Slack channel, allowing multiple sites or pages to point at one Slack channel, while easily identifying where the visitor is coming from.

**supportGroupName** [*string*]: This shows in the user support interface, and will show what team the user is talking to. When the interface shows messages coming from Slack, it will attempt to show the Slack user's first name only, followed by this support group name. By default, this will show "*Support Team*".

**workDates** [*object*]: Allows you to specify the standard work hours that support is generally available. This will not prevent users from submitting messages, but display a notice that support may not be available. By responding to the user in Slack, this notice will be removed so the user can have a normal support conversation.

Start hour and stop hour must be provided using the UTC time zone. You can leave out a day of the week and it will consider that a non-working day.

**Example parameter configuration for work dates**

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


----------

## How it works ##

When a user pulls up this support window, it will establish a websocket connection to the Slack API, pulling messages back in real time.

As more than one user could be in the support channel at a time, messages to users of this interface are filtered, requiring you to specify a unique id at the beginning of your message in Slack.

Not only will this allow you and your team to chat between each other about the question without it spamming the user, but it will also ensure that messages directed to that user don't show up in other user windows.

The first message from a user sent from this interface will include a message attachment that instructs how to reply to this user by using their unique id. The unique id will also show next to the user's name in each message they send.

----------

## To do ##
- Add non-websocket backup feature
- Add server-side features (id generation, traffic routing)
- Add additional display methods (docking to left/right of page)
- Add button binding options
- Add support for parsing Slack message edits
- ~~Add support work hours~~
