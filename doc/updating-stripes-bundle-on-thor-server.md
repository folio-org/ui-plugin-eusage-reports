# Updating the Stripes bundle for the Thor project in Rancher.

_By John Malconian, edited by Mike Taylor_

6-7 July 2021.

## Create the code

* Write the code in `ui-plugin-eusage-reports` and related modules.
* Merge the changes to their respective master branches.

## Build the UI bundle

* [Log into Jenkins](https://jenkins-aws.indexdata.com/)
* Navigate to [the BUILD-UI job](https://jenkins-aws.indexdata.com/job/scratch_environment/job/BUILD-UI/)
* Click on "Build with Parameters".
* Select `thor` from the first dropdown and `thor-snapshot` from the second dropdown, then click the **Build** button.
* Jenkins will build a `platform-complete` snapshot Stripes bundle and push it to the local Docker repository, `docker.dev.folio.org`
* Examine the Jenkins job's logs to determine the build's tag, which will be of the form `thor-`_number_, e.g. `thor-97`.

**Note.**
The image created will be called docker.dev.folio.org/platform-complete:thor-$JENKINS_BUILD_NUMBER. You can see this image, and others, in [the repository browser](https://repository.folio.org/#browse/browse:docker-ci-preview:v2%2Fplatform-complete%2Ftags%2Fthor-97)


## Deploy the new bundle

* [Log into Rancher](https://rancher.dev.folio.org/login)
* Click on the `folio-eks-2-us-west-2` cluster
* From the `folio-eks-2-us-west-2` top menu of the new page, select the `thor` project.
* Select "Apps" from the navigation bar of the new page.
* Search within the page for the `platform-complete` "app", click on the three vertical dots, and select "Upgrade".
* On the upgrade page, the only option that needs to be modified is the `image.tag` variable: set it to the tag of the docker image created in the previous step. e.g. `thor-97`.
* Click on the **Upgrade** button at the bottom of the page. Rancher will then replace the existing Stripes bundle with a Docker image of the new bundle.


## View the new bundle

* Log out of any existing thor UI sessions
* Shift-reload https://thor.ci.folio.org in your browser
* Log back into the UI.

**Note.**
The process described above will work assuming no new permissions have been added to the module. If new permissions are added, you will need to grant them to the `diku_admin` user after posting an updated module descriptor to Okapi. See [_How to get started with Rancher environment_](https://dev.folio.org/faqs/how-to-get-started-with-rancher/) for additional info.


