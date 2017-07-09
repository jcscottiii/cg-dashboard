
Login to the team.
```sh
fly --target navi login --concourse-url https://ci.fr.cloud.gov \
  --team-name navigator
```

Copy the example credentials.
```sh
cp credentials.example.yml credentials.yml
```

Proceed to fill in the credentials.yml.

Note: In the case you are replacing some credentials to an existing pipeline, you can
get the pipeline with the `get-pipeline` command

```sh
fly -t navi get-pipeline --pipeline cg-dashboard > current_pipeline.yml
```

Set the new pipeline

```sh
fly -t navi set-pipeline --pipeline cg-dashboard --config pipeline.yml --load-vars-from credentials.yml
```

## Obtaining certain credentials

### status-access-token

Per the [documentation](https://github.com/jtarchie/pullrequest-resource)
for the PR Resource, you need to get an access_token with `repo:status` access.
Follow GitHub's
[instructions](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
on how to get the access token.
