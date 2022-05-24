import {Command} from 'commander';
import * as fs from 'fs';

const program = new Command();

program
  .requiredOption('-p --path <path>', 'The search directory')
  .requiredOption(
    '-a, --app <app>',
    'The application to load the templates from'
  )
  .requiredOption('-c, --conn <conn>', 'The connection template to use')
  .requiredOption(
    '-C, --command <command>',
    'The application to load the templates from'
  );

program.parse(process.argv);
const options = program.opts();

const {path, app, conn, command} = options;

const existsPath = async (path: string) => {
  return new Promise(resolve => {
    fs.access(path, error => {
      resolve(error === null);
    });
  });
};

const fileGetContents = async (path: string) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, buff) => {
      if (err) {
        return reject(err);
      }
      resolve(buff.toString());
    });
  });
};

const bootstrap = async () => {
  const appDir = `${path}/${app}`;
  if (!(await existsPath(appDir))) {
    console.log('App folder does not exist');
    return;
  }

  const connFilePath = `${appDir}/connectionTemplates/${conn}.json`;
  if (!(await existsPath(connFilePath))) {
    console.log('Connection templates folder does not exist');
    return;
  }

  const commandFilePath = `${appDir}/actionTemplates/${command}.json`;
  if (!(await existsPath(commandFilePath))) {
    console.log('Action templates folder does not exist');
    return;
  }

  try {
    const strConn = await fileGetContents(connFilePath);
    const strCommand = await fileGetContents(commandFilePath);

    console.log(strConn, strCommand, '+++');
  } catch (error) {
    console.log(error);
  }
};

bootstrap().then().catch();
