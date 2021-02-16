const fs = require("fs")

fs.readFile("./emojidata/emoji.json", "utf8", (err, data) => {
  if (err) throw err
  const emojiArray = []
  const emojis = JSON.parse(data)
  for (const emoji of emojis) {
    const newEmoji = {
      short_name: emoji.short_name,
      image: emoji.image,
    }
    if (emoji.text) {
      newEmoji.text = emoji.text
    }
    if (emoji.texts) {
      newEmoji.texts = emoji.texts
    }
    if (emoji.short_names) {
      newEmoji.short_names = emoji.short_names
    }
    emojiArray.push(newEmoji)
  }
  fs.writeFileSync(
    `./src/minifiedEmoji.json`,
    JSON.stringify(emojiArray),
    (err) => {
      if (err) throw err
    }
  )
})
