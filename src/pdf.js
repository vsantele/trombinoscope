const pdfPrinter = require('pdfmake')
const path = require('path')
const fs = require('fs')

var fonts = {
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  },
  Roboto: {
    normal: path.join(__dirname, 'fonts/Roboto/Roboto-Regular.ttf'),
    bold: path.join(__dirname, 'fonts/Roboto/Roboto-Bold.ttf'),
    italics: path.join(__dirname, 'fonts/Roboto/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, 'fonts/Roboto/Roboto-BoldItalic.ttf')
  }
};

const card = user => {
  return {
    table: {
      widths: ['*'],
      body: [
        [{
          border: [false, false, false, false],
          image: user.photo
        }],
        [{
          border: [false, false, false, false],
          text: user.name,
          alignment: 'center'
        }]
      ]
    }
  }
}

module.exports = async (users, type, chemin) => {
  if (chemin !== undefined) {
    // console.log("users: " + users)
    if (type === 'Grille') {
      const nbCol = 4
      const allUsers = users.map(user => {
        return {
          table: {
            dontBreakRows: true,
            widths: ['*'],
            body: [
              [{
                image: user.photo,
                width: 75,
                height: 75,
                alignment: 'center'
              }],
              [{
                text: user.name,
                alignment: 'center'
              }]
            ]
          },
          layout: 'noBorders'
        }
      });
      let nb = 0
      let body = []
      let row = []
      allUsers.forEach((user) => {
        if (nb < nbCol) row.push(user)
        else {
          body.push(row)
          row = []
          row.push(user)
          nb = 0
        }
        nb++
      })
      if (row.length !== 0) {
        for (let i = row.length; i < nbCol; i++) {
          row.push('')
        }
        body.push(row)
      }
      const gen = (nb, sym) => {
        let arr = []
        for (let i = 0; i< nb; i++)
        {
          arr.push(sym)
        }
        return arr
      }

      var docDefinition = {
        version: '1.3',
        defaultStyle: {
          font: 'Roboto'
        },
        header: {
          text: 'Liste Membre',
          alignment: 'center'
        },
        content: [{
          table: {
            widths: gen(nbCol, '*'),
            heights: 120,
            body: body
          }
        }]
      };
    } else if (type = "Liste") {
      const body = users.map(user => [{
        table: {
          widths: ['*'],
          body: [
            [{
              image: user.photo,
              width: 75,
              height: 75,
              alignment: 'center'
            }],
            [{
              text: user.name,
              alignment: 'center'
            }]
          ]
        },
        layout: 'noBorders'
      },
       user.comment]);
      var docDefinition = {
        version: '1.3',
        defaultStyle: {
          font: 'Roboto'
        },
        header: {
          text: 'Liste Membre',
          alignment: 'center'
        },
        content: [{
          table: {
            widths: [120, '*'],
            dontBreakRows: true,
            body: body
          }
        }]
      };
    }
    var printer = new pdfPrinter(fonts)
    var pdfDoc = printer.createPdfKitDocument(docDefinition)
    pdfDoc.pipe(fs.createWriteStream(chemin));
    return pdfDoc.end();
  }
}