const path = require('path')
require('dotenv').config()

module.exports = {
    packagerConfig: {
      icon: path.resolve(__dirname, "src", "assets", "icons", "win", "logo.ico"),
       ignore: ['data/', 'data/data.db','.env', '.gitignore', 'document.pdf', 'log.txt', 'logo.png', 'todo.txt', 'logo.xcf', 'yarn-error.log'],
       packageManager:"yarn"
    },
    makers: [
      {
        name: "@electron-forge/maker-squirrel",
        config: {
          name: "Trombinoscope",
          authors: "Victor Santelé",
          iconUrl: path.resolve(__dirname, "src", "assets", "icons", "ico", "logo.ico")
        }
      },
      {
        name: "@electron-forge/maker-zip",
        platforms: [
          "darwin"
        ]
      },
      {
        name: "@electron-forge/maker-deb",
        config: {}
      },
      {
        name: "@electron-forge/maker-rpm",
        config: {}
      }
    ],
    publishers: [
      {
        name: "@electron-forge/publisher-github",
        config: {
          repository: {
            owner: "wolfvic",
            name: "trombinoscope"
          },
          prerelease: true,
          authToken: process.env.GITHUB_TOKEN
        }
      }
    ],
    make_targets: {
      win32: [
        "squirrel"
      ],
      darwin: [
        "dmg",
        "zip"
      ],
      linux: [
        "deb",
        "rpm"
      ]
    },
    electronPackagerConfig: {
      icon: path.resolve(__dirname, "src", "assets", "icons", "win", "logo.ico"),
      packageManager:"yarn"
    },
    electronWinstallerConfig: {
      name: "Trombinoscope",
      iconUrl: path.resolve(__dirname, "src", "assets", "icons", "win", "logo.ico")
    }
  }