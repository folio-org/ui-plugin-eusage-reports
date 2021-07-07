# Updating the Stripes bundle for the Thor project in Rancher.

_By John Malconian, edited by Mike Taylor_

6-7 July 2021.

1. Merge `ui-plugin-eusage-reports` changes to master.

2. Log into Jenkins and navigate to the BUILD-UI job: https://jenkins-aws.indexdata.com/job/scratch_environment/job/BUILD-UI/

3. Click on "Build with Parameters". Select `thor` from the first dropdown, `thor-snapshot` from the second dropdown, and then click the **Build** button. Jenkins will build a `platform-complete` snapshot Stripes bundle and push it to the local Docker repository, docker.dev.folio.org [Note 1]. XXX get tag from logs

4. [Log into Rancher](https://rancher.dev.folio.org/login), click on the `folio-eks-2-us-west-2` cluster, and from the top menu of that name select the `thor` project. Select "Apps" from the navigation bar. Search within the page for the `platform-complete` "app", click on the three vertical dots, and select "Upgrade". Pn the upgrade page, the only option that needs to be modified is the `image.tag` variable: set it to the tag of the docker image we created in the previous step. e.g. `thor-97`. Click on the **Upgrade** button at the bottom of the page. Rancher will then replace the existing Stripes bundle with a Docker image of the new bundle.

5. Log out of any existing thor UI sessions and reload https://thor.ci.folio.org in your browser and log back into the UI.

Note: The process described above will work assuming no new permissions have been added to the module. If new permissions are added, you will need to grant them to the `diku_admin` user after posting an updated module descriptor to Okapi. See https://dev.folio.org/faqs/how-to-get-started-with-rancher/ for additional info.


## Notes

1. The image created will be called docker.dev.folio.org/platform-complete:thor-$JENKINS_BUILD_NUMBER. Note the "tag" of the image which is 'thor-$JENKINS_BUILD_NUMBER'. XXXX You can see it here https://repository.folio.org/#browse/browse:docker-ci-preview:v2%2Fplatform-complete%2Ftags%2Fthor-97
