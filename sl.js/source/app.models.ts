/**
  * The initialization config for SL.js
  * @param webhookUrl The location of where to send commands to in Slack
  * @param element The span or div on your page where we should render the script
  * @param visitorName The name of the user who is using this interface. Will prompt for a name if left null/undefined
  * @param visitorIcon The icon to use for displaying next to the user's message. Will default to a predefined image if left null/undefined
  * @param applicatioName The name that appears next to the user's name in the channel,
  *                       used for clearly identifying where this user is coming from
  * @param useServerSideFeatures If true, we will route requests through a server. In
  *                              this case, your webhookUrl parameter should be your server instead of Slack
  */
module SLjs.Models {
    "use strict";

    export interface ISLconfig {
        token: string;
        channel: string;
        visitorName?: string;
        visitorIcon?: string;
        element: string;
        applicationName?: string;
        useServerSideFeatures?: boolean;
    }

    export interface ISLMessage {
        text: string;
        username: string;
        icon_emoji: string;
    }

    export interface ISLAttachment extends ISLMessage {
        attachments: ISLAttachmentItem[];
    }

    export interface ISLAttachmentItem {
        title: string;
        text: string;
        color: string;
    }

    export interface ISLWebsocketAuth {
        token: string;
        simple_latest: boolean;
        no_unreads: boolean;
        mpim_aware: boolean;
    }

    export interface ISLWebsocketAuthResponse {
        url: string;
        ok: boolean;
        cache_ts: number;
        cahce_ts_version: string;
        cache_version: string;
        users: ISLWebSocketAuthResponseUser[];
    }

    export interface ISLWebSocketAuthResponseUser {
        id: string;
        name: string;
        real_name: string;
        presence: string;
        profile: ISLWebSocketAuthResponseProfile;
    }

    export interface ISLWebSocketAuthResponseProfile {
        image_24: string;
        image_32: string;
        image_48: string;
        image_72: string;
    }

    export interface ISLSupportUser {
        name: string;
        presence: string;
        image: string;
    }
}