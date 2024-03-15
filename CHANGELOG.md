# [2.3.0](https://github.com/rfoel/strava/compare/v2.2.2...v2.3.0) (2024-03-15)


### Features

* Allow initialization with access token or token exchange code ([#194](https://github.com/rfoel/strava/issues/194)) ([bc48f8d](https://github.com/rfoel/strava/commit/bc48f8d0ade76ec5f37a28b1dfc279ab7fa7372e))

## [2.2.2](https://github.com/rfoel/strava/compare/v2.2.1...v2.2.2) (2023-10-11)


### Bug Fixes

* Export all Request object types from resources/*.ts. ([#193](https://github.com/rfoel/strava/issues/193)) ([ac6d92e](https://github.com/rfoel/strava/commit/ac6d92ea8489540d5931cf4fa1e50749fff96fa2))

## [2.2.1](https://github.com/rfoel/strava/compare/v2.2.0...v2.2.1) (2023-04-28)


### Bug Fixes

* fix types. ([#191](https://github.com/rfoel/strava/issues/191)) ([9465f02](https://github.com/rfoel/strava/commit/9465f022ba7a5100f71993d6f47fc394236a6c1f))

# [2.2.0](https://github.com/rfoel/strava/compare/v2.1.0...v2.2.0) (2023-04-24)


### Features

* allow callback for refresh ([#190](https://github.com/rfoel/strava/issues/190)) ([5e591e7](https://github.com/rfoel/strava/commit/5e591e7bfcb3bd62f425a2797c64ad80876d18da))

# [2.1.0](https://github.com/rfoel/strava/compare/v2.0.2...v2.1.0) (2022-11-30)


### Features

* Allow access request in params  ([#179](https://github.com/rfoel/strava/issues/179)) ([1acea80](https://github.com/rfoel/strava/commit/1acea80c889fbff915cce9369919b112fbbdd2de))

## [2.0.2](https://github.com/rfoel/strava/compare/v2.0.1...v2.0.2) (2022-11-29)


### Bug Fixes

* update activity and sport types ([94594e6](https://github.com/rfoel/strava/commit/94594e619819c7ce922ee4383ced48eca5987e11))

## [2.0.1](https://github.com/rfoel/strava/compare/v2.0.0...v2.0.1) (2021-11-14)


### Bug Fixes

* add LatLng type for streams and start/end positions ([f48b946](https://github.com/rfoel/strava/commit/f48b946cf3f6f76bb0bb7ef872adabea44a155f6))

# [2.0.0](https://github.com/rfoel/strava/compare/v1.4.0...v2.0.0) (2021-11-05)


### Bug Fixes

* fix query params ([f0a967b](https://github.com/rfoel/strava/commit/f0a967b5dc7df147ce0e76fd26d96dcc5f77f8a2)), closes [#112](https://github.com/rfoel/strava/issues/112)


### BREAKING CHANGES

* ActivityType and StreamKeys are now template literal types, meaning that
whenever used before the user had to use the enum like [StreamKeys.LatLng]
now it should be replaced with simply ['latlng'] with the benefits of autocompleting.

# [1.4.0](https://github.com/rfoel/strava/compare/v1.3.3...v1.4.0) (2021-10-26)


### Features

* add private_note ([#105](https://github.com/rfoel/strava/issues/105)) ([4bf136e](https://github.com/rfoel/strava/commit/4bf136ebd1c3026f80776c2ac894b541d61581f5))

## [1.3.3](https://github.com/rfoel/strava/compare/v1.3.2...v1.3.3) (2021-10-15)


### Bug Fixes

* update deps ([31a6418](https://github.com/rfoel/strava/commit/31a64185993a66f9392a6c106c7d1fd74deea5e8))

## [1.3.2](https://github.com/rfoel/strava/compare/v1.3.1...v1.3.2) (2021-05-12)


### Bug Fixes

* Add missing fields to detailedActivity model ([#66](https://github.com/rfoel/strava/issues/66)) ([88b23fa](https://github.com/rfoel/strava/commit/88b23fac4801b590db4afed026242e8d9f410440))

## [1.3.1](https://github.com/rfoel/strava/compare/v1.3.0...v1.3.1) (2021-04-09)


### Bug Fixes

* add missing fields from Strava API ([#58](https://github.com/rfoel/strava/issues/58)) ([8ba7ee0](https://github.com/rfoel/strava/commit/8ba7ee04c5a9681e581909618c8e161277bbf121))

# [1.3.0](https://github.com/rfoel/strava/compare/v1.2.1...v1.3.0) (2021-03-22)


### Features

* **activities:** add support for retrieving activity photos ([#44](https://github.com/rfoel/strava/issues/44)) ([82fd922](https://github.com/rfoel/strava/commit/82fd922c5ab1eb00c52fc3b936522ff4c27b10c9))

## [1.2.1](https://github.com/rfoel/strava/compare/v1.2.0...v1.2.1) (2021-02-01)


### Bug Fixes

* add fetch import back to request ([#23](https://github.com/rfoel/strava/issues/23)) ([83c67ed](https://github.com/rfoel/strava/commit/83c67ed3dd1cf49630de796bacbe15869d36a549))

# [1.2.0](https://github.com/rfoel/strava/compare/v1.1.4...v1.2.0) (2021-01-25)


### Bug Fixes

* update deps ([#21](https://github.com/rfoel/strava/issues/21)) ([22745ec](https://github.com/rfoel/strava/commit/22745ec6de296024defc6fccbabdf684ebe17963)), closes [#19](https://github.com/rfoel/strava/issues/19) [#18](https://github.com/rfoel/strava/issues/18) [#15](https://github.com/rfoel/strava/issues/15) [#14](https://github.com/rfoel/strava/issues/14) [#11](https://github.com/rfoel/strava/issues/11)


### Features

*  add webhooks support for strava client ([4aff198](https://github.com/rfoel/strava/commit/4aff19838370db891245fcea6f138c7e414b38fd))

## [1.1.4](https://github.com/rfoel/strava/compare/v1.1.3...v1.1.4) (2020-12-18)


### Bug Fixes

* dates are string types ([759253b](https://github.com/rfoel/strava/commit/759253b416a299f6ef63d7a2358cc4c73ef31585))

## [1.1.3](https://github.com/rfoel/strava/compare/v1.1.2...v1.1.3) (2020-12-18)


### Bug Fixes

* add types to package.json ([baff388](https://github.com/rfoel/strava/commit/baff3886127b80a544f791bbcd262528f19b9163))

## [1.1.2](https://github.com/rfoel/strava/compare/v1.1.1...v1.1.2) (2020-12-18)


### Bug Fixes

* update models ([d3296f8](https://github.com/rfoel/strava/commit/d3296f815c201d1acd21e7948491cf10a41274b0))

## [1.1.1](https://github.com/rfoel/strava/compare/v1.1.0...v1.1.1) (2020-12-07)


### Bug Fixes

* export types ([826a6db](https://github.com/rfoel/strava/commit/826a6db0fcc82151538e389b2c2e2fa2e05af77d))

# [1.1.0](https://github.com/rfoel/strava/compare/v1.0.0...v1.1.0) (2020-12-02)


### Features

* add athlete methods ([da4cb7c](https://github.com/rfoel/strava/commit/da4cb7cb36551b6578c2bd05164e13eb2695d6c0))
* add club methods ([85eea55](https://github.com/rfoel/strava/commit/85eea55559c67ee514092170ae54e70454224e4c))
* add gear methods ([e168997](https://github.com/rfoel/strava/commit/e16899734a9f120f14ca673117d89639ce90104a))
* add route methods ([7e407cb](https://github.com/rfoel/strava/commit/7e407cb1f2173920c5609f74e2827890cfa72e45))
* add running races methods ([a0b7731](https://github.com/rfoel/strava/commit/a0b7731165ba6ba341f7470d6ccfeb1e3dd44faf))
* add segment efforts methods ([e9f1985](https://github.com/rfoel/strava/commit/e9f1985c480df472cc8d068ee880da4604371c68))
* add segment methods ([b08c533](https://github.com/rfoel/strava/commit/b08c53397b2fe4de2465e34ff8a398e4effc8cfd))
* add stream methods ([716aa3d](https://github.com/rfoel/strava/commit/716aa3d4e94b4e6ea05b5f04e4e583d893d37973))
* add upload methods ([1cd000e](https://github.com/rfoel/strava/commit/1cd000e02891dd18862bad27ca35a72ae4e53223))

# 1.0.0 (2020-12-01)


### Features

* add activity methods ([af09c56](https://github.com/rfoel/strava/commit/af09c5654bea052614437662cc3e3216aa87033e))
