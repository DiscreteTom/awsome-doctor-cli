#!/usr/bin/env node

import executor from "awsome-doctor-core";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import axios from "axios";
import yaml from "js-yaml";
import chalk from "chalk";

const options = yargs(hideBin(process.argv))
  .command("ls|list", "List all available workflows.")
  .command("run [workflow]", "Run a workflow.", (yargs) => {
    return yargs
      .positional("workflow", {
        describe: "YAML format workflow",
        type: "string",
        default: "<stdin>",
      })
      .option("f", {
        alias: "file",
        describe: "Use local workflow file.",
        type: "boolean",
        default: false,
      });
  })
  .command("print [workflow]", "Print workflow as YAML text.", (yargs) => {
    return yargs
      .positional("workflow", {
        describe: "YAML format workflow",
        type: "string",
        default: "<stdin>",
      })
      .option("f", {
        alias: "file",
        describe: "Use local workflow file.",
        type: "boolean",
        default: false,
      });
  })
  .demandCommand() // show help if no command
  .help().argv;

switch (options._[0]) {
  case "ls":
  case "list":
    let res = await axios.get(
      "https://api.github.com/repos/DiscreteTom/awsome-doctor/git/trees/main?recursive=true"
    );

    let workflows = res.data.tree.filter(
      (node) =>
        node.path.startsWith("workflow/") &&
        (node.path.endsWith(".yml") || node.path.endsWith(".yaml")) &&
        node.path.split("/").length === 3
    );

    let result = {};
    workflows.map((f) => {
      let [_, service, name] = f.path.split("/");
      if (!result[service]) result[service] = [];
      result[service].push(
        name.endsWith(".yml") ? name.slice(0, -4) : name.slice(0, -5)
      );
    });

    console.log("Available workflows:\n");
    for (let service in result) {
      console.log(`${service}:`);
      result[service].map((name) => console.log(`  ${service}/${name}`));
      console.log("");
    }
    break;
  case "print":
    console.log(await getWorkflowText(options));
    break;
  case "run":
    // parse workflow & params
    let workflow = yaml.load(await getWorkflowText(options));
    let data = workflow.data;
    workflow.input &&
      workflow.input.map((input) => {
        if (options[input.store] !== undefined) {
          data[input.store] = options[input.store];
        } else {
          console.log(chalk.red(`Missing workflow input: ${input.store}`));
          console.log(`All workflow inputs:`);
          workflow.input.map((input) => {
            console.log(
              `  ${input.store}: ${input.label} ${
                input.placeholder ? "E.g.: " + input.placeholder : ""
              }`
            );
          });
          process.exit(1);
        }
      });

    // print title & params
    console.log(chalk.bold.green(`\nDiagnosing: ${workflow.title}`));
    console.log("With:");
    workflow.input &&
      workflow.input.map((input) => {
        console.log(`  ${input.store} = ${data[input.store]}`);
      });
    console.log("");

    // run steps
    executor.configure({ region: options.region });
    for (let i = 0; i < workflow.steps.length; ++i) {
      let step = workflow.steps[i];
      console.log(`Step ${i + 1}: ${step.name}`);
      let output = await executor.run(step.js, data);
      if (
        output.err !== null &&
        output.err !== undefined &&
        output.err !== ""
      ) {
        console.log(chalk.red(output.err));
      } else if (output.ok) {
        console.log(chalk.green(output.ok));
      } else {
        console.log(chalk.blue(output.info));
      }
      console.log("");
    }
    break;
  default:
    break;
}

async function getWorkflowText(options) {
  let txt = "";
  if (options.workflow == "<stdin>") {
    console.log("Reading workflow from stdin...");
    txt = fs.readFileSync(0, "utf-8");
  } else if (options.file) {
    console.log(`Reading workflow from ${options.workflow}...`);
    txt = fs.readFileSync(options.workflow, "utf-8");
  } else if (
    options.workflow.startsWith("http://") ||
    options.workflow.startsWith("https://")
  ) {
    console.log(`Retrieving workflow from ${options.workflow} ...`);
    txt = (await axios.get(options.workflow)).data;
  } else {
    try {
      let address = `https://raw.githubusercontent.com/DiscreteTom/awsome-doctor/main/workflow/${options.workflow}.yaml`;
      console.log(`Trying to retrieve workflow from ${address} ...`);
      txt = (await axios.get(address)).data;
    } catch {
      let address = `https://raw.githubusercontent.com/DiscreteTom/awsome-doctor/main/workflow/${options.workflow}.yml`;
      console.log(`Trying to retrieve workflow from ${address} ...`);
      txt = (await axios.get(address)).data;
    }
  }
  return txt;
}
