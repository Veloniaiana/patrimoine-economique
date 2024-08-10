import fs from 'node:fs/promises';

async function readFile(path) {
  try {
    const data = await fetch(path);
    const json = await data.json();
    return json;
  } catch (err) {
    return {
      status: "ERROR",
      error: err,
    };
  }
}


async function writeFile(path, data) {
  try {
    await fs.writeFile(path, JSON.stringify(data), {
      encoding: 'utf8',
    });
    return {
      status: "OK",
    };
  } catch (err) {
    return {
      status: "ERROR",
      error: err,
    };
  }
}

export { readFile, writeFile };