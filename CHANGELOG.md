# CHANGELOG

## [v1.4.1](https://github.com/bjorkgard/secretary-application/releases/tag/v1.4.1) - 2024-06-10 12:18:25

<!-- Release notes generated using configuration in .github/release.yml at v1.4.1 -->

## What's Changed
### Bug fixes
* fix(report compilation): fix problem when exporting old service months by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/528


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.4.0...v1.4.1

### Bug Fixes

- report compilation:
  - fix problem when exporting old service months ([7b82894](https://github.com/bjorkgard/secretary-application/commit/7b8289457af7eb3096a16ae9be7f027f96a26e68)) ([#528](https://github.com/bjorkgard/secretary-application/pull/528))

## [v1.4.0](https://github.com/bjorkgard/secretary-application/releases/tag/v1.4.0) - 2024-06-10 11:18:04

<!-- Release notes generated using configuration in .github/release.yml at v1.4.0 -->

## What's Changed
### New features
* feat(address list): addresslist with emergency contact by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/464
* feat(service groups): export a lis of service groups by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/467
* fix(address list): force linebreaks in excel export by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/469
* feat(transfer publisher): if a publisher is moving select a congregat… by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/474
* feat(extended register card): export extended register card by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/476
* feat(history) Add, edit and delete publisher reports by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/501

### Bug fixes
* fix(version): check if version is released before show warning by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/470


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.3.9...v1.4.0

### Feature

- history:
  - publisher history ([d23bca6](https://github.com/bjorkgard/secretary-application/commit/d23bca6ffe9279d65245c43451dc14f2f8274e63)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))

## [v1.3.9](https://github.com/bjorkgard/secretary-application/releases/tag/v1.3.9) - 2024-06-10 07:28:52

<!-- Release notes generated using configuration in .github/release.yml at v1.3.9 -->

## What's Changed
### Bug Fixes
* fix(report compilation): calculate meeting visitors correctly by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/521


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.3.8...v1.3.9

### Bug Fixes

- report compilation:
  - calculate meeting visitors correctly ([6013621](https://github.com/bjorkgard/secretary-application/commit/60136212e1043d7c251f1994988a7f61271d6262)) ([#521](https://github.com/bjorkgard/secretary-application/pull/521))

- deps:
  - bump electron-updater from 6.1.8 to 6.2.1 (#515) ([d1bb30a](https://github.com/bjorkgard/secretary-application/commit/d1bb30a224218500553b079a7253cf583fcb6edc)) ([#515](https://github.com/bjorkgard/secretary-application/pull/515))

### Refactor

- congregation history:
  - layout adjustments ([1417295](https://github.com/bjorkgard/secretary-application/commit/1417295be527d020884b4c82a10f67ea67f5829a)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))

## [v1.3.8](https://github.com/bjorkgard/secretary-application/releases/tag/v1.3.8) - 2024-05-31 18:23:02

<!-- Release notes generated using configuration in .github/release.yml at v1.3.8 -->

Fix mac version

**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.3.7...v1.3.8

### Feature

- publisher report:
  - do not add future reports ([55b5d84](https://github.com/bjorkgard/secretary-application/commit/55b5d84ca91b90bf68c72c23431926ee515ffba8)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))
  - add historical reports for a publisher ([c550acc](https://github.com/bjorkgard/secretary-application/commit/c550acc1e72951c866890bdf1430e780aeef90d7)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))

### Bug Fixes

- auxiliary:
  - fix a problem in the auxiliary list on the dashboard ([6b99728](https://github.com/bjorkgard/secretary-application/commit/6b99728a4a03a8b578549790fed35b9ce65cf600)) ([#504](https://github.com/bjorkgard/secretary-application/pull/504))

## [v1.3.6](https://github.com/bjorkgard/secretary-application/releases/tag/v1.3.6) - 2024-05-29 22:15:32

<!-- Release notes generated using configuration in .github/release.yml at v1.3.6 -->

## What's Changed
### Bug fixes
* fix(s-21): mark if publisher are Special pioneer by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/502


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.3.5...v1.3.6

### Feature

- edit publishers report:
  - update publishers reports in history ([4a8b602](https://github.com/bjorkgard/secretary-application/commit/4a8b60243151d3cfbeea31a7492c2b3f72d2a361)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))

- publisher history:
  - show report history for a publisher ([57779c5](https://github.com/bjorkgard/secretary-application/commit/57779c5e9d777f3ba9c398deecc3afc2e7de4466)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))

- congregation history:
  - show monthly history for the congregation ([fb0009a](https://github.com/bjorkgard/secretary-application/commit/fb0009a2d1adf766e40aa76916fd731d1e9429f3)) ([#501](https://github.com/bjorkgard/secretary-application/pull/501))

- extended register card:
  - export extended register card ([21a3017](https://github.com/bjorkgard/secretary-application/commit/21a30177e6ae56afd50b0833925b814817f7b8b2)) ([#476](https://github.com/bjorkgard/secretary-application/pull/476))

### Bug Fixes

- s-21:
  - mark if publisher are Special pioneer ([4f1454d](https://github.com/bjorkgard/secretary-application/commit/4f1454d7c7ec093881c8a993fb8971d28d6da63a)) ([#502](https://github.com/bjorkgard/secretary-application/pull/502))

- deps:
  - bump react-hook-form from 7.51.4 to 7.51.5 (#494) ([0d239c9](https://github.com/bjorkgard/secretary-application/commit/0d239c9df7d456cd1f0d03e9e3d3ec45c6da77ed)) ([#494](https://github.com/bjorkgard/secretary-application/pull/494))
  - bump react-phone-number-input from 3.4.1 to 3.4.3 (#497) ([203fc37](https://github.com/bjorkgard/secretary-application/commit/203fc37e1134c1a43c81cc0a3602a02ab66f5e07)) ([#497](https://github.com/bjorkgard/secretary-application/pull/497))
  - bump ajv from 8.13.0 to 8.14.0 (#491) ([0b2eb28](https://github.com/bjorkgard/secretary-application/commit/0b2eb28c9d5ec83edbc6376ff8b658419dc29e34)) ([#491](https://github.com/bjorkgard/secretary-application/pull/491))
  - bump i18next from 23.11.4 to 23.11.5 (#489) ([4947cd4](https://github.com/bjorkgard/secretary-application/commit/4947cd43f04a9e53cfc0cd18cac51d37b02de25a)) ([#489](https://github.com/bjorkgard/secretary-application/pull/489))
  - bump react-i18next from 14.1.1 to 14.1.2 (#487) ([2959068](https://github.com/bjorkgard/secretary-application/commit/2959068bab3425b3bf8b6ba0c11543f36f6d3880)) ([#487](https://github.com/bjorkgard/secretary-application/pull/487))

## [v1.3.5](https://github.com/bjorkgard/secretary-application/releases/tag/v1.3.5) - 2024-05-25 13:57:04

<!-- Release notes generated using configuration in .github/release.yml at v1.3.5 -->

## What's Changed
### Bug fixes
* fix(translation): correct spelling by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/475


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.3.4...v1.3.5

### Feature

- transfer publisher:
  - if a publisher is moving select a congregation and transfer data ([1411b10](https://github.com/bjorkgard/secretary-application/commit/1411b1023e171965204a6dbec3401f6b8132c29d)) ([#474](https://github.com/bjorkgard/secretary-application/pull/474))

### Bug Fixes

- translation:
  - correct spelling ([28713be](https://github.com/bjorkgard/secretary-application/commit/28713bea3faf11becc87c807725d30fb29df91af)) ([#475](https://github.com/bjorkgard/secretary-application/pull/475))

- version:
  - check if version is released before show warning ([f0b51e2](https://github.com/bjorkgard/secretary-application/commit/f0b51e22a56bca9b5ff5bc2879d306898eabdf85)) ([#470](https://github.com/bjorkgard/secretary-application/pull/470))

- address list:
  - force linebreaks in excel export ([9fe29a5](https://github.com/bjorkgard/secretary-application/commit/9fe29a5b658135fd896040c9fde28c2f825a531f)) ([#469](https://github.com/bjorkgard/secretary-application/pull/469))

## [v1.3.4](https://github.com/bjorkgard/secretary-application/releases/tag/v1.3.4) - 2024-05-23 20:18:15

<!-- Release notes generated using configuration in .github/release.yml at v1.3.4 -->

## What's Changed
### Fixes
* fix(address list): force linebreaks in excel by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/468


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.3.3...v1.3.4

### Feature

- service groups:
  - export a lis of service groups ([8c586f4](https://github.com/bjorkgard/secretary-application/commit/8c586f43e97e77fb902131e664a0d85377f7aaef)) ([#467](https://github.com/bjorkgard/secretary-application/pull/467))

- address list:
  - addresslist with emergency contact ([f201cc4](https://github.com/bjorkgard/secretary-application/commit/f201cc49408b92d51508c0bc8802af7bc6829bc2)) ([#464](https://github.com/bjorkgard/secretary-application/pull/464))

### Bug Fixes

- address list:
  - force linebreaks in excel ([0bdf1dd](https://github.com/bjorkgard/secretary-application/commit/0bdf1ddfb25ce7380fa448ec20c1aaddea54a7b1)) ([#468](https://github.com/bjorkgard/secretary-application/pull/468))

## [v1.3.3](https://github.com/bjorkgard/secretary-application/releases/tag/v1.3.3) - 2024-05-22 14:37:14

<!-- Release notes generated using configuration in .github/release.yml at v1.3.3 -->

## What's Changed
### Other Changes
* fix(translations): add missing translations by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/462


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.3.2...v1.3.3

### Bug Fixes

- translations:
  - add missing translations ([d8a2632](https://github.com/bjorkgard/secretary-application/commit/d8a2632a2018a159302f127e2fe46809f6ed6ddb)) ([#462](https://github.com/bjorkgard/secretary-application/pull/462))

## [v1.3.2](https://github.com/bjorkgard/secretary-application/releases/tag/v1.3.2) - 2024-05-20 20:33:57

<!-- Release notes generated using configuration in .github/release.yml at v1.3.2 -->

## What's Changed
### Other Changes
* docs(CHANGELOG): update release notes by @github-actions in https://github.com/bjorkgard/secretary-application/pull/450
* fix(export): export of forms with multiple pages by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/457


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.3.1...v1.3.2

### Bug Fixes

- export pdf forms:
  - do not merge pdf-files as default ([69cbdd3](https://github.com/bjorkgard/secretary-application/commit/69cbdd38ec0e5faf0a839638934953e558e5c71e)) ([#457](https://github.com/bjorkgard/secretary-application/pull/457))

- menu:
  - add missing menu options ([fcff7f5](https://github.com/bjorkgard/secretary-application/commit/fcff7f57a45f59b335ed570f365d892e108d35aa)) ([#457](https://github.com/bjorkgard/secretary-application/pull/457))

- deps:
  - bump chart.js from 4.4.2 to 4.4.3 (#456) ([40b5c84](https://github.com/bjorkgard/secretary-application/commit/40b5c842e28b2112ca6a0a402275de3c2d0e91c0)) ([#456](https://github.com/bjorkgard/secretary-application/pull/456))

- report excel:
  - fix a problem where the forms were protected ([6fa8731](https://github.com/bjorkgard/secretary-application/commit/6fa87310ba1002e17d1a4a6a606b91152317b686)) ([#448](https://github.com/bjorkgard/secretary-application/pull/448))

### Documentation

- crowdin:
  - update badge and link ([26fe948](https://github.com/bjorkgard/secretary-application/commit/26fe948ebcddcdaa149b6e0535a6a4cef51785c5)) ([#445](https://github.com/bjorkgard/secretary-application/pull/445))

## [v1.3.0](https://github.com/bjorkgard/secretary-application/releases/tag/v1.3.0) - 2024-05-19 19:27:03

<!-- Release notes generated using configuration in .github/release.yml at v1.3.0 -->

## What's Changed
### Other Changes
* feat(unbaptised publisher): add an event for new ubaptised publisher by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/422
* feat(baptised): add an event Baptised for a publisher by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/424
* feat(congregation s21): s21 för hela församlingen församlingens registerkort by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/433
* feat(stadsbidrag) registerkort för statsbidrag by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/441
* feat(completion list): export a list with publishers in needs for com… by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/442
* 1.3.0 by @bjorkgard in https://github.com/bjorkgard/secretary-application/pull/423


**Full Changelog**: https://github.com/bjorkgard/secretary-application/compare/v1.2.8...v1.3.0

### Feature

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

- menu:
  - add missing option for windows ([17d15a7](https://github.com/bjorkgard/secretary-application/commit/17d15a7f58f4855d8175663b2d5c991e005fb776)) ([#441](https://github.com/bjorkgard/secretary-application/pull/441))
  - add missing export option for windows ([92b0678](https://github.com/bjorkgard/secretary-application/commit/92b067804653c8bdfaa2539eac6a46a8226b463b)) ([#431](https://github.com/bjorkgard/secretary-application/pull/431))
  - show the application menu ([5aed27c](https://github.com/bjorkgard/secretary-application/commit/5aed27c82544dae6b560cce64dcc18544d856c21)) ([#418](https://github.com/bjorkgard/secretary-application/pull/418))

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

- deps:
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

- documentation:
  - update som texts ([8d00715](https://github.com/bjorkgard/secretary-application/commit/8d007152e902ae86e9b3ea936e346898bcd29c0f)) ([#441](https://github.com/bjorkgard/secretary-application/pull/441))

### Refactor

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
  - update to latest version of Electron ([f354326](https://github.com/bjorkgard/secretary-application/commit/f354326669ef95da3853d3827dd857ed2c26d516)) ([#361](https://github.com/bjorkgard/secretary-application/pull/361))

- husky:
  - install latest version of husky ([e4fca39](https://github.com/bjorkgard/secretary-application/commit/e4fca391fb875ba6901ebb30671142807f45e3ee)) ([#235](https://github.com/bjorkgard/secretary-application/pull/235))

- export register card:
  - flatten all PDF-pages when exporting multiple S-21 ([e5286ca](https://github.com/bjorkgard/secretary-application/commit/e5286ca2c75dfdd288bf628ea10f7231e15feaaf)) ([#126](https://github.com/bjorkgard/secretary-application/pull/126))

\* *This CHANGELOG was automatically generated by [auto-generate-changelog](https://github.com/BobAnkh/auto-generate-changelog)*
