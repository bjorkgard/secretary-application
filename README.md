[![Crowdin](https://badges.crowdin.net/secretary/localized.svg)](https://crowdin.com/project/secretary)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Secretary application

This is still under development and not ready for production use.

### Build and release process
1. Make sure all changes are committed and pushed to the remote repository.
1. Update the version in in the `package.json` file (e.g. 1.2.3)
1. Commit that change without husky (e.g. `HUSKY=0 git commit -am "Bump to version 1.2.3"`)
1. Tag the commit (e.g. `git tag v1.2.3`).
    1. The tag name must match the version in the `package.json` file.
    1. Make sure the tag name is prefixed with a `v` (e.g. `v1.2.3`). The workflow will use this tag to detect when to create a new release.
1. Push the changes to the remote repository (e.g. `git push && git push --tags`)
