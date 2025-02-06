# CHANGELOG

## [v1.7.5](https://github.com/bjorkgard/secretary-application/releases/tag/v1.7.5) - 2025-02-06 08:53:26

<!-- Release notes generated using configuration in .github/release.yml at v1.7.5 -->

## What's Changed
* Fix design error on meeting report by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/1016


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.7.4...v1.7.5

## [v1.7.4](https://github.com/bjorkgard/secretary-application/releases/tag/v1.7.4) - 2025-02-03 18:31:34

<!-- Release notes generated using configuration in .github/release.yml at v1.7.4 -->

## What's Changed
* Fix: Childrens birthday not required by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/1014


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.7.3...v1.7.4

## [v1.7.3](https://github.com/bjorkgard/secretary-application/releases/tag/v1.7.3) - 2025-01-30 15:37:18

<!-- Release notes generated using configuration in .github/release.yml at v1.7.3 -->

## What's Changed
* Reset reports by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/988
* Force update reports by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/989
* Fix: Delete reports for publisher by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/992
* Fix: Use correct font on publisherCard by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/994
* Fix: Unique field names by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/995
* Force refetch reports from server by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/996
* Possible to add reports to a current serviceMonth by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/997
* Set style on scroll bars by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/998


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.7.2...v1.7.3

## [v1.7.2](https://github.com/bjorkgard/secretary-application/releases/tag/v1.7.2) - 2025-01-28 00:05:48

<!-- Release notes generated using configuration in .github/release.yml at v1.7.2 -->

## What's Changed
* Remove dev data by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/983
* Fix: No assistant for some tasks by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/985


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.7.0...v1.7.2

## [v1.7.0](https://github.com/bjorkgard/secretary-application/releases/tag/v1.7.0) - 2025-01-27 22:06:02

<!-- Release notes generated using configuration in .github/release.yml at v1.7.0 -->

## What's Changed
### Other Changes
* Remove events by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/933
* Update HeadlessUI by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/937
* Update tailwind-scrollbar-hide by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/955
* compress exported s 21 by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/959
* Use same order on last and first name by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/960
* Sort publishers by column by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/961
* Fix: Check if template exists by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/964
* Update SMS default message by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/966
* Update Import S-21 by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/967
* Create an organization schema and use this schema when generating the… by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/970
* Fix marginal on first table by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/971
* Mark irregular and inactive publishers by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/981


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.6.11...v1.7.0

### Feature

- congregation analysis:
  - show an analys for the congregation for the given service year ([2dc9146](https://github.com/bjorkgard/secretary-application/commit/2dc9146808ba36041555288f3fef2788ef7bbbfe)) ([#621](https://github.com/bjorkgard/secretary-application/pull/621))

- service group:
  - choose who will receive emails for reports ([7da098e](https://github.com/bjorkgard/secretary-application/commit/7da098e881924e903daa419bad5987b3fb19a1da)) ([#620](https://github.com/bjorkgard/secretary-application/pull/620))

- mail response:
  - show warnings from mail server with delete or fix ([a90054e](https://github.com/bjorkgard/secretary-application/commit/a90054e42ddf94fc1cd525d80491961bd8bc970b)) ([#619](https://github.com/bjorkgard/secretary-application/pull/619))

- inactive publishers:
  - export a list of all inactive publishers ([19c0e79](https://github.com/bjorkgard/secretary-application/commit/19c0e79bf965fa94edd5e02e12e83153941ff4b5)) ([#611](https://github.com/bjorkgard/secretary-application/pull/611))

- irregular publishers:
  - export a list with all irregular publishers ([d6288e3](https://github.com/bjorkgard/secretary-application/commit/d6288e3901bb2b4000f3b61108df82592adba666)) ([#610](https://github.com/bjorkgard/secretary-application/pull/610))

- publisher:
  - update if a publisher should receive a reporting email ([42e43ff](https://github.com/bjorkgard/secretary-application/commit/42e43fff354e68a2f9415f5009ec8b47616da620)) ([#608](https://github.com/bjorkgard/secretary-application/pull/608))

- active/inactive:
  - create an event and store in history for service year and publisher ([76f3288](https://github.com/bjorkgard/secretary-application/commit/76f3288822a252572fa142a2f88e56a0a91121db)) ([#607](https://github.com/bjorkgard/secretary-application/pull/607))

- voting list:
  - export a voting list to be used in extra meetings ([941a703](https://github.com/bjorkgard/secretary-application/commit/941a703de28af5d47535bf102faae1cfa3d4887d)) ([#604](https://github.com/bjorkgard/secretary-application/pull/604))

- spiritual status:
  - export list of all publishers with age, appointments and status ([0c2bae2](https://github.com/bjorkgard/secretary-application/commit/0c2bae2e32f0b64a7f64202b0ef390089f096d3b)) ([#602](https://github.com/bjorkgard/secretary-application/pull/602))

- event:
  - add event for restrictions ([41a06f0](https://github.com/bjorkgard/secretary-application/commit/41a06f0a628fe51e7da5f269d786885590bfb94d)) ([#597](https://github.com/bjorkgard/secretary-application/pull/597))

- appointments:
  - add event to add appointment  ministerial servant and elder ([030f659](https://github.com/bjorkgard/secretary-application/commit/030f659836a1af9af15dc6c23bbf6f88538b1779)) ([#596](https://github.com/bjorkgard/secretary-application/pull/596))

- diary:
  - show all events in a service year ([8612a44](https://github.com/bjorkgard/secretary-application/commit/8612a44d86a8ad616f264618e3435a3de74bd23d)) ([#581](https://github.com/bjorkgard/secretary-application/pull/581))

- organization schema:
  - export an organization schema ([ea3efaf](https://github.com/bjorkgard/secretary-application/commit/ea3efaffc61fd88fd1f82ad25c59355014b819b8)) ([#561](https://github.com/bjorkgard/secretary-application/pull/561))

- name list:
  - export a name list grouped by family ([40f4f22](https://github.com/bjorkgard/secretary-application/commit/40f4f2213c29204c6bf8085be66d1a42f2ef640d)) ([#554](https://github.com/bjorkgard/secretary-application/pull/554))

- extended register card:
  - add personal history on the extended register card ([1f78110](https://github.com/bjorkgard/secretary-application/commit/1f781107d841bdc467b52af6b43474deb4d20d1d)) ([#553](https://github.com/bjorkgard/secretary-application/pull/553))
  - export extended register card ([21a3017](https://github.com/bjorkgard/secretary-application/commit/21a30177e6ae56afd50b0833925b814817f7b8b2)) ([#476](https://github.com/bjorkgard/secretary-application/pull/476))

- old applications warning:
  - add a card on the dashboard. Show publishers with old applications ([93ee62f](https://github.com/bjorkgard/secretary-application/commit/93ee62f52b64a27d2a2e9d85cd67daefa6bf90ce)) ([#547](https://github.com/bjorkgard/secretary-application/pull/547))

- application list:
  - export an application list ([332d6db](https://github.com/bjorkgard/secretary-application/commit/332d6db9e8ec3f80971beb9eee3af0c6e4e6fc07)) ([#547](https://github.com/bjorkgard/secretary-application/pull/547))

- events:
  - add events for applications ([e22b90a](https://github.com/bjorkgard/secretary-application/commit/e22b90ac5fb45fe384ba485fa08faae4f207a5fb)) ([#547](https://github.com/bjorkgard/secretary-application/pull/547))

- report reminder:
  - resend email or copy the url to the report ([a841da7](https://github.com/bjorkgard/secretary-application/commit/a841da7aaca639d49cbd7ae8ca1f4f3813a8abde)) ([#543](https://github.com/bjorkgard/secretary-application/pull/543))

- resend service group report:
  - add a button to resend a form for the service group ([bd40490](https://github.com/bjorkgard/secretary-application/commit/bd40490689124518f4d3caf6bc3b5bda377b0837)) ([#531](https://github.com/bjorkgard/secretary-application/pull/531))

- pioneer school:
  - add event for Pioneer school ([03449d7](https://github.com/bjorkgard/secretary-application/commit/03449d7698ecb2a8f1c87082e75aa9a094b0856f)) ([#526](https://github.com/bjorkgard/secretary-application/pull/526))

- history:
  - publisher history ([d23bca6](https://github.com/bjorkgard/secretary-application/commit/d23bca6ffe9279d65245c43451dc14f2f8274e63)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))

- publisher report:
  - do not add future reports ([55b5d84](https://github.com/bjorkgard/secretary-application/commit/55b5d84ca91b90bf68c72c23431926ee515ffba8)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))
  - add historical reports for a publisher ([c550acc](https://github.com/bjorkgard/secretary-application/commit/c550acc1e72951c866890bdf1430e780aeef90d7)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))

- edit publishers report:
  - update publishers reports in history ([4a8b602](https://github.com/bjorkgard/secretary-application/commit/4a8b60243151d3cfbeea31a7492c2b3f72d2a361)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))

- publisher history:
  - show report history for a publisher ([57779c5](https://github.com/bjorkgard/secretary-application/commit/57779c5e9d777f3ba9c398deecc3afc2e7de4466)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))

- congregation history:
  - show monthly history for the congregation ([fb0009a](https://github.com/bjorkgard/secretary-application/commit/fb0009a2d1adf766e40aa76916fd731d1e9429f3)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))

- transfer publisher:
  - if a publisher is moving select a congregation and transfer data ([1411b10](https://github.com/bjorkgard/secretary-application/commit/1411b1023e171965204a6dbec3401f6b8132c29d)) ([#474](https://github.com/bjorkgard/secretary-application/pull/474))

- service groups:
  - export a lis of service groups ([8c586f4](https://github.com/bjorkgard/secretary-application/commit/8c586f43e97e77fb902131e664a0d85377f7aaef)) ([#467](https://github.com/bjorkgard/secretary-application/pull/467))

- address list:
  - addresslist with emergency contact ([f201cc4](https://github.com/bjorkgard/secretary-application/commit/f201cc49408b92d51508c0bc8802af7bc6829bc2)) ([#464](https://github.com/bjorkgard/secretary-application/pull/464))

- completion list:
  - export a list with publishers in needs for completions ([5f8675a](https://github.com/bjorkgard/secretary-application/commit/5f8675a2010ac01ca229ea873d0725ebfafc8f3b)) ([#442](https://github.com/bjorkgard/secretary-application/pull/442))

- export regular participant:
  - export a list of regular participants ([61ac31a](https://github.com/bjorkgard/secretary-application/commit/61ac31ae3f44071d91affb78bea1b5d42f4d3fed)) ([#441](https://github.com/bjorkgard/secretary-application/pull/441))

- export members:
  - export docx-file with a members list ([deb922e](https://github.com/bjorkgard/secretary-application/commit/deb922e816b2a038177c78d9828a5743a0a06886)) ([#441](https://github.com/bjorkgard/secretary-application/pull/441))

- congregation s21:
  - export congregation S-21 ([8b32983](https://github.com/bjorkgard/secretary-application/commit/8b32983e4dec9e8cc3a99c6cfdc8f041987a1b8c)) ([#433](https://github.com/bjorkgard/secretary-application/pull/433))

- menu:
  - a new menu option to export congregation S-21 ([6c27d64](https://github.com/bjorkgard/secretary-application/commit/6c27d64fd73f02b53083b33ad10cd05d6fd7ea7d)) ([#433](https://github.com/bjorkgard/secretary-application/pull/433))

- baptised:
  - add an event Baptised for a publisher ([0998f0b](https://github.com/bjorkgard/secretary-application/commit/0998f0bd5f6ad75dcf869d5e5289b8b078894efd)) ([#424](https://github.com/bjorkgard/secretary-application/pull/424))

- unbaptised publisher:
  - add an event for new ubaptised publisher ([e1a4645](https://github.com/bjorkgard/secretary-application/commit/e1a4645efb1170cc532e87c01d274b3dc9093675)) ([#422](https://github.com/bjorkgard/secretary-application/pull/422))

- public congregation:
  - save congfregation online if public is selected ([ad02c38](https://github.com/bjorkgard/secretary-application/commit/ad02c38c4ca0e5eb9f2d7ff4b078e7eda204b9ee)) ([#400](https://github.com/bjorkgard/secretary-application/pull/400))

- general:
  - export S-21 for a Service group ([f988ab6](https://github.com/bjorkgard/secretary-application/commit/f988ab6235964132d78bc45b5e29220037135da4)) ([#127](https://github.com/bjorkgard/secretary-application/pull/127))
  - Confirm template type after upload ([2dcc3a5](https://github.com/bjorkgard/secretary-application/commit/2dcc3a55a86665cd2af4ece3600257593e0f64d1)) ([#67](https://github.com/bjorkgard/secretary-application/pull/67))
  - Show only available publishers on add auxiliary ([3d69802](https://github.com/bjorkgard/secretary-application/commit/3d698029ccb52d5a9bdc7036f446fc9fcad4fa0f)) ([#66](https://github.com/bjorkgard/secretary-application/pull/66))
  - Import emergency contacts ([d728d6f](https://github.com/bjorkgard/secretary-application/commit/d728d6f17c34b4f35cbe26a406865a0325d0eea5)) ([#63](https://github.com/bjorkgard/secretary-application/pull/63))

- bugsnag:
  - better error handling ([3fb16e6](https://github.com/bjorkgard/secretary-application/commit/3fb16e6c4364ca4e8e11c182c150b9e4455197f0)) ([#124](https://github.com/bjorkgard/secretary-application/pull/124))

### Bug Fixes

- deps:
  - bump fs-extra from 11.2.0 to 11.3.0 (#974) ([a934a40](https://github.com/bjorkgard/secretary-application/commit/a934a40d6be865f9f3d34e5110e421c5eb218fab)) ([#974](https://github.com/bjorkgard/secretary-application/pull/974))
  - bump cross-spawn in the npm_and_yarn group (#956) ([4e01bdb](https://github.com/bjorkgard/secretary-application/commit/4e01bdb69107ca470f847a1a5573a880e4fe11f8)) ([#956](https://github.com/bjorkgard/secretary-application/pull/956))
  - bump react-phone-number-input from 3.4.10 to 3.4.11 (#946) ([54161e4](https://github.com/bjorkgard/secretary-application/commit/54161e4a466f042e7777b77d50cbdbc4fc0181d1)) ([#946](https://github.com/bjorkgard/secretary-application/pull/946))
  - bump react-chartjs-2 from 5.2.0 to 5.3.0 (#912) ([2fe512a](https://github.com/bjorkgard/secretary-application/commit/2fe512a29ea3323100222e8225a5a4dc1e9724f7)) ([#912](https://github.com/bjorkgard/secretary-application/pull/912))
  - bump react-hook-form from 7.54.1 to 7.54.2 (#899) ([57a5ae4](https://github.com/bjorkgard/secretary-application/commit/57a5ae40a05a69bc768589ce92527c725c31422a)) ([#899](https://github.com/bjorkgard/secretary-application/pull/899))
  - bump react-hook-form from 7.54.0 to 7.54.1 (#890) ([fb951a8](https://github.com/bjorkgard/secretary-application/commit/fb951a808ceea1fdef13404e31b75c8fedb8b5ff)) ([#890](https://github.com/bjorkgard/secretary-application/pull/890))
  - bump the npm_and_yarn group with 1 update (#884) ([5c0ef60](https://github.com/bjorkgard/secretary-application/commit/5c0ef60d70b4ff8b6fee25070f5610f3b7d4b9cd)) ([#884](https://github.com/bjorkgard/secretary-application/pull/884))
  - bump react-hook-form from 7.53.2 to 7.54.0 (#881) ([9d8ac72](https://github.com/bjorkgard/secretary-application/commit/9d8ac7203683ac8fb5246d71772a9153494d060c)) ([#881](https://github.com/bjorkgard/secretary-application/pull/881))
  - bump react-phone-number-input from 3.4.9 to 3.4.10 (#879) ([e5e1870](https://github.com/bjorkgard/secretary-application/commit/e5e187082422cf774fdae72d0a3297d2ee35f973)) ([#879](https://github.com/bjorkgard/secretary-application/pull/879))
  - bump chart.js from 4.4.6 to 4.4.7 (#862) ([83ff33d](https://github.com/bjorkgard/secretary-application/commit/83ff33ddff0ab0a8fa1467cb92a1fceb64232115)) ([#862](https://github.com/bjorkgard/secretary-application/pull/862))
  - bump i18next-fs-backend from 2.3.2 to 2.6.0 (#856) ([1b6b4dd](https://github.com/bjorkgard/secretary-application/commit/1b6b4dd064dc61925811016ee9e6505219a06b57)) ([#856](https://github.com/bjorkgard/secretary-application/pull/856))
  - bump @heroicons/react from 2.1.5 to 2.2.0 (#852) ([8e50a46](https://github.com/bjorkgard/secretary-application/commit/8e50a46cfef9638d1427daba80e99dc8c29e0fd6)) ([#852](https://github.com/bjorkgard/secretary-application/pull/852))
  - bump react-hook-form from 7.53.1 to 7.53.2 (#838) ([474a680](https://github.com/bjorkgard/secretary-application/commit/474a6809de54afafea204c05d3c1b6381c7435dd)) ([#838](https://github.com/bjorkgard/secretary-application/pull/838))
  - bump react-router-dom from 6.27.0 to 6.28.0 (#847) ([0d69b00](https://github.com/bjorkgard/secretary-application/commit/0d69b0030f6a94b912d04f8fec6d48e280ab3018)) ([#847](https://github.com/bjorkgard/secretary-application/pull/847))
  - bump i18next from 23.16.4 to 23.16.5 (#841) ([f93aadd](https://github.com/bjorkgard/secretary-application/commit/f93aaddcb1b94e4ced8f8d69ca3fd30773ca0e57)) ([#841](https://github.com/bjorkgard/secretary-application/pull/841))
  - bump i18next from 23.16.2 to 23.16.4 (#830) ([3666515](https://github.com/bjorkgard/secretary-application/commit/3666515c6af0dc3aa9c2a4e8950a024387a89e97)) ([#830](https://github.com/bjorkgard/secretary-application/pull/830))
  - bump chart.js from 4.4.5 to 4.4.6 (#826) ([2175755](https://github.com/bjorkgard/secretary-application/commit/217575519f97aa9f3a8d2551583e5849915ef49c)) ([#826](https://github.com/bjorkgard/secretary-application/pull/826))
  - bump i18next from 23.16.0 to 23.16.2 (#818) ([7a66afe](https://github.com/bjorkgard/secretary-application/commit/7a66afe704909a5b4a67a16a352bfbde867ccf3b)) ([#818](https://github.com/bjorkgard/secretary-application/pull/818))
  - bump react-phone-number-input from 3.4.8 to 3.4.9 (#814) ([bad476e](https://github.com/bjorkgard/secretary-application/commit/bad476e6d93240027acf43456817f8bc4ec69b6e)) ([#814](https://github.com/bjorkgard/secretary-application/pull/814))
  - bump react-hook-form from 7.53.0 to 7.53.1 (#819) ([e077b47](https://github.com/bjorkgard/secretary-application/commit/e077b47206db0245cf1b341a00d5a632de3e6055)) ([#819](https://github.com/bjorkgard/secretary-application/pull/819))
  - bump chart.js from 4.4.4 to 4.4.5 (#817) ([f1be663](https://github.com/bjorkgard/secretary-application/commit/f1be66333a6c4a5ea7a8052acfad70d24c1edf83)) ([#817](https://github.com/bjorkgard/secretary-application/pull/817))
  - bump jspdf-autotable from 3.8.3 to 3.8.4 (#815) ([dad5c8e](https://github.com/bjorkgard/secretary-application/commit/dad5c8edc315dfb7b8765b73a940e262b4224bb8)) ([#815](https://github.com/bjorkgard/secretary-application/pull/815))
  - bump i18next from 23.15.2 to 23.16.0 (#804) ([89131f8](https://github.com/bjorkgard/secretary-application/commit/89131f88b30e23a5e84c5a9186155aca0b5751d1)) ([#804](https://github.com/bjorkgard/secretary-application/pull/804))
  - bump react-router-dom from 6.26.2 to 6.27.0 (#796) ([b03ead4](https://github.com/bjorkgard/secretary-application/commit/b03ead4b74cbc93d44dede8c54091930e0acb404)) ([#796](https://github.com/bjorkgard/secretary-application/pull/796))
  - bump i18next from 23.15.1 to 23.15.2 (#784) ([6ae3cdf](https://github.com/bjorkgard/secretary-application/commit/6ae3cdfbe98208a48bc6a0beca846de232a625c2)) ([#784](https://github.com/bjorkgard/secretary-application/pull/784))
  - bump electron-updater from 6.3.4 to 6.3.9 (#782) ([850d6db](https://github.com/bjorkgard/secretary-application/commit/850d6db7a45929c5df63935366bd78702d070124)) ([#782](https://github.com/bjorkgard/secretary-application/pull/782))
  - bump rollup from 4.21.1 to 4.22.4 in the npm_and_yarn group (#775) ([482b042](https://github.com/bjorkgard/secretary-application/commit/482b0425ccd4417a66b5838de69a53028933e7c8)) ([#775](https://github.com/bjorkgard/secretary-application/pull/775))
  - bump i18next from 23.15.0 to 23.15.1 (#761) ([e265924](https://github.com/bjorkgard/secretary-application/commit/e265924b91b84ef867ee4e8d09c860d34c791fa8)) ([#761](https://github.com/bjorkgard/secretary-application/pull/761))
  - bump react-phone-number-input from 3.4.6 to 3.4.8 (#771) ([64774e0](https://github.com/bjorkgard/secretary-application/commit/64774e09d11e989c7f6b680cd1b10b8387d48ad8)) ([#771](https://github.com/bjorkgard/secretary-application/pull/771))
  - bump jspdf from 2.5.1 to 2.5.2 (#767) ([ecbfda5](https://github.com/bjorkgard/secretary-application/commit/ecbfda50525402f8ecdb339539135b4ee27dede6)) ([#767](https://github.com/bjorkgard/secretary-application/pull/767))
  - bump react-phone-number-input from 3.4.5 to 3.4.6 (#755) ([1553c62](https://github.com/bjorkgard/secretary-application/commit/1553c62dfcefab8df26fb446d1ac7366b0104e8e)) ([#755](https://github.com/bjorkgard/secretary-application/pull/755))
  - bump react-router-dom from 6.26.1 to 6.26.2 (#735) ([cc34642](https://github.com/bjorkgard/secretary-application/commit/cc34642cc680c01fff1a9444cbaac0d5821bb40a)) ([#735](https://github.com/bjorkgard/secretary-application/pull/735))
  - bump i18next from 23.14.0 to 23.15.0 (#727) ([0ed2c83](https://github.com/bjorkgard/secretary-application/commit/0ed2c836a0f61aed7e31bb5feef47a00da9a1201)) ([#727](https://github.com/bjorkgard/secretary-application/pull/727))
  - bump electron-updater from 6.2.1 to 6.3.4 (#723) ([4af1d93](https://github.com/bjorkgard/secretary-application/commit/4af1d9359af3b38bd0455909d13b64d8317ecfa9)) ([#723](https://github.com/bjorkgard/secretary-application/pull/723))
  - bump jspdf-autotable from 3.8.2 to 3.8.3 (#717) ([ee4a0be](https://github.com/bjorkgard/secretary-application/commit/ee4a0be1445fe844a13c2ade951e6472e25fdaa9)) ([#717](https://github.com/bjorkgard/secretary-application/pull/717))
  - bump react-router-dom from 6.26.0 to 6.26.1 (#693) ([4f566fd](https://github.com/bjorkgard/secretary-application/commit/4f566fd3883214edb23f7f4a890256aee253afbb)) ([#693](https://github.com/bjorkgard/secretary-application/pull/693))
  - bump react-hook-form from 7.52.2 to 7.53.0 (#709) ([1874cbb](https://github.com/bjorkgard/secretary-application/commit/1874cbbea57bff8736f2e5e096cd40c464545f68)) ([#709](https://github.com/bjorkgard/secretary-application/pull/709))
  - bump chart.js from 4.4.3 to 4.4.4 (#707) ([6f2af8f](https://github.com/bjorkgard/secretary-application/commit/6f2af8f6620ec90fd06ade7d76d8d4a8120fe5be)) ([#707](https://github.com/bjorkgard/secretary-application/pull/707))
  - bump i18next from 23.12.2 to 23.14.0 (#688) ([b8ffcb4](https://github.com/bjorkgard/secretary-application/commit/b8ffcb4e081c80e23a520ea4861ee85195019cd1)) ([#688](https://github.com/bjorkgard/secretary-application/pull/688))
  - bump i18next-fs-backend from 2.3.1 to 2.3.2 (#674) ([50e3359](https://github.com/bjorkgard/secretary-application/commit/50e3359091d5ee2e5029e5762a55302141327e61)) ([#674](https://github.com/bjorkgard/secretary-application/pull/674))
  - bump react-router-dom from 6.25.1 to 6.26.0 (#675) ([4f43f89](https://github.com/bjorkgard/secretary-application/commit/4f43f893de7dfb2e087232323646cebe32f2a45d)) ([#675](https://github.com/bjorkgard/secretary-application/pull/675))
  - bump react-phone-number-input from 3.4.4 to 3.4.5 (#672) ([8272b2a](https://github.com/bjorkgard/secretary-application/commit/8272b2aa00e8ddfa7f3911e96e1eaebcdf6b39d5)) ([#672](https://github.com/bjorkgard/secretary-application/pull/672))
  - bump react-hook-form from 7.52.1 to 7.52.2 (#671) ([c1740b8](https://github.com/bjorkgard/secretary-application/commit/c1740b81a59395a48fe44d842cf05b39bf7a1c68)) ([#671](https://github.com/bjorkgard/secretary-application/pull/671))
  - bump react-phone-number-input from 3.4.3 to 3.4.4 (#656) ([9a4ebac](https://github.com/bjorkgard/secretary-application/commit/9a4ebaca7f69416d9bdc757d8406c1549ab8ddf4)) ([#656](https://github.com/bjorkgard/secretary-application/pull/656))
  - bump i18next from 23.12.1 to 23.12.2 (#649) ([b1ab003](https://github.com/bjorkgard/secretary-application/commit/b1ab0036a5ab10d4162f7b7d2e354a508e6da51d)) ([#649](https://github.com/bjorkgard/secretary-application/pull/649))
  - bump react-router-dom from 6.24.1 to 6.25.1 (#642) ([c914c73](https://github.com/bjorkgard/secretary-application/commit/c914c7362783b442eef61e0b049a71a0259b2877)) ([#642](https://github.com/bjorkgard/secretary-application/pull/642))
  - bump @heroicons/react from 2.1.4 to 2.1.5 (#629) ([f7ad2e4](https://github.com/bjorkgard/secretary-application/commit/f7ad2e468ed757d5006c262120a10e0af4090cc6)) ([#629](https://github.com/bjorkgard/secretary-application/pull/629))
  - bump ajv from 8.16.0 to 8.17.1 (#625) ([74607ee](https://github.com/bjorkgard/secretary-application/commit/74607ee38d2e6bba25f9e40e24615995abb7655c)) ([#625](https://github.com/bjorkgard/secretary-application/pull/625))
  - bump i18next from 23.11.5 to 23.12.1 (#624) ([0efde55](https://github.com/bjorkgard/secretary-application/commit/0efde55c658e5ed6d1d0cb108ef39fd4aaf36164)) ([#624](https://github.com/bjorkgard/secretary-application/pull/624))
  - bump react-router-dom from 6.24.0 to 6.24.1 (#617) ([01bad77](https://github.com/bjorkgard/secretary-application/commit/01bad770915044b93aad5f0d46024918381a7c15)) ([#617](https://github.com/bjorkgard/secretary-application/pull/617))
  - bump react-hook-form from 7.52.0 to 7.52.1 (#614) ([36ac013](https://github.com/bjorkgard/secretary-application/commit/36ac01384c5664a8a47f0018d028cce0199dfa97)) ([#614](https://github.com/bjorkgard/secretary-application/pull/614))
  - bump @heroicons/react from 2.1.3 to 2.1.4 (#571) ([e3975d6](https://github.com/bjorkgard/secretary-application/commit/e3975d6b470de0cdee5ca4f316b7091e8969ebe6)) ([#571](https://github.com/bjorkgard/secretary-application/pull/571))
  - bump react-hook-form from 7.51.5 to 7.52.0 (#565) ([4ce2d2b](https://github.com/bjorkgard/secretary-application/commit/4ce2d2b9defdb117a5b4dc7621f34ba023aa547c)) ([#565](https://github.com/bjorkgard/secretary-application/pull/565))
  - bump ajv from 8.14.0 to 8.16.0 (#534) ([aaf477d](https://github.com/bjorkgard/secretary-application/commit/aaf477d0992ffe65cbadc5d5fc80ae44dcc0c537)) ([#534](https://github.com/bjorkgard/secretary-application/pull/534))
  - bump electron-updater from 6.1.8 to 6.2.1 (#515) ([d1bb30a](https://github.com/bjorkgard/secretary-application/commit/d1bb30a224218500553b079a7253cf583fcb6edc)) ([#515](https://github.com/bjorkgard/secretary-application/pull/515))
  - bump react-hook-form from 7.51.4 to 7.51.5 (#494) ([0d239c9](https://github.com/bjorkgard/secretary-application/commit/0d239c9df7d456cd1f0d03e9e3d3ec45c6da77ed)) ([#494](https://github.com/bjorkgard/secretary-application/pull/494))
  - bump react-phone-number-input from 3.4.1 to 3.4.3 (#497) ([203fc37](https://github.com/bjorkgard/secretary-application/commit/203fc37e1134c1a43c81cc0a3602a02ab66f5e07)) ([#497](https://github.com/bjorkgard/secretary-application/pull/497))
  - bump ajv from 8.13.0 to 8.14.0 (#491) ([0b2eb28](https://github.com/bjorkgard/secretary-application/commit/0b2eb28c9d5ec83edbc6376ff8b658419dc29e34)) ([#491](https://github.com/bjorkgard/secretary-application/pull/491))
  - bump i18next from 23.11.4 to 23.11.5 (#489) ([4947cd4](https://github.com/bjorkgard/secretary-application/commit/4947cd43f04a9e53cfc0cd18cac51d37b02de25a)) ([#489](https://github.com/bjorkgard/secretary-application/pull/489))
  - bump react-i18next from 14.1.1 to 14.1.2 (#487) ([2959068](https://github.com/bjorkgard/secretary-application/commit/2959068bab3425b3bf8b6ba0c11543f36f6d3880)) ([#487](https://github.com/bjorkgard/secretary-application/pull/487))
  - bump chart.js from 4.4.2 to 4.4.3 (#456) ([40b5c84](https://github.com/bjorkgard/secretary-application/commit/40b5c842e28b2112ca6a0a402275de3c2d0e91c0)) ([#456](https://github.com/bjorkgard/secretary-application/pull/456))
  - bump react-router-dom from 6.23.0 to 6.23.1 (#406) ([3395e56](https://github.com/bjorkgard/secretary-application/commit/3395e5686283da8e60c625ac591d9d3a9e21a5ad)) ([#406](https://github.com/bjorkgard/secretary-application/pull/406))
  - bump i18next from 23.11.3 to 23.11.4 (#380) ([787948b](https://github.com/bjorkgard/secretary-application/commit/787948b5773b58f955412240e7c95740dc981776)) ([#380](https://github.com/bjorkgard/secretary-application/pull/380))
  - bump @bugsnag/electron from 7.22.7 to 7.23.0 (#376) ([175d5d9](https://github.com/bjorkgard/secretary-application/commit/175d5d9f55f73b7c5b8b973d1ac79a18fbfa15fb)) ([#376](https://github.com/bjorkgard/secretary-application/pull/376))
  - bump ajv from 8.12.0 to 8.13.0 (#350) ([0286d01](https://github.com/bjorkgard/secretary-application/commit/0286d01d5f1b8290e50b46f13779211e01b08864)) ([#350](https://github.com/bjorkgard/secretary-application/pull/350))
  - bump react-hook-form from 7.51.3 to 7.51.4 (#349) ([ebe0aab](https://github.com/bjorkgard/secretary-application/commit/ebe0aab5ca6e88f6397d1d9cd676a23f7d786394)) ([#349](https://github.com/bjorkgard/secretary-application/pull/349))
  - bump react-i18next from 14.1.0 to 14.1.1 (#337) ([36ab764](https://github.com/bjorkgard/secretary-application/commit/36ab76437af40504a55ad1490fecb13778adaf22)) ([#337](https://github.com/bjorkgard/secretary-application/pull/337))
  - bump react-router-dom from 6.22.3 to 6.23.0 (#330) ([813f72f](https://github.com/bjorkgard/secretary-application/commit/813f72f12501ffe49d850a308fdccf3bc27fe5c5)) ([#330](https://github.com/bjorkgard/secretary-application/pull/330))
  - bump i18next from 23.11.2 to 23.11.3 (#331) ([fb3a8d1](https://github.com/bjorkgard/secretary-application/commit/fb3a8d19a3dce84e33f47d044eec757a643f1fe9)) ([#331](https://github.com/bjorkgard/secretary-application/pull/331))
  - bump react-phone-number-input from 3.4.0 to 3.4.1 (#327) ([66e2b20](https://github.com/bjorkgard/secretary-application/commit/66e2b203ef7b9e2f80d54ca3f16314e2ae6e9c93)) ([#327](https://github.com/bjorkgard/secretary-application/pull/327))
  - bump @bugsnag/plugin-react from 7.19.0 to 7.22.7 (#322) ([8139d2e](https://github.com/bjorkgard/secretary-application/commit/8139d2e0076d05ae9419348ea4217d345b3f9b5e)) ([#322](https://github.com/bjorkgard/secretary-application/pull/322))
  - bump react-phone-number-input from 3.3.12 to 3.4.0 (#318) ([6246a95](https://github.com/bjorkgard/secretary-application/commit/6246a95c7cb4afaf40082aabb694c65f32f434ff)) ([#318](https://github.com/bjorkgard/secretary-application/pull/318))
  - bump @bugsnag/electron from 7.22.3 to 7.22.7 (#316) ([45a29f1](https://github.com/bjorkgard/secretary-application/commit/45a29f1628dc77bf48ebfe5a1ae91b2b3221be8d)) ([#316](https://github.com/bjorkgard/secretary-application/pull/316))
  - bump react-hook-form from 7.51.2 to 7.51.3 (#312) ([9c6d698](https://github.com/bjorkgard/secretary-application/commit/9c6d698889e54ae1df00e3d3495cad8368cabb0d)) ([#312](https://github.com/bjorkgard/secretary-application/pull/312))
  - bump i18next from 23.11.0 to 23.11.2 (#308) ([da7f986](https://github.com/bjorkgard/secretary-application/commit/da7f9864df8d5ce808108685917c68f1adc35aaa)) ([#308](https://github.com/bjorkgard/secretary-application/pull/308))
  - bump @headlessui/react from 1.7.18 to 1.7.19 (#307) ([cdbf339](https://github.com/bjorkgard/secretary-application/commit/cdbf3391ca74b896a0ee26cd9e203b4f72be4b0f)) ([#307](https://github.com/bjorkgard/secretary-application/pull/307))
  - bump i18next from 23.10.1 to 23.11.0 (#302) ([0e0d3cf](https://github.com/bjorkgard/secretary-application/commit/0e0d3cf100a3e1896409c2ac48a013e859636987)) ([#302](https://github.com/bjorkgard/secretary-application/pull/302))
  - bump @electron-toolkit/preload from 3.0.0 to 3.0.1 (#298) ([7498fdd](https://github.com/bjorkgard/secretary-application/commit/7498fdd6baff6165f41a658ae99a37215064f65f)) ([#298](https://github.com/bjorkgard/secretary-application/pull/298))
  - bump react-phone-number-input from 3.3.10 to 3.3.12 (#295) ([cb555a7](https://github.com/bjorkgard/secretary-application/commit/cb555a7b991965d9f113f7220d1704c5b2e87e3f)) ([#295](https://github.com/bjorkgard/secretary-application/pull/295))
  - bump react-phone-number-input from 3.3.9 to 3.3.10 (#287) ([d11dde7](https://github.com/bjorkgard/secretary-application/commit/d11dde7f76ca9046a7d8e7b60cc9d075741d5b71)) ([#287](https://github.com/bjorkgard/secretary-application/pull/287))
  - bump react-hook-form from 7.51.1 to 7.51.2 (#280) ([e94e425](https://github.com/bjorkgard/secretary-application/commit/e94e4257442d94de34d220892ab89b85fa89b5f2)) ([#280](https://github.com/bjorkgard/secretary-application/pull/280))
  - bump @heroicons/react from 2.1.1 to 2.1.3 (#267) ([12ca877](https://github.com/bjorkgard/secretary-application/commit/12ca877792359089b2deb0e89c42f56436f9cc70)) ([#267](https://github.com/bjorkgard/secretary-application/pull/267))
  - bump react-i18next from 14.0.5 to 14.1.0 (#247) ([60c7aa6](https://github.com/bjorkgard/secretary-application/commit/60c7aa62d8af8e61e7047fc67604f8edfca3181f)) ([#247](https://github.com/bjorkgard/secretary-application/pull/247))
  - bump react-hook-form from 7.51.0 to 7.51.1 (#242) ([43ce0ad](https://github.com/bjorkgard/secretary-application/commit/43ce0ad7c75893be853a4c18e394c6f700de1fbb)) ([#242](https://github.com/bjorkgard/secretary-application/pull/242))
  - bump electron-is-dev from 2.0.0 to 3.0.1 ([261895e](https://github.com/bjorkgard/secretary-application/commit/261895ed5ccbe963c84bd36d80d99d058e1110ce)) ([#140](https://github.com/bjorkgard/secretary-application/pull/140))
  - bump i18next from 23.10.0 to 23.10.1 (#229) ([f475ae5](https://github.com/bjorkgard/secretary-application/commit/f475ae5aedf015196a7955afab70b38012106821)) ([#229](https://github.com/bjorkgard/secretary-application/pull/229))
  - bump react-router-dom from 6.22.2 to 6.22.3 (#227) ([65ba284](https://github.com/bjorkgard/secretary-application/commit/65ba284223509552d6f7f42712b5f1c94910a3ff)) ([#227](https://github.com/bjorkgard/secretary-application/pull/227))
  - bump i18next from 23.9.0 to 23.10.0 (#214) ([909a637](https://github.com/bjorkgard/secretary-application/commit/909a637ab1d3f772779c0aef1564aa1968d3086b)) ([#214](https://github.com/bjorkgard/secretary-application/pull/214))
  - bump chart.js from 4.4.1 to 4.4.2 (#208) ([ab3d438](https://github.com/bjorkgard/secretary-application/commit/ab3d4384d395a0d484193c4bc9ce019a2fb46c19)) ([#208](https://github.com/bjorkgard/secretary-application/pull/208))
  - bump react-router-dom from 6.22.0 to 6.22.2 (#205) ([cb8b1d1](https://github.com/bjorkgard/secretary-application/commit/cb8b1d1d63245ebf6ed67d3437a6879604a1f8af)) ([#205](https://github.com/bjorkgard/secretary-application/pull/205))
  - bump react-hook-form from 7.50.1 to 7.51.0 (#202) ([b16f109](https://github.com/bjorkgard/secretary-application/commit/b16f109fdc78d1c1905e6dbcbee44b0a7b732aba)) ([#202](https://github.com/bjorkgard/secretary-application/pull/202))
  - bump electron-updater from 6.1.7 to 6.1.8 (#199) ([5f0bcca](https://github.com/bjorkgard/secretary-application/commit/5f0bcca5aa3542ee8382b3a66f058bfb5f5dc52d)) ([#199](https://github.com/bjorkgard/secretary-application/pull/199))
  - bump i18next from 23.8.2 to 23.9.0 (#196) ([dae73d6](https://github.com/bjorkgard/secretary-application/commit/dae73d635bd227ea273f675e0e987429f2177a97)) ([#196](https://github.com/bjorkgard/secretary-application/pull/196))
  - bump react-hook-form from 7.50.0 to 7.50.1 (#181) ([55f8e49](https://github.com/bjorkgard/secretary-application/commit/55f8e49a82ec8ec23d6917db016df3facb352396)) ([#181](https://github.com/bjorkgard/secretary-application/pull/181))
  - bump jspdf-autotable from 3.8.1 to 3.8.2 (#184) ([3e89c53](https://github.com/bjorkgard/secretary-application/commit/3e89c532b6c6628239df41fbb624772962c65c38)) ([#184](https://github.com/bjorkgard/secretary-application/pull/184))
  - bump react-i18next from 14.0.3 to 14.0.5 (#180) ([dd1dbb6](https://github.com/bjorkgard/secretary-application/commit/dd1dbb6f21cbc3fed089393c49609a6daaccd773)) ([#180](https://github.com/bjorkgard/secretary-application/pull/180))
  - bump react-hook-form from 7.49.3 to 7.50.0 (#176) ([f813ac4](https://github.com/bjorkgard/secretary-application/commit/f813ac47183d780420403a3407dcfe4c619baf51)) ([#176](https://github.com/bjorkgard/secretary-application/pull/176))
  - bump i18next from 23.8.1 to 23.8.2 (#175) ([cece8a3](https://github.com/bjorkgard/secretary-application/commit/cece8a31e69618c20ecd125afb25f1a53091fa3b)) ([#175](https://github.com/bjorkgard/secretary-application/pull/175))
  - bump react-i18next from 14.0.1 to 14.0.3 (#169) ([06880e1](https://github.com/bjorkgard/secretary-application/commit/06880e1e4e8bd78533d04dd234fa6a63ae507464)) ([#169](https://github.com/bjorkgard/secretary-application/pull/169))
  - bump react-router-dom from 6.21.3 to 6.22.0 (#166) ([97ef659](https://github.com/bjorkgard/secretary-application/commit/97ef6592c7efad30055afa05e104000b363da7da)) ([#166](https://github.com/bjorkgard/secretary-application/pull/166))
  - bump i18next from 23.7.18 to 23.8.1 (#158) ([1c0d8f5](https://github.com/bjorkgard/secretary-application/commit/1c0d8f5813fc092d5b27b7855fe7ac99949c2026)) ([#158](https://github.com/bjorkgard/secretary-application/pull/158))
  - bump react-router-dom from 6.21.2 to 6.21.3 (#153) ([4f632ce](https://github.com/bjorkgard/secretary-application/commit/4f632ce504f4a50ef4a0a6ecf50ee1d2b04f0f80)) ([#153](https://github.com/bjorkgard/secretary-application/pull/153))
  - bump react-i18next from 14.0.0 to 14.0.1 (#152) ([99336e5](https://github.com/bjorkgard/secretary-application/commit/99336e5801979b346979df6a544ec390389d5b23)) ([#152](https://github.com/bjorkgard/secretary-application/pull/152))
  - bump i18next from 23.7.16 to 23.7.18 (#146) ([50a5831](https://github.com/bjorkgard/secretary-application/commit/50a58314a39ea6c01188bb5dca1e35d1ba65b29b)) ([#146](https://github.com/bjorkgard/secretary-application/pull/146))
  - bump react-router-dom from 6.21.1 to 6.21.2 (#119) ([ddad4b2](https://github.com/bjorkgard/secretary-application/commit/ddad4b23f0fa87509bb59430b9c659d8c569e29e)) ([#119](https://github.com/bjorkgard/secretary-application/pull/119))

- update reports:
  - show error message if application fails to fetch reports from server ([2a2ade1](https://github.com/bjorkgard/secretary-application/commit/2a2ade1f7a9193917ea9203d3e81558db3ab95f8)) ([#651](https://github.com/bjorkgard/secretary-application/pull/651))

- report:
  - reload reports when switching tabs ([0ba9875](https://github.com/bjorkgard/secretary-application/commit/0ba9875c87e8b47375f19c5be9011b6b098511ed)) ([#609](https://github.com/bjorkgard/secretary-application/pull/609))

- closing reports:
  - show a spinner when closing reports ([5073b64](https://github.com/bjorkgard/secretary-application/commit/5073b64fbc60ef5973bace8fd89231a90635e187)) ([#605](https://github.com/bjorkgard/secretary-application/pull/605))

- version:
  - only show warning if new version exists ([be966bd](https://github.com/bjorkgard/secretary-application/commit/be966bd7fdd52b400e725383ecb4f8d0af5a042a)) ([#603](https://github.com/bjorkgard/secretary-application/pull/603))
  - show correct version information ([aa7d20d](https://github.com/bjorkgard/secretary-application/commit/aa7d20dd4ddc513d10b2d48dde3934a573f92740)) ([#599](https://github.com/bjorkgard/secretary-application/pull/599))
  - check if version is released before show warning ([f0b51e2](https://github.com/bjorkgard/secretary-application/commit/f0b51e22a56bca9b5ff5bc2879d306898eabdf85)) ([#470](https://github.com/bjorkgard/secretary-application/pull/470))

- congregation s-21:
  - wrong calculation on auxiliaries ([0171442](https://github.com/bjorkgard/secretary-application/commit/01714422ef7d1e5a6691cf5deb29ed0701c0608b)) ([#585](https://github.com/bjorkgard/secretary-application/pull/585))

- typo:
  - fix spelling ([17e9264](https://github.com/bjorkgard/secretary-application/commit/17e92645dc8df39914489c8e7ebfce29c9053a53)) ([#583](https://github.com/bjorkgard/secretary-application/pull/583))
  - fix spelling ([0ebff5e](https://github.com/bjorkgard/secretary-application/commit/0ebff5e67c91f8a8ee4426ebd75de54433936309)) ([#582](https://github.com/bjorkgard/secretary-application/pull/582))

- common exports:
  - typo ([ac5aa6e](https://github.com/bjorkgard/secretary-application/commit/ac5aa6e9509a858c17f345909f76a5bc8d4f3447)) ([#561](https://github.com/bjorkgard/secretary-application/pull/561))

- extended register card:
  - add missing translations and hide the table if no history ([6ef5505](https://github.com/bjorkgard/secretary-application/commit/6ef5505103ff61943d5ffb259c0cdcf636db193e)) ([#556](https://github.com/bjorkgard/secretary-application/pull/556))

- personal history:
  - sort personal history on extended register card ([6121fcf](https://github.com/bjorkgard/secretary-application/commit/6121fcf559bc1b1e49ddb62b4a100dd1ba312988)) ([#553](https://github.com/bjorkgard/secretary-application/pull/553))

- add history report:
  - fix a problem with adding history reports ([d0156cb](https://github.com/bjorkgard/secretary-application/commit/d0156cbab49ade3e8c2a38a351b299d485189b9f)) ([#551](https://github.com/bjorkgard/secretary-application/pull/551))

- congregation history:
  - show number of publishers ([5218f3f](https://github.com/bjorkgard/secretary-application/commit/5218f3f9cc3e78078ee19c4f6660abacc124e050)) ([#546](https://github.com/bjorkgard/secretary-application/pull/546))

- report compilation:
  - fix problem when exporting old service months ([50569e6](https://github.com/bjorkgard/secretary-application/commit/50569e648469a395a5f7503e472d7910b7eef31d)) ([#527](https://github.com/bjorkgard/secretary-application/pull/527))
  - get stats from db ([d71e5d2](https://github.com/bjorkgard/secretary-application/commit/d71e5d28e16fa7ed276bb06ef2465b0d16526e7a)) ([#544](https://github.com/bjorkgard/secretary-application/pull/544))
  - fix problem when exporting old service months ([7b82894](https://github.com/bjorkgard/secretary-application/commit/7b8289457af7eb3096a16ae9be7f027f96a26e68)) ([#528](https://github.com/bjorkgard/secretary-application/pull/528))
  - calculate meeting visitors correctly ([6013621](https://github.com/bjorkgard/secretary-application/commit/60136212e1043d7c251f1994988a7f61271d6262)) ([#521](https://github.com/bjorkgard/secretary-application/pull/521))

- auxiliary:
  - fix a problem in the auxiliary list on the dashboard ([6b99728](https://github.com/bjorkgard/secretary-application/commit/6b99728a4a03a8b578549790fed35b9ce65cf600)) ([#504](https://github.com/bjorkgard/secretary-application/pull/504))

- s-21:
  - mark if publisher are Special pioneer ([4f1454d](https://github.com/bjorkgard/secretary-application/commit/4f1454d7c7ec093881c8a993fb8971d28d6da63a)) ([#502](https://github.com/bjorkgard/secretary-application/pull/502))

- translation:
  - correct spelling ([28713be](https://github.com/bjorkgard/secretary-application/commit/28713bea3faf11becc87c807725d30fb29df91af)) ([#475](https://github.com/bjorkgard/secretary-application/pull/475))

- address list:
  - force linebreaks in excel export ([9fe29a5](https://github.com/bjorkgard/secretary-application/commit/9fe29a5b658135fd896040c9fde28c2f825a531f)) ([#469](https://github.com/bjorkgard/secretary-application/pull/469))
  - force linebreaks in excel ([0bdf1dd](https://github.com/bjorkgard/secretary-application/commit/0bdf1ddfb25ce7380fa448ec20c1aaddea54a7b1)) ([#468](https://github.com/bjorkgard/secretary-application/pull/468))

- translations:
  - add missing translations ([d8a2632](https://github.com/bjorkgard/secretary-application/commit/d8a2632a2018a159302f127e2fe46809f6ed6ddb)) ([#462](https://github.com/bjorkgard/secretary-application/pull/462))

- export pdf forms:
  - do not merge pdf-files as default ([69cbdd3](https://github.com/bjorkgard/secretary-application/commit/69cbdd38ec0e5faf0a839638934953e558e5c71e)) ([#457](https://github.com/bjorkgard/secretary-application/pull/457))

- menu:
  - add missing menu options ([fcff7f5](https://github.com/bjorkgard/secretary-application/commit/fcff7f57a45f59b335ed570f365d892e108d35aa)) ([#457](https://github.com/bjorkgard/secretary-application/pull/457))
  - add missing option for windows ([17d15a7](https://github.com/bjorkgard/secretary-application/commit/17d15a7f58f4855d8175663b2d5c991e005fb776)) ([#441](https://github.com/bjorkgard/secretary-application/pull/441))
  - add missing export option for windows ([92b0678](https://github.com/bjorkgard/secretary-application/commit/92b067804653c8bdfaa2539eac6a46a8226b463b)) ([#431](https://github.com/bjorkgard/secretary-application/pull/431))
  - show the application menu ([5aed27c](https://github.com/bjorkgard/secretary-application/commit/5aed27c82544dae6b560cce64dcc18544d856c21)) ([#418](https://github.com/bjorkgard/secretary-application/pull/418))

- report excel:
  - fix a problem where the forms were protected ([6fa8731](https://github.com/bjorkgard/secretary-application/commit/6fa87310ba1002e17d1a4a6a606b91152317b686)) ([#448](https://github.com/bjorkgard/secretary-application/pull/448))

- publisher:
  - fix an error message in publisher list ([094cb91](https://github.com/bjorkgard/secretary-application/commit/094cb91a49bf4685102bba2e00af856f958acd6b)) ([#434](https://github.com/bjorkgard/secretary-application/pull/434))

- service group:
  - do not parse model if no service group is found ([6bc63e4](https://github.com/bjorkgard/secretary-application/commit/6bc63e4b399633f8e992a5cdb0f4a663a7bb44e5)) ([#429](https://github.com/bjorkgard/secretary-application/pull/429))

- import:
  - fix issues with import ([e976b25](https://github.com/bjorkgard/secretary-application/commit/e976b2548545f6573a04e9d95cbadd062e62a92f)) ([#428](https://github.com/bjorkgard/secretary-application/pull/428))

- export s-21:
  - mark ministerial servant when exporting S-21 ([e2d3cbf](https://github.com/bjorkgard/secretary-application/commit/e2d3cbf59a4eb05aff42b4d89b67ae3a30d775b6)) ([#428](https://github.com/bjorkgard/secretary-application/pull/428))

- new version:
  - show info when a new version has been released ([d7f97b4](https://github.com/bjorkgard/secretary-application/commit/d7f97b4b68133ab96d9e728123621ae3bb1c1896)) ([#420](https://github.com/bjorkgard/secretary-application/pull/420))

- loading:
  - remove debug text ([98603b7](https://github.com/bjorkgard/secretary-application/commit/98603b76934ba3c2e50b91954da91fceca9ef6c5)) ([#417](https://github.com/bjorkgard/secretary-application/pull/417))

- template:
  - typo ([9c9ee1d](https://github.com/bjorkgard/secretary-application/commit/9c9ee1de2bb4fada1997df2b2a1d1cf7444e47b4)) ([#410](https://github.com/bjorkgard/secretary-application/pull/410))
  - a new description if upload fails ([7c0bb87](https://github.com/bjorkgard/secretary-application/commit/7c0bb8742ed44400ec6986f06f014457e5a63a32)) ([#410](https://github.com/bjorkgard/secretary-application/pull/410))

- registration:
  - update error message if registration fails ([db916c1](https://github.com/bjorkgard/secretary-application/commit/db916c1c3405af452c3ac7b00ec9556563ca67db)) ([#402](https://github.com/bjorkgard/secretary-application/pull/402))

- auto update:
  - set up auto update ([c79e6c6](https://github.com/bjorkgard/secretary-application/commit/c79e6c613de6845741da066391db5aa26c3041d1)) ([#393](https://github.com/bjorkgard/secretary-application/pull/393))

- changelog:
  - create a PR to commit updates ([18fc64a](https://github.com/bjorkgard/secretary-application/commit/18fc64ae8d263aa327d6c429f77cb75872629945)) ([#390](https://github.com/bjorkgard/secretary-application/pull/390))

- help menu:
  - add correct links to the options ([60c8ac6](https://github.com/bjorkgard/secretary-application/commit/60c8ac6b17271778aab7dc1240b2bdde96a6c979)) ([#386](https://github.com/bjorkgard/secretary-application/pull/386))

- auto updater:
  - setup auto update script ([64f69a5](https://github.com/bjorkgard/secretary-application/commit/64f69a5e13d7643ce17f950928f9dd1749d62f65)) ([#385](https://github.com/bjorkgard/secretary-application/pull/385))

- notarize:
  - fix build script ([a103bf5](https://github.com/bjorkgard/secretary-application/commit/a103bf5659f87cce89f9a2a2127a6e334f41f2b5)) ([#344](https://github.com/bjorkgard/secretary-application/pull/344))
  - fix build script ([1507f7b](https://github.com/bjorkgard/secretary-application/commit/1507f7b0e7ad3518c14561cb6f7f9074926592f1)) ([#342](https://github.com/bjorkgard/secretary-application/pull/342))

- release version:
  - update new version info ([20650a1](https://github.com/bjorkgard/secretary-application/commit/20650a1e6b7267e1c5093f4a7f82dac416038df5)) ([#324](https://github.com/bjorkgard/secretary-application/pull/324))

- publisher events:
  - add some missing events ([cf8e715](https://github.com/bjorkgard/secretary-application/commit/cf8e71556c1f4952ebaac17409d599a47dfb1c38)) ([#193](https://github.com/bjorkgard/secretary-application/pull/193))

- typescript:
  - update type configurations ([66c65ec](https://github.com/bjorkgard/secretary-application/commit/66c65ec3cc3799628ffc3b2edc2c590f55fc1efc)) ([#190](https://github.com/bjorkgard/secretary-application/pull/190))

- start reporting:
  - get correct month when starting a new report ([4fc7e21](https://github.com/bjorkgard/secretary-application/commit/4fc7e211f94027f8ba3c4112bfd1c30ad154d41c)) ([#190](https://github.com/bjorkgard/secretary-application/pull/190))

- filter publishers:
  - a search filter for publishers ([19ce3c7](https://github.com/bjorkgard/secretary-application/commit/19ce3c7fe716f1889b8032379cb0bad99f5ab9cb)) ([#144](https://github.com/bjorkgard/secretary-application/pull/144))

- auxiliary widget:
  - fix translation and layout problems ([b08319a](https://github.com/bjorkgard/secretary-application/commit/b08319a4a65cfa5d305b8ab2c7dbfe0be21a40f5)) ([#130](https://github.com/bjorkgard/secretary-application/pull/130))

- auxiliaries:
  - show continuous auxiliary pioneers on start page ([4dc0436](https://github.com/bjorkgard/secretary-application/commit/4dc0436a72cf6321b1f216ec1c48b022c8fb0ced)) ([#129](https://github.com/bjorkgard/secretary-application/pull/129))

- settings:
  - fix an error first time a user save settings ([5fd7ce8](https://github.com/bjorkgard/secretary-application/commit/5fd7ce8a571f7b29109703a12ed861cf6cfce483)) ([#125](https://github.com/bjorkgard/secretary-application/pull/125))

- electron-builder:
  - use correct naming for the application ([54a8f6f](https://github.com/bjorkgard/secretary-application/commit/54a8f6fe2a6f9d6b39db937f189525097dc82753)) ([#91](https://github.com/bjorkgard/secretary-application/pull/91))

- autotable:
  - update AutoTable function ([9df9837](https://github.com/bjorkgard/secretary-application/commit/9df98377525c1763170191b984f2d8c47708e153)) ([#56](https://github.com/bjorkgard/secretary-application/pull/56))

- general:
  - Update changelog workflow to include push event and workflow dispatch ([32390c2](https://github.com/bjorkgard/secretary-application/commit/32390c250d8fe88ac81c2504f38aeab67fef3279)) ([#64](https://github.com/bjorkgard/secretary-application/pull/64))
  - Generate changelog ([45907a8](https://github.com/bjorkgard/secretary-application/commit/45907a8e6ce836066566de69c68e5e2767b9eba8)) ([#63](https://github.com/bjorkgard/secretary-application/pull/63))
  - Missing translations ([9654a36](https://github.com/bjorkgard/secretary-application/commit/9654a36d1923ec86a96319cb38d6bc67215ce941)) ([#63](https://github.com/bjorkgard/secretary-application/pull/63))
  - TS errors ([182c2c8](https://github.com/bjorkgard/secretary-application/commit/182c2c875c1b54a603ba083568e4c175d2725fca)) ([#62](https://github.com/bjorkgard/secretary-application/pull/62))

### Documentation

- crowdin:
  - update badge and link ([26fe948](https://github.com/bjorkgard/secretary-application/commit/26fe948ebcddcdaa149b6e0535a6a4cef51785c5)) ([#445](https://github.com/bjorkgard/secretary-application/pull/445))

- documentation:
  - update som texts ([8d00715](https://github.com/bjorkgard/secretary-application/commit/8d007152e902ae86e9b3ea936e346898bcd29c0f)) ([#441](https://github.com/bjorkgard/secretary-application/pull/441))

### Refactor

- changelog:
  - update changelog ([e863a70](https://github.com/bjorkgard/secretary-application/commit/e863a70d698c97bec966b64884f1c488a1e7aa88)) ([#527](https://github.com/bjorkgard/secretary-application/pull/527))

- congregation history:
  - layout adjustments ([1417295](https://github.com/bjorkgard/secretary-application/commit/1417295be527d020884b4c82a10f67ea67f5829a)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))

- bugsnag:
  - remove bugsnag ([e91b842](https://github.com/bjorkgard/secretary-application/commit/e91b842e2070e07e5a9ef812074578e60d49547c)) ([#392](https://github.com/bjorkgard/secretary-application/pull/392))

- notarize:
  - notarize mac application ([296f4ff](https://github.com/bjorkgard/secretary-application/commit/296f4ff41e2ab15ccb706a65d056fc7e7f70f7d5)) ([#273](https://github.com/bjorkgard/secretary-application/pull/273))

- backup warning:
  - show a warning if backup is late or missing ([5b2508f](https://github.com/bjorkgard/secretary-application/commit/5b2508f37dc00738e92d675661a00571b14db43e)) ([#253](https://github.com/bjorkgard/secretary-application/pull/253))

- pdf flatten:
  - flatten pdf form when exporting complete sets ([bdeb3ee](https://github.com/bjorkgard/secretary-application/commit/bdeb3eef8b992ce2c8b7379711570746e3443489)) ([#237](https://github.com/bjorkgard/secretary-application/pull/237))

- is dev:
  - remove electron-is-dev and instead use env-variable ([4834f78](https://github.com/bjorkgard/secretary-application/commit/4834f785162825bd5e02fa740d4097af1b8af444)) ([#236](https://github.com/bjorkgard/secretary-application/pull/236))

- semantic-release:
  - rename config file ([bd91ae9](https://github.com/bjorkgard/secretary-application/commit/bd91ae9a7ceb85d0470ebe0b0f85b75d744a7ca7)) ([#186](https://github.com/bjorkgard/secretary-application/pull/186))

- backup:
  - create and restore a backup ([8adb210](https://github.com/bjorkgard/secretary-application/commit/8adb210c2ace4612e1bf23e33698a78136bdff93)) ([#233](https://github.com/bjorkgard/secretary-application/pull/233))

- event modal:
  - add form to store events on a publisher ([205aff9](https://github.com/bjorkgard/secretary-application/commit/205aff9910455bc357b8c93c8a02d47ae524899a)) ([#232](https://github.com/bjorkgard/secretary-application/pull/232))

- export s-21:
  - do not use flatten PDF form ([d78910f](https://github.com/bjorkgard/secretary-application/commit/d78910fb391179a7ad1e2e4f9dbe2f8bb54e899d)) ([#132](https://github.com/bjorkgard/secretary-application/pull/132))

- electron-builder.yml:
  - remove old config-file ([d8a233a](https://github.com/bjorkgard/secretary-application/commit/d8a233ae0a48379a782824d20a290c7ab9611b10)) ([#108](https://github.com/bjorkgard/secretary-application/pull/108))

### Performance Improvements

- electron:
  - update to latest electron ([bfcad70](https://github.com/bjorkgard/secretary-application/commit/bfcad70581c75657694cf529b953a9f0d319205c)) ([#590](https://github.com/bjorkgard/secretary-application/pull/590))
  - update to latest version of Electron ([f354326](https://github.com/bjorkgard/secretary-application/commit/f354326669ef95da3853d3827dd857ed2c26d516)) ([#361](https://github.com/bjorkgard/secretary-application/pull/361))

- husky:
  - install latest version of husky ([e4fca39](https://github.com/bjorkgard/secretary-application/commit/e4fca391fb875ba6901ebb30671142807f45e3ee)) ([#235](https://github.com/bjorkgard/secretary-application/pull/235))

- export register card:
  - flatten all PDF-pages when exporting multiple S-21 ([e5286ca](https://github.com/bjorkgard/secretary-application/commit/e5286ca2c75dfdd288bf628ea10f7231e15feaaf)) ([#126](https://github.com/bjorkgard/secretary-application/pull/126))

\* *This CHANGELOG was automatically generated by [auto-generate-changelog](https://github.com/BobAnkh/auto-generate-changelog)*
