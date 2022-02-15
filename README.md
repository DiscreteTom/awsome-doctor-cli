# This project is no longer maintained.

# awsome-doctor-cli

[![npm](https://img.shields.io/npm/v/awsome-doctor-cli)](https://www.npmjs.com/package/awsome-doctor-cli)

## Installation

```bash
npm install -g awsome-doctor-cli
```

## Quick Start

> Local AWS credentials will be used. See [this doc](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html#getting-started-quickstart-new) for quick setup.

```bash
# show all available workflows
adc ls
# or
adc list

# describe a workflow, show parameters
adc show EC2/ping

# run a workflow in the official repo: https://github.com/DiscreteTom/awsome-doctor
# with workflow parameters
adc run EC2/ping --instanceId i-1234567890

# run workflow from URL
adc run \
  https://raw.githubusercontent.com/DiscreteTom/awsome-doctor/main/workflow/EC2/ping.yaml \
  --instanceId i-1234567890

# run workflow in local disk
adc run -f ./workflow.yml
# or
adc run --file ./workflow.yml

# show help
adc
# or
adc --help
# or show sub-command help
adc run --help
```

## Limitation

- Markdown will not be rendered.

## [CHANGELOG](https://github.com/DiscreteTom/awsome-doctor-cli/blob/main/CHANGELOG.md)
