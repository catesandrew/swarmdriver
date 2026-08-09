import { execSync } from 'child_process'

export const addCommands = ({
  libs = [],
  device,
  overwrite = false,
  native = false,
}) => {
  for (let i = 0; i < libs.length; i++) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in libs[i]) {
      if ({}.hasOwnProperty.call(libs[i], key)) {
        if (native) {
          // native devices
          device.addCommand(key, libs[i][key])
        } else if (overwrite) {
          device.overwriteCommand(key, libs[i][key], true)
        } else {
          device.addCommand(key, libs[i][key], false)
        }
      }
    }
  }
}

export const onlyUnique = (value, index, self) => self.indexOf(value) === index

export const buildDate = () => {
  try {
    const result = execSync('date -u +"%Y-%m-%dT%H:%M:%SZ"', {
      encoding: 'utf8',
    })
    if (result) {
      return result.trim()
    }
  } catch (err) {
    console.error(err)
  }
}

export const buildGitRef = () => {
  try {
    const result = execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
    })
    if (result) {
      return result.trim()
    }
  } catch (err) {
    console.error(err)
  }
}
