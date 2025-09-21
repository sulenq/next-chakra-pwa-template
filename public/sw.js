if (!self.define) {
  let e,
    n = {};
  const t = (t, s) => (
    (t = new URL(t + ".js", s).href),
    n[t] ||
      new Promise((n) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = t), (e.onload = n), document.head.appendChild(e);
        } else (e = t), importScripts(t), n();
      }).then(() => {
        let e = n[t];
        if (!e) throw new Error(`Module ${t} didn’t register its module`);
        return e;
      })
  );
  self.define = (s, r) => {
    const a =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (n[a]) return;
    let c = {};
    const i = (e) => t(e, a),
      f = { module: { uri: a }, exports: c, require: i };
    n[a] = Promise.all(s.map((e) => f[e] || i(e))).then((e) => (r(...e), c));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  importScripts("/fallback-ce627215c0e4a9af.js"),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/RPRGiC962Cov5NF-5ZaKk/_buildManifest.js",
          revision: "763dd7104f56a2cce80a46249b8592d7",
        },
        {
          url: "/_next/static/RPRGiC962Cov5NF-5ZaKk/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/1006-60b3b7c1ce4852e2.js",
          revision: "60b3b7c1ce4852e2",
        },
        {
          url: "/_next/static/chunks/1241-9fae8def75e6d288.js",
          revision: "9fae8def75e6d288",
        },
        {
          url: "/_next/static/chunks/1358-afa63561ed87d628.js",
          revision: "afa63561ed87d628",
        },
        {
          url: "/_next/static/chunks/13b76428-c75990430d19f963.js",
          revision: "c75990430d19f963",
        },
        {
          url: "/_next/static/chunks/1646.a93085a0445ba909.js",
          revision: "a93085a0445ba909",
        },
        {
          url: "/_next/static/chunks/176-bab32583cced85ff.js",
          revision: "bab32583cced85ff",
        },
        {
          url: "/_next/static/chunks/2079-84bc52d5d0504553.js",
          revision: "84bc52d5d0504553",
        },
        {
          url: "/_next/static/chunks/2626716e-ac610cdbbc93170f.js",
          revision: "ac610cdbbc93170f",
        },
        {
          url: "/_next/static/chunks/2735-ed7b360fcf33e805.js",
          revision: "ed7b360fcf33e805",
        },
        {
          url: "/_next/static/chunks/3542-06df8f3f7295b1bc.js",
          revision: "06df8f3f7295b1bc",
        },
        {
          url: "/_next/static/chunks/376-c08f5d238387f70c.js",
          revision: "c08f5d238387f70c",
        },
        {
          url: "/_next/static/chunks/3860-786852e9ad3f57cd.js",
          revision: "786852e9ad3f57cd",
        },
        {
          url: "/_next/static/chunks/3930-3a7feace4c5a4b61.js",
          revision: "3a7feace4c5a4b61",
        },
        {
          url: "/_next/static/chunks/4010-4589474447c83e3e.js",
          revision: "4589474447c83e3e",
        },
        {
          url: "/_next/static/chunks/4696-b985946f093d968c.js",
          revision: "b985946f093d968c",
        },
        {
          url: "/_next/static/chunks/4bd1b696-100b9d70ed4e49c1.js",
          revision: "100b9d70ed4e49c1",
        },
        {
          url: "/_next/static/chunks/5139.e4ff9cc3669129ed.js",
          revision: "e4ff9cc3669129ed",
        },
        {
          url: "/_next/static/chunks/5246-73a5a4b8de891ebb.js",
          revision: "73a5a4b8de891ebb",
        },
        {
          url: "/_next/static/chunks/525-55e30bf624299c0c.js",
          revision: "55e30bf624299c0c",
        },
        {
          url: "/_next/static/chunks/59650de3-d4ff4cf2627a67fd.js",
          revision: "d4ff4cf2627a67fd",
        },
        {
          url: "/_next/static/chunks/6548-dfaf6387539a4df2.js",
          revision: "dfaf6387539a4df2",
        },
        {
          url: "/_next/static/chunks/6868-aa3ad78f7283a6ff.js",
          revision: "aa3ad78f7283a6ff",
        },
        {
          url: "/_next/static/chunks/7241-e6f34a19a3c1ae3c.js",
          revision: "e6f34a19a3c1ae3c",
        },
        {
          url: "/_next/static/chunks/824-6756a88c0eadfabb.js",
          revision: "6756a88c0eadfabb",
        },
        {
          url: "/_next/static/chunks/8355-ffa760e3a2f3af17.js",
          revision: "ffa760e3a2f3af17",
        },
        {
          url: "/_next/static/chunks/8363-69461ed8ce77a02a.js",
          revision: "69461ed8ce77a02a",
        },
        {
          url: "/_next/static/chunks/8832-1c954bf890619d99.js",
          revision: "1c954bf890619d99",
        },
        {
          url: "/_next/static/chunks/9320-8dec2d1af6586935.js",
          revision: "8dec2d1af6586935",
        },
        {
          url: "/_next/static/chunks/9410-881ae96f29458d05.js",
          revision: "881ae96f29458d05",
        },
        {
          url: "/_next/static/chunks/9461-1d375590f72a249b.js",
          revision: "1d375590f72a249b",
        },
        {
          url: "/_next/static/chunks/962-f068cd29f64350a3.js",
          revision: "f068cd29f64350a3",
        },
        {
          url: "/_next/static/chunks/9964-cf07c8c44923d363.js",
          revision: "cf07c8c44923d363",
        },
        {
          url: "/_next/static/chunks/app/%5B...catchall%5D/page-6815f0f61a2a24f8.js",
          revision: "6815f0f61a2a24f8",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-767eb2a9c661f6c0.js",
          revision: "767eb2a9c661f6c0",
        },
        {
          url: "/_next/static/chunks/app/demo/page-81f5497d967813bb.js",
          revision: "81f5497d967813bb",
        },
        {
          url: "/_next/static/chunks/app/layout-8c0aed50250036d0.js",
          revision: "8c0aed50250036d0",
        },
        {
          url: "/_next/static/chunks/app/maintenance/page-056bd7bdca7bd398.js",
          revision: "056bd7bdca7bd398",
        },
        {
          url: "/_next/static/chunks/app/manifest.webmanifest/route-504d0b063dcc0efa.js",
          revision: "504d0b063dcc0efa",
        },
        {
          url: "/_next/static/chunks/app/offline/page-ee4d2438e356fde8.js",
          revision: "ee4d2438e356fde8",
        },
        {
          url: "/_next/static/chunks/app/page-667b93a5abf50aaf.js",
          revision: "667b93a5abf50aaf",
        },
        {
          url: "/_next/static/chunks/app/pvt/dashboard/page-0129935035cdd584.js",
          revision: "0129935035cdd584",
        },
        {
          url: "/_next/static/chunks/app/pvt/layout-06cae540e5c02817.js",
          revision: "06cae540e5c02817",
        },
        {
          url: "/_next/static/chunks/app/pvt/master-data/category/page-bfbb90f921cadcc2.js",
          revision: "bfbb90f921cadcc2",
        },
        {
          url: "/_next/static/chunks/app/pvt/master-data/user/page-e1198040226ac52a.js",
          revision: "e1198040226ac52a",
        },
        {
          url: "/_next/static/chunks/app/pvt/settings/display/page-ee272abdc230eebc.js",
          revision: "ee272abdc230eebc",
        },
        {
          url: "/_next/static/chunks/app/pvt/settings/layout-0f68d282b3596cc9.js",
          revision: "0f68d282b3596cc9",
        },
        {
          url: "/_next/static/chunks/app/pvt/settings/page-298a0ad61f62955c.js",
          revision: "298a0ad61f62955c",
        },
        {
          url: "/_next/static/chunks/app/pvt/settings/permissions/page-3fe219b137f3b96b.js",
          revision: "3fe219b137f3b96b",
        },
        {
          url: "/_next/static/chunks/app/pvt/settings/profile/page-78ad588607e78293.js",
          revision: "78ad588607e78293",
        },
        {
          url: "/_next/static/chunks/app/pvt/settings/regional/page-9aa5425c0e22203d.js",
          revision: "9aa5425c0e22203d",
        },
        {
          url: "/_next/static/chunks/framework-32492dd9c4fc5870.js",
          revision: "32492dd9c4fc5870",
        },
        {
          url: "/_next/static/chunks/main-app-905205e62fca966e.js",
          revision: "905205e62fca966e",
        },
        {
          url: "/_next/static/chunks/main-b63f47373ae37f91.js",
          revision: "b63f47373ae37f91",
        },
        {
          url: "/_next/static/chunks/pages/_app-e8b861c87f6f033c.js",
          revision: "e8b861c87f6f033c",
        },
        {
          url: "/_next/static/chunks/pages/_error-c8f84f7bd11d43d4.js",
          revision: "c8f84f7bd11d43d4",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-ecb0cb2210df5838.js",
          revision: "ecb0cb2210df5838",
        },
        {
          url: "/_next/static/css/b4796d69307bae67.css",
          revision: "b4796d69307bae67",
        },
        {
          url: "/_next/static/media/d9fef5bf2f64cf9a-s.woff2",
          revision: "8811e895c44884cc443e11ccad50d033",
        },
        {
          url: "/_next/static/media/de42cfb9a3b980ae-s.p.woff2",
          revision: "392aed3eb1423f8bb5f11bc4ab5ab061",
        },
        {
          url: "/assets/images/no-img.jpeg",
          revision: "0cdf14ae8ab29a3850bf16751d5f196d",
        },
        {
          url: "/assets/svgs/logo_dark.svg",
          revision: "79826ee534f90bfbdb81ac293d285e20",
        },
        {
          url: "/assets/svgs/logo_light.svg",
          revision: "4837b38e357a630b0000f51783f3ff5e",
        },
        {
          url: "/assets/svgs/vercel_dark.svg",
          revision: "ccd646f7ef2076a7343e0b37ec2bf48d",
        },
        {
          url: "/dummy_avatar.jpg",
          revision: "126beb28f38179892d94bbb39c52013e",
        },
        {
          url: "/fallback-ce627215c0e4a9af.js",
          revision: "78a860a830d27bb7927dc1d40e569215",
        },
        { url: "/favicon.ico", revision: "153238171fdeaa1ffa593f6baf135963" },
        { url: "/logo.svg", revision: "72d018067e8441f89ef49fa86f6c9055" },
        { url: "/offline.html", revision: "8a77e9b4880b9863fffc04d2bae2ca4f" },
        { url: "/robot.txt", revision: "d41d8cd98f00b204e9800998ecf8427e" },
        { url: "/vercel.ico", revision: "c30c7d42707a47a3f4591831641e50dc" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: function (e) {
              var n = e.response;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    n && "opaqueredirect" === n.type
                      ? new Response(n.body, {
                          status: 200,
                          statusText: "OK",
                          headers: n.headers,
                        })
                      : n,
                  ];
                });
              })();
            },
          },
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      function (e) {
        var n = e.sameOrigin,
          t = e.url.pathname;
        return !(
          !n ||
          t.startsWith("/api/auth/callback") ||
          !t.startsWith("/api/")
        );
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      function (e) {
        var n = e.request,
          t = e.url.pathname,
          s = e.sameOrigin;
        return (
          "1" === n.headers.get("RSC") &&
          "1" === n.headers.get("Next-Router-Prefetch") &&
          s &&
          !t.startsWith("/api/")
        );
      },
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      function (e) {
        var n = e.request,
          t = e.url.pathname,
          s = e.sameOrigin;
        return "1" === n.headers.get("RSC") && s && !t.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      function (e) {
        var n = e.url.pathname;
        return e.sameOrigin && !n.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      function (e) {
        return !e.sameOrigin;
      },
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    "undefined" != typeof self
                      ? self.fallback(n)
                      : Response.error(),
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    );
});
