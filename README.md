# awsome-doctor-cli

## Installation

```bash
npm install -g awsome-doctor-cli
```

## Quick Start

> Local AWS credentials will be used.

```bash
# run workflow in official repo: https://github.com/DiscreteTom/awsome-doctor
# with workflow parameters
adc run EC2/ping --instanceId i-1234567890

# run workflow from URL
adc run \
  https://raw.githubusercontent.com/DiscreteTom/awsome-doctor/main/workflow/EC2/ping.yaml \
  --instanceId i-1234567890

# run workflow in local disk
adc run -f ./workflow.yml
```

## Limitation

- Markdown will not be rendered.

## [CHANGELOG](https://github.com/DiscreteTom/awsome-doctor-cli/blob/main/CHANGELOG.md)

## Related Projects

- [awsome-doctor](https://github.com/DiscreteTom/awsome-doctor): A browser based AWS troubleshooting tool.
- [awsome-doctor-cli](https://github.com/DiscreteTom/awsome-doctor-cli): Command line interface version of Awsome Doctor.
- [awsome-doctor-view](https://github.com/DiscreteTom/awsome-doctor-view): Frontend code of Awsome Doctor.
- [awsome-doctor-core](https://github.com/DiscreteTom/awsome-doctor-core): Workflow executor, plugins and util functions of Awsome Doctor.
