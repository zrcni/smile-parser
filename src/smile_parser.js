const emojis = require("./minifiedEmoji.json")
const regex = new RegExp(/:([a-zA-Z1-9+_-]*?):/)
const toneRegex = new RegExp(/:(.*?)::(skin-tone-\d*):/)
const emojiRegex = new RegExp(
  /(\B|^)((:\)|:\/|:\(|:'\(|:\||;\))\B|(:D|:P|:o)\b)/
)

const emojiMap = {}

for (const emoji of emojis) {
  if (emoji.short_names) {
    for (const short_name of emoji.short_names) {
      emojiMap[`:${short_name}:`] = emoji
    }
  }

  if (emoji.texts) {
    for (const text of emoji.texts) {
      emojiMap[text] = emoji
    }
  }
}

export const smileParse = (str, options) => {
  let emoji

  // Figure-out :) :( etc emojis
  while ((emoji = emojiRegex.exec(str)) !== null) {
    const emoticon = emojiMap[`${emoji[0]}`]

    str = str.replace(
      emoji[0],
      `<img ${options.styles ? `style="${options.styles}"` : ""} src="${
        options.url
      }${emoticon.image}" alt="${emoticon.short_names[0]}" />`
    )
  }

  //  Figure out skin-tone emojis
  while ((emoji = toneRegex.exec(str)) !== null) {
    const firstPart = emojiMap[`:${emoji[1]}:`]
    const secondPart = emojiMap[`:${emoji[2]}:`]

    let printImage
    try {
      if (secondPart.image.length) {
        printImage = `${firstPart.image.split(".")[0]}-${secondPart.image}`
      } else {
        printImage = `${firstPart.image}`
      }
      str = str.replace(
        emoji[0],
        `<img ${options.styles ? `style="${options.styles}"` : ""} src="${
          options.url
        }${printImage}" alt="${emoji[1]}-${emoji[2]}" />`
      )
    } catch (e) {
      str = str.replace(
        emoji[0],
        `<img ${options.styles ? `style="${options.styles}"` : ""} src="${
          options.url
        }${firstPart.image}" alt="${emoji[1]}" />`
      )
    }
  }

  //  Figure-out emojis
  while ((emoji = regex.exec(str)) !== null) {
    let emoticon = emojiMap[`:${emoji[1]}:`]
    try {
      str = str.replace(
        emoji[0],
        `<img ${options.styles ? `style="${options.styles}"` : ""} src="${
          options.url
        }${emoticon.image}" alt="${emoji[1]}" />`
      )
    } catch (e) {
      str = str.replace(emoji[0], emoji[1])
    }
  }
  return str
}

export default {
  smileParse,
}
