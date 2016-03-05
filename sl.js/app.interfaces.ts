/**
    * The initialization config for SL.js
    * @param webhookUrl The location of where to send commands to in Slack
    * @param element The span or div on your page where we should render the script
    * @param visitorName The name of the user who is using this interface. Will prompt for a name if left null/undefined
    * @param visitorIcon The icon to use for displaying next to the user's message. Will default to a predefined image if left null/undefined
    * @param applicatioName The name that appears next to the user's name in the channel, used for clearly identifying where this user is coming from
    * @param useServerSideFeatures If true, we will route requests through a server. In this case, your webhookUrl parameter should be your server instead of Slack
*/
module SLjs.Models {
    export interface SLconfig {
        token: string;
        channel: string;
        visitorName?: string;
        visitorIcon?: string;
        element: string;
        applicationName?: string;
        useServerSideFeatures?: boolean;
    }

    export interface SLMessage {
        text: string;
        username: string;
        icon_emoji: string;
    }

    export interface SLAttachment extends SLMessage {
        attachments: SLAttachmentItem[];
    }

    export interface SLAttachmentItem {
        title: string;
        text: string;
        color: string;
    }
}