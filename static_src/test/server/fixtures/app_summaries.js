

const appSummaries = [
  {
    guid: "2f684200-b9da-4ea6-a3c8-01a1df5ef2d3",
    name: "fake-adfake-node",
    routes: [
      {
        guid: "228342e9-2c9d-4874-95fe-0a06ac5ceb43",
        host: "adfake-node",
        port: null,
        path: 0,
        domain: {
          guid: "97435c2f-d5bb-4c10-8393-55d7d7169932",
          name: "fake-apps.cloud.gov"
        }
      }
    ],
    running_instances: 2,
    services: [
      {
        guid: "3f6b7712-3c72-48ff-9774-c7b0895c4489",
        name: "fake-abcdef",
        bound_app_count: 1,
        last_operation: {
          type: "create",
          state: "succeeded",
          description: "The instance was created",
          updated_at: "2015-10-29T18:12:48Z",
          created_at: "2015-10-29T18:12:48Z"
        },
        dashboard_url: null,
        service_plan: {
          guid: "fca6b5c2-2e57-4436-a68e-562c1ee3b8b8",
          name: "fake-shared-psql",
          service: {
            guid: "be2de43d-bf57-4bd3-98d3-6ae021268030",
            label: "rds",
            provider: null,
            version: null
          }
        }
      }
    ],
    available_domains: [
      {
        guid: "646d73b7-eda3-49e6-9959-848062d3c694",
        name: "fake-18f.us",
        owning_organization_guid: "533d8476-f3e9-4362-ba2a-a3fdde21bde2"
      },
      {
        guid: "3750eb89-86c6-4882-96bf-66b8c6363290",
        name: "fake-18f.gov",
        owning_organization_guid: "393f8197-8f0d-444a-a3f7-0a04a5059fd1"
      },
      {
        guid: "a0948d28-abe2-4a2f-b8c5-738e3fb60c24",
        name: "fake-cf.18f.us",
        owning_organization_guid: "533d8476-f3e9-4362-ba2a-a3fdde21bde2"
      },
      {
        guid: "97435c2f-d5bb-4c10-8393-55d7d7169932",
        name: "fake-apps.cloud.gov",
        router_group_guid: null,
        router_group_type: null
      }
    ],
    production: false,
    space_guid: "82af0edb-8540-4064-82f2-d74df612b794",
    stack_guid: "77590563-6c7c-4ec4-9b4a-01ce9d628190",
    buildpack: null,
    detected_buildpack: "node.js 1.5.25",
    detected_buildpack_guid: "a12a1517-f676-4c7a-aa6c-1b05887190f3",
    environment_json: {},
    memory: 82,
    instances: 2,
    disk_quota: 2048,
    state: "STARTED",
    version: "ba72db14-a392-4a2a-ac18-f95714661b28",
    command: null,
    console: false,
    debug: null,
    staging_task_id: "542281c8-69ed-42a3-8664-3cdaa482e5ac",
    package_state: "STAGED",
    health_check_type: "port",
    health_check_timeout: null,
    health_check_http_endpoint: null,
    staging_failed_reason: null,
    staging_failed_description: null,
    diego: false,
    docker_image: null,
    package_updated_at: "2016-12-05T21:13:48Z",
    detected_start_command: "node web.js",
    enable_ssh: true,
    docker_credentials_json: {
      redacted_message: "[PRIVATE DATA HIDDEN]"
    },
    ports: null
  }
];

module.exports = appSummaries;
