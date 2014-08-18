(function() {

  var root = this;

  var API_BASE = 'https://api.conekta.io/';
  var SCRIPT_URL = 'https://h.online-metrix.net/fp/check.js?org_id=k8vif92e&session_id=banorteixe_conekta';
  var INCLUDE_URL = 'https://s3.amazonaws.com/conektaapi_includes/';

  var HEADERS = {
    'Accept': 'application/vnd.conekta-v0.3.0+json',
    'Content-type': 'application/json'
  };

  var createSession =  function() {
    var useable_characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    var session_id = '';
    for (i = _i = 0; _i <= 30; i = ++_i) {
    session_id += useable_characters.charAt(Math.floor(Math.random() * 36));
    }
    return session_id;
  }

  var SESSION_ID = createSession();

  var Token = function(ref) {
    var conekta = ref;
    return {
      create: function(params, error, success) {
        params['endpoint'] = 'token';
        params['method'] = 'get';
        params['success'] = success || params.success;
        params['error'] = error ||params.error;
        conekta.load(params);
      }
    }
  }

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

  var Payee = function(ref) {
    var conekta = ref;
    return {
      create: function(params) {
        params['endpoint'] = 'payees';
        params['method'] = 'post';
        conekta.load(params);
      }
    }
  }

  var Payout = function(ref) {
    var conekta = ref;
    return {
      create: function(params) {
        params['endpoint'] = 'payouts';
        params['method'] = 'post';
        conekta.load(params);
      }
    }
  }


  var Conekta = function() {
    this.Charge = new Charge(this);
    this.Event = new Event(this);
    this.Token = new Token(this);
    this.Payee = new Payee(this);
    this.Payout = new Payout(this);
  };

  Conekta.prototype.public_key = void 0;
  Conekta.prototype.private_key = void 0;

  Conekta.prototype.build_request = function(args) {
    var absolute_path = API_BASE + args.endpoint;
    HEADERS['Authorization'] = 'Basic ' + this.Base64.encode(this.private_key + ':');
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
        response.statusCode;
        if (response.statusCode != 200 && response.statusCode != 201) {
          args.error(body);
        } else {
          args.success(body);
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

  Conekta.prototype.getConektaUrl = function(args) {
    
    var url = 'https://api.conekta.io/tokens/create.js?callback=jsonp2&';
    var card = args.data.card;
    card.device_fingerprint = SESSION_ID;
    for(var k in card) {
      url += 'card[' + k + ']=' + card[k] + '&';
    }
    url += '_Version=0.3.0&_RaiseHtmlError=false&auth_token=';
    url += this.public_key + '&';
    url += 'conekta_client_user_agent={"agent":"Conekta JavascriptBindings/0.3.0"}'
    return url;
  }

  Conekta.prototype.Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(input) {
      var me = this;
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4, output;
      output = "";
      chr1 = void 0;
      chr2 = void 0;
      chr3 = void 0;
      enc1 = void 0;
      enc2 = void 0;
      enc3 = void 0;
      enc4 = void 0;
      i = 0;
      input = me._utf8_encode(input);
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else {
          if (isNaN(chr3)) {
            enc4 = 64;
          }
        }
        output = output + me._keyStr.charAt(enc1) + me._keyStr.charAt(enc2) + me._keyStr.charAt(enc3) + me._keyStr.charAt(enc4);
      }
      return output;
    },
    _utf8_encode: function(string) {
      var c, n, utftext;
      string = string.replace(/\r\n/g, "\n");
      utftext = "";
      n = 0;
      while (n < string.length) {
        c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        n++;
      }
      return utftext;
    }
  }

  Conekta.prototype.create_token = function(args) {
    var me = this;
    var url = me.getConektaUrl(args);
    var xhr = require('request');
    xhr.get(url, function(err, response, body) {
      if(err) {
        args.error(err);
        return false;
      }
      var respJSON = body.replace('jsonp2(','').replace('})','}');
      respJSON = JSON.parse(respJSON);
      args.success(respJSON);
      return 
    });
  }

  Conekta.prototype.load = function(data) {
    var args = {
      endpoint: data.endpoint,
      method: data.method || 'get',
      params: data.params || {},
      success: data.success || function() {},
      error: data.error || function() {}
    };
    if(data.endpoint === 'token'){
      args.data = data.params;
      return this.create_token(args);
    }
    return this.build_request(args);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = new Conekta();
  } else {
    root.conekta = new Conekta();
  }

})();
