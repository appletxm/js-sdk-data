(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.HFAgent = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  function execCb(cb, parmas) {
    var result;

    if (cb && typeof cb === 'function') {
      result = cb(parmas);

      if (result instanceof MyPromise) {
        return result;
      } else {
        return new MyPromise(result);
      }
    }
  }

  var MyPromise =
  /*#__PURE__*/
  function () {
    function MyPromise(asynFn) {
      classCallCheck(this, MyPromise);

      this.pending = true;
      this.fullfilled = false;
      this.rejected = false;
      this.thenCb = null;
      this.catchCb = null;
      this.finalyCb = null;
      asynFn && asynFn(this.resolve.bind(this), this.reject.bind(this));
    }

    createClass(MyPromise, [{
      key: "resolve",
      value: function resolve(data) {
        this.fullfilled = true;
        execCb(this.thenCb, data);
        execCb(this.finalyCb);
      }
    }, {
      key: "reject",
      value: function reject(error) {
        this.rejected = true;
        execCb(this.catchCb, error);
        execCb(this.finalyCb);
      }
    }, {
      key: "then",
      value: function then(thenFn) {
        this.thenCb = thenFn;
      }
    }, {
      key: "catch",
      value: function _catch(catchFn) {
        this.catchCb = catchFn;
      }
    }, {
      key: "finaly",
      value: function finaly(finalyFn) {
        this.finalyCb = finalyFn;
      }
    }]);

    return MyPromise;
  }();

  function assign(target, source) {
    for (var key in source) {
      target[key] = source[key];
    }

    return target;
  }

  function doPollyfil() {
    if (!window.Promise) {
      window.Promise = MyPromise;
    }

    if (!Object.assign) {
      Object.assign = assign;
    }
  }

  function setParamsForGet(options) {
    var params = '?timer=' + new Date().getTime() + '&';
    var opP = options.params;
    var keys = Object.keys(opP);

    if (options.headers.contentType.indexOf('application/json') >= 0) {
      params = params + 'params=' + encodeURIComponent(JSON.stringify(opP));
    } else {
      for (var i = 0; i < keys.length; i++) {
        params += keys[i] + '=' + opP[key[i]] + (i === keys.length - 1 ? '' : '&');
      }
    }

    return params;
  }
  function setParamsForPost(options) {
    var params = '';
    var opP = options.params;
    var keys = Object.keys(opP);

    if (options.headers.contentType.indexOf('application/json') >= 0) {
      params = JSON.stringify(opP);
    } else if (options.headers.contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
      for (var i = 0; i < keys.length; i++) {
        params += keys[i] + '=' + encodeURIComponent(opP[keys[i]]) + (i === keys.length - 1 ? '' : '&');
      }
    } else if (options.headers.contentType.indexOf('multipart/form-data') >= 0) {
      params = '';
    } else if (options.headers.contentType.indexOf('text/xml') >= 0) {
      params = '';
    }

    return params;
  }

  function doSet(options, xhrObj) {
    //.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    var headers = options.headers;

    for (var key in headers) {
      var newKey = void 0;
      newKey = key === 'contentType' ? 'Content-Type' : key;
      xhrObj.setRequestHeader(newKey, headers[key]);
    } // if(options.method === 'POST'){
    //   xhrObj.setRequestHeader('Content-Length', options.paramsStr.length)
    // }

  }

  function doDownLoad(xhr) {
    var blob = new Blob([xhr.response], {
      type: "application/vnd.ms-excel"
    });
    var contentDisposition = xhr.getResponseHeader('content-disposition');
    var matchedObj = contentDisposition.match(/filename=([^;]+)/);
    var fileName = matchedObj && matchedObj[1] ? decodeURIComponent(matchedObj[1]) : 'download.excel';

    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
      return false;
    }

    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var body = document.querySelector('body');

    if (url.indexOf(window.location.host) < 0) {
      url = url.replace(/^(blob:)(.+)$/, function (str, $1, $2) {
        return $1 + (window.location.protocol + '//' + window.location.host + '/') + $2;
      });
    }

    a.href = url;
    a.download = fileName;
    body.appendChild(a);
    a.click();
    body.removeChild(a);
  }

  var defaultConfig = {
    method: 'GET',
    async: true,
    url: '',
    params: {},
    timeout: 30000,
    headers: {
      contentType: 'application/json; charset=UTF-8'
    }
  };
  var xhrList = {};

  var Ajax =
  /*#__PURE__*/
  function () {
    function Ajax(opts) {
      classCallCheck(this, Ajax);

      this.options = Object.assign(defaultConfig, opts);
    }

    createClass(Ajax, [{
      key: "mergeOptions",
      value: function mergeOptions(options) {
        var copyOpts = JSON.parse(JSON.stringify(this.options));
        options = Object.assign(copyOpts, options);
        return options;
      }
    }, {
      key: "createXHR",
      value: function createXHR(options) {
        var xhr;

        if (window.ActiveXObject) {
          xhr = new ActiveXObject('Microsoft.XMLHTTP');
        } else if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
        }

        if (xhr.timeout) {
          xhr.timeout = options.timeout;
        }

        return xhr;
      }
    }, {
      key: "addEventListener",
      value: function addEventListener(xhrId, resolveCb, rejectCb, options) {
        var _this = this;

        var xhr = xhrList[xhrId]['xhr'];

        if (!xhr) {
          return false;
        }

        xhr.onreadystatechange = function () {
          var resObj;
          var resText; // console.info(xhr.readyState, xhr.status)

          if (xhr.readyState === 4 && xhr.status === 200) {
            var resConType = xhr.getResponseHeader('content-type');

            if (resConType.indexOf('application/octet-stream') >= 0 || resConType.indexOf('application/x-msdownload') >= 0) {
              doDownLoad(xhr);
            } else {
              resText = xhr.responseText.replace(/^[\s\t\r\n]+|[\s\t\r\n]+$/g, '');

              if (resText) {
                resObj = resText && JSON.parse(xhr.responseText);
              }

              _this.destroyed(xhrId);

              resolveCb({
                code: '200',
                data: resObj
              });
            }
          } else if (xhr.readyState === 4 && xhr.status !== 200) {
            _this.destroyed(xhrId);

            rejectCb({
              code: '500',
              msg: xhr.response
            });
          }
        };

        if (xhr.addEventListener) {
          xhr.addEventListener('timeout', function () {
            _this.destroyed(xhrId);

            rejectCb({
              code: '10000',
              msg: 'request timeout'
            });
          });
          xhr.addEventListener('error', function (e) {
            _this.destroyed(xhrId);

            rejectCb({
              code: '500',
              msg: e
            });
          });

          if (options.onProgress && typeof options.onProgress === 'function') {
            xhr.addEventListener('progress', function (e) {
              options.onProgress(e);
            });
          }
        }
      }
    }, {
      key: "destroyed",
      value: function destroyed(xhrId) {
        if (xhrList[xhrId]) {
          delete xhrList[xhrId];
        }
      }
    }, {
      key: "prepareForAjax",
      value: function prepareForAjax(options) {
        var xhrObj;
        var xhrId;
        var resolveCb;
        var rejectCb;
        var promise;
        options = this.mergeOptions(options);
        xhrId = Math.random() + '';
        xhrList[xhrId] = {};
        xhrObj = this.createXHR(options);
        xhrList[xhrId]['options'] = options;
        xhrList[xhrId]['xhrId'] = xhrId;
        xhrList[xhrId]['xhr'] = xhrObj;
        promise = new Promise(function (resolve, reject) {
          rejectCb = reject;
          resolveCb = resolve;
        });
        return {
          options: options,
          xhrId: xhrId,
          xhrObj: xhrObj,
          promise: promise,
          resolveCb: resolveCb,
          rejectCb: rejectCb
        };
      }
    }, {
      key: "doAjax",
      value: function doAjax(options, xhrObj) {
        xhrObj.open(options.method, options.url, options.async);
        doSet(options, xhrObj);
        xhrObj.send(options.paramsStr);
      }
    }, {
      key: "get",
      value: function get(_options) {
        var params;
        _options.method = 'GET';

        var _this$prepareForAjax = this.prepareForAjax(_options),
            options = _this$prepareForAjax.options,
            xhrObj = _this$prepareForAjax.xhrObj,
            promise = _this$prepareForAjax.promise,
            resolveCb = _this$prepareForAjax.resolveCb,
            rejectCb = _this$prepareForAjax.rejectCb,
            xhrId = _this$prepareForAjax.xhrId;

        if (options.method === 'GET' && xhrObj) {
          params = setParamsForGet(options);
        }

        options.url = options.url + params;
        this.addEventListener(xhrId, resolveCb, rejectCb, options);
        this.doAjax(options, xhrObj);
        return promise;
      }
    }, {
      key: "post",
      value: function post(_options) {
        _options.method = 'POST';

        var _this$prepareForAjax2 = this.prepareForAjax(_options),
            options = _this$prepareForAjax2.options,
            xhrObj = _this$prepareForAjax2.xhrObj,
            promise = _this$prepareForAjax2.promise,
            resolveCb = _this$prepareForAjax2.resolveCb,
            rejectCb = _this$prepareForAjax2.rejectCb,
            xhrId = _this$prepareForAjax2.xhrId;

        if (options.method === 'POST' && xhrObj) {
          options.paramsStr = setParamsForPost(options);
        }

        this.addEventListener(xhrId, resolveCb, rejectCb, options);
        this.doAjax(options, xhrObj);
        return promise;
      }
    }, {
      key: "getBinary",
      value: function getBinary(_options) {
        var params;
        _options.method = 'GET';

        var _this$prepareForAjax3 = this.prepareForAjax(_options),
            options = _this$prepareForAjax3.options,
            xhrObj = _this$prepareForAjax3.xhrObj,
            promise = _this$prepareForAjax3.promise,
            resolveCb = _this$prepareForAjax3.resolveCb,
            rejectCb = _this$prepareForAjax3.rejectCb,
            xhrId = _this$prepareForAjax3.xhrId;

        if (options.method === 'GET' && xhrObj) {
          params = setParamsForGet(options);
        }

        options.url = options.url + params; // options.type = 'binary'

        xhrObj.responseType = "arraybuffer";
        this.addEventListener(xhrId, resolveCb, rejectCb, options);
        this.doAjax(options, xhrObj);
        return promise;
      }
    }]);

    return Ajax;
  }();

  var options = {
    serviceUrl: 'http://192.168.10.125:18080/web',
    appKey: '7ab928574cf24c0fa6cf55c8cfec26c1'
  };
  var HFAgent = {};

  function init(params) {
    options = Object.assign(options, params);
    createAjax();
  }

  function createAjax() {
    var params = {
      method: 'POST',
      url: options.serviceUrl,
      headers: {
        contentType: 'application/json; charset=UTF-8',
        appKey: options.appKey
      }
    };
    HFAgent.ajax = new Ajax(params);
  }

  function formatData(schemeKey, jsonStr) {
    var obj = JSON.parse(jsonStr);
    var dataObj = {};
    dataObj.schemeKey = schemeKey;

    for (var key in obj) {
      dataObj[key] = obj[key];
    }

    return dataObj;
  }

  function onEvent(schemeKey, jsonStr) {
    var dataList = [];

    try {
      dataList.push(formatData(schemeKey, jsonStr));
      onSend(dataList);
    } catch (err) {
      console.info('hf js sdk onEvent:', err);
    }
  }

  function onSend(dataList) {
    var ajax = HFAgent.ajax;

    if (arguments.length > 1 && typeof dataList === 'string') {
      dataList = [formatData(arguments[0], arguments[1])];
    }

    ajax.post({
      url: options.serviceUrl,
      params: dataList
    }).then(function () {})["catch"](function (err) {
      console.info('hf js sdk onSend:', err);
    });
  }

  HFAgent.init = init;
  HFAgent.onEvent = onEvent;
  HFAgent.onSend = onSend;

  if (window) {
    window.HFAgent = HFAgent;
  }

  doPollyfil();

  return HFAgent;

}));
