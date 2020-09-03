/**
 * 
The MIT License (MIT)
 
Copyright (c) 2020 ZhaiXiaoWai(https://www.zhaixiaowai.com)
 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
*/
const conversionChar = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
let _conversionCharIndex;
const getConversionCharIndex = function () {
    if (_conversionCharIndex) return _conversionCharIndex;
    _conversionCharIndex = {};
    for (let index = 0; index < conversionChar.length; index++) {
        const char0 = conversionChar[index];
        _conversionCharIndex[char0] = index;
    }
    return _conversionCharIndex;
};
export default class ShortGuid {
    /**
     * 简化guid,缩短到22位
     * @param {string} guid 
     */
    static short(guid) { 
          if (guid.length !== 36) {
              throw "guid格式异常";
          }
          let value = "0" + guid.replace(/-/g, "");
          if (value.length !== 33) {
              throw "guid格式异常";
          }
          let result = "";
          for (let index = 0; index < 11; index++) {
            let start = index * 3;
            const str = parseInt(value[start] + value[start + 1] + value[start + 2], 16);
            result += conversionChar[Math.floor(str / 64)] + conversionChar[str % 64];
          }
          return result; 
    }
    /**
     * 复原guid
     * @param {string} shortGuid 
     */
    static restore(shortGuid) {
        if (shortGuid.length !== 22) throw "short-guid格式异常";
        let conversionCharIndex = getConversionCharIndex();
        let result = "";
        for (let index = 0; index < 22; index += 2) {
            let u = (conversionCharIndex[shortGuid[index]] * 64 + conversionCharIndex[shortGuid[index + 1]]).toString(16).padStart(3, "0");
            if (index === 0 && u[0] === "0") {
                u = u.substr(1);
            }
            result += u;
        }
        return `${result.substr(0, 8)}-${result.substr(8, 4)}-${result.substr(12, 4)}-${result.substr(16, 4)}-${result.substr(20)}`;
    }
}