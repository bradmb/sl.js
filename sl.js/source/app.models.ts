/**
  * The initialization config for SL.js
  * @param token Your Slack API token
  * @param channel The channel that this script will run inside
  * @param visitorName The name of the user who is using this interface. Will prompt for a name if left null/undefined
  * @param visitorIcon The icon to use for displaying next to the user's message. Will default to a predefined image if left null/undefined
  * @param element The span or div on your page where we should render the script
  * @param applicatioName The name that appears next to the user's name in the channel,
  *                       used for clearly identifying where this user is coming from
  * @param supportGroupName The title displayed next to the users who are responding from Slack
  * @param workDates The start and stop date/times that you are generally available for support. Won't prevent
  *                  messages from coming in, but will display an after-hours notice
  * @param position Where the application is displayed (left, right, float)
  */
module SLjs.Models {
    "use strict";

    export interface ISLConfig {
        token: string;
        channel: string;
        visitorName?: string;
        visitorIcon?: string;
        element: string;
        applicationName?: string;
        supportGroupName?: string;
        workDates?: ISLConfigWorkHours;
        position?: string;
    }

    export interface ISLConfigWorkHours {
        sunday: boolean;
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
        startHourUtc: number;
        startMinutes: number;
        stopHourUtc: number;
        stopMinutes: number;
    }

    export interface ISLMessage {
        isImportantMessage?: boolean;
        isErrorMessage?: boolean;
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

    export interface ISLSocketPresenceChange {
        user: string;
        presence: string;
    }

    export interface ISLSocketMessage {
        channel: string;
        reply_to: number;
        text: string;
        ts: string;
        type: string;
        user: string;
        username: string;
        icons: ISLSocketMessageIcon;
    }

    export interface ISLSocketMessageChanged {
        channel: string;
        event_ts: string;
        message: ISLSocketMessage;
        ts: string;
        type: string;
        subtype: string;
    }

    export interface ISLSocketMessageIcon {
        emoji: string;
        image_64: string;
    }
}