(function() {

  var root = this;

  var API_BASE = 'https://api.conekta.io/';

  var HEADERS = {
    'Accept': 'application/vnd.example.v1',
    'Content-type': 'application/json'
  };

  var Charge = function(ref) {
    var conekta = ref;
    return {
      create: function(params) {
        params['endpoint'] = 'charges';
        params['method'] = 'post';
        conekta.load(params);
      }
    }
  }

  var Event = function(ref) {
    var conekta = ref;
    return {
      all: function(params) {
        params['endpoint'] = 'events';
        conekta.load(params);
      }
    }
  }

  var Conekta = function() {
    this.Charge = new Charge(this);
    this.Event = new Event(this);
  };

  Conekta.prototype.api_key = '';

  Conekta.prototype.build_request = function(args) {
    HEADERS['Authorization'] = 'Token token="' + this.api_key + '"';
    var absolute_path = API_BASE + args.endpoint;
    var xhr = null;
    var params = {
      url: absolute_path,
      headers: HEADERS
    }
    if (args.method == 'get')
      params['qs'] = args.params;
    else
      params['form'] = args.params;
    if (typeof module !== 'undefined' && module.exports) {
      xhr = require('request');
      xhr[args.method](params, function(error, response, body) {
        if (response.statusCode != 200 && response.statusCode != 201) {
          args.error(JSON.parse(body));
        } else {
          args.success(JSON.parse(body));
        }
      });
      return false;
    } else {
      var activexmodes = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
      if (window.ActiveXObject) {
        for (var i=0; i < activexmodes.length; i++) {
          try {
            xhr = new ActiveXObject(activexmodes[i]);
          } catch(e) {}
        }
      } else {
        xhr = new XMLHttpRequest();
      }
      var url = params.url;
      var form = null;
      if (args.method == 'get') {
        if (args.params != {}) {
          var query = '?';
          for (var param in args.params) {
            query += param + '=' + args.params[param] + '&';
          }
          url += query.substring(0, query.length - 1);
        }
      } else {
        var form = new FormData();
        for (var param in args.params) {
          fd.append(param, args.params[param]);
        }
      }
      xhr.open(args.method, url, true);
      for (var header in params.headers) {
        xhr.setRequestHeader(header, params.headers[header]);
      }
      xhr.onload = function() {
        args.success(JSON.parse(xhr.responseText));
      }
      xhr.onerror = function() {
        args.error(JSON.parse(xhr.responseText));
      }
      xhr.send(form);
      return false;
    }
  }

  Conekta.prototype.load = function(data) {
    var args = {
      endpoint: data.endpoint,
      method: data.method || 'get',
      params: data.params || {},
      success: data.success || function() {},
      error: data.error || function() {}
    };
    return this.build_request(args);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = new Conekta();
  } else {
    root.conekta = new Conekta();
  }

})();
