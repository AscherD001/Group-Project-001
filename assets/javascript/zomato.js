var zheader, version, url;
var u = "https://developers.zomato.com/api/";
var Zomato = {
    init: function(opts) {
        if (opts.key !== null) {
            zheader = {
                Accept: "text/plain; charset=utf-8",
                "Content-Type": "text/plain; charset=utf-8",
                "X-Zomato-API-Key": opts.key
            };
        } else {
            console.error("Enter the key");
        }
        version = opts.version || "v2.1";
        url = u + version;
    },
    locations:function (coords, success, err) {
        if (coords.lat === null && coords.lon === null) {
          console.error("Enter the coordinates correctly");
        } else {
          // debugger;
            this.request({
              url:url+"/locations",
              headers:zheader,
              data:{
                query:coords.query,
                lat:coords.lat,
                lon:coords.lon,
                count:coords.count
              },
              success:function (response) {
                success(response);
              },
              error:function (res) {
                err(res)
              }
            });
        }
    },
    locationsDetails:function (coords, success, err) {
        // debugger;
        if (coords.entityId === null && coords.entityType === null) {
          console.error("Enter the id and type correctly");
        } else {
          // debugger;
            this.request({
              url:url+"/location_details",
              headers:zheader,
              data:{
                entity_id:coords.entity_id,
                entity_type:coords.entity_type,
              },
              success:function (response) {
                success(response);
              },
              error:function (res) {
                err(res)
              }
            });
        }
    },
    restaurant: function(resid, scb, ecb) {
        if (resid === null) {
            console.error("Enter the restaurant id correctly");
        } else {
            this.request({
                url: url + "/restaurant",
                headers: zheader,
                data: {
                    res_id: resid
                },
                success: function(response) {
                    scb(response);
                },
                error: function(res) {
                    ecb(res);
                }
            });
        }
    },
    request: function(opts) {
        var req;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            req = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }
        req.responseType = 'json';
        if (opts.type === undefined || opts.type === "GET") {
            var q = "?";
            for (var j = 0; j < Object.keys(opts.data).length; j++) {
                var element = Object.keys(opts.data)[j];
                q += element + "=" + opts.data[Object.keys(opts.data)[j]];
                if (j !== Object.keys(opts.data).length - 1) {
                    q += "&";
                }
            }
            opts.url = opts.url + q;
        }
        //setting data

        req.open(opts.type === undefined ? "GET" : opts.type, opts.url, true);
        //setting headers
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        if (opts.headers !== undefined || typeof opts.headers === "object") {
            for (var index = 0; index < Object.keys(opts.headers).length; index++) {
                req.setRequestHeader(Object.keys(opts.headers)[index], opts.headers[Object.keys(opts.headers)[index]]);
            }
        }
        req.onreadystatechange = function() {
            // console.log(req.readyState)
            if (req.readyState === 4 && req.status === 200) {
                opts.success(req.response);
            } else if (req.status === "400" || req.status === "401" || req.status === "403" || req.status === "404") {
                opts.error(req);
            } else {

            }
        };

        req.send(opts.type === "GET" ? null : opts.data);
    }
};
