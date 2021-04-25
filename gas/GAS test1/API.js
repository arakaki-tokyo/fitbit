/**
 * API wrapper class
 *
 * @class API
 */
class API {
  constructor(service) {
    this._accessToken = service.getAccessToken();
  }

  _fetch(url) {
    console.log(`fetch to: ${url}`);
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: `Bearer ${this._accessToken}`
      }
    });
    return JSON.parse(response.getContentText());
  }

  /**
   * NOTICE: 
   * To get response include extended intraday values with a one-minute detail,
   * you must NOT specify endDate. (or you must specify endDate as same date)
   *
   * @param {object} object
   * @param {string} object.date yyyy-MM-dd or today.
   * @param {string} [object.endDate] yyyy-MM-dd or today. when not specified, set by "1d".
   * @param {string} [object.detailLevel] Number of data points to include. Either 1sec or 1min. when not specified, set by 1sec.
   * @param {string} [object.startTime] The start of the period, in the format HH:mm. This must bring with endTime.
   * @param {string} [object.endTime] The end of the period, in the format HH:mm. This must bring with startTime.
   * @return {*} 
   * @memberof API
   */
  getHR({
    date,
    endDate,
    detailLevel,
    startTime,
    endTime
  }) {
    const url =
      'https://api.fitbit.com/1/user/-/activities/heart/date' +
      `/${date}/${endDate ? endDate : '1d'}` +
      `/${detailLevel ? detailLevel : '1sec'}` +
      `${startTime && endTime ? `/time/${startTime}/${endTime}` : ''}` +
      '.json';

    return this._fetch(url);
  }

}