class MyDate extends Date {
  /**
   * @param {string} fmt 日時のフォーマット文字列。
   * [書式コード](https://docs.python.org/ja/3/library/datetime.html#strftime-strptime-behavior)の一部を実装
   * @return {string} フォーマット済み文字列
   * @memberof MyDate
   */
  strftime(fmt) {
    return fmt
      .replace(/%Y/g, String(this.getFullYear()))
      .replace(/%m/g, ("0" + (this.getMonth() + 1)).slice(-2))
      .replace(/%d/g, ("0" + this.getDate()).slice(-2))
      .replace(/%H/g, ("0" + this.getHours()).slice(-2))
      .replace(/%h/g, ("0" + this.getUTCHours()).slice(-2))
      .replace(/%M/g, ("0" + this.getMinutes()).slice(-2))
      .replace(/%S/g, ("0" + this.getSeconds()).slice(-2))
      .replace(/%f/g, ("00" + this.getMilliseconds()).slice(-3));
  }
}