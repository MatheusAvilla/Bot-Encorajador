const Discord = require("discord.js")
const fetch = require("node-fetch")
const keepAlive = require("./server")

const Database = require("@replit/database")

const db = new Database()

const client = new Discord.Client()

const sadWords = ["triste", "depressivo", "infeliz", "irritado", "chateado", "bolado", "desencantado", "humilhado", "maltratado", "maltratem", "bullying", "sad", "solitario", "sozinho", "lonely", "ovochora", "OVOCHORA", "ovo chora", "OVO CHORA", "morrer", "MORRER", "magoado", "magoada"]

const starterEncouragments = [
  "Anime-se!", 
  "Aguenta aí irmão",
  "Você é incrível mano!",
  "Voce é o brabo de Sorocaba mermão",
  "Você conquistou a confiança do Nicolas cara.",
  "André reconheceu seu esforço.",
  "O P4ulo admira seu jeito de ser.",
  "A Miri não te achou cringe!",
  "O Chimente pararia de assistir ReZero para jogar com você!",
  "Não chore my little friend...",
  "HP Lovecraft com certeza incluiria você em uma das histórias dele..."
]

db.get("encouragments").then(encouragments => {
  if(!encouragments || encouragments.length < 1) {
    db.set("encouragments", starterEncouragments)
  }
})

db.get("responding").then(value => {
  if(value == null) {
    db.set("responding", true)
  }
})

function updateEncouragments(encouragingMessage) {
  db.get("encouragments").then(encouragments => {
    encouragments.push([encouragingMessage])
    db.set("encouragments", encouragments)
  })
}

function deleteEncouragment(inxed) {
    db.get("encouragments").then(encouragments => {
    if(encouragments.length > index) {
      encouragments.splice(index, 1)
      db.set("encouragments", encouragments)
    }

  })
}

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
  })
  .then(data => {
    return data[0]["q"] + " -" + data[0]["a"]
  })
}

client.on("ready", () => {
  console.log(`Logado como ${client.user.tag}!`)
})

client.on("guildMemberAdd", member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log')
  if(!channel) return
  channel.send(`Bem-vindo ao servidor, ${member}`)
})

client.on("message", msg => {
  if(msg.author.bot) return 

  if (msg.content === "$inspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }

  db.get("responding").then(responding => {
    if(responding && sadWords.some(word => msg.content.includes(word))) {
      db.get("encouragments").then(encouragments => {
        const encouragment = encouragments[Math.floor(Math.random() * encouragments.length)]
        msg.reply(encouragment)
      })
    }
  })

  if(msg.content === "qual é meu avatar") {
    msg.reply(msg.author.displayAvatarURL())
  }



  if(msg.content.startsWith("$novo")) {
    encouragingMessage = msg.content.split("$novo ")[1]
    updateEncouragments(encouragingMessage)
    msg.channel.send("Nova mensagem motivacional adicionada.")
  }

  if(msg.content.startsWith("$del")) {
    index = parseInt(msg.content.split("$del ")[1])
    deleteEncouragment(index)
    msg.channel.send("Mensagem motivacional deletada.")
}

  if(msg.content.startsWith("$lista")) {
    db.get("encouragments").then(encouragments => {
      msg.channel.send(encouragments)
    })
  }

  if(msg.content.startsWith("$resposta")) {
    value = msg.content.split("$resposta ")[1]

    if(value.toLowerCase() == "true") {
      db.set("responding", true)
      msg.channel.send("O modo resposta está ligado.")
    }
    else {
      db.set("responding", false)
      msg.channel.send("O modo resposta está desligado.")
    }
  }

})

keepAlive()

client.login(process.env.TOKEN)