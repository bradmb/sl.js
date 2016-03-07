module SLjs.Hours {
    "use strict";

    export class Validation {
        /**
         * Validates that we are currently within the authorized work hours (if configured)
         */
        IsDuringWorkHours(): boolean {
            if (Config.workDates === undefined || Config.workDates === null) {
                return true;
            }

            var isWorkDay = true;
            var currentDate = new Date();

            switch (currentDate.getDay()) {
                case 0:
                    isWorkDay = Config.workDates.sunday !== undefined
                                && Config.workDates.sunday !== null
                                && Config.workDates.sunday;
                    break;
                case 1:
                    isWorkDay = Config.workDates.monday !== undefined
                        && Config.workDates.monday !== null
                        && Config.workDates.monday;
                    break;
                case 2:
                    isWorkDay = Config.workDates.tuesday !== undefined
                        && Config.workDates.tuesday !== null
                        && Config.workDates.tuesday;
                    break;
                case 3:
                    isWorkDay = Config.workDates.wednesday !== undefined
                        && Config.workDates.wednesday !== null
                        && Config.workDates.wednesday;
                    break;
                case 4:
                    isWorkDay = Config.workDates.thursday !== undefined
                        && Config.workDates.thursday !== null
                        && Config.workDates.thursday;
                    break;
                case 5:
                    isWorkDay = Config.workDates.friday !== undefined
                        && Config.workDates.friday !== null
                        && Config.workDates.friday;
                    break;
                case 6:
                    isWorkDay = Config.workDates.saturday !== undefined
                        && Config.workDates.saturday !== null
                        && Config.workDates.saturday;
                    break;
            }

            if (!isWorkDay) {
                return false;
            }

            var currentHourUtc = currentDate.getUTCHours();
            if (Config.workDates.stopHourUtc < Config.workDates.startHourUtc) {
                if (Config.workDates.startHourUtc < currentHourUtc && Config.workDates.stopHourUtc > currentHourUtc) {
                    return false;
                }
            } else {
                if (Config.workDates.startHourUtc > currentHourUtc || Config.workDates.stopHourUtc < currentHourUtc) {
                    return false;
                }
            }

            var currentMinutes = currentDate.getMinutes();
            if (Config.workDates.startHourUtc === currentHourUtc && Config.workDates.startMinutes >= currentMinutes) {
                return false;
            }

            if (Config.workDates.stopHourUtc === currentHourUtc && Config.workDates.stopMinutes <= currentMinutes) {
                return false;
            }

            return true;
        }
    }
}